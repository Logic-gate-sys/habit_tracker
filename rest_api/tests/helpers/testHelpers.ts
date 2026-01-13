import { prisma } from '../../src/config/prisma.ts';
import { createHabbitSchema, createUserSchema } from '../../src/types/zodSchemas.ts';
import { hashPassword } from '../../src/utils/passwords.ts';
import { generateToken } from '../../src/utils/jwt.ts';
import { UserScalarFieldEnum } from '../../src/config/generated/prisma/internal/prismaNamespace.ts';



//  a helper to create user
export async function createTestUser(testUser: Partial<typeof createUserSchema> = {}) {
    const defaultData ={
        email: `someont${new Date()}@gmail.com`,
        username: `man-${new Date()} ${Math.random()}`,
        password: `${Math.random()}=e0r0e`,
        firstname: `dkeo-${Math.random()}-${new Date()}`,
        lastname: `last-${Math.random()}`,
        ...testUser
    }
    // hash password
    const hashedPassword = await hashPassword(defaultData.password);
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
    })

    return {newUser, token}
}

export async function createTestHabit(userId: string, habitData: Partial<typeof createHabbitSchema>) {
    const habitEnums = ['DAILY, WEEKLY, MONTHLY']
    const defualtData = {
        name:`${Math.random()}s name` ,
        description:`${new Date()} some descript here about ${Math.random()}` ,
        frequency:habitEnums[Math.floor(Math.random() * 4)] as any,
        targetCount:Math.floor(Math.random()*360)
    }

    const newHabit = await prisma.habit.create({
        data: {
            userId: userId,
            ...defualtData
        }
    });

    // return habit
    return {newHabit}
}   


export async function cleanup() {
    // clean all rows from all tables
    console.log("Cleaning all rows from db. ...")
    await prisma.user.deleteMany();
    await prisma.habit.deleteMany();
    await prisma.entry.deleteMany();
    await prisma.habitTag.deleteMany();
    await prisma.tag.deleteMany();

    console.log('All rows cleaned from db')
}