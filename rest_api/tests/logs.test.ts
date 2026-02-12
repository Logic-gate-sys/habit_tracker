import request from "supertest";
import { app } from "./../src/server.ts";
import { describe, expect, it, afterEach, test, afterAll } from "vitest";
import {
  cleanupDB,
  createTestUser,
  createTestTag,
  createTestHabit,
  createTestBulkLogs,
  createTestLog,
} from "./helpers/testHelpers.ts";
import { after } from "node:test";

describe("Logs ", () => {
  describe("GET:  /api/logs", () => {
    afterEach(async () => {
      await cleanupDB();
    });

    test("Should get all logs related to a habit: ", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }
      const habitIds = [];
      for (let i = 0; i <= 10; i++) {
        const { tag } = (await createTestTag(newUser.id)) ?? {};
        if (!tag) {
          throw new Error(`Failed to create test tag: ${i}`);
        }
        const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
        if (!newHabit) {
          throw new Error(`Failed to create test Tag: , ${i + 1}`);
        }
        habitIds[i] = newHabit?.id;
      }
      const { count } = await createTestBulkLogs(habitIds[1]); //create fifty test tags
      const page = 2;
      const limit = 8;
      //fetch user tags and paginate
      const res = await request(app)
        .get(`/api/logs`)
        .query({ page: page, limit: limit })
        .set("authorization", `Bearer ${token}`)
        .expect(200);
      // make sure am getting the right results
      expect(res.body).toBeDefined();
      expect(res.body.limit).toBe(limit);
      expect(res.body.page).toBe(page);
      //   expect(res.body.total).toBe(count);
    });

    test("Unauthenticated user should not fetch logs", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }
      const habitIds = [];
      for (let i = 0; i <= 10; i++) {
        const { tag } = (await createTestTag(newUser.id)) ?? {};
        if (!tag) {
          throw new Error(`Failed to create test tag: ${i}`);
        }
        const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
        if (!newHabit) {
          throw new Error(`Failed to create test Tag: , ${i + 1}`);
        }
        habitIds[i] = newHabit?.id;
      }
      const { count } = await createTestBulkLogs(habitIds[1]); //create fifty test tags
      const page = 2;
      const limit = 8;
      //fetch user tags and paginate
      const res = await request(app)
        .get(`/api/logs`)
        .query({ page: page, limit: limit })
        .expect(401);
      // make sure am getting the right results
      expect(res.body).toHaveProperty(
        "message",
        "Access Denied: No token provided",
      );
    });
  });

  describe("POST: /api/logs", () => {
    afterEach(async () => {
      await cleanupDB();
    });
    test("User should be able to create log for habit", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }

      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error(`Failed to create test tag `);
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error(`Failed to create test Tag`);
      }

      const logs_data = {
        habitId: newHabit.id,
        value: "Made some sauges",
        note: "I love what I did today,I should to more of this often",
      };
      //fetch user tags and paginate
      const res = await request(app)
        .post(`/api/logs`)
        .set("authorization", `Bearer ${token}`)
        .send(logs_data)
        .expect(201);

      // make sure am getting the right results
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("success", true);
      //   expect(res.body.total).toBe(count);
    });

    test("Unauthorised user cannot create log ", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }

      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error(`Failed to create test tag `);
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error(`Failed to create test Tag`);
      }

      const logs_data = {
        habitId: newHabit.id,
        value: "Made some sauges",
        note: "I love what I did today,I should to more of this often",
      };
      //fetch user tags and paginate
      const res = await request(app)
        .post(`/api/logs`)
        .send(logs_data)
        .expect(401);

      // make sure am getting the right results
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty(
        "message",
        "Access Denied: No token provided",
      );
    });
  });

  describe("PATCH: /api/logs", () => {
    afterEach(async () => {
      await cleanupDB();
    });

    test("User can update their log", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }

      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error(`Failed to create test tag `);
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error(`Failed to create test Tag`);
      }
      const { newLog } = await createTestLog(newHabit.id);
      const updateData = {
        value: "Made some sandwitches rather",
        note: "I really enjoyed the work I did today,I should to more of this often",
      };
      const res = await request(app)
        .patch(`/api/logs/${newLog.id}`)
        .set("authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      //further verification
      expect(res.body).toHaveProperty("message", "Log updated successfully");
    });

    test("Unauthorised user cannot update tag: ", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }

      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error(`Failed to create test tag `);
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error(`Failed to create test Tag`);
      }
      const { newLog } = await createTestLog(newHabit.id);
      const updateData = {
        value: "Made some sandwitches rather",
        note: "I really enjoyed the work I did today,I should to more of this often",
      };
      const res = await request(app)
        .patch(`/api/logs/${newLog.id}`)
        .send(updateData)
        .expect(401);

      //further verification
      expect(res.body).toHaveProperty(
        "message",
        "Access Denied: No token provided",
      );
    });
  });

  describe("DELETE: /api/logs/:id", () => {
    afterEach(async () => {
      await cleanupDB();
    });

    test("User should be able to delete a log", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }

      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error(`Failed to create test tag `);
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error(`Failed to create test Tag`);
      }
      const { newLog } = await createTestLog(newHabit.id);
      const res = await request(app)
        .delete(`/api/logs/${newLog.id}`)
        .set("authorization", `Bearer ${token}`)
        .expect(200);

      //further verification
      expect(res.body).toHaveProperty("message", "Log deleted successfully");
    });

    test("Unauthorised user cannot delete log", async () => {
      const { token, newUser } = (await createTestUser()) ?? {};
      if (!token || !newUser) {
        throw new Error("Failed to create test user");
      }

      const { tag } = (await createTestTag(newUser.id)) ?? {};
      if (!tag) {
        throw new Error(`Failed to create test tag `);
      }
      const { newHabit } = (await createTestHabit(newUser.id, tag.id)) ?? {};
      if (!newHabit) {
        throw new Error(`Failed to create test Tag`);
      }
      const { newLog } = await createTestLog(newHabit.id);
      const res = await request(app)
        .delete(`/api/logs/${newLog.id}`)
        .expect(401);

      //further verification
      expect(res.body).toHaveProperty("message",
        "Access Denied: No token provided");
    });
  });
});
