"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Ruta para registrar un usuario
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.login);
exports.default = router;
// import express from 'express';
// import { login, register } from '../controllers/authController';
// const router = express.Router();
// router.post('/register', register);
// router.post('/login', login);
// export default router;
