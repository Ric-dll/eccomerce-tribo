//Define o Produto, com referências para Categoria e Vendedor

import mongoose from 'mongoose';

const produtoEsquema = new mongoose.Schema({
    nome: {type: String, required: [true, 'O nome do produto é obrigatório'], trim: true},
    descricao: {type: String},
    preco: {type: Number, required: [true, 'O preco é obrgatório'], min: [0, 'O preço não pode ser negativo']},
    estoque: {type: Number, required: [true, 'O estoque é obrigatório'], min: [0, 'O estoque não pode ser negativo']},
    ativo: {type: Boolean, default: true},

    //Referências para outras coleções
    categoria: {type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true},
    vendedor: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', reqiured: true},

    //Subdocumentos
    imagens: [{
        url : {type: String, required: true},
        ordem: {type: Number},
    }],

}, {timestamps: true});

const Produto = mongoose.model('Produto', produtoEsquema);

export default Produto;