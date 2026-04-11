# File Map

## ★ 핵심 파일 (현재 작업 중심)

| 파일 | 역할 | 상태 |
|------|------|------|
| `src/data/missionsV3.js` | V3 미션 데이터 통합 파일 | E-1 완성, 나머지 추가 예정 |
| `src/components/mission/v3/MissionRunner.jsx` | V3 미션 전체 흐름 제어 엔진 | 완성 |
| `src/components/mission/v3/MissionShell.jsx` | UI 래퍼 (TopBar, ProgressHeader, BottomNav) | 완성 |
| `src/components/mission/v3/StageRenderer.jsx` | 스테이지별 컴포넌트 분기 | 완성 |
| `src/components/mission/v3/TDRenderer.jsx` | TD 수행형 렌더러 | 완성 (E-1-L 기준) |
| `src/components/mission/v3/TaskStepRenderer.jsx` | performanceType별 Renderer 분기 | 완성 |
| `src/App.jsx` | 라우팅, INITIAL_MISSIONS 상수 | - |

## 설계 문서 (작업 전 참고)
| 파일 | 내용 |
|------|------|
| `V3_프론트엔드_디자인스펙_MissionRunner_E1L_실행예시.md` | V3 구조·스펙·E-1-L 실행 예시 (핵심 설계서) |
| `LearnAILIT v3 개선(안).pdf` | V3 전체 개선 방향 |
| `설계도_V3_정리본.md` | V3 설계 정리본 |

## 구버전/레거시 (수정 지양)
| 경로 | 설명 |
|------|------|
| `src/data/missions/*.js` | 구버전 미션 데이터 (E-1~4, C-1~4, M-1~4, D-1~4) |
| `src/components/missions/` | 구버전 개별 미션 컴포넌트 |
| `src/components/mission/d1/`, `d2/` | 이전 버전 미션 컴포넌트 |
| `src/components/modes/` | 구버전 인터랙션 모드 |
| `src/components/Mission.jsx` | 구버전 미션 래퍼 |
| `src/components/Mission_backup.jsx` 등 | 백업본, 절대 수정 금지 |

## 디렉터리별 역할 요약
```
src/components/mission/v3/    # V3 엔진 — 미션 실행의 핵심
src/data/missionsV3.js        # V3 미션 데이터 (E-1 완성)
src/data/missions/            # 구버전 미션 데이터 (레거시)
src/hooks/                    # 커스텀 훅 (폼, 채점, 모더레이션)
src/utils/                    # 유틸 (사전, 욕설필터)
src/components/common/        # 공통 모달 (ModerationModal)
public/                       # 미션 썸네일 이미지
docs/                         # 설계 문서, Claude 운영 규칙
```

## 새 미션 V3 전환 시 체크리스트
1. `src/data/missionsV3.js` 에 해당 미션 추가 (E-1-L 구조 참고)
2. performanceType이 TD 외 다른 경우 → 해당 Renderer 구현 필요
3. `src/App.jsx` INITIAL_MISSIONS의 미션 라우팅 확인
4. `public/` 썸네일 이미지 확인
