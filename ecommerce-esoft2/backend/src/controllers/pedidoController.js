// backend/src/controllers/pedidoController.js
import { models, sequelize } from '../config/db.js';

// POST /api/pedidos/finalizar
export const finalizarPedido = async (req, res) => {
    
    // O frontend (Painel do Vendedor) deve enviar o ID do cliente
    const { Cliente_ID, EnderecoEntrega_ID } = req.body;

    if (!Cliente_ID || !EnderecoEntrega_ID) {
        return res.status(400).json({ mensagem: "Cliente_ID e EnderecoEntrega_ID são obrigatórios." });
    }

    const t = await sequelize.transaction();

    try {
        // Assume 1 = "Aguardando Pagamento" (Vamos inserir isso no banco no Passo 7)
        const ID_STATUS_INICIAL = 1; 

        // 1. Encontrar o carrinho e os itens
        const carrinho = await models.Carrinho.findOne({
            where: { Cliente_ID: Cliente_ID },
            include: [{
                model: models.ItemCarrinho,
                as: 'itens',
                include: [{ model: models.Produto, as: 'produto' }]
            }],
            transaction: t
        });

        if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
            await t.rollback();
            return res.status(400).json({ mensagem: "Carrinho vazio para este cliente." });
        }

        let totalPedido = 0;
        const itensParaPedido = [];
        
        // 2. Verificar estoque e calcular total
        for (const item of carrinho.itens) {
            const produto = item.produto;
            
            if (produto.Estoque < item.Quantidade) {
                await t.rollback();
                return res.status(400).json({ 
                    mensagem: `Estoque insuficiente para o produto: ${produto.Nome}.` 
                });
            }
            
            const subtotalItem = produto.Preco * item.Quantidade;
            totalPedido += subtotalItem;

            itensParaPedido.push({
                Quantidade: item.Quantidade,
                PrecoUnitario: produto.Preco,
                Pedido_ID: null,
                Produto_ID: produto.ID_produto
            });
        }

        // 3. Criar o Pedido
        const novoPedido = await models.Pedido.create({
            Total: totalPedido,
            StatusPedido_ID: ID_STATUS_INICIAL,
            Cliente_ID: Cliente_ID,
            EnderecoEntrega_ID: EnderecoEntrega_ID, 
            DataPedido: new Date()
        }, { transaction: t });

        // 4. Associar os Itens ao Pedido
        itensParaPedido.forEach(item => {
            item.Pedido_ID = novoPedido.ID_pedido;
        });

        // 5. Salvar os Itens do Pedido
        await models.ItemPedido.bulkCreate(itensParaPedido, { transaction: t });

        // 6. Diminuir o Estoque
        for (const item of carrinho.itens) {
            await models.Produto.update(
                { Estoque: sequelize.literal(`Estoque - ${item.Quantidade}`) },
                { where: { ID_produto: item.Produto_ID }, transaction: t }
            );
        }

        // 7. Limpar o Carrinho
        await models.ItemCarrinho.destroy({
            where: { ID_carrinho: carrinho.ID_carrinho },
            transaction: t
        });

        // 8. Commit
        await t.commit();
        
        res.status(201).json(novoPedido);

    } catch (error) {
        // 9. Rollback
        await t.rollback();
        res.status(500).json({ mensagem: "Erro ao finalizar pedido.", detalhes: error.message });
    }
};