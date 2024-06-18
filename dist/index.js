"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const mechanicRoutes_1 = __importDefault(require("./routes/mechanicRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
// Middleware para parsear JSON
app.use(express_1.default.json());
// Rutas
app.use('/api', authRoutes_1.default);
app.use('/client', clientRoutes_1.default);
app.use('/mechanic', mechanicRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
// import express from 'express';
// import authRoutes from './routes/authRoutes';
// import clientRoutes from './routes/clientRoutes';
// import mechanicRoutes from './routes/mechanicRoutes';
// import adminRoutes from './routes/adminRoutes';
// const app = express();
// const port = 3000;
// app.use(express.json());
// app.use('/auth', authRoutes);
// app.use('/client', clientRoutes);
// app.use('/mechanic', mechanicRoutes);
// app.use('/admin', adminRoutes);
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });
// // import express, { Request, Response } from 'express';
// // import connection from './db';
// // const app = express();
// // const port = 3000;
// // app.use(express.json());
// // app.get('/users', async (req: Request, res: Response) => {
// //   try {
// //     console.log('Se conecto a la bd')
// //     const [rows] = await (await connection).query('SELECT * FROM users;');
// //     // const [execution] = await (await connection).execute("Insert into users values ('333','Sebas','27;')")
// //     res.json(rows);
// //     console.log(rows);
// //   } catch (err:any) {
// //     res.status(500).json({ error: err.message });
// //   }
// //   (await connection).destroy();
// // });
// // app.listen(port, () => {
// //   console.log(`Server running at http://localhost:${port}/`);
// // });
