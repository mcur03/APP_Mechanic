// src/db.ts
import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'McuR1097_0308',
    database: 'mechanic_service',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
