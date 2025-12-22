import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Middleware factory to validate request data against Zod schema
 * @param schema - Zod schema to validate against
 * @param source - Which part of request to validate ('body', 'query', 'params')
 */
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      // Parse and store the transformed result back to the request
      const validated = schema.parse(data);

      // For body, we can replace it directly. For query/params which are read-only,
      // we need to replace the entire object with a new object that has the validated values
      if (source === 'body') {
        req.body = validated;
      } else {
        // Create a new request object with validated query/params
        Object.defineProperty(req, source, {
          value: validated,
          writable: true,
          configurable: true,
        });
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(
          new ValidationError('Validation failed', errors)
        );
      } else {
        next(error);
      }
    }
  };
};
