import { auth } from "../../middlewares/auth";
import { upload } from "../../middleware/upload";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { postController } from "./post.controller";
import { Router } from "express"

import { validate } from "../../middlewares/validate";
import { createPostSchema } from "./post.schema";
import { likeController } from "../like/like.controller";
import { likeSchema } from "../like/like.schema";

const router = Router()

router.post("/", auth.verifyAccessToken, rateLimiter({ keyPrefix: "post_create", limit: 5, windowInSeconds: 900 }), upload.single('image'), validate(createPostSchema), postController.create)
router.get("/user/:username", postController.findByUserName)
router.get("/:id", postController.findOne)

router.post("/:postId/like", auth.verifyAccessToken, rateLimiter({ keyPrefix: "like", limit: 60, windowInSeconds: 60 }), validate(likeSchema, "params"), likeController.like);
router.delete("/:postId/like", auth.verifyAccessToken, validate(likeSchema, "params"), likeController.unlike);

export default router;