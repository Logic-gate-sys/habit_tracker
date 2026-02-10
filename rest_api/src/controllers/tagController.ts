import { prisma } from "../config/prisma.ts";
import type {  Request,Response } from "express";

export async function getTags(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const { id } = req.user;
        const totalTags = await prisma.tag.count();
        if (!totalTags) {
            return res.status(404).json({ error: 'No tags', message: 'You might consider creating some tags' })
        }
        const startIndex = (page - 1) * limit;
        const tags = await prisma.tag.findMany({
            where: { user_id: id },
            select: {
                name: true,
                color: true,
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
            total: totalTags,
            limit: limit,
            page: page,
            pages: Math.ceil(totalTags / limit),
            data: tags
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to fetch user tags',
            details: err.message
        })
    }
}

export async function createTag(req: Request, res: Response) {
    try {
        const { id } = req.user; 
        const { color, name } = req.body;
        const existingTag = await prisma.tag.findFirst({
            where: { user_id: id, name: name, color: color }
        });
        if (existingTag) {
            return res.status(409).json({ error: 'Duplicate , Tag already exists' });
        }
        const newTag = await prisma.tag.create({
            data: {
                user_id: id,
                name: name,
                color: color
            }
        });
        // send response back
        return res.status(201).json({
            success: true,
            message: 'Tag created successfull',
            data: newTag
        })
    } catch (err: unknown) {
        console.error("Error: ", err)
        return res.status(500).json({
            error: 'Failed to create tag',
            message: 'Something went wrong ',
            details: err.message
        })
    }
    
}

export async function updateTag(req: Request, res: Response) {
    try {
        const { id } = req?.params as unknown as string;
        const user = req.user; 
        const { color, name } = req.body;
        const updatedTag = await prisma.tag.update({
            where:{ id:id, user_id:user?.id },
            data:{
                name: name,
                color: color
            }
        });
        return res.status(200).json({
            success: true,
            data: updatedTag
        });
    } catch (err: unknown) {
        return res.status(500).json({
            error:'Something went wrong, please try again later'
        })
    }
}

export async function deleteTag(req: Request, res: Response) {
    try {
        const { id } = req.params as unknown as string;
        const deleteResult = await prisma.tag.delete({
            where: { id: id }
        });

        return res.status(200).json({
            success: true,
            message: 'Tag deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to delete tag', 
            details: err.message
        })
    }
}