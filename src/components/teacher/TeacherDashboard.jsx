import React, { useState } from 'react';
import SubmissionList from './SubmissionList.jsx';
import RubricRatingForm from './RubricRatingForm.jsx';

export default function TeacherDashboard({ raterId = 'teacher_default', raterSchool = '' }) {
  const [selected, setSelected] = useState(null);   // 선택된 submission
  const [savedCount, setSavedCount] = useState(0);

  function handleSelect(submission) {
    setSelected(submission);
  }

  function handleSaved(result) {
    setSavedCount(n => n + 1);
    setSelected(null);
  }

  function handleCancel() {
    setSelected(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* 헤더 */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e5e7eb',
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
            교사 채점 대시보드
          </h1>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
            {raterId}{raterSchool ? ` · ${raterSchool}` : ''}
            {savedCount > 0 && (
              <span style={{ marginLeft: '10px', color: '#10b981' }}>
                이 세션에서 {savedCount}건 저장
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 16px' }}>
        {selected ? (
          <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden' }}>
            {/* 뒤로가기 */}
            <div style={{
              padding: '10px 20px', borderBottom: '1px solid #f3f4f6',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <button
                onClick={handleCancel}
                style={{
                  background: 'none', border: 'none', color: '#3b82f6',
                  fontSize: '0.85rem', cursor: 'pointer', padding: '4px 0',
                }}
              >
                ← 목록으로
              </button>
            </div>

            {/* 제출 원본 데이터 패널 */}
            <SubmissionAnswers submission={selected} />

            {/* 루브릭 채점 폼 */}
            <div style={{ borderTop: '1px solid #e5e7eb', padding: '20px' }}>
              <RubricRatingForm
                submission={selected}
                raterId={raterId}
                onSaved={handleSaved}
                onCancel={handleCancel}
              />
            </div>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                제출물 목록
              </h2>
            </div>
            <SubmissionList raterId={raterId} onSelect={handleSelect} />
          </div>
        )}
      </div>
    </div>
  );
}

// 학생 제출 원본을 접을 수 있는 패널로 보여줌
function SubmissionAnswers({ submission }) {
  const [open, setOpen] = useState(false);
  const answers = submission.answers || {};
  const schema = answers.step_schema || [];

  const steps = schema.filter(s => answers[s.step_id] != null);

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '12px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: '#f9fafb', border: 'none', cursor: 'pointer',
          fontSize: '0.85rem', fontWeight: 600, color: '#374151',
        }}
      >
        <span>학생 응답 원본 보기</span>
        <span style={{ color: '#9ca3af' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>step 응답 없음</div>
          ) : (
            steps.map(s => (
              <div key={s.step_id} style={{
                background: '#f9fafb', borderRadius: '8px', padding: '12px',
                border: '1px solid #e5e7eb',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>
                  {s.step_id.toUpperCase()} · {s.title || ''}
                  <span style={{ marginLeft: '8px', fontWeight: 400, color: '#9ca3af' }}>
                    [{s.ui_mode}]
                  </span>
                </div>
                {s.question && (
                  <div style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '6px' }}>
                    {s.question}
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: '#1f2937', wordBreak: 'break-word' }}>
                  {formatAnswer(answers[s.step_id])}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function formatAnswer(val) {
  if (val == null) return '—';
  if (typeof val === 'string') return val || '—';
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'object') {
    return (
      <pre style={{ margin: 0, fontSize: '0.78rem', color: '#374151', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(val, null, 2)}
      </pre>
    );
  }
  return String(val);
}
