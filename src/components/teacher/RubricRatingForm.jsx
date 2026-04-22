import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient.js';
import {
  E_RUBRICS,
  AXIS_NAMES,
  LEVEL_NAMES,
  computeTotal,
  getLevelLabel,
} from '../../data/rubrics/e_domain_rubric.js';

const AXIS_COLORS = { A: '#6366f1', B: '#10b981', C: '#f59e0b', D: '#ef4444' };

export default function RubricRatingForm({ submission, raterId, onSaved, onCancel }) {
  const rubric = E_RUBRICS[submission.mission_code];
  const [scores, setScores] = useState({});  // { A: { a1: 2, a2: 3 }, B: { b1: 1 }, ... }
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    loadExisting();
  }, [submission.id]);

  async function loadExisting() {
    const { data } = await supabase
      .from('teacher_ratings')
      .select('*')
      .eq('submission_id', submission.id)
      .eq('rater_id', raterId)
      .maybeSingle();
    if (data) {
      setExistingId(data.id);
      setScores(data.rubric_scores || {});
      setComment(data.qualitative_comment || '');
    }
  }

  function setScore(axis, criterionId, value) {
    setScores(prev => ({
      ...prev,
      [axis]: { ...(prev[axis] || {}), [criterionId]: value },
    }));
  }

  const gradeBand = submission.grade_band;
  const weights = rubric?.weights || {};

  // 모든 필수 준거 채워졌는지 확인
  const allFilled = rubric
    ? Object.entries(rubric.axes).every(([axis, criteria]) =>
        criteria.every(c => scores[axis]?.[c.id] != null)
      )
    : false;

  const totalScore = rubric ? computeTotal(scores, gradeBand) : 0;

  async function handleSave() {
    if (!rubric) return;
    setSaving(true);
    const durationSec = Math.round((Date.now() - startRef.current) / 1000);

    const payload = {
      submission_id: submission.id,
      rater_id: raterId,
      rubric_scores: scores,
      qualitative_comment: comment || null,
      rating_duration_sec: durationSec,
    };

    try {
      if (existingId) {
        await supabase.from('teacher_ratings').update(payload).eq('id', existingId);
      } else {
        const { data } = await supabase.from('teacher_ratings').insert(payload).select('id').single();
        setExistingId(data?.id);
      }
      onSaved?.({ ...payload, totalScore });
    } finally {
      setSaving(false);
    }
  }

  if (!rubric) {
    return (
      <div style={{ padding: '24px', color: '#6b7280' }}>
        {submission.mission_code} 루브릭이 아직 준비되지 않았습니다.
      </div>
    );
  }

  const answers = submission.answers || {};

  return (
    <div style={{ padding: '20px', maxWidth: '760px', margin: '0 auto' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>
          {submission.user_id} · {submission.mission_code}
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
          {rubric.missionName} 채점
        </h2>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
          기대 수준: {rubric.expectedLevel}
        </div>
      </div>

      {/* 산출물(artifact) 미리보기 */}
      {answers.artifact && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac',
          borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
        }}>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, marginBottom: '4px' }}>산출물</div>
          <div style={{ fontSize: '0.88rem', color: '#166534', lineHeight: 1.5 }}>{answers.artifact}</div>
        </div>
      )}

      {/* 축별 채점 */}
      {Object.entries(rubric.axes).map(([axis, criteria]) => {
        if (!criteria.length) return null;
        const axisColor = AXIS_COLORS[axis] || '#6b7280';
        return (
          <div key={axis} style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '12px', paddingBottom: '8px',
              borderBottom: `2px solid ${axisColor}`,
            }}>
              <span style={{
                background: axisColor, color: 'white',
                borderRadius: '6px', padding: '2px 8px',
                fontSize: '0.8rem', fontWeight: 700,
              }}>{axis}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                {AXIS_NAMES[axis]}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: 'auto' }}>
                가중치 {Math.round((weights[axis] || 0) * 100)}%
              </span>
            </div>

            {criteria.map(c => (
              <div key={c.id} style={{
                background: '#f9fafb', borderRadius: '8px',
                padding: '14px', marginBottom: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1f2937' }}>{c.name}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginLeft: '8px' }}>
                      {c.dataField}
                    </span>
                  </div>
                  {scores[axis]?.[c.id] != null && (
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700,
                      color: axisColor,
                      background: `${axisColor}18`,
                      borderRadius: '4px', padding: '2px 8px',
                    }}>
                      {scores[axis][c.id]}수준 ({LEVEL_NAMES[scores[axis][c.id]]})
                    </span>
                  )}
                </div>

                {/* 수준 버튼 0~4 */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[0, 1, 2, 3, 4].map(level => {
                    const selected = scores[axis]?.[c.id] === level;
                    return (
                      <button
                        key={level}
                        onClick={() => setScore(axis, c.id, level)}
                        title={c.levels[level]}
                        style={{
                          flex: 1, minWidth: '52px',
                          padding: '6px 4px',
                          border: selected ? `2px solid ${axisColor}` : '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: selected ? `${axisColor}18` : 'white',
                          color: selected ? axisColor : '#374151',
                          fontSize: '0.75rem', fontWeight: selected ? 700 : 400,
                          cursor: 'pointer', textAlign: 'center',
                          transition: 'all 0.1s',
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>{level}</div>
                        <div style={{ fontSize: '0.65rem', color: selected ? axisColor : '#9ca3af' }}>
                          {LEVEL_NAMES[level]}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 선택된 수준 설명 */}
                {scores[axis]?.[c.id] != null && (
                  <div style={{
                    marginTop: '8px', fontSize: '0.78rem', color: '#4b5563',
                    background: 'white', borderRadius: '6px', padding: '8px 10px',
                    border: '1px solid #e5e7eb',
                  }}>
                    {c.levels[scores[axis][c.id]]}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* 종합 점수 */}
      {allFilled && (
        <div style={{
          background: '#eff6ff', border: '1px solid #93c5fd',
          borderRadius: '10px', padding: '16px', marginBottom: '20px',
        }}>
          <div style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600, marginBottom: '4px' }}>종합 수준</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: '#1d4ed8' }}>
              {totalScore.toFixed(2)}
            </span>
            <span style={{ fontSize: '1rem', color: '#2563eb' }}>
              {getLevelLabel(totalScore)}
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#3b82f6', marginTop: '4px' }}>
            {Object.entries(weights).map(([ax, w]) => {
              const axScores = scores[ax];
              if (!axScores) return null;
              const vals = Object.values(axScores).filter(v => v != null);
              if (!vals.length) return null;
              const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
              return (
                <span key={ax} style={{ marginRight: '12px' }}>
                  {ax}축 {avg.toFixed(1)} × {Math.round(w * 100)}%
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 질적 논평 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
          질적 논평 (선택)
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="학생의 수행에 대한 관찰 사항이나 특이 사항을 기록하세요."
          rows={3}
          style={{
            width: '100%', padding: '10px 12px',
            border: '1px solid #d1d5db', borderRadius: '8px',
            fontSize: '0.88rem', color: '#374151',
            resize: 'vertical', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* 버튼 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1, padding: '12px',
            border: '1px solid #d1d5db', borderRadius: '10px',
            background: 'white', color: '#374151',
            fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          취소
        </button>
        <button
          onClick={handleSave}
          disabled={!allFilled || saving}
          style={{
            flex: 2, padding: '12px',
            border: 'none', borderRadius: '10px',
            background: allFilled ? '#3b82f6' : '#d1d5db',
            color: 'white', fontSize: '0.9rem', fontWeight: 700,
            cursor: allFilled ? 'pointer' : 'not-allowed',
          }}
        >
          {saving ? '저장 중...' : existingId ? '수정 저장' : '채점 저장'}
        </button>
      </div>
    </div>
  );
}
