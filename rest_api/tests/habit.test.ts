import request from "supertest";
import { app } from "./../src/server.ts";
import { describe, expect, it, afterEach, test } from "vitest";
import {
  cleanupDB,
  createTestUser,
  createTestTag,
    createTestHabit,
  createTestBulkHabit
} from "./helpers/testHelpers.ts";


describe("Habit Tests ", () => {
  describe("GET: /api/habits", () => {
    afterEach(async () => {
      await cleanupDB();
    });
      
    test("Should fetch and paginate user habits : ", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }
        const tagIds = [];
        for (let i = 0; i <= 10; i++){
            const { tag } = await createTestTag(newUser.id) ?? {}; 
            if (!tag) {
                throw new Error(`Failed to create test Tag: , ${i + 1}`); 
            }
            tagIds[i] = tag?.id
        }
      const { count } = await createTestBulkHabit(newUser.id, tagIds); //create fifty test tags
      const page = 1;
      const limit = 8;
      //fetch user tags and paginate
      const res = await request(app)
        .get(`/api/habits`)
        .query({ page: page, limit: limit })
        .set("authorization", `Bearer ${token}`)
        .expect(200);

      // make sure am getting the right results
      expect(res.body).toBeDefined();
      expect(res.body.limit).toBe(limit);
      expect(res.body.page).toBe(page);
      expect(res.body.total).toBe(count);
    });
    
    test("Unauthorized user should not fetch any habits: ", async () => {
           const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }
        const tagIds = [];
        for (let i = 0; i <= 4; i++){
            const { tag } = await createTestTag(newUser.id) ?? {}; 
            if (!tag) {
                throw new Error(`Failed to create test Tag: , ${i + 1}`); 
            }
            tagIds[i] = tag?.id
        }
      const { count } = await createTestBulkHabit(newUser.id, tagIds); //create fifty test tags
      const page = 4;
      const limit = 10;
      //fetch user tags and paginate
      const res = await request(app)
        .get(`/api/habits`)
        .query({ page: page, limit: limit })
        .expect(401);

      // make sure am getting the right results
      expect(res.body).toBeDefined();
      })
  });
  describe("POST: /api/habits", () => {
    afterEach(async () => {
      await cleanupDB();
    });

    test("User is able to create habit under valid tag", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }

      const habit_data = {
        userId: newUser.id,
        tagId: tag.id,
        title: "Daily Reading",
        description: "Read at least 100 pages of a non-fiction book.",
        frequency: "daily",
        unitsType:"COUNTS",
        targetValue: 100,
        uint: "pages",
      };
      const res = await request(app)
        .post("/api/habits")
        .set("authorization", `Bearer ${token}`)
        .send(habit_data)
        .expect(201);
      // validation
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "Habit created successfully");
    });

    test("Uanauthorised user cannot create habit", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }

      const habit_data = {
        userId: newUser.id,
        tagId: tag.id,
        title: "Daily Reading",
        description: "Read at least 100 pages of a non-fiction book.",
        frequency: "daily",
        targetValue: 100,
        uint: "pages",
      };
      const res = await request(app)
        .post("/api/habits")
        .send(habit_data)
        .expect(401);
      // validation
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty(
        "message",
        "Access Denied: No token provided",
      );
    });

    test("Should not create habit without tag_id", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }

      const habit_data = {
        title: "Daily Reading",
        description: "Read at least 100 pages of a non-fiction book.",
        frequency: "daily",
        targetValue: 100,
        uint: "pages",
      };
      const res = await request(app)
        .post("/api/habits")
        .set("authorization", `Bearer ${token}`)
        .send(habit_data)
        .expect(400);
      // validation
      expect(res.body).toBeDefined();
    });
  });

  describe("PATCH: /api/habits/:id", () => {
    afterEach(async () => {
      await cleanupDB();
    });

    test("User should be able to update habit: ", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error("Error: failed to create test habit");
      }
      const upadate_data = {
        title: "Daily Running",
        description: "Run at least 3 miles per day",
        frequency: "daily",
        targetValue: 100,
        uint: "days",
      };
      const res = await request(app)
        .patch(`/api/habits/${newHabit.id}`)
        .set("authorization", `Bearer ${token}`)
        .send(upadate_data)
        .expect(200);
      // validation
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "Habit updated successfully");
    });
    

    test("Unauthorized user cannot update habit", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error("Error: failed to create test habit");
      }
      const upadate_data = {
        title: "Daily Running",
        description: "Run at least 3 miles per day",
        frequency: "daily",
        targetValue: 100,
        uint: "days",
      };
      const res = await request(app)
        .patch(`/api/habits/${newHabit.id}`)
        .send(upadate_data)
        .expect(401);
      // validation
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty(
        "message",
        "Access Denied: No token provided",
      );
    });
  });

  describe("DELETE : /api/habits/:id", () => {
    afterEach(async () => {
      await cleanupDB();
    });

    test("User can get habit back after soft delete: ", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      const restore = 'true';
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error("Error: failed to create test habit");
      }

      const res = await request(app)
        .delete(`/api/habits/archive/${newHabit.id}`)
        .set("authorization", `Bearer ${token}`)
        .expect(200);

      const restoreRes = await request(app)
        .post(`/api/habits/restore/${newHabit.id}?restore=${restore}`)
        .set("authorization", `Bearer ${token}`)
        .expect(200);
      
      // validation
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "Habit archived successfully");
      expect(restoreRes.body).toHaveProperty('message', 'Habit restored successfully');
    });

    test("Hard delete of habit ", async () => {
       const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error("Error: failed to create test habit");
      }
      const hard = 'true';
      const permanent = 'true'; 

      const res = await request(app)
        .delete(`/api/habits/hard/${newHabit.id}?hard=${hard}&permanent=${permanent}`)
        .set("authorization", `Bearer ${token}`)
        .expect(200);

      // validation
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty('message','Habit deleted permanently');
    })

    test("Unauthorized user should be able to delete habit", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      // Safety check: Ensure the helper actually worked
      if (!token || !newUser) {
        throw new Error("Test setup failed: Token not generated");
      }
      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error("Test setup failed: tag not created");
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error("Error: failed to create test habit");
      }

      const res = await request(app)
        .delete(`/api/habits/${newHabit.id}`)
        .expect(401);

      // validation
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty(
        "message",
        "Access Denied: No token provided",
      );
    });
  });
});
