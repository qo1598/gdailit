# Supabase Skill

이 프로젝트에서 Supabase 관련 코드 수정 시 적용되는 규칙이다.

## 클라이언트
- `src/supabaseClient.js` — 앱 전체에서 공유하는 단일 인스턴스
- 새로운 클라이언트 인스턴스를 중복 생성하지 않는다

## 사용 영역
- **인증**: `src/components/Login.jsx`
- **관리자(교사) 화면**: `src/components/Admin.jsx`
- **미션 진행 기록**: 각 미션 컴포넌트에서 저장

## 수정 규칙
- DB 스키마 변경은 Supabase 대시보드에서 직접 수행 후 코드 반영
- Row Level Security(RLS) 정책 영향 여부 항상 확인
- 미션 ID는 DB에 저장되므로 ID 변경 절대 금지
- 환경변수: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## 디버깅
- Auth 오류 → `supabaseClient.js` 및 `Login.jsx` 확인
- DB 쿼리 오류 → Supabase 대시보드 로그에서 확인
- RLS 차단 → 해당 테이블 정책 검토
