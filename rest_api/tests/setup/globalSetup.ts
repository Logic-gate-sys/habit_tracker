import { prisma } from './../../src/config/prisma.ts';
import { execSync } from 'child_process';


export async function setup() {
    console.log("...Dropping all tables ....");
    try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Habit" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Entry" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "HabitTag" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Tag" CASCADE `);

        // push schema
        execSync('npx prisma db push', { stdio: 'inherit', cwd: process.cwd() })
        
        // log
        console.log("Test db set up successfully")

    } catch (err) {
        throw err;
    }
}

export async function cleanUp() {
    console.log("Clean Test database");
    try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Habit" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Entry" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "HabitTag" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Tag" CASCADE `);

        process.exit();
    } catch (e) {
        throw e;
    }

}