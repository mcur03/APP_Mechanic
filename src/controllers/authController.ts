// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { createUser } from '../models/userModel';
import { createClient } from '../models/clientModel';
import { createMechanic } from '../models/mechanicModel';
import db  from '../db';

const JWT_SECRET = 'secretkey'; // Cambiar a una variable de entorno en producción

export async function registerUser(req: Request, res: Response) {
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
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.getConnection().then(async (connection) => {
      try {
        await connection.beginTransaction();

        const userId = await createUser({
          username,
          password: hashedPassword,
          email,
          role
        });

        if (role === 'client') {
          await createClient({ userId, phone, address });
        } else if (role === 'mechanic') {
          await createMechanic({
            userId,
            phone,
            specialties,
            availability: availability || 'yes'
          });
        }

        await connection.commit();
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
      } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err + '500 - 1' });
      } finally {
        connection.release();
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error + '500 - 2' });
  }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    try {
      const [rows]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };










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
