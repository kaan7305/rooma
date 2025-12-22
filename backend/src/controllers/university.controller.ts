import { Request, Response, NextFunction } from 'express';
import * as universityService from '../services/university.service';
import type { SearchUniversitiesInput } from '../validators/university.validator';

/**
 * GET /api/universities
 * Search universities with filters
 */
export const searchUniversities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: SearchUniversitiesInput = req.query as any;

    const result = await universityService.searchUniversities(filters);

    res.status(200).json({
      data: result.universities,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/universities/:id
 * Get university by ID with nearby properties
 */
export const getUniversityById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const university = await universityService.getUniversityById(id);

    res.status(200).json({
      data: university,
    });
  } catch (error) {
    next(error);
  }
};
