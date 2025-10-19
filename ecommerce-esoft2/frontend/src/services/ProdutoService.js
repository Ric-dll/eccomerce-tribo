// frontend/src/services/ProdutoService.js
// Este serviço se comunica com /api/produtos/*
import api from './api';

const ProdutoService = {
    // Rota: POST /api/produtos
    cadastrarProduto: (data) => {
        return api.post('/produtos', data);
    },

    // Rota: GET /api/produtos
    listarProdutos: () => {
        return api.get('/produtos');
    },
};

export default ProdutoService;