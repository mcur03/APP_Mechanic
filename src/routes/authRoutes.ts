// src/routes/authRoutes.ts
import { Router } from 'express';
import { login, registerUser } from '../controllers/authController';

const router = Router();

// Ruta para registrar un usuario
router.post('/register', registerUser);
router.post('/login', login);


export default router;









// import express from 'express';
// import { login, register } from '../controllers/authController';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// export default router;
