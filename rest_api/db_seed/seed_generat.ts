import { prisma } from "./../src/config/prisma.ts";

 async function generateInitialSeed() {
    console.log(".. Generating seed data to fill data for intial setup .....");
    // ---------------- CLEAR ALL TABLES ----------------
    console.log("Deleting all table rows .....");
    try {
        await prisma.habitTag.deleteMany();
        await prisma.entry.deleteMany();
        await prisma.habit.deleteMany();
        await prisma.tag.deleteMany();
        await prisma.user.deleteMany();

        console.log("All tables cleared");

        // ---------------- CREATE USERS ----------------
        const user1 = await prisma.user.create({
            data: {
                email: "john@example.com",
                username: "john_doe",
                password: "hashed_password_1",
                firstName: "John",
                lastName: "Doe",
            },
        });

        const user2 = await prisma.user.create({
            data: {
                email: "jane@example.com",
                username: "jane_smith",
                password: "hashed_password_2",
                firstName: "Jane",
                lastName: "Smith",
            },
        });
        console.log("Users created");

        // ---------------- CREATE HABITS ----------------
        const habit1 = await prisma.habit.create({
            data: {
                userId: user1.id,
                name: "Morning Exercise",
                description: "30 minutes of cardio or stretching",
                frequency: "DAILY",
                targetCount: 1,
            },
        });

        const habit2 = await prisma.habit.create({
            data: {
                userId: user2.id,
                name: "Read Books",
                description: "Read at least 10 pages",
                frequency: "DAILY",
                targetCount: 1,
            },
        });
        console.log("Habits created");

        // ---------------- CREATE ENTRIES ----------------
        await prisma.entry.createMany({
            data: [
                {
                    habitId: habit1.id,
                    completion: 1,
                    note: "Jogged for 30 minutes",
                },
                {
                    habitId: habit1.id,
                    completion: 1,
                    note: "Yoga session",
                },
                {
                    habitId: habit1.id,
                    completion: 0,
                    note: "Skipped due to rain",
                },
                {
                    habitId: habit1.id,
                    completion: 1,
                    note: "Home workout",
                },

                {
                    habitId: habit2.id,
                    completion: 1,
                    note: "Read 15 pages",
                },
                {
                    habitId: habit2.id,
                    completion: 1,
                    note: "Read before bed",
                },
                {
                    habitId: habit2.id,
                    completion: 0,
                    note: "Too busy today",
                },
                {
                    habitId: habit2.id,
                    completion: 1,
                    note: "Finished a chapter",
                },
            ],
        });
        console.log("Entries created");

        // ---------------- CREATE TAGS ----------------
        const tags = await prisma.tag.createMany({
            data: [
                { name: "Health", color: "#22c55e" },
                { name: "Fitness", color: "#3b82f6" },
                { name: "Mindfulness", color: "#a855f7" },
                { name: "Learning", color: "#f59e0b" },
                { name: "Productivity", color: "#ef4444" },
            ],
        });

        const allTags = await prisma.tag.findMany();
        console.log("Tags created");

        // ---------------- ASSIGN TAGS TO HABITS ----------------
        await prisma.habitTag.createMany({
            data: [
                // habit 1 tags
                { habitId: habit1.id, tagId: allTags[0].id },
                { habitId: habit1.id, tagId: allTags[1].id },
                { habitId: habit1.id, tagId: allTags[4].id },
                { habitId: habit1.id, tagId: allTags[2].id },

                // habit 2 tags
                { habitId: habit2.id, tagId: allTags[3].id },
                { habitId: habit2.id, tagId: allTags[4].id },
                { habitId: habit2.id, tagId: allTags[2].id },
                { habitId: habit2.id, tagId: allTags[0].id },
            ],
        });

        console.log("Habit tags assigned");
        // ---------------- DONE ----------------
        console.log("Database seeded successfully");

    } catch (error: any) {
        throw new Error(error);
    }
}

// Function should execute directly when called in terminal
if (import.meta.url === `file://${process.argv[1]}`) {
    generateInitialSeed()
        .then(()=> process.exit(0))
        .catch(()=> process.exit(1))
}
export { generateInitialSeed };

