import cron from 'node-cron'; 
import { checkOrUpdateUserStreak } from '../utils/streakMonitor.ts';
import { prisma } from '../config/prisma.ts';
import { formatInTimeZone } from 'date-fns-tz';
import { sendStreakReminder } from '../utils/sendReminder.ts';
import { habitNearReset } from '../utils/habitMonitor.ts'


//task schedular 
export async function initBackgroundJob() {
  // Run this task every 1 hour 
  cron.schedule("0 * * * *", async () => {
    try {
      // get all users 
      const users = await prisma.user.findMany();
      if (!users) {
        return;
      }
      for (const user of users) {
        const userLocalTime = new Date();
        const userLocalHour = formatInTimeZone(userLocalTime, user.time_zone ?? '', 'HH');

        // if user is in the mid night : check or update User steak  
        if (userLocalHour === '00') {
          await checkOrUpdateUserStreak(user);
        }
      }
    } catch (err) {
      throw new Error(`Failed to run job: Updating users streak`)
    }
  }); 

 // crone email Reminder: runs every 1
  cron.schedule("0 * * * *", async () => {
    try {
      // get all users 
      const users = await prisma.user.findMany();
      if (!users) {
        return;
      }
      for (const user of users) {
        const userLocalTime = new Date();
        const userLocalHour = formatInTimeZone(userLocalTime, user.time_zone ?? '', 'HH');

        // if user is in the mid night : 11: 00pm  
        if (userLocalHour === '23') {
          const userHabits = await prisma.habit.findMany({
            where: { user_id: user?.id }
          });
          if (!userHabits) {
            return; 
          }
          // for all habits that user has 
          for (const habit of userHabits) {
            const isNearReset = await habitNearReset(habit);
            
            //if habit is not archived & nears reset : send reminder 
            if (isNearReset && habit.archived===false) {
              //send custom email reminder
               await sendStreakReminder(user, habit);
            }
          }
        }
      }
    } catch (err) {
      // throw error 
      throw new Error(`Failed to run reminder Job. Error: ${err}`)
    }
  })

};
