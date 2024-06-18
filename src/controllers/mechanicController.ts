import { Request, Response } from 'express';
import pool from '../db';
import { RowDataPacket } from 'mysql2';
import { Mechanic } from '../models/mechanicModel';

interface AuthenticatedRequest extends Request {
    user?: {
    id: number;
    };
}

export const getMechanicProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
    const mechanicId = req.user?.id;
    const [rows] = await pool.query<Mechanic[] & RowDataPacket[]>('SELECT * FROM mechanics WHERE user_id = ?', [mechanicId]);
    res.json(rows[0]);
    } catch (err) {
    res.status(500).json({ error: (err as Error).message });
    }
};


export const respondToService = async (req: AuthenticatedRequest, res: Response) => {
    const mechanicId = req.user?.id;
    const { serviceId, response } = req.body;
  
    try {
      console.log(`Checking service ${serviceId} for mechanic ${mechanicId}`);
  
      // Asegurarse de que el mecánico ID está correcto
      const [mechanic]: any = await pool.query('SELECT * FROM mechanics WHERE user_id = ?', [mechanicId]);
      if (Array.isArray(mechanic) && mechanic.length === 0) {
        return res.status(404).json({ error: 'Mechanic not found' });
      }
      const actualMechanicId = mechanic[0].id;
  
      const [serviceRows]: any = await pool.query('SELECT * FROM services WHERE id = ? AND mechanic_id = ?', [serviceId, actualMechanicId]);
  
      console.log("Service Rows: ", serviceRows);
  
      if (Array.isArray(serviceRows) && serviceRows.length === 0) {
        return res.status(404).json({ error: 'Service not found or not assigned to this mechanic' });
      }
  
      const service = serviceRows[0];
      if (service.status !== 'pending') {
        return res.status(400).json({ error: 'Service is not in pending state' });
      }
  
      const newStatus = response === 'accept' ? 'in_progress' : 'rejected';
      const [updateResult]: any = await pool.query('UPDATE services SET status = ? WHERE id = ?', [newStatus, serviceId]);
  
      console.log("Update Result: ", updateResult);
  
      if (response === 'accept') {
        const [updateMechanic]: any = await pool.query('UPDATE mechanics SET availability = ? WHERE id = ?', ['no', actualMechanicId]);
  
        console.log("Mechanic Update Result: ", updateMechanic);
      }
  
      res.status(200).json({ message: `Service ${response === 'accept' ? 'accepted' : 'rejected'} successfully` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };




  export const completeService = async (req: AuthenticatedRequest, res: Response) => {
    const mechanicUserId = req.user?.id;
    const { serviceId } = req.body;
  
    try {
      // Depuración: Verificar los datos de entrada
      console.log(`Completing service ${serviceId} for mechanic user ID ${mechanicUserId}`);
  
      // Obtener el actualMechanicId usando mechanicUserId
      const [mechanic]: any = await pool.query('SELECT id FROM mechanics WHERE user_id = ?', [mechanicUserId]);
      if (Array.isArray(mechanic) && mechanic.length === 0) {
        return res.status(404).json({ error: 'Mechanic not found' });
      }
      const actualMechanicId = mechanic[0].id;
      console.log(`Actual mechanic ID: ${actualMechanicId}`);
  
      // Verificar que el servicio esté en estado 'in_progress'
      const [serviceRows]: any = await pool.query('SELECT * FROM services WHERE id = ? AND mechanic_id = ? AND status = ?', [serviceId, actualMechanicId, 'in_progress']);
      
      // Depuración: Mostrar el resultado de la consulta
      console.log("Service Rows (completeService): ", serviceRows);
  
      if (Array.isArray(serviceRows) && serviceRows.length === 0) {
        return res.status(404).json({ error: 'Service not found or not assigned to this mechanic in in_progress state' });
      }
  
      // Cambiar el estado del servicio a 'completed'
      const [updateService]: any = await pool.query('UPDATE services SET status = ? WHERE id = ?', ['completed', serviceId]);
      console.log("Service Update Result: ", updateService);
  
      // Actualizar la disponibilidad del mecánico a 'yes'
      const [updateMechanic]: any = await pool.query('UPDATE mechanics SET availability = ? WHERE id = ?', ['yes', actualMechanicId]);
      console.log("Mechanic Update Result: ", updateMechanic);
  
      res.status(200).json({ message: 'Service marked as completed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };


  export const getMechanicEarnings = async (req: AuthenticatedRequest, res: Response) => {
    const mechanicUserId = req.user?.id;
  
    try {
      // Obtener el actualMechanicId usando mechanicUserId
      const [mechanic]: any = await pool.query('SELECT id FROM mechanics WHERE user_id = ?', [mechanicUserId]);
      if (Array.isArray(mechanic) && mechanic.length === 0) {
        return res.status(404).json({ error: 'Mechanic not found' });
      }
      const actualMechanicId = mechanic[0].id;
  
      // Calcular los ingresos totales del mecánico
      const [earningsRows]: any = await pool.query('SELECT SUM(payments.amount) AS total_earnings FROM payments JOIN services ON payments.service_id = services.id WHERE services.mechanic_id = ? AND services.status = ?', [actualMechanicId, 'completed']);
  
      const totalEarnings = earningsRows[0].total_earnings || 0;
  
      res.status(200).json({ totalEarnings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };
  