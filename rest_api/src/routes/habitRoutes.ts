import { Router } from 'express';
import { validateBody, validateParams } from '../middlewares/validateData.ts';
import { createHabbitSchema, updateHabitSchema, paramSchema } from '../types/zodSchemas.ts';
import { authenticateToken } from '../middlewares/authenticate.ts';
import { createHabit, updateHabit, deleteHabit,getHabits } from '../controllers/habitController.ts';


const habitRouter = Router();
//apply authentication to all habit routes
habitRouter.use(authenticateToken);


// create routes 
habitRouter.post('/', validateBody(createHabbitSchema), createHabit);
// fetch all user habbits
habitRouter.get('/', getHabits);
//update
habitRouter.patch('/:id',validateParams(paramSchema), validateBody(updateHabitSchema), updateHabit);
// delete habbit 
habitRouter.delete('/:id', validateParams(paramSchema), deleteHabit);


export { habitRouter };
export default habitRouter;