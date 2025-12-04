import { models, sequelize } from '../config/db.js';
import { Op } from 'sequelize';

// Importamos todos os modelos que vamos usar/incluirincluir
const { Produto, Usuario, Categoria, ImagemProduto, Vendedor } = models;

//[POST] Endpoint de Cadastro
const cadastrarProduto = async (req, res) => {
    // Usamos os nomes exatos das FKs do seu modelo
    const {Nome, Descricao, Preco, Estoque, Categoria_ID, imagens, Vendedor_ID = null} = req.body;

    const t = await sequelize.transaction();

    try{   
        // Validação de Referências (usamos .findByPk - Find By Primary Key)
        const categoriaExiste = await Categoria.findByPk(Categoria_ID);
        if(!categoriaExiste){
            await t.rollback();
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }
        
        // O Vendedor_ID é o ID da tabela Vendedor (que é o mesmo ID_usuario)
        // const vendedorExiste = await Vendedor.findByPk(Vendedor_ID);
        // if(!vendedorExiste){
        //     await t.rollback();
        //     return res.status(404).json({ mensagem: 'Vendedor não encontrado.' });
        // }
        
        // 1. Criar o Produto
        // const novoProduto = await Produto.create({ 
        //     Nome, Descricao, Preco, Estoque, Categoria_ID, 
        //     Vendedor_ID, // Vendedor_ID agora é obrigatório (required: true no Mongoose)
        //     Ativo: true 
        // }, { transaction: t });

        const novoProduto = await Produto.create({ 
            Nome, Descricao, Preco, Estoque, Categoria_ID, 
            Vendedor_ID: Vendedor_ID, // Agora é opcional (pode ser null)
            Ativo: true 
        }, { transaction: t });

        // 2. Criar as Imagens (se existirem)
        if (imagens && Array.isArray(imagens) && imagens.length > 0) {
            const imagensParaCriar = imagens.map(img => ({
                URL: img.url,
                Ordem: img.ordem || 0,
                Produto_ID: novoProduto.ID_produto // Link com o produto
            }));
            
            await ImagemProduto.bulkCreate(imagensParaCriar, { transaction: t });
        }

        // 3. Commit
        await t.commit();

        // 4. Busca o produto completo para retornar
        const produtoCompleto = await Produto.findByPk(novoProduto.ID_produto, {
            include: [
                { model: Categoria, as: 'categoria', attributes: ['ID_categoria', 'Nome'] },
                { 
                    model: Vendedor, 
                    as: 'vendedor',
                    // Inclui o 'Usuario' base para pegar o nome
                    include: [{
                        model: Usuario,
                        as: 'usuarioBase',
                        attributes: ['Nome', 'Email']
                    }]
                },
                { model: ImagemProduto, as: 'imagens', attributes: ['ID_imagem', 'URL', 'Ordem'] }
            ]
        });

        res.status(201).json(produtoCompleto);

    }catch(error){
        await t.rollback();
        res.status(500).json({ mensagem: 'Erro ao cadastrar produto.', detalhes: error.message });
    }
};

//[GET] Endpoint de Listagem
const listarProdutos = async (req, res) => {
    try {
        // 1. LÊ OS QUERY PARAMS DA URL
        // Ex: /api/produtos?search=nome&sort=Preco&order=DESC
        const { search, sort, order } = req.query;

        // 2. MONTA A BASE DA QUERY
        // (Mantém os 'includes' que já tínhamos para Categoria, Vendedor e Imagens)
        let options = {
            include: [
                { 
                    model: models.Categoria, 
                    as: 'categoria',
                    attributes: ['ID_categoria', 'Nome']
                }, 
                { 
                    model: models.Vendedor, 
                    as: 'vendedor',
                    attributes: ['ID_usuario', 'AreaResponsavel'], 
                    include: [{ 
                        model: models.Usuario,
                        as: 'usuarioBase',
                        attributes: ['Nome', 'Email']
                    }]
                },
                {
                    model: models.ImagemProduto,
                    as: 'imagens',
                    attributes: ['ID_imagem', 'URL', 'Ordem']
                }
            ],
            order: [['Nome', 'ASC']]
        };

        // 3. ADICIONA O FILTRO DE BUSCA (SE EXISTIR)
        if (search) {
            options.where = {
                Nome: {
                    [Op.like]: `%${search}%` // Op.like é o "LIKE" do SQL (Ex: %camiseta%)
                }
            };
        }

        // 4. ADICIONA A ORDENAÇÃO (SE EXISTIR)
        // (Validamos para permitir ordenar apenas por colunas seguras)
        const colunasValidas = ['Nome', 'Preco', 'Estoque', 'createdAt', 'updatedAt'];
        const ordemValida = (order && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';

        if (sort && colunasValidas.includes(sort)) {
            options.order = [
                [sort, ordemValida] // Ex: [['Preco', 'ASC']]
            ];
        }

        // 5. EXECUTA A CONSULTA
        const produtos = await models.Produto.findAll(options);
            
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar produtos.', detalhes: error.message });
    }
};

export { cadastrarProduto, listarProdutos };