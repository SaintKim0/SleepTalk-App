import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chat.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateSleepResponse,
  checkAPIKey,
  setupGuide,
} from '../utils/huggingFaceAI';
import {
  generateSmartResponse,
  smartAIInfo,
  resetConversationContext,
} from '../utils/smartAI';
import { generateGPTResponse, checkGPTAPIKey, gptAIInfo } from '../utils/gptAI';
import {
  generateDeepSeekResponse,
  checkDeepSeekAPIKey,
  deepseekAIInfo,
} from '../utils/deepseekAI';

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [useHuggingFace, setUseHuggingFace] = useState(false);
  const [useGPT, setUseGPT] = useState(false);
  const [useDeepSeek, setUseDeepSeek] = useState(false);
  const [aiMode, setAiMode] = useState('smart');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // API 키 확인
    setUseHuggingFace(checkAPIKey());
    setUseGPT(checkGPTAPIKey());
    setUseDeepSeek(checkDeepSeekAPIKey());

    // 기본 모드 설정 (우선순위: DeepSeek > GPT > Hugging Face > Smart)
    if (checkDeepSeekAPIKey()) {
      setAiMode('deepseek');
    } else if (checkGPTAPIKey()) {
      setAiMode('gpt');
    } else if (checkAPIKey()) {
      setAiMode('huggingface');
    } else {
      setAiMode('smart');
    }

    // 초기 AI 메시지
    const initialMessage = {
      id: 1,
      text: t('initialMessage'),
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [t]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || turnCount >= 5) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setTurnCount((prev) => prev + 1);

    // AI 응답 생성
    setTimeout(async () => {
      let aiResponse;

      if (turnCount >= 4) {
        // 마지막 턴에서는 수면 모드로 안내
        aiResponse = t('finalMessage');
      } else {
        // AI 모드에 따라 다른 응답 생성
        try {
          switch (aiMode) {
            case 'deepseek':
              if (useDeepSeek) {
                const conversationHistory = messages.slice(-6);
                aiResponse = await generateDeepSeekResponse(
                  inputMessage,
                  conversationHistory
                );
              } else {
                setAiMode('smart');
                aiResponse = await generateSmartResponse(inputMessage);
              }
              break;
            case 'gpt':
              if (useGPT) {
                const conversationHistory = messages.slice(-6);
                aiResponse = await generateGPTResponse(
                  inputMessage,
                  conversationHistory
                );
              } else {
                setAiMode('smart');
                aiResponse = await generateSmartResponse(inputMessage);
              }
              break;
            case 'huggingface':
              if (useHuggingFace) {
                aiResponse = await generateSleepResponse(inputMessage);
              } else {
                setAiMode('smart');
                aiResponse = await generateSmartResponse(inputMessage);
              }
              break;
            default:
              aiResponse = await generateSmartResponse(inputMessage);
              break;
          }
        } catch (error) {
          console.error('AI 응답 생성 에러:', error);
          // 에러 시 스마트 AI로 폴백
          setAiMode('smart');
          aiResponse = await generateSmartResponse(inputMessage);
        }
      }

      const aiMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      if (turnCount >= 4) {
        setTimeout(() => {
          setShowEndMessage(true);
        }, 2000);
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAiModeChange = (mode) => {
    setAiMode(mode);
    // AI 모드 변경 시 대화 컨텍스트 초기화 (스마트 AI인 경우)
    if (mode === 'smart') {
      resetConversationContext();
    }
  };

  const handleResetConversation = () => {
    // 대화 초기화
    setMessages([
      {
        id: 1,
        text: t('initialMessage'),
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    setTurnCount(0);
    setShowEndMessage(false);
    // 스마트 AI 컨텍스트도 초기화
    if (aiMode === 'smart') {
      resetConversationContext();
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Chat - SleepTalk</title>
        <meta name="description" content="Chat with your AI companion" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/gratitude" className={styles.backButton}>
            ← Back
          </Link>
          <h1 className={styles.title}>💬 {t('chatTitle')}</h1>
          <p className={styles.subtitle}>{t('chatSubtitle')}</p>
          <div className={styles.turnCounter}>
            {t('turn', { current: turnCount, total: 5 })}
          </div>

          {/* AI 모드 선택 */}
          <div className={styles.aiModeSelector}>
            <button
              className={`${styles.aiModeButton} ${
                aiMode === 'smart' ? styles.active : ''
              }`}
              onClick={() => handleAiModeChange('smart')}
            >
              🤖 스마트 AI
            </button>
            <button
              className={`${styles.aiModeButton} ${
                aiMode === 'huggingface' ? styles.active : ''
              } ${!useHuggingFace ? styles.disabled : ''}`}
              onClick={() =>
                useHuggingFace && handleAiModeChange('huggingface')
              }
              disabled={!useHuggingFace}
            >
              🧠 Hugging Face AI
            </button>
            <button
              className={`${styles.aiModeButton} ${
                aiMode === 'deepseek' ? styles.active : ''
              } ${!useDeepSeek ? styles.disabled : ''}`}
              onClick={() => useDeepSeek && handleAiModeChange('deepseek')}
              disabled={!useDeepSeek}
            >
              🧠 DeepSeek AI
            </button>
            <button
              className={`${styles.aiModeButton} ${
                aiMode === 'gpt' ? styles.active : ''
              } ${!useGPT ? styles.disabled : ''}`}
              onClick={() => useGPT && handleAiModeChange('gpt')}
              disabled={!useGPT}
            >
              🧠 GPT AI
            </button>
          </div>

          {/* AI 모드 표시 */}
          <div className={styles.aiMode}>
            {aiMode === 'deepseek' && useDeepSeek ? (
              <span className={styles.deepseekMode}>🧠 DeepSeek AI</span>
            ) : aiMode === 'gpt' && useGPT ? (
              <span className={styles.gptMode}>🧠 GPT AI</span>
            ) : aiMode === 'huggingface' && useHuggingFace ? (
              <span className={styles.hfMode}>🧠 Hugging Face AI</span>
            ) : (
              <span className={styles.smartMode}>🤖 스마트 AI</span>
            )}
          </div>

          {/* 대화 초기화 버튼 */}
          <button
            className={styles.resetButton}
            onClick={handleResetConversation}
            title="대화 초기화"
          >
            🔄 새로 시작
          </button>
        </div>

        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.sender]}`}
              >
                <div className={styles.messageContent}>
                  <p className={styles.messageText}>{message.text}</p>
                  <span className={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.message} ${styles.ai}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {!showEndMessage && turnCount < 5 && (
            <div className={styles.inputContainer}>
              <textarea
                className={styles.messageInput}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('shareThoughts')}
                rows={2}
                disabled={isTyping}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                {t('send')}
              </button>
            </div>
          )}
        </div>

        {showEndMessage && (
          <div className={styles.endMessage}>
            <div className={styles.endIcon}>🌙</div>
            <h2 className={styles.endTitle}>{t('timeForSleep')}</h2>
            <p className={styles.endText}>{t('chatEndText')}</p>
            <button
              className={styles.sleepButton}
              onClick={() => (window.location.href = '/sleep')}
            >
              {t('startSleepMode')}
            </button>
          </div>
        )}

        <div className={styles.tips}>
          <h3 className={styles.tipsTitle}>💡 {t('chatTips')}</h3>
          <ul className={styles.tipsList}>
            {t('chatTipsList').map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>

          {/* AI 시스템 정보 */}
          {aiMode === 'smart' ? (
            <div className={styles.setupGuide}>
              <h4>{smartAIInfo.title}</h4>
              <p>{smartAIInfo.description}</p>
              <ul>
                {smartAIInfo.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className={styles.howItWorks}>
                <h5>작동 방식:</h5>
                <ul>
                  {smartAIInfo.howItWorks.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : aiMode === 'deepseek' ? (
            <div className={styles.setupGuide}>
              <h4>{deepseekAIInfo.title}</h4>
              <p>{deepseekAIInfo.description}</p>
              <ul>
                {deepseekAIInfo.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className={styles.howItWorks}>
                <h5>비용 정보:</h5>
                <ul>
                  <li>{deepseekAIInfo.setupGuide.costs.deepseek}</li>
                  <li>{deepseekAIInfo.setupGuide.costs.note}</li>
                </ul>
              </div>
            </div>
          ) : aiMode === 'gpt' ? (
            <div className={styles.setupGuide}>
              <h4>{gptAIInfo.title}</h4>
              <p>{gptAIInfo.description}</p>
              <ul>
                {gptAIInfo.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className={styles.howItWorks}>
                <h5>비용 정보:</h5>
                <ul>
                  <li>{gptAIInfo.setupGuide.costs.gpt35}</li>
                  <li>{gptAIInfo.setupGuide.costs.gpt4}</li>
                  <li>{gptAIInfo.setupGuide.costs.note}</li>
                </ul>
              </div>
            </div>
          ) : (
            !useHuggingFace && (
              <div className={styles.setupGuide}>
                <h4>🤖 Hugging Face AI 사용하기</h4>
                <p>더 스마트한 AI 응답을 원하시나요?</p>
                <ul>
                  {setupGuide.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                <p>
                  <strong>무료 한도:</strong> {setupGuide.limits.free}
                </p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
