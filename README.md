# 🚀 DevNest

**DevNest** is a scalable backend platform inspired by **X (Twitter)**, built with **Node.js, TypeScript, Express, Prisma, PostgreSQL, and Redis**.

It follows a **clean, layered architecture** and focuses on building **production-ready social platform features** with performance, scalability, and maintainability in mind.

---

## 🧠 Architecture Overview

DevNest strictly follows this flow:

```
Routes → Controller → Service → Repository → Database
```

### Why this architecture?

* ✅ Clear separation of concerns
* ✅ Easy to test and refactor
* ✅ Business logic isolated from HTTP & DB layers
* ✅ Scales cleanly as features grow

---

## 📁 Project Structure

* **Node.js**
* **TypeScript**
* **Express.js**
* **Prisma ORM**
* **PostgreSQL**
* **Redis** (Caching & Queues)
* **BullMQ** (Background Jobs)
* **Multer** (File Uploads)
* **Vite + React** (Frontend)
* **Tailwind CSS** (Styling)
* **JWT Authentication (Access & Refresh Tokens)**

---

## 📁 Project Structure

```txt
src/
├── modules/          # Feature-based texture (Controller, Service, Routes)
├── middlewares/      # Auth, Rate Limiting, Validation, Error Handling
├── jobs/             # Background workers (Email, Notifications)
├── lib/              # Core utilities (Prisma, Redis, Logger)
├── types/            # Global type definitions
├── app.ts            # Express setup
└── server.ts         # Server entry point

frontend/             # React + Vite application
├── src/
│   ├── api/          # Axios client & API modules
│   ├── components/   # Reusable UI components
│   ├── context/      # React Context (Auth)
│   ├── pages/        # Route pages
│   └── main.tsx      # Frontend entry point

uploads/              # Static file storage (Images)

```

---

## 🔐 Authentication

* JWT-based authentication
* Access & refresh token flow
* Secure route protection via middleware
* Authenticated user attached to `req.user`

---

## 🐦 Core Features

Redis is used as a **shared caching layer across modules** to improve performance and reduce database load.

### Where Redis is used

* User profile reads
* Feed responses
* Posts & interactions
* Follow / block checks
* Frequently accessed relational data

### Cache Pattern Used

* **Read-through caching**
* Cache invalidation on write/update/delete
* Fallback to database on cache miss

### Example Flow

```
Request → Redis → Database (if cache miss) → Redis update → Response
```

### Benefits

* 🚀 Faster response times
* 📉 Reduced database queries
* 📈 Better scalability under load

---

## 🧱 Database Design (Prisma)

### 👤 Users

* Register & login
* Profile management
* Follow / unfollow users
* Cached profile reads

### 📝 Posts

* Create posts
* Fetch posts efficiently
* Cached post lists

### ❤️ Likes

* Like / unlike posts
* Prevent duplicate likes
* Cache-aware invalidation

### 💬 Comments

* Comment on posts
* Delete own comments

### 🚫 Blocking (X-like Behavior)

* Block users
* Unblock users
* View blocked users list
* Blocking removes follow relationships
* Blocked users cannot:

  * follow
  * like
  * comment
  * view feed content

### 📰 Feed

* Feed based on follow relationships
* Block-aware feed filtering
* Redis-cached feed responses

### 📨 Background Jobs & Notifications

* **BullMQ + Redis** based job queue
* Asynchronous email sending (Welcome emails)
* Notification generation (Likes, Follows)

### 🛡️ Security & Performance

* **Rate Limiting**: Redis-based sliding window limiter protected endpoints.
* **JWT Auth**: Secure access/refresh token rotation.
* **Helmet & CORS**: Enhanced security headers.

### 🖼️ Media Management

* Image uploads via **Multer**
* Static file serving for user avatars and post images


---

Key models:

* `User`
* `Post`
* `Follow`
* `BlockedUser`
* `Like`
* `Comment`

Designed with:

* Unique constraints
* Indexes for performance
* Cascade deletes
* Proper relational modeling

---

## ⚙️ Setup & Installation

Follow these steps to set up the project locally for development and testing.

### 📋 Prerequisites

Ensure you have the following installed on your machine:

* **Node.js** (v18+ recommended)
* **PostgreSQL** (Running locally or via Docker)
* **Redis** (Required for caching and queues)
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
   Create a `.env` file in the root directory and add your credentials:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/devnest
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_super_secret_jwt_key
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
   PORT=5000
   ```

3. **Database Setup**
   Generate the Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start Redis**
   Make sure your Redis server is running:
   ```bash
   redis-server
   ```

5. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:5000` (or your defined PORT).

### 3️⃣ Frontend Setup

1. **Navigate to Frontend Directory**
   Open a new terminal window:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.


---

## 🧪 Development Principles

* ❌ No Prisma calls in controllers
* ❌ No HTTP logic in services
* ❌ No business logic in repositories
* ✅ Repositories handle DB access
* ✅ Services enforce business rules
* ✅ Redis caching handled consistently per module

---

## 🚧 Future Enhancements

* WebSocket-based real-time updates (Socket.io)
* Retweets / reposts
* Hashtags & trending topics
* Direct messaging
* API documentation (Swagger / OpenAPI)


---

## 👨‍💻 Author

**Johnvessly Alti**
Backend-focused Software Engineer
Building scalable systems with clean architecture.

---

## ⭐ Contributing

Pull requests are welcome.
Please open an issue before making major changes.

---

## 📄 License

MIT License
