import { prisma } from "../config/prisma.ts";
import type { Request, Response } from "express";
import { FREQUENCY } from "../config/generated/prisma/enums.ts";
import { serializeJsonQuery } from "@prisma/client/runtime/client";
import { success } from "zod";
import { rmSync } from "node:fs";

export async function createHabit(req: Request, res: Response) {
    try {
        const { id } = req.user as unknown as string;
        const { tagId, title, description, frequency, targetValue, uint } = req.body; 

        let freq: FREQUENCY; 
        switch (frequency) {
            case 'DAILY':
                freq = FREQUENCY.DAILY; 
            case 'MONTHL':
                freq = FREQUENCY.MONTHLY;
            case 'WEEKLY':
                freq = FREQUENCY.WEEKLY;
            case 'OTHER':
                freq = FREQUENCY.OTHER;
            default:
                freq = FREQUENCY.OTHER; 
        }
        const newHabit = await prisma.habit.create({
            data: {
                user_id: id,
                tag_id: tagId,
                title: title,
                description: description,
                frequency: freq,
                target_value: targetValue,
                unit: uint
            }
        });

        // return value
        return res.status(201).json({
            success: true,
            message: 'Habit created successfully',
            data: newHabit
        })
        
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to create habit tag', 
            details: err.message
        })
    }
}

export async function getHabits(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const { id } = req.user;
        const totalHabits = await prisma.habit.count();
        if (!totalHabits) {
            return res.status(404).json({ error: 'No habits', message: 'You might consider creating some habits' })
        }
        const startIndex = (page - 1) * limit;
 
        const habits = await prisma.habit.findMany({
            where: { user_id: id },
            select: {
                id: true,
                tag_id: true,
                title: true,
                description: true,
                frequency: true,
                target_value: true,
                unit: true,
                sleep: true,
                res_counter: true,
                goal_reached: true,
                archived: true,
                badge: true,
                created_at:true
            },
            skip: startIndex,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
    
        // final return 
        return res.status(200).json({
            success: true,
            total: totalHabits,
            limit: limit,
            page: page,
            pages: Math.ceil(totalHabits / limit),
            data: habits
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to fetch user tags',
            details: err.message
        })
    }
}

export async function updateHabit(req: Request, res: Response) {
    try {
        const { id } = req?.params as unknown as string;
        const { targetValue, frequency, ...rest } = req.body;
       let freq: FREQUENCY; 
        switch (frequency) {
            case 'DAILY':
                freq = FREQUENCY.DAILY; 
            case 'MONTHL':
                freq = FREQUENCY.MONTHLY;
            case 'WEEKLY':
                freq = FREQUENCY.WEEKLY;
            case 'OTHER':
                freq = FREQUENCY.OTHER;
            default:
                freq = FREQUENCY.OTHER; 
        }
        
        const updatedHabit = await prisma.habit.update({
            where: { id: id },
            data: {
                target_value: targetValue,
                frequency: freq,
                ...rest
            }
        });
        //return 
        return res.status(200).json({
            success:true,
            message: 'Habit updated successfully',
            data: updatedHabit
        })
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to upate habit',
            message: 'Please try again later',
            details:err.message
        })
    }
}

export async function deleteHabit(req: Request, res: Response) {
    try {
        const habitId = req.params.id as unknown as string;
        const { id } = req.user as unknown as string;
        
        const deleteResult = await prisma.habit.delete({ where: { id: habitId, user_id: id } });
        // return 
        return res.status(200).json({
            success: true,
            message: 'Habit deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            error: "Failed to delete habit",
            detail: err.message
        })
    }


}