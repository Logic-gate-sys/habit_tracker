import { createTestUser, cleanup } from './../helpers/testHelpers.ts'


// create and clean up to shwo db setup works
describe("Verifying Database set up with globalstep.ts: ", () => {
    //it is the same as test 
    it("Should connect to DB and create user given valid data", async () => {
        const { newUser, token } = await createTestUser();
        //expection 
        expect(newUser).toBeDefined();
        expect(token).toBeDefined();

        // cleanup 
        await cleanup();
    });
});