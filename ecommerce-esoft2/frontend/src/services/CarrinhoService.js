import api from './api';

const CarrinhoService = {
    // 1. Listar itens do carrinho de um cliente específico
    // Backend espera: GET /api/carrinho/cliente/:clienteId
    listarItens: (clienteId) => {
        return api.get(`/carrinho/cliente/${clienteId}`);
    },

    // 2. Adicionar item ao carrinho
    // Backend espera: POST /api/carrinho/adicionar
    // Body: { Produto_ID, Quantidade, Cliente_ID }
    adicionarItem: (dados) => {
        return api.post('/carrinho/adicionar', dados);
    },

    // 3. Atualizar quantidade de um item
    // Backend espera: PUT /api/carrinho/atualizar
    // Body: { Produto_ID, Quantidade, Cliente_ID }
    atualizarItem: (dados) => {
        return api.put('/carrinho/atualizar', dados);
    },

    // 4. Remover item do carrinho
    // Backend espera: DELETE /api/carrinho/remover?produtoId=X&clienteId=Y
    removerItem: (produtoId, clienteId) => {
        return api.delete(`/carrinho/remover?produtoId=${produtoId}&clienteId=${clienteId}`);
    }
};

export default CarrinhoService;