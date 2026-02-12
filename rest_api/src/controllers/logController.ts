import { includes } from "zod";
import { prisma } from "../config/prisma.ts";
import type {  Request,Response } from "express";

export async function getLogs(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const habitId = req.params.id as unknown as string ; 
        const { id } = req.user;
        const totalLogs = await prisma.logs.count();
        if (!totalLogs) {
            return res.status(404).json({ error: 'No Logs', message: 'You might consider creating some Logs' })
        }
        const startIndex = (page - 1) * limit;

        const logs = await prisma.logs.findMany({
            where: { habit_id: habitId },
            select: {
                value: true,
                note: true, 
                created_at: true
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
            total: totalLogs,
            limit: limit,
            page: page,
            pages: Math.ceil(totalLogs / limit),
            data: logs
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to fetch user logs',
            details: err.message
        })
    }
}

export async function createLog(req: Request, res: Response) {
    try {
        const { habitId, value, note } = req.body ?? {};
        const newLog = await prisma.logs.create({
            data: {
                habit_id: habitId,
                value: value,
                note: note
            }
        });

        return res.status(201).json({
            success:true,
            message: 'Log created successfully',
            data: newLog
        })
    } catch (err: unknown) {
        return res.status(500).json({
            error: `Failed to create log for habit`,
            details: err.message
        })
    }
}

export async function updateLog(req: Request, res: Response) {
    try {
        const logId = req.params.id as unknown as string; 
        const { ...data} = req.body ?? {};

        const updatedLog = await prisma.logs.update({
            where: { id: logId },
            data: {
               ...data
            }
        });

        return res.status(200).json({
            success:true,
            message: 'Log updated successfully',
            data: updatedLog
        })
    } catch (err: unknown) {
        return res.status(500).json({
            error: `Failed to update log for habit`,
            details: err.message
        })
    }
}

export async function hardDeleteLog(req: Request, res: Response) {
    try {
        const logId = req.params.id as unknown as string; 
        const deletedLog = await prisma.logs.delete({
            where: { id: logId }
        });

        return res.status(200).json({
            success:true,
            message: 'Log deleted successfully',
            data: deletedLog
        })
    } catch (err: unknown) {
        return res.status(500).json({
            error: `Failed to delete log for habit`,
            details: err.message
        })
    }
}
