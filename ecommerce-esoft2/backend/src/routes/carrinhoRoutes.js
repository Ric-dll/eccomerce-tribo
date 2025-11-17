// backend/src/routes/carrinhoRoutes.js
import express from 'express';
import { 
    listarItensCarrinho, 
    adicionarItem, 
    atualizarItem, 
    removerItem 
} from '../controllers/carrinhoController.js';

const router = express.Router();

// Lista itens de um cliente
router.get('/cliente/:clienteId', listarItensCarrinho);

// Adiciona um item
router.post('/adicionar', adicionarItem);

// Atualiza a quantidade de um item
router.put('/atualizar', atualizarItem);

// Remove um item
router.delete('/remover', removerItem);

export default router;