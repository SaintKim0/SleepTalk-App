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
  const [showTimerExpired, setShowTimerExpired] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const audioRef = useRef(null);

  const sounds = [
    { id: 'rain', icon: '🌧️' },
    { id: 'ocean', icon: '🌊' },
    { id: 'forest', icon: '🌲' },
    { id: 'guitar', icon: '🎸' },
    { id: 'jazz2', icon: '🎷' },
    { id: 'crickets', icon: '🦗' },
    { id: 'jazz', icon: '🎷' },
    { id: 'classical', icon: '🎻' },
    { id: 'lullaby', icon: '🎵' },
    { id: 'piano', icon: '🎹' },
    { id: 'ambient', icon: '🎼' },
    { id: 'nature', icon: '🌿' },
  ];

  const timers = [10, 15, 30, 60];

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            console.log('타이머 만료 - 수면 모드 자동 종료');
            setIsPlaying(false);
            setIsDimmed(false);
                         setShowTimerExpired(true);
             setCountdown(3);
             
             // 타이머 만료 시 오디오 정리
            if (audioRef.current) {
              try {
                if (audioRef.current.pause) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                  audioRef.current.src = '';
                } else if (audioRef.current.nodes) {
                  const context = audioRef.current.context;
                  const nodes = audioRef.current.nodes;
                  
                  nodes.forEach((node) => {
                    try {
                      if (node.gainNode) {
                        node.gainNode.gain.setValueAtTime(0, context.currentTime);
                        node.gainNode.disconnect();
                      }
                      if (node.oscillator && node.oscillator.stop) {
                        node.oscillator.stop();
                        node.oscillator.disconnect();
                      }
                      if (node.filter) {
                        node.filter.disconnect();
                      }
                    } catch (e) {
                      console.log('타이머 만료 - 노드 정리 중 오류:', e);
                    }
                  });
                  
                  if (context && context.state !== 'closed') {
                    try {
                      context.close();
                    } catch (e) {
                      console.log('타이머 만료 - AudioContext 정리 중 오류:', e);
                    }
                  }
                }
              } catch (error) {
                console.error('타이머 만료 - 오디오 정리 중 오류:', error);
              } finally {
                audioRef.current = null;
              }
            }
            
            
            
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  // 타이머 만료 시 카운트다운
  useEffect(() => {
    let countdownInterval;
    if (showTimerExpired && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // 카운트다운 완료 시 앱 종료
            try {
              // PWA 환경에서 앱 종료 시도
              if (window.navigator && window.navigator.app && window.navigator.app.exitApp) {
                window.navigator.app.exitApp();
              } else if (window.close) {
                window.close();
              } else {
                // 앱 종료가 불가능한 경우 홈페이지로 리다이렉트
                window.location.href = '/';
              }
            } catch (error) {
              console.log('앱 종료 중 오류:', error);
              // 오류 발생 시 홈페이지로 리다이렉트
              window.location.href = '/';
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [showTimerExpired, countdown]);

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          if (audioRef.current.pause) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = '';
          } else if (audioRef.current.nodes) {
            const context = audioRef.current.context;
            const nodes = audioRef.current.nodes;
            
            nodes.forEach((node) => {
              try {
                if (node.gainNode) {
                  node.gainNode.gain.setValueAtTime(0, context.currentTime);
                  node.gainNode.disconnect();
                }
                if (node.oscillator && node.oscillator.stop) {
                  node.oscillator.stop();
                  node.oscillator.disconnect();
                }
                if (node.filter) {
                  node.filter.disconnect();
                }
              } catch (e) {
                console.log('언마운트 시 노드 정리 중 오류:', e);
              }
            });
            
            if (context && context.state !== 'closed') {
              try {
                context.close();
              } catch (e) {
                console.log('언마운트 시 AudioContext 정리 중 오류:', e);
              }
            }
          }
        } catch (error) {
          console.error('언마운트 시 오디오 정리 중 오류:', error);
        } finally {
          audioRef.current = null;
        }
      }
    };
  }, []);

  const handleStartSleep = () => {
    if (!selectedSound) return;

    console.log('수면 모드 시작 - 새로운 오디오 재생');

    // 이전 오디오 완전 정지
    if (audioRef.current) {
      try {
        if (audioRef.current.pause) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
          audioRef.current.load();
        } else if (audioRef.current.nodes) {
          const context = audioRef.current.context;
          const nodes = audioRef.current.nodes;
          
          nodes.forEach((node) => {
            try {
              if (node.gainNode) {
                node.gainNode.gain.cancelScheduledValues(context.currentTime);
                node.gainNode.gain.setValueAtTime(0, context.currentTime);
                node.gainNode.disconnect();
              }
              if (node.oscillator && node.oscillator.stop) {
                node.oscillator.stop();
                node.oscillator.disconnect();
              }
              if (node.filter) {
                node.filter.disconnect();
              }
            } catch (e) {
              console.log('이전 노드 정리 중 오류:', e);
            }
          });
          
          if (context && context.state !== 'closed') {
            try {
              context.close();
            } catch (e) {
              console.log('이전 AudioContext 정리 중 오류:', e);
            }
          }
        }
      } catch (error) {
        console.error('이전 오디오 정지 중 오류:', error);
      } finally {
        audioRef.current = null;
      }
    }

    // 오디오 재생 먼저 시작
    try {
      const audio = new Audio();
      audio.src = `/sounds/${selectedSound.id}.mp3`;
      audio.loop = true;
      audio.volume = 0.3;

      audio.addEventListener('canplaythrough', () => {
        audio
          .play()
          .then(() => {
            console.log(`Playing ${t(`sounds.${selectedSound.id}.name`)} for ${selectedTimer} minutes`);
          })
          .catch((error) => {
            console.error('오디오 재생 실패:', error);
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

    // 상태 변경
    setIsPlaying(true);
    setTimeRemaining(selectedTimer * 60);
    setIsDimmed(true);


    // 브라우저에서 오디오 생성하는 함수
    function createBrowserAudio() {
      // 수면 모드가 중단되면 오디오 생성하지 않음
      if (!isPlaying) {
        console.log('수면 모드가 중단되어 오디오 생성을 중단합니다.');
        return;
      }
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let audioNodes = [];

        switch (selectedSound.id) {
          case 'rain':
            for (let i = 0; i < 3; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(100 + i * 50, audioContext.currentTime);

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
            audioNodes.push({ oscillator: osc1, gainNode: gain1, filter: filter1 });
            break;

          case 'forest':
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

          case 'guitar':
            for (let i = 0; i < 2; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'triangle';
              osc.frequency.setValueAtTime(220 + i * 110, audioContext.currentTime);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(800, audioContext.currentTime);

              gain.gain.setValueAtTime(0.04, audioContext.currentTime);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain, filter });
            }
            break;

          case 'jazz2':
            for (let i = 0; i < 3; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(150 + i * 80, audioContext.currentTime);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(600, audioContext.currentTime);

              gain.gain.setValueAtTime(0.03, audioContext.currentTime);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain, filter });
            }
            break;

          case 'crickets':
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

          case 'jazz':
            for (let i = 0; i < 2; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'sine';
              osc.frequency.setValueAtTime(150 + i * 100, audioContext.currentTime);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(600, audioContext.currentTime);

              gain.gain.setValueAtTime(0.03, audioContext.currentTime);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain, filter });
            }
            break;

          case 'classical':
            for (let i = 0; i < 3; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'sine';
              osc.frequency.setValueAtTime(200 + i * 80, audioContext.currentTime);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(800, audioContext.currentTime);

              gain.gain.setValueAtTime(0.04, audioContext.currentTime);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain, filter });
            }
            break;

          case 'lullaby':
            for (let i = 0; i < 2; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();

              osc.type = 'sine';
              osc.frequency.setValueAtTime(180 + i * 120, audioContext.currentTime);

              gain.gain.setValueAtTime(0.05, audioContext.currentTime);

              osc.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain });
            }
            break;

          case 'piano':
            for (let i = 0; i < 2; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'triangle';
              osc.frequency.setValueAtTime(220 + i * 110, audioContext.currentTime);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(1000, audioContext.currentTime);

              gain.gain.setValueAtTime(0.04, audioContext.currentTime);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain, filter });
            }
            break;

          case 'ambient':
            for (let i = 0; i < 3; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              const filter = audioContext.createBiquadFilter();

              osc.type = 'sine';
              osc.frequency.setValueAtTime(120 + i * 60, audioContext.currentTime);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(500, audioContext.currentTime);

              gain.gain.setValueAtTime(0.03, audioContext.currentTime);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain, filter });
            }
            break;

          case 'nature':
            for (let i = 0; i < 2; i++) {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();

              osc.type = 'sine';
              osc.frequency.setValueAtTime(160 + i * 90, audioContext.currentTime);

              gain.gain.setValueAtTime(0.06, audioContext.currentTime);

              osc.connect(gain);
              gain.connect(audioContext.destination);

              osc.start();
              audioNodes.push({ oscillator: osc, gainNode: gain });
            }
            break;

          default:
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

        if (isPlaying) {
          audioRef.current = { context: audioContext, nodes: audioNodes };
          console.log(`Playing ${t(`sounds.${selectedSound.id}.name`)} for ${selectedTimer} minutes`);
        }
      } catch (error) {
        console.error('브라우저 오디오 생성 실패:', error);
        if (isPlaying) {
          console.log(`Playing ${t(`sounds.${selectedSound.id}.name`)} for ${selectedTimer} minutes`);
        }
      }
         }
   };

  const handleStopSleep = () => {
    console.log('수면 모드 중단 - 모든 오디오 즉시 종료');
    
    // 상태 먼저 변경 (새로운 오디오 시작 방지)
    setIsPlaying(false);
    setTimeRemaining(null);
    setIsDimmed(false);

    // 모든 오디오 즉시 종료 (파일 찾지 않고 바로 정리)
    if (audioRef.current) {
      try {
        if (audioRef.current.pause) {
          // Audio 객체 즉시 정지
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
          audioRef.current.load();
        } else if (audioRef.current.nodes) {
          // Web Audio API 노드 즉시 정지
          const context = audioRef.current.context;
          const nodes = audioRef.current.nodes;
          
          nodes.forEach((node) => {
            try {
              // 볼륨 즉시 0으로 설정
              if (node.gainNode) {
                node.gainNode.gain.cancelScheduledValues(context.currentTime);
                node.gainNode.gain.setValueAtTime(0, context.currentTime);
                node.gainNode.disconnect();
              }
              // 오실레이터 즉시 정지
              if (node.oscillator && node.oscillator.stop) {
                node.oscillator.stop();
                node.oscillator.disconnect();
              }
              // 필터 노드 분리
              if (node.filter) {
                node.filter.disconnect();
              }
            } catch (e) {
              console.log('노드 즉시 정지 중 오류:', e);
            }
          });
          
          // AudioContext 즉시 종료
          if (context && context.state !== 'closed') {
            try {
              context.close();
            } catch (e) {
              console.log('AudioContext 즉시 종료 중 오류:', e);
            }
          }
        }
      } catch (error) {
        console.error('오디오 즉시 정지 중 오류:', error);
      } finally {
        audioRef.current = null;
      }
    }

    // 브라우저의 모든 오디오 강제 정지
    try {
      const allAudios = document.querySelectorAll('audio');
      allAudios.forEach((audio) => {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
          audio.load();
        } catch (e) {
          console.log('HTML Audio 요소 즉시 정지 중 오류:', e);
        }
      });
    } catch (e) {
      console.log('브라우저 전체 오디오 즉시 정지 중 오류:', e);
    }

    // 전역 오디오 컨텍스트도 모두 정리
    try {
      if (window.__audioContexts) {
        window.__audioContexts.forEach((ctx) => {
          if (ctx && ctx.state !== 'closed') {
            try {
              ctx.close();
            } catch (e) {
              console.log('전역 AudioContext 정리 중 오류:', e);
            }
          }
        });
        window.__audioContexts = [];
      }
    } catch (e) {
      console.log('전역 오디오 컨텍스트 정리 중 오류:', e);
    }

    console.log('수면 모드 중단 완료 - 모든 오디오 종료됨');
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
           {showTimerExpired ? (
             <>
               <div className={styles.sleepIcon}>🌙</div>
               <h1 className={styles.sleepTitle}>{t('timerExpired')}</h1>
               <p className={styles.sleepText}>{t('appWillClose')}</p>
               <p className={styles.goodNightText}>{t('goodNight')}</p>
               <div className={styles.countdownText}>{countdown}...</div>
             </>
           ) : (
            <>
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
            </>
          )}
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
