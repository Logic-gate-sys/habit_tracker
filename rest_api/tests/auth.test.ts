import request from 'supertest'
import { app } from './../src/sever.ts'
import { describe, expect, it, afterEach } from 'vitest'
import { cleanup } from './helpers/testHelpers.ts'

// test auth registerations and login
describe("POST: /api/auth/signup && /api/auth/login", () => {
    afterEach(async() => {
        await cleanup()
    })
    //test valid signup and login flow
    it("Should signup user given valid details", async () => {
        const user = {
            username: 'smaple username',
            email: 'someoneexample@gmail.com',
            password: 'soe90503000305030030340lsldll'
        }
        const login_data = {
            email:'someoneexample@gmail.com',
            password:'soe90503000305030030340lsldll'
        }
        const signup_response = await request(app)
            .post('/api/auth/signup')
            .send(user)
            .expect(201)
        
        const login_response = await request(app)
            .post('/api/auth/login')
            .send(login_data)
            .expect(200)
        
        //sign up assertions
        expect(signup_response.body).toBeDefined()
        expect(signup_response.body).toHaveProperty("success", true);
        expect(signup_response.body).toHaveProperty("message", "User Signup Successful");
        expect(signup_response.body).toHaveProperty("token");
        expect(signup_response.body.user).toBeDefined();

        // login assertions
        expect(login_response.body).toBeDefined()
        expect(login_response.body).toHaveProperty("success", true);
        expect(login_response.body).toHaveProperty("user");
        expect(login_response.body).toHaveProperty("message", "Login Successful");
        expect(login_response.body).toHaveProperty("token");
        expect(login_response.body.user).toBeDefined();
    });
    
    // test invalid login
    it("Should not allow invalid login", async () => {
        const login_data = {
            email: 'someoneexample@gmail.com',
            password: 'soe90503000305030030340lsldll'
        }
        const login_response = await request(app)
            .post('/api/auth/login')
            .send(login_data)
            .expect(400)
        expect(login_response.body).toHaveProperty("error", "Invalid credentials");
        expect(login_response.body).toHaveProperty("message", "Failed to login");
    }); 

// Test invalid credentials
    it("Should return error when email or password is invalid", async () => {
        const user = {
            username: 'smaple username',
            email: 'someoneexample@gmail.com',
            password: 'soe90503000305030030340lsldll'
        }
        const invalid_email_data = {
            email: 'someample@gmail.com',
            password: 'soe90503000305030030340lsldll'
        }
        const invalid_password_data = {
            email: 'someoneexample@gmail.com',
            password: 'soe90503000305030030340kdljdkdll'
        }
        const signup_response = await request(app)
            .post('/api/auth/signup')
            .send(user)
            .expect(201)
        
        const invalid_email_login_response = await request(app)
            .post('/api/auth/login')
            .send(invalid_email_data)
            .expect(400)
        const invalid_password_login_response = await request(app)
            .post('/api/auth/login')
            .send(invalid_password_data)
            .expect(400)
        
        //sign up assertions
        expect(invalid_email_login_response.body).toBeDefined()
        expect(invalid_email_login_response.body).toHaveProperty("error", "Invalid credentials");
        expect(invalid_email_login_response.body).toHaveProperty("message", "Failed to login");

    
        expect(invalid_password_login_response.body).toBeDefined()
        expect(invalid_password_login_response.body).toHaveProperty("error", "Invalid credentials");
        expect(invalid_password_login_response.body).toHaveProperty("message", "Failed to login");
    });
})
