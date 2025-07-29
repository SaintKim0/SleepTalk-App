import { useState, useEffect } from 'react';
import styles from '../styles/PWAInstallPrompt.module.css';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('사용자가 앱 설치를 수락했습니다');
    } else {
      console.log('사용자가 앱 설치를 거부했습니다');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className={styles.installPrompt}>
      <div className={styles.installContent}>
        <div className={styles.installIcon}>📱</div>
        <div className={styles.installText}>
          <h3>SleepTalk 앱 설치</h3>
          <p>홈 화면에 추가하여 더 빠르게 접근하세요!</p>
        </div>
        <div className={styles.installButtons}>
          <button onClick={handleInstallClick} className={styles.installButton}>
            설치하기
          </button>
          <button onClick={handleDismiss} className={styles.dismissButton}>
            나중에
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
