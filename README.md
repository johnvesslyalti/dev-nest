# 🚀 DevNest

**DevNest** is a scalable backend platform inspired by **X (Twitter)**, built with **Node.js, TypeScript, NestJS, Prisma (Multi-DB), PostgreSQL, MongoDB, and Redis**.

It follows a **modular architecture** and focuses on building **production-ready social platform features** with performance, scalability, and maintainability in mind.

---

## 🧠 Architecture Overview

DevNest follows the standard **NestJS modular architecture** with a **Multi-Database Strategy**:

```
Module → Controller → Service → Repository (Prisma) → Database (Postgres / Mongo)
```

### Why this architecture?

* ✅ Clear separation of concerns
* ✅ **Hybrid Database Approach**: PostgreSQL for relational data (Users, Posts) and MongoDB for flexible data (Logs, interactions).
* ✅ Modular and scalable
* ✅ Dependency injection for better maintainability

---

## 📁 Project Structure

```txt
src/
├── auth/             # Authentication module
├── comments/         # Comments module
├── common/           # Shared utilities
├── generated/        # Generated Prisma client code
├── likes/            # Likes module
├── posts/            # Posts module
├── prisma/           # Prisma service
├── profile/          # User profile management
├── users/            # User management
├── app.module.ts     # Root module
└── main.ts           # Application entry point

prisma/
├── postgres/         # PostgreSQL schema & migrations
│   └── schema.prisma
├── mongo/            # MongoDB schema
│   └── schema.prisma

frontend/             # React + Vite application
```

---

## 🛠️ Tech Stack

* **Node.js** & **TypeScript**
* **NestJS** (Backend Framework)
* **Prisma ORM** (Multi-DB Support)
* **PostgreSQL** (Relational Database)
* **MongoDB** (NoSQL Database)
* **Redis** (Caching)
* **BullMQ** (Background Jobs)
* **Vite + React** (Frontend)

---

## ⚙️ Setup & Installation

### 📋 Prerequisites

* **Node.js** (v18+ recommended)
* **PostgreSQL**
* **MongoDB**
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
   # PostgreSQL
   DATABASE_URL=postgresql://user:password@localhost:5432/devnest?schema=public

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/devnest

   # Redis
   REDIS_URL=redis://localhost:6379

   # Auth
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   PORT=3000
   ```

3. **Database Setup (Multi-DB)**
   Generate Prisma clients for both Postgres and Mongo:
   ```bash
   npm run generate
   ```

   Run migrations for PostgreSQL:
   ```bash
   npm run migrate:pg
   ```

   Push schema for MongoDB:
   ```bash
   npm run migrate:mongo
   ```

4. **Start the Backend**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run build
   npm run start:prod
   ```
   Server defaults to `http://localhost:3000/api/v1`.

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
