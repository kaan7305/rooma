import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { ZodError } from 'zod';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const anyErr = err as Error & {
    statusCode?: number;
    errors?: unknown;
    code?: string;
  };

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Validation failed',
      details: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err instanceof Error && err.name === 'ValidationError' && { details: (err as any).errors }),
    });
    return;
  }

  // Fallback for runtime class-mismatch cases where ApiError instanceof checks fail
  if (typeof anyErr.statusCode === 'number' && anyErr.statusCode >= 400 && anyErr.statusCode < 600) {
    res.status(anyErr.statusCode).json({
      error: err.message,
      ...(err.name === 'ValidationError' && { details: anyErr.errors }),
    });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: err.message || 'Unauthorized' });
    return;
  }

  if (err.name === 'ForbiddenError') {
    res.status(403).json({ error: err.message || 'Forbidden' });
    return;
  }

  if (err.name === 'NotFoundError') {
    res.status(404).json({ error: err.message || 'Not Found' });
    return;
  }

  // Handle Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;

    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        error: 'A record with this value already exists',
        field: prismaError.meta?.target?.[0],
      });
      return;
    }

    // Foreign key constraint violation
    if (prismaError.code === 'P2003') {
      res.status(400).json({
        error: 'Invalid reference to related record',
      });
      return;
    }

    // Record not found
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        error: 'Record not found',
      });
      return;
    }
  }

  // Log error for debugging
  console.error('Error:', err);

  // Default to 500 Internal Server Error
  res.status(500).json({
    error: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack
    }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
};
