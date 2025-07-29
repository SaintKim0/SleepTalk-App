// Hugging Face API를 사용한 AI 채팅 시스템

// 감정 분석을 위한 한국어 모델
const EMOTION_MODEL = 'beomi/KcELECTRA-base-v2022';

// 텍스트 생성을 위한 한국어 모델
const TEXT_GENERATION_MODEL = 'skt/ko-gpt-trinity-1.2B-v0.5';

// 감정 분석 함수
export const analyzeEmotion = async (message) => {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${EMOTION_MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('감정 분석 에러:', error);
    return null;
  }
};

// 수면 특화 응답 생성 함수
export const generateSleepResponse = async (message, emotion = null) => {
  try {
    // 감정이 없으면 먼저 분석
    if (!emotion) {
      emotion = await analyzeEmotion(message);
    }

    // 수면에 특화된 프롬프트 생성
    const prompt = `사용자: ${message}

감정 상태: ${emotion ? emotion[0]?.label || 'neutral' : 'neutral'}

위의 사용자 메시지에 대해 수면에 도움이 되는 따뜻하고 위로가 되는 응답을 한국어로 해주세요. 
응답은 50자 이내로 간결하게 작성해주세요.`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${TEXT_GENERATION_MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return (
      result[0]?.generated_text || '함께 이야기 나누는 시간이 정말 소중해요.'
    );
  } catch (error) {
    console.error('응답 생성 에러:', error);
    // 에러 시 기본 응답 반환
    return getFallbackResponse(message);
  }
};

// 기본 응답 (API 에러 시 사용)
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

// API 키 확인 함수
export const checkAPIKey = () => {
  return (
    process.env.NEXT_PUBLIC_HF_API_KEY &&
    process.env.NEXT_PUBLIC_HF_API_KEY !== 'your_huggingface_api_key_here'
  );
};

// 설정 가이드
export const setupGuide = {
  title: 'Hugging Face API 설정',
  steps: [
    '1. https://huggingface.co/ 에서 계정 생성',
    '2. Settings → Access Tokens에서 새 토큰 생성',
    '3. .env.local 파일에 NEXT_PUBLIC_HF_API_KEY=your_token 추가',
    '4. 앱 재시작',
  ],
  limits: {
    free: '무료: 월 30,000 요청',
    paid: '유료: 월 100,000 요청부터',
  },
};
