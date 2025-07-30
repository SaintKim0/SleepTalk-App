// GPT API 서버 엔드포인트

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      message,
      conversationHistory = [],
      maxTokens = 150,
      temperature = 0.7,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // API 키 확인
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      console.error('OpenAI API 키가 설정되지 않았습니다.');
      return res.status(500).json({
        error: 'OpenAI API 키가 설정되지 않았습니다.',
        details: '환경변수 NEXT_PUBLIC_OPENAI_API_KEY를 확인해주세요.',
      });
    }

    console.log('OpenAI API 호출 시작...');
    console.log('메시지:', message);
    console.log('대화 히스토리 길이:', conversationHistory.length);

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `당신은 수면과 정신 건강을 돕는 귀엽고 친근한 AI 동반자예요! 
              사용자의 감정을 이해하고 따뜻하게 위로하며, 수면에 도움이 되는 조언을 제공해요.
              한국어로 자연스럽고 귀엽게 응답하되, 100자 이내로 간결하게 답변하세요.
              말끝에 '~요', '~해요', '~이에요' 등을 사용해서 친근하게 대화해주세요! 😊`,
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
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });

    console.log('OpenAI API 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API 에러:', errorData);
      throw new Error(
        `OpenAI API 에러: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();

    console.log('AI 응답 생성 완료:', aiResponse.substring(0, 50) + '...');

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('GPT API 처리 에러:', error);
    res.status(500).json({
      error: 'GPT API 호출 중 오류가 발생했습니다.',
      details: error.message,
    });
  }
}
