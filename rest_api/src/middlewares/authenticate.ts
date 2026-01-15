import { verifyToken , type JWT_Payload} from "../utils/jwt.ts";
import type { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request{
    user: {
        id: string,
        username: string,
        email?:string
    } 
}
export const  authenticateToken = async(req: AuthRequest, res: Response, next: NextFunction) =>{
    try {
        const headers = req.headers['authorization'];
        const token =headers &&  headers?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Bad Request' });
        }
        const { payload } = await verifyToken(token);
        req.user={id: payload?.id, username: payload?.username, email:payload?.email}
        // next 
        next();
    } catch (err) {
        return res.status(409).json({ message: 'Forbidden' });
    }
}