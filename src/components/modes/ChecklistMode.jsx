import React from 'react';
import { useGradeLogic } from '../../hooks/useGradeLogic';

const ChecklistMode = ({ 
    mission, 
    missionId, 
    gradeGroup, 
    stackedAnswers, 
    onStackedChange, 
    onSubmit 
}) => {
    const { currentStackedInputs, currentPrompts } = useGradeLogic(mission, gradeGroup);
    
    const handleChecklistChange = (inputId, selectedItems) => {
        onStackedChange(inputId, selectedItems);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* M-1 미션의 특별한 유혹 시나리오 UI */}
            {missionId === 'M-1' && (
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '25px',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <img
                            src={mission.scenarioImages?.[gradeGroup] || '/m1_temptation_villain_1775273041480.png'}
                            alt="유혹 AI"
                            style={{ 
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '50%',
                                border: '3px solid white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}
                        />
                        <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '5px' }}>
                                🎭 유혹하는 AI의 달콤한 제안
                            </div>
                            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                                {mission.scenarioDescriptions?.[gradeGroup]}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-semibold">
                        {currentPrompts && currentPrompts[0]}
                    </p>
                </div>

                {currentStackedInputs?.map((inputDef, index) => (
                    <div key={inputDef.id} className="mb-6">
                        <label className="block text-lg font-semibold mb-3 text-gray-700">
                            {inputDef.label}
                        </label>
                        
                        {inputDef.type === 'checklist' && (
                            <div className="grid gap-3">
                                {inputDef.list?.map((item, itemIndex) => (
                                    <label key={itemIndex} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={stackedAnswers[inputDef.id]?.includes(item) || false}
                                            onChange={(e) => {
                                                const currentSelected = stackedAnswers[inputDef.id] || [];
                                                const newSelected = e.target.checked
                                                    ? [...currentSelected, item]
                                                    : currentSelected.filter(selected => selected !== item);
                                                handleChecklistChange(inputDef.id, newSelected);
                                            }}
                                            className="mr-3 w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-gray-700">{item}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        
                        {inputDef.type === 'textarea' && (
                            <textarea
                                value={stackedAnswers[inputDef.id] || ''}
                                onChange={(e) => onStackedChange(inputDef.id, e.target.value)}
                                placeholder={inputDef.placeholder}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                            />
                        )}
                    </div>
                ))}

                <div className="mt-6 text-center">
                    <button
                        onClick={onSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        {missionId === 'M-1' ? '나의 선택 완료!' : '선택 완료하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChecklistMode;