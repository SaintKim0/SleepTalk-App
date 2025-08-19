const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // 개발 모드에서도 PWA 활성화
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // API 라우트와 충돌하므로 주석 처리
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = withPWA(nextConfig);
