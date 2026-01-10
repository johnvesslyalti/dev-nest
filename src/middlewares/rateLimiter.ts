import { NextFunction, Request, Response } from "express";
import { redis } from "../utils/redis";

interface RateLimitConfig {
    key: string;
    limit: number;
    windowInSeconds: number;
}

export const rateLimiter = (config: RateLimitConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { key, limit, windowInSeconds } = config
        
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

            next()
        } catch (error) {
            next()
        }
    }
}