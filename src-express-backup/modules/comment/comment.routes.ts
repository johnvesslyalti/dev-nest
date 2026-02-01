import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { rateLimiter } from "../../middlewares/rateLimiter";

import { validate } from "../../middlewares/validate";
import { commentSchema } from "./comment.schema";

const router = Router();

router.post(
    "/posts/:postId/comments",
    auth.verifyAccessToken,
    rateLimiter({ keyPrefix: "comment_create", limit: 10, windowInSeconds: 900 }),
    validate(commentSchema),
    commentController.create
);

router.get(
    "/posts/:postId/comments",
    commentController.findByPost
);

export default router;
