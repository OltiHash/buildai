# BuildAI — AI Website Builder

A production-quality AI-powered website builder SaaS. Describe your idea → AI generates a complete website → Edit → Save versions → Deploy or Export ZIP.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Framer Motion |
| State | Zustand, React Query |
| Editor | Monaco Editor (VS Code engine) |
| Backend | Next.js API Routes, Prisma 7, PostgreSQL |
| Auth | NextAuth.js v5 (Google OAuth + Credentials) |
| AI | OpenAI GPT-4o (streaming) |
| Cache | Redis (ioredis) |
| Storage | Cloudinary |

## Setup

```bash
cd aibuilder
npm install
cp .env.example .env     # fill in your credentials
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aibuilder"
NEXTAUTH_SECRET="min-32-char-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
REDIS_URL="redis://localhost:6379"
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Apply DB migrations |

## Features

- AI website generation with GPT-4o streaming
- Monaco Editor (VS Code) for code editing
- Live preview (desktop/tablet/mobile)
- Version history with restore
- Export ZIP with all source files
- One-click deploy
- Analytics dashboard with Recharts
- Google OAuth + email/password auth
- PostgreSQL with Prisma 7
- Full TypeScript

## Deployment

Deploy to Vercel: set all env vars, push to GitHub, import in Vercel dashboard.
