import { Router } from "express";
import { likeController } from "./like.controller";
import { auth } from "../../middlewares/auth";

import { validate } from "../../middlewares/validate";
import { likeSchema } from "./like.schema";

const router = Router();

router.post("/:postId/like", auth.verifyAccessToken, validate(likeSchema, "params"), likeController.like);
router.delete("/:postId/unlike", auth.verifyAccessToken, validate(likeSchema, "params"), likeController.unlike);
router.get("/:postId/likes", validate(likeSchema, "params"), likeController.count)

export default router;