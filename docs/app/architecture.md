# 🏗️ Team-Docs Architecture Documentation

## System Overview

Team-Docs is built using a modern, scalable architecture that emphasizes performance, security, and developer experience. The system follows Next.js 15 App Router patterns with a service-oriented backend architecture.

## Technology Stack

### Frontend Technologies

- **Framework**: Next.js 15 with App Router
- **React Version**: React 18 with concurrent features
- **Styling**: Tailwind CSS v4
- **UI Library**: Shadcn UI components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### Backend Technologies

- **Runtime**: Node.js with Bun package manager
- **Database**: PostgreSQL with Docker
- **ORM**: Prisma with custom extensions
- **Authentication**: NextAuth.js with JWT
- **File Storage**: Local filesystem (cloud storage planned)

### Development Tools

- **Package Manager**: Bun
- **Code Quality**: ESLint + Prettier (may add biome)
- **Type Safety**: TypeScript patterns
- **Containerization**: Docker Compose
- **Deployment**: Vercel
