// src/controllers/clientController.ts
import { Request, Response } from 'express';
import pool from '../db';
import { RowDataPacket } from 'mysql2';
import { Client } from '../models/clientModel';
import { Service } from '../models/serviceModel';
// import { User } from '../models/userModel';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export const getClientProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    const [rows] = await pool.query<Client[] & RowDataPacket[]>('SELECT * FROM clients WHERE user_id = ?', [clientId]);
    res.json(rows[0]);
    console.log(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createServiceRequest = async (req: AuthenticatedRequest, res: Response) => {
  const { description, address } = req.body; // Asegurarnos de recibir la dirección
  const userId = req.user?.id;
  console.log("userId:", userId);

  try {
    // Verificar si el cliente existe en la tabla `clients`
    const [clientRows]: any = await pool.query('SELECT id FROM clients WHERE user_id = ?', [userId]);

    console.log("clientRows:", clientRows);

    let clientId: number;
    if (Array.isArray(clientRows) && clientRows.length === 0) {
      // Insertar el cliente si no existe
      const [result] = await pool.query('INSERT INTO clients (user_id, phone, address) VALUES (?, ?, ?)', [userId, 'default_phone', 'default_address']);
      clientId = (result as RowDataPacket).insertId;
    } else {
      clientId = clientRows[0].id;
    }

    // Insertar en la tabla `services` con la dirección
    const [serviceResult] = await pool.query('INSERT INTO services (client_id, mechanic_id, status, description, address) VALUES (?, ?, ?, ?, ?)', [clientId, null, 'pending', description, address]);
    console.log("Service Insert Result: ", serviceResult);

    res.status(201).json({ message: 'Service request created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};






















// export const createServiceRequest = async (req: AuthenticatedRequest, res: Response) => {
//   const { description } = req.body;
//   const userId = req.user?.id;
//   console.log("userId:", userId);

//   try {
//     // Verificar si el cliente existe en la tabla `clients`
//     const [clientRows]: any = await pool.query('SELECT id FROM clients WHERE user_id = ?', [userId]);

//     console.log("clientRows:", clientRows);

//     let clientId: number;
//     if (Array.isArray(clientRows) && clientRows.length === 0) {
//       // Insertar el cliente si no existe
//       const [result] = await pool.query('INSERT INTO clients (user_id, phone, address) VALUES (?, ?, ?)', [userId, 'default_phone', 'default_address']);
//       clientId = (result as RowDataPacket).insertId;
//     } else {
//       clientId = clientRows[0].id;
//     }

//     // Insertar en la tabla `services`
//     await pool.query('INSERT INTO services (client_id, mechanic_id, status, description) VALUES (?, ?, ?, ?)', [clientId, null, 'pending', description]);
//     res.status(201).json({ message: 'Service request created successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: (err as Error).message });
//   }
// };


export const getServiceHistory = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  console.log("getServiceHistory--userId: " + userId);
  
  try {
    // Obtener el client_id utilizando el user_id
    const [clientRows]: any = await pool.query('SELECT id FROM clients WHERE user_id = ?', [userId]);
    if (Array.isArray(clientRows) && clientRows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const clientId = clientRows[0].id;
    console.log("getServiceHistory--clientId: " + clientId);

    // Obtener el historial de servicios usando el client_id
    const [rows] = await pool.query<Service[] & RowDataPacket[]>('SELECT * FROM services WHERE client_id = ?', [clientId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};


export const makePayment = async (req: AuthenticatedRequest, res: Response) => {
  const { serviceId, amount } = req.body;
  const userId = req.user?.id;

  try {
    // Verificar si el servicio está en estado 'completed'
    const [serviceRows]: any = await pool.query('SELECT * FROM services WHERE id = ? AND client_id = (SELECT id FROM clients WHERE user_id = ?) AND status = ?', [serviceId, userId, 'completed']);
    if (Array.isArray(serviceRows) && serviceRows.length === 0) {
      return res.status(400).json({ error: 'Service not found, not completed, or not assigned to this client' });
    }

    // Insertar el pago en la tabla 'payments'
    await pool.query('INSERT INTO payments (service_id, amount, status) VALUES (?, ?, ?)', [serviceId, amount, 'completed']);

    res.status(201).json({ message: 'Payment made successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};