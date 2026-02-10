import request from "supertest";
import { app } from "./../src/server.ts";
import { describe, expect, it, afterEach , test} from "vitest";
import { cleanupDB, createTestUser} from "./helpers/testHelpers.ts";

// test auth registerations and login
describe("Signup && Login ", () => {
  describe("POST: /api/auth/signup", () => {
    // after each test
    afterEach(async () => {
      await cleanupDB();
    });

    test("User signup successfully given valid details", async () => {
      const user = {
        userName: "milky-soros",
        email: "someonmple@gmail.com",
        password: "soe90503000305030030340lsldll",
        firstName: "John",
        middleName:"Culema",
        lastName: "Doe",
      };
      const res = await request(app)
        .post("/api/auth/signup")
        .send(user)
        .expect(201);

      //sign up assertions
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "User Signup Successful");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toBeDefined();
    });
    
    test("User cannot signup with invalid details: ", async () => {
      const user_without_valid_password = {
        userName: "milky-soros",
        email: "someonmple@gmail.com",
        password: "soe90503",
        firstName: "John",
        middleName:"Culema",
        lastName: "Doe",
      };
      const res = await request(app)
        .post("/api/auth/signup")
        .send(user_without_valid_password)
        .expect(400)
      
      expect(res.body).toBeDefined()
      expect(res.body).toHaveProperty("error","Invalid Data schema provided")
    })
  });

  // LOGIN TESTS
  describe("POST: /api/auth/login", () => {
    // after each test
    afterEach(async () => {
      await cleanupDB();
    });

    // test invalid login
    test("User is able to login: ", async () => {
      const { rawpassword,email } = (await createTestUser()) ?? {};
      const login_data = {
        email: email,
        password: rawpassword,
      };
      const res = await request(app)
        .post("/api/auth/login")
        .send(login_data)
        .expect(200);
      
       expect(res.body).toHaveProperty("token")
    });

    // Test invalid login credentials
    test("Unregistered user cannot login : ", async () => {
      const { token, rawpassword } = (await createTestUser()) ?? {};
      const invalid_email_data = {
        email: "someoneexample@gmail.com",
        password: "soe90503000305030030340lsldll",
      };
      const invalid_password_data = {
        email: "someoneexample@gmail.com",
        password: "soe90503000305030030340kdljdkdll",
      };
      const invalid_email_login_response = await request(app)
        .post("/api/auth/login")
        .send(invalid_email_data)
        .expect(400);

      const invalid_password_login_response = await request(app)
        .post("/api/auth/login")
        .send(invalid_password_data)
        .expect(400);

      //assertions 
      expect(invalid_email_login_response.body).toBeDefined();
      expect(invalid_email_login_response.body).toHaveProperty( "error", "Invalid User");
      expect(invalid_email_login_response.body).toHaveProperty( "message","Please consider signing up" );

      expect(invalid_password_login_response.body).toBeDefined();
      expect(invalid_password_login_response.body).toHaveProperty( "error", "Invalid User");
      expect(invalid_password_login_response.body).toHaveProperty("message", "Please consider signing up");
    });
  });
});
