# 🚀 DevNest

![CI](https://github.com/johnvesslyalti/dev-nest/actions/workflows/ci.yml/badge.svg)

## CI

The CI pipeline runs on every push and pull request to the `main` branch. It installs dependencies, lints the code, builds the project, performs a migration safety check, and runs end‑to‑end tests.

To run the same checks locally, use the helper script:

```bash
./scripts/ci-check.sh
```

**DevNest** is a scalable backend platform inspired by **X (Twitter)**, built with **Node.js, TypeScript, NestJS, Prisma (Multi-DB), PostgreSQL, MongoDB, and Redis**.

It follows a **modular architecture** and focuses on building **production-ready social platform features** with performance, scalability, and maintainability in mind.

---

## 🧠 Architecture Overview

DevNest follows the standard **NestJS modular architecture** with a **Multi-Database Strategy**:

```
Module → Controller → Service → Repository (Prisma) → Database (Postgres / Mongo)
```

### Why this architecture?

- ✅ Clear separation of concerns
- ✅ **Hybrid Database Approach**: PostgreSQL for relational data (Users, Posts) and MongoDB for flexible data (Logs, interactions).
- ✅ Modular and scalable
- ✅ Dependency injection for better maintainability

---

## 📁 Project Structure

```txt
src/
├── auth/             # Authentication module
├── comments/         # Comments module
├── common/           # Shared utilities
├── email/            # Email module (Worker-compatible)
├── feed/             # Feed module
├── generated/        # Generated Prisma client code
├── likes/            # Likes module
├── posts/            # Posts module
├── prisma/           # Prisma service
├── profile/          # User profile management
├── users/            # User management
├── app.module.ts     # Root module
├── main.ts           # Application entry point
├── worker.module.ts  # Worker entry module
└── worker.ts         # Worker entry point

prisma/
├── postgres/         # PostgreSQL schema & migrations
│   └── schema.prisma
├── mongo/            # MongoDB schema
│   └── schema.prisma

frontend/             # React + Vite application
```

---

## 🛠️ Tech Stack

- **Node.js** & **TypeScript**
- **NestJS** (Backend Framework)
- **Prisma ORM** (Multi-DB Support)
- **PostgreSQL** (Relational Database)
- **MongoDB** (NoSQL Database)
- **Redis** (Caching)
- **BullMQ** (Background Jobs & Queues)
- **Vite + React** (Frontend)
- **Authentication** (JWT, Refresh Token Rotation, Privacy Hashing)
- **Testing** (Jest for E2E)

---

## 🛡️ Security & Privacy

DevNest implements advanced security and privacy features:

### 🔐 Authentication & Security

- **Robust Token Generation**: Refresh tokens include a **unique UUID (`tokenId`)** in the payload to prevent collisions during rapid authentication requests (e.g., simultaneous Login/Register), ensuring reliability under high concurrency.
- **Refresh Token Rotation**: Each time a token is refreshed, a new one is issued, and the old one is revoked. Reuse of an old token triggers a **chain revocation** for security.
- **Device Tracking**: We log `IP Address` and `User-Agent` for each login to detect suspicious activity.
- **IP Privacy**: All IP addresses are **hashed (SHA-256)** before storage to protect user privacy.

### 🗑️ Data Management

- **Soft Deletes**: User accounts are soft-deleted (`deletedAt` timestamp). This action **instantly revokes all active sessions** (Refresh Tokens) and prevents further logins, preserving data integrity while effectively disabling the account.
- **Cascade Revocation**: Deleting an account or detecting token reuse instantly invalidates all associated tokens.

---

## ⚙️ Setup & Installation

### 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL**
- **MongoDB**
- **Redis**
- **Git**

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

5. **Start the Background Worker (Optional but recommended)**
   The worker handles background jobs such as sending emails.

   ```bash
   # Development mode
   npm run start:worker:dev

   # Production mode
   npm run build # (if not already built)
   npm run start:worker
   ```

### 🧪 Verifying the Backend

DevNest includes comprehensive **End-to-End (E2E) testing** for all major features (Authentication, Posts, Comments, Likes, and Feed), along with manual verification scripts.

#### 1️⃣ Run E2E Tests (Jest)

Ensure your test databases are correctly configured in `.env`, then run:

```bash
# Run all E2E tests
npm run test:e2e

# Run with coverage report
npm run test:e2e:cov
```

#### 2️⃣ Manual API Verification

You can also run comprehensive manual verification scripts to ensure all API endpoints and security features are working correctly in your active environment.

1. **Ensure the backend is running** (`npm run dev`).
2. **Run the manual functional test**:

   ```bash
   npm run test:manual
   ```

   **Scope**: Register -> Login -> Create Post -> Like/Unlike -> Comment -> Get Feed.
   **Expected Output**: `✅ All tests passed successfully!`

3. **Verify Authentication & Privacy Features**:
   ```bash
   npm run test:auth
   ```
   **Scope**:
   - **Registration**: Checks DB for correct user creation and IP hashing.
   - **Token Rotation**: Verifies that refreshing a token issues a new one and revokes the old one.
   - **Soft Delete**: Confirms that deleting a user sets `deletedAt` and revokes **all** refresh tokens.
   - **Login Prevention**: Ensures a soft-deleted user cannot log in.
     **Expected Output**: `Verification Complete!`

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

- ✅ **Modules**: Feature-based separation.
- ✅ **DTOs**: Strict input validation using `class-validator`.
- ✅ **Guards**: Role-based and auth-based access control.
- ✅ **Prisma**: Type-safe database queries.
- ✅ **Prettier/ESLint**: Consistent code style.
- ✅ **Cursor Pagination**: Keyset pagination implemented for efficient list rendering (e.g., Feed).

---

## 👨‍💻 Author

**Johnvessly Alti**
Backend-focused Software Engineer
Building scalable systems with clean architecture.

---

## 📄 License

MIT License
