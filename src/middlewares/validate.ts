import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate =
    (schema: ZodSchema, source: "body" | "params" | "query" = "body") =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse(req[source]);
                next()
            } catch (e: any) {
                return res.status(400).json({
                    message: "Validation Error",
                    errors: e.errors
                })
            }
        }