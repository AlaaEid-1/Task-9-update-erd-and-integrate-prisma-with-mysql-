import { Router } from 'express';
import { authorizeRoles, isAuthenticated } from '../../shared/auth.middleware';
import { courseController } from './courses.controller';
import { uploadSingle } from '../../config/multer.config';


const router = Router();

router.get('/', courseController.getAll.bind(courseController));
router.get('/:id', courseController.getById.bind(courseController));

router.post(
  '/',
  isAuthenticated,
  authorizeRoles('ADMIN', 'COACH'),
  uploadSingle('image'),
  courseController.create.bind(courseController)
);

router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('ADMIN', 'COACH'),
  uploadSingle('image'),
  courseController.update.bind(courseController)
);

router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles('ADMIN', 'COACH'),
  courseController.delete.bind(courseController)
);

export default router;
