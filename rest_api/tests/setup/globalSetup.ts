import { prisma } from './../../src/config/prisma.ts';
import { execSync } from 'child_process';


export async function setup() {
    try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Habit" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Tag" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Logs" CASCADE `);
        // push schema
        console.log("Drop Tables: about to start test ")
        execSync('npx prisma db push', { stdio: 'inherit', cwd: process.cwd() })
        // log
    } catch (err) {
        throw err;
    }
}


export async function teardown() {
    try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "User" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Habit" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Tag" CASCADE `);
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "Logs" CASCADE `);
        console.log("Drop tables : Done with test")
        process.exit(0);
    } catch (e) {
        throw e;
    }

}