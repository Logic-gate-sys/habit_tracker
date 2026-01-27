import request from "supertest";
import { app } from "./../src/sever.ts";
import { describe, expect, it, afterEach } from "vitest";
import { cleanup, createTestUser } from "./helpers/testHelpers.ts";
import { beforeEach } from "node:test";

// test auth registerations and login
describe("Signup && Login ", () => {
  describe("POST: /api/auth/signup", () => {
    // after each test 
    afterEach(async () => {
      await cleanup();
    });

    it("Should signup user given valid details", async () => {
      const user = {
        username: "smaple username",
        email: "someonmple@gmail.com",
        password: "soe90503000305030030340lsldll",
        firstname: "Logic",
        lastname: "Gate",
      };
      const res = await request(app)
        .post("/api/auth/signup")
        .send(user)
        .expect(201);

      //sign up assertions
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "User Signup Successful",
      );
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toBeDefined();
    });
  });

  // LOGIN TESTS 
  describe("POST: /api/auth/login", () => {
      // after each test
      afterEach(async () => {
        await cleanup();
      });

      // test invalid login
      it("Should not allow invalid login", async () => {
        const { token } = (await createTestUser()) ?? {};
        if (!token) {
          return;
        }
        const login_data = {
          email: "somexample@gmail.com",
          password: "soe90503000305030030340lsldll",
        };
        const res = await request(app)
          .post("/api/auth/login")
          .send(login_data)
          .expect(400);
        expect(res.body).toHaveProperty(
          "error",
          "Invalid credentials",
        );
        expect(res.body).toHaveProperty(
          "message",
          "Failed to login",
        );
      });

      // Test invalid login credentials
      it("Should return error when email or password is invalid", async () => {
        const user = {
          username: "smaple username",
          email: "someoneexample@gmail.com",
          password: "soe90503000305030030340lsldll",
        };
        const invalid_email_data = {
          email: "someample@gmail.com",
          password: "soe90503000305030030340lsldll",
        };
        const invalid_password_data = {
          email: "someoneexample@gmail.com",
          password: "soe90503000305030030340kdljdkdll",
        };
        const signup_response = await request(app)
          .post("/api/auth/signup")
          .send(user)
          .expect(201);

        const invalid_email_login_response = await request(app)
          .post("/api/auth/login")
          .send(invalid_email_data)
          .expect(400);
        const invalid_password_login_response = await request(app)
          .post("/api/auth/login")
          .send(invalid_password_data)
          .expect(400);

        //sign up assertions
        expect(invalid_email_login_response.body).toBeDefined();
        expect(invalid_email_login_response.body).toHaveProperty(
          "error",
          "Invalid credentials",
        );
        expect(invalid_email_login_response.body).toHaveProperty(
          "message",
          "Failed to login",
        );

        expect(invalid_password_login_response.body).toBeDefined();
        expect(invalid_password_login_response.body).toHaveProperty(
          "error",
          "Invalid credentials",
        );
        expect(invalid_password_login_response.body).toHaveProperty(
          "message",
          "Failed to login",
        );
      });
    });
});
