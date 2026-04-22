import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient.js';

// S/A 이름 → ksa_code 변환
const S_CODE = {
  'Critical Thinking':       'S.critical_thinking',
  'Creativity':              'S.creativity',
  'Computational Thinking':  'S.computational_thinking',
  'Self and Social Awareness': 'S.self_social_awareness',
  'Collaboration':           'S.collaboration',
  'Communication':           'S.communication',
  'Problem Solving':         'S.problem_solving',
};
const A_CODE = {
  'Responsible':  'A.responsible',
  'Curious':      'A.curious',
  'Innovative':   'A.innovative',
  'Adaptable':    'A.adaptable',
  'Empathetic':   'A.empathetic',
};

const EMOJI_OPTIONS = [
  { value: 1, label: '😟' },
  { value: 2, label: '😐' },
  { value: 3, label: '😀' },
];
const LIKERT_OPTIONS = [1, 2, 3, 4, 5];
const LIKERT_LABELS = { 1: '전혀 아니다', 3: '보통', 5: '매우 그렇다' };

export default function PostMissionSelfEval({
  missionCode,
  gradeBand,
  ksa,
  submissionId,
  userId,
  onComplete,
}) {
  const [items, setItems]       = useState([]);
  const [responses, setResponses] = useState({});
  const [difficulty, setDifficulty] = useState(null);
  const [aiHelp, setAiHelp]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!ksa || !gradeBand) return;
    loadItems();
  }, [ksa, gradeBand]);

  async function loadItems() {
    setLoading(true);
    const ksaCodes = [
      ...(ksa.K || []),
      ...(ksa.S || []).map(s => S_CODE[s]).filter(Boolean),
      ...(ksa.A || []).map(a => A_CODE[a]).filter(Boolean),
    ];
    if (ksaCodes.length === 0) { setLoading(false); return; }

    const { data } = await supabase
      .from('ksa_item_bank')
      .select('*')
      .eq('survey_type', 'post_mission')
      .eq('grade_band', gradeBand)
      .in('ksa_code', ksaCodes)
      .eq('is_active', true)
      .order('display_order');

    setItems(data || []);
    setLoading(false);
  }

  function setResponse(ksaCode, value) {
    setResponses(prev => ({ ...prev, [ksaCode]: value }));
  }

  const allAnswered =
    items.every(item => responses[item.ksa_code] != null) &&
    difficulty != null &&
    aiHelp != null;

  async function handleSubmit() {
    setSaving(true);
    try {
      const kResponses = {};
      const sResponses = {};
      const aResponses = {};
      items.forEach(item => {
        const val = responses[item.ksa_code];
        if (item.ksa_category === 'K') kResponses[item.ksa_code] = val;
        if (item.ksa_category === 'S') sResponses[item.ksa_code] = val;
        if (item.ksa_category === 'A') aResponses[item.ksa_code] = val;
      });

      await supabase.from('post_mission_evaluations').insert({
        submission_id:         submissionId,
        user_id:               userId,
        mission_code:          missionCode,
        grade_band:            gradeBand,
        k_responses:           Object.keys(kResponses).length ? kResponses : null,
        s_responses:           Object.keys(sResponses).length ? sResponses : null,
        a_responses:           Object.keys(aResponses).length ? aResponses : null,
        difficulty_rating:     difficulty,
        ai_helpfulness_rating: aiHelp,
      });
    } catch (_) { /* 저장 실패해도 complete로 진행 */ }
    finally { setSaving(false); }

    onComplete();
  }

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        문항 불러오는 중...
      </div>
    );
  }

  const isEmoji = gradeBand === 'L';

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#1f2937' }}>
        미션 돌아보기
      </h2>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '24px' }}>
        이 미션에서 내가 배우고 느낀 것을 솔직하게 답해줘요.
      </p>

      {/* KSA 구인별 문항 */}
      {items.map(item => (
        <div key={item.ksa_code} style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '0.92rem', color: '#374151', marginBottom: '10px', lineHeight: 1.5 }}>
            {item.item_text}
          </p>
          {isEmoji ? (
            <div style={{ display: 'flex', gap: '16px' }}>
              {EMOJI_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setResponse(item.ksa_code, opt.value)}
                  style={{
                    fontSize: '1.8rem',
                    background: 'none',
                    border: responses[item.ksa_code] === opt.value ? '2px solid #3b82f6' : '2px solid transparent',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    opacity: responses[item.ksa_code] != null && responses[item.ksa_code] !== opt.value ? 0.4 : 1,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {LIKERT_OPTIONS.map(val => (
                <button
                  key={val}
                  onClick={() => setResponse(item.ksa_code, val)}
                  style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    border: responses[item.ksa_code] === val ? '2px solid #3b82f6' : '2px solid #d1d5db',
                    background: responses[item.ksa_code] === val ? '#3b82f6' : 'white',
                    color: responses[item.ksa_code] === val ? 'white' : '#374151',
                    fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {val}
                </button>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: '#9ca3af', marginLeft: '4px' }}>
                {Object.entries(LIKERT_LABELS).map(([k, v]) => (
                  <span key={k}>{v}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 공통 문항: 난이도 */}
      <div style={{ marginBottom: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        <p style={{ fontSize: '0.92rem', color: '#374151', marginBottom: '10px' }}>
          이 미션은 얼마나 어려웠나요?
        </p>
        {isEmoji ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            {[{ value: 1, label: '😊 쉬웠어요' }, { value: 2, label: '😐 보통이에요' }, { value: 3, label: '😓 어려웠어요' }].map(opt => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                style={{
                  fontSize: '0.85rem', padding: '6px 12px',
                  background: difficulty === opt.value ? '#dbeafe' : '#f3f4f6',
                  border: difficulty === opt.value ? '2px solid #3b82f6' : '2px solid transparent',
                  borderRadius: '8px', cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            {LIKERT_OPTIONS.map(val => (
              <button key={val} onClick={() => setDifficulty(val)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: difficulty === val ? '2px solid #3b82f6' : '2px solid #d1d5db',
                  background: difficulty === val ? '#3b82f6' : 'white',
                  color: difficulty === val ? 'white' : '#374151',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >{val}</button>
            ))}
          </div>
        )}
      </div>

      {/* 공통 문항: AI 도움 */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '0.92rem', color: '#374151', marginBottom: '10px' }}>
          AI가 이 미션에 도움이 됐나요?
        </p>
        {isEmoji ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            {[{ value: 1, label: '😟 별로요' }, { value: 2, label: '😐 조금요' }, { value: 3, label: '😀 많이요' }].map(opt => (
              <button key={opt.value} onClick={() => setAiHelp(opt.value)}
                style={{
                  fontSize: '0.85rem', padding: '6px 12px',
                  background: aiHelp === opt.value ? '#dbeafe' : '#f3f4f6',
                  border: aiHelp === opt.value ? '2px solid #3b82f6' : '2px solid transparent',
                  borderRadius: '8px', cursor: 'pointer',
                }}
              >{opt.label}</button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            {LIKERT_OPTIONS.map(val => (
              <button key={val} onClick={() => setAiHelp(val)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: aiHelp === val ? '2px solid #3b82f6' : '2px solid #d1d5db',
                  background: aiHelp === val ? '#3b82f6' : 'white',
                  color: aiHelp === val ? 'white' : '#374151',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >{val}</button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || saving}
        style={{
          width: '100%', padding: '14px',
          background: allAnswered ? '#3b82f6' : '#d1d5db',
          color: 'white', border: 'none', borderRadius: '12px',
          fontSize: '1rem', fontWeight: 700, cursor: allAnswered ? 'pointer' : 'not-allowed',
        }}
      >
        {saving ? '저장 중...' : '완료하기'}
      </button>
    </div>
  );
}
