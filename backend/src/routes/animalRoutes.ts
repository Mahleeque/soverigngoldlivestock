import { Router } from 'express';
import {
  createAnimal,
  deleteAnimal,
  getAnimal,
  listAnimals,
  reserveAnimal,
  updateAnimal
} from '../controllers/AnimalController';
import { UserRole } from '../constants/enums';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { animalIdParam, animalSlugParam, createAnimalValidator } from '../validators/animalValidators';

export const animalRoutes = Router();

animalRoutes.get('/', listAnimals);
animalRoutes.get('/:slug', animalSlugParam, validate, getAnimal);
animalRoutes.post('/', authenticate, authorize(UserRole.Admin, UserRole.Sales), createAnimalValidator, validate, createAnimal);
animalRoutes.patch('/:id', authenticate, authorize(UserRole.Admin, UserRole.Sales), animalIdParam, validate, updateAnimal);
animalRoutes.delete(
  '/:id',
  authenticate,
  authorize(UserRole.Admin, UserRole.Sales),
  animalIdParam,
  validate,
  deleteAnimal
);
animalRoutes.post('/:id/reserve', authenticate, animalIdParam, validate, reserveAnimal);
