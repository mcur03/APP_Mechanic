"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/profile', authMiddleware_1.authenticate, clientController_1.getClientProfile);
router.post('/service-request', authMiddleware_1.authenticate, clientController_1.createServiceRequest);
router.get('/service-history', authMiddleware_1.authenticate, clientController_1.getServiceHistory);
router.post('/makePayment', authMiddleware_1.authenticate, clientController_1.makePayment);
exports.default = router;
