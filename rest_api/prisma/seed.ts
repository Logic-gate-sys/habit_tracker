import { FREQUENCY, UNIT_TYPE, BADGE } from '../src/config/generated/prisma/enums.ts';
import { prisma } from "../src/config/prisma.ts";


// --- CUSTOM DATA POOLS ---
const HABIT_NAMES = ['Morning Run', 'Read 20 Pages', 'Drink Water', 'Meditate', 'Code Project', 'Journaling', 'Gym Session'];
const TAG_NAMES = ['Health', 'Productivity', 'Mindset', 'Hobbies', 'Work'];
const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFBD33'];
const UNITS = ['minutes', 'pages', 'liters', 'reps', 'steps'];

// --- HELPER FUNCTIONS ---
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('--- Starting Seeding (Manual Mode) ---');

  // Adjust these to scale your database size
  const USER_COUNT = 3;
  const TAGS_PER_USER = 2;
  const HABITS_PER_TAG = 2;

  for (let i = 0; i < USER_COUNT; i++) {
    const userEmail = `user${i}_${Date.now()}@example.com`;

    // 1. Create User
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        password: 'secure_password_hash',
        user_name: `user_name_${i}`,
        f_name: 'John',
        l_name: 'Doe',
        time_zone: 'UTC',
      },
    });

    console.log(`Created User: ${user.email}`);

    for (let j = 0; j < TAGS_PER_USER; j++) {
      // 2. Create Tag
      const tag = await prisma.tag.create({
        data: {
          user_id: user.id,
          name: TAG_NAMES[j % TAG_NAMES.length],
          color: getRandom(COLORS),
        },
      });

      for (let k = 0; k < HABITS_PER_TAG; k++) {
        // 3. Create Habit
        const habit = await prisma.habit.create({
          data: {
            user_id: user.id,
            tag_id: tag.id,
            title: getRandom(HABIT_NAMES),
            description: 'Generated habit for testing',
            frequency: getRandom(Object.values(FREQUENCY)),
            target_value: getRandomInt(1, 10),
            unit_type: getRandom(Object.values(UNIT_TYPE)),
            unit: getRandom(UNITS),
            streak: getRandomInt(0, 10),
            badge: getRandom(Object.values(BADGE)),
            // Seed a few history dates
            streak_history: [new Date(), new Date(Date.now() - 86400000)], 
          },
        });

        // 4. Create Logs (Batch insert for performance)
        const logCount = 5;
        await prisma.logs.createMany({
          data: Array.from({ length: logCount }).map(() => ({
            habit_id: habit.id,
            value: getRandomInt(1, 5).toString(),
            note: 'Daily progress log',
            created_at: new Date(Date.now() - Math.random() * 1000000000),
          })),
        });
      }
    }
  }

  console.log('--- Seeding Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });