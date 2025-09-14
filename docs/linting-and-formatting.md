# Linting & Formatting in This Project

This document explains how ESLint and Prettier are set up in this repository, what they enforce, and how to use them in your workflow.

## What these tools do

- ESLint: Finds code-quality, accessibility, and consistency issues. It prevents bugs and keeps the codebase consistent with our team standards.
- Prettier: Formats code automatically. It removes style debates and keeps files consistently formatted.

They work together: ESLint reports logic/style issues, and Prettier formats code. We use `eslint-config-prettier` to disable ESLint rules that would conflict with Prettier. We also surface Prettier formatting as ESLint errors (`prettier/prettier`) so you can fix everything in one pass.

## ESLint configuration overview

Key presets and plugins used:

- @eslint/js: Base JavaScript recommended rules
- eslint-plugin-react and eslint-plugin-react-hooks
- @next/eslint-plugin-next: Next.js recommended + Core Web Vitals
- eslint-plugin-jsx-a11y: Accessibility checks
- eslint-plugin-unicorn: Modern JavaScript best practices
- eslint-plugin-promise: Promise/async hygiene
- eslint-plugin-import-x: Static import validations (no sorting)
- eslint-plugin-prettier: Surfaces Prettier issues as ESLint errors
- eslint-config-prettier: Disables ESLint rules that conflict with Prettier (kept LAST)

## Prettier configuration overview

- Plugins:
  - prettier-plugin-organize-imports: Automatically orders imports
  - prettier-plugin-tailwindcss: Sorts Tailwind v4 classes for consistency

Note: We rely on Prettier to organize imports, so we avoid ESLint rules that also reorder imports to prevent conflicts.

## Typical workflow

- Format on save in your editor using Prettier
- Run ESLint to check both code quality and formatting:

```bash
bunx eslint .
```

- Auto-fix what can be fixed:

```bash
bunx eslint . --fix
```

- If ESLint shows `prettier/prettier` errors, run Prettier:

```bash
bunx prettier . --write
```
