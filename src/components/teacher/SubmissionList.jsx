import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient.js';
import { getLevelLabel, computeTotal } from '../../data/rubrics/e_domain_rubric.js';

const GRADE_LABEL = { L: '1-2학년', M: '3-4학년', H: '5-6학년' };
const DOMAIN_LABEL = { E: 'E영역', C: 'C영역', M: 'M영역', D: 'D영역' };

export default function SubmissionList({ raterId, onSelect }) {
  const [submissions, setSubmissions] = useState([]);
  const [ratings, setRatings] = useState({});   // submissionId → rating row
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ domain: '', gradeBand: '', rated: '' });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [{ data: subs }, { data: rats }] = await Promise.all([
      supabase.from('mission_submissions_v4').select('*').order('submitted_at', { ascending: false }),
      supabase.from('teacher_ratings').select('submission_id, rubric_scores, grade_band, rated_at').eq('rater_id', raterId),
    ]);

    setSubmissions(subs || []);
    const rMap = {};
    (rats || []).forEach(r => { rMap[r.submission_id] = r; });
    setRatings(rMap);
    setLoading(false);
  }

  const filtered = submissions.filter(s => {
    if (filter.domain && !s.mission_code.startsWith(filter.domain)) return false;
    if (filter.gradeBand && s.grade_band !== filter.gradeBand) return false;
    if (filter.rated === 'rated' && !ratings[s.id]) return false;
    if (filter.rated === 'unrated' && ratings[s.id]) return false;
    return true;
  });

  const ratedCount = submissions.filter(s => ratings[s.id]).length;

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>불러오는 중...</div>;
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* 요약 */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap',
      }}>
        {[
          { label: '전체', value: submissions.length },
          { label: '채점 완료', value: ratedCount, color: '#10b981' },
          { label: '미채점', value: submissions.length - ratedCount, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#f9fafb', borderRadius: '8px', padding: '10px 16px',
            textAlign: 'center', minWidth: '80px',
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: stat.color || '#1f2937' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <select
          value={filter.domain}
          onChange={e => setFilter(f => ({ ...f, domain: e.target.value }))}
          style={selectStyle}
        >
          <option value="">전체 영역</option>
          {['E', 'C', 'M', 'D'].map(d => (
            <option key={d} value={d}>{DOMAIN_LABEL[d]}</option>
          ))}
        </select>
        <select
          value={filter.gradeBand}
          onChange={e => setFilter(f => ({ ...f, gradeBand: e.target.value }))}
          style={selectStyle}
        >
          <option value="">전체 학년</option>
          {['L', 'M', 'H'].map(g => (
            <option key={g} value={g}>{GRADE_LABEL[g]}</option>
          ))}
        </select>
        <select
          value={filter.rated}
          onChange={e => setFilter(f => ({ ...f, rated: e.target.value }))}
          style={selectStyle}
        >
          <option value="">전체 상태</option>
          <option value="rated">채점 완료</option>
          <option value="unrated">미채점</option>
        </select>
        <button
          onClick={() => setFilter({ domain: '', gradeBand: '', rated: '' })}
          style={{
            padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px',
            background: 'white', color: '#6b7280', fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          초기화
        </button>
      </div>

      {/* 목록 */}
      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '8px' }}>
        {filtered.length}건 표시
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>결과 없음</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filtered.map(sub => {
            const rating = ratings[sub.id];
            const totalScore = rating ? computeTotal(rating.rubric_scores, sub.grade_band) : null;
            return (
              <button
                key={sub.id}
                onClick={() => onSelect(sub)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px',
                  border: '1px solid #e5e7eb', borderRadius: '10px',
                  background: 'white', cursor: 'pointer', textAlign: 'left',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* 채점 상태 인디케이터 */}
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                  background: rating ? '#10b981' : '#d1d5db',
                }} />

                {/* 미션 정보 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 700, color: '#1f2937',
                    }}>{sub.mission_code}</span>
                    <span style={{
                      fontSize: '0.72rem', color: '#6b7280',
                      background: '#f3f4f6', borderRadius: '4px', padding: '1px 6px',
                    }}>{GRADE_LABEL[sub.grade_band] || sub.grade_band}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>
                    학생 {sub.user_id} · {new Date(sub.submitted_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>

                {/* 점수 또는 미채점 */}
                {rating ? (
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6' }}>
                      {totalScore?.toFixed(2) ?? '—'}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>
                      {getLevelLabel(totalScore ?? 0)}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    fontSize: '0.72rem', color: '#f59e0b',
                    background: '#fef3c7', borderRadius: '6px', padding: '3px 8px',
                    flexShrink: 0,
                  }}>
                    채점 필요
                  </div>
                )}

                <div style={{ color: '#9ca3af', flexShrink: 0 }}>›</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '6px',
  background: 'white', color: '#374151', fontSize: '0.8rem', cursor: 'pointer',
};
