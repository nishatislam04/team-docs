# Deploying with Vercel (CLI + Dashboard)

This guide explains how our project deploys to Vercel using Bun, and the common operations you’ll perform from the command line.

## TL;DR (Quick Commands)

- Login once:

  ```bash
  bunx vercel login
  ```

- Link local folder to the Vercel project:

  ```bash
  bunx vercel link
  ```

- Pull env vars for local dev:

  ```bash
  bun run vercel:env:pull
  ```

- Deploy a Preview (PR/staging):

  ```bash
  bun run deploy:preview
  ```

- Deploy to Production:

  ```bash
  bun run deploy:prod
  ```

- Inspect last deployment:

  ```bash
  bunx vercel inspect
  ```

- View logs:

  ```bash
  bunx vercel logs <deployment-url> --since=1h
  ```

## One-time setup

1. Install Vercel CLI (global is fine):

```bash
bunx vercel --version
```

If not installed:

```bash
bun add -g vercel
# or: npm i -g vercel / pnpm add -g vercel
```

1. Login:

```bash
vercel login
```

2. Link the project (creates a local `.vercel/` folder):

```bash
vercel link
```

- Choose the correct scope (team) and existing project on Vercel.
- The `.vercel/` folder stores the project ID and org; don’t commit secrets.

## Environment variables

- Put secrets in the Vercel dashboard (Project → Settings → Environment Variables) per environment: Development, Preview, Production.
- Pull envs locally for dev:

```bash
bun run vercel:env:pull
```

- To view envs in CLI:

```bash
vercel env ls
```

- To add/update an env var (example):

```bash
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development
```

You’ll be prompted for the value.

## Deploying

- Preview deploy (use for PRs and testing):

```bash
bun run deploy:preview
```

Vercel creates a unique preview URL. Share it with your team and check logs.

- Production deploy:

```bash
bun run deploy:prod
```

This deploys current working tree to Production (main/master policy is up to your workflow). Ensure your repo is in a clean state and tests pass.

## Common operations

- Inspect the last deployment:

```bash
vercel inspect
```

- View deployment logs:

```bash
vercel logs <deployment-url> --since=1h
```

- Open dashboard:

```bash
vercel dashboard
```

- List deployments:

```bash
vercel ls
```

- Roll back to a previous deployment:

```bash
# Find the deployment from `vercel ls` and open it in dashboard to restore,
# or re-deploy an older git commit.
```

- Promote a preview to production (recommended path is to re-deploy from the main branch; promotion is limited with modern Next.js setups).

## Safe workflow checklist

- Commit changes to git.
- Ensure env vars are set in Vercel.
- Deploy preview, verify.
- Merge to main and deploy production.

That’s it.
