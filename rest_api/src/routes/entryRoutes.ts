import { createEntry, updateEntry, deleteEntry, getEntries } from "../controllers/entryController.ts";
import { Router } from 'express';
import { validateBody, validateParams, validateQuery } from "../middlewares/validateData.ts";
import { createEntrySchema } from "../types/zodSchemas.ts";
import { authenticateToken } from "../middlewares/authenticate.ts";


// router 
const entryRouter = Router();

// authentication middleware 
entryRouter.use(authenticateToken);

// routes
entryRouter.post('/entry', validateBody(createEntrySchema), createEntry);
entryRouter.patch('/entry/:id', validateParams(), validateBody(), updateEntry);
entryRouter.delete('/entry/:id', validateParams(), deleteEntry);
entryRouter.get("/", getEntries)


export { entryRouter }
export default entryRouter;