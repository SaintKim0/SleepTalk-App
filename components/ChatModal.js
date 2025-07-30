import { useState, useRef, useEffect } from 'react';
import styles from '../styles/ChatModal.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateSmartResponse,
  resetConversationContext,
} from '../utils/smartAI';
import { generateGPTResponse, checkGPTAPIKey } from '../utils/gptAI';
import {
  generateDeepSeekResponse,
  checkDeepSeekAPIKey,
} from '../utils/deepseekAI';

export default function ChatModal({ isOpen, onClose, selectedEmotion }) {
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
  const modalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
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
        const emotionText = selectedEmotion ? `\n\n선택하신 감정: ${t(`emotions.${selectedEmotion}.name`)}` : '';
        
        switch (initialAiMode) {
          case 'deepseek':
            return `안녕하세요! 저는 디피(Deepy)예요! 🧠\n\n오늘 밤 당신의 이야기를 듣고 응원해드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
          case 'gpt':
            return `안녕하세요! 저는 체시(Chaty)예요! 💬\n\n오늘 밤 당신의 이야기를 듣고 함께해드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
          default:
            return `안녕하세요! 저는 스마트 AI예요! 🤖\n\n오늘 밤 당신의 이야기를 듣고 도와드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
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
      setTurnCount(0);
      setShowEndMessage(false);
    }
  }, [isOpen, selectedEmotion, t]);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
      const emotionText = selectedEmotion ? `\n\n선택하신 감정: ${t(`emotions.${selectedEmotion}.name`)}` : '';
      
      switch (mode) {
        case 'deepseek':
          return `안녕하세요! 저는 디피(Deepy)예요! 🧠\n\n오늘 밤 당신의 이야기를 듣고 응원해드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
        case 'gpt':
          return `안녕하세요! 저는 체시(Chaty)예요! 💬\n\n오늘 밤 당신의 이야기를 듣고 함께해드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
        default:
          return `안녕하세요! 저는 스마트 AI예요! 🤖\n\n오늘 밤 당신의 이야기를 듣고 도와드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
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
      const emotionText = selectedEmotion ? `\n\n선택하신 감정: ${t(`emotions.${selectedEmotion}.name`)}` : '';
      
      switch (aiMode) {
        case 'deepseek':
          return `안녕하세요! 저는 디피(Deepy)예요! 🧠\n\n오늘 밤 당신의 이야기를 듣고 응원해드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
        case 'gpt':
          return `안녕하세요! 저는 체시(Chaty)예요! 💬\n\n오늘 밤 당신의 이야기를 듣고 함께해드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
        default:
          return `안녕하세요! 저는 스마트 AI예요! 🤖\n\n오늘 밤 당신의 이야기를 듣고 도와드릴게요~ 기분이 어떠신가요? 😊${emotionText}`;
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

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
          <h2 className={styles.modalTitle}>💬 AI 동반자</h2>
          <div className={styles.turnCounter}>
            {t('turn', { current: turnCount, total: 5 })}
          </div>
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

        {/* AI 모드 표시와 대화 초기화 버튼 */}
        <div className={styles.aiMode}>
          <div className={styles.aiModeDisplay}>
            {aiMode === 'deepseek' && useDeepSeek ? (
              <span className={styles.deepseekMode}>🧠 디피(Deepy)</span>
            ) : aiMode === 'gpt' && useGPT ? (
              <span className={styles.gptMode}>🧠 체시(Chaty)</span>
            ) : (
              <span className={styles.smartMode}>🤖 스마트 AI</span>
            )}
          </div>
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
      </div>
    </div>
  );
} 