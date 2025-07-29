// 무료 AI 서비스 연동 옵션들

// 1. Hugging Face Inference API (무료)
export const useHuggingFace = async (message) => {
  try {
    // 한국어 감정 분석 모델 사용
    const response = await fetch(
      'https://api-inference.huggingface.co/models/beomi/KcELECTRA-base-v2022',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer hf_xxx', // 무료 API 키 필요
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
        }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Hugging Face API 에러:', error);
    return null;
  }
};

// 2. Cohere AI (무료 티어)
export const useCohere = async (message) => {
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer COHERE_API_KEY', // 무료 API 키 필요
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `사용자가 "${message}"라고 말했습니다. 수면에 도움이 되는 따뜻하고 위로가 되는 응답을 한국어로 해주세요.`,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    return result.generations[0].text;
  } catch (error) {
    console.error('Cohere API 에러:', error);
    return null;
  }
};

// 3. LocalAI (로컬에서 실행)
export const useLocalAI = async (message) => {
  try {
    const response = await fetch('http://localhost:8080/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt4all',
        messages: [
          {
            role: 'system',
            content:
              '당신은 수면을 돕는 따뜻한 AI 동반자입니다. 사용자의 감정을 이해하고 위로가 되는 응답을 해주세요.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('LocalAI 에러:', error);
    return null;
  }
};

// 4. 간단한 감정 분석 + 응답 생성
export const analyzeAndRespond = (message) => {
  const lowerMessage = message.toLowerCase();

  // 감정 분석
  let emotion = 'neutral';
  let intensity = 0;

  // 긍정적 감정
  if (
    lowerMessage.includes('행복') ||
    lowerMessage.includes('기쁘') ||
    lowerMessage.includes('좋아')
  ) {
    emotion = 'positive';
    intensity = 3;
  }
  // 부정적 감정
  else if (
    lowerMessage.includes('슬프') ||
    lowerMessage.includes('외로워') ||
    lowerMessage.includes('힘들')
  ) {
    emotion = 'negative';
    intensity = 3;
  }
  // 스트레스
  else if (
    lowerMessage.includes('스트레스') ||
    lowerMessage.includes('불안') ||
    lowerMessage.includes('걱정')
  ) {
    emotion = 'stress';
    intensity = 2;
  }
  // 수면 관련
  else if (
    lowerMessage.includes('잠') ||
    lowerMessage.includes('수면') ||
    lowerMessage.includes('피곤')
  ) {
    emotion = 'sleep';
    intensity = 2;
  }

  // 감정에 따른 응답 생성
  const responses = {
    positive: [
      '그런 긍정적인 마음이 당신을 더 행복하게 만들어요.',
      '좋은 일이 있으셨군요! 그 기쁨을 오래 간직하세요.',
      '행복한 순간을 나눠주셔서 고마워요.',
    ],
    negative: [
      '그런 감정을 느끼는 것은 자연스러워요. 천천히 나아질 거예요.',
      '힘든 마음을 들려주셔서 고마워요. 함께 이야기 나누는 것만으로도 조금은 나아질 거예요.',
      '그런 감정이 있다는 것을 인정하는 것부터가 용기예요.',
    ],
    stress: [
      '스트레스를 받고 계시는군요. 천천히 심호흡을 해보세요.',
      '걱정이 많으시군요. 지금 이 순간에 집중해보세요.',
      '스트레스는 일시적이에요. 조금씩 나아질 거예요.',
    ],
    sleep: [
      '편안한 수면을 위한 마음의 준비를 하고 계시는군요.',
      '잠들기 어려우시군요. 따뜻한 차를 마시고 마음을 차분히 해보세요.',
      '피곤하시겠어요. 이제 푹 쉴 시간이에요.',
    ],
    neutral: [
      '그런 이야기를 들려주셔서 고마워요.',
      '함께 이야기 나누는 시간이 정말 소중해요.',
      '당신의 생각과 감정이 중요해요.',
    ],
  };

  const emotionResponses = responses[emotion];
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
};

// 5. API 키 설정 가이드
export const setupInstructions = {
  huggingface: {
    steps: [
      '1. https://huggingface.co/ 에서 계정 생성',
      '2. Settings → Access Tokens에서 새 토큰 생성',
      '3. 환경 변수에 HF_API_KEY 추가',
    ],
    freeLimit: '무료: 월 30,000 요청',
  },
  cohere: {
    steps: [
      '1. https://cohere.ai/ 에서 계정 생성',
      '2. API Keys에서 새 키 생성',
      '3. 환경 변수에 COHERE_API_KEY 추가',
    ],
    freeLimit: '무료: 월 5 요청/분',
  },
  localai: {
    steps: [
      '1. LocalAI 설치: https://github.com/go-skynet/LocalAI',
      '2. 로컬에서 AI 모델 실행',
      '3. http://localhost:8080 에서 API 사용',
    ],
    freeLimit: '완전 무료 (로컬 실행)',
  },
};
