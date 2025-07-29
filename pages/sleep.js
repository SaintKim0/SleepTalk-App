import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Sleep.module.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sleep() {
  const { t } = useLanguage();
  const [selectedSound, setSelectedSound] = useState(null);
  const [selectedTimer, setSelectedTimer] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isDimmed, setIsDimmed] = useState(false);

  const sounds = [
    { id: 'rain', icon: '🌧️' },
    { id: 'ocean', icon: '🌊' },
    { id: 'forest', icon: '🌲' },
    { id: 'heartbeat', icon: '💓' },
    { id: 'whiteNoise', icon: '🔇' },
    { id: 'crickets', icon: '🦗' }
  ];

  const timers = [10, 15, 30, 60];

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setIsDimmed(false);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const handleStartSleep = () => {
    if (!selectedSound) return;
    
    setIsPlaying(true);
    setTimeRemaining(selectedTimer * 60);
    setIsDimmed(true);
    
    // 실제로는 여기서 오디오를 재생합니다
    console.log(`Playing ${t(`sounds.${selectedSound.id}.name`)} for ${selectedTimer} minutes`);
  };

  const handleStopSleep = () => {
    setIsPlaying(false);
    setTimeRemaining(null);
    setIsDimmed(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isDimmed) {
    return (
      <div className={styles.dimmedContainer}>
        <Head>
          <title>Sleep Mode - SleepTalk</title>
        </Head>
        
        <div className={styles.dimmedContent}>
          <div className={styles.sleepIcon}>🌙</div>
          <h1 className={styles.sleepTitle}>{t('timeToSleep')}</h1>
          <p className={styles.sleepText}>
            {t('sleepModeText')}
          </p>
          
          {timeRemaining && (
            <div className={styles.timer}>
              <span className={styles.timerText}>{formatTime(timeRemaining)}</span>
            </div>
          )}
          
          <button 
            className={styles.stopButton}
            onClick={handleStopSleep}
          >
            {t('stopSleepMode')}
          </button>
          
          <div className={styles.sleepTips}>
            {t('sleepModeTips').map((tip, index) => (
              <p key={index}>💡 {tip}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sleep Mode - SleepTalk</title>
        <meta name="description" content="Choose your sleep sounds and timer" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/chat" className={styles.backButton}>
            ← Back
          </Link>
          <h1 className={styles.title}>🌙 {t('sleepTitle')}</h1>
          <p className={styles.subtitle}>{t('sleepSubtitle')}</p>
        </div>

        <div className={styles.soundSection}>
          <h2 className={styles.sectionTitle}>{t('selectSound')}</h2>
          <div className={styles.soundGrid}>
            {sounds.map((sound) => (
              <button
                key={sound.id}
                className={`${styles.soundCard} ${selectedSound?.id === sound.id ? styles.selected : ''}`}
                onClick={() => setSelectedSound(sound)}
              >
                <div className={styles.soundIcon}>{sound.icon}</div>
                <h3 className={styles.soundName}>{t(`sounds.${sound.id}.name`)}</h3>
                <p className={styles.soundDescription}>{t(`sounds.${sound.id}.description`)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.timerSection}>
          <h2 className={styles.sectionTitle}>{t('setTimer')}</h2>
          <div className={styles.timerGrid}>
            {timers.map((timer) => (
              <button
                key={timer}
                className={`${styles.timerButton} ${selectedTimer === timer ? styles.selected : ''}`}
                onClick={() => setSelectedTimer(timer)}
              >
                {timer} min
              </button>
            ))}
          </div>
        </div>

        <div className={styles.startSection}>
          <button
            className={styles.startButton}
            onClick={handleStartSleep}
            disabled={!selectedSound}
          >
            {t('startSleepMode')}
          </button>
          <p className={styles.startText}>
            {t('timerText', { minutes: selectedTimer })}
          </p>
        </div>

        <div className={styles.tips}>
          <h3 className={styles.tipsTitle}>💡 {t('sleepTips')}</h3>
          <ul className={styles.tipsList}>
            {t('sleepTipsList').map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
