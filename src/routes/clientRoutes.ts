import express from 'express';
import { getClientProfile, createServiceRequest, getServiceHistory, makePayment } from '../controllers/clientController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authenticate, getClientProfile);
router.post('/service-request', authenticate, createServiceRequest);
router.get('/service-history', authenticate, getServiceHistory);
router.post('/makePayment',authenticate, makePayment)

export default router;
