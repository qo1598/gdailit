import React from 'react';

// ─── Shared wrapper ──────────────────────────────────────────────────────────
const Svg = ({ children, bg, size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill={bg} />
    {children}
  </svg>
);

// ─── Step 1: AI Items ────────────────────────────────────────────────────────
export const RobotVacuumIcon = ({ size = 64 }) => (
  <Svg bg="#DBEAFE" size={size}>
    <ellipse cx="32" cy="46" rx="21" ry="12" fill="#94A3B8" />
    <ellipse cx="32" cy="36" rx="21" ry="14" fill="#E2E8F0" />
    <ellipse cx="32" cy="35" rx="17" ry="11" fill="#F1F5F9" />
    <circle cx="25" cy="32" r="5" fill="#3B82F6" />
    <circle cx="25" cy="32" r="2.5" fill="white" />
    <circle cx="39" cy="32" r="5" fill="#3B82F6" />
    <circle cx="39" cy="32" r="2.5" fill="white" />
    <circle cx="25" cy="31" r="1" fill="#93C5FD" />
    <circle cx="39" cy="31" r="1" fill="#93C5FD" />
    <rect x="27" y="40" width="10" height="3" rx="1.5" fill="#60A5FA" />
    <rect x="9" y="43" width="7" height="12" rx="3.5" fill="#64748B" />
    <rect x="48" y="43" width="7" height="12" rx="3.5" fill="#64748B" />
  </Svg>
);

export const VoiceAssistantIcon = ({ size = 64 }) => (
  <Svg bg="#F3E5F5" size={size}>
    <rect x="20" y="16" width="24" height="34" rx="12" fill="#AB47BC" />
    <rect x="22" y="16" width="10" height="34" rx="10" fill="#CE93D8" opacity="0.4" />
    <ellipse cx="32" cy="47" rx="10" ry="3.5" fill="#7B1FA2" />
    <ellipse cx="32" cy="47" rx="6" ry="2" fill="#E1BEE7" />
    <circle cx="32" cy="21" r="4" fill="#CE93D8" />
    <circle cx="32" cy="21" r="2" fill="#F3E5F5" />
    <path d="M13 25 Q8 32 13 39" stroke="#CE93D8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M10 22 Q3 32 10 42" stroke="#CE93D8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
    <path d="M51 25 Q56 32 51 39" stroke="#CE93D8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M54 22 Q61 32 54 42" stroke="#CE93D8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
  </Svg>
);

export const RecommendFeedIcon = ({ size = 64 }) => (
  <Svg bg="#FFF3E0" size={size}>
    <rect x="18" y="10" width="28" height="46" rx="7" fill="#37474F" />
    <rect x="20" y="14" width="24" height="38" rx="5" fill="#263238" />
    <rect x="21" y="15" width="10" height="9" rx="2" fill="#FF7043" />
    <rect x="33" y="15" width="10" height="9" rx="2" fill="#FFA726" />
    <rect x="21" y="26" width="10" height="9" rx="2" fill="#66BB6A" />
    <rect x="33" y="26" width="10" height="9" rx="2" fill="#42A5F5" />
    <rect x="21" y="37" width="10" height="9" rx="2" fill="#EC407A" />
    <rect x="33" y="37" width="10" height="9" rx="2" fill="#7E57C2" />
    <polygon points="25,19 29,19.5 25,23" fill="white" opacity="0.8" />
    <polygon points="37,19 41,19.5 37,23" fill="white" opacity="0.8" />
    <circle cx="32" cy="54" r="2.5" fill="#546E7A" />
  </Svg>
);

export const FaceUnlockIcon = ({ size = 64 }) => (
  <Svg bg="#E1F5FE" size={size}>
    <circle cx="32" cy="32" r="14" fill="white" stroke="#0288D1" strokeWidth="2" />
    <ellipse cx="27" cy="29" rx="3" ry="4" fill="#0288D1" />
    <ellipse cx="37" cy="29" rx="3" ry="4" fill="#0288D1" />
    <circle cx="27" cy="28" r="1.2" fill="white" />
    <circle cx="37" cy="28" r="1.2" fill="white" />
    <path d="M27 38 Q32 43 37 38" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="34" r="1.5" fill="#4FC3F7" />
    <path d="M8 16 L8 22 M8 16 L14 16" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M56 16 L56 22 M56 16 L50 16" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M8 48 L8 42 M8 48 L14 48" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M56 48 L56 42 M56 48 L50 48" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="32" r="2" fill="#B3E5FC" opacity="0.5" />
  </Svg>
);

export const CalculatorIcon = ({ size = 64 }) => (
  <Svg bg="#ECEFF1" size={size}>
    <rect x="14" y="10" width="36" height="44" rx="8" fill="#78909C" />
    <rect x="17" y="13" width="30" height="12" rx="4" fill="#B2EBF2" />
    <text x="33" y="23" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#006064">42</text>
    <circle cx="22" cy="34" r="4" fill="#546E7A" />
    <circle cx="32" cy="34" r="4" fill="#546E7A" />
    <circle cx="42" cy="34" r="4" fill="#546E7A" />
    <circle cx="22" cy="44" r="4" fill="#546E7A" />
    <circle cx="32" cy="44" r="4" fill="#546E7A" />
    <rect x="38" y="40" width="8" height="8" rx="4" fill="#EF5350" />
    <text x="42" y="46" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">=</text>
  </Svg>
);

export const LampIcon = ({ size = 64 }) => (
  <Svg bg="#FFFDE7" size={size}>
    <circle cx="32" cy="28" r="14" fill="#FDD835" />
    <circle cx="32" cy="25" r="9" fill="#FFEE58" opacity="0.7" />
    <rect x="27" y="40" width="10" height="5" rx="2" fill="#F9A825" />
    <rect x="28" y="45" width="8" height="3" rx="1.5" fill="#F57F17" />
    <rect x="29" y="48" width="6" height="3" rx="1.5" fill="#E65100" />
    <line x1="32" y1="8" x2="32" y2="12" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="46" y1="12" x2="43" y2="15" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="12" x2="21" y2="15" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="52" y1="28" x2="48" y2="28" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="12" y1="28" x2="16" y2="28" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// ─── Step 2: Found AI items ──────────────────────────────────────────────────
export const NavAppIcon = ({ size = 64 }) => (
  <Svg bg="#E8F5E9" size={size}>
    <rect x="14" y="10" width="36" height="44" rx="7" fill="#37474F" />
    <rect x="16" y="14" width="32" height="36" rx="5" fill="#1B5E20" />
    <path d="M18 36 Q26 26 36 30 Q44 34 46 20" stroke="#A5D6A7" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="3 2" />
    <circle cx="36" cy="22" r="6" fill="#F44336" />
    <circle cx="36" cy="22" r="3" fill="white" />
    <polygon points="36,28 31,22 41,22" fill="#F44336" />
    <circle cx="32" cy="52" r="2.5" fill="#546E7A" />
  </Svg>
);

export const FaceCameraIcon = ({ size = 64 }) => (
  <Svg bg="#E1F5FE" size={size}>
    <rect x="10" y="18" width="44" height="34" rx="8" fill="#455A64" />
    <circle cx="32" cy="35" r="12" fill="#263238" />
    <circle cx="32" cy="35" r="8" fill="#1A237E" />
    <circle cx="32" cy="35" r="5" fill="#0D47A1" />
    <circle cx="30" cy="33" r="1.5" fill="white" opacity="0.6" />
    <rect x="28" y="20" width="8" height="5" rx="2" fill="#607D8B" />
    <circle cx="44" cy="22" r="3" fill="#78909C" />
    <circle cx="44" cy="22" r="1.5" fill="#B0BEC5" />
    <path d="M18 28 L18 34 M18 28 L24 28" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M46 28 L46 34 M46 28 L40 28" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </Svg>
);

export const AutoDoorIcon = ({ size = 64 }) => (
  <Svg bg="#F3E5F5" size={size}>
    <rect x="8" y="14" width="48" height="42" rx="4" fill="#9E9E9E" />
    <rect x="10" y="16" width="22" height="38" rx="2" fill="#B2EBF2" />
    <rect x="32" y="16" width="22" height="38" rx="2" fill="#B2EBF2" />
    <line x1="32" y1="16" x2="32" y2="54" stroke="#546E7A" strokeWidth="2" />
    <rect x="28" y="32" width="8" height="4" rx="2" fill="#78909C" />
    <path d="M18 56 L46 56" stroke="#616161" strokeWidth="3" strokeLinecap="round" />
    <circle cx="16" cy="35" r="3" fill="#AB47BC" />
    <path d="M12 30 Q8 35 12 40" stroke="#AB47BC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M10 27 Q4 35 10 43" stroke="#AB47BC" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
  </Svg>
);

// ─── Step 3: Locations ───────────────────────────────────────────────────────
export const HomeIcon = ({ size = 64 }) => (
  <Svg bg="#E8F5E9" size={size}>
    <polygon points="32,10 58,32 6,32" fill="#4CAF50" />
    <rect x="10" y="30" width="44" height="26" fill="#795548" />
    <rect x="24" y="42" width="16" height="14" rx="2" fill="#4E342E" />
    <rect x="13" y="33" width="10" height="10" rx="2" fill="#B3E5FC" />
    <rect x="41" y="33" width="10" height="10" rx="2" fill="#B3E5FC" />
    <line x1="13" y1="38" x2="23" y2="38" stroke="#81D4FA" strokeWidth="1" />
    <line x1="18" y1="33" x2="18" y2="43" stroke="#81D4FA" strokeWidth="1" />
    <line x1="41" y1="38" x2="51" y2="38" stroke="#81D4FA" strokeWidth="1" />
    <line x1="46" y1="33" x2="46" y2="43" stroke="#81D4FA" strokeWidth="1" />
    <circle cx="31" cy="48" r="1.5" fill="#8D6E63" />
    <rect x="42" y="10" width="5" height="16" fill="#6D4C41" />
    <polygon points="44.5,8 48,14 41,14" fill="#EF5350" />
  </Svg>
);

export const SchoolIcon = ({ size = 64 }) => (
  <Svg bg="#E3F2FD" size={size}>
    <rect x="8" y="26" width="48" height="30" fill="#1E88E5" />
    <polygon points="4,26 60,26 32,8" fill="#1565C0" />
    <rect x="24" y="40" width="16" height="16" rx="2" fill="#0D47A1" />
    <rect x="10" y="30" width="12" height="10" rx="2" fill="#B3E5FC" />
    <rect x="42" y="30" width="12" height="10" rx="2" fill="#B3E5FC" />
    <line x1="10" y1="35" x2="22" y2="35" stroke="#81D4FA" strokeWidth="1" />
    <line x1="16" y1="30" x2="16" y2="40" stroke="#81D4FA" strokeWidth="1" />
    <line x1="42" y1="35" x2="54" y2="35" stroke="#81D4FA" strokeWidth="1" />
    <line x1="48" y1="30" x2="48" y2="40" stroke="#81D4FA" strokeWidth="1" />
    <rect x="30" y="5" width="4" height="14" fill="#1565C0" />
    <polygon points="32,3 38,9 32,9" fill="#F44336" />
    <circle cx="32" cy="27" r="4" fill="#FDD835" />
    <circle cx="32" cy="27" r="2" fill="#F9A825" />
  </Svg>
);

export const StreetIcon = ({ size = 64 }) => (
  <Svg bg="#ECEFF1" size={size}>
    <path d="M8 56 Q20 40 32 36 Q44 32 56 8" stroke="#546E7A" strokeWidth="18" strokeLinecap="round" />
    <path d="M8 56 Q20 40 32 36 Q44 32 56 8" stroke="#78909C" strokeWidth="14" strokeLinecap="round" />
    <path d="M8 56 Q20 40 32 36 Q44 32 56 8" stroke="#CFD8DC" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" />
    <circle cx="18" cy="18" r="7" fill="#81C784" />
    <rect x="17" y="24" width="3" height="10" fill="#6D4C41" />
    <circle cx="52" cy="46" r="5" fill="#81C784" />
    <rect x="51" y="50" width="2.5" height="8" fill="#6D4C41" />
    <circle cx="54" cy="22" r="4" fill="#AED581" />
    <rect x="53" y="25" width="2" height="6" fill="#6D4C41" />
  </Svg>
);

export const CarIcon = ({ size = 64 }) => (
  <Svg bg="#FFEBEE" size={size}>
    <rect x="6" y="34" width="52" height="16" rx="5" fill="#F44336" />
    <path d="M12 34 L20 22 L44 22 L52 34" fill="#EF9A9A" />
    <rect x="20" y="23" width="12" height="10" rx="2" fill="#B3E5FC" />
    <rect x="36" y="23" width="12" height="10" rx="2" fill="#B3E5FC" />
    <circle cx="18" cy="50" r="7" fill="#212121" />
    <circle cx="18" cy="50" r="4" fill="#616161" />
    <circle cx="18" cy="50" r="1.5" fill="#9E9E9E" />
    <circle cx="46" cy="50" r="7" fill="#212121" />
    <circle cx="46" cy="50" r="4" fill="#616161" />
    <circle cx="46" cy="50" r="1.5" fill="#9E9E9E" />
    <rect x="50" y="36" width="7" height="5" rx="2" fill="#FFEE58" />
    <rect x="7" y="36" width="7" height="5" rx="2" fill="#EF9A9A" />
  </Svg>
);

export const StoreIcon = ({ size = 64 }) => (
  <Svg bg="#F3E5F5" size={size}>
    <rect x="8" y="30" width="48" height="26" fill="#8E24AA" />
    <path d="M6 30 L14 14 L50 14 L58 30" fill="#AB47BC" />
    <rect x="12" y="34" width="16" height="14" rx="2" fill="#B3E5FC" />
    <rect x="36" y="34" width="16" height="14" rx="2" fill="#B3E5FC" />
    <line x1="12" y1="41" x2="28" y2="41" stroke="#81D4FA" strokeWidth="1" />
    <line x1="20" y1="34" x2="20" y2="48" stroke="#81D4FA" strokeWidth="1" />
    <rect x="6" y="28" width="52" height="4" rx="2" fill="#6A1B9A" />
    <rect x="22" y="16" width="20" height="6" rx="3" fill="#CE93D8" />
    <text x="32" y="21" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">SHOP</text>
  </Svg>
);

export const OtherIcon = ({ size = 64 }) => (
  <Svg bg="#ECEFF1" size={size}>
    <circle cx="32" cy="32" r="20" stroke="#90A4AE" strokeWidth="3" fill="white" />
    <path d="M26 26 C26 22 38 20 38 27 C38 31 32 31 32 35" stroke="#78909C" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="42" r="2.5" fill="#78909C" />
  </Svg>
);

// ─── Step 4: Help types ──────────────────────────────────────────────────────
export const RecognizeIcon = ({ size = 64 }) => (
  <Svg bg="#E3F2FD" size={size}>
    <circle cx="27" cy="27" r="13" stroke="#1E88E5" strokeWidth="3.5" fill="white" />
    <circle cx="27" cy="27" r="8" fill="#BBDEFB" />
    <circle cx="27" cy="27" r="4" fill="#1E88E5" opacity="0.6" />
    <circle cx="24" cy="24" r="2" fill="white" opacity="0.7" />
    <line x1="37" y1="37" x2="53" y2="53" stroke="#1565C0" strokeWidth="5" strokeLinecap="round" />
    <line x1="51" y1="55" x2="55" y2="51" stroke="#1565C0" strokeWidth="3" strokeLinecap="round" />
    <circle cx="14" cy="14" r="2.5" fill="#FDD835" />
    <circle cx="50" cy="10" r="2" fill="#FDD835" />
    <circle cx="54" cy="42" r="1.5" fill="#FDD835" />
  </Svg>
);

export const RecommendIcon = ({ size = 64 }) => (
  <Svg bg="#FFFDE7" size={size}>
    <polygon points="32,8 37.5,24 55,24 41,34 46.5,50 32,40 17.5,50 23,34 9,24 26.5,24" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5" strokeLinejoin="round" />
    <polygon points="32,13 36,23 46,23 38,29 41,39 32,33 23,39 26,29 18,23 28,23" fill="#FFEE58" opacity="0.6" />
    <circle cx="52" cy="10" r="3" fill="#FFC107" />
    <circle cx="12" cy="48" r="2" fill="#FFC107" />
    <circle cx="58" cy="40" r="2.5" fill="#FFC107" />
  </Svg>
);

export const SpeakIcon = ({ size = 64 }) => (
  <Svg bg="#E8F5E9" size={size}>
    <rect x="8" y="16" width="38" height="26" rx="11" fill="#4CAF50" />
    <polygon points="14,42 22,42 14,54" fill="#4CAF50" />
    <circle cx="21" cy="29" r="3" fill="white" opacity="0.7" />
    <circle cx="31" cy="29" r="3" fill="white" opacity="0.7" />
    <circle cx="41" cy="29" r="3" fill="white" opacity="0.7" />
    <path d="M53 22 Q58 29 53 36" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M57 18 Q64 29 57 40" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
  </Svg>
);

export const CleanIcon = ({ size = 64 }) => (
  <Svg bg="#E3F2FD" size={size}>
    <line x1="16" y1="10" x2="50" y2="52" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="53" cy="54" rx="10" ry="6" fill="#42A5F5" transform="rotate(-42 53 54)" />
    <ellipse cx="51" cy="57" rx="10" ry="5" fill="#1E88E5" transform="rotate(-42 51 57)" />
    <circle cx="14" cy="46" r="2.5" fill="#90CAF9" opacity="0.8" />
    <circle cx="20" cy="54" r="2" fill="#90CAF9" opacity="0.6" />
    <circle cx="8" cy="52" r="1.5" fill="#90CAF9" opacity="0.7" />
    <circle cx="10" cy="44" r="1" fill="#90CAF9" opacity="0.5" />
  </Svg>
);

export const NavigateIcon = ({ size = 64 }) => (
  <Svg bg="#E8F5E9" size={size}>
    <rect x="8" y="18" width="38" height="30" rx="5" fill="#A5D6A7" transform="rotate(5 8 18)" />
    <line x1="21" y1="17" x2="19" y2="51" stroke="#81C784" strokeWidth="1.5" opacity="0.5" transform="rotate(5 21 17)" />
    <line x1="33" y1="16" x2="31" y2="50" stroke="#81C784" strokeWidth="1.5" opacity="0.5" transform="rotate(5 33 16)" />
    <path d="M11 34 Q26 24 44 36" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
    <circle cx="40" cy="20" r="8" fill="#F44336" />
    <circle cx="40" cy="20" r="3.5" fill="white" />
    <polygon points="40,28 34,20 46,20" fill="#F44336" />
  </Svg>
);

// ─── Intro slide illustrations ───────────────────────────────────────────────
export const IntroThinkingIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#E3F2FD" />
    <rect x="24" y="26" width="32" height="28" rx="10" fill="#90CAF9" />
    <rect x="28" y="32" width="8" height="7" rx="2.5" fill="white" />
    <circle cx="32" cy="35.5" r="2.5" fill="#1E88E5" />
    <rect x="44" y="32" width="8" height="7" rx="2.5" fill="white" />
    <circle cx="48" cy="35.5" r="2.5" fill="#1E88E5" />
    <rect x="34" y="46" width="12" height="3.5" rx="1.75" fill="#64B5F6" />
    <line x1="40" y1="26" x2="40" y2="18" stroke="#90CAF9" strokeWidth="3" strokeLinecap="round" />
    <circle cx="40" cy="14" r="4" fill="#FDD835" />
    <circle cx="56" cy="22" r="4" fill="#BBDEFB" />
    <circle cx="63" cy="14" r="5.5" fill="#BBDEFB" />
    <text x="63" y="17" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1E88E5">?</text>
    <rect x="28" y="54" width="24" height="8" rx="4" fill="#64B5F6" />
  </svg>
);

export const IntroDiscoverIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#FFF9C4" />
    <circle cx="40" cy="34" r="18" fill="#FDD835" />
    <circle cx="40" cy="30" r="12" fill="#FFEE58" opacity="0.6" />
    <rect x="34" y="50" width="12" height="6" rx="3" fill="#F9A825" />
    <rect x="35" y="56" width="10" height="4" rx="2" fill="#F57F17" />
    <rect x="36" y="60" width="8" height="4" rx="2" fill="#E65100" />
    <line x1="40" y1="10" x2="40" y2="14" stroke="#FDD835" strokeWidth="3" strokeLinecap="round" />
    <line x1="55" y1="15" x2="52" y2="18" stroke="#FDD835" strokeWidth="3" strokeLinecap="round" />
    <line x1="25" y1="15" x2="28" y2="18" stroke="#FDD835" strokeWidth="3" strokeLinecap="round" />
    <line x1="63" y1="34" x2="59" y2="34" stroke="#FDD835" strokeWidth="3" strokeLinecap="round" />
    <line x1="17" y1="34" x2="21" y2="34" stroke="#FDD835" strokeWidth="3" strokeLinecap="round" />
    <line x1="57" y1="52" x2="54" y2="49" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="23" y1="52" x2="26" y2="49" stroke="#FDD835" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="62" cy="16" r="2.5" fill="#FFC107" />
    <circle cx="14" cy="56" r="2" fill="#FFC107" />
    <circle cx="70" cy="54" r="2.5" fill="#FFC107" />
  </svg>
);

export const IntroDetectiveIcon = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="40" fill="#E8F5E9" />
    <circle cx="33" cy="33" r="16" stroke="#4CAF50" strokeWidth="4" fill="white" />
    <circle cx="33" cy="33" r="10" fill="#C8E6C9" />
    <circle cx="33" cy="33" r="5" fill="#4CAF50" opacity="0.5" />
    <circle cx="29" cy="29" r="3" fill="white" opacity="0.6" />
    <line x1="45" y1="45" x2="64" y2="64" stroke="#2E7D32" strokeWidth="6" strokeLinecap="round" />
    <line x1="64" y1="64" x2="68" y2="60" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" />
    <circle cx="64" cy="14" r="3" fill="#4CAF50" />
    <circle cx="14" cy="14" r="2" fill="#4CAF50" />
    <circle cx="10" cy="60" r="2.5" fill="#4CAF50" />
    <circle cx="68" cy="46" r="2" fill="#81C784" />
  </svg>
);

export const StartDetectiveIcon = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="50" fill="#E8F5E9" />
    <circle cx="40" cy="42" r="20" stroke="#4CAF50" strokeWidth="5" fill="white" />
    <circle cx="40" cy="42" r="13" fill="#C8E6C9" />
    <circle cx="40" cy="42" r="7" fill="#4CAF50" opacity="0.4" />
    <circle cx="35" cy="37" r="4" fill="white" opacity="0.5" />
    <line x1="56" y1="58" x2="78" y2="80" stroke="#2E7D32" strokeWidth="8" strokeLinecap="round" />
    <line x1="78" y1="80" x2="84" y2="74" stroke="#2E7D32" strokeWidth="6" strokeLinecap="round" />
    <circle cx="78" cy="20" r="4" fill="#4CAF50" />
    <circle cx="18" cy="18" r="3" fill="#4CAF50" />
    <circle cx="12" cy="74" r="3" fill="#81C784" />
    <circle cx="84" cy="56" r="2.5" fill="#81C784" />
  </svg>
);

export const ListenIcon = ({ size = 64 }) => (
  <Svg bg="#E8F5E9" size={size}>
    <rect x="22" y="14" width="20" height="28" rx="10" fill="#4CAF50" />
    <rect x="24" y="14" width="8" height="28" rx="8" fill="#A5D6A7" opacity="0.4" />
    <path d="M14 32 Q14 46 32 46 Q50 46 50 32" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" fill="none" />
    <line x1="32" y1="46" x2="32" y2="54" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
    <line x1="24" y1="54" x2="40" y2="54" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
    <path d="M42 22 Q48 28 42 34" stroke="#81C784" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M46 18 Q55 28 46 38" stroke="#81C784" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
  </Svg>
);

export const TranslateIcon = ({ size = 64 }) => (
  <Svg bg="#E3F2FD" size={size}>
    <circle cx="32" cy="32" r="20" stroke="#1E88E5" strokeWidth="2.5" fill="white" />
    <ellipse cx="32" cy="32" rx="9" ry="20" stroke="#1E88E5" strokeWidth="2" fill="none" />
    <line x1="12" y1="32" x2="52" y2="32" stroke="#1E88E5" strokeWidth="2" />
    <line x1="14" y1="22" x2="50" y2="22" stroke="#BBDEFB" strokeWidth="1.5" />
    <line x1="14" y1="42" x2="50" y2="42" stroke="#BBDEFB" strokeWidth="1.5" />
    <rect x="26" y="26" width="12" height="12" rx="3" fill="#1E88E5" opacity="0.85" />
    <text x="32" y="35" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">번</text>
  </Svg>
);

export const AutoActIcon = ({ size = 64 }) => (
  <Svg bg="#FFF3E0" size={size}>
    <ellipse cx="32" cy="46" rx="21" ry="10" fill="#94A3B8" />
    <ellipse cx="32" cy="36" rx="21" ry="14" fill="#E2E8F0" />
    <ellipse cx="32" cy="35" rx="17" ry="11" fill="#F1F5F9" />
    <circle cx="25" cy="32" r="5" fill="#FF7043" />
    <circle cx="25" cy="32" r="2.5" fill="white" />
    <circle cx="39" cy="32" r="5" fill="#FF7043" />
    <circle cx="39" cy="32" r="2.5" fill="white" />
    <rect x="27" y="40" width="10" height="3" rx="1.5" fill="#FFA726" />
    <rect x="9" y="43" width="7" height="12" rx="3.5" fill="#64748B" />
    <rect x="48" y="43" width="7" height="12" rx="3.5" fill="#64748B" />
    <path d="M44 12 L48 8 M48 8 L52 12 M48 8 L48 18" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─── E-2-L Step 2 Icons ──────────────────────────────────────────────────────
export const CheckBookIcon = ({ size = 64 }) => (
  <Svg bg="#EFF6FF" size={size}>
    <rect x="16" y="10" width="28" height="38" rx="4" fill="#3B82F6" />
    <rect x="18" y="12" width="24" height="34" rx="3" fill="#EFF6FF" />
    <rect x="21" y="17" width="18" height="2.5" rx="1.2" fill="#93C5FD" />
    <rect x="21" y="22" width="14" height="2.5" rx="1.2" fill="#93C5FD" />
    <rect x="21" y="27" width="16" height="2.5" rx="1.2" fill="#93C5FD" />
    <rect x="21" y="32" width="11" height="2.5" rx="1.2" fill="#93C5FD" />
    <circle cx="42" cy="44" r="10" fill="#22C55E" />
    <path d="M36.5 44 L40.5 48 L47.5 40" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const AskAdultIcon = ({ size = 64 }) => (
  <Svg bg="#FFF7ED" size={size}>
    <circle cx="32" cy="22" r="9" fill="#FB923C" />
    <ellipse cx="32" cy="43" rx="13" ry="9" fill="#FB923C" />
    <circle cx="29" cy="21" r="1.5" fill="white" />
    <circle cx="35" cy="21" r="1.5" fill="white" />
    <path d="M29 26 Q32 29 35 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="49" cy="20" r="7" fill="#FED7AA" />
    <path d="M44 17 Q47 13 52 16" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M46 23 Q49 26 52 23" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M43 20 L42 20" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M55 20 L56 20" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const SearchInternetIcon = ({ size = 64 }) => (
  <Svg bg="#F0FDF4" size={size}>
    <circle cx="29" cy="28" r="14" stroke="#16A34A" strokeWidth="3" fill="#DCFCE7" />
    <ellipse cx="29" cy="28" rx="6" ry="14" stroke="#16A34A" strokeWidth="1.8" fill="none" />
    <line x1="15" y1="28" x2="43" y2="28" stroke="#16A34A" strokeWidth="1.8" />
    <line x1="17" y1="21" x2="41" y2="21" stroke="#16A34A" strokeWidth="1.5" />
    <line x1="17" y1="35" x2="41" y2="35" stroke="#16A34A" strokeWidth="1.5" />
    <line x1="40" y1="40" x2="52" y2="52" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="40" cy="40" r="1.5" fill="#16A34A" />
  </Svg>
);

export const AskAgainAiIcon = ({ size = 64 }) => (
  <Svg bg="#F5F3FF" size={size}>
    <rect x="12" y="14" width="32" height="24" rx="7" fill="#7C3AED" />
    <circle cx="22" cy="26" r="3" fill="white" opacity="0.9" />
    <circle cx="32" cy="26" r="3" fill="white" opacity="0.9" />
    <circle cx="42" cy="26" r="3" fill="white" opacity="0.5" />
    <path d="M20 38 L16 46 L28 40" fill="#7C3AED" />
    <circle cx="44" cy="42" r="10" fill="#A78BFA" />
    <path d="M40 42 L44 38 L48 42" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M44 38 L44 47" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

// ─── Icon lookup map ─────────────────────────────────────────────────────────
const ICON_MAP = {
  // Step 1
  robot_vacuum: RobotVacuumIcon,
  voice_assistant: VoiceAssistantIcon,
  recommend_feed: RecommendFeedIcon,
  face_unlock: FaceUnlockIcon,
  calculator: CalculatorIcon,
  lamp: LampIcon,
  // Step 2
  home_robot_cleaner: RobotVacuumIcon,
  navigation_app: NavAppIcon,
  voice_speaker: VoiceAssistantIcon,
  face_camera: FaceCameraIcon,
  recommend_app: RecommendFeedIcon,
  auto_door: AutoDoorIcon,
  // Step 3
  home: HomeIcon,
  school: SchoolIcon,
  street: StreetIcon,
  car: CarIcon,
  store: StoreIcon,
  other: OtherIcon,
  // Step 4
  recognize: RecognizeIcon,
  recommend: RecommendIcon,
  speak: SpeakIcon,
  clean: CleanIcon,
  navigate: NavigateIcon,
  // E-1-M step3
  listen: ListenIcon,
  translate: TranslateIcon,
  auto_act: AutoActIcon,
  // E-2-L step2
  check_book: CheckBookIcon,
  ask_adult: AskAdultIcon,
  search_internet: SearchInternetIcon,
  ask_again: AskAgainAiIcon,
};

export const getIcon = (id, size = 56) => {
  const Component = ICON_MAP[id];
  if (!Component) return null;
  return <Component size={size} />;
};
