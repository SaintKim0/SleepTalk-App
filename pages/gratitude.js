import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Gratitude.module.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function Gratitude() {
  const { t } = useLanguage();
  const [gratitudeEntries, setGratitudeEntries] = useState(['', '', '']);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const prompts = t('prompts');

  const handleEntryChange = (index, value) => {
    const newEntries = [...gratitudeEntries];
    newEntries[index] = value;
    setGratitudeEntries(newEntries);
  };

  const handleNext = () => {
    if (currentEntry < 2) {
      setCurrentEntry(currentEntry + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleSkip = () => {
    if (currentEntry < 2) {
      setCurrentEntry(currentEntry + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleComplete = () => {
    // 여기서 데이터를 저장하고 다음 페이지로 이동
    console.log('Gratitude entries:', gratitudeEntries);
    window.location.href = '/chat';
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Gratitude Journal - SleepTalk</title>
        <meta
          name="description"
          content="Write about 3 good things from your day"
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Back
          </Link>
          <h1 className={styles.title}>📝 {t('gratitudeTitle')}</h1>
          <p className={styles.subtitle}>{t('gratitudeSubtitle')}</p>
        </div>

        {!isComplete ? (
          <div className={styles.journalSection}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${((currentEntry + 1) / 3) * 100}%` }}
              ></div>
            </div>

            <div className={styles.promptSection}>
              <h2 className={styles.promptTitle}>
                {t('entryOf', { current: currentEntry + 1, total: 3 })}
              </h2>
              <p className={styles.prompt}>{prompts[currentEntry]}</p>
            </div>

            <div className={styles.inputSection}>
              <textarea
                className={styles.gratitudeInput}
                placeholder={t('writeThoughts')}
                value={gratitudeEntries[currentEntry]}
                onChange={(e) =>
                  handleEntryChange(currentEntry, e.target.value)
                }
                rows={4}
                autoFocus
              />
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.skipButton} onClick={handleSkip}>
                {t('skip')}
              </button>
              <button
                className={styles.nextButton}
                onClick={handleNext}
                disabled={!gratitudeEntries[currentEntry].trim()}
              >
                {currentEntry === 2 ? t('complete') : t('next')}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.completeSection}>
            <div className={styles.completeIcon}>✨</div>
            <h2 className={styles.completeTitle}>{t('thankYouForSharing')}</h2>
            <p className={styles.completeText}>{t('gratitudePracticeText')}</p>

            <div className={styles.summarySection}>
              <h3 className={styles.summaryTitle}>
                {t('yourGratitudeMoments')}
              </h3>
              <div className={styles.summaryList}>
                {gratitudeEntries.map(
                  (entry, index) =>
                    entry.trim() && (
                      <div key={index} className={styles.summaryItem}>
                        <span className={styles.summaryNumber}>
                          {index + 1}
                        </span>
                        <span className={styles.summaryText}>{entry}</span>
                      </div>
                    )
                )}
              </div>
            </div>

            <button className={styles.continueButton} onClick={handleComplete}>
              {t('continueToChat')}
            </button>
          </div>
        )}

        <div className={styles.tips}>
          <h3 className={styles.tipsTitle}>💡 {t('gratitudeTips')}</h3>
          <ul className={styles.tipsList}>
            {t('gratitudeTipsList').map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
