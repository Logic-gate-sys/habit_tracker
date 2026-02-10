import request from 'supertest';
import {app} from '../src/server.ts'; // Removed .ts and fixed likely typo
import { cleanupDB, createTestUser, createTestTag, createTestTagsBulk } from './helpers/testHelpers.ts'; 
import { describe, test, afterEach, expect } from 'vitest';

describe('Tags Test', () => {
    //GET
    describe('GET: /api/tags?page=num&limit=num', () => {
        afterEach(async () => {
            await cleanupDB();
        });
     
        test('User should be able to fetch their tags paginated: ', async () => {
            const { token, newUser } = await createTestUser() ?? {};
            if (!token || !newUser) {
                throw new Error('Failed to create test user');
            }
            const { count } = await createTestTagsBulk(newUser.id, 50); //create fifty test tags 
            const page = 3 ;
            const limit = 10;
            //fetch user tags and paginate
            const res = await request(app)
                .get(`/api/tags`)
                .query({ page: page, limit: limit })
                .set('authorization', `Bearer ${token}`)
                .expect(200)
            
            // make sure am getting the right results
            expect(res.body).toBeDefined();
            expect(res.body.limit).toBe(limit);
            expect(res.body.page).toBe(page);
            expect(res.body.total).toBe(count)
        });

        test('Unauthorised user should not be able to get tags: ', async () => {
            const { token, newUser } = await createTestUser() ?? {};
            if (!token || !newUser) {
                throw new Error('Failed to create test user');
            }
            const tagList = [];
            for (let i = 0; i < 20; i++) {
                const { tag } = await createTestTag(newUser.id) ?? {};
                tagList[i] = tag;
            }
            const page = 1;
            const limit = 7;

            //fetch user tags and paginate
            const res = await request(app)
                .get(`/api/tags`)
                .query({ page: page, limit: limit })
                .expect(401)
            // make sure am getting the right results
            expect(res.body).toBeDefined();
            expect(res.body).toHaveProperty('message','Access Denied: No token provided');
        })
       
    });

    //POST
    describe('POST : /api/tags', () => {
        afterEach(async () => {
            await cleanupDB();
        });

        test('User is able to create tags when authenticated', async () => {
            const {token} = await createTestUser()?? {};
            // Safety check: Ensure the helper actually worked
            if ( !token) {
                throw new Error("Test setup failed: Token not generated");
            }
            const tag_data = {
                name: 'Diet & Health',
                color: '#ffd8'
            };
            const res = await request(app)
                .post('/api/tags')
                .set('authorization',`Bearer ${token}`)
                .send(tag_data)
                .expect(201);
            
            // Good practice: also check the body
            expect(res.body).toBeDefined();
            expect(res.body).toHaveProperty('message','Tag created successfull')
        });

        test('Unauthenticated user cannot create tag', async () => {
            const tag_data = {
                name: 'Diet & Health',
                color: '#ffd8'
            };
            const res = await request(app)
                .post('/api/tags')
                .send(tag_data)
                .expect(401)
            
            // Good practice: also check the body
            expect(res.body).toHaveProperty('message', 'Access Denied: No token provided')
        });

        test('Cannot create tag with invalid name or color', async () => {
            const {token} = await createTestUser()?? {};
            // Safety check: Ensure the helper actually worked
            if ( !token) {
                throw new Error('Test setup failed: Token not generated');
            }
            const tag_data = {
                name: 'Diet & Health',
                color: '#'
            };
            const res = await request(app)
                .post('/api/tags')
                .set('authorization',`Bearer ${token}`)
                .send(tag_data)
                .expect(400);
            
            // vaid
            expect(res.body).toHaveProperty('error','Invalid Data schema provided')
        })
    });
    
    //PATCH
    describe('PATCH: /api/tags/:id', () => {
        afterEach(async () => {
            await cleanupDB();
        });

        test('User is able to update tag: ', async () => {
            const { token, newUser } = await createTestUser() ?? {};
            // Safety check: Ensure the helper actually worked
            if (!token || !newUser) {
                throw new Error('Test setup failed: Token not generated');
            }
            const { tag } = await createTestTag(newUser.id) ?? {};
            if (!tag) {
                throw new Error('Test setup failed: tag not created');
            }
            const updateData = {
                name: 'Science',
                color: '#ffd8'
            };
            const res = await request(app)
                .patch(`/api/tags/${tag.id}`)
                .set('authorization', `Bearer ${token}`)
                .send(updateData)
                .expect(200);
            
            // ensure 
            expect(res.body).toBeDefined();
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('data')
        
        });

        test('Unauthenticated user Should not be able to update: ', async () => {
            const { token, newUser } = await createTestUser() ?? {};
            // Safety check: Ensure the helper actually worked
            if (!token || !newUser) {
                throw new Error('Test setup failed: Token not generated');
            }
            const { tag } = await createTestTag(newUser.id) ?? {};
            if (!tag) {
                throw new Error('Test setup failed: tag not created');
            }
            const tag_data = {
                name: 'Health',
                color: '#ffd8'
            };
            const res = await request(app)
                .patch(`/api/tags/${tag.id}`)
                .send(tag_data)
                .expect(401);
            
            expect(res.body).toHaveProperty('message', 'Access Denied: No token provided')
        });
    });

    //DELETE
    describe('DELETE: /api/tags/:id', () => {
        afterEach(async () => {
            await cleanupDB();
        });
        
        test('User should be able to delete tag', async () => {
            const { token, newUser } = await createTestUser() ?? {};
            // Safety check: Ensure the helper actually worked
            if (!token || !newUser) {
                throw new Error('Test setup failed: Token not generated');
            }
            const { tag } = await createTestTag(newUser.id) ?? {};
            if (!tag) {
                throw new Error('Test setup failed: tag not created');
            }
            const res = await request(app)
                .delete(`/api/tags/${tag.id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
            
            //Validate
            expect(res.body).toBeDefined();
        })
    })
});