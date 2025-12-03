import { postController } from "./post.controller";
import { Router } from "express"

const router = Router()

router.post("/", postController.create)
router.get("/", postController.findAll)
router.get("/:id", postController.findOne)

export default router;