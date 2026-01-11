import  bcrypt from 'bcrypt'
import { env } from '../../env.ts'

export async function hashPassword(password: string) : Promise<string>{
    return bcrypt.hashPassword(password, env.BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashPassword)
}