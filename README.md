# 🚀 DevNest

**DevNest** is a scalable backend platform inspired by **X (Twitter)**, built with **Node.js, TypeScript, NestJS, Prisma, PostgreSQL, and Redis**.

It follows a **modular architecture** and focuses on building **production-ready social platform features** with performance, scalability, and maintainability in mind.

---

## 🧠 Architecture Overview

DevNest follows the standard **NestJS modular architecture**:

```
Module → Controller → Service → Repository (Prisma) → Database
```

### Why this architecture?

* ✅ Clear separation of concerns
* ✅ Modular and scalable
* ✅ Easy to test and refactor
* ✅ Dependency injection for better maintainability

---

## 📁 Project Structure

```txt
src/
├── auth/             # Authentication module (JWT, Login, Register)
├── comments/         # Comments module
├── common/           # Shared utilities (Guards, Interceptors, Middleware, Pipes)
├── generated/        # Generated Prisma client code
├── likes/            # Likes module
├── posts/            # Posts module
├── prisma/           # Prisma service and module (DB Connection)
├── profile/          # User profile management
├── users/            # User management
├── app.module.ts     # Root module
└── main.ts           # Application entry point

frontend/             # React + Vite application
├── src/
│   ├── api/          # API integration
│   ├── assets/       # Static assets
│   ├── components/   # Reusable UI components
│   ├── context/      # Global state (AuthContext)
│   ├── pages/        # Route pages
│   └── main.tsx      # Frontend entry point

prisma/               # Database schema (`schema.prisma`) and migrations
uploads/              # Static file storage (Images)
```

---

## 🛠️ Tech Stack

* **Node.js** & **TypeScript**
* **NestJS** (Backend Framework)
* **Prisma ORM** (Database Access)
* **PostgreSQL** (Relational Database)
* **Redis** (Caching)
* **BullMQ** (Background Jobs)
* **Multer** (File Uploads)
* **Vite + React** (Frontend)
* **Tailwind CSS** (Styling)

---

## 🔐 Authentication

* **JWT-based authentication** (Access & Refresh Tokens)
* **Guards** for route protection
* Secure cookie handling for refresh tokens
* Current user injection via decorators (e.g., `@CurrentUser`)

---

## 🐦 Core Features

### ⚡ Caching with Redis
Redis is used as a **caching layer** to improve performance for frequently accessed data.

* **Read-through caching** for profiles, posts, and feeds.
* **Cache invalidation** on updates/deletes to ensure data consistency.

### 🧱 Database Models (Prisma)

* **Users**: Profile, auth, skills, bio.
* **Posts**: Content, images, author relation.
* **Likes & Comments**: Interactions on posts.
* **Follow system**: Many-to-many relationship for following users.
* **Blocking**: System to block users, preventing interactions.
* **Notifications**: Alerts for likes, comments, and follows.

---

## ⚙️ Setup & Installation

### 📋 Prerequisites

* **Node.js** (v18+ recommended)
* **PostgreSQL**
* **Redis**
* **Git**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/johnvesslyalti/dev-nest.git
cd dev-nest
```

### 2️⃣ Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/devnest
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   PORT=3000
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the Backend**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```
   Server defaults to `http://localhost:3000/api/v1` (Global Prefix).

### 3️⃣ Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Frontend**
   ```bash
   npm run dev
   ```
   App available at `http://localhost:5173`.

---

## 🧪 Development Principles

* ✅ **Modules**: Feature-based separation.
* ✅ **DTOs**: Strict input validation using `class-validator`.
* ✅ **Guards**: Role-based and auth-based access control.
* ✅ **Prisma**: Type-safe database queries.
* ✅ **Prettier/ESLint**: Consistent code style.

---

## 👨‍💻 Author

**Johnvessly Alti**
Backend-focused Software Engineer
Building scalable systems with clean architecture.

---

## 📄 License

MIT License
