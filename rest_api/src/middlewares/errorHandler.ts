import type { NextFunction, Request, Response } from "express";
import { env } from './../../env.ts'

export class APIError extends Error{
    name: string;
    message: string;
    status: number;

    constructor(name: string, message: string, status:number ) {
        super();
        this.name = name;
        this.status = status;
        this.message = message;
    }

}

export async function errorHandler(error: APIError, req: Request, res: Response, next: NextFunction) {
    let name = error.name || ' Unknown error';
    let message= error.message || 'Something went wrong';
    let status = error.status || 400;
    // custom error
    if (error.name === 'Unauthorized') {
        message = "Unathorised";
        status = 400;

    }
    // errors
    return res.status(error.status).json({
        error: message,
        ...(env.APP_STAGE === 'dev' && {
            stack: error.stack,
            details:error.message
        })
    });
}

// NotFound error handler middler
export async function notFoundError(err: Error, req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Not found ${req.originalUrl}`) as APIError;
    error.status = 404;
    next(error);
}