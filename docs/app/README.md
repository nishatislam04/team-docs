# 🧩 Team-Docs - Comprehensive Documentation

> A collaborative documentation platform built with Next.js 15, PostgreSQL, and modern web technologies.

## 🎯 Project Overview

Team-Docs is a modern collaborative documentation platform designed for teams to create, organize, and share knowledge efficiently. Built with Next.js 15 App Router, it provides a Notion-like editing experience with advanced search capabilities, role-based access control, and workspace management.

### Key Objectives

- **Collaborative Writing**: Rich Text Editing with TipTap
- **Intelligent Organization**: Worksapace -> Projects -> Sections -> Pages hierarchy
- **Advanced Search**: Full-text search across all content types
- **Access Control**: Granular permissions and role management

---

## 🏗️ Architecture & Tech Stack

### Frontend Stack

- **Framework**: Next.js 15 Canary(App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand + React Context
- **Forms**: React Hook Form + Zod validation

### Backend Stack

- **Database**: Prisma PostgreSQL
- **ORM**: Prisma with custom extensions
- **Authentication**: Auth.js with JWT
- **Package Manager**: Bun
- **Deployment**: Vercel

### Development Tools

- **Environment**: Docker Compose (Not sure)
- **Code Quality**: Biome

---

## 🚀 Features Documentation

### Core Features

#### 1. **Workspace Management**

- Multi-tenant architecture with workspace isolation
- Workspace approval system for admin control
- Owner-based access control and member management
- Workspace settings and customization options

#### 2. **Project Organization**

- Hierarchical structure: Workspace → Projects → Sections → Pages
- Project-level permissions and member assignments
- Rich metadata support (icons, colors, descriptions)
- Archive and status management

#### 3. **Rich Text Editing**

- TipTap-based Notion-like editor
- Slash commands for quick formatting
- Collapsible blocks and advanced formatting
- Content saving and versioning

#### 4. **Advanced Search System**

- Full-text search across projects, sections, and pages
- PostgreSQL-powered search with intelligent ranking
- Real-time search with debouncing
- Keyboard shortcuts and accessibility features

#### 5. **Role-Based Access Control (RBAC)**

- Granular permission system
- Project-level and workspace-level roles
- Custom role creation and management
- Permission inheritance and overrides

#### 6. **User Management**

- User registration and authentication
- Profile management and settings
- Activity tracking and audit logs
- Super admin capabilities
