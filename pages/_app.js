import { LanguageProvider } from '../contexts/LanguageContext';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Head>
        <title>SleepTalk - 평화로운 수면을 위한 동반자</title>
        <meta name="description" content="AI 기반 수면 도우미 앱" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* PWA 메타 태그들 */}
        <meta name="application-name" content="SleepTalk" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SleepTalk" />
        <meta
          name="description"
          content="외로움과 감정적 스트레스를 줄여 수면을 돕는 정신 건강 앱"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1a1a2e" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#16213e" />

        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/icon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#16213e"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://sleeptalk.app" />
        <meta name="twitter:title" content="SleepTalk" />
        <meta
          name="twitter:description"
          content="외로움과 감정적 스트레스를 줄여 수면을 돕는 정신 건강 앱"
        />
        <meta
          name="twitter:image"
          content="https://sleeptalk.app/icons/icon-192x192.png"
        />
        <meta name="twitter:creator" content="@sleeptalk" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SleepTalk" />
        <meta
          property="og:description"
          content="외로움과 감정적 스트레스를 줄여 수면을 돕는 정신 건강 앱"
        />
        <meta property="og:site_name" content="SleepTalk" />
        <meta property="og:url" content="https://sleeptalk.app" />
        <meta
          property="og:image"
          content="https://sleeptalk.app/icons/icon-192x192.png"
        />
      </Head>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
