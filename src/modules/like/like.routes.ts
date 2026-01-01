import { Router } from "express";
import { likeController } from "./like.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/:id", auth.verifyAccessToken, likeController.like);
router.delete("/:id", auth.verifyAccessToken, likeController.unlike);
router.get("/:id", likeController.count)

export default router;