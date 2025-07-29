const fs = require('fs');
const path = require('path');

// 간단한 PNG 아이콘 생성 (실제로는 SVG를 PNG로 변환하는 라이브러리가 필요하지만, 여기서는 기본 아이콘을 생성)
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// 기본 아이콘 데이터 (실제로는 SVG를 PNG로 변환해야 함)
const createBasicIcon = (size) => {
  // 간단한 SVG를 문자열로 생성
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="100" fill="#1a1a2e"/>
    <circle cx="256" cy="256" r="180" fill="#16213e"/>
    <circle cx="256" cy="256" r="140" fill="#0f3460"/>
    <path d="M256 120 A136 136 0 0 1 256 392 A136 136 0 0 1 256 120 M256 140 A116 116 0 0 0 256 372 A116 116 0 0 0 256 140" fill="#e94560"/>
    <circle cx="180" cy="180" r="8" fill="#e94560"/>
    <circle cx="332" cy="160" r="6" fill="#e94560"/>
    <circle cx="160" cy="320" r="5" fill="#e94560"/>
    <circle cx="320" cy="320" r="7" fill="#e94560"/>
    <path d="M200 220 L280 220 L200 280 L280 280" stroke="#e94560" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  return svg;
};

// 아이콘 파일들 생성
iconSizes.forEach((size) => {
  const iconPath = path.join(
    __dirname,
    'public',
    'icons',
    `icon-${size}x${size}.png`
  );
  const svgPath = path.join(
    __dirname,
    'public',
    'icons',
    `icon-${size}x${size}.svg`
  );

  // SVG 파일 생성
  const svg = createBasicIcon(size);
  fs.writeFileSync(svgPath, svg);

  console.log(`Generated icon-${size}x${size}.svg`);
});

// Safari pinned tab SVG
const safariPinnedTab = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" rx="2" fill="#16213e"/>
  <circle cx="8" cy="8" r="5" fill="#e94560"/>
  <path d="M8 3 A5 5 0 0 1 8 13 A5 5 0 0 1 8 3 M8 4 A4 4 0 0 0 8 12 A4 4 0 0 0 8 4" fill="#16213e"/>
</svg>`;

fs.writeFileSync(
  path.join(__dirname, 'public', 'icons', 'safari-pinned-tab.svg'),
  safariPinnedTab
);

// Browser config XML
const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/icons/icon-152x152.png"/>
            <TileColor>#1a1a2e</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

fs.writeFileSync(
  path.join(__dirname, 'public', 'icons', 'browserconfig.xml'),
  browserConfig
);

console.log('All PWA icons and config files generated!');
console.log(
  'Note: For production, you should convert SVG to PNG using a proper image processing library.'
);
