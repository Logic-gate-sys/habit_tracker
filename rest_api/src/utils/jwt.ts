import { SignJWT } from 'jose';
import { createSecretKey } from 'node:crypto';
import { env } from './../../env.ts'

export interface JWT_Payload{
    id: string,
    username: string,
    email: string
}

export function generateToken(payload: JWT_Payload){
    const secrete = env.JWT_SECRET;
    const secretKey = createSecretKey(secrete, 'utf8');
    return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
    .sign(secretKey)
}