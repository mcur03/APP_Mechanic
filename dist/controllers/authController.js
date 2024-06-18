"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const clientModel_1 = require("../models/clientModel");
const mechanicModel_1 = require("../models/mechanicModel");
const db_1 = __importDefault(require("../db"));
const JWT_SECRET = 'secretkey'; // Cambiar a una variable de entorno en producción
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, email, role, phone, address, specialties, availability } = req.body;
        if (!username || !password || !email || !role) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        if (role === 'client' && (!phone || !address)) {
            return res.status(400).json({ error: 'Teléfono y dirección son obligatorios para clientes' });
        }
        if (role === 'mechanic' && (!phone || !specialties)) {
            return res.status(400).json({ error: 'Teléfono y especialidades son obligatorios para mecánicos' });
        }
        try {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield db_1.default.getConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield connection.beginTransaction();
                    const userId = yield (0, userModel_1.createUser)({
                        username,
                        password: hashedPassword,
                        email,
                        role
                    });
                    if (role === 'client') {
                        yield (0, clientModel_1.createClient)({ userId, phone, address });
                    }
                    else if (role === 'mechanic') {
                        yield (0, mechanicModel_1.createMechanic)({
                            userId,
                            phone,
                            specialties,
                            availability: availability || 'yes'
                        });
                    }
                    yield connection.commit();
                    res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
                }
                catch (err) {
                    yield connection.rollback();
                    res.status(500).json({ error: err + '500 - 1' });
                }
                finally {
                    connection.release();
                }
            }));
        }
        catch (error) {
            res.status(500).json({ error: error + '500 - 2' });
        }
    });
}
exports.registerUser = registerUser;
;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = rows[0];
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.login = login;
// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import pool from '../db';
// const JWT_SECRET = 'secretkey'; // Cambiar a una variable de entorno en producción
// export const register = async (req: Request, res: Response) => {
//     const { username, password, email, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//     const [result] = await pool.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, role]);
//     res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//     }
// };
// export const login = async (req: Request, res: Response) => {
//     const { username, password } = req.body;
//     try {
//     const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
//     if (rows.length === 0) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//     }
//     const user = rows[0];
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//     } catch (err) {
//     res.status(500).json({ error: (err as Error).message });
//     }
// };
