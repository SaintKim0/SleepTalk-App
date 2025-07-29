import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

// 감정 색상 매핑
const emotionColors = [
  { color: '#FF6B6B', emotionKey: 'sadness' },
  { color: '#4ECDC4', emotionKey: 'calm' },
  { color: '#45B7D1', emotionKey: 'anxiety' },
  { color: '#96CEB4', emotionKey: 'gratitude' },
  { color: '#FFEAA7', emotionKey: 'joy' },
  { color: '#DDA0DD', emotionKey: 'loneliness' },
  { color: '#98D8C8', emotionKey: 'hope' },
  { color: '#F7DC6F', emotionKey: 'contentment' },
];

export default function Home() {
  const { t, language, changeLanguage } = useLanguage();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [currentQuote, setCurrentQuote] = useState('');

  // 클라이언트 사이드에서만 인용구 설정
  useEffect(() => {
    const quotes = t('quotes');
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [t]);
  const [showAdvice, setShowAdvice] = useState(false);

  const handleEmotionSelect = (emotionKey) => {
    const emotion = {
      key: emotionKey,
      name: t(`emotions.${emotionKey}.name`),
      advice: t(`emotions.${emotionKey}.advice`),
    };
    setSelectedEmotion(emotion);
    setShowAdvice(true);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SleepTalk - Mental Wellness App</title>
        <meta
          name="description"
          content="A mental wellness app to help you fall asleep"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.languageSelector}>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={changeLanguage}
            />
          </div>
          <h1 className={styles.title}>🌙 {t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.quoteSection}>
          {currentQuote && <p className={styles.quote}>"{currentQuote}"</p>}
        </div>

        <div className={styles.emotionSection}>
          <h2 className={styles.sectionTitle}>{t('emotionQuestion')}</h2>
          <div className={styles.colorPalette}>
            {emotionColors.map((emotion, index) => (
              <button
                key={index}
                className={`${styles.colorButton} ${
                  selectedEmotion?.key === emotion.emotionKey
                    ? styles.selected
                    : ''
                }`}
                style={{ backgroundColor: emotion.color }}
                onClick={() => handleEmotionSelect(emotion.emotionKey)}
                aria-label={`Select ${t(
                  `emotions.${emotion.emotionKey}.name`
                )} emotion`}
              >
                <span className={styles.emotionLabel}>
                  {t(`emotions.${emotion.emotionKey}.name`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {showAdvice && selectedEmotion && (
          <div className={styles.adviceSection}>
            <h3 className={styles.adviceTitle}>
              {language === 'ko'
                ? `당신의 ${selectedEmotion.name}한 마음을 위해:`
                : `For your ${selectedEmotion.name.toLowerCase()} heart:`}
            </h3>
            <p className={styles.adviceText}>{selectedEmotion.advice}</p>
            <button
              className={styles.nextButton}
              onClick={() => (window.location.href = '/gratitude')}
            >
              {t('continueToGratitude')}
            </button>
          </div>
        )}

        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>{t('tonightsJourney')}</h3>
          <div className={styles.featureList}>
            <div className={styles.feature}>🎨 {t('chooseEmotion')}</div>
            <div className={styles.feature}>📝 {t('writeGratefulMoments')}</div>
            <div className={styles.feature}>💬 {t('chatWithAI')}</div>
            <div className={styles.feature}>🌙 {t('driftToSleep')}</div>
          </div>
        </div>
      </main>

      {/* PWA 설치 프롬프트 */}
      <PWAInstallPrompt />
    </div>
  );
}
