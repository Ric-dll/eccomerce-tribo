import express from 'express';
import { cadastrarProduto, listarProdutos } from '../controllers/produtoController.js';

const router = express.Router();

router.route('/')
    .post(cadastrarProduto) 
    .get(listarProdutos); 

export default router;