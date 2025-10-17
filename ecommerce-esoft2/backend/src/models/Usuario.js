//Implementa Usuario, Cliente e Vendedor em um único Schema, usando o campo tipoUsuario como discriminador

import mongoose, { mongo } from 'mongoose';

const usuarioEsquema = new mongoose.Schema({
    nome: {type: String, required:  [true, 'O nome é obrigatório'], trim: true},
    email: {type: String, required: [true, 'O email é obrigatório'], unique: true, lowercase: true},
    senha: {type: String, required: [true, 'A Senha é obrigatória']}, //Onde o hash será armazenado
    telefone: {type: String, trim: true},

    tipoUsuario: {
        type:String,
        enum: ['Cliente', 'Vendedor', 'Administrador', 'ResponsavelLogistica'],
        default: 'Cliente',
        required: true
    },

    ativo: {type: Boolean, default: true},

    //Campos específicos de Cliente
    cpf: {type: String, Unique: true, sparce: true},
    dataNasc: {type: Date},

    //Campos específicos de Vendedor
    areaResponsavel: {type: String},
    
}, {timestamps: true,}); //createdAt e updatedAt

const Usuario = mongoose.model('Usuario', usuarioEsquema);

export default Usuario;