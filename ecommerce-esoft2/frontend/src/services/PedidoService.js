import api from './api';

const PedidoService = {
    // Finalizar o pedido (Checkout)
    // Backend espera: POST /api/pedidos/finalizar
    // Body: { Cliente_ID, EnderecoEntrega_ID }
    finalizarPedido: (dados) => {
        return api.post('/pedidos/finalizar', dados);
    }
};

export default PedidoService;