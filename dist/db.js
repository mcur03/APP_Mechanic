"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/db.ts
const promise_1 = require("mysql2/promise");
const pool = (0, promise_1.createPool)({
    host: 'localhost',
    user: 'root',
    password: 'McuR1097_0308',
    database: 'mechanic_service',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.default = pool;
