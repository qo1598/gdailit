import React from 'react';

const wrap = (children, size) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

// ─── 주인공(STEP 1) ────────────────────────────────────────────────
const Puppy = (size) => wrap(
  <g>
    <ellipse cx="24" cy="28" rx="14" ry="13" fill="#fcd34d" />
    <path d="M10 18c0-5 2-9 5-9s5 3 5 9" fill="#d97706" />
    <path d="M38 18c0-5-2-9-5-9s-5 3-5 9" fill="#d97706" />
    <circle cx="19" cy="26" r="1.8" fill="#1e293b" />
    <circle cx="29" cy="26" r="1.8" fill="#1e293b" />
    <ellipse cx="24" cy="32" rx="2.4" ry="1.8" fill="#1e293b" />
    <path d="M24 33.5v2.5M22 35.5c0 1 .8 1.8 2 1.8s2-.8 2-1.8" stroke="#1e293b" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </g>,
  size
);

const Bird = (size) => wrap(
  <g>
    <ellipse cx="22" cy="26" rx="13" ry="10" fill="#93c5fd" />
    <circle cx="30" cy="20" r="7" fill="#60a5fa" />
    <path d="M37 20l6-2-6 4z" fill="#f59e0b" />
    <circle cx="31" cy="19" r="1.4" fill="#1e293b" />
    <path d="M14 24c-2 2-4 2-6 0 2-4 5-5 8-4" fill="#3b82f6" />
    <path d="M20 36l-2 6M26 36l2 6" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
  </g>,
  size
);

const Robot = (size) => wrap(
  <g>
    <line x1="24" y1="6" x2="24" y2="11" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="5" r="2" fill="#f87171" />
    <rect x="10" y="11" width="28" height="22" rx="5" fill="#cbd5e1" />
    <rect x="13" y="14" width="22" height="16" rx="3" fill="#1e293b" />
    <circle cx="19" cy="22" r="2.5" fill="#60a5fa" />
    <circle cx="29" cy="22" r="2.5" fill="#60a5fa" />
    <rect x="19" y="27" width="10" height="1.5" rx="0.75" fill="#60a5fa" />
    <rect x="14" y="34" width="20" height="8" rx="2" fill="#94a3b8" />
    <rect x="7" y="18" width="3" height="8" rx="1.5" fill="#94a3b8" />
    <rect x="38" y="18" width="3" height="8" rx="1.5" fill="#94a3b8" />
  </g>,
  size
);

const Cat = (size) => wrap(
  <g>
    <path d="M10 16l4-8 6 5z" fill="#fbbf24" />
    <path d="M38 16l-4-8-6 5z" fill="#fbbf24" />
    <circle cx="24" cy="26" r="13" fill="#fcd34d" />
    <circle cx="19" cy="24" r="1.8" fill="#1e293b" />
    <circle cx="29" cy="24" r="1.8" fill="#1e293b" />
    <path d="M22 30l2 1.5 2-1.5" stroke="#1e293b" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    <path d="M15 27l-6-1M15 29l-6 1M33 27l6-1M33 29l6 1" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
  </g>,
  size
);

const Child = (size) => wrap(
  <g>
    <circle cx="24" cy="18" r="10" fill="#fde68a" />
    <path d="M14 16c0-6 4-10 10-10s10 4 10 10v2" fill="#78350f" />
    <circle cx="20" cy="19" r="1.5" fill="#1e293b" />
    <circle cx="28" cy="19" r="1.5" fill="#1e293b" />
    <path d="M20 23c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5" stroke="#1e293b" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    <path d="M12 42c0-7 5-12 12-12s12 5 12 12" fill="#60a5fa" />
  </g>,
  size
);

// ─── 장소(STEP 2) ──────────────────────────────────────────────────
const Playground = (size) => wrap(
  <g>
    <line x1="8" y1="40" x2="18" y2="14" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
    <line x1="28" y1="40" x2="18" y2="14" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="14" x2="42" y2="14" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="14" x2="26" y2="26" stroke="#64748b" strokeWidth="1.5" />
    <line x1="34" y1="14" x2="34" y2="26" stroke="#64748b" strokeWidth="1.5" />
    <rect x="24" y="26" width="12" height="3" rx="1" fill="#ef4444" />
    <path d="M8 10l1 4M14 6l2 3M20 4l1 3M28 6l2 3M34 10l1 3M40 6l2 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="4" y1="40" x2="44" y2="40" stroke="#86efac" strokeWidth="2" />
  </g>,
  size
);

const Forest = (size) => wrap(
  <g>
    <path d="M12 34l-6-8h3l-4-7h3l-4-7h14l-4 7h3l-4 7h3l-6 8z" fill="#16a34a" />
    <rect x="10" y="32" width="4" height="8" fill="#78350f" />
    <path d="M32 38l-8-10h4l-6-9h4l-6-9h18l-6 9h4l-6 9h4l-8 10z" fill="#15803d" />
    <rect x="30" y="36" width="4" height="8" fill="#78350f" />
    <line x1="2" y1="44" x2="46" y2="44" stroke="#166534" strokeWidth="2" />
  </g>,
  size
);

const Beach = (size) => wrap(
  <g>
    <circle cx="36" cy="16" r="7" fill="#fb923c" />
    <line x1="36" y1="4" x2="36" y2="8" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="44" y1="8" x2="42" y2="10" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="8" x2="30" y2="10" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 30c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8 3 12 0v14H4z" fill="#38bdf8" />
    <path d="M2 38c4-2 8-2 12 0s8 2 12 0 8-2 12 0 8 2 12 0" stroke="#fff" strokeWidth="1.5" fill="none" />
    <path d="M4 42c4-1 8-1 12 0s8 1 12 0 8-1 12 0 8 1 12 0" stroke="#fff" strokeWidth="1.2" fill="none" opacity="0.7" />
  </g>,
  size
);

const School = (size) => wrap(
  <g>
    <rect x="8" y="18" width="32" height="22" fill="#fde68a" />
    <path d="M6 18l18-10 18 10z" fill="#dc2626" />
    <rect x="22" y="28" width="6" height="12" fill="#78350f" />
    <rect x="12" y="22" width="5" height="5" fill="#60a5fa" />
    <rect x="31" y="22" width="5" height="5" fill="#60a5fa" />
    <line x1="24" y1="8" x2="24" y2="4" stroke="#1e293b" strokeWidth="1.5" />
    <path d="M24 4l6 2-6 2z" fill="#ef4444" />
    <line x1="4" y1="40" x2="44" y2="40" stroke="#15803d" strokeWidth="2" />
  </g>,
  size
);

const City = (size) => wrap(
  <g>
    <rect x="0" y="0" width="48" height="48" fill="#1e293b" />
    <circle cx="38" cy="10" r="5" fill="#fde68a" />
    <circle cx="35" cy="8" r="3" fill="#1e293b" />
    <circle cx="8" cy="6" r="0.8" fill="#fff" />
    <circle cx="20" cy="4" r="0.6" fill="#fff" />
    <circle cx="14" cy="12" r="0.6" fill="#fff" />
    <rect x="4" y="22" width="8" height="22" fill="#475569" />
    <rect x="14" y="14" width="8" height="30" fill="#64748b" />
    <rect x="24" y="20" width="10" height="24" fill="#475569" />
    <rect x="36" y="24" width="8" height="20" fill="#64748b" />
    <rect x="6" y="26" width="1.5" height="1.5" fill="#fde68a" />
    <rect x="9" y="30" width="1.5" height="1.5" fill="#fde68a" />
    <rect x="16" y="18" width="1.5" height="1.5" fill="#fde68a" />
    <rect x="19" y="24" width="1.5" height="1.5" fill="#fde68a" />
    <rect x="26" y="24" width="1.5" height="1.5" fill="#fde68a" />
    <rect x="30" y="30" width="1.5" height="1.5" fill="#fde68a" />
    <rect x="38" y="28" width="1.5" height="1.5" fill="#fde68a" />
  </g>,
  size
);

export const C1_ICONS = {
  puppy: Puppy,
  bird: Bird,
  robot: Robot,
  cat: Cat,
  child: Child,
  playground: Playground,
  forest: Forest,
  beach: Beach,
  school: School,
  city: City,
};

export function getC1Icon(id, size = 40) {
  const fn = C1_ICONS[id];
  return fn ? fn(size) : null;
}
