// backend/src/controllers/CategoriaController.js

import { models } from '../config/db.js';
const { Categoria } = models;

//[POST] Endpoint de Cadastro
const cadastrarCategoria = async (req, res) => {
  // Agora usamos a FK do seu modelo: Categoria_pai_ID
  const { Nome, Descricao, Categoria_pai_ID } = req.body;
  
  try {
    const novaCategoria = await Categoria.create({ 
        Nome, 
        Descricao, 
        Categoria_pai_ID: Categoria_pai_ID || null 
    });
    res.status(201).json(novaCategoria);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar categoria.', detalhes: error.message });
  }
};

// [GET] Endpoint de Listagem
const listarCategorias = async (req, res) => {
    try {
        // O 'include' usa a associação 'categoriaPai' definida no db.js
        const categorias = await Categoria.findAll({
            include: [{
                model: Categoria,
                as: 'categoriaPai',
                attributes: ['ID_categoria', 'Nome'] // Seleciona campos do pai
            }]
        });
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar categorias.', detalhes: error.message });
    }
};

export { cadastrarCategoria, listarCategorias };