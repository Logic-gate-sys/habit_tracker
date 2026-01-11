import { Router } from 'express';
import { validateData } from '../middlewares/validateData.ts';
import { createHabbitSchema } from '../types/zodSchemas.ts';
import { z } from 'zod'

const habbitRoutes = Router();


// create routes 
habbitRoutes.post('/', validateData(createHabbitSchema),  (req, res) => {
   return  res.status(200).json({ message: " All habbits" });
});



export default habbitRoutes ;