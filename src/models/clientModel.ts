// src/models/clientModel.ts
import db  from '../db';

export interface Client {
  userId: number;
  phone: string;
  address: string;
}

export async function createClient(client: Client) {
  await db.query(
    'INSERT INTO clients (user_id, phone, address) VALUES (?, ?, ?)',
    [client.userId, client.phone, client.address]
  );
}

















// export interface ClientProfile {
//     userId: number;
//     fullName: string;
//     phone: string;
//     address: string;
// }