import express from 'express';
import { cadastrarCliente, cadastrarVendedor, listarClientes, listarVendedores } from '../controllers/usuarioController.js';

const router = express.Router();

router.post('/clientes', cadastrarCliente);      
router.post('/vendedores', cadastrarVendedor); 

router.get('/clientes', listarClientes);        
router.get('/vendedores', listarVendedores);  

export default router;