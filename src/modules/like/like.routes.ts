import { Router } from "express";
import { likeController } from "./like.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth.verifyAccessToken, likeController.like);
router.delete("/", auth.verifyAccessToken, likeController.unlike);
router.get("/", likeController.count)

export default router;