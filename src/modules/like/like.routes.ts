import { Router } from "express";
import { likeController } from "./like.controller";

const router = Router();

router.post("/", likeController.like);
router.delete("/", likeController.unlike);
router.get("/:postId", likeController.count)

export default router;