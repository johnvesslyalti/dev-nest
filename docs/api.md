# DevNest — API Documentation

Base URL: `/api/v1`

---

# 🧑‍💻 AUTH ROUTES
## POST /auth/signup
Body:
{
  "email": "",
  "username": "",
  "password": ""
}

## POST /auth/login
Body:
{
  "username": "",
  "password": ""
}

Response:
{
  "token": "jwt-token"
}

---

# 📝 POST ROUTES
## POST /posts
Auth: Required  
Create a post.
Body:
{
  "content": "string (max 500)"
}

## GET /posts
Fetch global feed.  
Query:
- `cursor` (optional)

## GET /posts/:id
Fetch a single post.

## PUT /posts/:id
Edit own post.

## DELETE /posts/:id
Delete own post.

---

# ❤️ LIKE ROUTES
## POST /posts/:id/like
Toggle like.

---

# 👤 USER ROUTES
## GET /users/:username
Get profile + posts.

