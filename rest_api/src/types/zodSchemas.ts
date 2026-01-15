import { z } from 'zod';

// entry schema
export const createEntrySchema = z.object({
    habitId: z.string().min(7),
    completion: z.coerce.number(),
    note: z.string().min(10)
})

// Habbit schemas 
export const createHabbitSchema = z.object({
    name: z.string().min(5),
    description: z.string().min(30),
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
    targetCount: z.coerce.number(),
    tagName: z.string().min(5).optional,
    color:z.string().min(5).optional
});

export const createUserSchema = z.object({
    email: z.string().email('Not a valid email'),
    username: z.string().min(5),
    password: z.string().min(12)
});

export const loginSchema = z.object({
    email: z.string().email('Not a valid email'),
    password: z.string().min(12),
})

export const updateHabitSchema = z.object({
    name: z.string().min(5).optional(),
    description: z.string().min(30).optional(),
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
    targetCount: z.coerce.number().optional(),
    isActive: z.boolean().optional(),
})

export const paramSchema = z.object({
    id: z.string()
})

