// 모든 미션 데이터를 통합하는 인덱스 파일
import { E1_MISSION } from './E-1.js';
import { E2_MISSION } from './E-2.js';
import { E3_MISSION } from './E-3.js';
import { E4_MISSION } from './E-4.js';
import { C1_MISSION } from './C-1.js';
import { C2_MISSION } from './C-2.js';
import { C3_MISSION } from './C-3.js';
import { C4_MISSION } from './C-4.js';
import { M1_MISSION } from './M-1.js';
import { M2_MISSION } from './M-2.js';
import { M3_MISSION } from './M-3.js';

export const MISSIONS = {
    'E-1': E1_MISSION,
    'E-2': E2_MISSION,
    'E-3': E3_MISSION,
    'E-4': E4_MISSION,
    'C-1': C1_MISSION,
    'C-2': C2_MISSION,
    'C-3': C3_MISSION,
    'C-4': C4_MISSION,
    'M-1': M1_MISSION,
    'M-2': M2_MISSION,
    'M-3': M3_MISSION
};

export default MISSIONS;