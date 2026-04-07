import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import {
    isCompleteD1MiddleGroups,
    isCompleteD1UpperGroups
} from '../components/mission/d1/d1-fruits.js';

/**
 * 폼 처리 및 Supabase 연동을 담당하는 커스텀 훅
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
    const [teacherFeedback, setTeacherFeedback] = useState(null);

    // 텍스트 변경 핸들러
    const handleTextChange = useCallback((value) => {
        setFormData(value);
    }, []);

    // 스택 답변 변경 핸들러
    const handleStackedChange = useCallback((inputId, value) => {
        setStackedAnswers(prev => ({
            ...prev,
            [inputId]: value
        }));
    }, []);

    // 규칙 변경 핸들러
    const handleRuleChange = useCallback((setter, value) => {
        setter(value);
    }, []);

    // 파일 변경 핸들러
    const handleFileChange = useCallback((newFile) => {
        setFile(newFile);
    }, []);

    // 폼 초기화
    const resetForm = useCallback(() => {
        setFormData('');
        setStackedAnswers({});
        setRule1('');
        setRule2('');
        setRule3('');
        setFile(null);
        setIsSubmitting(false);
        setShowSuccess(false);
        setIsEditing(false);
        setTeacherFeedback(null);
    }, []);

    // 폼 데이터 설정 (편집 모드용)
    const setFormValues = useCallback((values) => {
        if (values.formData !== undefined) setFormData(values.formData);
        if (values.stackedAnswers !== undefined) setStackedAnswers(values.stackedAnswers);
        if (values.rule1 !== undefined) setRule1(values.rule1);
        if (values.rule2 !== undefined) setRule2(values.rule2);
        if (values.rule3 !== undefined) setRule3(values.rule3);
        if (values.file !== undefined) setFile(values.file);
        if (values.isEditing !== undefined) setIsEditing(values.isEditing);
        if (values.teacherFeedback !== undefined) setTeacherFeedback(values.teacherFeedback);
    }, []);

    // 기존 데이터 로딩 (Fetch Existing Submission)
    const fetchExistingSubmission = useCallback(async (userId, missionId, currentType, currentStackedInputs) => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from('mission_submissions')
                .select('data')
                .eq('user_id', userId)
                .eq('mission_id', missionId)
                .maybeSingle();

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error('Error fetching existing submission:', error);
                }
                return;
            }

            if (data && data.data) {
                const subData = data.data;
                const newValues = { isEditing: true, teacherFeedback: subData.teacher_feedback || null };

                // 데이터 복구 (Additive approach)
                if (subData.rule1 !== undefined) {
                    newValues.rule1 = subData.rule1;
                    newValues.rule2 = subData.rule2;
                    newValues.rule3 = subData.rule3;
                }
                
                if (subData.stackedAnswers) {
                    newValues.stackedAnswers = subData.stackedAnswers;
                }
                
                if (subData.text) {
                    newValues.formData = subData.text;
                }

                // 채팅일 경우 ChatMode에서 내부 상태를 복구하므로 formData에만 넣어줍니다.
                setFormValues(newValues);
                return subData; // ChatMode 등에서 사용할 수 있도록 원본 반환
            }
        } catch (err) {
            console.error('Unexpected error fetching existing submission:', err);
        }
        return null; // Return null strictly for error or not found
    }, [setFormValues]);

    // 폼 형식이 올바른지 검증
    const validateForm = useCallback((currentType, currentStackedInputs, isChatMode = false) => {
        if (isChatMode || currentType === 'chat') return true;
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
    }, [rule1, rule2, rule3, stackedAnswers, formData]);

    // Supabase 파일 업로드
    const uploadFileIfGiven = async (userId, missionId) => {
        let fileUrl = null;
        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}_${missionId}_${Date.now()}.${fileExt}`;
            const { error: uploadError, data } = await supabase.storage
                .from('mission-submissions')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: publicURLData } = supabase.storage
                .from('mission-submissions')
                .getPublicUrl(fileName);
                
            fileUrl = publicURLData.publicUrl;
        }
        return fileUrl;
    };

    /**
     * 메인 제출 핸들러 (Supabase)
     */
    const handleSubmit = async ({ 
        userId, schoolId, missionId, gradeGroup, mission, 
        currentType, currentStackedInputs, 
        startTime, editCountRef, messages = [], 
        generatedImageUrl = null, surveyData = null, 
        onSuccess, onReward 
    }) => {
        setIsSubmitting(true);
        try {
            // 1. Storage 업로드 
            const fileUrl = await uploadFileIfGiven(userId, missionId);

            // 2. SubmissionData 페이로드 생성
            const finalContent = (mission.isChatMode || currentType === 'chat')
                ? messages.map(m => `[${m.role}] ${m.content}`).join('\n') 
                : formData;

            // 기본 페이로드 (모든 데이터를 누적하여 저장)
            let submissionData = { 
                file_url: fileUrl, 
                generatedImageUrl: generatedImageUrl || null,
                teacher_feedback: teacherFeedback
            };
            
            // 1. 채팅 데이터 추가
            if (mission.isChatMode || currentType === 'chat') {
                submissionData.text = finalContent;
                submissionData.chat_history = messages;
            }
            
            // 2. 스택/입력 데이터 추가
            if (currentStackedInputs?.length > 0) {
                submissionData.stackedAnswers = stackedAnswers;
                // 스택 미션이면서 텍스트 데이터가 있으면 함께 저장
                if (formData && formData.trim()) {
                    submissionData.text = formData;
                }
            } else if (!submissionData.text) {
                // 일반 텍스트 미션인 경우
                submissionData.text = formData;
            }

            // 3. 규칙 데이터 (레거시 지원)
            if (currentType === 'rules') {
                submissionData.rule1 = rule1;
                submissionData.rule2 = rule2;
                submissionData.rule3 = rule3;
            }

            // 3. Database 연동
            if (isEditing) {
                const { error: err1 } = await supabase
                    .from('mission_submissions')
                    .update({ data: submissionData })
                    .eq('user_id', userId)
                    .eq('mission_id', missionId);
                if (err1) throw err1;

                const { error: err2 } = await supabase
                    .from('user_progress')
                    .update({ completed: false })
                    .eq('user_id', userId)
                    .eq('mission_id', missionId);
                if (err2) throw err2;
                
                if (editCountRef) editCountRef.current += 1;
            } else {
                const { error: err3 } = await supabase
                    .from('mission_submissions')
                    .insert([
                        { user_id: userId, mission_id: missionId, data: submissionData }
                    ]);
                if (err3) throw err3;

                const { error: err4 } = await supabase
                    .from('user_progress')
                    .upsert(
                        { user_id: userId, mission_id: missionId, completed: false },
                        { onConflict: 'user_id, mission_id' }
                    );
                if (err4) throw err4;
            }

            // 4. Activity Logs (Research Telemetry)
            try {
                const endTime = Date.now();
                await supabase.from('activity_logs').insert([{
                    user_id: userId,
                    school_id: schoolId,
                    activity_type: 'mission_enhanced',
                    activity_id: missionId,
                    data: {
                        mission_id: missionId,
                        mission_title: mission.title,
                        mission_type: mission.type,
                        competency: mission.competency,
                        grade_group: gradeGroup,
                        is_edit: isEditing,
                        content: submissionData,
                        telemetry: {
                            time_spent_ms: endTime - startTime,
                            edit_count: editCountRef ? editCountRef.current : 0,
                            has_file: !!file,
                            is_chat_mode: !!mission.isChatMode,
                            chat_history: mission.isChatMode ? messages : null
                        },
                        survey: isEditing ? null : surveyData,
                        submitted_at: new Date().toISOString()
                    }
                }]);
            } catch (logErr) {
                console.warn('activity_logs 로깅 실패:', logErr);
            }

            // 5. 보상 지급 및 종료 처리
            if (!isEditing && onReward) {
                await onReward(5, "미션 완료! 뱃지를 얻기 위해 선생님의 검토를 기다려주세요!");
            }

            setShowSuccess(true);
            if (onSuccess) onSuccess();

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
        teacherFeedback,
        
        // 데이터 및 폼 핸들러
        handleTextChange,
        handleStackedChange,
        handleRuleChange,
        handleFileChange,
        handleSubmit,
        fetchExistingSubmission,
        
        // 유틸리티
        resetForm,
        setFormValues,
        validateForm,
        
        // 상태 설정자 (직접 컨트롤이 필요할 때)
        setIsSubmitting,
        setShowSuccess,
        setIsEditing,
        setTeacherFeedback
    };
};

export default useFormHandling;