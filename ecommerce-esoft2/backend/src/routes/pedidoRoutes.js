// backend/src/routes/pedidoRoutes.js
import express from 'express';
import { finalizarPedido } from '../controllers/pedidoController.js';

const router = express.Router();

// POST /api/pedidos/finalizar
router.post('/finalizar', finalizarPedido);

export default router;