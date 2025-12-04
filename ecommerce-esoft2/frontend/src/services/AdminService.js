import api from './api';

const AdminService = {
    // Buscar estatísticas
    // Backend espera: GET /api/admin/stats
    getStats: () => {
        return api.get('/admin/stats');
    }
};

export default AdminService;