import Produto from '../models/Produto.js';
import Usuario from '../models/Usuario.js';
import Categoria from '../models/Categoria.js';

//[POST] Endpoint de Cadastro
const cadastrarProduto = async (req, res) => {
    const {nome, descricao, preco, estoque, categoria, vendedor, imagens} = req.body;

    try{   
        //Validação de Referências
        const categoriaExiste = await Categoria.findById(categoria);
        if(!categoriaExiste){
            return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
        }
        if (vendedor) {
            const vendedorExiste = await Usuario.findOne({_id: vendedor, tipoUsuario: 'Vendedor'});
            if(!vendedorExiste){
                return res.status(404).json({ mensagem: 'Vendedor não encontrado ou ID inválido.' });
            }
        }
        
        // O valor de 'vendedor' será undefined (se não foi enviado) ou o ID validado.
        // O Mongoose salva como null (ou não salva) porque o 'required: false' foi feito no modelo.
        const novoProduto = await Produto.create({ nome, descricao, preco, estoque, categoria, vendedor, imagens, ativo: true });

        res.status(201).json(novoProduto);

    }catch(error){
        res.status(500).json({ mensagem: 'Erro ao cadastrar produto.', detalhes: error.message });
    }
};

//[GET] Endpoint de Listagem
const listarProdutos = async (req, res) => {
    try {
        //Popula as referências para fornecer dados completos ao Front-end
        const produtos = await Produto.find({})
            .populate('categoria', 'nome') 
            .populate('vendedor', 'nome email');
            
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar produtos.', detalhes: error.message });
    }
};

export { cadastrarProduto, listarProdutos };