# Linting & Formatting in This Project

This document explains how ESLint and Prettier are set up in this repository, what they enforce, and how to use them in your workflow.

## What these tools do

- ESLint: Finds code-quality, accessibility, and consistency issues. It prevents bugs and keeps the codebase consistent with our team standards.
- Prettier: Formats code automatically. It removes style debates and keeps files consistently formatted.

They work together: ESLint reports logic/style issues, and Prettier formats code. We use `eslint-config-prettier` to disable ESLint rules that would conflict with Prettier. We also surface Prettier formatting as ESLint errors (`prettier/prettier`) so you can fix everything in one pass.

## Where the configuration lives

- ESLint: `eslint.config.js` (flat config)
- Prettier: `.prettierrc`

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

Important project-aligned rules:

- React function components must be arrow functions (`react/function-component-definition`)
- Accessibility rules for alt text, anchor validity, etc.
- Import hygiene (no duplicates, no useless segments, basic cycle checks)
- General consistency: `prefer-const`, `eqeqeq`, `object-shorthand`, limited `console`
- Complexity budget for functions

File ignores and environment globals are also defined (Node, Browser, `Bun`).

## Prettier configuration overview

- Opinionated formatting across JS/JSX with width 100, semicolons, and LF line endings
- Plugins:
  - prettier-plugin-organize-imports: Automatically orders imports
  - prettier-plugin-tailwindcss: Sorts Tailwind v4 classes for consistency

Note: We rely on Prettier to organize imports, so we avoid ESLint rules that also reorder imports to prevent conflicts.

## Typical workflow

- Format on save in your editor using Prettier
- Run ESLint to check both code quality and formatting:

```
bunx eslint .
```

- Auto-fix what can be fixed:

```
bunx eslint . --fix
```

- If ESLint shows `prettier/prettier` errors, run Prettier:

```
bunx prettier . --write
```

Most editors can do both automatically on save.

## Common tips

- Keep `eslint-config-prettier` as the last entry in `eslint.config.js`
- When adding new ESLint rules that influence formatting, verify they don’t overlap with Prettier
- For Next.js App Router, remember pages/layouts may need default exports; avoid blanket rules that forbid default exports in those directories

## Disabling rules when needed

- Per line:

```js
// eslint-disable-next-line rule-name
```

- Per file (very rarely):

```js
/* eslint-disable rule-name */
```

Add a comment explaining why, and prefer targeted disables.

## How this setup aligns with our team standards

- Arrow functions for components enforced
- Next.js + React + Hooks best practices included
- Accessibility built in
- Tailwind v4 class sorting for consistent UI code
- Import organization handled by Prettier

This setup should reduce friction, keep code readable, and prevent common pitfalls as the project grows.
