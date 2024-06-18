import express from 'express';
import { getMechanicProfile, respondToService, completeService, getMechanicEarnings } from '../controllers/mechanicController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authenticate, getMechanicProfile);
router.post('/respond-service', authenticate, respondToService);
router.post('/service-complete', authenticate, completeService);
router.get('/earnings', authenticate, getMechanicEarnings);

export default router;

