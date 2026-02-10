import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticate.ts";
import { createHabit, deleteHabit, updateHabit,getHabits } from "../controllers/habitController.ts";
import { validateBody, validateParams, validateQuery } from "../middlewares/validateData.ts";
import { createHabitSchema, paramSchema, querySchema, updateHabitSchema } from "../schemas/zodSchemas.ts";

const habitRouter = Router();
// authenticate all routes 
habitRouter.use(authenticateToken);

habitRouter.get('/', validateQuery(querySchema), getHabits)
habitRouter.post('/', validateBody(createHabitSchema), createHabit)
habitRouter.patch('/:id', validateParams(paramSchema), validateBody(updateHabitSchema), updateHabit);
habitRouter.delete('/:id', validateParams(paramSchema), deleteHabit);

/*updateTag*/
export { habitRouter };
export default habitRouter; 