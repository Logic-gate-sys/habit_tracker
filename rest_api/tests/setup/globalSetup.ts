import { prisma } from './../../src/config/prisma.ts';
import { execSync } from 'child_process';


export async function setup() {
    console.log("::::::::::::: DROPING ALL TABLES BEFORE TEST  ....");
    try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Habit" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Entry" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "HabitTag" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Tag" CASCADE `);

        // push schema
        execSync('npx prisma db push', { stdio: 'inherit', cwd: process.cwd() })
        // log
    } catch (err) {
        throw err;
    }
}


export async function teardown() {
    console.log(":::::::::::::::: DROPING ALL TABLES AFTER TEST  :::::::::::::::::::::::::");
    try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Habit" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Entry" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "HabitTag" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Tag" CASCADE `);
    
        process.exit(0);
    } catch (e) {
        throw e;
    }

}