# DevNest — System Architecture

## 🔧 Overview
DevNest follows a simple but scalable architecture:

Next.js (Frontend)
|
| REST API
v
Node.js + Express Backend
|
v
PostgreSQL Database (Prisma ORM)



## 🖥 Backend Services
- Express.js REST API
- Prisma for schema + ORM
- JWT for authentication
- Zod for request validation

---

## 🌐 Frontend
- Next.js (App Router)
- Client + server components
- React Query (fetching)

---

## 🗄 Database (PostgreSQL)
Main tables:
- `User`
- `Post`
- `Like`

Future tables:
- Comments
- Notifications
- Follows

---

## 🛡 Security
- Password hashing (bcrypt)
- JWT access + refresh tokens
- Route-level auth middleware
- Request validation (Zod)

---

## ⚡ Performance
- Feed uses cursor pagination
- Database uses indexes on:
  - createdAt
  - userId