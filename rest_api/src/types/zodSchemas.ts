import { xContentTypeOptions } from 'helmet';
import { z } from 'zod';


// Habbit schemas 
export const createHabbitSchema = z.object({
    userId: z.string().min(12),
    title: z.string().min(15),
    type: z.enum(["bad", "good"]).default("good")
});

export const createUserSchema = z.object({
    email: z.string().email('Not a valid email'),
    username: z.string().min(5),
    password: z.string().min(12),
});

export const loginSchema = z.object({
    email: z.string().email('Not a valid email'),
    password: z.string().min(12),
})