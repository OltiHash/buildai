<div align="center">

# BuildAI — AI-Powered Website Builder

**Describe your website in plain English. Get production-ready code in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://aibuilder-phi.vercel.app)

**[Live Demo →](https://aibuilder-phi.vercel.app)**

</div>

---

## What is BuildAI?

BuildAI is a SaaS platform that turns natural language into fully functional, styled websites. Type a prompt — get a live preview with clean, exportable code. No design skills or coding required.

## Features

- **AI generation** — describe your site in plain English; OpenAI produces the full HTML/CSS/JS
- **Live preview** — instant side-by-side view of generated output powered by Monaco Editor
- **Iterative refinement** — request changes conversationally and the AI updates the code in place
- **Authentication** — secure sign-up / login via NextAuth v5 with Prisma adapter
- **Project dashboard** — save, name, and manage multiple generated sites
- **Export** — download clean, production-ready code as a ZIP
- **Image support** — Cloudinary integration for asset uploads and optimisation
- **Usage tracking** — Redis-backed rate limiting and analytics per user

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Full-stack React framework |
| React 19 | UI library |
| TypeScript 5 | Type safety |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations |
| Monaco Editor | In-browser code editor |
| Radix UI | Accessible headless components |
| Zustand | Client-side state management |
| React Hook Form + Zod | Form validation |
| Recharts | Usage analytics charts |

### Backend
| Technology | Purpose |
|---|---|
| Next.js API Routes (Node.js) | Server-side logic |
| OpenAI API | AI website generation |
| PostgreSQL | Primary relational database |
| Prisma ORM | Type-safe database client |
| Redis (ioredis) | Caching and rate limiting |
| NextAuth v5 | Authentication |
| Cloudinary | Image storage and CDN |
| bcryptjs / JWT | Credential security |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Redis instance
- OpenAI API key
- Cloudinary account

### Installation

```bash
git clone https://github.com/OltiHash/buildai.git
cd buildai
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/buildai

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-...

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Run

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/              # Next.js App Router pages and API routes
  components/       # Reusable UI components (shadcn/ui + custom)
  lib/              # Database client, auth config, utilities
  store/            # Zustand state stores
  types/            # Shared TypeScript interfaces

prisma/
  schema.prisma     # Database schema

netlify/            # Netlify serverless function handlers
```

---

<div align="center">

Built by [Olti Hashani](https://github.com/OltiHash) · Prishtina, Kosovo

</div>
