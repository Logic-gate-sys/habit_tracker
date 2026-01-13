import { Router } from "express";
import { validateBody } from "../middlewares/validateData.ts";
import { signup , login} from "../controllers/authController.ts";
import { createUserSchema, loginSchema } from "../types/zodSchemas.ts";

const authRouter = Router();

authRouter.post('/signup', validateBody(createUserSchema), signup);
authRouter.post('/login', validateBody(loginSchema), login);


export { authRouter };
export default authRouter;