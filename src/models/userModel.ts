// src/models/userModel.ts
import db  from '../db';

export interface User {
  username: string;
  password: string;
  email: string;
  role: string;
}

export async function createUser(user: User) {
  const [result] = await db.query(
    'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
    [user.username, user.password, user.email, user.role]
  );
  return (result as any).insertId;
}





















// export interface User {
//     id: number;
//     username: string;
//     password: string;
//     email: string;
//     role: UserRole;
//     createdAt: Date;
// }

// export interface Client extends User {
//     fullName: string;
//     phone: string;
//     address: string;
// }

// export interface Mechanic extends User {
//     fullName: string;
//     phone: string;
//     specialties: string;
//     availability: string;
// }

// export type UserRole = 'client' | 'mechanic' | 'admin';
