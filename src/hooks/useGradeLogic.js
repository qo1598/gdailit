import { useMemo } from 'react';

/**
 * 학년별 동적 로직을 처리하는 커스텀 훅
 * @param {Object} mission - 미션 데이터 객체
 * @param {string} gradeGroup - 학년군 ('lower', 'middle', 'upper')
 * @returns {Object} 학년별로 해석된 미션 속성들
 */
export const useGradeLogic = (mission, gradeGroup) => {
    return useMemo(() => {
        if (!mission || !gradeGroup) {
            return {
                currentType: null,
                currentPrompts: [],
                currentStackedInputs: [],
                currentIsChatMode: false,
                isCurrentChatMode: false,
                currentChatInitiator: null,
                currentUserTurnLimit: 5,
                currentScenarioImage: null,
                currentScenarioDescription: null,
                currentWhy: null,
                currentExample: null,
                currentReferenceImage: null,
                currentReferenceImageCaption: null
            };
        }

        // 타입 해석
        const currentType = typeof mission.type === 'object' 
            ? mission.type[gradeGroup] 
            : mission.type;

        // 프롬프트 해석
        const currentPrompts = mission.prompts 
            ? (mission.prompts[gradeGroup] || [])
            : (mission.description ? [mission.description] : []);

        // 스택 입력 해석
        const currentStackedInputs = mission.stackedInputs 
            ? (mission.stackedInputs[gradeGroup] || [])
            : [];

        // 채팅 모드 해석
        const currentIsChatMode = typeof mission.isChatMode === 'object' 
            ? mission.isChatMode[gradeGroup] 
            : mission.isChatMode;

        const isCurrentChatMode = currentType === 'chat' || currentIsChatMode;

        // 채팅 시작자 해석
        const currentChatInitiator = typeof mission.chatInitiator === 'object' 
            ? mission.chatInitiator[gradeGroup] 
            : mission.chatInitiator;

        // 턴 제한 해석
        const currentUserTurnLimit = mission.userTurnLimit 
            ? (mission.userTurnLimit[gradeGroup] || 5)
            : 5;

        // 시나리오 이미지 해석
        const currentScenarioImage = mission.scenarioImages 
            ? mission.scenarioImages[gradeGroup]
            : null;

        // 시나리오 설명 해석
        const currentScenarioDescription = mission.scenarioDescriptions 
            ? mission.scenarioDescriptions[gradeGroup]
            : null;

        // Why 해석
        const currentWhy = mission.why 
            ? (typeof mission.why === 'object' ? mission.why[gradeGroup] : mission.why)
            : null;

        // Example 해석
        const currentExample = mission.example 
            ? (typeof mission.example === 'object' ? mission.example[gradeGroup] : mission.example)
            : null;

        // 참고 그림 (학년별 객체 또는 단일 문자열)
        const currentReferenceImage = mission.referenceImages
            ? mission.referenceImages[gradeGroup] ?? null
            : mission.referenceImage ?? null;

        const currentReferenceImageCaption = mission.referenceImageCaptions
            ? mission.referenceImageCaptions[gradeGroup] ?? null
            : mission.referenceImageCaption ?? null;

        return {
            currentType,
            currentPrompts,
            currentStackedInputs,
            currentIsChatMode,
            isCurrentChatMode,
            currentChatInitiator,
            currentUserTurnLimit,
            currentScenarioImage,
            currentScenarioDescription,
            currentWhy,
            currentExample,
            currentReferenceImage,
            currentReferenceImageCaption
        };
    }, [mission, gradeGroup]);
};

export default useGradeLogic;