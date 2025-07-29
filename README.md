# 🧩 team-docs

> A collaborative documentation platform — powered by Next.js 15 (App Router) and rich modern stack.
>
> 📌 _Note: Project description and features will be added soon._

---

## 📦 Tech Stack

- **Framework**: Next.js 15 Canary(App Router)
- **Database**: Prisma PostgreSQL
- **ORM**: Prisma
- **Package Manager**: Bun
- **Styling**: Tailwind CSS v4
- **UI Library**: ShadCN UI
- **Editor**: Tiptap (RTE)
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React Icons

---

## 🛠️ Setup Instructions

Follow these steps to get the app running on your local machine.

---

### 1. 🥖 Install Bun

Install **Bun** globally. You can use **npm** or the **official script**:

#### For Windows / WSL:

```bash
npm install -g bun
```

or:

```bash
curl -fsSL https://bun.sh/install | bash
```

💡 After install, restart your terminal and run `bun --version` to verify installation.

<!-- ### 2. 🐳 Install Docker

Docker is required to run the database in a containerized environment.

🔹 For Windows:
Download and install [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/).

Start Docker Desktop and make sure it is running (check the taskbar icon).

> 💡 You must manually start Docker Desktop before running Docker commands.

🔹 For Linux:

```bash
# Install Docker
curl -fsSL https://get.docker.com | bash

# Add your user to the docker group to run without sudo (optional but recommended)
sudo usermod -aG docker $USER
newgrp docker
``` -->

### 2. 📄 Create .env File

```bash
cp .env.example .env
```

### 3. 📦 Install Dependencies (with Bun)

```bash
bun install
```

> ⚠️ If `bun install` takes too long..., you can temporarily cut out the `postinstall` script in `package.json` to speed things up:

```json
"scripts": {
  // "postinstall": "prisma generate"
}
```

<!-- ### 5. 🐳 Start PostgreSQL + App with Docker

```bash
docker compose up
``` -->

### 4. Start The App

> this will start `prisma studio` and `next.js local server`.

```bash
make dev
```

### 🌐 Visit the App

```bash
http://localhost:3000
```

---

# ✅ You're all set!

<!-- # view the database

### credentials

```
host: localhost
port: 5432
user: mazumder
password: 1234
``` -->

---

# 🖼️ Screenshots

### homepage

![Homepage Screenshot](assets/homepage.png)

### project page editor

![page editor](assets/project-editor.png)
