import { Router, Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate";
import { authController } from "./auth.controller";
import { auth, AuthRequest } from "../../middlewares/auth";
import { rateLimiter } from "../../middlewares/rateLimiter";

const router = Router();

/**
 * REGISTER
 * Limit: 3 requests / hour / IP
 */
router.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) =>
    rateLimiter({
      key: `rate:register:${req.ip}`,
      limit: 3,
      windowInSeconds: 60 * 60, // 1 hour
    })(req, res, next),
  validate(registerSchema),
  authController.register
);

/**
 * LOGIN
 * Limit: 5 attempts / 10 min / IP + email
 */
router.post(
  "/login",
  (req: Request, res: Response, next: NextFunction) =>
    rateLimiter({
      key: `rate:login:${req.ip}:${req.body.email}`,
      limit: 5,
      windowInSeconds: 10 * 60, // 10 minutes
    })(req, res, next),
  validate(loginSchema),
  authController.login
);

/**
 * REFRESH TOKEN
 * Limit: 10 requests / 15 min / user
 */
router.post(
  "/refresh",
  auth.verifyRefreshToken,
  (req: AuthRequest, res: Response, next: NextFunction) =>
    rateLimiter({
      key: `rate:refresh:${req.user?.id || req.ip}`,
      limit: 10,
      windowInSeconds: 15 * 60, // 15 minutes
    })(req, res, next),
  authController.refresh
);

/**
 * LOGOUT
 * No rate limit (low risk)
 */
router.post(
  "/logout",
  auth.verifyAccessToken,
  authController.logout
);

/**
 * GET ME
 * No rate limit (fetch profile)
 */
router.get(
  "/me",
  auth.verifyAccessToken,
  authController.me
);

export default router;
