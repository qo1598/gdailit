import { useState, useCallback } from 'react';
import { checkModeration } from '../utils/moderation';

/**
 * 전역 비속어 및 도배 방지 필터링을 위한 커스텀 훅
 */
export const useModeration = () => {
    const [modWarning, setModWarning] = useState({ show: false, message: '' });
    const [lastText, setLastText] = useState('');
    const [lastTime, setLastTime] = useState(0);

    const validateContent = useCallback((text, options = {}) => {
        const { skipSpam = false, skipRepetition = false } = options;
        
        // checkModeration 호출 시 선택적으로 스팸/반복 체크 제외 가능
        const result = checkModeration(
            text, 
            skipRepetition ? null : lastText, 
            skipSpam ? null : lastTime
        );

        if (!result.isValid) {
            if (result.reason !== 'empty') {
                setModWarning({ show: true, message: result.message });
            }
            return false;
        }

        // 유효한 경우 상태 업데이트
        setLastText(text.trim());
        setLastTime(Date.now());
        return true;
    }, [lastText, lastTime]);

    const closeWarning = useCallback(() => {
        setModWarning({ show: false, message: '' });
    }, []);

    return {
        modWarning,
        validateContent,
        closeWarning
    };
};
