# BANO - B2B 욕실 자재 카탈로그

B2B 납품 중심 위생도기 및 욕실 악세서리 제품 카탈로그 사이트입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL + Storage + Auth)
- **Deployment**: Vercel

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local.example`을 `.env.local`로 복사하고 Supabase 프로젝트 정보를 입력합니다.

```bash
cp .env.local.example .env.local
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `supabase/migrations/001_initial_schema.sql`의 SQL을 Supabase SQL Editor에서 실행
3. Storage 버킷 생성: `products`, `documents`, `projects`, `company` (모두 public)
4. `.env.local`에 URL, Anon Key, Service Role Key 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 |
| `/about` | 회사소개 (인사말, 연혁, 인증서, 오시는 길) |
| `/products` | 제품소개 (카테고리 사이드바 + 4열 그리드) |
| `/products/[category]/[id]` | 제품 상세 |
| `/projects` | 프로젝트 목록 |
| `/resources` | 자료실 (카탈로그, 도면, 기타) |
| `/support` | 공지사항 |
| `/support/inquiry` | 문의하기 |
| `/admin` | 관리자 대시보드 |
| `/admin/login` | 관리자 로그인 |

## 관리자 계정 생성

Supabase Dashboard > Authentication > Users 에서 관리자 계정을 생성하세요.

## 배포

Vercel에 연결하여 자동 배포합니다. 환경변수를 Vercel 프로젝트 설정에 등록하세요.
