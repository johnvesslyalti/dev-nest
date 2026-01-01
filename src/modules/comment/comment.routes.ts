import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router()

router.post("/:id", commentController.create);
router.get("/:id", commentController.findByPost)

export default router