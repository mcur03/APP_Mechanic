// import db from '../db';

export interface Service {
    id: number;
    clientId: number;
    mechanicId: number | null;
    status: 'pending' | 'in-progress' | 'completed' | 'rejected';
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

