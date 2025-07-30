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

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
        max_tokens: maxTokens,
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API 에러:', errorData);
      throw new Error(`OpenAI API 에러: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('GPT API 처리 에러:', error);
    res.status(500).json({
      error: 'GPT API 호출 중 오류가 발생했습니다.',
      details: error.message,
    });
  }
}
