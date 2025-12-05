import { Router } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate";
import { authController } from "./auth.controller";

const router = Router()

router.post("/register", validate(registerSchema), authController.register)
router.post("/login", validate(loginSchema), authController.login)
router.delete("/", validate(loginSchema), authController.delete)

export default router;