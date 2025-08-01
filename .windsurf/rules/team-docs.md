---
trigger: always_on
---

# General Code Style & Formatting

- Use arrow functions for component definitions and callbacks
- Use Bun for package management
- Deploy on Vercel
- Follow Laravel-like class system (e.g., `BaseService.js`, `UserService.js`)
- Follow ESLint and Prettier configurations

# Project Structure & Architecture

- Follow Next.js V15+ patterns and using App Router.
- Use server components by default, client components only when necessary

- Directory structure:
- extract client component complex render logic to a custom hook with naming ex `useUser()` near the directory
- extract the jsx logic into sub component by putting it near it's directory otherwise src/components/
- if client component need to fetch something, we export server action near it's directory and use react `useTransition` hook to fetch data & show loading state
- create required zustand store near it's directory
- always create server function (server action) instead of route handler to fetch data from client component.
- using authjs jwt with prisma-postgres database with prisma orm with credentials login only.
- use nextjs dynamic to load the client component lazily with loading spinner and add `ssr: no` option.
- each route should contains nextjs most common file conventions (like not-found.jsx, error.jsx, unauthorized.jsx, loading.jsx etc)

# Styling & UI

- Use Tailwind CSS V4 for styling.
- Use Shadcn UI for components.
- Use Lucid React Icon.
- use Framer Motion for animation.
- Follow mobile-first responsive design
- Use CSS variables for theming

# Data Fetching & Forms

- Use React Hook Form for form handling.
- Use Zod for validation.
- use useTransition for fetch & loading state.
- Implement proper error boundaries
- Use server actions for form submissions
- Implement optimistic updates for better UX

# State Management & Logic

- Use React Context for:
  - do not try to use react context, unless it is really necessary
  - Theme
  - Authentication state
  - App-wide UI state (modals, toasts)
  - Read-only global state
- Use Zustand for:
  - Complex client-side state
  - Global state that needs persistence
  - State shared across many components

# Backend & Database

- use specific service classes to access database info

# Performance

- Use `next/dynamic` for lazy loading components
- Implement proper loading states with `Suspense`
- Use React `cache()` for data caching
- Optimize images with `next/image`
- Use `React.memo` for expensive components
- Implement proper code splitting

# Error Handling

- Use error boundaries for client-side errors
- Implement proper error pages:
  - `error.jsx` - Client-side errors
  - `not-found.jsx` - 404 errors
  - `global-error.jsx` - Root error boundary
- use custom Logger class to print out errors.
- Provide user-friendly error messages with current context

# Documentation

- Document component props using JSDoc
- Add comments for complex logic
- Keep README.md updated

# Security

- Implement proper input validation
- Sanitize all user inputs
- Protect against XSS, CSRF, and other common vulnerabilities
- Use environment variables for sensitive data

# coding style

- this is my logging utility. Logger.debug(value, "message"). when auto suggest via tab completion, follow this design. first argument is value & second value is message.
