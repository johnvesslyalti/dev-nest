import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router()

router.post("/posts/:postId/comments", commentController.create);
router.get("/posts/:postId/comments", commentController.findByPost)

export default router
