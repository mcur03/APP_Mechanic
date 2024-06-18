// src/models/mechanicModel.ts
import db from '../db';

export interface Mechanic {
  userId: number;
  phone: string;
  specialties: string;
  availability: 'yes' | 'no';
}

export async function createMechanic(mechanic: Mechanic) {
  await db.query(
    'INSERT INTO mechanics (user_id, phone, specialties, availability) VALUES (?, ?, ?, ?)',
    [mechanic.userId, mechanic.phone, mechanic.specialties, mechanic.availability]
  );
}













// export interface MechanicProfile {
//     userId: number;
//     fullName: string;
//     phone: string;
//     specialties: string;
//     availability: string;
// }
