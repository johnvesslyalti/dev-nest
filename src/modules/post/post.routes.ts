import { auth } from "../../middlewares/auth";
import { postController } from "./post.controller";
import { Router } from "express"

import { validate } from "../../middlewares/validate";
import { createPostSchema } from "./post.schema";
import { likeController } from "../like/like.controller";
import { likeSchema } from "../like/like.schema";

const router = Router()

router.post("/", auth.verifyAccessToken, validate(createPostSchema), postController.create)
router.get("/user/:username", postController.findByUserName)
router.get("/:id", postController.findOne)

router.post("/:postId/like", auth.verifyAccessToken, validate(likeSchema, "params"), likeController.like);
router.delete("/:postId/like", auth.verifyAccessToken, validate(likeSchema, "params"), likeController.unlike);

export default router;