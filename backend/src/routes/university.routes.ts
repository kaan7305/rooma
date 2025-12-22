import { Router } from 'express';
import * as universityController from '../controllers/university.controller';
import { validate } from '../middleware/validation';
import { searchUniversitiesSchema } from '../validators/university.validator';

const router = Router();

/**
 * @route   GET /api/universities
 * @desc    Search/filter universities
 * @access  Public
 */
router.get('/', validate(searchUniversitiesSchema, 'query'), universityController.searchUniversities);

/**
 * @route   GET /api/universities/:id
 * @desc    Get university by ID with nearby properties
 * @access  Public
 */
router.get('/:id', universityController.getUniversityById);

export default router;
