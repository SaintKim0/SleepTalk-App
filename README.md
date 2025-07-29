# SleepTalk - 수면 도우미 PWA 앱 🌙

외로움과 감정적 스트레스를 줄여 평화로운 수면을 돕는 정신 건강 앱입니다.

## ✨ 주요 기능

- **감정 선택 및 조언** - 현재 감정에 맞는 맞춤형 조언 제공
- **감사 일기** - 감사한 순간들을 기록하여 긍정적 마음가짐 유지
- **AI 채팅** - 외로움을 줄이고 대화를 통해 안정감 제공
- **수면 가이드** - 편안한 수면을 위한 가이드 제공
- **PWA 지원** - 스마트폰에 앱으로 설치 가능

## 🚀 배포 방법

### 1. Vercel 배포 (추천)

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 자동 배포 완료!

### 2. Netlify 배포

1. [Netlify](https://netlify.com)에 가입
2. GitHub 저장소 연결
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `out`

### 3. GitHub Pages 배포

1. 저장소 설정 → Pages
2. Source: GitHub Actions 선택
3. 자동 배포 설정

## 📱 PWA 설치 방법

### Android (Chrome/Edge)

1. 브라우저에서 앱 접속
2. 주소창 아래 "홈 화면에 추가" 클릭
3. 또는 메뉴 → "앱 설치" 선택

### iOS (Safari)

1. Safari에서 앱 접속
2. 공유 버튼 → "홈 화면에 추가" 선택

## 🛠️ 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
sleeptalk-web/
├── components/          # React 컴포넌트
├── contexts/           # React Context
├── data/              # 번역 데이터
├── pages/             # Next.js 페이지
├── public/            # 정적 파일
│   ├── icons/         # PWA 아이콘
│   └── manifest.json  # PWA 매니페스트
├── styles/            # CSS 스타일
└── next.config.js     # Next.js 설정
```

## 🌟 PWA 기능

- ✅ **오프라인 지원** - 인터넷 없이도 기본 기능 사용
- ✅ **앱 스타일 UI** - 네이티브 앱처럼 동작
- ✅ **자동 업데이트** - 새 버전 자동 다운로드
- ✅ **설치 프롬프트** - 사용자 친화적 설치 안내
- ✅ **푸시 알림** - 향후 확장 예정

## 🎨 기술 스택

- **Frontend**: Next.js, React
- **PWA**: next-pwa
- **스타일링**: CSS Modules
- **배포**: Vercel/Netlify

## 📄 라이선스

ISC License

## 👨‍💻 개발자

Saint Kim

---

**🌙 평화로운 수면을 위한 동반자, SleepTalk와 함께하세요!**
