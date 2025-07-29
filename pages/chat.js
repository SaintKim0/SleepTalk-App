import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Chat.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { getSmartResponse, analyzeEmotion } from '../utils/aiResponses';

export default function Chat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
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

    // 스마트 응답 시스템 사용
    setTimeout(() => {
      let aiResponse;

      if (turnCount >= 4) {
        // 마지막 턴에서는 수면 모드로 안내
        aiResponse = t('finalMessage');
      } else {
        // 사용자 메시지에 따른 스마트 응답
        aiResponse = getSmartResponse(inputMessage);
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
