import api from './api';

const UsuarioService = {
    // Rota: POST /api/usuarios/clientes
    cadastrarCliente: (data) => {
        return api.post('/usuarios/clientes', data);
    },

    // Rota: GET /api/usuarios/clientes
    // MUDANÇA: Agora aceita 'params' (search, sort, order)
    listarClientes: (params) => {
        return api.get('/usuarios/clientes', { params }); 
    },

    // Rota: POST /api/usuarios/vendedores
    cadastrarVendedor: (data) => {
        return api.post('/usuarios/vendedores', data);
    },

    // Rota: GET /api/usuarios/vendedores
    // MUDANÇA: Agora aceita 'params'
    listarVendedores: (params) => {
        return api.get('/usuarios/vendedores', { params });
    },
};

export default UsuarioService;