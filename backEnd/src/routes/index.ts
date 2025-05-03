import { Router } from 'express';
import taskRoutes from './task.routes';
import userRoutes from './user.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use('/users', userRoutes);

router.use('/tasks', authMiddleware, taskRoutes);

export default router;
