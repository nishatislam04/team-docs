# Deploying with Vercel (CLI + Dashboard)

This guide explains how our project deploys to Vercel using Bun, and the common operations you’ll perform from the command line.

## TL;DR (Quick Commands)

- Login once: (one time)

  ```bash
  bunx vercel login
  ```

- Link local folder to the Vercel project: (one time)

  ```bash
  bunx vercel link
  ```

- Pull env vars for local dev:

  ```bash
  bun run vercel:env:pull
  ```

- Deploy a Preview:

  ```bash
  bun run deploy:preview
  ```

- Deploy to Production:

  ```bash
  bun run deploy:prod
  ```

## Deploying

- Preview deploy (use for PRs and testing):

```bash
bun run deploy:preview
```

- Production deploy:

```bash
bun run deploy:prod
```
