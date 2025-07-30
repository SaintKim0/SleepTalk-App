// DeepSeek API를 사용한 AI 채팅 시스템

// DeepSeek API 호출 함수
export const generateDeepSeekResponse = async (
  message,
  conversationHistory = []
) => {
  try {
    const response = await fetch(
      'https://api.deepseek.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `당신은 수면과 정신 건강을 돕는 따뜻하고 공감적인 AI 동반자입니다. 
            사용자의 감정을 이해하고 위로하며, 수면에 도움이 되는 조언을 제공합니다.
            한국어로 자연스럽고 따뜻하게 응답하되, 100자 이내로 간결하게 답변하세요.`,
            },
            ...conversationHistory.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API 에러:', errorData);
      throw new Error(`DeepSeek API 에러: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('DeepSeek API 호출 에러:', error);
    return getFallbackResponse(message);
  }
};

// API 키 확인 함수
export const checkDeepSeekAPIKey = () => {
  return (
    process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY &&
    process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here'
  );
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
  } else {
    return '그런 이야기를 들려주셔서 고마워요. 당신의 마음을 이해하려고 노력할게요.';
  }
};

// DeepSeek AI 정보
export const deepseekAIInfo = {
  title: 'DeepSeek AI 시스템',
  description:
    'DeepSeek의 고성능 AI 모델을 사용한 자연스러운 대화 시스템입니다.',
  features: [
    '✅ 자연스러운 한국어 대화',
    '✅ 맥락 이해',
    '✅ 감정 공감',
    '✅ 수면 특화 조언',
    '✅ 빠른 응답',
  ],
  setupGuide: {
    title: 'DeepSeek API 설정',
    description: '고성능 AI로 더 나은 대화를 경험하세요.',
    steps: [
      '1. https://platform.deepseek.com/ 에서 계정 생성',
      '2. API Keys에서 새 키 생성',
      '3. .env.local 파일에 NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-... 추가',
      '4. 앱 재시작',
    ],
    costs: {
      deepseek: 'DeepSeek Chat: 약 $0.001/1K 토큰',
      note: '일반적인 대화 1회당 약 $0.005-0.02',
    },
  },
};
