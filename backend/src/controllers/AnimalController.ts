import { animalService } from '../services/AnimalService';
import { sendSuccess } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { getRouteParam } from '../utils/requestParams';

export const listAnimals = catchAsync(async (req, res) => {
  const result = await animalService.list(req.query);
  return sendSuccess(res, 'Animals retrieved', result.items, 200, result.meta);
});

export const getAnimal = catchAsync(async (req, res) => {
  const animal = await animalService.getBySlug(getRouteParam(req, 'slug'));
  return sendSuccess(res, 'Animal retrieved', animal);
});

export const createAnimal = catchAsync(async (req, res) => {
  const animal = await animalService.create(req.body);
  return sendSuccess(res, 'Animal created', animal, 201);
});

export const updateAnimal = catchAsync(async (req, res) => {
  const animal = await animalService.update(getRouteParam(req, 'id'), req.body);
  return sendSuccess(res, 'Animal updated', animal);
});

export const deleteAnimal = catchAsync(async (req, res) => {
  const animal = await animalService.remove(getRouteParam(req, 'id'));
  return sendSuccess(res, 'Animal removed', animal);
});

export const reserveAnimal = catchAsync(async (req, res) => {
  const animal = await animalService.reserve(getRouteParam(req, 'id'));
  return sendSuccess(res, 'Animal reserved', animal);
});
