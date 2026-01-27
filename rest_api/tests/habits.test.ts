import { app } from "./../src/sever.ts";
import request from "supertest";
import { cleanup, createTestHabit } from "./helpers/testHelpers.ts";
import { describe, it, test, afterEach, expect } from "vitest";
import { HabitFrequency } from "../src/config/generated/prisma/enums.ts";
import { createTestUser } from "./helpers/testHelpers.ts";

describe("Habits endpoint", () => {
  describe("POST: /api/habits  creating habbits", () => {
    // cleanup DB after each test
    afterEach(async () => {
      await cleanup();
    });

    it("Should create habit given valid details when authorised", async () => {
      const freq = ["DAILY", "WEEKLY", "MONTHLY"];
      const colors = ["red", "gold", "green", "#ffff", "#fdff", "#dfff"];
      const habitdata = {
        name: `Example habit-${Math.floor(Math.random() * 100)}`,
        description: "Sample description",
        HabitFrequency: freq[Math.random() * 4],
        targetCount: Math.floor(Math.random() * 400),
        tagName: `Random-${Math.random() * 10}`,
        color: colors[Math.floor(Math.random() * 7)],
      };
      //sample user data
      const { token } = await createTestUser() ?? {};
      if (!token) {
        return;
      }

      const res = await request(app)
        .post("/api/habits")
        .set("Authorization", `Bearer ${token}`)
        .send(habitdata)
        .expect(201);
      // assertions
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "Habit Creation Successful");
    });
  });

  // get all user habbits
  describe("GET: /api/habits  get all user habbits", () => {
    afterEach(async () => {
      await cleanup();
    });

    test("All user habits are retrieved given user bearer token", async () => {
      //user token
      const { token } = await createTestUser() ?? {}; // null assertion 
      if (!token) {
        return;
      }
      const res = await request(app)
        .get("/api/habits")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      //asertions
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "No habits found");
    });

    it("Should not allow unauthorised user to retrieve habits", async () => {
      const res = await request(app).get("/api/habits").expect(401);
      //assertions
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "Bad Request");
    });
  });

  // update 
  describe("PATCH: /api/habits/:id", () => {
    afterEach(async () => {
      await cleanup(); // clean db 
    })
    it("Should update habit give valid details and token", async () => {
      const { newUser, token } = await createTestUser() ?? {};
      const { newHabit } = await createTestHabit(newUser?.id ?? "") ?? {};
      if (!token || !newHabit) {
        return;
      }

      const freq = ["DAILY", "WEEKLY", "MONTHLY"];
      const colors = ["red", "gold", "green", "#ffff", "#fdff", "#dfff"];
      const habitdata = {
        name: `Example habit-${Math.floor(Math.random() * 100)}`,
        description: "Sample description",
        frequency: freq[Math.random() * 4],
        target_count: Math.floor(Math.random() * 400),
        tag_name: `Random-${Math.random() * 10}`,
        color: colors[Math.floor(Math.random() * 7)],
      };
      // 
      const res = await request(app)
        .patch(`/api/habits/:${newHabit.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(habitdata)
        .expect(200)
      
      //assertions
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "habit updated successfully")
    })
  })
});
