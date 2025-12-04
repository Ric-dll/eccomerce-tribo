import { models, sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

// Pegamos os modelos pelo nome para facilitar
const { Usuario, Cliente, Vendedor, TipoUsuario } = models;

// Função utilitária (não exportada) para formatar a resposta
// Agora precisa de JOIN
const getUsuarioFormatado = async (usuarioId) => {
    const usuario = await Usuario.findByPk(usuarioId, {
        // Faz o JOIN com TipoUsuario, Cliente e Vendedor
        include: [
            { model: TipoUsuario, as: 'tipoUsuario' },
            { model: Cliente, as: 'clienteInfo' },
            { model: Vendedor, as: 'vendedorInfo' }
        ],
        // Exclui o hash da senha
        attributes: { exclude: ['Senha_hash'] }
    });
    return usuario;
};

// [POST] Endpoint de Cadastro de Cliente
const cadastrarCliente = async (req, res) => {
    // (MUDANÇA): Agora esperamos os campos com nomes do BD
    const { Nome, Email, Senha, Telefone, CPF, DataNasc } = req.body;
  
    const t = await sequelize.transaction();

    try {
        const usuarioExiste = await Usuario.findOne({ where: { Email: Email } }); // Usa Email
        if(usuarioExiste){
            await t.rollback();
            return res.status(400).json({ mensagem: 'Usuário com este email já existe.' });
        }
        
        const tipoCliente = await TipoUsuario.findOne({ where: { Nome: 'Cliente' } });
        if (!tipoCliente) {
            await t.rollback();
            return res.status(500).json({ mensagem: 'Tipo de usuário "Cliente" não encontrado no banco de dados.' });
        }

        // (MUDANÇA): Usamos a 'Senha' vinda do body
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        // (MUDANÇA): O mapeamento agora é direto
        const novoUsuario = await Usuario.create({
            Nome: Nome,
            Email: Email,
            Senha_hash: senhaHash,
            Telefone: Telefone,
            Ativo: true,
            TipoUsuario_ID: tipoCliente.ID_Tipo,
            Data_cadastro: new Date()
        }, { transaction: t });

        // (MUDANÇA): Mapeamento direto
        await Cliente.create({
            ID_usuario: novoUsuario.ID_usuario,
            CPF: CPF,
            DataNasc: DataNasc
        }, { transaction: t });

        await t.commit();
        
        const usuarioFormatado = await getUsuarioFormatado(novoUsuario.ID_usuario);
        res.status(201).json(usuarioFormatado);

    } catch(error){
        await t.rollback();
        res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.', detalhes: error.message });
    }
};

// [POST] Endpoint de Cadastro de Vendedor
// [POST] Endpoint de Cadastro de Vendedor (CORRIGIDO)
const cadastrarVendedor = async (req, res) => {
    // Campos com nomes do BD
    const {Nome, Email, Senha, Telefone, AreaResponsavel} = req.body;
    
    const t = await sequelize.transaction();
    
    try{
        const usuarioExiste = await Usuario.findOne({ where: { Email: Email } });
        if (usuarioExiste) {
            await t.rollback();
            return res.status(400).json({ mensagem: 'Vendedor com este email já existe.' });
        }
        
        const tipoVendedor = await TipoUsuario.findOne({ where: { Nome: 'Vendedor' } });
        if (!tipoVendedor) {
            await t.rollback();
            return res.status(500).json({ mensagem: 'Tipo de usuário "Vendedor" não encontrado.' });
        }

        //Usamos a 'Senha'
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        //apeamento direto
        const novoUsuario = await Usuario.create({
            Nome: Nome, Email: Email, Senha_hash: senhaHash, Telefone: Telefone,
            Ativo: true, TipoUsuario_ID: tipoVendedor.ID_Tipo, Data_cadastro: new Date()
        }, { transaction: t });

        // (MUDANÇA): Mapeamento direto
        await Vendedor.create({
            ID_usuario: novoUsuario.ID_usuario,
            AreaResponsavel: AreaResponsavel
        }, { transaction: t });

        await t.commit();
        
        const usuarioFormatado = await getUsuarioFormatado(novoUsuario.ID_usuario);
        res.status(201).json(usuarioFormatado);
    }catch(error){
        await t.rollback();
        res.status(500).json({ mensagem: 'Erro ao cadastrar vendedor.', detalhes: error.message });
    }
}

// [GET] Endpoint de Listagem de Clientes
const listarClientes = async (req, res) => {
    try {
        const { search, sort, order } = req.query;

        const tipoCliente = await models.TipoUsuario.findOne({ where: { Nome: 'Cliente' } });
        
        let options = { 
            where: { 
                TipoUsuario_ID: tipoCliente.ID_Tipo, 
                Ativo: true 
            },
            attributes: { exclude: ['Senha_hash'] },
            include: [
                { model: models.Cliente, as: 'clienteInfo', required: true } 
            ],
            order: [['Nome', 'ASC']]
        };
        
        // Adiciona a busca ao 'where' que já existe
        if (search) {
            options.where.Nome = { [Op.like]: `%${search}%` };
        }

        // Adiciona ordenação
        const colunasValidas = ['Nome', 'Email', 'createdAt'];
        const ordemValida = (order && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
        if (sort && colunasValidas.includes(sort)) {
            options.order = [[sort, ordemValida]];
        }

        const clientes = await models.Usuario.findAll(options);
        res.status(200).json(clientes);        
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar clientes.', detalhes: error.message });
    }
};

// [GET] Endpoint de Listagem de Vendedores
const listarVendedores = async (req, res) => {
    try {
        const { search, sort, order } = req.query;

        const tipoVendedor = await models.TipoUsuario.findOne({ where: { Nome: 'Vendedor' } });

        let options = { 
            where: { 
                TipoUsuario_ID: tipoVendedor.ID_Tipo, 
                Ativo: true 
            },
            attributes: { exclude: ['Senha_hash'] },
            include: [
                { model: models.Vendedor, as: 'vendedorInfo', required: true }
            ],
            order: [['Nome', 'ASC']]
        };

        // Adiciona a busca ao 'where' que já existe
        if (search) {
            options.where.Nome = { [Op.like]: `%${search}%` };
        }

        // Adiciona ordenação
        const colunasValidas = ['Nome', 'Email', 'createdAt'];
        const ordemValida = (order && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
        if (sort && colunasValidas.includes(sort)) {
            options.order = [[sort, ordemValida]];
        }

        const vendedores = await models.Usuario.findAll(options);
        res.status(200).json(vendedores);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar vendedores.', detalhes: error.message });
    }
};

// (As funções 'listarClientes' e 'listarVendedores' estavam corretas)
export { cadastrarCliente, cadastrarVendedor, listarClientes, listarVendedores };