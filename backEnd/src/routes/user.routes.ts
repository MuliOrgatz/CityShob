import { Router } from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logoutUser);
router.post('/create-user', createUser);

export default router;
