// frontend/src/services/CategoriaService.js
// Este serviço se comunica com /api/categorias/*
import api from './api';

const CategoriaService = {
    // Rota: POST /api/categorias
    cadastrarCategoria: (data) => {
        return api.post('/categorias', data);
    },

    // Rota: GET /api/categorias
    listarCategorias: () => {
        return api.get('/categorias');
    },
};

export default CategoriaService;