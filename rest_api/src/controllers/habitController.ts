import { prisma } from "./../config/prisma.ts";
import type { Response } from "express";
import { type AuthRequest } from "./../middlewares/authenticate.ts";
import { truncate } from "node:fs";
import { tuple } from "zod";

// Create Habbit
export async function createHabit(req: AuthRequest, res: Response) {
  try {
    const {id, username, email} = req.user;
    const { name, description, frequency, targetCount, tagName, color } = await req.body;
    // create habbit and if there's tag some tags
    const newTrx = await prisma.$transaction(async (trx) => {
      const newHabit = await trx.habit.create({
        data: {
          userId: id,
          name: name,
          description: description,
          frequency: frequency,
          targetCount: targetCount,
        },
      });
      // create also entries
      const newTag = await trx.tag.create({
        data: {
          name: tagName,
          color: color,
        },
      });

      //create habbit tag
      const newHabitTag = await trx.habitTag.create({
        data: {
          habitId: newHabit.id,
          tagId: newTag?.id,
        },
      });
      // return
      return {
        habit: newHabit,
        tag: newTag,
        habitTag: newHabitTag,
      };
    });
    //  return result
    return res.status(201).json({ message: "Habit Creation Successful" });
  } catch (err) {
      console.error("Error: ", err)
    return res.status(500).json({
      message: "Failed to create habbit, tag and habbit tag",
    });
  }
}

// update habit
export async function updateHabit(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const habitId = req.params.id;
    const { name, description, frequency, targetCount , isActive} = req.body;
    try {
        const result = await prisma.$transaction(async (trx) => {
            // update user's habit
            const updatedHabit = await trx.habit.update({
                where: { id: habitId, userId: userId },
                data: {
                    name: name,
                    description: description,
                    frequency: frequency,
                    targetCount: targetCount,
                    isActive: isActive,
                    updatedAt: new Date()
                }
            });
            // update entry if possible
            if (!updateHabit) {
                return res.status(400).end();
            }
        });
    } catch (err) {
        console.error("Failed to update habit", err);
        res.status(500).json({ message: " Faild to update habit" });
    }
}


export async function deleteHabit(req: AuthRequest, res: Response) {
    try {
        const habitId = req.params.id;
        const result = await prisma.habit.delete({
            where: { id: habitId }
        })
        return res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (err) {
        console.error("Failed to delete habit");
        res.status(500).json({message:'Failed to delete habit'})
    }
}

// get all user habits habits
export async function getHabits(req: AuthRequest, res: Response) {
  const { id, ...rest } = req.user;
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: id },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        frequency: true,
        targetCount: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
            username: true,
          }
        },
        entries: {
          select: {
            completion: true,
            note: true
          }
        }
      }
    });
    if (habits.length === 0) {
      return res.status(404).json({ message: "No habits found", details:'User has no habits' });
    }

    return res.status(200).json({ message: 'Habits found', data: habits });
  } catch (error: any) {
    return res.status(500).json({message:'Failed to fetch habits', error:error.message})
  }
}
