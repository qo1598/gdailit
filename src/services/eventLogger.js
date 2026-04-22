import { supabase } from '../supabaseClient.js';

const ENABLED = import.meta.env.VITE_ENABLE_RESEARCH_LOGGING === 'true';
const BATCH_SIZE = 50;
const FLUSH_INTERVAL_MS = 5000;

let _session = null;
let _queue = [];
let _flushTimer = null;

// ─────────────────────────────────────────────
// 세션 관리
// ─────────────────────────────────────────────

export function initSession(userId, missionCode, gradeBand) {
  if (!ENABLED) return;
  _session = {
    userId,
    missionCode,
    gradeBand,
    sessionId: crypto.randomUUID(),
    schoolId: 'gyeongdong',
  };
  _queue = [];
  _startFlushTimer();
}

export function endSession() {
  if (!ENABLED) return;
  flushQueue();
  _stopFlushTimer();
  _session = null;
}

// ─────────────────────────────────────────────
// 이벤트 기록
// ─────────────────────────────────────────────

export function logEvent(eventType, payload = {}, stepId = null, stage = 'task') {
  if (!ENABLED || !_session) return;

  _queue.push({
    user_id:       _session.userId,
    session_id:    _session.sessionId,
    mission_code:  _session.missionCode,
    grade_band:    _session.gradeBand,
    school_id:     _session.schoolId,
    step_id:       stepId,
    stage,
    event_type:    eventType,
    event_payload: payload,
    client_ts:     new Date().toISOString(),
  });

  if (_queue.length >= BATCH_SIZE) {
    flushQueue();
  }
}

// ─────────────────────────────────────────────
// 배치 전송
// ─────────────────────────────────────────────

export async function flushQueue() {
  if (!ENABLED || _queue.length === 0) return;

  const batch = _queue.splice(0, _queue.length);

  try {
    const { error } = await supabase.from('mission_events').insert(batch);
    if (error) throw error;
  } catch (e) {
    // 전송 실패 시 localStorage 백업 후 다음 세션에서 재시도
    try {
      const backed = JSON.parse(localStorage.getItem('__event_backup') || '[]');
      localStorage.setItem('__event_backup', JSON.stringify([...backed, ...batch]));
    } catch (_) { /* localStorage 접근 불가 시 조용히 무시 */ }
  }
}

// ─────────────────────────────────────────────
// localStorage 백업 재시도
// ─────────────────────────────────────────────

export async function retryBackup() {
  if (!ENABLED) return;
  try {
    const backed = JSON.parse(localStorage.getItem('__event_backup') || '[]');
    if (backed.length === 0) return;
    const { error } = await supabase.from('mission_events').insert(backed);
    if (!error) {
      localStorage.removeItem('__event_backup');
    }
  } catch (_) { /* 조용히 무시 */ }
}

// ─────────────────────────────────────────────
// 내부 타이머
// ─────────────────────────────────────────────

function _startFlushTimer() {
  _stopFlushTimer();
  _flushTimer = setInterval(flushQueue, FLUSH_INTERVAL_MS);
}

function _stopFlushTimer() {
  if (_flushTimer) {
    clearInterval(_flushTimer);
    _flushTimer = null;
  }
}

// ─────────────────────────────────────────────
// 개발용 — 브라우저 콘솔에서 테스트
// ─────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.__eventLogger = { initSession, logEvent, endSession, flushQueue, retryBackup };
}
