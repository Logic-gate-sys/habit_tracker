import { hashPassword, verifyPassword } from "../utils/passwords";
import { generateToken } from "../utils/jwt";
import type { Request, Response } from "express";
import { prisma } from "../config/prisma";


export async function signup(req: Request, res: Response) {
    try {
        const { username, email, password, firstname, lastname } = await req.body();
        // hash password
        const hashedPassword = await hashPassword(password);
        // insert into db 
        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                firstName: firstname ?? '',
                lastName: lastname??''
            }
        });

        return res.status(201).json({
            success: true,
            message: 'User Signup Successful',
            user: {
                id: newUser?.id,
                username: newUser?.username,
                email: newUser?.email,
                createdAt: newUser?.createdAt
            }
        })
    } catch (error) {
        console.error('error', error);
        return res.status(500).json({error:"Failed to create user"})
    }
}


export async function login(req: Request, res: Response) {
    try {
        const { email, password } = await req.body();
        // verify user
        const user = await prisma.user.findFirst({
            where: { email: email }
        });
        if (!user) {
            return res.status(400).json({error:'Invalid credentials', message: 'Failed to login'})
        }
        // verify password 
        const isValidUser = await verifyPassword(password, user?.password);
        if (!isValidUser) {
          return res.status(400).json({error:'Invalid credentials', message: 'Failed to login'})
        }
        
        // generate token and send to user
        const token = await generateToken({ id: user?.id, username: user?.username, email: user?.email });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user?.id,
                username: user?.username,
                email: user?.email,
                logedinAt: user?.createdAt
            },
            token: token
        });
    } catch (err) {
        console.error('error ', err);
        return res.status(500).json({ error: 'Failed to login' });
    }
}