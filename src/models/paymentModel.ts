import db from '../db';

export interface Payment{
    serviceId: number;
    amount: number;
}