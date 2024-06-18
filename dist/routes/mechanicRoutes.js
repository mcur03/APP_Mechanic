"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mechanicController_1 = require("../controllers/mechanicController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/profile', authMiddleware_1.authenticate, mechanicController_1.getMechanicProfile);
router.post('/respond-service', authMiddleware_1.authenticate, mechanicController_1.respondToService);
router.post('/service-complete', authMiddleware_1.authenticate, mechanicController_1.completeService);
router.get('/earnings', authMiddleware_1.authenticate, mechanicController_1.getMechanicEarnings);
exports.default = router;
