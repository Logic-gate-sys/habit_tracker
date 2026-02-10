import { xContentTypeOptions } from 'helmet';
import { z } from 'zod';
import { FREQUENCY } from '../config/generated/prisma/enums';


//user 
export const createUserSchema = z.object({
    email: z.string().email('Not a valid email'),
    userName:z.string().min(5).max(50),
    password: z.string().min(12),
    firstName: z.string().min(2).optional(),
    middleName: z.string().min(2).optional(),
    lastName:z.string().min(2).optional()
});

export const loginSchema = z.object({
    email: z.string().email('Not a valid email'),
    password: z.string().min(12),
});


//tags 
export const createTagSchema = z.object({
    name: z.string().min(1),
    color: z.string().min(2)
});

export const updateTagSchema = z.object({
    name: z.string().min(2).optional(),
    color: z.string().min(3).optional()
});

// habits
export const createHabitSchema = z.object({
    tagId: z.string(),
    title: z.string().min(3),
    description: z.string().min(10),
    frequency: z.string(),
    targetValue: z.coerce.number(),
    uint: z.string().min(3)
});

export const updateHabitSchema = z.object({
   tagId: z.string().optional(),
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    frequency: z.string().optional(),
    targetValue: z.coerce.number().optional(),
    unit: z.string().min(3).optional() 
})

//params
export const paramSchema = z.object({
    id: z.string()
});

//query
export const querySchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional()
})


