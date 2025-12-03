import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validate =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body);
                next()
            } catch (e: any) {
                return res.status(400).json({
                    message: "Validation Error",
                    errors: e.errors
                })
            }
        }