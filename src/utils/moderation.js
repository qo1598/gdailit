// A basic list of bad words to filter
const BAD_WORDS = [
  "바보", "멍청이", "쓰레기", "씨발", "개새끼", "병신", "존나", "지랄", "새끼", "미친",
  "죽어", "꺼져", "시발", "병신", "애미", "창녀", "씨벌"
];

export function checkModeration(text, lastText, lastMessageTime) {
  if (!text || text.trim() === '') {
    return { isValid: false, reason: 'empty' };
  }

  // 1. 도배(스팸) 방지: 마지막 메시지 보낸 지 3초 이내면 차단
  if (lastMessageTime && (Date.now() - lastMessageTime < 3000)) {
    return { 
      isValid: false, 
      reason: 'spam', 
      message: '앗, 너무 빨라요! 생각할 시간을 조금만 주세요. ⏱️' 
    };
  }

  // 2. 반복 메시지 방지: 직전 메시지와 완전히 똑같으면 차단
  if (lastText && text.trim() === lastText.trim()) {
    return { 
      isValid: false, 
      reason: 'repetition', 
      message: '방금 보낸 말과 똑같은 말이에요! 새로운 이야기를 해볼까요? 💡' 
    };
  }

  // 3. 욕설 및 비속어 필터링
  const lowerText = text.toLowerCase();
  for (const word of BAD_WORDS) {
    if (lowerText.includes(word)) {
      return { 
        isValid: false, 
        reason: 'profanity', 
        message: '예쁜 말을 사용해주세요! 우리 모두를 존중하는 대화를 나눠요. 🌻' 
      };
    }
  }

  return { isValid: true };
}
