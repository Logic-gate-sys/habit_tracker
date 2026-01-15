import { app } from './../src/sever.ts'
import request from 'supertest';
import { describe, expect, it, test } from 'vitest';
import { createTestUser, cleanup as cleanupDB , createTestHabit, createTestEntry} from './helpers/testHelpers.ts';
import { afterEach, beforeEach } from 'node:test';
import { compile } from 'morgan';


describe("Habit API entry routes: ", () => {
    // cleanup db after each test 
    afterEach(async () => {
        await cleanupDB();
    });

    //POST:: entry 
    describe("POST : /api/entries/entry", () => {
        beforeEach(async () => {
            await cleanupDB();
        });
        // test creation 
        it("Should create and entry for a habit when authenticated", async () => {
            const { token, newUser } = await createTestUser();
            const { newHabit } = await createTestHabit(newUser.id);
            const entry_data = { habitId: newHabit.id, completion: 14, note: 'Sample test note' }
            const res = await request(app)
                .post('/api/entries/entry')
                .set('Authorization', `Bearer ${token}`)
                .send(entry_data)
                .expect(201);
        
            expect(res.body).toBeDefined();
            expect(res.body).toHaveProperty("message", 'Entry Creation Successful');
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toBeDefined();
        });

        // test unauthenticated creation 
        it("Should not allow unauthenticated user to create entry", async () => {
            const { token, newUser } = await createTestUser();
            const { newHabit } = await createTestHabit(newUser.id);
            const entry_data = { habitId: newHabit.id, completion: 14, note: 'Sample test note' }
            const res = await request(app)
                .post('/api/entries/entry')
                .send(entry_data)
                .expect(401);
        
            expect(res.body).toBeDefined();
            expect(res.body).toHaveProperty("message", 'Bad Request');
            expect(res.body).not.toHaveProperty("data");
        });

        // test invalid data creation 
        it("Should flag invalid data && note try to reach db with creation", async () => {
            const { token, newUser } = await createTestUser();
            const { newHabit } = await createTestHabit(newUser.id);
            const entry_data = { habitId: newHabit.id, note: 'Sample test note' }
            const res = await request(app)
                .post('/api/entries/entry')
                .set('Authorization', `Bearer ${token}`)
                .send(entry_data)
                .expect(400);
        
            expect(res.body).toBeDefined();
            expect(res.body).toHaveProperty("error", 'Invalid Data schema provided');
            expect(res.body).toHaveProperty("details");
        })
    });

    //PATCH:: entry
    describe("PATCH: /api/entries/entry/:id", () => {
        afterEach(async () => {
            await cleanupDB();
        })
        it("Should update existing entry using provided details", async () => {
        const { token, newUser } = await createTestUser();
        const { newHabit } = await createTestHabit(newUser.id);
        const { newEntry } = await createTestEntry(newHabit.id);
        const newData = {completion: 14, note:"Modified note"}

        const res = await request(app)
            .patch(`/api/entries/entry/${newEntry.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(newData)
            .expect(200)
        
        // assertions
        expect(res.body).toBeDefined();
        
        })
        
    })
})
