import { Router } from "express";
import { profileController } from "./profile.controller";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { updateProfileSchema } from "./profile.schema";
const router = Router();
router.get("/:username", profileController.findUserByName);
router.patch("/:username", auth.verifyAccessToken, validate(updateProfileSchema), profileController.updateUserBio);
export default router;
