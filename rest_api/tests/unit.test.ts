import { is } from 'zod/v4/locales';
import { generateToken, verifyToken, type JWT_Payload } from './../src/utils/jwt.ts'
import { hashPassword, verifyPassword } from './../src/utils/passwords.ts'
import { describe, expect, it, test, afterEach } from 'vitest';
import { execSync } from 'child_process';

describe("JWT functionality test", () => {
    // clear console before each test
    execSync("clear", { stdio: 'inherit', cwd: process.cwd() });
    test("JWT Function generates and verifies token: ", async () => {
        const data = { id: 'someId', username: 'testuser', email: 'testuser@gmail.com' } as unknown as JWT_Payload
        const token = await generateToken(data);
        const {payload} = await verifyToken(token)?? {};

        // assertions
        expect(payload).toBeDefined();
        expect(payload).toHaveProperty("id");
    });

    test("Function rejects invalid token: ", async () => {
        const data = { id: 'someId', username: 'testuser', email: 'testuser@gmail.com' } as unknown as JWT_Payload
        const token = await generateToken(data);
        console.log("Token: ", token)
        const modifiedToken = " eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InNvbWVJZCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3R1c2VyQGdtYWlsLmNvbSIsImlhdCI6MTc2ODM4NDE0MywiZXhwIjoxNzY4OTg4OTQzfQ.MZglBWOeEpxcbv4EhHq9PcSt0QVanpX5Vh195rhzsQw";
       
        // asert
       await expect(verifyToken(modifiedToken)).rejects.toHaveProperty("message", "signature verification failed")
    })
});


describe("Password hashing & verification", () => {
    test("Function able to validate password: ", async () => {
        const rawPassword = 'eorodlfeor00w0r';
        const hashed_password = await hashPassword(rawPassword);
        const isvalid = await verifyPassword(rawPassword, hashed_password);
        
        // assertions
        expect(isvalid).toBeTruthy()
        expect(() => hashPassword(rawPassword)).not.toThrow();
    });

    test("Function does not validate wrong password: ", async () => {
        const rawPassword = 'se0r0e0r0e0r0r0er';
        const hashed_password = await hashPassword(rawPassword);

        await expect( verifyPassword("newpaosoeroeord", hashed_password)).resolves.not.toBeTruthy();

    })
})
