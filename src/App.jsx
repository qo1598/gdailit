import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, UserCircle, MessageCircle, ClipboardList, Cpu } from 'lucide-react';
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
  { id: 'E-1', title: '내 주변 숨은 AI 찾기 대작전!', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e1_find_1773234874913.png' },
  { id: 'E-2', title: '사실 확인 전문가, AI의 거짓말을 잡아라!', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e2_trust_1773234890193.png', silhouetteUrl: '/e2_silhouette.png' },
  { id: 'E-3', title: '알고리즘의 꼬리 잡기', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e3_recommend_1773234908058.png' },
  { id: 'E-4', title: 'AI는 모든 친구에게 친절할까?', competency: 'AI 인식 및 발견', status: 'unlocked', imageUrl: '/e4_fairness_1773234925903.png' },

  { id: 'C-1', title: '판타지 릴레이 동화 쓰기!', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c1_story_1773234941443.png' },
  { id: 'C-2', title: '불량 그림 수리 대작전', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c2_art_1773234957163.png' },
  { id: 'C-3', title: '오싹오싹 마법의 카피라이터', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c3_poster_1773234969699.png' },
  { id: 'C-4', title: '나의 노력, 정직한 마침표', competency: 'AI와 창의적 활용', status: 'unlocked', imageUrl: '/c4_copyright_1773234984925.png' },

  { id: 'M-1', title: '생각 지휘본부, 나의 주도권을 지켜라!', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m1_rules_1773234999640.png' },
  { id: 'M-2', title: '명확한 선 긋기! 네 일은 네가, 내 일은 내가!', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m2_roles_1773235015302.png' },
  { id: 'M-3', title: '마법 양탄자를 조종하는 슈퍼 프롬프트!', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m3_prompt_1773235032419.png' },
  { id: 'M-4', title: '신사숙녀 여러분의 AI 매너 헌장', competency: 'AI 사용 판단 및 윤리', status: 'unlocked', imageUrl: '/m4_promise_1773235045836.png' },

  { id: 'D-1', title: '끼리끼리 유유상종! 우리끼리 묶기 분류 놀이!', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-2', title: '쓰레기를 먹으면 배가 아파요! 깨끗한 데이터 밥 주기', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-3', title: '깡통 로봇 시력 검사용 지옥의 함정 테스트!', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' },
  { id: 'D-4', title: '학교 평화 수호의 심장, 천재 AI 설계 마스터 도면 짜기', competency: 'AI 원리 체험', status: 'unlocked', imageUrl: '/d1_sort_1773235059334.png' }
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

// [마스터피스] 칩 아이콘 (반도체 부품 디자인으로 개편)
const ChipIcon = ({ size = 20, color = "#00d2ff", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle', display: 'inline-block', ...style }}>
    <rect x="5" y="5" width="14" height="14" rx="2" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" fill={color} />
    {/* 반도체 핀(Pins) 표현 */}
    <path d="M9 2V5M15 2V5M9 19V22M15 19V22M2 9H5M2 15H5M19 9H22M19 15H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

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
  ),
  cap: () => (
    <g>
      <path d="M75 55 Q100 30 125 55 L135 55 L135 60 L75 60 Z" fill="#3498db" />
      <path d="M125 55 Q140 55 145 65" stroke="#3498db" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  ),
  sunglasses: () => (
    <g>
      <rect x="80" y="60" width="18" height="10" rx="3" fill="#2d3436" />
      <rect x="102" y="60" width="18" height="10" rx="3" fill="#2d3436" />
      <path d="M98 62 L102 62" stroke="#2d3436" strokeWidth="2" />
      <path d="M80 62 L75 60 M120 62 L125 60" stroke="#2d3436" strokeWidth="2" />
    </g>
  ),
  armor: () => (
    <g>
      <path d="M75 95 L125 95 L120 145 L100 155 L80 145 Z" fill="#b2bec3" stroke="#636e72" strokeWidth="2" />
      <path d="M85 110 L115 110 M85 125 L115 125" stroke="#636e72" strokeWidth="2" />
      <circle cx="100" cy="122" r="8" fill="#0984e3" />
    </g>
  ),
  backpack: () => (
    <g>
      <rect x="55" y="100" width="90" height="45" rx="8" fill="#27ae60" opacity="0.8" />
      <path d="M65 95 L65 110 M135 95 L135 110" stroke="#2d3436" strokeWidth="4" />
    </g>
  ),
  watch: () => (
    <g>
      <rect x="53" y="125" width="14" height="6" fill="#e74c3c" />
      <rect x="56" y="123" width="8" height="10" rx="2" fill="#2d3436" />
    </g>
  ),
  sneakers: () => (
    <g>
      <rect x="75" y="165" width="16" height="14" rx="4" fill="#e74c3c" />
      <rect x="109" y="165" width="16" height="14" rx="4" fill="#e74c3c" />
      <path d="M75 175 L91 175 M109 175 L125 175" stroke="#fff" strokeWidth="3" />
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
      {isEquipped('backpack') && PART_SVGS.backpack()}

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
      {isEquipped('armor') && PART_SVGS.armor()}
      {isEquipped('optics') && PART_SVGS.optics()}
      {isEquipped('sunglasses') && PART_SVGS.sunglasses()}
      {isEquipped('ears') && PART_SVGS.ears()}
      {isEquipped('brain') && PART_SVGS.brain()}
      {isEquipped('crown') && PART_SVGS.crown()}
      {isEquipped('cap') && PART_SVGS.cap()}
      {isEquipped('drone') && PART_SVGS.drone()}
      {isEquipped('watch') && PART_SVGS.watch()}
      {isEquipped('boots') && PART_SVGS.boots()}
      {isEquipped('sneakers') && PART_SVGS.sneakers()}
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
          marginBottom: '25px',
          filter: 'drop-shadow(0 15px 30px rgba(0,210,255,0.4))',
          animation: 'float 3s ease-in-out infinite',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <ChipIcon size={120} color="#00d2ff" />
        </div>

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

const ItemIcon = ({ moduleId }) => {
  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Faded robot silhouette for context */}
      <g opacity="0.08">
        <rect x="65" y="85" width="70" height="75" rx="15" fill="#2d3436" />
        <rect x="75" y="45" width="50" height="40" rx="20" fill="#2d3436" />
        <rect x="55" y="105" width="10" height="40" rx="5" fill="#2d3436" />
        <rect x="135" y="105" width="10" height="40" rx="5" fill="#2d3436" />
        <circle cx="85" cy="165" r="8" fill="#2d3436" />
        <circle cx="115" cy="165" r="8" fill="#2d3436" />
      </g>
      {/* Actual item */}
      {PART_SVGS[moduleId] && PART_SVGS[moduleId]()}
    </svg>
  );
};

function Profile({ userId, userName, fragments, setFragments, avatarConfig, setAvatarConfig, onLogout }) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('all'); // for inventory filtering

  const upgradeModules = [
    { id: 'ears', category: 'head', label: '감정감지 안테나', icon: '🐰', color: '#ff80ab', cost: 10 },
    { id: 'cap', category: 'head', label: '블루 캡', color: '#3498db', cost: 5 },
    { id: 'brain', category: 'head', label: '하이퍼 연산 장치', color: '#a29bfe', cost: 30 },
    { id: 'crown', category: 'head', label: '데이터 관', color: '#ffd700', cost: 50 },

    { id: 'optics', category: 'face', label: '스캔 고글', color: '#00d2ff', cost: 10 },
    { id: 'sunglasses', category: 'face', label: '선글라스', color: '#2d3436', cost: 15 },

    { id: 'shield', category: 'body', label: '방패', color: '#74b9ff', cost: 20 },
    { id: 'armor', category: 'body', label: '아머 플레이트', color: '#b2bec3', cost: 25 },

    { id: 'cape', category: 'back', label: '히어로 망토', color: '#d63031', cost: 20 },
    { id: 'backpack', category: 'back', label: '백팩', color: '#27ae60', cost: 15 },
    { id: 'flight', category: 'back', label: '플라즈마 부스터', color: '#ff7675', cost: 25 },

    { id: 'watch', category: 'acc', label: '스마트 워치', color: '#e74c3c', cost: 5 },
    { id: 'drone', category: 'acc', label: '드론', color: '#55efc4', cost: 35 },
    { id: 'aura', category: 'acc', label: '황금 오라', color: '#ffd700', cost: 40 },

    { id: 'sneakers', category: 'feet', label: '스니커즈', color: '#e74c3c', cost: 10 },
    { id: 'boots', category: 'feet', label: '중력 슈즈', color: '#455a64', cost: 15 },
  ];

  const handleToggleModule = async (module) => {
    const isUnlocked = avatarConfig.unlocked?.includes(module.id) || module.cost === 0;

    if (fragments < module.cost && !isUnlocked) {
      alert('데이터 조각이 부족합니다! 미션을 더 수행해서 조각을 채취해올까요? 💪');
      return;
    }

    setIsUpdating(true);
    let newConfig = { ...avatarConfig };
    let currentSelected = [...(avatarConfig.selectedModules || [])];

    // Check if equipping or unequipping
    const isCurrentlyEquipped = currentSelected.includes(module.id);

    if (isCurrentlyEquipped) {
      // Unequip
      currentSelected = currentSelected.filter(id => id !== module.id);
    } else {
      // Equip -> But must remove other items of the same category to prevent overlap
      const moduleCategory = module.category;
      const sameCategoryItems = upgradeModules.filter(m => m.category === moduleCategory).map(m => m.id);
      currentSelected = currentSelected.filter(id => !sameCategoryItems.includes(id));
      currentSelected.push(module.id);
    }

    newConfig.selectedModules = currentSelected;

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

  const getEquippedModule = (category) => {
    const equippedId = selectedModules.find(id => {
      const mod = upgradeModules.find(m => m.id === id);
      return mod && mod.category === category;
    });
    return upgradeModules.find(m => m.id === equippedId);
  };

  return (
    <div className="page-enter" style={{
      background: '#fcfcf7', // Light beige matching the image
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      padding: '40px 20px 140px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      margin: '0 auto'
    }}>

      {/* Title */}
      <h2 style={{
        textAlign: 'center',
        fontFamily: "'NanumSquareNeo-Variable', sans-serif",
        fontSize: '2.2rem',
        color: '#2d3436',
        margin: '0 0 40px 0',
        fontWeight: '900',
        letterSpacing: '-1.5px'
      }}>
        [아바타 꾸미기]
      </h2>

      {/* Avatar Layout Center */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', padding: '0 10px' }}>

        {/* Left Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {['head', 'body', 'feet'].map(cat => {
            const eq = getEquippedModule(cat);
            return (
              <div key={cat} style={{
                width: '75px', height: '75px',
                background: eq ? '#fff' : '#e0dfd5',
                border: '4px solid #b2bec3',
                borderRadius: '18px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: eq ? `0 0 15px ${eq.color}40` : 'inset 0 4px 6px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }} title={eq ? eq.label : 'Empty'} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                {eq ? <div style={{ width: '85%', height: '85%' }}><ItemIcon moduleId={eq.id} /></div> : <span style={{ opacity: 0.2, fontSize: '2.2rem' }}>{cat === 'head' ? '🧢' : cat === 'body' ? '👕' : '👟'}</span>}
              </div>
            );
          })}
        </div>

        {/* Robot SVG Center */}
        <div style={{ width: '220px', height: '220px', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '80%', height: '25px', background: 'rgba(0,0,0,0.08)', borderRadius: '50%', filter: 'blur(5px)' }}></div>
          <RobotSVG color="#00d2ff" modules={selectedModules} />
        </div>

        {/* Right Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {['face', 'back', 'acc'].map(cat => {
            const eq = getEquippedModule(cat);
            return (
              <div key={cat} style={{
                width: '75px', height: '75px',
                background: eq ? '#fff' : '#e0dfd5',
                border: '4px solid #b2bec3',
                borderRadius: '18px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: eq ? `0 0 15px ${eq.color}40` : 'inset 0 4px 6px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }} title={eq ? eq.label : 'Empty'} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                {eq ? <div style={{ width: '85%', height: '85%' }}><ItemIcon moduleId={eq.id} /></div> : <span style={{ opacity: 0.2, fontSize: '2.2rem' }}>{cat === 'face' ? '👓' : cat === 'back' ? '🎒' : '✨'}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventory Section (아이템 구비) */}
      <div style={{ borderTop: '2px solid #e0dfd5', paddingTop: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: "'NanumSquareNeo-Variable', sans-serif", color: '#2d3436', fontWeight: 'bold' }}>아이템 구비</h3>
          <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0984e3', background: '#e1f5fe', padding: '4px 12px', borderRadius: '15px' }}>
            <ChipIcon size={18} style={{ marginRight: '6px' }} /> {fragments}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="hide-scroll">
          {[
            { id: 'all', name: '전체' },
            { id: 'head', name: '머리' },
            { id: 'face', name: '얼굴' },
            { id: 'body', name: '몸통' },
            { id: 'back', name: '등' },
            { id: 'acc', name: '장신구' },
            { id: 'feet', name: '신발' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                background: activeCategory === cat.id ? '#0984e3' : '#e0dfd5',
                color: activeCategory === cat.id ? '#fff' : '#636e72',
                whiteSpace: 'nowrap',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          alignContent: 'start',
          flex: 1,
          overflowY: 'auto'
        }}>
          {upgradeModules.filter(m => activeCategory === 'all' || m.category === activeCategory).map(m => {
            const isActive = selectedModules.includes(m.id);
            const isUnlocked = avatarConfig.unlocked?.includes(m.id) || m.cost === 0;

            return (
              <button
                key={m.id}
                onClick={() => handleToggleModule(m)}
                disabled={isUpdating}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: isActive ? '#fff' : (isUnlocked ? '#fcfcf7' : '#f5f6fa'),
                  border: isActive ? `3px solid ${m.color}` : '2px solid #b2bec3',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? `0 4px 8px ${m.color}60` : '0 2px 4px rgba(0,0,0,0.05)',
                  padding: '5px'
                }}
                title={`${m.label} - ${isUnlocked ? '보유중' : m.cost + ' Chips'}`}
              >
                <div style={{ width: '100%', height: '100%', filter: !isUnlocked ? 'grayscale(100%) opacity(40%)' : 'none' }}>
                  <ItemIcon moduleId={m.id} />
                </div>

                {isActive && (
                  <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#fff', borderRadius: '50%', color: m.color, fontSize: '0.8rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${m.color}`, fontWeight: 'bold', zIndex: 10 }}>✓</div>
                )}

                {!isUnlocked && (
                  <div style={{ position: 'absolute', bottom: '2px', fontSize: '0.7rem', fontWeight: 'bold', color: '#b2bec3', background: 'rgba(255,255,255,0.9)', padding: '0 4px', borderRadius: '4px', zIndex: 10 }}>
                    <ChipIcon size={12} style={{ marginRight: '3px' }} /> {m.cost}
                  </div>
                )}
              </button>
            );
          })}

          {/* Empty filler slots */}
          {Array.from({ length: Math.max(0, 10 - upgradeModules.filter(m => activeCategory === 'all' || m.category === activeCategory).length) }).map((_, i) => (
            <div key={`empty-${i}`} style={{ width: '100%', aspectRatio: '1', background: '#e0dfd5', border: '2px solid #b2bec3', borderRadius: '12px', opacity: 0.3 }} />
          ))}
        </div>
      </div>

      <button
        onClick={onLogout}
        style={{
          background: 'transparent',
          border: '2px solid #ff7675',
          color: '#ff7675',
          padding: '12px',
          borderRadius: '15px',
          marginTop: '25px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          transition: 'all 0.2s',
          alignSelf: 'center',
          width: '80%'
        }}
      >
        로그아웃
      </button>
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
  } catch (e) { }
  return 'lower';
}

function AppContent() {
  const [missions, setMissions] = React.useState(INITIAL_MISSIONS);
  const [userId, setUserId] = React.useState(null);
  const [userName, setUserName] = React.useState('');
  const [fragments, setFragments] = React.useState(0);
  const [avatarConfig, setAvatarConfig] = React.useState({});
  const [schoolId, setSchoolId] = React.useState('gyeongdong');
  const [gradeGroup, setGradeGroup] = React.useState('lower');
  const [justAttended, setJustAttended] = React.useState(false);
  const [rewardInfo, setRewardInfo] = React.useState({ show: false, amount: 0, message: '' });
  const [isLoading, setIsLoading] = React.useState(true);

  const handleReward = (amount, message) => {
    setRewardInfo({ show: true, amount, message });
  };

  const handleLogin = (student) => {
    const userId = student.id;
    const fragments = student.fragments || 0;
    const avatarConfig = student.avatar_config || { body: "basic", color: "blue", accessory: "none" };
    const schoolId = student.schoolId || 'gyeongdong';
    const gradeGroup = parseGradeGroup(student.id);

    setUserId(userId);
    setFragments(fragments);
    setAvatarConfig(avatarConfig);
    setSchoolId(schoolId);
    setGradeGroup(gradeGroup);

    // 로컬 스토리지에 세션 저장
    localStorage.setItem('userId', userId);
    localStorage.setItem('fragments', fragments.toString());
    localStorage.setItem('avatarConfig', JSON.stringify(avatarConfig));
    localStorage.setItem('schoolId', schoolId);
    localStorage.setItem('gradeGroup', gradeGroup);

    if (student.justAttended) {
      handleReward(3, "오늘의 첫 접속 보상입니다! 반가워요!");
    }

    // If name is saved in DB, use it, else fallback to parsing ID
    let userName;
    if (student.name) {
      userName = student.name;
    } else {
      // Parse ID: 26 (year) + 1 (grade) + 01 (class) + 01 (number)
      try {
        const id = student.id;
        if (id && id.length === 7) {
          const grade = id.substring(2, 3);
          const classNum = parseInt(id.substring(3, 5), 10);
          const studentNum = parseInt(id.substring(5, 7), 10);
          userName = `${grade}학년 ${classNum}반 ${studentNum}번`;
        } else {
          userName = id;
        }
      } catch (e) {
        userName = '학생';
      }
    }

    setUserName(userName);
    localStorage.setItem('userName', userName);
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName('');
    setSchoolId('gyeongdong');
    setGradeGroup('lower');
    setMissions(INITIAL_MISSIONS);

    // 로컬 스토리지 클리어
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('fragments');
    localStorage.removeItem('avatarConfig');
    localStorage.removeItem('schoolId');
    localStorage.removeItem('gradeGroup');
  };
  // 페이지 로드 시 세션 복원
  React.useEffect(() => {
    const restoreSession = () => {
      const savedUserId = localStorage.getItem('userId');
      const savedUserName = localStorage.getItem('userName');
      const savedFragments = localStorage.getItem('fragments');
      const savedAvatarConfig = localStorage.getItem('avatarConfig');
      const savedSchoolId = localStorage.getItem('schoolId');
      const savedGradeGroup = localStorage.getItem('gradeGroup');

      if (savedUserId) {
        setUserId(savedUserId);
        setUserName(savedUserName || '');
        setFragments(parseInt(savedFragments) || 0);
        setAvatarConfig(savedAvatarConfig ? JSON.parse(savedAvatarConfig) : {});
        setSchoolId(savedSchoolId || 'gyeongdong');
        setGradeGroup(savedGradeGroup || 'lower');
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

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
    <>
      {userId && (
        <>
          {/* ===== PC/태블릿 헤더 (768px 이상) ===== */}
          <header className="app-header header-desktop">
            <div className="header-top">
              <h1 className="app-title">나의 AI 리터러시 능력 도감</h1>
              <div className="user-profile" style={{ flexDirection: 'column', alignItems: 'flex-end', background: 'transparent', padding: 0 }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.25)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
                    {userName}
                  </div>
                  <div style={{ background: '#74b9ff', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '900', boxShadow: '0 4px 6px rgba(116, 185, 255, 0.3)', fontSize: '0.9rem' }}>
                    <ChipIcon size={18} color="white" style={{ marginRight: '6px' }} /> {fragments}
                  </div>
                </div>
                <div style={{ background: '#ffa502', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '900', boxShadow: '0 4px 6px rgba(255, 165, 2, 0.3)', fontSize: '0.9rem', marginTop: '8px' }}>
                  {completedCount} / 16 뱃지
                </div>
              </div>
            </div>
          </header>

          {/* ===== 모바일 헤더 (767px 이하) ===== */}
          <header className="app-header header-mobile" style={{ padding: '8px 12px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
            <h1 className="app-title" style={{ fontSize: '1.1rem', textAlign: 'center', marginBottom: '6px' }}>나의 AI 리터러시 능력 도감</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.25)', padding: '3px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {userName}
              </div>
              <div style={{ background: '#74b9ff', color: 'white', padding: '3px 10px', borderRadius: '15px', fontWeight: '900', fontSize: '0.75rem' }}>
                <ChipIcon size={14} color="white" style={{ marginRight: '4px' }} />{fragments}
              </div>
              <div style={{ background: '#ffa502', color: 'white', padding: '3px 10px', borderRadius: '15px', fontWeight: '900', fontSize: '0.75rem' }}>
                {completedCount}/16 뱃지
              </div>
            </div>
          </header>
        </>
      )}

      <main className="main-content" style={{ padding: userId ? '15px' : '0' }}>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">로딩 중...</div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={userId ? <Dashboard missions={missions} refresh={fetchProgress} justAttended={false} setJustAttended={() => { }} gradeGroup={gradeGroup} /> : <Login onLogin={handleLogin} />} />
            <Route path="/mission/:missionId/:gradeGroup" element={userId ? <Mission userId={userId} schoolId={schoolId} userName={userName} setFragments={setFragments} onReward={handleReward} /> : <Login onLogin={handleLogin} />} />
            <Route path="/minigame" element={userId ? <MiniGame userId={userId} schoolId={schoolId} gradeGroup={gradeGroup} userName={userName} setFragments={setFragments} onReward={handleReward} /> : <Login onLogin={handleLogin} />} />
            <Route path="/discussion" element={userId ? <Discussion userId={userId} schoolId={schoolId} gradeGroup={gradeGroup} userName={userName} setFragments={setFragments} onReward={handleReward} /> : <Login onLogin={handleLogin} />} />
            <Route path="/profile" element={userId ? <Profile userId={userId} userName={userName} fragments={fragments} setFragments={setFragments} avatarConfig={avatarConfig} setAvatarConfig={setAvatarConfig} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        )}
      </main>

      <RewardModal info={rewardInfo} onClose={() => setRewardInfo({ ...rewardInfo, show: false })} />

      {userId && <Navigation />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
