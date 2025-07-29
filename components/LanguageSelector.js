import { useState } from 'react';
import styles from '../styles/LanguageSelector.module.css';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.selector}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className={styles.flag}>{currentLang.flag}</span>
        <span className={styles.name}>{currentLang.name}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.up : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.option} ${
                currentLanguage === language.code ? styles.selected : ''
              }`}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.name}>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
