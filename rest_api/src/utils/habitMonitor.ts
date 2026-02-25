import { FREQUENCY } from "../config/generated/prisma/enums.ts";
import { isSameDay, isSameMonth, isSameWeek, isToday } from "date-fns";
import { prisma } from "../config/prisma.ts";

/* 
    Habit is nearing reset if the any of these conditions are true:
    - User has a streak & a habit's entry deadline is hour away 
    - Habit is not archived
*/
export async function habitNearReset(habit: unknown): Promise<boolean> {
  // most  recent log recent log
  const lastLog = await prisma.logs.findFirst({
    where: { habit_id: habit?.id },
    orderBy: { created_at: "desc" },
  });
  const frequency:FREQUENCY = habit?.frequency; 


  const now = new Date();
  const mostCurrentLog = lastLog?.created_at?? ''; 

  let nearsReset: boolean = false; 
  //if last log is today return 
  if (isSameDay(mostCurrentLog, now)) {
    return nearsReset = true; 
  }

  switch (frequency) {
    case 'DAILY':
      if (!isSameDay(mostCurrentLog, now)) {
        nearsReset = true;
      }
      break; 
    
    case 'WEEKLY':
      if (!isSameWeek(mostCurrentLog, now)) {
        nearsReset = true;
      }
      break; 
    
    case 'MONTHLY':
      if (!isSameMonth(mostCurrentLog, now)) {
        nearsReset = true;
      }
      break; 
    
    case 'OTHER':
      if (Array.isArray(habit?.custom_days)) {
        (habit?.custom_days ?? []).map((day: string) => {
          if (isToday(day) && !isSameDay(mostCurrentLog, now)) {
            nearsReset = true;
          }
        })
      }
      break; 
      
    default:
      throw Error(`Invalid frequency given ${frequency}  ${frequency satisfies FREQUENCY }`)
  }
  
  // return nearReset 
  return nearsReset; 
}
