import { useState } from 'react';
import {
    isCompleteD1MiddleGroups,
    isCompleteD1UpperGroups
} from '../components/mission/d1/d1-fruits.js';

/**
 * 폼 처리 로직을 담당하는 커스텀 훅
 * @param {Object} initialValues - 초기값들
 * @returns {Object} 폼 상태와 핸들러들
 */
export const useFormHandling = (initialValues = {}) => {
    // 기본 폼 상태
    const [formData, setFormData] = useState(initialValues.formData || '');
    const [stackedAnswers, setStackedAnswers] = useState(initialValues.stackedAnswers || {});
    const [rule1, setRule1] = useState(initialValues.rule1 || '');
    const [rule2, setRule2] = useState(initialValues.rule2 || '');
    const [rule3, setRule3] = useState(initialValues.rule3 || '');
    const [file, setFile] = useState(initialValues.file || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // 텍스트 변경 핸들러
    const handleTextChange = (value) => {
        setFormData(value);
    };

    // 스택 답변 변경 핸들러
    const handleStackedAnswerChange = (inputId, value) => {
        setStackedAnswers(prev => ({
            ...prev,
            [inputId]: value
        }));
    };

    // 규칙 변경 핸들러
    const handleRuleChange = (setter, value) => {
        setter(value);
    };

    // 파일 변경 핸들러
    const handleFileChange = (newFile) => {
        setFile(newFile);
    };

    // 폼 초기화
    const resetForm = () => {
        setFormData('');
        setStackedAnswers({});
        setRule1('');
        setRule2('');
        setRule3('');
        setFile(null);
        setIsSubmitting(false);
        setShowSuccess(false);
        setIsEditing(false);
    };

    // 폼 데이터 설정 (편집 모드용)
    const setFormValues = (values) => {
        if (values.formData !== undefined) setFormData(values.formData);
        if (values.stackedAnswers !== undefined) setStackedAnswers(values.stackedAnswers);
        if (values.rule1 !== undefined) setRule1(values.rule1);
        if (values.rule2 !== undefined) setRule2(values.rule2);
        if (values.rule3 !== undefined) setRule3(values.rule3);
        if (values.file !== undefined) setFile(values.file);
        if (values.isEditing !== undefined) setIsEditing(values.isEditing);
    };

    // 폼 검증
    const validateForm = (currentType, currentStackedInputs) => {
        if (currentType === 'rules') {
            return rule1.trim() && rule2.trim() && rule3.trim();
        } else if (currentStackedInputs?.length > 0) {
            return currentStackedInputs.every(input => {
                const answer = stackedAnswers[input.id];
                if (input.type === 'checklist') {
                    return Array.isArray(answer) && answer.length > 0;
                } else if (input.type === 'multi-text') {
                    return input.fields.every(field => 
                        answer && answer[field.id] && answer[field.id].trim()
                    );
                } else if (input.type === 'd1-middle-drag') {
                    return isCompleteD1MiddleGroups(answer);
                } else if (input.type === 'd1-upper-drag') {
                    return isCompleteD1UpperGroups(answer);
                } else if (input.type === 'd1-lower-basket-dnd') {
                    return Boolean(answer && answer.toString().trim());
                } else {
                    return answer && answer.toString().trim();
                }
            });
        } else {
            return formData.trim();
        }
    };

    // 제출 데이터 생성
    const generateSubmissionData = (currentType, currentStackedInputs, fileUrl = null, additionalData = {}) => {
        let submissionData = { 
            file_url: fileUrl, 
            ...additionalData 
        };

        if (currentType === 'rules') {
            submissionData = { ...submissionData, rule1, rule2, rule3 };
        } else if (currentStackedInputs?.length > 0) {
            submissionData = { ...submissionData, stackedAnswers };
        } else {
            submissionData = { ...submissionData, text: formData };
        }

        return submissionData;
    };

    // 제출 핸들러
    const handleSubmit = async (submissionData) => {
        setIsSubmitting(true);
        try {
            // 여기에 실제 제출 로직을 추가할 수 있습니다
            // 예: await submitToDatabase(submissionData);
            console.log('제출 데이터:', submissionData);
            
            // 성공 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowSuccess(true);
        } catch (error) {
            console.error('제출 실패:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // 상태
        formData,
        stackedAnswers,
        rule1,
        rule2,
        rule3,
        file,
        isSubmitting,
        showSuccess,
        isEditing,
        
        // 핸들러
        handleTextChange,
        handleStackedChange: handleStackedAnswerChange,
        handleRuleChange,
        handleFileChange,
        handleSubmit,
        
        // 유틸리티
        resetForm,
        setFormValues,
        validateForm,
        generateSubmissionData,
        
        // 상태 설정자 (필요한 경우)
        setIsSubmitting,
        setShowSuccess,
        setIsEditing
    };
};

export default useFormHandling;