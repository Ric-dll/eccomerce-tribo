import express from 'express';
import { cadastrarCategoria, listarCategorias } from '../controllers/categoriaController.js';

const router = express.Router();

router.route('/')
    .post(cadastrarCategoria) 
    .get(listarCategorias); 

export default router;