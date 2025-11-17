// backend/src/routes/adminRoutes.js
import express from 'express';
import { getStatsDashboard } from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', getStatsDashboard);

export default router;