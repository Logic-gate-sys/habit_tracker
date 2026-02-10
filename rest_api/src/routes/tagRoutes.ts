import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticate.ts";
import { createTag,updateTag,getTags, deleteTag } from "../controllers/tagController.ts";
import { validateBody, validateParams, validateQuery } from "../middlewares/validateData.ts";
import { createTagSchema, paramSchema, updateTagSchema, querySchema } from "../schemas/zodSchemas.ts";

const tagRouter = Router();
// authenticate all routes 
tagRouter.use(authenticateToken);

tagRouter.get('/', validateQuery(querySchema), getTags);
tagRouter.post('/', validateBody(createTagSchema), createTag);
tagRouter.patch('/:id', validateParams(paramSchema), validateBody(updateTagSchema), updateTag);
tagRouter.delete('/:id', validateParams(paramSchema), deleteTag); 

/*updateTag*/
export { tagRouter };
export default tagRouter; 