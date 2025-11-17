// backend/src/controllers/CategoriaController.js

import { models } from '../config/db.js';
const { Categoria } = models;
import { Op } from 'sequelize';

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
        const { search, sort, order } = req.query;

        let options = {
            include: [{
                model: models.Categoria,
                as: 'categoriaPai',
                attributes: ['ID_categoria', 'Nome'] 
            }],
            order: [['Nome', 'ASC']]
        };

        if (search) {
            options.where = {
                Nome: { [Op.like]: `%${search}%` }
            };
        }

        const ordemValida = (order && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
        if (sort === 'Nome') { // Aqui só permitimos ordenar por Nome
            options.order = [['Nome', ordemValida]];
        }

        const categorias = await models.Categoria.findAll(options);
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar categorias.', detalhes: error.message });
    }
};

export { cadastrarCategoria, listarCategorias };