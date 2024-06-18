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
exports.getMechanicEarnings = exports.completeService = exports.respondToService = exports.getMechanicProfile = void 0;
const db_1 = __importDefault(require("../db"));
const getMechanicProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const mechanicId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const [rows] = yield db_1.default.query('SELECT * FROM mechanics WHERE user_id = ?', [mechanicId]);
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getMechanicProfile = getMechanicProfile;
const respondToService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const mechanicId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { serviceId, response } = req.body;
    try {
        console.log(`Checking service ${serviceId} for mechanic ${mechanicId}`);
        // Asegurarse de que el mecánico ID está correcto
        const [mechanic] = yield db_1.default.query('SELECT * FROM mechanics WHERE user_id = ?', [mechanicId]);
        if (Array.isArray(mechanic) && mechanic.length === 0) {
            return res.status(404).json({ error: 'Mechanic not found' });
        }
        const actualMechanicId = mechanic[0].id;
        const [serviceRows] = yield db_1.default.query('SELECT * FROM services WHERE id = ? AND mechanic_id = ?', [serviceId, actualMechanicId]);
        console.log("Service Rows: ", serviceRows);
        if (Array.isArray(serviceRows) && serviceRows.length === 0) {
            return res.status(404).json({ error: 'Service not found or not assigned to this mechanic' });
        }
        const service = serviceRows[0];
        if (service.status !== 'pending') {
            return res.status(400).json({ error: 'Service is not in pending state' });
        }
        const newStatus = response === 'accept' ? 'in_progress' : 'rejected';
        const [updateResult] = yield db_1.default.query('UPDATE services SET status = ? WHERE id = ?', [newStatus, serviceId]);
        console.log("Update Result: ", updateResult);
        if (response === 'accept') {
            const [updateMechanic] = yield db_1.default.query('UPDATE mechanics SET availability = ? WHERE id = ?', ['no', actualMechanicId]);
            console.log("Mechanic Update Result: ", updateMechanic);
        }
        res.status(200).json({ message: `Service ${response === 'accept' ? 'accepted' : 'rejected'} successfully` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.respondToService = respondToService;
const completeService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const mechanicUserId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const { serviceId } = req.body;
    try {
        // Depuración: Verificar los datos de entrada
        console.log(`Completing service ${serviceId} for mechanic user ID ${mechanicUserId}`);
        // Obtener el actualMechanicId usando mechanicUserId
        const [mechanic] = yield db_1.default.query('SELECT id FROM mechanics WHERE user_id = ?', [mechanicUserId]);
        if (Array.isArray(mechanic) && mechanic.length === 0) {
            return res.status(404).json({ error: 'Mechanic not found' });
        }
        const actualMechanicId = mechanic[0].id;
        console.log(`Actual mechanic ID: ${actualMechanicId}`);
        // Verificar que el servicio esté en estado 'in_progress'
        const [serviceRows] = yield db_1.default.query('SELECT * FROM services WHERE id = ? AND mechanic_id = ? AND status = ?', [serviceId, actualMechanicId, 'in_progress']);
        // Depuración: Mostrar el resultado de la consulta
        console.log("Service Rows (completeService): ", serviceRows);
        if (Array.isArray(serviceRows) && serviceRows.length === 0) {
            return res.status(404).json({ error: 'Service not found or not assigned to this mechanic in in_progress state' });
        }
        // Cambiar el estado del servicio a 'completed'
        const [updateService] = yield db_1.default.query('UPDATE services SET status = ? WHERE id = ?', ['completed', serviceId]);
        console.log("Service Update Result: ", updateService);
        // Actualizar la disponibilidad del mecánico a 'yes'
        const [updateMechanic] = yield db_1.default.query('UPDATE mechanics SET availability = ? WHERE id = ?', ['yes', actualMechanicId]);
        console.log("Mechanic Update Result: ", updateMechanic);
        res.status(200).json({ message: 'Service marked as completed successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.completeService = completeService;
const getMechanicEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const mechanicUserId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    try {
        // Obtener el actualMechanicId usando mechanicUserId
        const [mechanic] = yield db_1.default.query('SELECT id FROM mechanics WHERE user_id = ?', [mechanicUserId]);
        if (Array.isArray(mechanic) && mechanic.length === 0) {
            return res.status(404).json({ error: 'Mechanic not found' });
        }
        const actualMechanicId = mechanic[0].id;
        // Calcular los ingresos totales del mecánico
        const [earningsRows] = yield db_1.default.query('SELECT SUM(payments.amount) AS total_earnings FROM payments JOIN services ON payments.service_id = services.id WHERE services.mechanic_id = ? AND services.status = ?', [actualMechanicId, 'completed']);
        const totalEarnings = earningsRows[0].total_earnings || 0;
        res.status(200).json({ totalEarnings });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.getMechanicEarnings = getMechanicEarnings;
