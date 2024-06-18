"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMechanic = void 0;
// src/models/mechanicModel.ts
const db_1 = __importDefault(require("../db"));
function createMechanic(mechanic) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query('INSERT INTO mechanics (user_id, phone, specialties, availability) VALUES (?, ?, ?, ?)', [mechanic.userId, mechanic.phone, mechanic.specialties, mechanic.availability]);
    });
}
exports.createMechanic = createMechanic;
// export interface MechanicProfile {
//     userId: number;
//     fullName: string;
//     phone: string;
//     specialties: string;
//     availability: string;
// }
