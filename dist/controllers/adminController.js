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
exports.assignService = exports.getUsers = void 0;
const db_1 = __importDefault(require("../db"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM users');
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUsers = getUsers;
const assignService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.body;
    try {
        const [serviceRows] = yield db_1.default.query('SELECT * FROM services WHERE id = ? AND status = ?', [serviceId, 'pending']);
        if (Array.isArray(serviceRows) && serviceRows.length === 0) {
            return res.status(404).json({ error: 'Service not found or not in pending state' });
        }
        const [mechanicRows] = yield db_1.default.query('SELECT id FROM mechanics WHERE availability = ? LIMIT 1', ['yes']);
        if (Array.isArray(mechanicRows) && mechanicRows.length === 0) {
            return res.status(404).json({ error: 'No available mechanics found' });
        }
        const mechanicId = mechanicRows[0].id;
        yield db_1.default.query('UPDATE services SET mechanic_id = ? WHERE id = ?', [mechanicId, serviceId]);
        res.status(200).json({ message: 'Service assigned to mechanic successfully', mechanicId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.assignService = assignService;
