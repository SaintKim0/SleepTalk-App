import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import ChatModal from '../components/ChatModal';

export default function Home() {
  const { t } = useLanguage();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // 감정 색상 매핑
  const emotionColors = [
    { emotionKey: 'sadness', icon: '😢' },
    { emotionKey: 'calm', icon: '😌' },
    { emotionKey: 'anxiety', icon: '😰' },
    { emotionKey: 'gratitude', icon: '🙏' },
    { emotionKey: 'joy', icon: '😊' },
    { emotionKey: 'loneliness', icon: '🥺' },
    { emotionKey: 'hope', icon: '✨' },
    { emotionKey: 'contentment', icon: '😌' },
  ];

  const handleEmotionSelect = (emotionKey) => {
    setSelectedEmotion(emotionKey);
    setIsChatModalOpen(true);
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
    setSelectedEmotion(null);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SleepTalk - AI 동반자</title>
        <meta name="description" content="AI와 함께하는 수면 준비" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌙 SleepTalk</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.quoteSection}>
          <blockquote className={styles.quote}>"{t('quote')}"</blockquote>
        </div>

        <section className={styles.colorPalette}>
          <h2 className={styles.sectionTitle}>{t('howDoYouFeel')}</h2>
          <div className={styles.emotionGrid}>
            {emotionColors.map((emotion) => (
              <button
                key={emotion.emotionKey}
                className={`${styles.colorButton} ${
                  selectedEmotion === emotion.emotionKey ? styles.selected : ''
                }`}
                data-emotion={emotion.emotionKey}
                onClick={() => handleEmotionSelect(emotion.emotionKey)}
                aria-label={`Select ${t(
                  `emotions.${emotion.emotionKey}.name`
                )} emotion`}
              >
                <div className={styles.emotionContent}>
                  <span className={styles.emotionIcon}>{emotion.icon}</span>
                  <span className={styles.emotionLabel}>
                    {t(`emotions.${emotion.emotionKey}.name`)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.advice}>
          <h2 className={styles.adviceTitle}>{t('adviceTitle')}</h2>
          <p className={styles.adviceText}>{t('adviceText')}</p>
          <Link href="/gratitude" className={styles.nextButton}>
            {t('nextStep')}
          </Link>
        </section>

        <section className={styles.features}>
          <h2 className={styles.featuresTitle}>{t('featuresTitle')}</h2>
          <ul className={styles.featuresList}>
            {t('featuresList').map((feature, index) => (
              <li key={index} className={styles.feature}>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* 모달 대화창 */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
        selectedEmotion={selectedEmotion}
      />
    </div>
  );
}
