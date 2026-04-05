/**
 * D-1 분류 놀이 공통 과일 10종 (빨간 계열은 3개만 두어 나머지와 색 대비가 분명하도록)
 */
export const D1_FRUITS = [
    { key: 'apple', name: '사과', emoji: '🍎', hue: 'red' },
    { key: 'strawberry', name: '딸기', emoji: '🍓', hue: 'red' },
    { key: 'cherry', name: '체리', emoji: '🍒', hue: 'red' },
    { key: 'banana', name: '바나나', emoji: '🍌', hue: 'yellow' },
    { key: 'lemon', name: '레몬', emoji: '🍋', hue: 'yellow' },
    { key: 'grape', name: '포도', emoji: '🍇', hue: 'purple' },
    { key: 'kiwi', name: '키위', emoji: '🥝', hue: 'green' },
    { key: 'orange', name: '오렌지', emoji: '🍊', hue: 'orange' },
    { key: 'coconut', name: '코코넛', emoji: '🥥', hue: 'brown' },
    { key: 'pineapple', name: '파인애플', emoji: '🍍', hue: 'gold' }
];

export const D1_FRUIT_KEYS = D1_FRUITS.map((f) => f.key);

export function parseD1GroupAssignments(raw) {
    if (!raw || typeof raw !== 'string') return null;
    try {
        const o = JSON.parse(raw);
        if (typeof o !== 'object' || o === null) return null;
        return o;
    } catch {
        return null;
    }
}

export function isCompleteD1MiddleGroups(raw) {
    const o = parseD1GroupAssignments(raw);
    if (!o) return false;
    return D1_FRUIT_KEYS.every((k) => o[k] === 'A' || o[k] === 'B');
}

/** D-1 고학년(5–6): 학교·친구·취향이 섞인 활동 10가지 — 통과·보류 분류용 (과일·게임 키와 별도) */
export const D1_UPPER_ITEMS = [
    { key: 'reading_circle', name: '독서 모임', emoji: '📚' },
    { key: 'art_club', name: '미술·그림', emoji: '🎨' },
    { key: 'choir_music', name: '노래·합창', emoji: '🎵' },
    { key: 'sports_fun', name: '줄넘기·체육', emoji: '🏃' },
    { key: 'baking_snack', name: '간식 만들기', emoji: '🧁' },
    { key: 'photo_booth', name: '포토존', emoji: '📷' },
    { key: 'plant_decor', name: '화분 꾸미기', emoji: '🌼' },
    { key: 'skit_play', name: '짧은 연극', emoji: '🎭' },
    { key: 'letter_friend', name: '친구편지', emoji: '✉️' },
    { key: 'science_fun', name: '재미 과학', emoji: '🧪' }
];

export const D1_UPPER_KEYS = D1_UPPER_ITEMS.map((g) => g.key);

export function isCompleteD1UpperGroups(raw) {
    const o = parseD1GroupAssignments(raw);
    if (!o) return false;
    return D1_UPPER_KEYS.every((k) => o[k] === 'A' || o[k] === 'B');
}
