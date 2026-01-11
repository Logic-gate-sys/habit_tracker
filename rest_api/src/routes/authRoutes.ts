import { Router } from "express";
import { validateData } from "../middlewares/validateData";
import { signup , login} from "../controllers/authController";
import { createUserSchema, loginSchema } from "../types/zodSchemas";

const authRouter = Router();

authRouter.post('/auth/signup', validateData(createUserSchema), signup);
authRouter.post('/auth/login', validateData(loginSchema), login)