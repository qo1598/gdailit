# Gemini AI Skill

이 프로젝트에서 Google Gemini API 관련 코드 수정 시 적용되는 규칙이다.

## 사용 패키지
- `@google/genai` (최신, 기본 사용)
- `@google/generative-ai` (구버전, 일부 파일에 잔존)
- API 키: 환경변수 `VITE_GEMINI_API_KEY` (`.env` 파일, Vercel 환경변수)

## 호출 패턴
- AI 채팅은 `ChatMode.jsx`에서 처리
- AI 채점은 `useGradeLogic.js` 훅에서 처리
- 각 미션 데이터 파일에 시스템 프롬프트 정의됨

## 수정 규칙
- API 키를 코드에 하드코딩하지 않는다
- 에러 처리 누락 주의 (네트워크 오류, rate limit)
- 초등학생 대상 → 응답 길이와 언어 난이도 제한 프롬프트 유지
- 채점 프롬프트 수정 시 기존 응답 포맷(JSON 구조 등) 깨지지 않게 주의

## 디버깅
- AI 응답 이상 → 해당 미션의 시스템 프롬프트 확인 우선
- rate limit 에러 → 테스트 환경에서 호출 횟수 확인
- 응답 파싱 오류 → `useGradeLogic.js` 의 JSON 파싱 구간 확인
