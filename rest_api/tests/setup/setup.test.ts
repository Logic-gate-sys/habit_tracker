import { createTestUser, cleanup } from './../helpers/testHelpers.ts'

describe("DB Setup", () => {
    it("should connect to db and create user", async () => {
        const { newUser, token } = await createTestUser();
        //expection 
        expect(newUser).toBeDefined();
        expect(token).toBeDefined()
        // cleanup 
        await cleanup();
    });
});