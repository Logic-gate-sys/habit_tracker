import { hashPassword, verifyPassword } from "../utils/passwords.ts";
import { generateToken } from "../utils/jwt.ts";
import type { Request, Response } from "express";
import { prisma } from "../config/prisma.ts";


export async function signup(req: Request, res: Response) {
    try {
        const { userName, email, password, firstName,middleName, lastName } =  req.body;
        // deos any user exits with these details
        const existingUser = await prisma.user.findFirst({
            where: { email: email }
        })
        if (existingUser) {
           return  res.status(409).json({ message: 'User already exists, login !'})
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        // insert into db 
        const newUser = await prisma.user.create({
            data: {
                user_name: userName,
                email: email,
                password: hashedPassword,
                f_name: firstName,
                m_name: middleName,
                l_name:lastName
            }
        });
        const payload = { id: newUser?.id, username: newUser?.user_name, email: newUser?.email };
       const token = await generateToken(payload);

        return res.status(201).json({
            success: true,
            message: 'User Signup Successful',
            user: {
                id: newUser?.id,
                user_name: newUser?.user_name,
                email: newUser?.email,
                created_at: newUser?.created_at
            },
            token
        })
    } catch (error) {
        console.error('error', error);
        return res.status(500).json({error:"Failed to create user"})
    }
}


export async function login(req: Request, res: Response) {
    try {
        const { email, password } =  req.body;
        // verify user
        const user = await prisma.user.findFirst({
            where: { email: email }
        });
        if (!user) {
            return res.status(400).json({error:'Invalid User', message: 'Please consider signing up'})
        }
        // verify password 
        const isValidUser = await verifyPassword(password, user?.password);
        if (!isValidUser) {
          return res.status(400).json({error:'Invalid credentials', message: 'Failed to login'})
        }
        
        // generate token and send to user
        const token = await generateToken({ id: user?.id, username: user?.user_name, email: user?.email });
        return res.status(200).json({
            success: true,
            message: 'Login Successful',
            user: {
                id: user?.id,
                username: user?.user_name,
                email: user?.email,
                logedinAt: user?.created_at
            },
            token: token
        });
    } catch (err) {
        console.error('error ', err);
        return res.status(500).json({ error: 'Failed to login' });
    }
}