import express from 'express';
import { getUsers, assignService } from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', authenticate, getUsers);
router.post('/assign-service/:serviceId', authenticate, assignService);

export default router;
