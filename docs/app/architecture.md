# 🏗️ Team-Docs Architecture Documentation

## System Overview

Team-Docs is built using a modern, scalable architecture that emphasizes performance, security, and developer experience. The system follows Next.js 15 App Router patterns with a service-oriented backend architecture.

## Architecture Diagram

# For Form

1. data from form will go to action layer.
2. action layer perform authorization and validate the data & early return if anything goes wrong.
3. then action layer will call service layer and pass data.
4. service layer will call model layer and perform database mutation.
5. model layer interact with database
   **service layer conatins some common works. but it can also directly call model layer. but we should not call model layer directly**

# For Client Component

in same directory, we create an actions directory.
export an async function from there.
then on the parent server component. we go like this

```js
import { getWorkspaceFn } from "./_components/actions/getWorkspace";

const workspace = getWorkspaceFn();
<Suspense fallback={<Loading />}>
  <ChildComponent workspace={workspace} />;
</Suspense>;
```

we suspense the last children who will consume the promise. not the immediate children like above.
then in child component we go like this

```js
export default function ChildComponent({ workspace }) {
  const workspace = use(workspace);
}
```

_The only downfall is the props-drilling._

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

## Directory Structure

```
team-docs/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Auth route group
│   │   ├── (home)/           # Main app route group
│   │   ├── (admin)/          # Admin route group
│   │   └── api/              # API routes
│   ├── components/           # Shared components
│   │   ├── ui/               # Shadcn UI components
│   │   └── editor/           # TipTap editor components
│   ├── system/               # Backend architecture
│   │   ├── Services/         # Business logic services
│   │   ├── Models/           # Database models
│   │   ├── DTOs/             # Data transfer objects
│   │   └── Utils/            # Utility functions
│   ├── lib/                  # Shared libraries
│   ├── hooks/                # Custom React hooks
│   └── utils/                # Frontend utilities
├── prisma/                   # Database schema and migrations
├── docs/                     # Documentation
└── docker-compose.yml        # Development environment
```
