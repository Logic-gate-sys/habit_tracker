import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticate.ts";
import { validateBody, validateParams, validateQuery } from "../middlewares/validateData.ts";
import {paramSchema,querySchema,createLogsSchema , updateLogSchema} from "../schemas/zodSchemas.ts";
import { getLogs,createLog , updateLog, hardDeleteLog} from "../controllers/logController.ts";

const logRouter = Router();
// authenticate all routes 
logRouter.use(authenticateToken);

logRouter.get('/', validateQuery(querySchema), getLogs);
logRouter.post('/', validateBody(createLogsSchema),createLog );
logRouter.patch('/:id', validateParams(paramSchema), validateBody(updateLogSchema), updateLog);
logRouter.delete('/:id', validateParams(paramSchema), hardDeleteLog); 

/*updateTag*/
export { logRouter};
export default logRouter; 