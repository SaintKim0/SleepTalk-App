import { useState, useEffect, useRef } from 'react';
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
  const audioRef = useRef(null);

  const sounds = [
    { id: 'rain', icon: '🌧️' },
    { id: 'ocean', icon: '🌊' },
    { id: 'forest', icon: '🌲' },
    { id: 'heartbeat', icon: '💓' },
    { id: 'whiteNoise', icon: '🔇' },
    { id: 'crickets', icon: '🦗' },
  ];

  const timers = [10, 15, 30, 60];

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
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

    // 실제 오디오 파일 재생 시도
    try {
      const audio = new Audio();
      audio.src = `/sounds/${selectedSound.id}.mp3`;
      audio.loop = true;
      audio.volume = 0.3;

      audio.addEventListener('canplaythrough', () => {
        audio
          .play()
          .then(() => {
            console.log(
              `Playing ${t(
                `sounds.${selectedSound.id}.name`
              )} for ${selectedTimer} minutes`
            );
          })
          .catch((error) => {
            console.error('오디오 재생 실패:', error);
            // 오디오 파일이 없을 경우 브라우저에서 생성
            createBrowserAudio();
          });
      });

      audio.addEventListener('error', () => {
        console.log('오디오 파일을 찾을 수 없습니다. 브라우저에서 생성합니다.');
        createBrowserAudio();
      });

      audioRef.current = audio;
    } catch (error) {
      console.error('오디오 초기화 실패:', error);
      createBrowserAudio();
    }

    // 브라우저에서 오디오 생성하는 함수
    function createBrowserAudio() {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        let audioNodes = [];

        switch (selectedSound.id) {
          case 'rain':
            // 빗소리 - 여러 주파수의 노이즈
            for (let i = 0; i < 3; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(
                100 + i * 50,
                audioContext.currentTime
              );

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(800, audioContext.currentTime);

              gain.gain.setValueAtTime(0.05, audioContext.currentTime);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain, filter });
            }
            break;

          case 'ocean':
            // 바다 소리 - 긴 파도 소리
            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            const filter1 = audioContext.createBiquadFilter();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(80, audioContext.currentTime);

            filter1.type = 'lowpass';
            filter1.frequency.setValueAtTime(400, audioContext.currentTime);

            gain1.gain.setValueAtTime(0.08, audioContext.currentTime);

            osc1.connect(filter1);
            filter1.connect(gain1);
            gain1.connect(audioContext.destination);

            osc1.start();
            audioNodes.push({
              oscillator: osc1,
              gainNode: gain1,
              filter: filter1,
            });
            break;

          case 'forest':
            // 숲 소리 - 새소리와 바람소리
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(250, audioContext.currentTime);

            gain2.gain.setValueAtTime(0.06, audioContext.currentTime);

            osc2.connect(gain2);
            gain2.connect(audioContext.destination);

            osc2.start();
            audioNodes.push({ oscillator: osc2, gainNode: gain2 });
            break;

          case 'heartbeat':
            // 심장박동 - 규칙적인 박동
            const osc3 = audioContext.createOscillator();
            const gain3 = audioContext.createGain();

            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(60, audioContext.currentTime);

            gain3.gain.setValueAtTime(0.1, audioContext.currentTime);

            osc3.connect(gain3);
            gain3.connect(audioContext.destination);

            osc3.start();
            audioNodes.push({ oscillator: osc3, gainNode: gain3 });
            break;

          case 'whiteNoise':
            // 화이트 노이즈
            const bufferSize = audioContext.sampleRate * 2;
            const buffer = audioContext.createBuffer(
              1,
              bufferSize,
              audioContext.sampleRate
            );
            const output = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = audioContext.createBufferSource();
            const gain4 = audioContext.createGain();

            whiteNoise.buffer = buffer;
            whiteNoise.loop = true;

            gain4.gain.setValueAtTime(0.05, audioContext.currentTime);

            whiteNoise.connect(gain4);
            gain4.connect(audioContext.destination);

            whiteNoise.start();
            audioNodes.push({ oscillator: whiteNoise, gainNode: gain4 });
            break;

          case 'crickets':
            // 귀뚜라미 소리
            const osc5 = audioContext.createOscillator();
            const gain5 = audioContext.createGain();

            osc5.type = 'sine';
            osc5.frequency.setValueAtTime(300, audioContext.currentTime);

            gain5.gain.setValueAtTime(0.07, audioContext.currentTime);

            osc5.connect(gain5);
            gain5.connect(audioContext.destination);

            osc5.start();
            audioNodes.push({ oscillator: osc5, gainNode: gain5 });
            break;

          default:
            // 기본 소리
            const osc6 = audioContext.createOscillator();
            const gain6 = audioContext.createGain();

            osc6.type = 'sine';
            osc6.frequency.setValueAtTime(200, audioContext.currentTime);

            gain6.gain.setValueAtTime(0.08, audioContext.currentTime);

            osc6.connect(gain6);
            gain6.connect(audioContext.destination);

            osc6.start();
            audioNodes.push({ oscillator: osc6, gainNode: gain6 });
        }

        audioRef.current = { context: audioContext, nodes: audioNodes };
        console.log(
          `Playing ${t(
            `sounds.${selectedSound.id}.name`
          )} for ${selectedTimer} minutes`
        );
      } catch (error) {
        console.error('브라우저 오디오 생성 실패:', error);
        console.log(
          `Playing ${t(
            `sounds.${selectedSound.id}.name`
          )} for ${selectedTimer} minutes`
        );
      }
    }
  };

  const handleStopSleep = () => {
    setIsPlaying(false);
    setTimeRemaining(null);
    setIsDimmed(false);

    // 오디오 정지
    if (audioRef.current) {
      if (audioRef.current.pause) {
        // Audio 객체인 경우
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else if (audioRef.current.nodes) {
        // Web Audio API 노드인 경우
        audioRef.current.nodes.forEach((node) => {
          if (node.oscillator && node.oscillator.stop) {
            node.oscillator.stop();
          }
        });
        audioRef.current.context.close();
      }
      audioRef.current = null;
    }
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
          <p className={styles.sleepText}>{t('sleepModeText')}</p>

          {timeRemaining && (
            <div className={styles.timer}>
              <span className={styles.timerText}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}

          <button className={styles.stopButton} onClick={handleStopSleep}>
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
                className={`${styles.soundCard} ${
                  selectedSound?.id === sound.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedSound(sound)}
              >
                <div className={styles.soundIcon}>{sound.icon}</div>
                <h3 className={styles.soundName}>
                  {t(`sounds.${sound.id}.name`)}
                </h3>
                <p className={styles.soundDescription}>
                  {t(`sounds.${sound.id}.description`)}
                </p>
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
                className={`${styles.timerButton} ${
                  selectedTimer === timer ? styles.selected : ''
                }`}
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
