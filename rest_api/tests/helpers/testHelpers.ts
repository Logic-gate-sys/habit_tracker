import { prisma } from '../../src/config/prisma.ts';
import { createHabbitSchema, createUserSchema } from '../../src/types/zodSchemas.ts';
import { hashPassword } from '../../src/utils/passwords.ts';
import { generateToken } from '../../src/utils/jwt.ts';
import { UserScalarFieldEnum } from '../../src/config/generated/prisma/internal/prismaNamespace.ts'; 
import {HabitFrequency} from './../../src/config/generated/prisma/enums.ts'



//  a helper to create user
export async function createTestUser(testUser: Partial<typeof createUserSchema> = {}) {
    console.log('Forming sample details to create test user...');
    const defaultData ={
        email: `someont${new Date()}@gmail.com`,
        user_name: `man-${new Date()} ${Math.random()}`,
        password: `${Math.random()}=e0r0e`,
        first_name: `dkeo-${Math.random()}-${new Date()}`,
        last_name: `last-${Math.random()}`,
        ...testUser
    }
    // hash password
    const rawpassword = defaultData?.password;
    const hashedPassword = await hashPassword(rawpassword);
    // crate user 
    const newUser = await prisma.user.create({
        data: {
            ...defaultData,
              password: hashedPassword ,
        }
    })
    // generate acess token 
    const token = await generateToken({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
    });

    // return user, token and rawpassword
    return { newUser, token, rawpassword};
}


export async function createTestHabit(userId: string, habitData: Partial<typeof createHabbitSchema>={}) {
    const habitEnums = ['DAILY, WEEKLY, MONTHLY']
        const defualtData = {
        name:`${Math.random()}s name` ,
        description:`${new Date()} some descript here about ${Math.random()}` ,
        frequency:HabitFrequency.DAILY,
            target_count: Math.floor(Math.random() * 360),
        ...habitData
    }

    const newHabit = await prisma.habit.create({
        data: {
            user_id: userId,
            ...defualtData
        }
    });

    // return habit
    return {newHabit}
}   


//creatae test entry
export async function createTestEntry(habbitId: string) {
    const newEntry = await prisma.entry.create({
        data: {
            habit_id: habbitId,
            completion: 24,
            note: "Sample note "
        }
    });

    return { newEntry };
}

export async function cleanup() {
    // clean all rows from all tables
    console.log(":::::::::::: Cleaning all rows from db. ...")
    await prisma.user.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.entry.deleteMany();
    await prisma.habitTag.deleteMany();
    await prisma.tag.deleteMany();

    console.log('.......All rows cleaned from db............')
}