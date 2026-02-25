import { Request } from "express";

declare global{
    namespace Express{
        interface Request{
            user?: {
                id: string;
                username: string;
                email?: string;
            },
            query?: {
                page: string,
                limit: string,
                hard?: string,
                permanent?: string
            }
        }
    }
}