# Notion Clone Coding

노션(Notion)을 참고하여 만든 블록 기반 문서 편집기입니다.
React, TypeScript, Zustand, Tailwind CSS를 사용하여 계층 구조의 문서 관리, 마크다운 기반 문서 편집, 페이지 전환 등의 기능을 구현했습니다.

## 🚀 주요 기능

### 📝 문서 관리

- **계층적 문서 구조**: 부모-자식 관계를 가진 문서 시스템
- **실시간 편집**: 문서 제목과 내용을 실시간으로 편집
- **아이콘 지원**: 문서별 커스텀 아이콘 설정
- **폴더 토글**: 사이드바에서 문서 폴더 열기/닫기

### 🧱 블록 기반 편집

- **다양한 블록 타입**:
  - 텍스트 블록 (paragraph)
  - 제목 블록 (h1, h2, h3)
  - 체크리스트 (checkbox)
  - 구분선 (divider)
  - 번호 매기기 목록 (numbered-list)
  - 글머리 기호 목록 (bulleted-list)
- **마크다운 지원**: `/` 입력으로 블록 타입 변경
- **자동 블록 생성**: Enter 키로 새 블록 추가
- **블록 삭제**: Backspace 키로 빈 블록 삭제

### 🔗 하위 페이지 시스템

- **`/page` 명령어**: 문서 내에서 `/page 제목` 입력으로 하위 페이지 생성
- **페이지 링크**: 하위 페이지를 클릭하여 해당 페이지로 이동
- **계층 구조**: 무제한 깊이의 중첩 페이지 지원

### 💾 데이터 지속성

- **로컬 스토리지**: 브라우저 localStorage에 모든 데이터 자동 저장
- **통합 상태 관리**: 문서와 블록 상태를 하나의 스토어에서 관리
- **자동 동기화**: 상태 변경 시 즉시 저장

## 🏗️ 프로젝트 구조

```
notion-clone-coding/
├── public/                          # 정적 파일
│   ├── fonts/                      # 폰트 파일 (Pretendard)
│   └── notion.svg                  # 노션 로고
├── src/
│   ├── components/                 # React 컴포넌트
│   │   ├── document/              # 문서 관련 컴포넌트
│   │   │   ├── block/             # 블록 관련 컴포넌트
│   │   │   │   ├── BlockActionButton.tsx    # 블록 액션 버튼
│   │   │   │   ├── BlockContent/            # 블록 타입별 렌더링
│   │   │   │   │   ├── BulletedListBlock.tsx
│   │   │   │   │   ├── CheckboxBlock.tsx
│   │   │   │   │   ├── DividerBlock.tsx
│   │   │   │   │   ├── NumberedListBlock.tsx
│   │   │   │   │   ├── PageBlock.tsx
│   │   │   │   │   └── TextBlock.tsx
│   │   │   │   ├── BlockEditor.tsx          # 블록 편집기 메인
│   │   │   │   └── BlockItem.tsx            # 개별 블록 아이템
│   │   │   └── DocumentHeader.tsx           # 문서 헤더
│   │   ├── sidebar/               # 사이드바 컴포넌트
│   │   │   ├── Search.tsx         # 검색 기능
│   │   │   ├── SidebarDocumentItem.tsx     # 사이드바 문서 아이템
│   │   │   ├── SidebarHeader.tsx           # 사이드바 헤더
│   │   │   └── SidebarMenu.tsx             # 사이드바 메뉴
│   │   └── ui/                    # 공통 UI 컴포넌트
│   │       ├── Card.tsx           # 카드 컴포넌트
│   │       ├── IconPicker.tsx     # 아이콘 선택기
│   │       ├── Menu.tsx           # 메뉴 컴포넌트
│   │       ├── Modal.tsx          # 모달 컴포넌트
│   │       └── Tooltip.tsx        # 툴팁 컴포넌트
│   ├── hooks/                     # 커스텀 훅
│   │   ├── useBlockActions.ts     # 블록 관련 액션 훅
│   │   ├── useDocumentActions.ts  # 문서 관련 액션 훅
│   │   └── index.ts               # 훅 export
│   ├── libs/                      # 유틸리티 라이브러리
│   │   ├── getCreationDate.ts     # 생성일 계산
│   │   ├── getRelativeTime.ts     # 상대적 시간 표시
│   │   ├── markdownDetector.ts    # 마크다운 감지 및 변환
│   │   └── index.ts               # 라이브러리 export
│   ├── pages/                     # 페이지 컴포넌트
│   │   └── DocumentPage.tsx       # 문서 편집 페이지
│   ├── stores/                    # 상태 관리 (Zustand)
│   │   └── documentStore.ts       # 통합 문서/블록 스토어
│   ├── styles/                    # 스타일 파일
│   │   └── index.css              # 전역 CSS
│   ├── types/                     # TypeScript 타입 정의
│   │   ├── block.ts               # 블록 관련 타입
│   │   └── document.ts            # 문서 관련 타입
│   ├── App.tsx                    # 메인 앱 컴포넌트
│   └── main.tsx                   # 앱 진입점
├── tailwind.config.js             # Tailwind CSS 설정
├── tsconfig.json                  # TypeScript 설정
├── vite.config.ts                 # Vite 빌드 도구 설정
└── package.json                   # 프로젝트 의존성
```

## 🛠️ 기술 스택

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Font**: Pretendard (한글 최적화 폰트)

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone [repository-url]
cd notion-clone-coding
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 브라우저에서 확인

```
http://localhost:5173
```

### 5. 빌드 (프로덕션)

```bash
npm run build
```

## 🎯 사용 방법

### 📄 새 페이지 생성

1. 사이드바 상단의 "새 페이지" 버튼 클릭
2. 또는 문서 내에서 `/page 제목` 입력

### ✏️ 블록 편집

1. **텍스트 입력**: 블록을 클릭하여 텍스트 입력
2. **블록 타입 변경**: `/` 입력 후 원하는 타입 선택
3. **새 블록 추가**: Enter 키 입력
4. **블록 삭제**: Backspace 키 (빈 블록에서)

### 🗂️ 문서 구조 관리

1. **하위 페이지 생성**: `/page 제목` 입력
2. **폴더 열기/닫기**: 사이드바에서 화살표 클릭
3. **페이지 이동**: 하위 페이지 블록 클릭
