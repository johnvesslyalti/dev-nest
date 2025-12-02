# DevNest — Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  password  String
  bio       String?  @default("")
  posts     Post[]
  likes     Like[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(uuid())
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  likes     Like[]
  createdAt DateTime @default(now())
}

model Like {
  id        String   @id @default(uuid())
  postId    String
  userId    String
  post      Post     @relation(fields: [postId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

