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
exports.makePayment = exports.getServiceHistory = exports.createServiceRequest = exports.getClientProfile = void 0;
const db_1 = __importDefault(require("../db"));
const getClientProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const [rows] = yield db_1.default.query('SELECT * FROM clients WHERE user_id = ?', [clientId]);
        res.json(rows[0]);
        console.log(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getClientProfile = getClientProfile;
const createServiceRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { description, address } = req.body; // Asegurarnos de recibir la dirección
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    console.log("userId:", userId);
    try {
        // Verificar si el cliente existe en la tabla `clients`
        const [clientRows] = yield db_1.default.query('SELECT id FROM clients WHERE user_id = ?', [userId]);
        console.log("clientRows:", clientRows);
        let clientId;
        if (Array.isArray(clientRows) && clientRows.length === 0) {
            // Insertar el cliente si no existe
            const [result] = yield db_1.default.query('INSERT INTO clients (user_id, phone, address) VALUES (?, ?, ?)', [userId, 'default_phone', 'default_address']);
            clientId = result.insertId;
        }
        else {
            clientId = clientRows[0].id;
        }
        // Insertar en la tabla `services` con la dirección
        const [serviceResult] = yield db_1.default.query('INSERT INTO services (client_id, mechanic_id, status, description, address) VALUES (?, ?, ?, ?, ?)', [clientId, null, 'pending', description, address]);
        console.log("Service Insert Result: ", serviceResult);
        res.status(201).json({ message: 'Service request created successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.createServiceRequest = createServiceRequest;
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
const getServiceHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    console.log("getServiceHistory--userId: " + userId);
    try {
        // Obtener el client_id utilizando el user_id
        const [clientRows] = yield db_1.default.query('SELECT id FROM clients WHERE user_id = ?', [userId]);
        if (Array.isArray(clientRows) && clientRows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        const clientId = clientRows[0].id;
        console.log("getServiceHistory--clientId: " + clientId);
        // Obtener el historial de servicios usando el client_id
        const [rows] = yield db_1.default.query('SELECT * FROM services WHERE client_id = ?', [clientId]);
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getServiceHistory = getServiceHistory;
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { serviceId, amount } = req.body;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    try {
        // Verificar si el servicio está en estado 'completed'
        const [serviceRows] = yield db_1.default.query('SELECT * FROM services WHERE id = ? AND client_id = (SELECT id FROM clients WHERE user_id = ?) AND status = ?', [serviceId, userId, 'completed']);
        if (Array.isArray(serviceRows) && serviceRows.length === 0) {
            return res.status(400).json({ error: 'Service not found, not completed, or not assigned to this client' });
        }
        // Insertar el pago en la tabla 'payments'
        yield db_1.default.query('INSERT INTO payments (service_id, amount, status) VALUES (?, ?, ?)', [serviceId, amount, 'completed']);
        res.status(201).json({ message: 'Payment made successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.makePayment = makePayment;
