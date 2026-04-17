import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Lightbulb, X } from 'lucide-react';
import TaskStepRenderer from './TaskStepRenderer';
import DictionaryText from '../../DictionaryText';
import DictionaryModal from '../../DictionaryModal';
import {
  StartDetectiveIcon,
  IntroThinkingIcon,
  IntroDiscoverIcon,
  IntroDetectiveIcon
} from './MissionIcons';

const INTRO_ICONS = [IntroThinkingIcon, IntroDiscoverIcon, IntroDetectiveIcon];

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

  // ─── TASK ──────────────────────────────────────────────────────
  if (stage === 'task') {
    const hint = currentStep?.hint;
    const handleHintClick = () => {
      setHintOpen(true);
      if (onHintUsed && currentStep?.id) onHintUsed(currentStep.id);
    };
    return (
      <>
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
        return ans.type === 'photo' ? '사진으로 찾음' : '—';
      }
      if (step.uiMode === 'image_view') {
        return '그림 관찰 완료';
      }
      if (step.uiMode === 'defect_select') {
        if (!ans || ans.length === 0) return '—';
        const types = (step.defectTypes || []).filter(d => ans.includes(d.id));
        return types.map(d => d.label).join(', ') || `${ans.length}개 선택`;
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
        if (!ans?.prompt_detailed) return '—';
        const preview = ans.prompt_detailed.length > 30 ? ans.prompt_detailed.slice(0, 30) + '…' : ans.prompt_detailed;
        return `"${preview}"`;
      }
      if (step.uiMode === 'text_compare_ab') {
        if (!ans?.choice) return '—';
        const choiceLabel = ans.choice === 'A' ? step.labelA : step.labelB;
        const reasons = (step.reasonOptions || []).filter(r => (ans.reasons || []).includes(r.id));
        return reasons.length > 0 ? `${choiceLabel} · ${reasons.map(r => r.label).join(', ')}` : choiceLabel;
      }
      if (step.uiMode === 'prompt_builder') {
        if (!ans?.full_text) return '—';
        const preview = ans.full_text.length > 35 ? ans.full_text.slice(0, 35) + '…' : ans.full_text;
        return `"${preview}"`;
      }
      if (step.uiMode === 'prompt_single_input') {
        if (!ans?.prompt_revised) return '—';
        const preview = ans.prompt_revised.length > 35 ? ans.prompt_revised.slice(0, 35) + '…' : ans.prompt_revised;
        return `"${preview}"`;
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
        const TOPIC_LABEL = { animal: '동물', cooking: '요리', vehicle: '탈것' };
        return TOPIC_LABEL[ans] || ans || '—';
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
        const reasons = (step.reasonOptions || []).filter(r => (ans.reasons || []).includes(r.id));
        const reasonText = reasons.map(r => r.label).join(', ');
        return reasonText ? `${personOpt?.label || ans.person} · ${reasonText}` : personOpt?.label || ans.person;
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
      if (step.uiMode === 'per_case_judge') {
        if (!ans || Object.keys(ans).length === 0) return '—';
        const groups = step.judgmentOptions || [];
        const parts = (step.cases || []).map(c => {
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
      return '—';
    };

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
