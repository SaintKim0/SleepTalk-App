import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chat.module.css';
import { useLanguage } from '../contexts/LanguageContext';
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
    setUseGPT(checkGPTAPIKey());
    setUseDeepSeek(checkDeepSeekAPIKey());

    // 기본 모드 설정 (우선순위: DeepSeek > GPT > Smart)
    let initialAiMode = 'smart';
    if (checkDeepSeekAPIKey()) {
      initialAiMode = 'deepseek';
    } else if (checkGPTAPIKey()) {
      initialAiMode = 'gpt';
    }
    setAiMode(initialAiMode);

    // AI 모드에 따른 초기 메시지 설정
    const getInitialMessage = () => {
      switch (initialAiMode) {
        case 'deepseek':
          return '안녕하세요! 저는 디피(Deepy)예요! 🧠\n\n오늘 밤 당신의 이야기를 듣고 응원해드릴게요~ 기분이 어떠신가요? 😊';
        case 'gpt':
          return '안녕하세요! 저는 체시(Chaty)예요! 💬\n\n오늘 밤 당신의 이야기를 듣고 함께해드릴게요~ 기분이 어떠신가요? 😊';
        default:
          return '안녕하세요! 저는 스마트 AI예요! 🤖\n\n오늘 밤 당신의 이야기를 듣고 도와드릴게요~ 기분이 어떠신가요? 😊';
      }
    };

    // 초기 AI 메시지
    const initialMessage = {
      id: 1,
      text: getInitialMessage(),
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

    // AI 모드에 따른 초기 메시지 설정
    const getInitialMessage = () => {
      switch (mode) {
        case 'deepseek':
          return '안녕하세요! 저는 디피(Deepy)예요! 🧠\n\n오늘 밤 당신의 이야기를 듣고 응원해드릴게요~ 기분이 어떠신가요? 😊';
        case 'gpt':
          return '안녕하세요! 저는 체시(Chaty)예요! 💬\n\n오늘 밤 당신의 이야기를 듣고 함께해드릴게요~ 기분이 어떠신가요? 😊';
        default:
          return '안녕하세요! 저는 스마트 AI예요! 🤖\n\n오늘 밤 당신의 이야기를 듣고 도와드릴게요~ 기분이 어떠신가요? 😊';
      }
    };

    // AI 모드 변경 시 대화 컨텍스트 초기화 (스마트 AI인 경우)
    if (mode === 'smart') {
      resetConversationContext();
    }

    // 초기 메시지 업데이트
    const initialMessage = {
      id: 1,
      text: getInitialMessage(),
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setTurnCount(0);
    setShowEndMessage(false);
  };

  const handleResetConversation = () => {
    // AI 모드에 따른 초기 메시지 설정
    const getInitialMessage = () => {
      switch (aiMode) {
        case 'deepseek':
          return '안녕하세요! 저는 디피(Deepy)예요! 🧠\n\n오늘 밤 당신의 이야기를 듣고 응원해드릴게요~ 기분이 어떠신가요? 😊';
        case 'gpt':
          return '안녕하세요! 저는 체시(Chaty)예요! 💬\n\n오늘 밤 당신의 이야기를 듣고 함께해드릴게요~ 기분이 어떠신가요? 😊';
        default:
          return '안녕하세요! 저는 스마트 AI예요! 🤖\n\n오늘 밤 당신의 이야기를 듣고 도와드릴게요~ 기분이 어떠신가요? 😊';
      }
    };

    // 대화 초기화
    setMessages([
      {
        id: 1,
        text: getInitialMessage(),
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
              🤖
            </button>
            <button
              className={`${styles.aiModeButton} ${
                aiMode === 'deepseek' ? styles.active : ''
              } ${!useDeepSeek ? styles.disabled : ''}`}
              onClick={() => useDeepSeek && handleAiModeChange('deepseek')}
              disabled={!useDeepSeek}
            >
              🧠
            </button>
            <button
              className={`${styles.aiModeButton} ${
                aiMode === 'gpt' ? styles.active : ''
              } ${!useGPT ? styles.disabled : ''}`}
              onClick={() => useGPT && handleAiModeChange('gpt')}
              disabled={!useGPT}
            >
              💬
            </button>
          </div>

          {/* AI 모드 표시 */}
          <div className={styles.aiMode}>
            {aiMode === 'deepseek' && useDeepSeek ? (
              <span className={styles.deepseekMode}>🧠 디피(Deepy)</span>
            ) : aiMode === 'gpt' && useGPT ? (
              <span className={styles.gptMode}>🧠 체시(Chaty)</span>
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
        </div>
      </main>
    </div>
  );
}
