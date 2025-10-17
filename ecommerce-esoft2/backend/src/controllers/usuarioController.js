import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';

//Função utilitária para remover a senha do objeto de resposta


//[POST] Endpoint de Cadastro de Cliente
const cadastrarCliente = async (req, res) => {
  const { nome, email, senha, cpf, telefone, dataNasc } = req.body;
  
  try {
    const usuarioExiste = await Usuario.findOne({ email });
    
    if(usuarioExiste){
      return res.status(400).json({ mensagem: 'Usuário com este email já existe.' });
    }

    // APLICANDO HASH NA SENHA (Bcrypt)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoCliente = await Usuario.create({
      nome, email, senha: senhaHash, telefone, dataNasc, cpf,
      tipoUsuario: 'Cliente',
    });

    res.status(201).json(formatUsuarioResponse(novoCliente));

  } catch(error){
    res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.', detalhes: error.message });
  }
};

//[POST] Endpoint de Cadastro de Vendedor
const cadastrarVendedor = async (req, res) => {
    const {nome, email, senha, telefone, areaResponsavel} = req.body;
    
    try{
        const usuarioExiste = await Usuario.findOne({ email });
        
        if (usuarioExiste) {
            return res.status(400).json({ mensagem: 'Vendedor com este email já existe.' });
        }

        // APLICANDO HASH NA SENHA
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const novoVendedor = await Usuario.create({
            nome, email, senha: senhaHash, telefone, areaResponsavel,
            tipoUsuario: 'Vendedor',
        });

        res.status(201).json(formatUsuarioResponse(novoVendedor));
    }catch(error){
        res.status(500).json({ mensagem: 'Erro ao cadastrar vendedor.', detalhes: error.message });
    }
}

//[GET] Endpoint de Listagem de Clientes
const listarClientes = async(req, res) => {
    try{
        const clientes = await Usuario.find({ tipoUsuario: 'Cliente', ativo: true}).select('-senha -__v');
        res.status(200).json(clientes);        
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar clientes.', detalhes: error.message });
    }
};

//[GET] Endpoint de Listagem de Vendedores
const listarVendedores = async (req, res) => {
    try {
        const vendedores = await Usuario.find({ tipoUsuario: 'Vendedor', ativo: true }).select('-senha -__v');
        res.status(200).json(vendedores);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar vendedores.', detalhes: error.message });
    }
};

export { cadastrarCliente, cadastrarVendedor, listarClientes, listarVendedores };