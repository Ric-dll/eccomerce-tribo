import { models, sequelize } from '../config/db.js';
import { Op, fn, col } from 'sequelize';

// GET /api/admin/stats
export const getStatsDashboard = async (req, res) => {
    try {
        // 1. Define o período (últimos 30 dias)
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

        // 2. Consulta de Vendas (Agrupadas por Dia)
        const vendasPorDia = await models.Pedido.findAll({
            attributes: [
                [fn('DATE', col('DataPedido')), 'data'],
                [fn('SUM', col('Total')), 'totalVendas'],
                [fn('COUNT', col('ID_pedido')), 'totalPedidos']
            ],
            where: {
                DataPedido: {
                    [Op.gte]: trintaDiasAtras
                }
            },
            group: [fn('DATE', col('DataPedido'))],
            order: [['data', 'ASC']]
        });

        // 3. Consulta de Stats Gerais (Cards)
        const statsGerais = await models.Pedido.findOne({
            attributes: [
                [fn('SUM', col('Total')), 'faturamentoTotal'],
                [fn('COUNT', col('ID_pedido')), 'pedidosTotais']
            ],
            where: {
                DataPedido: { [Op.gte]: trintaDiasAtras }
            }
        });

        const totalClientes = await models.Cliente.count({
            where: {
                '$usuarioBase.Data_cadastro$': { [Op.gte]: trintaDiasAtras }
            },
            include: [{
                model: models.Usuario,
                as: 'usuarioBase',
                attributes: []
            }]
        });

        res.status(200).json({
            vendasPorDia,
            faturamentoTotal: statsGerais.get('faturamentoTotal') || 0,
            pedidosTotais: statsGerais.get('pedidosTotais') || 0,
            novosClientes: totalClientes || 0
        });

    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao buscar estatísticas.", detalhes: error.message });
    }
};