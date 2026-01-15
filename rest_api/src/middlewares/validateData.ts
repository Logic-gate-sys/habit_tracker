import type { Request, Response, NextFunction } from "express";
import z, { ZodError, ZodType } from "zod";

// data validation middleware
export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      // next function
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Invalid Data schema provided",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      // if it's not zod error , bass error to next function
      next("error");
    }
  };
};


export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate params
      schema.parse(req.params); 
      // move on to next middleware or function 
      next(); 
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid Params',
          details: err.issues.map(e => ({
            field: e.path.join("."),
            message: e.message
          }))
        })
      }
      // next error 
      next("Error");
    }
  }
}

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      //next function
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Invalid Queries",
          details: error.issues.map(err => ({
            fields: err.path.join("."),
            message: err.message
          }))
          })
      }
      // if not zod error throw to next function
      next("Error");
      }
  }
}