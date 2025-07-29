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
import { getSmartResponse } from '../utils/aiResponses';

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [useHuggingFace, setUseHuggingFace] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Hugging Face API 키 확인
    setUseHuggingFace(checkAPIKey());

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
        // Hugging Face API 사용 여부에 따라 다른 응답 생성
        if (useHuggingFace) {
          try {
            aiResponse = await generateSleepResponse(inputMessage);
          } catch (error) {
            console.error('Hugging Face API 에러:', error);
            // API 에러 시 기본 응답 사용
            aiResponse = getSmartResponse(inputMessage);
          }
        } else {
          // 기본 키워드 기반 응답
          aiResponse = getSmartResponse(inputMessage);
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
    return timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
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

          {/* AI 모드 표시 */}
          <div className={styles.aiMode}>
            {useHuggingFace ? (
              <span className={styles.hfMode}>🤖 Hugging Face AI</span>
            ) : (
              <span className={styles.basicMode}>💭 기본 응답</span>
            )}
          </div>
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

          {/* Hugging Face 설정 안내 */}
          {!useHuggingFace && (
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
          )}
        </div>
      </main>
    </div>
  );
}
