import { Request, Response } from 'express';
import pool from '../db';

export const getUsers = async (req: Request, res: Response) => {
    try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
    } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    }
};


export const assignService = async (req: Request, res: Response) => {
    const { serviceId } = req.body;
  
    try {
      const [serviceRows]: any = await pool.query('SELECT * FROM services WHERE id = ? AND status = ?', [serviceId, 'pending']);
      if (Array.isArray(serviceRows) && serviceRows.length === 0) {
        return res.status(404).json({ error: 'Service not found or not in pending state' });
      }
  
      const [mechanicRows]: any = await pool.query('SELECT id FROM mechanics WHERE availability = ? LIMIT 1', ['yes']);
      if (Array.isArray(mechanicRows) && mechanicRows.length === 0) {
        return res.status(404).json({ error: 'No available mechanics found' });
      }
  
      const mechanicId = mechanicRows[0].id;
      await pool.query('UPDATE services SET mechanic_id = ? WHERE id = ?', [mechanicId, serviceId]);
  
      res.status(200).json({ message: 'Service assigned to mechanic successfully', mechanicId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };