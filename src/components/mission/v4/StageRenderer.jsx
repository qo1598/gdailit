import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Lightbulb, X } from 'lucide-react';
import TaskStepRenderer from './TaskStepRenderer';
import { deriveCases } from './deriveCases';
import DictionaryText from '../../DictionaryText';
import DictionaryModal from '../../DictionaryModal';
import {
  StartDetectiveIcon,
  IntroThinkingIcon,
  IntroDiscoverIcon,
  IntroDetectiveIcon
} from './MissionIcons';

const INTRO_ICONS = [IntroThinkingIcon, IntroDiscoverIcon, IntroDetectiveIcon];

// V4: 시나리오 헤더 — 학생 역할/목표/산출물 명시
const ScenarioHeader = ({ scenario, domainColor }) => {
  if (!scenario) return null;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: 'clamp(10px, 3vw, 12px) clamp(12px, 3vw, 14px)',
      borderRadius: '14px',
      background: `linear-gradient(135deg, ${domainColor}14, ${domainColor}06)`,
      border: `1.5px solid ${domainColor}33`,
      marginBottom: 'clamp(10px, 3vw, 14px)'
    }}>
      <div style={{
        flexShrink: 0,
        padding: '4px 10px',
        borderRadius: '999px',
        background: domainColor,
        color: '#fff',
        fontSize: 'clamp(0.7rem, 2vw, 0.78rem)',
        fontWeight: 900,
        whiteSpace: 'nowrap'
      }}>
        {scenario.role}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 'clamp(0.8rem, 2.4vw, 0.88rem)', fontWeight: 800, color: '#1e293b', lineHeight: 1.35, wordBreak: 'keep-all' }}>
          {scenario.goal}
        </div>
        {scenario.artifactType && (
          <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.76rem)', color: '#64748b', marginTop: '2px', fontWeight: 700 }}>
            산출물: {scenario.artifactType}
          </div>
        )}
      </div>
    </div>
  );
};

// V4: artifact.template의 {stepN} 토큰을 답안으로 채워 미리보기 문장 생성
function renderArtifactPreview(template, answers, steps) {
  if (!template) return null;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    // 하위 필드 토큰: {stepN_person} / {stepN_reasons} (person_reason_select)
    //              / {stepN_proposals} (case_judge_carousel: 사례별 서술을 문장형으로 연결)
    const subField = key.match(/^(step\d+)_(person|reasons|proposals)$/);
    if (subField) {
      const [, stepKey, field] = subField;
      const stepAns = answers[stepKey];
      const step = steps?.find(s => s.id === stepKey);
      if (!stepAns || !step) return '___';
      if (step.uiMode === 'person_reason_select') {
        if (field === 'person') {
          const p = (step.personOptions || []).find(o => o.id === stepAns.person);
          return p?.description || p?.label || '___';
        }
        if (field === 'reasons') {
          const labels = (step.reasonOptions || [])
            .filter(r => (stepAns.reasons || []).includes(r.id))
            .map(r => r.label);
          return labels.join(', ') || '___';
        }
      }
      if (field === 'proposals' && step.uiMode === 'case_judge_carousel') {
        const parts = (step.cases || []).map(c => {
          const ca = stepAns[c.id] || {};
          const txt = (ca.text || '').trim().replace(/[.。!?！？]\s*$/u, '');
          if (!txt) return null;
          const raw = (c.title || c.id).split('·').pop().trim();
          return `${raw}의 경우 ${txt}`;
        }).filter(Boolean);
        return parts.length ? parts.join(', ') : '___';
      }
      return '___';
    }
    // prompt_builder slots → 완성 문장 치환: {stepN_prompt}
    const promptSlot = key.match(/^(step\d+)_prompt$/);
    if (promptSlot) {
      const [, stepKey] = promptSlot;
      const stepAns = answers[stepKey];
      const step = steps?.find(s => s.id === stepKey);
      if (step?.uiMode === 'prompt_builder' && step.slots && step.promptTemplate && stepAns) {
        let text = step.promptTemplate;
        for (const slot of step.slots) {
          const chosen = slot.options.find(o => o.id === stepAns[slot.id]);
          text = text.replace(`{${slot.id}}`, chosen ? chosen.label : '___');
        }
        return text;
      }
      return '___';
    }
    // 제네릭 하위 필드: { [field]: string } 구조 (multi_free_text, ai_chat_turn 등)
    const genericSub = key.match(/^(step\d+)_(\w+)$/);
    if (genericSub) {
      const [, stepKey, field] = genericSub;
      const v = answers[stepKey];
      if (v && typeof v === 'object' && !Array.isArray(v) && typeof v[field] === 'string' && v[field].trim()) {
        return v[field].trim();
      }
    }
    // 계산 토큰: {stepN_<judge>_count} 또는 {stepN_non_<judge>_count}
    const computed = key.match(/^(step\d+)_(non_)?([a-zA-Z]+)_count$/);
    if (computed) {
      const [, stepKey, negate, judgeId] = computed;
      const stepAns = answers[stepKey];
      if (!stepAns || typeof stepAns !== 'object') return '0';
      const matches = (v) => {
        if (typeof v === 'string') return v === judgeId;
        if (typeof v === 'number') {
          // star_rating_carousel: 값이 양수 별점이면 'rated'에 대응
          if (judgeId === 'rated') return v > 0;
          return false;
        }
        if (v && typeof v === 'object') {
          if (v.judge === judgeId || v.judgment === judgeId || v.fairness === judgeId) return true;
          // bubble_select_correct: { selected: true } → 'strange'/'selected' 에 대응
          if ((judgeId === 'strange' || judgeId === 'selected') && v.selected === true) return true;
          // yesno_quiz: [{ question_id, answer }] → 'answered'에 대응
          if (judgeId === 'answered' && (v.answer === true || v.answer === false)) return true;
          // case_carousel_reason: { reasons: [...] } → 'case'에 대응 (이유 1개 이상 선택된 사례)
          if (judgeId === 'case' && Array.isArray(v.reasons) && v.reasons.length > 0) return true;
        }
        return false;
      };
      const exists = (v) => {
        if (v == null || v === '') return false;
        if (typeof v === 'string') return true;
        if (typeof v === 'number') return v > 0;
        if (typeof v === 'object') {
          if (v.judge != null || v.judgment != null || v.fairness != null || v.selected === true) return true;
          if (v.answer === true || v.answer === false) return true;
          if (Array.isArray(v.reasons) && v.reasons.length > 0) return true;
          if (typeof v.text === 'string' && v.text.trim()) return true;
        }
        return false;
      };
      const count = Object.values(stepAns).filter(v => negate ? (exists(v) && !matches(v)) : matches(v)).length;
      return String(count);
    }
    const val = answers[key];
    if (val == null || val === '') return `___`;
    const step = steps?.find(s => s.id === key);

    // 1) 단일 선택(string id) — 옵션 라벨로 치환 우선
    if (typeof val === 'string') {
      if (step?.options) {
        const opt = step.options.find(o => o.id === val);
        if (opt) return opt.label;
      }
      if (val === 'other') {
        const otherText = answers[`${key}_other_text`];
        if (otherText?.trim()) return otherText.trim();
      }
      return val.trim() || '___';
    }

    // 2) 다중 선택(string[])
    if (Array.isArray(val)) {
      if (step?.options) {
        const labels = step.options.filter(o => val.includes(o.id)).map(o => o.label);
        return labels.join(', ') || '___';
      }
      if (step?.chips) {
        const labels = step.chips.filter(c => val.includes(c.id)).map(c => c.label);
        return labels.join(', ') || '___';
      }
      return val.join(', ');
    }

    // 3) 객체 — photo_or_card_select / per_case_judge 등
    if (typeof val === 'object') {
      // defect_select: { markers: [...] } → 오류 유형 나열
      if (step?.uiMode === 'defect_select' && val.markers) {
        const cats = step.defectCategories || [];
        const labels = val.markers.map(m => cats.find(c => c.id === m.category)?.label).filter(Boolean);
        return labels.length > 0 ? labels.join(', ') : `${val.markers.length}개 표시`;
      }
      // defect_reason: { reason_0, reason_1, ... } → 이유 나열
      if (step?.uiMode === 'defect_reason') {
        const reasons = Object.entries(val).filter(([k, v]) => k.startsWith('reason_') && v?.trim()).map(([, v]) => v);
        return reasons.length > 0 ? reasons.join(' / ') : '___';
      }
      // prompt_single_input: { _revisedPrompt, _generatedImage } → 프롬프트 전체 표시
      if (step?.uiMode === 'prompt_single_input' && val._revisedPrompt) {
        return `"${val._revisedPrompt}"`;
      }
      // prompt_with_conditions: { _revisedPrompt, _conditions, _generatedImage }
      if (step?.uiMode === 'prompt_with_conditions' && val._revisedPrompt) {
        return `"${val._revisedPrompt}"`;
      }
      // person_reason_select: { person, reasons } → "설명 (이유1, 이유2)"
      if (step?.uiMode === 'person_reason_select') {
        const p = (step.personOptions || []).find(o => o.id === val.person);
        if (!p) return '___';
        const reasonLabels = (step.reasonOptions || [])
          .filter(r => (val.reasons || []).includes(r.id))
          .map(r => r.label);
        const who = p.description || p.label;
        return reasonLabels.length ? `${who} (${reasonLabels.join(', ')})` : who;
      }
      // case_judge_carousel: 사례별 응답 → 사례 제목: 라벨 형태로 요약
      if (step?.uiMode === 'case_judge_carousel') {
        const cases = step.cases || [];
        const parts = cases.map(c => {
          const ca = val[c.id] || {};
          const short = (c.title || c.id).split('·')[0].trim();
          if (step.judgmentOptions && ca.judgment) {
            const lbl = step.judgmentOptions.find(o => o.id === ca.judgment)?.label;
            const extra = (step.reasonOptions && ca.reasons?.length)
              ? ` · ${ca.reasons.map(rid => step.reasonOptions.find(r => r.id === rid)?.label).filter(Boolean).join(', ')}`
              : '';
            return lbl ? `${short}: ${lbl}${extra}` : null;
          }
          if (step.reasonOptions && ca.reasons?.length) {
            const labels = ca.reasons.map(rid => step.reasonOptions.find(r => r.id === rid)?.label).filter(Boolean);
            return labels.length ? `${short}: ${labels.join(', ')}` : null;
          }
          if (step.fairnessOptions && ca.fairness) {
            const lbl = step.fairnessOptions.find(o => o.id === ca.fairness)?.label;
            return lbl ? `${short}: ${lbl}` : null;
          }
          if (step.allowText && ca.text?.trim()) {
            const t = ca.text.trim();
            return `${short}: ${t.length > 24 ? t.slice(0, 24) + '…' : t}`;
          }
          return null;
        }).filter(Boolean);
        return parts.length ? parts.join(' · ') : '___';
      }
      // per_case_judge (텍스트 전용): { caseId: { text } } → "N개 사례 작성"
      if (step?.uiMode === 'per_case_judge' && step?.allowText && !step?.judgmentOptions) {
        const count = Object.values(val).filter(v => v?.text?.trim()).length;
        return count ? `${count}개 사례에 개선 제안을 작성했고,` : '___';
      }
      // per_case_judge: { caseId: { judgment, reasons } } → "X개 붙임, Y개 확인 후" 형태로 요약
      if ((step?.uiMode === 'per_case_judge' || step?.uiMode === 'card_drop_board') && step?.judgmentOptions) {
        const counts = {};
        Object.values(val).forEach(v => {
          const j = v?.judgment;
          if (j) counts[j] = (counts[j] || 0) + 1;
        });
        const parts = step.judgmentOptions
          .filter(opt => counts[opt.id])
          .map(opt => `${counts[opt.id]}개 ${opt.label}`);
        if (parts.length) return parts.join(', ');
        return '___';
      }
      if (val.value && typeof val.value === 'string') {
        const card = step?.cardOptions?.find(c => c.id === val.value);
        if (card) return card.label;
        if (val.type === 'photo') return '내가 찍은 사진';
        return val.value;
      }
      return '___';
    }

    return String(val);
  });
}

/**
 * StageRenderer - Renders the content for each stage.
 * Stages: start | intro | core | task | submit | complete
 */
const StageRenderer = ({
  stage,
  mission,
  gradeSpec,
  stepIndex,
  slideIndex,
  answers,
  setAnswers,
  uiState,
  onStart,
  onHintUsed
}) => {
  const navigate = useNavigate();
  const currentStep = gradeSpec.steps?.[stepIndex];
  const domainColor = `var(--v3-color-${mission.meta.domain.toLowerCase()})`;

  const [vocabModal, setVocabModal] = useState({ open: false, word: '', definition: '' });
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => { setHintOpen(false); }, [stepIndex]);

  const openVocab = (word, definition) => setVocabModal({ open: true, word, definition });
  const closeVocab = () => setVocabModal({ open: false, word: '', definition: '' });

  // ─── START ────────────────────────────────────────────────────
  if (stage === 'start') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        textAlign: 'center',
        padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 32px)',
        gap: 'clamp(20px, 5vw, 32px)'
      }}>
        <StartDetectiveIcon size={Math.min(120, window.innerWidth * 0.28)} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px' }}>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 5.5vw, 2rem)',
            fontWeight: 900,
            color: '#1e293b',
            lineHeight: 1.15,
            margin: 0
          }}>
            {mission.meta.title}
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.125rem)',
            color: '#64748b',
            lineHeight: 1.6,
            margin: 0
          }}>
            {gradeSpec.description}
          </p>
        </div>

        {/* 버튼: flex: none 로 flex-grow 방지 */}
        <button
          onClick={onStart}
          style={{
            flex: 'none',
            backgroundColor: domainColor,
            color: 'white',
            width: '100%',
            maxWidth: 'clamp(200px, 60vw, 280px)',
            padding: 'clamp(16px, 4vw, 20px) 32px',
            fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)',
            fontWeight: 900,
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            transition: 'transform 0.1s ease',
            fontFamily: 'inherit'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          시작하기
        </button>
      </div>
    );
  }

  // ─── INTRO ────────────────────────────────────────────────────
  if (stage === 'intro') {
    const slide = gradeSpec.intro[slideIndex];
    const IntroIcon = INTRO_ICONS[slideIndex % INTRO_ICONS.length];
    const iconSize = Math.min(96, window.innerWidth * 0.22);

    return (
      <div
        key={slideIndex}
        className="animate-slide-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          padding: 'clamp(16px, 5vw, 32px) 0',
          gap: 'clamp(20px, 5vw, 32px)'
        }}
      >
        <IntroIcon size={iconSize} />

        <div className="v3-card" style={{ textAlign: 'center', padding: 'clamp(20px, 5vw, 28px) clamp(16px, 4vw, 24px)', width: '100%' }}>
          {slide.text.split('\n').map((line, i, arr) => (
            <p
              key={i}
              style={{
                fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
                color: '#1e293b',
                lineHeight: 1.7,
                margin: 0,
                marginBottom: i < arr.length - 1 ? '10px' : 0,
                wordBreak: 'keep-all'
              }}
            >
              <DictionaryText text={line} onWordClick={openVocab} />
            </p>
          ))}
        </div>

        {/* Dot indicator */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {gradeSpec.intro.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === slideIndex ? '28px' : '10px',
                height: '10px',
                borderRadius: '999px',
                backgroundColor: i === slideIndex ? domainColor : '#cbd5e1',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        <DictionaryModal
          isOpen={vocabModal.open}
          word={vocabModal.word}
          definition={vocabModal.definition}
          onClose={closeVocab}
        />
      </div>
    );
  }

  // ─── CORE ─────────────────────────────────────────────────────
  if (stage === 'core') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 2px 4px' }}>
          <div style={{ width: '4px', height: '20px', borderRadius: '2px', backgroundColor: domainColor, flexShrink: 0 }} />
          <h2 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 900, color: '#1e293b', margin: 0 }}>
            함께 생각해보아요
          </h2>
        </div>
        {gradeSpec.coreUnderstanding.map((item, idx) => (
          <div key={item.id} className="v3-card animate-slide-up" style={{ animationDelay: `${idx * 120}ms`, padding: 'clamp(16px, 4vw, 20px)', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: 'clamp(22px, 5vw, 26px)',
                height: 'clamp(22px, 5vw, 26px)',
                borderRadius: '50%',
                backgroundColor: domainColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                fontWeight: 900,
                color: 'white',
                flexShrink: 0
              }}>
                {item.id}
              </div>
              <div style={{
                fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
                fontWeight: 900,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                질문 {item.id}
              </div>
            </div>
            <div style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.05rem)',
              fontWeight: 800,
              color: '#1e293b',
              marginBottom: '10px',
              lineHeight: 1.45,
              wordBreak: 'keep-all'
            }}>
              <DictionaryText text={item.question} onWordClick={openVocab} />
            </div>
            <div style={{
              padding: 'clamp(8px, 2vw, 10px) clamp(10px, 3vw, 14px)',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              fontSize: 'clamp(0.875rem, 2.5vw, 0.95rem)',
              color: '#475569',
              lineHeight: 1.55,
              wordBreak: 'keep-all'
            }}>
              <DictionaryText text={item.answer} onWordClick={openVocab} />
            </div>
          </div>
        ))}
        <DictionaryModal
          isOpen={vocabModal.open}
          word={vocabModal.word}
          definition={vocabModal.definition}
          onClose={closeVocab}
        />
      </div>
    );
  }

  // ─── SCENARIO ─────────────────────────────────────────────────
  if (stage === 'scenario') {
    const sc = gradeSpec.scenario || {};
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3.5vw, 18px)', padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 2px' }}>
          <div style={{ width: '4px', height: '20px', borderRadius: '2px', backgroundColor: domainColor, flexShrink: 0 }} />
          <h2 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 900, color: '#1e293b', margin: 0 }}>
            미션 상황 살펴보기
          </h2>
        </div>

        {sc.image && (
          <div style={{
            width: '100%',
            borderRadius: '18px',
            overflow: 'hidden',
            border: `1.5px solid ${domainColor}33`,
            boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
            background: '#fff'
          }}>
            <img
              src={sc.image}
              alt={sc.context || '미션 상황'}
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>
        )}

        <div className="v3-card" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(10px, 2.5vw, 12px)',
          padding: 'clamp(16px, 4vw, 20px)'
        }}>
          {sc.role && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '999px',
                background: domainColor,
                color: '#fff',
                fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
                fontWeight: 900
              }}>
                내 역할: {sc.role}
              </span>
              {sc.artifactType && (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: `${domainColor}1a`,
                  color: domainColor,
                  fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
                  fontWeight: 900
                }}>
                  완성할 것: {sc.artifactType}
                </span>
              )}
            </div>
          )}

          {sc.goal && (
            <div>
              <div style={{
                fontSize: 'clamp(0.68rem, 2vw, 0.75rem)',
                fontWeight: 900,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}>
                목표
              </div>
              <div style={{
                fontSize: 'clamp(0.98rem, 3vw, 1.1rem)',
                fontWeight: 800,
                color: '#1e293b',
                lineHeight: 1.5,
                wordBreak: 'keep-all'
              }}>
                <DictionaryText text={sc.goal} onWordClick={openVocab} />
              </div>
            </div>
          )}

          {sc.context && (
            <div>
              <div style={{
                fontSize: 'clamp(0.68rem, 2vw, 0.75rem)',
                fontWeight: 900,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '4px'
              }}>
                상황
              </div>
              <div style={{
                padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 14px)',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
                color: '#475569',
                lineHeight: 1.65,
                wordBreak: 'keep-all'
              }}>
                <DictionaryText text={sc.context} onWordClick={openVocab} />
              </div>
            </div>
          )}
        </div>

        <DictionaryModal
          isOpen={vocabModal.open}
          word={vocabModal.word}
          definition={vocabModal.definition}
          onClose={closeVocab}
        />
      </div>
    );
  }

  // ─── TASK ──────────────────────────────────────────────────────
  if (stage === 'task') {
    const hint = currentStep?.hint;
    const handleHintClick = () => {
      setHintOpen(true);
      if (onHintUsed && currentStep?.id) onHintUsed(currentStep.id);
    };
    return (
      <>
        <ScenarioHeader scenario={gradeSpec.scenario} domainColor={domainColor} />
        <TaskStepRenderer
          step={currentStep}
          gradeSpec={gradeSpec}
          answers={answers}
          setAnswers={setAnswers}
          domainColor={domainColor}
          hint={hint}
          onHintClick={handleHintClick}
        />

        {/* Hint Modal */}
        {hint && hintOpen && (
          <div
            onClick={() => setHintOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1100, padding: '20px',
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white',
                width: '100%', maxWidth: '360px',
                borderRadius: '28px',
                padding: '28px 24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '3px solid #fde047',
                textAlign: 'center',
                animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: '#fef9c3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px'
              }}>
                <Lightbulb size={28} color="#ca8a04" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', margin: '0 0 14px' }}>
                힌트
              </h3>
              <div style={{
                background: '#fefce8',
                padding: '16px',
                borderRadius: '16px',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                color: '#713f12',
                lineHeight: 1.65,
                textAlign: 'left',
                wordBreak: 'keep-all',
                marginBottom: '18px'
              }}>
                <DictionaryText text={hint} onWordClick={(w, d) => { setHintOpen(false); openVocab(w, d); }} />
              </div>
              <button
                onClick={() => setHintOpen(false)}
                style={{
                  background: '#fde047',
                  color: '#713f12',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 0 #ca8a04'
                }}
              >
                확인했어요!
              </button>
            </div>
          </div>
        )}

        {/* Vocab Modal */}
        <DictionaryModal
          isOpen={vocabModal.open}
          word={vocabModal.word}
          definition={vocabModal.definition}
          onClose={closeVocab}
        />
      </>
    );
  }

  // ─── SUBMIT ────────────────────────────────────────────────────
  if (stage === 'submit') {
    const { summaryLabels } = gradeSpec.submit;

    const getAnswerDisplay = (step) => {
      const ans = answers[step.id];
      // 뷰 전용 모드: 응답이 없어도 살펴본 것으로 간주
      if (step.uiMode === 'case_view_carousel') {
        return `${(step.cases || []).length}개 사례 살펴봄`;
      }
      if (step.uiMode === 'case_info_cards') {
        return `${(step.cases || []).length}개 사례 살펴봄`;
      }
      if (step.uiMode === 'image_view') {
        return '그림 관찰 완료';
      }
      if (!ans) return '—';

      if (step.uiMode === 'choice_cards') {
        const selected = (step.options || []).filter(o => (ans || []).includes(o.id));
        return selected.map(o => o.label).join(', ') || '—';
      }
      if (step.uiMode === 'single_select_buttons') {
        if (ans === 'other') {
          const text = answers[`${step.id}_other_text`];
          return text ? `기타: ${text}` : '기타';
        }
        const found = (step.options || []).find(o => o.id === ans);
        return found ? found.label : '—';
      }
      if (step.uiMode === 'photo_or_card_select') {
        if (ans.type === 'photo') return '내가 찍은 사진';
        if (ans.type === 'card') {
          const card = (step.cardOptions || []).find(c => c.id === ans.value);
          return card ? card.label : '—';
        }
        return '—';
      }
      if (step.uiMode === 'image_view') {
        return '그림 관찰 완료';
      }
      if (step.uiMode === 'defect_select') {
        const markers = ans?.markers || (Array.isArray(ans) ? ans : []);
        if (markers.length === 0) return '—';
        const cats = step.defectCategories || step.defectTypes || [];
        const labels = markers.map(m => {
          const cat = cats.find(c => c.id === (m.category || m));
          return cat?.label;
        }).filter(Boolean);
        return labels.length > 0 ? labels.join(', ') : `${markers.length}개 선택`;
      }
      if (step.uiMode === 'defect_reason') {
        if (!ans || typeof ans !== 'object') return '—';
        const reasons = Object.entries(ans).filter(([k, v]) => k.startsWith('reason_') && v?.trim()).map(([, v]) => v.length > 20 ? v.slice(0, 20) + '…' : v);
        return reasons.length > 0 ? reasons.join(' / ') : '—';
      }
      if (step.uiMode === 'image_compare_ab') {
        if (!ans?.image) return '—';
        const imgLabel = ans.image === 'A' ? step.imageA?.label : step.imageB?.label;
        const reasons = (step.reasonOptions || []).filter(r => (ans.reasons || []).includes(r.id));
        const reasonText = reasons.map(r => r.label).join(', ');
        return reasonText ? `${imgLabel} · ${reasonText}` : imgLabel || '—';
      }
      if (step.uiMode === 'task_and_prompt') {
        if (!ans?.task_type) return '—';
        const taskMap = { poster: '환경 보호 포스터', event_notice: '학교 행사 안내문', book_intro: '책 소개 글' };
        return `${taskMap[ans.task_type] || ans.task_type} · "${ans.prompt_initial || ''}"`;
      }
      if (step.uiMode === 'prompt_with_conditions') {
        const prompt = ans?._revisedPrompt || ans?.prompt_detailed || '';
        if (!prompt.trim()) return '—';
        return `"${prompt}"`;
      }
      if (step.uiMode === 'text_compare_ab') {
        if (!ans?.choice) return '—';
        const choiceLabel = ans.choice === 'A' ? step.labelA : step.labelB;
        const reasons = (step.reasonOptions || []).filter(r => (ans.reasons || []).includes(r.id));
        return reasons.length > 0 ? `${choiceLabel} · ${reasons.map(r => r.label).join(', ')}` : choiceLabel;
      }
      if (step.uiMode === 'prompt_builder') {
        if (step.slots && step.promptTemplate) {
          let text = step.promptTemplate;
          for (const slot of step.slots) {
            const chosen = slot.options.find(o => o.id === ans[slot.id]);
            text = text.replace(`{${slot.id}}`, chosen ? chosen.label : '___');
          }
          return `"${text}"`;
        }
        if (!ans?.full_text) return '—';
        return `"${ans.full_text}"`;
      }
      if (step.uiMode === 'prompt_single_input') {
        const prompt = ans?._revisedPrompt || ans?.prompt_revised || '';
        if (!prompt.trim()) return '—';
        return `"${prompt}"`;
      }
      if (step.uiMode === 'result_compare_final') {
        if (!ans?.best) return '—';
        const bestMap = { initial: '처음 결과', detailed: '두 번째 결과', revised: '내가 고친 결과' };
        return bestMap[ans.best] || ans.best;
      }
      if (step.uiMode === 'ds_training_cards') {
        return ans?.highlighted?.length ? ans.highlighted.join(', ') : '—';
      }
      if (step.uiMode === 'ds_rule_builder' || step.uiMode === 'ds_rule_revise') {
        if (!ans?.conditions?.length) return '—';
        return `${ans.conditions.join(' OR ')} → ${step.labelNames?.[ans.target_label] || ans.target_label}`;
      }
      if (step.uiMode === 'ds_classify') {
        const total = (step.newCards || []).length;
        const done = (step.newCards || []).filter(c => ans?.[c.id]).length;
        return `${done}/${total}개 분류`;
      }
      if (step.uiMode === 'judge_qa_carousel') {
        const cards = step.qaCards || [];
        const strangeCards = cards.filter(c => ans[c.id]?.judge === 'strange');
        if (strangeCards.length === 0) return `이상한 답 없음 (${cards.length}개 확인)`;
        const reasons = strangeCards.map(c => {
          const r = (step.reasonOptions || []).find(o => o.id === ans[c.id]?.reason);
          return r ? r.label : null;
        }).filter(Boolean);
        const uniqueReasons = [...new Set(reasons)];
        return `이상한 답 ${strangeCards.length}개 · ${uniqueReasons.join(', ') || '이유 선택'}`;
      }
      if (step.uiMode === 'tag_select') {
        const tag = (step.tags || []).find(t => t.id === ans.tag);
        const parts = [tag?.label, ans.text].filter(Boolean);
        return parts.join(' · ') || '—';
      }
      if (step.uiMode === 'free_text') {
        if (!ans || !ans.trim()) return '—';
        return ans.length > 40 ? ans.slice(0, 40) + '…' : ans;
      }
      if (step.uiMode === 'single_select_cards') {
        const opt = (step.options || []).find(o => o.id === ans);
        return opt?.label || ans || '—';
      }
      if (step.uiMode === 'yesno_quiz') {
        if (!ans || !ans.length) return '—';
        const yesCount = ans.filter(r => r.answer === true).length;
        return `예 ${yesCount}개 / 아니오 ${ans.length - yesCount}개`;
      }
      if (step.uiMode === 'recommendation_reveal') {
        if (!ans) return '—';
        const ITEM_LABEL = {
          rabbit: '토끼', dog: '강아지', cat: '고양이', dolphin: '돌고래', eagle: '독수리',
          penguin: '펭귄', tiger: '호랑이', giraffe: '기린',
          cookie: '쿠키', pizza: '피자', fruit_skewer: '과일꼬치', gimbap: '김밥',
          icecream: '아이스크림', sandwich: '샌드위치', pancake: '팬케이크', riceball: '주먹밥',
          sports_car: '스포츠카', train: '기차', airplane: '비행기', ship: '배',
          fire_truck: '소방차', police_car: '경찰차', excavator: '굴착기', bus: '버스'
        };
        return ITEM_LABEL[ans] || ans;
      }
      if (step.uiMode === 'reason_reflect') {
        if (!ans) return '—';
        const tags = step.reasonTagsByTopic ? Object.values(step.reasonTagsByTopic).flat() : [];
        const selected = (ans.reason_selected || []).map(id => tags.find(t => t.id === id)?.label || id);
        const expr = ans.reason_expression?.trim();
        const parts = selected.length > 0 ? [selected.join(', ')] : [];
        if (expr) parts.push(`"${expr.length > 20 ? expr.slice(0, 20) + '…' : expr}"`);
        return parts.join(' · ') || '—';
      }
      if (step.uiMode === 'ds_result_check') {
        if (ans?.correct_count === undefined) return '—';
        return `${ans.correct_count}/${(step.newCards || []).length}개 정답`;
      }
      if (step.uiMode === 'ds_rule_save') {
        if (!ans?.best_rule) return '—';
        return `규칙 ${ans.best_rule.toUpperCase()} 저장`;
      }
      // ─── E-4-L uiModes ───
      if (step.uiMode === 'case_view_carousel') {
        const count = (step.cases || []).length;
        return `${count}개 사례 살펴봄`;
      }
      if (step.uiMode === 'person_reason_select') {
        if (!ans?.person) return '—';
        const personOpt = (step.personOptions || []).find(p => p.id === ans.person);
        const personText = personOpt?.description || personOpt?.label || ans.person;
        const reasons = (step.reasonOptions || []).filter(r => (ans.reasons || []).includes(r.id));
        const reasonText = reasons.map(r => r.label).join(', ');
        return reasonText ? `${personText} · ${reasonText}` : personText;
      }
      // ─── SJ uiModes ───
      if (step.uiMode === 'classify_cards' || step.uiMode === 'classify_cards_carousel') {
        if (!ans || Object.keys(ans).length === 0) return '—';
        const groups = step.groups || [];
        const parts = groups.map(g => {
          const count = Object.values(ans).filter(v => v === g.id).length;
          return count > 0 ? `${g.label} ${count}개` : null;
        }).filter(Boolean);
        return parts.join(', ') || '—';
      }
      if (step.uiMode === 'multi_select_chips') {
        if (!ans || ans.length === 0) return '—';
        const chips = (step.chips || []).filter(c => ans.includes(c.id));
        return chips.map(c => c.label).join(', ') || '—';
      }
      if (step.uiMode === 'chat_display') {
        return ans?.confirmed ? '대화 내용 확인 완료' : '—';
      }
      if (step.uiMode === 'bubble_select_correct') {
        if (!ans) return '—';
        const selectedCount = Object.values(ans).filter(v => v.selected).length;
        return selectedCount > 0 ? `틀린 말풍선 ${selectedCount}개 찾음` : '이상한 답 없음';
      }
      if (step.uiMode === 'case_info_cards') {
        return `${(step.cases || []).length}개 사례 살펴봄`;
      }
      if (step.uiMode === 'per_case_judge' || step.uiMode === 'card_drop_board') {
        if (!ans || Object.keys(ans).length === 0) return '—';
        const pcjCases = deriveCases(step, gradeSpec, answers);
        if (!step.judgmentOptions && step.reasonOptions) {
          const count = pcjCases.filter(c => (ans[c.id]?.reasons?.length > 0)).length;
          return count > 0 ? `${count}개 사례 원인 선택` : '—';
        }
        if (!step.judgmentOptions && step.planOptions) {
          const count = pcjCases.filter(c => (ans[c.id]?.plans?.length > 0)).length;
          return count > 0 ? `${count}개 사례 개선안 선택` : '—';
        }
        const groups = step.judgmentOptions || [];
        const parts = pcjCases.map(c => {
          const ca = ans[c.id] || {};
          if (!ca.judgment) return null;
          const label = groups.find(g => g.id === ca.judgment)?.label || ca.judgment;
          return `${c.title}: ${label}`;
        }).filter(Boolean);
        return parts.join(' · ') || '—';
      }
      if (step.uiMode === 'sample_full_carousel') {
        if (!ans || Object.keys(ans).length === 0) return '—';
        const counts = { use: 0, revise: 0, verify: 0 };
        (step.samples || []).forEach(s => {
          const j = ans[s.id]?.judgment;
          if (j && counts[j] !== undefined) counts[j]++;
        });
        const parts = [];
        if (counts.use) parts.push(`수용 ${counts.use}개`);
        if (counts.revise) parts.push(`수정 ${counts.revise}개`);
        if (counts.verify) parts.push(`재검증 ${counts.verify}개`);
        return parts.join(' · ') || '—';
      }
      if (step.uiMode === 'monitor_display') {
        return ans?.confirmed ? 'AI 응답 확인 완료' : '—';
      }
      if (step.uiMode === 'per_response_judge') {
        if (!ans || Object.keys(ans).length === 0) return '—';
        const opts = step.judgmentOptions || [];
        const counts = { use: 0, revise: 0, verify: 0 };
        Object.values(ans).forEach(v => { if (counts[v] !== undefined) counts[v]++; });
        const parts = [];
        if (counts.use) parts.push(`수용 ${counts.use}개`);
        if (counts.revise) parts.push(`수정 ${counts.revise}개`);
        if (counts.verify) parts.push(`재검증 ${counts.verify}개`);
        return parts.join(' · ') || '—';
      }
      if (step.uiMode === 'filtered_reason_select') {
        if (!ans || Object.keys(ans).length === 0) return '—';
        const reasonOpts = step.reasonOptions || [];
        const parts = Object.entries(ans).map(([id, reasonId]) => {
          const sample = (step.reasonOptions ? [] : []).find(s => s.id === id);
          const label = reasonOpts.find(r => r.id === reasonId)?.label || reasonId;
          return label;
        });
        return [...new Set(parts)].join(', ') || '—';
      }
      if (step.uiMode === 'filtered_plan_text') {
        if (!ans || Object.keys(ans).length === 0) return '—';
        const count = Object.values(ans).filter(v => v?.trim()).length;
        return `${count}개 계획 작성 완료`;
      }
      if (step.uiMode === 'followup_question_carousel') {
        if (!ans || typeof ans !== 'object' || Array.isArray(ans)) return '—';
        const branch = step.branch || {};
        const sourceStep = gradeSpec?.steps?.find(s => s.id === branch.sourceStepId);
        const sourceAns = answers?.[branch.sourceStepId] || {};
        const selectedIds = (sourceStep?.aiBubbles || [])
          .filter(b => !!sourceAns[b.id]?.selected)
          .map(b => b.id);
        const count = selectedIds.filter(id => typeof ans[id] === 'string' && ans[id].trim()).length;
        return count > 0 ? `${count}개 확인 질문 작성` : '—';
      }
      // ─── E-3-M uiModes ───
      if (step.uiMode === 'clothing_grid_with_rec') {
        return ans?.confirmed ? '옷 20개 확인 완료' : '—';
      }
      if (step.uiMode === 'star_rating_carousel') {
        const ratedCount = Object.keys(ans || {}).length;
        if (ratedCount === 0) return '—';
        const avg = (Object.values(ans).reduce((a, b) => a + b, 0) / ratedCount).toFixed(1);
        return `${ratedCount}개 평가 · 평균 ${avg}점`;
      }
      if (step.uiMode === 'recommendation_grid') {
        if (!ans?.confirmed) return '—';
        const clothingItems = gradeSpec?.clothingItems || [];
        const recNames = (ans.recommendedIds || []).map(id => clothingItems.find(i => i.id === id)?.name).filter(Boolean);
        return recNames.length > 0 ? recNames.join(', ') : '추천 확인 완료';
      }
      if (step.uiMode === 'multi_free_text') {
        const qs = step.questions || [];
        const answered = qs.filter(q => ans?.[q.id]?.trim());
        if (answered.length === 0) return '—';
        const firstText = ans[answered[0].id];
        return firstText.length > 35 ? firstText.slice(0, 35) + '…' : firstText;
      }
      if (step.uiMode === 'case_carousel_reason') {
        if (!ans || typeof ans !== 'object') return '—';
        const cases = step.cases || [];
        const reasonOpts = step.reasonOptions || [];
        const parts = cases.map(c => {
          const ca = ans[c.id] || {};
          const rs = ca.reasons || [];
          if (rs.length === 0) return null;
          const caseLabel = (c.title || c.id).split(' ').slice(0, 2).join(' ');
          const labels = rs.map(rid => {
            if (rid === 'other' && ca.otherText?.trim()) {
              const t = ca.otherText.trim();
              return `기타(${t.length > 10 ? t.slice(0, 10) + '…' : t})`;
            }
            return reasonOpts.find(r => r.id === rid)?.label || rid;
          });
          return `${caseLabel}: ${labels.join(', ')}`;
        }).filter(Boolean);
        if (parts.length === 0) return '—';
        return parts.length <= 2 ? parts.join(' · ') : `${parts.length}개 사례 이유 선택`;
      }
      if (step.uiMode === 'case_judge_carousel') {
        const cases = step.cases || [];
        // 옵션이 없는 순수 보기 단계
        if (!step.judgmentOptions && !step.reasonOptions && !step.fairnessOptions && !step.allowText) {
          return `${cases.length}개 장면 살펴봄`;
        }
        if (!ans || Object.keys(ans).filter(k => k !== '_idx').length === 0) return '—';
        const parts = cases.map(c => {
          const ca = ans[c.id] || {};
          const caseLabel = c.title.replace('사례 ', '').split(' ·')[0];
          // judgmentOptions + reasonOptions 모두 있는 경우 함께 표시
          if (step.judgmentOptions) {
            const label = step.judgmentOptions.find(o => o.id === ca.judgment)?.label;
            if (!label) return null;
            const reasonPart = (step.reasonOptions && ca.reasons?.length > 0) ? ` (영향 ${ca.reasons.length}개)` : '';
            return `${caseLabel}: ${label}${reasonPart}`;
          }
          if (step.reasonOptions && ca.reasons?.length) {
            return `${caseLabel}: ${ca.reasons.length}개 선택`;
          }
          if (step.fairnessOptions) {
            const label = step.fairnessOptions.find(o => o.id === ca.fairness)?.label;
            return label ? `${caseLabel}: ${label}` : null;
          }
          if (step.allowText && ca.text?.trim()) {
            const short = ca.text.trim();
            return `${caseLabel}: ${short.length > 20 ? short.slice(0, 20) + '…' : short}`;
          }
          return null;
        }).filter(Boolean);
        return parts.join(' · ') || '—';
      }
      if (step.uiMode === 'free_text') {
        if (!ans?.trim()) return '—';
        return ans.length > 50 ? ans.slice(0, 50) + '…' : ans;
      }
      // C영역 신규
      if (step.uiMode === 'ai_option_picker') {
        if (step.selectable === false) {
          const meta = answers[step.id + '_meta'];
          const count = meta?.options?.length || 0;
          if (count === 0) return 'AI 후보 생성 전';
          const firstLine = (meta.options[0] || '').split('\n')[0].slice(0, 40);
          return `AI 줄거리 후보 ${count}개 — ${firstLine}…`;
        }
        if (typeof ans !== 'string' || !ans.trim()) return '—';
        return ans.length > 50 ? ans.slice(0, 50) + '…' : ans;
      }
      if (step.uiMode === 'option_adopt_hold') {
        if (ans?.adopt_index == null && ans?.hold_index == null) return '—';
        const parts = [];
        if (ans.adopt_index != null) parts.push(`채택 후보 ${ans.adopt_index + 1}`);
        if (ans.hold_index != null) parts.push(`보류 후보 ${ans.hold_index + 1}`);
        return parts.join(' · ') || '—';
      }
      if (step.uiMode === 'ai_chat_turn') {
        const resp = ans?.aiResponse?.trim();
        if (!resp) return '—';
        return resp.length > 50 ? resp.slice(0, 50) + '…' : resp;
      }
      if (step.uiMode === 'free_text_with_refs') {
        if (typeof ans !== 'string' || !ans.trim()) return '—';
        return ans.length > 50 ? ans.slice(0, 50) + '…' : ans;
      }
      if (step.uiMode === 'sentence_pick_with_reason') {
        const text = ans?.pickedText?.trim();
        const reason = ans?.reason?.trim();
        if (!text && !reason) return '—';
        const shortText = text ? (text.length > 30 ? text.slice(0, 30) + '…' : text) : '';
        const shortReason = reason ? (reason.length > 30 ? reason.slice(0, 30) + '…' : reason) : '';
        return shortText && shortReason ? `"${shortText}" · ${shortReason}` : (shortText || shortReason);
      }
      return '—';
    };

    const artifactText = renderArtifactPreview(gradeSpec.submit?.artifact?.template, answers, gradeSpec.steps);
    const artifactType = gradeSpec.scenario?.artifactType;
    const generatedImage = gradeSpec.steps
      ?.filter(s => s.uiMode === 'prompt_builder')
      .map(s => answers[s.id]?._generatedImage)
      .find(Boolean);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 4vw, 20px)', padding: '4px 0' }}>
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{
              width: 'clamp(52px, 13vw, 64px)',
              height: 'clamp(52px, 13vw, 64px)',
              borderRadius: '50%',
              backgroundColor: `${domainColor}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ClipboardList size={28} color={domainColor} strokeWidth={2.5} />
            </div>
          </div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4.5vw, 1.6rem)', fontWeight: 900, color: '#1e293b', margin: '0 0 4px' }}>
            미션을 제출할까요?
          </h2>
          <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: '#64748b', margin: 0 }}>
            활동한 내용을 한번 확인해보세요.
          </p>
        </div>

        {artifactText && (
          <div className="v3-card" style={{
            background: `linear-gradient(135deg, ${domainColor}10, ${domainColor}03)`,
            border: `2px solid ${domainColor}55`
          }}>
            <div style={{
              fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
              fontWeight: 900,
              color: domainColor,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '10px'
            }}>
              {artifactType ? `${artifactType} 미리보기` : '내가 만든 결과'}
            </div>
            <div style={{
              fontSize: 'clamp(1rem, 3.2vw, 1.15rem)',
              fontWeight: 800,
              color: '#1e293b',
              lineHeight: 1.55,
              wordBreak: 'keep-all'
            }}>
              {artifactText}
            </div>
            {generatedImage && (
              <img
                src={generatedImage}
                alt="AI 생성 이미지"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  marginTop: '14px',
                  aspectRatio: '1/1',
                  objectFit: 'cover'
                }}
              />
            )}
          </div>
        )}

        <div className="v3-card">
          <div style={{
            fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
            fontWeight: 900,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '14px'
          }}>
            활동 요약
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {gradeSpec.steps.map(step => (
              <div key={step.id}>
                <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
                  {summaryLabels?.[step.id] || step.title}
                </span>
                <span style={{ fontSize: 'clamp(0.95rem, 3vw, 1.05rem)', fontWeight: 800, color: '#1e293b' }}>
                  {getAnswerDisplay(step)}
                </span>
                <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginTop: '10px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── COMPLETE ──────────────────────────────────────────────────
  if (stage === 'complete') {
    const completeArtifact = renderArtifactPreview(gradeSpec.submit?.artifact?.template, answers, gradeSpec.steps);
    const completeArtifactType = gradeSpec.scenario?.artifactType;
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        textAlign: 'center',
        gap: 'clamp(18px, 5vw, 28px)',
        padding: 'clamp(32px, 8vw, 56px) clamp(16px, 5vw, 32px)'
      }}>
        <div style={{
          width: 'clamp(90px, 22vw, 120px)',
          height: 'clamp(90px, 22vw, 120px)',
          backgroundColor: `${domainColor}18`,
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 16px 40px ${domainColor}30`,
          animation: 'pulse 2s infinite'
        }}>
          <CheckCircle2
            size={Math.min(60, window.innerWidth * 0.14)}
            color={domainColor}
            strokeWidth={1.8}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '280px' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: '#1e293b', margin: 0, lineHeight: 1.2 }}>
            {gradeSpec.submit.title}
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 3vw, 1.05rem)', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            {gradeSpec.submit.message}
          </p>
        </div>
        {completeArtifact && (
          <div className="v3-card" style={{
            background: `linear-gradient(135deg, ${domainColor}10, ${domainColor}03)`,
            border: `2px solid ${domainColor}55`,
            maxWidth: '420px',
            width: '100%',
            textAlign: 'left'
          }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 900, color: domainColor,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px'
            }}>
              {completeArtifactType || '내가 만든 결과'}
            </div>
            <div style={{ fontSize: 'clamp(1rem, 3.2vw, 1.1rem)', fontWeight: 800, color: '#1e293b', lineHeight: 1.55, wordBreak: 'keep-all' }}>
              {completeArtifact}
            </div>
          </div>
        )}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: 'clamp(14px, 4vw, 18px) clamp(28px, 8vw, 40px)',
            backgroundColor: '#1e293b',
            color: 'white',
            fontWeight: 900,
            borderRadius: '18px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
            fontFamily: 'inherit'
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return null;
};

export default StageRenderer;
