// 키워드 기반 스마트 응답 시스템
const responsePatterns = {
  // 외로움 관련
  loneliness: {
    keywords: ['외로워', '혼자', '고독', '친구', '사람', '만나', '대화'],
    responses: [
      '외로움을 느끼는 것은 자연스러운 일이에요. 지금 이 순간에도 당신을 이해하는 사람들이 있어요.',
      '혼자 있는 시간도 소중한 시간이에요. 자신과의 대화를 통해 더 깊은 이해를 얻을 수 있어요.',
      '외로움은 일시적인 감정이에요. 내일은 더 나은 하루가 될 거예요.',
      '당신의 마음을 들려주셔서 고마워요. 함께 이야기 나누는 것만으로도 외로움이 조금은 줄어들 거예요.',
    ],
  },

  // 스트레스/불안 관련
  stress: {
    keywords: ['스트레스', '불안', '걱정', '긴장', '압박', '피곤', '힘들'],
    responses: [
      '스트레스는 우리 몸이 변화에 적응하려는 신호예요. 천천히 심호흡을 해보세요.',
      '걱정이 많으시군요. 지금 이 순간에 집중해보세요. 과거나 미래가 아닌 현재에요.',
      '힘든 일이 있으셨군요. 그런 감정을 느끼는 것은 당연해요. 조금씩 나아질 거예요.',
      '스트레스를 받고 계시는군요. 따뜻한 차 한 잔과 함께 마음을 정리해보세요.',
    ],
  },

  // 감사/긍정 관련
  gratitude: {
    keywords: ['감사', '고마워', '행복', '좋아', '기쁘', '즐거', '웃'],
    responses: [
      '감사한 마음을 가지고 계시는군요. 그런 마음이 당신을 더 행복하게 만들어요.',
      '좋은 일이 있으셨군요! 그 기쁨을 오래 간직하세요.',
      '행복한 순간을 나눠주셔서 고마워요. 그 에너지가 밤에도 따뜻하게 감싸줄 거예요.',
      '즐거운 마음으로 이야기해주시니 저도 기뻐요. 그런 긍정적인 에너지가 계속 이어지길 바라요.',
    ],
  },

  // 수면 관련
  sleep: {
    keywords: ['잠', '수면', '잠들', '불면', '피곤', '졸려', '휴식'],
    responses: [
      '편안한 수면을 위한 마음의 준비를 하고 계시는군요. 천천히 긴장을 풀어보세요.',
      '잠들기 어려우시군요. 따뜻한 우유나 차를 마시고 마음을 차분히 해보세요.',
      '피곤하시겠어요. 이제 푹 쉴 시간이에요. 내일은 더 좋은 하루가 될 거예요.',
      '수면은 우리 몸과 마음의 자연스러운 회복 시간이에요. 편안한 꿈을 꾸세요.',
    ],
  },

  // 일상/일 관련
  daily: {
    keywords: ['일', '일과', '하루', '바쁘', '일정', '계획', '해야'],
    responses: [
      '바쁜 하루를 보내셨군요. 이제 푹 쉴 시간이에요. 내일도 잘 해낼 수 있을 거예요.',
      '하루를 마무리하는 시간이에요. 오늘 하루도 수고하셨어요.',
      '일과를 마치고 계시는군요. 이제 마음을 정리하고 편안히 쉬어보세요.',
      '계획했던 일들을 잘 해내셨나요? 어떤 일이든 최선을 다하신 것 같아요.',
    ],
  },
};

// 메시지에서 키워드를 찾아 적절한 응답을 반환하는 함수
export const getSmartResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  // 각 패턴을 확인하여 가장 적합한 응답 찾기
  for (const [category, pattern] of Object.entries(responsePatterns)) {
    const hasKeyword = pattern.keywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    if (hasKeyword) {
      const randomResponse =
        pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
      return randomResponse;
    }
  }

  // 키워드가 없으면 일반적인 따뜻한 응답
  const generalResponses = [
    '그런 이야기를 들려주셔서 고마워요. 당신의 마음을 이해하려고 노력할게요.',
    '함께 이야기 나누는 시간이 정말 소중해요. 더 들려주세요.',
    '당신의 생각과 감정이 중요해요. 편하게 말씀해주세요.',
    '그런 마음을 가지고 계시는군요. 천천히 이야기해보세요.',
    '당신의 이야기에 집중하고 있어요. 더 들려주세요.',
  ];

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

// 감정 분석을 위한 간단한 키워드 매칭
export const analyzeEmotion = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('외로워') || lowerMessage.includes('혼자')) {
    return 'loneliness';
  } else if (
    lowerMessage.includes('스트레스') ||
    lowerMessage.includes('불안')
  ) {
    return 'stress';
  } else if (lowerMessage.includes('감사') || lowerMessage.includes('행복')) {
    return 'gratitude';
  } else if (lowerMessage.includes('잠') || lowerMessage.includes('수면')) {
    return 'sleep';
  } else {
    return 'general';
  }
};
