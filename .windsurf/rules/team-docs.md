---
trigger: always_on
---

# MUST DO

- after implementing a new feature, never spin up nextjs app to test it. spinnig up cause more error

# General Code Style & Formatting

- Use Bun for package management
- Deploy on Vercel
- Follow Laravel-like class system (e.g., `BaseService.js`, `UserService.js`)
- Follow ESLint and Prettier configurations

# Project Structure & Architecture

- Follow Next.js version 15 best practises, patterns and using App Router.
- Use server components by default, client components only when necessary.
- always define component in same line with export default.
- dont just append "use client" directive. intelligently decide for when to add this directive as child of client component does not this directive

- Directory structure:
- extract client component complex render logic to a custom hook with naming ex- `useUser()` near the directory
- extract the jsx logic into sub component by putting it near it's directory otherwise src/components/
- if client component need to fetch something, we create a server actions in same directory and pass down the promise from server component to client component. and wrap client component with react suspense. and use react use hook to resolve this promise.
- create required zustand store near it's directory. make sure, interacting with zustand store wont cause un-necessary rerender. use funtion like `getState()`
- never create route handler unless i told to.
- using authjs jwt with prisma-postgres database with prisma orm with credentials login only.
- use next/dynamic to load less priority client component with loading spinner and add `ssr: false`
- each route should contains nextjs most common files convention (like not-found.jsx, error.jsx, unauthorized.jsx, loading.jsx etc)

# Styling & UI

- Use Tailwind CSS V4 for styling.
- Use Shadcn UI for components.
- Use Lucid React Icon.
- use Framer Motion for animation. use it less much as possible
- Follow mobile-first responsive design
- Use CSS variables for theming

# Data Fetching & Forms

- Use React Hook Form for form handling.
- Use Zod for validation.
- Implement proper error handling for both ui & development
- Use server actions for form submissions

# Backend & Database

- use specific service classes to access database info

# Performance

- Use React `cache()` for request memoization
- Implement proper code splitting to make it more clear & concise

# Error Handling

- Use error boundaries for client-side errors
- Implement proper nextjs error pages
- use my custom Logger class to print out errors.

# Documentation

- Document component props using JSDoc
- Add comments for complex logic

# coding style

- my custom logger params are value, message. not the other way around
