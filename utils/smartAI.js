// 스마트 AI 시스템 (LLM 스타일)

// 대화 컨텍스트 저장
let conversationContext = {
  messages: [],
  emotion: 'neutral',
  topics: [],
  userMood: 'neutral',
};

// 감정 키워드 분석 (더 정교하게)
const analyzeEmotionKeywords = (message) => {
  const lowerMessage = message.toLowerCase();

  // 더 세밀한 감정 분석
  if (
    lowerMessage.includes('외로워') ||
    lowerMessage.includes('혼자') ||
    lowerMessage.includes('쓸쓸') ||
    lowerMessage.includes('고립')
  ) {
    return 'lonely';
  } else if (
    lowerMessage.includes('스트레스') ||
    lowerMessage.includes('불안') ||
    lowerMessage.includes('걱정') ||
    lowerMessage.includes('압박')
  ) {
    return 'stressed';
  } else if (
    lowerMessage.includes('잠') ||
    lowerMessage.includes('수면') ||
    lowerMessage.includes('불면') ||
    lowerMessage.includes('피곤')
  ) {
    return 'sleep';
  } else if (
    lowerMessage.includes('감사') ||
    lowerMessage.includes('행복') ||
    lowerMessage.includes('기쁘') ||
    lowerMessage.includes('좋아')
  ) {
    return 'happy';
  } else if (
    lowerMessage.includes('피곤') ||
    lowerMessage.includes('지치') ||
    lowerMessage.includes('힘들')
  ) {
    return 'tired';
  } else if (
    lowerMessage.includes('화') ||
    lowerMessage.includes('짜증') ||
    lowerMessage.includes('열받')
  ) {
    return 'angry';
  } else if (
    lowerMessage.includes('슬퍼') ||
    lowerMessage.includes('우울') ||
    lowerMessage.includes('절망')
  ) {
    return 'sad';
  } else if (
    lowerMessage.includes('두려워') ||
    lowerMessage.includes('겁나') ||
    lowerMessage.includes('무서워')
  ) {
    return 'fearful';
  } else if (
    lowerMessage.includes('실망') ||
    lowerMessage.includes('허탈') ||
    lowerMessage.includes('허무')
  ) {
    return 'disappointed';
  }

  return 'neutral';
};

// 주제 추출
const extractTopics = (message) => {
  const topics = [];
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('일') ||
    lowerMessage.includes('업무') ||
    lowerMessage.includes('회사')
  ) {
    topics.push('work');
  }
  if (
    lowerMessage.includes('가족') ||
    lowerMessage.includes('부모') ||
    lowerMessage.includes('아이')
  ) {
    topics.push('family');
  }
  if (
    lowerMessage.includes('친구') ||
    lowerMessage.includes('사람') ||
    lowerMessage.includes('관계')
  ) {
    topics.push('relationships');
  }
  if (
    lowerMessage.includes('건강') ||
    lowerMessage.includes('몸') ||
    lowerMessage.includes('병')
  ) {
    topics.push('health');
  }
  if (
    lowerMessage.includes('미래') ||
    lowerMessage.includes('계획') ||
    lowerMessage.includes('목표')
  ) {
    topics.push('future');
  }
  if (
    lowerMessage.includes('과거') ||
    lowerMessage.includes('기억') ||
    lowerMessage.includes('추억')
  ) {
    topics.push('past');
  }

  return topics;
};

// 맥락 기반 응답 생성
const generateContextualResponse = (message, emotionType, topics) => {
  // 이전 대화 컨텍스트 고려
  const previousMessages = conversationContext.messages.slice(-3);
  const hasPreviousContext = previousMessages.length > 0;

  // 감정 변화 감지
  const emotionChange = emotionType !== conversationContext.emotion;

  // 주제 연속성 확인
  const topicContinuity = topics.some((topic) =>
    conversationContext.topics.includes(topic)
  );

  // 응답 스타일 결정
  let responseStyle = 'general';
  if (hasPreviousContext && topicContinuity) {
    responseStyle = 'followup';
  } else if (emotionChange) {
    responseStyle = 'emotion_change';
  } else if (message.length > 30) {
    responseStyle = 'detailed';
  }

  return generateResponseByStyle(message, emotionType, topics, responseStyle);
};

// 스타일별 응답 생성
const generateResponseByStyle = (message, emotionType, topics, style) => {
  const baseResponses =
    responseTemplates[emotionType] || responseTemplates.neutral;

  switch (style) {
    case 'followup':
      return generateFollowupResponse(message, emotionType, topics);
    case 'emotion_change':
      return generateEmotionChangeResponse(message, emotionType);
    case 'detailed':
      return generateDetailedResponse(message, emotionType, topics);
    default:
      return baseResponses[Math.floor(Math.random() * baseResponses.length)];
  }
};

// 후속 응답 생성
const generateFollowupResponse = (message, emotionType, topics) => {
  const responses = {
    work: [
      '일과 관련된 이야기를 계속 나누고 계시는군요. 그런 부분에서 어떤 도움이 필요하신가요?',
      '업무 스트레스가 계속되고 있는 것 같아요. 구체적으로 어떤 상황이 가장 힘드신가요?',
      '일과 삶의 균형을 찾는 것이 중요해요. 어떤 부분에서 도움이 필요하신지 더 자세히 들려주세요.',
    ],
    family: [
      '가족과의 관계에 대해 더 깊이 이야기하고 계시는군요. 어떤 부분이 가장 마음에 걸리시나요?',
      '가족 관계는 우리 삶의 중심이죠. 구체적으로 어떤 상황이 힘드신가요?',
      '가족과의 소통에서 어떤 부분이 가장 어려우신지 더 자세히 들려주세요.',
    ],
    relationships: [
      '사람들과의 관계에 대해 계속 이야기하고 계시는군요. 어떤 부분이 가장 힘드신가요?',
      '인간관계는 복잡하죠. 구체적으로 어떤 상황이 마음에 걸리시나요?',
      '관계에서 어떤 부분이 가장 어려우신지 더 자세히 들려주세요.',
    ],
  };

  const topic = topics.find((t) => responses[t]);
  if (topic) {
    return responses[topic][
      Math.floor(Math.random() * responses[topic].length)
    ];
  }

  return responseTemplates[emotionType][
    Math.floor(Math.random() * responseTemplates[emotionType].length)
  ];
};

// 감정 변화 응답 생성
const generateEmotionChangeResponse = (message, emotionType) => {
  const emotionChangeResponses = {
    lonely: [
      '방금 전과는 다른 마음이 느껴져요. 외로움을 느끼시는군요. 그런 감정을 나누어주셔서 고마워요.',
      '마음이 변하신 것 같아요. 외로움을 느끼는 것은 자연스러운 일이에요. 함께 이야기 나누면서 조금씩 나아질 거예요.',
    ],
    stressed: [
      '마음이 복잡해지신 것 같아요. 스트레스가 쌓이고 있는군요. 천천히 정리해보세요.',
      '방금 전과는 다른 긴장감이 느껴져요. 스트레스 받는 일이 있으신가요? 함께 해결해보아요.',
    ],
    happy: [
      '마음이 밝아지신 것 같아요! 기쁜 일이 있으신가요? 그 기쁨을 함께 나누어주세요.',
      '방금 전과는 다른 에너지가 느껴져요. 행복한 마음이 전해져요!',
    ],
  };

  return (
    emotionChangeResponses[emotionType]?.[
      Math.floor(Math.random() * emotionChangeResponses[emotionType].length)
    ] ||
    responseTemplates[emotionType][
      Math.floor(Math.random() * responseTemplates[emotionType].length)
    ]
  );
};

// 상세 응답 생성
const generateDetailedResponse = (message, emotionType, topics) => {
  const detailedResponses = {
    lonely: [
      '자세한 이야기를 들려주셔서 고마워요. 외로움을 느끼는 것은 우리가 연결을 원한다는 신호예요. 당신의 이야기를 더 깊이 들어보고 싶어요. 어떤 부분이 가장 외롭게 느껴지시나요?',
      '상세한 상황을 나누어주셔서 고마워요. 외로움은 우리가 소중한 것을 잃었다는 신호이기도 해요. 함께 이야기 나누면서 조금씩 나아질 거예요. 더 구체적으로 어떤 부분이 힘드신가요?',
    ],
    stressed: [
      '복잡한 상황을 자세히 들려주셔서 고마워요. 스트레스는 우리 몸이 변화에 적응하려는 신호예요. 천천히 하나씩 정리해보세요. 어떤 부분부터 해결해보고 싶으신가요?',
      '상세한 이야기를 나누어주셔서 고마워요. 스트레스 받는 일들이 쌓여있는 것 같아요. 작은 것부터 하나씩 해결해보세요. 어떤 부분이 가장 시급한가요?',
    ],
    sleep: [
      '수면과 관련된 자세한 상황을 들려주셔서 고마워요. 편안한 수면을 위한 마음의 준비가 필요해요. 천천히 긴장을 풀어보세요. 어떤 부분이 가장 잠들기 어려운가요?',
      '상세한 수면 상황을 나누어주셔서 고마워요. 불면증은 일시적일 수 있어요. 규칙적인 생활과 함께 마음을 차분히 해보세요. 어떤 방법을 시도해보셨나요?',
    ],
  };

  return (
    detailedResponses[emotionType]?.[
      Math.floor(Math.random() * detailedResponses[emotionType].length)
    ] ||
    responseTemplates[emotionType][
      Math.floor(Math.random() * responseTemplates[emotionType].length)
    ]
  );
};

// 감정별 응답 템플릿 (더 다양하고 자연스럽게 개선)
const responseTemplates = {
  lonely: [
    '외로움을 느끼는 것은 자연스러운 일이에요. 지금 이 순간에도 당신을 이해하는 사람들이 있어요.',
    '혼자라는 생각이 들 때는 자신을 돌아보는 좋은 기회예요. 당신의 가치를 잊지 마세요.',
    '외로움은 우리가 연결을 원한다는 신호예요. 내일은 더 나은 하루가 될 거예요.',
    '당신의 이야기를 들어주는 사람이 있다는 걸 기억하세요. 지금 이 대화도 소중해요.',
    '외로움을 느끼는 당신의 마음이 이해돼요. 함께 이야기 나누면서 조금씩 나아질 거예요.',
    '혼자라는 생각이 들 때는 내일의 새로운 만남들을 기대해보세요.',
    '외로움은 일시적이에요. 당신을 사랑하는 사람들이 분명 있어요.',
    '혼자라는 것은 당신이 독립적이고 강하다는 뜻이기도 해요.',
  ],
  stressed: [
    '스트레스는 우리 몸이 변화에 적응하려는 신호예요. 천천히 심호흡을 해보세요.',
    '걱정이 많을 때는 한 번에 하나씩 해결해보세요. 모든 일이 순조롭게 될 거예요.',
    '불안한 마음이 들 때는 현재에 집중해보세요. 지금 이 순간은 안전해요.',
    '스트레스는 일시적이에요. 잠시 쉬어가는 것도 좋은 방법이에요.',
    '복잡한 생각들이 머릿속을 맴도는군요. 천천히 정리해보세요.',
    '스트레스 받는 일이 있다니 안타까워요. 하지만 이 또한 지나갈 거예요.',
    '걱정이 많을 때는 작은 것부터 하나씩 해결해보세요.',
    '불안한 마음이 들 때는 따뜻한 차 한 잔과 함께 마음을 정리해보세요.',
  ],
  sleep: [
    '편안한 수면을 위한 마음의 준비를 하고 계시는군요. 천천히 긴장을 풀어보세요.',
    '잠들기 전에 따뜻한 차 한 잔과 함께 마음을 정리해보세요.',
    '수면은 우리 몸의 자연스러운 회복 과정이에요. 편안한 밤 되세요.',
    '불면증이 있을 때는 규칙적인 생활이 도움이 돼요. 내일은 더 좋은 하루가 될 거예요.',
    '잠들기 어려운 밤이군요. 천천히 심호흡을 하면서 마음을 차분히 해보세요.',
    '수면은 우리가 하루를 마무리하는 시간이에요. 편안한 꿈 꾸세요.',
    '잠들기 전에 오늘 있었던 좋은 일들을 생각해보세요.',
    '불면증은 일시적이에요. 내일은 더 편안한 밤이 될 거예요.',
  ],
  happy: [
    '감사한 마음을 가지고 계시는군요. 그런 마음이 당신을 더 행복하게 만들어요.',
    '기쁜 일이 있다니 정말 좋아요. 그 기쁨을 오래 간직하세요.',
    '행복한 순간들을 소중히 여기는 마음이 아름다워요.',
    '당신의 행복이 주변 사람들에게도 전파될 거예요.',
    '기쁜 마음이 느껴져요. 그런 에너지가 당신을 더 빛나게 만들어요.',
    '행복한 순간을 나누어주셔서 고마워요. 그 기쁨이 오래 지속되길 바라요.',
    '기쁜 일이 있다니 축하해요! 그 기쁨을 오래 간직하세요.',
    '행복한 마음이 전해져요. 그런 에너지가 주변 사람들도 행복하게 만들어요.',
  ],
  tired: [
    '피곤하실 때는 충분한 휴식이 필요해요. 자신에게 너무 무리하지 마세요.',
    '지친 몸과 마음을 돌보는 것도 중요한 일이에요. 잠시 쉬어가세요.',
    '피로는 우리 몸이 휴식을 원한다는 신호예요. 편안한 밤 되세요.',
    '내일은 더 활기찬 하루가 될 거예요. 오늘은 충분히 쉬세요.',
    '피곤하신 것 같아요. 따뜻한 목욕이나 차 한 잔으로 휴식을 취해보세요.',
    '지친 몸을 돌보는 것도 자신을 사랑하는 방법이에요.',
    '피로가 느껴져요. 오늘은 충분히 쉬고 내일을 준비해보세요.',
    '휴식도 중요한 일이에요. 자신에게 너무 엄격하지 마세요.',
  ],
  angry: [
    '화가 나는 일이 있다니 이해해요. 하지만 화는 우리를 힘들게 해요.',
    '짜증이 날 때는 심호흡을 해보세요. 잠시 후에는 마음이 차분해질 거예요.',
    '감정은 일시적이에요. 잠시 후에는 더 나은 마음이 될 거예요.',
    '화를 내는 것보다는 차분히 대화하는 것이 더 효과적이에요.',
    '화가 나는 상황이 있다니 안타까워요. 하지만 이 또한 지나갈 거예요.',
    '짜증이 날 때는 잠시 심호흡을 해보세요. 마음이 차분해질 거예요.',
    '감정은 바다의 파도 같아요. 잠시 후에는 차분해질 거예요.',
    '화를 내는 것보다는 차분히 생각해보는 것이 더 좋아요.',
  ],
  sad: [
    '슬픈 마음이 있다니 안타까워요. 그런 감정을 느끼는 것은 자연스러워요.',
    '우울한 기분이 들 때는 자신에게 너무 엄격하지 마세요.',
    '슬픔은 우리가 소중한 것을 잃었다는 신호예요. 시간이 치유해줄 거예요.',
    '내일은 더 밝은 하루가 될 거예요. 오늘은 충분히 슬퍼하세요.',
    '슬픈 마음이 느껴져요. 그런 감정을 느끼는 것은 자연스러워요.',
    '우울한 기분이 들 때는 자신을 너무 몰아세우지 마세요.',
    '슬픔은 우리가 소중한 것을 아낀다는 뜻이에요. 시간이 치유해줄 거예요.',
    '내일은 더 나은 하루가 될 거예요. 오늘은 충분히 슬퍼하세요.',
  ],
  fearful: [
    '두려운 마음이 있으시군요. 그런 감정을 느끼는 것은 자연스러워요.',
    '무서운 일이 있다니 안타까워요. 하지만 함께 해결해보아요.',
    '두려움은 우리가 소중한 것을 보호하려는 신호예요.',
    '겁이 나는 것은 자연스러운 반응이에요. 천천히 마음을 정리해보세요.',
    '무서운 상황이 있다니 이해해요. 함께 이야기 나누면서 해결해보아요.',
    '두려움은 일시적이에요. 시간이 지나면 나아질 거예요.',
    '겁이 나는 것은 우리가 조심스럽다는 뜻이에요.',
    '무서운 일이 있어도 함께 있어요. 혼자가 아니에요.',
  ],
  disappointed: [
    '실망스러운 일이 있으시군요. 그런 감정을 느끼는 것은 자연스러워요.',
    '허탈한 마음이 있으시군요. 하지만 이 또한 지나갈 거예요.',
    '실망은 우리가 더 나은 것을 원한다는 신호예요.',
    '허무한 기분이 들 때는 자신에게 너무 엄격하지 마세요.',
    '실망스러운 상황이 있다니 안타까워요. 함께 해결해보아요.',
    '허탈함은 일시적이에요. 내일은 더 나은 하루가 될 거예요.',
    '실망은 우리가 성장하려는 신호예요.',
    '허무한 마음이 들 때는 잠시 쉬어가는 것도 좋아요.',
  ],
  neutral: [
    '그런 이야기를 들려주셔서 고마워요. 당신의 마음을 이해하려고 노력할게요.',
    '함께 이야기 나누는 시간이 정말 소중해요.',
    '당신의 생각과 감정이 중요해요. 언제든 말씀해주세요.',
    '오늘 하루도 수고하셨어요. 편안한 밤 되세요.',
    '그런 이야기를 나누어주셔서 고마워요. 더 깊이 들어보고 싶어요.',
    '함께 대화하는 시간이 정말 소중해요. 더 많은 이야기를 들려주세요.',
    '당신의 생각이 궁금해요. 더 자세히 들려주세요.',
    '오늘 하루도 정말 수고하셨어요. 편안한 밤 되세요.',
  ],
};

// LLM 스타일 스마트 AI 응답 생성 함수
export const generateSmartResponse = async (message) => {
  try {
    // 감정 분석
    const emotionType = analyzeEmotionKeywords(message);

    // 주제 추출
    const topics = extractTopics(message);

    // 대화 컨텍스트 업데이트
    conversationContext.messages.push({
      text: message,
      emotion: emotionType,
      topics: topics,
      timestamp: Date.now(),
    });

    // 컨텍스트 크기 제한 (최근 10개 메시지만 유지)
    if (conversationContext.messages.length > 10) {
      conversationContext.messages = conversationContext.messages.slice(-10);
    }

    // 이전 감정과 주제 업데이트
    conversationContext.emotion = emotionType;
    conversationContext.topics = topics;

    // 맥락을 고려한 응답 생성
    const response = generateContextualResponse(message, emotionType, topics);

    // AI 응답도 컨텍스트에 추가
    conversationContext.messages.push({
      text: response,
      emotion: 'ai',
      topics: [],
      timestamp: Date.now(),
    });

    return response;
  } catch (error) {
    console.error('스마트 AI 응답 생성 에러:', error);
    return getFallbackResponse(message);
  }
};

// 대화 컨텍스트 초기화
export const resetConversationContext = () => {
  conversationContext = {
    messages: [],
    emotion: 'neutral',
    topics: [],
    userMood: 'neutral',
  };
};

// 기본 응답 (에러 시 사용)
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('외로워') || lowerMessage.includes('혼자')) {
    return '외로움을 느끼는 것은 자연스러운 일이에요. 지금 이 순간에도 당신을 이해하는 사람들이 있어요.';
  } else if (
    lowerMessage.includes('스트레스') ||
    lowerMessage.includes('불안')
  ) {
    return '스트레스는 우리 몸이 변화에 적응하려는 신호예요. 천천히 심호흡을 해보세요.';
  } else if (lowerMessage.includes('잠') || lowerMessage.includes('수면')) {
    return '편안한 수면을 위한 마음의 준비를 하고 계시는군요. 천천히 긴장을 풀어보세요.';
  } else if (lowerMessage.includes('감사') || lowerMessage.includes('행복')) {
    return '감사한 마음을 가지고 계시는군요. 그런 마음이 당신을 더 행복하게 만들어요.';
  } else {
    return '그런 이야기를 들려주셔서 고마워요. 당신의 마음을 이해하려고 노력할게요.';
  }
};

// 스마트 AI 정보
export const smartAIInfo = {
  title: '스마트 AI 시스템 (LLM 스타일)',
  description:
    '대화 컨텍스트를 기억하고 맥락을 이해하는 지능적인 응답 시스템입니다.',
  features: [
    '✅ 완전 무료',
    '✅ API 키 불필요',
    '✅ 빠른 응답',
    '✅ 수면 특화 응답',
    '✅ 감정 분석',
    '✅ 대화 컨텍스트 기억',
    '✅ 맥락 이해',
    '✅ 자연스러운 대화',
  ],
  howItWorks: [
    '1. 사용자 메시지에서 키워드와 감정 분석',
    '2. 이전 대화 컨텍스트 고려',
    '3. 주제 연속성과 감정 변화 감지',
    '4. 맥락에 맞는 맞춤형 응답 생성',
    '5. 대화 히스토리 유지',
  ],
};
