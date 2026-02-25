import { prisma } from "../config/prisma.ts";
import type { Request, Response } from "express";
import { FREQUENCY, UNIT_TYPE} from "../config/generated/prisma/enums.ts";
import { env } from './../../env.ts';

export async function createHabit(req: Request, res: Response) {
    try {
        const MAX_ACTIVE_HABITS = env.MAX_ACTIVE_HABITS || 10; 
        const { id } = req.user as unknown as string;
        const { tagId,unitsType , title, description, frequency, targetValue, uint } = req.body; 
        const totalHabits = await prisma.habit.count({where:{archived: false}});
        if (totalHabits >= MAX_ACTIVE_HABITS) {
            return res.status(400).json({
                success: false,
                total_habits: totalHabits, 
                error: 'Active habit limit reached! ',
                message:'You have more than the recommended active habits, consider archiving a habit'
            })
        }
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
        let unitType: UNIT_TYPE; 
        switch (unitsType) {
            case 'COUNTS':
                unitType = UNIT_TYPE.COUNT;
                break; 
            
            case 'DURATION':
                unitType = UNIT_TYPE.DURATION;
                break; 
            case 'BOOLEAN':
                unitType = UNIT_TYPE.BOOLEAN;
                break; 
            default:
                unitType = UNIT_TYPE.DEFAULT;
                break; 
        }
        const newHabit = await prisma.habit.create({
            data: {
                user_id: id,
                tag_id: tagId,
                title: title,
                unit_type: unitType,
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
        const totalHabits = await prisma.habit.count({where:{archived: false}});
        if (!totalHabits) {
            return res.status(404).json({ error: 'No habits', message: 'You might consider creating some habits' })
        }
        
        const startIndex = (page - 1) * limit;
 
        const habits = await prisma.habit.findMany({
            where: { user_id: id, archived: false },
            select: {
                id: true,
                tag_id: true,
                title: true,
                description: true,
                frequency: true,
                target_value: true,
                unit: true,
                goal_reached: true,
                created_at: true
            },
            skip: startIndex,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        });
        if (habits.length === 0) {
            return res.status(400).json({
                success: false,
                message:'User has no habits'
            }) 
        }
    
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
                freeze_times: {
                    push: new Date() //push current date as time of freezing 
                },
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

export async function softDeleteHabit(req: Request, res: Response) {
    try {
        const habitId = req.params.id as unknown as string;
        const { id } = req.user as unknown as string;
        
        const deleteResult = await prisma.habit.update({
            where: {
                id: habitId,
                user_id: id
            },
            data: {
                archived: true 
            }
        });
        // return 
        return res.status(200).json({
            success: true,
            message: 'Habit archived successfully'
        });
    } catch (err) {
        return res.status(500).json({
            error: "Failed to delete habit",
            detail: err.message
        })
    }
}

export async function hardDeleteHabit(req: Request, res: Response) {
    try {
        const isHard = req.query.hard === 'true';
        const isPermanent = req.query.permanent === 'true'; 
        const habitId = req.params.id as unknown as string;
        const { id } = req.user as unknown as string;

        // validate hard & permanent 
        if (!isHard || !isPermanent) {
            return res.status(400).json({ error: 'Bad request', message: 'Route does not exist' });
        }
        const deleteResult = await prisma.habit.delete({
            where: {
                id: habitId,
                user_id: id
            }
        });
        // return 
        return res.status(200).json({
            success: true,
            message: 'Habit deleted permanently',
            details:'This habit is gone forever , you can not have it back '
        });
    } catch (err) {
        return res.status(500).json({
            error: "Failed to delete habit",
            detail: err.message
        })
    }
}


export async function restoreArchivedHabit(req: Request, res: Response) {
    try {
        const restore = req.query.restore === 'true';
        const habitId = req.params.id as unknown as string;
        const { id } = req.user as unknown as string;
        // existing habit 
        const existingHabit = await prisma.habit.findUnique({
            where: {
                id: habitId,
                user_id: id
            }
        });

        if (!existingHabit) {
            return res.status(400).json({
                error: 'Invalid details ',
                message:'No such habit exists'
            })
        }

        // restore 
        const deleteResult = await prisma.habit.update({
            where: {
                id: habitId,
                user_id: id
            },
            data: {
                archived: false
            }
        });

        // return 
        return res.status(200).json({
            success: true,
            message: 'Habit restored successfully',
        });
    } catch (err) {
        return res.status(500).json({
            error: "Failed to restore  habit",
            detail: err.message
        })
    }
}
