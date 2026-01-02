import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
    "/posts/:postId/comments",
    auth.verifyAccessToken,
    commentController.create
);

router.get(
    "/posts/:postId/comments",
    commentController.findByPost
);

export default router;
