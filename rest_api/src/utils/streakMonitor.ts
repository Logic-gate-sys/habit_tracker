import { FREQUENCY } from "../config/generated/prisma/enums.ts";
import { prisma } from "../config/prisma.ts";
import {
  isSameWeek,
  isSameDay,
  isSameMonth,
  subMonths,
  format,
} from "date-fns";

export async function checkOrUpdateUserStreak(user: any) {
  try {
    const habits = await prisma.habit.findMany({
      // Fixed: findMany instead of findFirst
      where: { user_id: user?.id },
    });
    // now
    const now = new Date();

    for (const currentHabit of habits) {
      const lastLog = await prisma.logs.findFirst({
        where: { habit_id: currentHabit.id },
        orderBy: { created_at: "desc" },
      });

      // If they have NEVER logged, skip or handle separately
      if (!lastLog) continue;
      let shouldReset = false;

      switch (currentHabit.frequency) {
        case FREQUENCY.DAILY:
          // Reset if the last log was BEFORE yesterday
          // (Allowing today to be "in progress")
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          if (
            !isSameDay(lastLog.created_at, now) &&
            !isSameDay(lastLog.created_at, yesterday)
          ) {
            shouldReset = true;
          }
          break;

        case FREQUENCY.WEEKLY:
          // Reset if the last log was NOT this week AND not last week
          if (!isSameWeek(lastLog.created_at, now)) {
            shouldReset = true;
          }
          break;
        case FREQUENCY.MONTHLY:
          const lastMonth = subMonths(now, 1);
          // reset if month of logging has passed
          if (
            !isSameMonth(lastLog.created_at, now) &&
            !isSameMonth(lastLog.created_at, lastMonth)
          ) {
            shouldReset = true;
          }

        default:
          // Handle ['monday', 'tuesday']
          if (Array.isArray(currentHabit.custom_days)) {
            shouldReset = checkCustomReset(
              lastLog.created_at,
              currentHabit.custom_days,
              now,
            );
          }

          break;
      }

      //reset streak  if need be
      if (shouldReset) {
        await resetStreak(currentHabit);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// reset streak
async function resetStreak(currentHabit: unknown) {
  try {
    await prisma.habit.update({
      where: { id: currentHabit?.id },
      data: {
        sleep: true,
        streak: 0,
        streak_history: currentHabit?.streak,
      },
    });
    // return
    return;
  } catch (err: unknown) {
    console.error("Failed to reset streak ");
  }
}

export function checkCustomReset(
  lastLogDate: Date,
  allowedDays: string[],
  now: Date,
) {
  // day string e.g 'monday', 'tuesday' etc
  const todayString = format(now, "EEE");

  if (Array.isArray(allowedDays)) {
    // Is there supposed to be a log today ?
    const todayIsPart = allowedDays.includes(todayString) ?? false;
    //if today is not part:false
    if (!todayIsPart) return false;
    // is today part and has user logged
    if (todayIsPart && isSameDay(lastLogDate, now)) {
      return false;
    }
    // if user has not logged in and it's past today
    return true;
  }

  // return
  return true;
}
