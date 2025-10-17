//Define a estrutura de Categorias, incluindo a referência recursiva para Categoria Pai

import mongoose from 'mongoose';

const categoriaEsquema = new mongoose.Schema({
    nome: {type: String, required: [true, 'O nome é obrigatório'], unique: true, trim: true},
    descricao: {type: String},

    categoriaPai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        default: null
    },
}, {timestamps: true,});

const Categoria = mongoose.model('Categoria', categoriaEsquema);

export default Categoria;