import { NextFunction, Request, Response } from "express";
import { redis } from "../utils/redis";
import { AuthRequest } from "./auth";

interface RateLimitConfig {
    key?: string;
    keyPrefix?: string;
    limit: number;
    windowInSeconds: number;
}

export const rateLimiter = (config: RateLimitConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { key: customKey, keyPrefix, limit, windowInSeconds } = config;
        
        let key = customKey;

        if (!key) {
            if (!keyPrefix) {
                console.error("RateLimiter: Missing key or keyPrefix");
                return next();
            }

            let identifier = (req as AuthRequest).user?.id;
            
            if (!identifier) {
                identifier = req.ip || "unknown_ip";
            }
            
            key = `rate_limit:${keyPrefix}:${identifier}`;
        }
        
        try {
            const current = await redis.incr(key);

            if (current === 1) {
                await redis.expire(key, windowInSeconds);
            }

            if (current > limit) {
                const ttl = await redis.ttl(key);

                return res.status(429).json({
                    message: "Too many requests. Please try again later.",
                    retryAfter: ttl,
                });
            }

            next();
        } catch (error) {
            console.error("Rate Limiter Error:", error);
            next();
        }
    };
};