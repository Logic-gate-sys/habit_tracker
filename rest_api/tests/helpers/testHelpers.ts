import { prisma } from "../../src/config/prisma.ts";
import { createUserSchema} from "../../src/schemas/zodSchemas.ts";
import { hashPassword } from "../../src/utils/passwords.ts";
import { generateToken } from "../../src/utils/jwt.ts";
import { FREQUENCY } from "./../../src/config/generated/prisma/enums.ts";

//  a helper to create user
export async function createTestUser(
  testUser: Partial<typeof createUserSchema> = {},
) {
  try {
    const defaultData = {
      email: `user${Math.random() * 100}@gmail.com`,
      user_name: `man-${new Date()} ${Math.random()}`,
      password: `${Math.random()}=e0r0e`,
      f_name: `dkeo-${Math.random()}-${new Date()}`,
      m_name: `dkeo-${Math.random()}-${new Date()}`,
      l_name: `last-${Math.random()}`,
      ...testUser,
    };
    const email = defaultData.email;
    // hash password
    const rawpassword = defaultData?.password;
    const hashedPassword = await hashPassword(rawpassword);
    if (!hashPassword) {
      return;
    }
    // crate user
    const newUser = await prisma.user.create({
      data: {
        ...defaultData,
        password: hashedPassword,
      },
    });
    if (!newUser) {
      return;
    }
    // generate acess token
    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser?.user_name,
    });
    if (!token) {
      return;
    }
    // return user, token and rawpassword
    return { email, newUser, token, rawpassword };
  } catch (e: any) {
    console.log("Error", e.message);
  }
}

export async function createTestTag(userId: string) {
  try {
    const data = {
      name: `Health:${crypto.getRandomValues}`,
      color: `#ff${crypto.getRandomValues}df`,
    };
    const tag = await prisma.tag.create({
      data: {
        user_id: userId,
        ...data,
      },
    });
    return { success: true, tag: tag };
  } catch (e: unknown) {
    console.error(e);
  }
}

export async function createTestTagsBulk(userId: string, count: number = 40) {
  try {
    // 1. Generate all data locally first
    const tagsData = Array.from({ length: count }).map(() => ({
      user_id: userId,
      name: `Health:${crypto.randomUUID()}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
    }));

    // 2. Single database hit
    const result = await prisma.tag.createMany({
      data: tagsData,
      skipDuplicates: true, // Prevents the whole batch from failing if one conflicts
    });

    return { success: true, count: result.count };
  } catch (e: unknown) {
    console.error("Bulk creation failed:", e);
    return { success: false, error: e };
  }
}

export async function createTestHabit(userId: string, tagId: string) {
  try {
    const habit_data = {
      user_id: userId,
      tag_id: tagId,
      title: "Daily Reading",
      description: "Read at least 100 pages of a non-fiction book.",
      frequency: FREQUENCY.DAILY,
      target_value: 100,
      unit: "pages",
    };
    const newHabit = await prisma.habit.create({
      data: {
        ...habit_data,
      },
    });

    return { success: true, newHabit };
  } catch (e: any) {
    console.error("Error: ", e.message);
  }
}

export async function createTestBulkHabit(userId: string, tagIds: string[]) {
  try {
    // 1. Map your tag IDs into an array of habit objects
    // We ensure we only take up to 5 tags to stay within your "under five" requirement
    const habitsData = tagIds.slice(0, 5).map((tagId, index) => ({
      user_id: userId,
      tag_id: tagId,
      title: `Daily Reading ${index + 1}`, // Differentiates titles slightly
      description: "Read at least 100 pages of a non-fiction book.",
      frequency: FREQUENCY.DAILY, // Ensure this matches your Prisma enum string
      target_value: 100,
      unit: "pages",
    }));

    // 2. Perform a single batch insert
    const result = await prisma.habit.createMany({
      data: habitsData,
      skipDuplicates: true, 
    });

    return { 
      success: true, 
      count: result.count 
    };
  } catch (e: any) {
    console.error("Bulk Habit Error: ", e.message);
    return { success: false, error: e.message };
  }
}

// logs
export async function createTestBulkLogs(habitId: string) {
  try {
    const logsData = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => ({
      habit_id: habitId,
      value: `Daily Reading ${idx + 1}`,
      note: `Notes ${idx + 1}`
    }))
    // bulk create
    const logs = await prisma.logs.createMany({
      data: logsData,
      skipDuplicates: true
    });

    // final return 
    return { 
      success: true, 
      count: logs.count 
    };
  } catch (err) {
     console.error("Bulk Logs Error: ", err.message);
    return { success: false, error: err.message };
  }
}

export async function createTestLog(habitId: string) {
  try {
    const logs_data = {
        habit_id : habitId,
        value: 'Made some sauges',
        note: 'I love what I did today,I should to more of this often'
    }
    const newLog = await prisma.logs.create({
      data: {
        ...logs_data
      }
    });

    // return 
    return {newLog, success:true}
  } catch (err) {
    throw new Error(err.message)
  }
}
// cleanup after each test
export async function cleanupDB() {
  try {
    // clean all rows from all tables
    await prisma.user.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.logs.deleteMany();

    console.log("All rows cleaned from db ");
  } catch (err: any) {
    console.error("Error: ", err);
  }
}
