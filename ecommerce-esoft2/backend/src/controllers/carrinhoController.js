// backend/src/controllers/carrinhoController.js
import { models } from '../config/db.js';

// Função utilitária para buscar ou criar o carrinho de um cliente
const getCarrinhoUsuario = async (clienteId) => {
    if (!clienteId) {
        throw new Error("Cliente_ID não fornecido.");
    }
    
    let carrinho = await models.Carrinho.findOne({ where: { Cliente_ID: clienteId } });
    
    if (!carrinho) {
        // Garante que o cliente existe antes de criar um carrinho
        const cliente = await models.Cliente.findByPk(clienteId);
        if (!cliente) {
            throw new Error("Cliente não encontrado.");
        }
        carrinho = await models.Carrinho.create({ Cliente_ID: clienteId });
    }
    return carrinho;
};

// GET /api/carrinho/cliente/:clienteId
export const listarItensCarrinho = async (req, res) => {
    const { clienteId } = req.params; 

    try {
        const carrinho = await getCarrinhoUsuario(clienteId);
        const itens = await models.ItemCarrinho.findAll({
            where: { ID_carrinho: carrinho.ID_carrinho },
            include: [{
                model: models.Produto,
                as: 'produto',
                attributes: ['ID_produto', 'Nome', 'Preco', 'Estoque'] // Incluído ID_produto
            }]
        });
        res.status(200).json(itens);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao listar itens do carrinho.", detalhes: error.message });
    }
};

// POST /api/carrinho/adicionar
export const adicionarItem = async (req, res) => {
    const { Produto_ID, Quantidade, Cliente_ID } = req.body;
    const qtd = parseInt(Quantidade, 10) || 1;

    try {
        const carrinho = await getCarrinhoUsuario(Cliente_ID);
        const produto = await models.Produto.findByPk(Produto_ID);
        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        let item = await models.ItemCarrinho.findOne({
            where: { ID_carrinho: carrinho.ID_carrinho, Produto_ID: Produto_ID }
        });

        if (item) {
            item.Quantidade += qtd;
            if (item.Quantidade > produto.Estoque) {
                 return res.status(400).json({ mensagem: "Estoque insuficiente." });
            }
            await item.save();
        } else {
            if (qtd > produto.Estoque) {
                 return res.status(400).json({ mensagem: "Estoque insuficiente." });
            }
            item = await models.ItemCarrinho.create({
                ID_carrinho: carrinho.ID_carrinho,
                Produto_ID: Produto_ID,
                Quantidade: qtd
            });
        }
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao adicionar item.", detalhes: error.message });
    }
};

// PUT /api/carrinho/atualizar
export const atualizarItem = async (req, res) => {
    const { Produto_ID, Quantidade, Cliente_ID } = req.body;
    const qtd = parseInt(Quantidade, 10);

    if (isNaN(qtd) || qtd < 0) {
        return res.status(400).json({ mensagem: "Quantidade inválida." });
    }

    try {
        const carrinho = await getCarrinhoUsuario(Cliente_ID);
        if (qtd === 0) {
            await models.ItemCarrinho.destroy({
                where: { ID_carrinho: carrinho.ID_carrinho, Produto_ID: Produto_ID }
            });
            return res.status(204).send();
        }

        const [afetados] = await models.ItemCarrinho.update(
            { Quantidade: qtd },
            { where: { ID_carrinho: carrinho.ID_carrinho, Produto_ID: Produto_ID } }
        );

        if (afetados === 0) {
            return res.status(404).json({ mensagem: "Item não encontrado." });
        }
        res.status(200).json({ mensagem: "Quantidade atualizada." });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao atualizar item.", detalhes: error.message });
    }
};

// DELETE /api/carrinho/remover
export const removerItem = async (req, res) => {
    const { produtoId, clienteId } = req.query; // Ex: ?produtoId=X&clienteId=Y

    try {
        const carrinho = await getCarrinhoUsuario(clienteId);
        const afetados = await models.ItemCarrinho.destroy({
            where: { ID_carrinho: carrinho.ID_carrinho, Produto_ID: produtoId }
        });

        if (afetados === 0) {
            return res.status(404).json({ mensagem: "Item não encontrado." });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao remover item.", detalhes: error.message });
    }
};