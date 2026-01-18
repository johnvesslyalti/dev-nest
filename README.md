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

## 🛠 Tech Stack

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

Each module follows:

```txt
module/
├── module.routes.ts
├── module.controller.ts
├── module.service.ts
├── module.repository.ts
└── module.types.ts
```

---

## 🔐 Authentication

* JWT-based authentication
* Access & refresh token flow
* Secure route protection via middleware
* Authenticated user attached to `req.user`

---

## ⚡ Redis Caching Strategy

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

## 🐦 Core Features

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

## 🧱 Database Design (Prisma)

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

### 1️⃣ Clone the repository

```bash
git clone https://github.com/johnvesslyalti/dev-nest.git
cd dev-nest
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devnest
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

### 4️⃣ Run Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 5️⃣ Start Redis

```bash
redis-server
```

### 6️⃣ Start the Backend

```bash
npm run dev
```

### 7️⃣ Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.


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
