import { Router } from 'express';
import { userController } from './user.controller';
import { isAuthenticated, authorizeRoles } from '../../shared/auth.middleware';

const router = Router();

router.get('/me', isAuthenticated, userController.getMe.bind(userController));

router.put('/me', isAuthenticated, userController.updateMe.bind(userController));

router.post(
  '/coach',
  isAuthenticated,
  authorizeRoles('ADMIN'),
  userController.createCoach.bind(userController)
);

export default router;
