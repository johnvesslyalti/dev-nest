# 🚀 DevNest

**DevNest** is a scalable backend platform inspired by **X (Twitter)**, built with **Node.js, TypeScript, Express, Prisma, and PostgreSQL**.
It follows a **clean, layered architecture** designed for real-world production systems.

The project focuses on **social platform features** such as authentication, posts, follows, blocks, likes, comments, and feeds — implemented with strong separation of concerns.

---

## 🧠 Architecture Overview

DevNest strictly follows this flow:

```
Routes → Controller → Service → Repository → Database
```

### Why this architecture?

* ✅ Clear separation of concerns
* ✅ Easy to test and maintain
* ✅ Scales well as features grow
* ✅ Business logic is isolated from HTTP & DB layers

---

## 🛠 Tech Stack

* **Node.js**
* **TypeScript**
* **Express.js**
* **Prisma ORM**
* **PostgreSQL**
* **JWT Authentication (Access & Refresh Tokens)**

---

## 📁 Project Structure

```txt
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── post/
│   ├── follow/
│   ├── block/
│   ├── like/
│   └── comment/
│
├── middlewares/
├── lib/
│   ├── prisma.ts
│   └── logger.ts
├── types/
├── app.ts
└── server.ts
```

Each module contains:

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
* Refresh token support
* Secure route protection via middleware
* Authenticated user is attached to `req.user`

---

## 🐦 Core Features

### 👤 Users

* Register & login
* Profile management
* Follow / unfollow users

### 📝 Posts

* Create posts
* View user posts
* Like & comment on posts

### ❤️ Likes

* Like / unlike posts
* Prevent duplicate likes

### 💬 Comments

* Comment on posts
* Delete own comments

### 🚫 Blocking (X-like behavior)

* Block users
* Unblock users
* View blocked users list
* Blocking removes follow relationships
* Blocked users cannot interact (follow, like, comment, view feed)

### 📰 Feed

* User feed based on follow relationships
* Excludes blocked users
* Ordered by latest posts

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

* Proper relations
* Unique constraints
* Indexes for performance
* Cascade deletes for data integrity

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
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

### 4️⃣ Run Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 5️⃣ Start the server

```bash
npm run dev
```

---

## 🧪 Development Principles

* ❌ No Prisma calls in controllers
* ❌ No HTTP logic in services
* ✅ Repositories handle all DB access
* ✅ Services enforce business rules
* ✅ Controllers handle request/response only

---

## 🚧 Future Enhancements

* Real-time notifications
* WebSocket-based feed updates
* Retweets / reposts
* Hashtags & trending topics
* Direct messaging
* Rate limiting & moderation tools
* API documentation (Swagger)

---

## 👨‍💻 Author

**Johnvessly Alti**
Backend-focused Software Engineer
Building scalable systems with clean architecture.

---

## ⭐ Contributing

Pull requests are welcome.
For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License
