// GPT API를 사용한 AI 채팅 시스템

// GPT API 호출 함수
export const generateGPTResponse = async (
  message,
  conversationHistory = []
) => {
  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
        maxTokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`GPT API 에러: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('GPT API 호출 에러:', error);
    return getFallbackResponse(message);
  }
};

// API 키 확인 함수
export const checkGPTAPIKey = () => {
  return (
    process.env.NEXT_PUBLIC_OPENAI_API_KEY &&
    process.env.NEXT_PUBLIC_OPENAI_API_KEY !== 'your_openai_api_key_here'
  );
};

// 기본 응답 (에러 시 사용)
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('외로워') || lowerMessage.includes('혼자')) {
    return '외로움을 느끼는 것은 자연스러운 일이에요~ 지금 이 순간에도 당신을 이해하는 사람들이 있어요! 💕';
  } else if (
    lowerMessage.includes('스트레스') ||
    lowerMessage.includes('불안')
  ) {
    return '스트레스는 우리 몸이 변화에 적응하려는 신호예요~ 천천히 심호흡을 해보세요! 😌';
  } else if (lowerMessage.includes('잠') || lowerMessage.includes('수면')) {
    return '편안한 수면을 위한 마음의 준비를 하고 계시는군요~ 천천히 긴장을 풀어보세요! 😴';
  } else {
    return '그런 이야기를 들려주셔서 고마워요~ 당신의 마음을 이해하려고 노력할게요! 🤗';
  }
};

// GPT AI 정보
export const gptAIInfo = {
  title: 'GPT AI 시스템',
  description: 'OpenAI의 GPT-4o Mini 모델을 사용한 고급 AI 채팅 시스템입니다.',
  features: [
    '✅ 가장 자연스러운 대화',
    '✅ 맥락 이해',
    '✅ 창의적인 응답',
    '✅ 한국어 완벽 지원',
    '✅ 긴 대화에서도 일관성',
  ],
  setupGuide: {
    title: 'GPT API 설정',
    description: '가장 자연스러운 AI 대화를 경험하세요.',
    steps: [
      '1. https://platform.openai.com/ 에서 계정 생성',
      '2. API Keys에서 새 키 생성',
      '3. .env.local 파일에 NEXT_PUBLIC_OPENAI_API_KEY=sk-... 추가',
      '4. 앱 재시작',
    ],
    costs: {
      gpt35: 'GPT-4o Mini: 약 $0.00015/1K 토큰 (입력), $0.0006/1K 토큰 (출력)',
      gpt4: 'GPT-4o: 약 $0.005/1K 토큰 (입력), $0.015/1K 토큰 (출력)',
      note: '일반적인 대화 1회당 약 $0.001-0.005 (매우 저렴)',
    },
  },
};
