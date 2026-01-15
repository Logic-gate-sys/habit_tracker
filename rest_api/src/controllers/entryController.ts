import type { Request, Response } from 'express'
import { type AuthRequest } from '../middlewares/authenticate.ts';
import { prisma } from '../config/prisma.ts';



export const createEntry = async (req: AuthRequest, res: Response) => {
    try {
        const { id, ...rest } = req.user;
        const { habitId, completion, note } = req.body;
        const newEntry = await prisma.entry.create({
            data: {
                habit_id: habitId,
                completion: completion,
                note: note
            }
        });
        // send response
        return res.status(201).json({ message: 'Entry Creation Successful', data: newEntry });
    } catch (error: any) {
        return res.status(500).json({
            error: "Server error",
            message: "Something went wrong",
            detail: error.message
       })
    }

}

export const updateEntry = async (req: AuthRequest, res: Response) => {
    try {
        const { id, ...rest } = req.user;
        const entryId = req.params.id as string;
        const { ...data } = req.body;
        // update 
        const updatedEntry = await prisma.entry.update({
            where: { id: entryId },
            data: {
                ...data
            }
        });
     
        return res.status(200).json({ message: 'Update successful', data: updateEntry });
    } catch (err: any) {
        return res.status(500).json({
            error: 'Failed to update entry',
            message:'Something went wrong'
        })
    }
}

export const deleteEntry = async (req: AuthRequest, res: Response) => {
    try {
        const entryId = req.params.id as string;
        // update 
        const deletedEntry = await prisma.entry.delete({
            where: { id: entryId }
        });
     
        return res.status(200).json({ message: 'Delete successful', data: deletedEntry });
    } catch (err: any) {
        return res.status(500).json({
            error: 'Failed to delete entry',
            message:'Something went wrong'
        })
    }
}

export const getEntries = async (req: AuthRequest, res: Response) => {
    try {
        const { id, ...rest } = req.user;
        // update 
        const entries = await prisma.habit.findMany({
            where: { user_id: id },
            select: {
                entries: {
                    select: {
                        id: true,
                        completion: true,
                        note: true,
                        created_at: true
                    }
                }
            }
        });
        // if no entry found 
        if (entries.length === 0) {
          return res.status(400).json({message:"User has no habbit associated entries"})
      }
    return res.status(200).json({ message: 'User entries retrieved ', data: entries });
    } catch (err: any) {
        return res.status(500).json({
            error: 'Failed to delete entry',
            message:'Something went wrong'
        })
    }
}
