import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, UserCircle, MessageCircle, ClipboardList } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Mission from './components/Mission';
import MiniGame from './components/MiniGame';
import Login from './components/Login';
import Discussion from './components/Discussion';
import Admin from './components/Admin';
import { supabase } from './supabaseClient';
import './index.css';

// We mock the status for the pilot here
const INITIAL_MISSIONS = [
  { id: 'E-1', title: '우리 주변의 AI 찾기', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e1_find_1773234874913.png' },
  { id: 'E-2', title: 'AI 답 검증하기', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e2_trust_1773234890193.png', silhouetteUrl: '/e2_silhouette.png' },
  { id: 'E-3', title: '추천은 왜 나에게 왔을까?', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e3_recommend_1773234908058.png' },
  { id: 'E-4', title: 'AI는 누구에게 불공평할까?', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e4_fairness_1773234925903.png' },

  { id: 'C-1', title: 'AI와 이야기 이어쓰기', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c1_story_1773234941443.png' },
  { id: 'C-2', title: 'AI 그림 보고 새 장면 만들기', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c2_art_1773234957163.png' },
  { id: 'C-3', title: 'AI와 홍보물 만들기', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c3_poster_1773234969699.png' },
  { id: 'C-4', title: '누가 만들었을까?', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c4_copyright_1773234984925.png' },

  { id: 'M-1', title: '이럴 때 AI를 써도 될까?', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m1_rules_1773234999640.png' },
  { id: 'M-2', title: '사람이 할 일, AI가 도와줄 일', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m2_roles_1773235015302.png' },
  { id: 'M-3', title: 'AI에게 정확히 부탁하기', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m3_prompt_1773235032419.png' },
  { id: 'M-4', title: '우리 반 AI 사용 약속 만들기', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m4_promise_1773235045836.png' },

  { id: 'D-1', title: '같은 것끼리 묶어보자', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-2', title: 'AI가 배우는 자료 모으기', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-3', title: '잘못 분류되는 경우 찾기', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-4', title: '우리 학교 문제를 돕는 AI 상상하기', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' }
];

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <div className="nav-icon"><Home size={20} /></div>
        <span>도감</span>
      </Link>
      <Link to="/minigame" className={`nav-item ${location.pathname === '/minigame' ? 'active' : ''}`}>
        <div className="nav-icon"><Gamepad2 size={20} /></div>
        <span>미니게임</span>
      </Link>
      <Link to="/discussion" className={`nav-item ${location.pathname === '/discussion' ? 'active' : ''}`}>
        <div className="nav-icon"><MessageCircle size={20} /></div>
        <span>AI와 토의</span>
      </Link>
      <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
        <div className="nav-icon"><UserCircle size={20} /></div>
        <span>내 정보</span>
      </Link>
    </nav>
  );
}
// [마스터피스] 1:1 일관성을 위한 공유 SVG 부품 정의
const PART_SVGS = {
  ears: () => (
    <g>
      <path d="M80 45 C65 0 60 0 70 15 L78 45" fill="#f5f6fa" stroke="#dcdde1" strokeWidth="1.5" />
      <path d="M120 45 C135 0 140 0 130 15 L122 45" fill="#f5f6fa" stroke="#dcdde1" strokeWidth="1.5" />
      <path d="M72 25 L76 40" stroke="#ff80ab" strokeWidth="5" strokeLinecap="round" opacity="0.3" />
      <path d="M128 25 L124 40" stroke="#ff80ab" strokeWidth="5" strokeLinecap="round" opacity="0.3" />
    </g>
  ),
  optics: () => (
    <rect x="78" y="60" width="44" height="10" rx="5" fill="rgba(255, 118, 117, 0.3)" stroke="#ff7675" strokeWidth="1" />
  ),
  shield: () => (
    <path d="M50 80 Q100 60 150 80 Q160 130 100 170 Q40 130 50 80" 
          fill="rgba(116, 185, 255, 0.15)" stroke="#74b9ff" strokeWidth="2" strokeDasharray="4 2" />
  ),
  cape: () => (
    <path d="M65 95 Q30 95 20 160 Q100 180 180 160 Q170 95 135 95" fill="#ff7675" opacity="0.9" />
  ),
  flight: () => (
    <g className="booster-glow">
      <path d="M40 100 L10 70 L20 120 Z" fill="#fab1a0" opacity="0.8" />
      <path d="M160 100 L190 70 L180 120 Z" fill="#fab1a0" opacity="0.8" />
    </g>
  ),
  brain: () => (
    <path d="M85 45 Q100 30 115 45" fill="none" stroke="#a29bfe" strokeWidth="3" className="brain-wave" />
  ),
  drone: () => (
    <g className="drone-float">
      <circle cx="165" cy="45" r="8" fill="#55efc4" opacity="0.8" />
      <path d="M165 45 L155 35 M165 45 L175 35" stroke="#fff" strokeWidth="1.5" />
    </g>
  ),
  aura: () => (
    <g className="aura-sparkle">
      <circle cx="50" cy="50" r="2" fill="#fff9c4" />
      <circle cx="150" cy="40" r="1.5" fill="#fff9c4" />
      <circle cx="30" cy="120" r="2.5" fill="#fff9c4" />
      <circle cx="170" cy="110" r="2" fill="#fff9c4" />
    </g>
  ),
  crown: () => (
    <path d="M85 40 L90 30 L95 38 L100 30 L105 38 L110 30 L115 40 Z" fill="#fdcb6e" stroke="#f1c40f" />
  ),
  boots: () => (
    <g className="booster-glow">
      <path d="M75 170 L85 190 L95 170" fill="#ff7675" />
      <path d="M105 170 L115 190 L125 170" fill="#ff7675" />
    </g>
  )
};

const RobotSVG = ({ color = '#00d2ff', modules = [] }) => {
  const isEquipped = (id) => modules.includes(id);
  
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px rgba(0,210,255,0.4))' }}>
      {/* 부속 아이템 렌더링 */}
      {isEquipped('aura') && PART_SVGS.aura()}
      {isEquipped('flight') && PART_SVGS.flight()}
      {isEquipped('cape') && PART_SVGS.cape()}

      {/* 로봇 본체 */}
      <rect x="65" y="85" width="70" height="75" rx="15" fill="#f5f6fa" stroke="#dcdde1" strokeWidth="2" />
      <rect x="75" y="95" width="50" height="55" rx="10" fill="#2d3436" />
      <circle cx="100" cy="122" r="12" fill={color} className="core-pulse" />
      <circle cx="100" cy="122" r="6" fill="#fff" opacity="0.6" />

      {/* 로봇 머리 */}
      <rect x="75" y="45" width="50" height="40" rx="20" fill="#f5f6fa" stroke="#dcdde1" strokeWidth="2" />
      <rect x="80" y="50" width="40" height="30" rx="15" fill="#1e272e" />
      <g>
        <circle cx="90" cy="64" r="4" fill={color}><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" /></circle>
        <circle cx="110" cy="64" r="4" fill={color}><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" /></circle>
      </g>

      {/* 팔다리 */}
      {!isEquipped('boots') && (
        <g>
          <rect x="55" y="105" width="10" height="40" rx="5" fill="#f5f6fa" />
          <rect x="135" y="105" width="10" height="40" rx="5" fill="#f5f6fa" />
          <circle cx="85" cy="165" r="8" fill="#636e72" />
          <circle cx="115" cy="165" r="8" fill="#636e72" />
        </g>
      )}

      {/* 상단 레이어 아이템 */}
      {isEquipped('shield') && PART_SVGS.shield()}
      {isEquipped('optics') && PART_SVGS.optics()}
      {isEquipped('ears') && PART_SVGS.ears()}
      {isEquipped('brain') && PART_SVGS.brain()}
      {isEquipped('crown') && PART_SVGS.crown()}
      {isEquipped('drone') && PART_SVGS.drone()}
      {isEquipped('boots') && PART_SVGS.boots()}
    </svg>
  );
};

const RewardModal = ({ info, onClose }) => {
  if (!info.show) return null;

  return (
    <div style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', 
      zIndex: 9999,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <div className="page-enter" style={{
        background: 'white', 
        padding: '50px 30px', 
        borderRadius: '50px',
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        position: 'relative', 
        overflow: 'hidden',
        border: '8px solid rgba(255,255,255,0.1)'
      }}>
        {/* 장식용 배경 광채 */}
        <div style={{
          position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
          background: 'radial-gradient(circle, rgba(116, 185, 255, 0.3) 0%, transparent 60%)',
          animation: 'pulse 4s infinite'
        }}></div>

        <div style={{ 
          fontSize: '6rem', 
          marginBottom: '25px', 
          filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.2))', 
          animation: 'float 3s ease-in-out infinite',
          position: 'relative',
          zIndex: 1
        }}>💎</div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Jua', sans-serif", fontSize: '2.8rem', color: '#2d3436', margin: '0 0 10px 0' }}>데이터 획득!</h2>
          <div style={{ 
            fontSize: '2rem', fontWeight: '900', color: '#0984e3', 
            marginBottom: '25px', background: '#e1f5fe', 
            display: 'inline-block', padding: '10px 30px', borderRadius: '25px',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)'
          }}>
            + {info.amount} Fragments
          </div>
          
          <p style={{ color: '#636e72', fontSize: '1.2rem', marginBottom: '35px', lineHeight: '1.7', fontWeight: 'bold' }}>
            {info.message}
          </p>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{ 
              background: 'linear-gradient(135deg, #2d3436 0%, #000 100%)', 
              color: 'white', 
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)', 
              marginTop: 0,
              width: '100%', 
              fontSize: '1.3rem',
              padding: '20px',
              borderRadius: '25px'
            }}
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};

function Profile({ userId, userName, fragments, setFragments, avatarConfig, setAvatarConfig, onLogout }) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  // [마스터피스] 고품질 업그레이드 모듈 리스트
  const upgradeModules = [
    { id: 'ears', label: '감정감지 안테나', icon: '🐰', color: '#ff80ab', cost: 10, desc: '친구들의 마음을 읽는 귀여운 귀!' },
    { id: 'optics', label: '스캔 비전 고글', icon: '🥽', color: '#00d2ff', cost: 10, desc: '숨겨진 데이터를 찾아내는 최첨단 고글!' },
    { id: 'shield', label: '나노 입자 방패', icon: '🛡️', color: '#74b9ff', cost: 20, desc: '어떤 위험도 막아내는 투명 보호막!' },
    { id: 'cape', label: '슈퍼 히어로 망토', icon: '🧣', color: '#d63031', cost: 20, desc: '정의의 사도가 된 기분을 느껴봐!' },
    { id: 'flight', label: '플라즈마 부스터', icon: '🚀', color: '#ff7675', cost: 25, desc: '광속으로 하늘을 가르는 강력한 추진기!' },
    { id: 'brain', label: '하이퍼 연산 장치', icon: '📡', color: '#a29bfe', cost: 30, desc: '인공지능의 지능이 한계까지 올라가요!' },
    { id: 'drone', label: '서포트 펫 드론', icon: '🛰️', color: '#55efc4', cost: 35, desc: '모험을 함께할 듬직한 비행 친구!' },
    { id: 'aura', label: '전설의 황금 오라', icon: '✨', color: '#ffd700', cost: 40, desc: '온몸에서 뿜어져 나오는 승리의 광채!' },
    { id: 'crown', label: '데이터 마스터 관', icon: '👑', color: '#ffd700', cost: 50, desc: '가장 많은 지식을 쌓은 자의 증표!' },
    { id: 'boots', label: '중력 제어 슈즈', icon: '👟', color: '#455a64', cost: 15, desc: '땅에서도 하늘만큼 빠르게 달려요!' },
  ];

  const handleToggleModule = async (module) => {
    const isUnlocked = avatarConfig.unlocked?.includes(module.id) || module.cost === 0;
    
    if (fragments < module.cost && !isUnlocked) {
      alert('데이터 조각이 부족합니다! 미션을 더 수행해서 조각을 채취해올까요? 💪');
      return;
    }

    setIsUpdating(true);
    let newConfig = { ...avatarConfig };
    const currentSelected = avatarConfig.selectedModules || [];

    if (currentSelected.includes(module.id)) {
        newConfig.selectedModules = currentSelected.filter(id => id !== module.id);
    } else {
        newConfig.selectedModules = [...currentSelected, module.id];
    }
    
    if (!isUnlocked) {
      newConfig.unlocked = [...(avatarConfig.unlocked || []), module.id];
    }

    try {
      const actualCost = isUnlocked ? 0 : module.cost;
      const { error } = await supabase
        .from('students')
        .update({ 
          avatar_config: newConfig,
          fragments: fragments - actualCost
        })
        .eq('id', userId);

      if (error) throw error;

      setAvatarConfig(newConfig);
      if (actualCost > 0) setFragments(fragments - actualCost);
    } catch (err) {
      console.error('Module update error:', err);
      alert('안정적인 연결이 필요합니다. 저장 장치를 다시 확인해 주세요! 🛑');
    } finally {
      setIsUpdating(false);
    }
  };

  const selectedModules = avatarConfig.selectedModules || [];

  return (
    <div className="page-enter" style={{ padding: '20px', paddingBottom: '120px', background: '#f9f9fb', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ 
          fontFamily: "'Jua', sans-serif", 
          fontSize: '2.4rem', 
          color: '#1a1a1a',
          margin: 0,
          textShadow: '2px 2px 0 #fff, 4px 4px 20px rgba(0,0,0,0.1)'
        }}>AI 비밀 요원 연구소</h2>
        <p style={{ color: '#546e7a', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '5px' }}>
          획득한 데이터 조각으로 당신의 파트너 로봇을 커스터마이징 하세요.
        </p>
      </div>

      {/* [마스터피스] 프리미엄 실험실 스테이지 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f2f6 100%)', 
        border: '5px solid #fff',
        padding: '35px', 
        borderRadius: '50px', 
        boxShadow: '0 25px 60px rgba(0,0,0,0.1)', 
        marginBottom: '30px', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* 하이테크 격자 배경 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'radial-gradient(#dfe6e9 1px, transparent 1px)',
          backgroundSize: '25px 25px', opacity: 0.3
        }}></div>

        <div style={{ width: '250px', height: '250px', position: 'relative', zIndex: 1, animation: 'float 5s ease-in-out infinite' }}>
            <RobotSVG color="#00d2ff" modules={selectedModules} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', zIndex: 1 }}>
            <div style={{ 
                background: '#2d3436', color: '#fff', 
                padding: '6px 20px', borderRadius: '30px',
                fontSize: '0.9rem', fontWeight: 'bold',
                marginBottom: '10px', display: 'inline-block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
                ID: {userName} AGENT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2.5rem', animation: 'pulse 1.5s infinite' }}>💎</span>
                <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#2d3436' }}>{fragments}</span>
                <span style={{ fontSize: '1.2rem', color: '#636e72', fontWeight: 'bold' }}>DATA</span>
            </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
            <span style={{ width: '12px', height: '12px', background: '#00d2ff', borderRadius: '50%' }}></span>
            <h4 style={{ fontFamily: "'Jua', sans-serif", fontSize: '1.4rem', color: '#2d3436', margin: 0 }}>업그레이드 부품 카탈로그</h4>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '18px' }}>
          {upgradeModules.map(m => {
            const isActive = selectedModules.includes(m.id);
            const isUnlocked = avatarConfig.unlocked?.includes(m.id) || m.cost === 0;
            return (
              <button 
                key={m.id}
                onClick={() => handleToggleModule(m)}
                disabled={isUpdating}
                style={{
                  background: isActive ? '#fff' : '#f8f9fa',
                  border: isActive ? `4px solid ${m.color}` : '4px solid #fff',
                  padding: '20px',
                  borderRadius: '35px',
                  color: '#2d3436',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: isActive ? `0 15px 30px ${m.color}33` : '0 8px 0 #dfe6e9',
                  transform: isActive ? 'translateY(-5px)' : 'none'
                }}
              >
                {/* 1:1 일관성을 위한 SVG 아이콘 */}
                <div style={{ width: '80px', height: '80px' }}>
                  <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                    {PART_SVGS[m.id]()}
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', fontFamily: "'Jua', sans-serif", marginBottom: '3px' }}>{m.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#636e72', lineHeight: '1.3', height: '2.6em', overflow: 'hidden' }}>{m.desc}</div>
                  
                  <div style={{ 
                    marginTop: '12px',
                    fontSize: '0.85rem', 
                    padding: '8px 15px', 
                    borderRadius: '20px',
                    background: isUnlocked ? (isActive ? m.color : '#2d3436') : '#0984e3',
                    color: '#fff',
                    fontWeight: '900',
                    boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                  }}>
                      {isUnlocked ? (isActive ? '장착 해제' : '장착하기') : `💎 ${m.cost} 소모`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={onLogout} 
          style={{ 
            background: '#ff7675',
            border: 'none',
            color: '#fff',
            padding: '20px',
            borderRadius: '30px',
            marginTop: '30px',
            cursor: 'pointer',
            fontWeight: '900',
            fontFamily: "'Jua', sans-serif",
            fontSize: '1.3rem',
            boxShadow: '0 8px 0 #d63031',
            transition: 'all 0.2s'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 4px 0 #d63031'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 0 #d63031'; }}
        >
          실험실 기록 저장 및 로그아웃
        </button>
      </div>
    </div>
  );
}

// 학년 → 학년군 파싱 (1-2학년: 'lower' / 3-4학년: 'middle' / 5-6학년: 'upper')
function parseGradeGroup(studentId) {
  try {
    if (studentId && studentId.length === 7) {
      const grade = parseInt(studentId.substring(2, 3), 10);
      if (grade <= 2) return 'lower';
      if (grade <= 4) return 'middle';
      return 'upper';
    }
  } catch (e) {}
  return 'lower';
}

function App() {
  const [missions, setMissions] = React.useState(INITIAL_MISSIONS);
  const [userId, setUserId] = React.useState(null);
  const [userName, setUserName] = React.useState('');
  const [fragments, setFragments] = React.useState(0);
  const [avatarConfig, setAvatarConfig] = React.useState({});
  const [schoolId, setSchoolId] = React.useState('gyeongdong');
  const [gradeGroup, setGradeGroup] = React.useState('lower');
  const [justAttended, setJustAttended] = React.useState(false);
  const [rewardInfo, setRewardInfo] = React.useState({ show: false, amount: 0, message: '' });

  const handleReward = (amount, message) => {
    setRewardInfo({ show: true, amount, message });
  };

  const handleLogin = (student) => {
    setUserId(student.id);
    setFragments(student.fragments || 0);
    setAvatarConfig(student.avatar_config || { body: "basic", color: "blue", accessory: "none" });
    if (student.schoolId) setSchoolId(student.schoolId);
    setGradeGroup(parseGradeGroup(student.id));
    if (student.justAttended) {
      handleReward(3, "오늘의 첫 접속 보상입니다! 반가워요!");
    }

    // If name is saved in DB, use it, else fallback to parsing ID
    if (student.name) {
      setUserName(student.name);
    } else {
      // Parse ID: 26 (year) + 1 (grade) + 01 (class) + 01 (number)
      try {
        const id = student.id;
        if (id && id.length === 7) {
          const grade = id.substring(2, 3);
          const classNum = parseInt(id.substring(3, 5), 10);
          const studentNum = parseInt(id.substring(5, 7), 10);
          setUserName(`${grade}학년 ${classNum}반 ${studentNum}번`);
        } else {
          setUserName(id);
        }
      } catch (e) {
        setUserName('학생');
      }
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName('');
    setSchoolId('gyeongdong');
    setGradeGroup('lower');
    setMissions(INITIAL_MISSIONS);
  };
  React.useEffect(() => {
    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  const fetchProgress = async () => {
    try {
      // 1. Fetch user_progress
      const { data: progressData, error: progError } = await supabase
        .from('user_progress')
        .select('mission_id, completed')
        .eq('user_id', userId);

      if (progError) throw progError;

      // 2. Fetch mission_submissions to check for teacher feedback
      const { data: submissionData, error: subError } = await supabase
        .from('mission_submissions')
        .select('mission_id, data')
        .eq('user_id', userId);

      if (subError) throw subError;

      // Merge fetched data strictly with INITIAL_MISSIONS
      setMissions(INITIAL_MISSIONS.map(m => {
        const prog = (progressData || []).find(d => d.mission_id === m.id);
        const sub = (submissionData || []).find(d => d.mission_id === m.id);
        
        if (prog) {
          if (prog.completed) return { ...m, status: 'completed' };
          
          // If not completed, check if teacher feedback exists
          if (sub?.data?.teacher_feedback) {
            return { ...m, status: 'supplement' };
          }
          return { ...m, status: 'pending' };
        }
        return { ...m, status: 'unlocked' };
      }));
    } catch (err) {
      console.error('Unexpected error fetching progress:', err);
    }
  };

  const completedCount = missions.filter(m => m.status === 'completed').length;
  // Based on 16 total missions
  const progressPercentage = Math.round((completedCount / 16) * 100);

  return (
    <Router>
      {userId && (
        <header className="app-header">
          <div className="header-top">
            <h1 className="app-title" style={{ fontSize: '1.6rem' }}>나의 AI 리터러시 능력 도감</h1>
            <div className="user-profile" style={{ flexDirection: 'column', alignItems: 'flex-end', background: 'transparent', padding: 0 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
                  {userName}
                </div>
                <div style={{ background: '#74b9ff', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '900', boxShadow: '0 4px 6px rgba(116, 185, 255, 0.3)', fontSize: '0.9rem' }}>
                  💎 {fragments}
                </div>
              </div>
              <div style={{ background: '#ffa502', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '900', boxShadow: '0 4px 6px rgba(255, 165, 2, 0.3)', fontSize: '0.9rem', marginTop: '8px' }}>
                {completedCount} / 16 뱃지
              </div>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%`, transition: 'width 1s ease-out' }}></div>
          </div>
        </header>
      )}

      <main className="main-content" style={{ paddingBottom: userId ? '100px' : '0', padding: userId ? '20px' : '0' }}>
        <Routes>
          <Route path="/" element={userId ? <Dashboard missions={missions} refresh={fetchProgress} justAttended={false} setJustAttended={() => {}} /> : <Login onLogin={handleLogin} />} />
          <Route path="/mission/:missionId" element={userId ? <Mission userId={userId} schoolId={schoolId} gradeGroup={gradeGroup} setFragments={setFragments} onReward={handleReward} /> : <Login onLogin={handleLogin} />} />
          <Route path="/minigame" element={userId ? <MiniGame userId={userId} schoolId={schoolId} gradeGroup={gradeGroup} userName={userName} setFragments={setFragments} onReward={handleReward} /> : <Login onLogin={handleLogin} />} />
          <Route path="/discussion" element={userId ? <Discussion userId={userId} schoolId={schoolId} gradeGroup={gradeGroup} userName={userName} setFragments={setFragments} onReward={handleReward} /> : <Login onLogin={handleLogin} />} />
          <Route path="/profile" element={userId ? <Profile userId={userId} userName={userName} fragments={fragments} setFragments={setFragments} avatarConfig={avatarConfig} setAvatarConfig={setAvatarConfig} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <RewardModal info={rewardInfo} onClose={() => setRewardInfo({ ...rewardInfo, show: false })} />


      {userId && <Navigation />}
    </Router>
  );
}

export default App;
