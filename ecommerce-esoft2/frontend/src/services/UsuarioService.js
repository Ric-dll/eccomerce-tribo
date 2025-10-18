// frontend/src/services/UsuarioService.js
// Este serviço se comunica com /api/usuarios/*
import api from './api';

const UsuarioService = {
    // Rota: POST /api/usuarios/clientes
    cadastrarCliente: (data) => {
        return api.post('/usuarios/clientes', data);
    },

    // Rota: GET /api/usuarios/clientes
    listarClientes: () => {
        return api.get('/usuarios/clientes');
    },

    // Rota: POST /api/usuarios/vendedores
    cadastrarVendedor: (data) => {
        return api.post('/usuarios/vendedores', data);
    },

    // Rota: GET /api/usuarios/vendedores
    listarVendedores: () => {
        return api.get('/usuarios/vendedores');
    },
};

export default UsuarioService;