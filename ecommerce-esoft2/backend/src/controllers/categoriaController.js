import Categoria from '../models/Categoria.js';

//[POST] Endpoint de Cadastro
const cadastrarCategoria = async (req, res) => {
  const { nome, descricao, categoriaPai } = req.body;
  
  try {
    const novaCategoria = await Categoria.create({ nome, descricao, categoriaPai });
    res.status(201).json(novaCategoria);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar categoria.', detalhes: error.message });
  }
};

// [GET] Endpoint de Listagem
const listarCategorias = async (req, res) => {
    try {
        // Popula a categoriaPai para mostrar a relação
        const categorias = await Categoria.find({}).populate('categoriaPai', 'nome');
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar categorias.', detalhes: error.message });
    }
};

export { cadastrarCategoria, listarCategorias };