import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticate.ts";
import {
    createHabit, softDeleteHabit, hardDeleteHabit,restoreArchivedHabit,
    updateHabit, getHabits
} from "../controllers/habitController.ts";
import { validateBody, validateParams, validateQuery } from "../middlewares/validateData.ts";
import { createHabitSchema, paramSchema, querySchema, updateHabitSchema } from "../schemas/zodSchemas.ts";

const habitRouter = Router();
// authenticate all routes 
habitRouter.use(authenticateToken);

habitRouter.get('/', validateQuery(querySchema), getHabits)
habitRouter.post('/', validateBody(createHabitSchema), createHabit);
habitRouter.post('/restore/:id', validateParams(paramSchema), validateQuery(querySchema), restoreArchivedHabit)
habitRouter.patch('/:id', validateParams(paramSchema), validateBody(updateHabitSchema), updateHabit);
habitRouter.delete('/archive/:id', validateParams(paramSchema), softDeleteHabit);
habitRouter.delete('/hard/:id/', validateParams(paramSchema), validateQuery(querySchema), hardDeleteHabit);


/*updateTag*/
export { habitRouter };
export default habitRouter; 