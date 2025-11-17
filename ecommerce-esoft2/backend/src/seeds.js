// backend/src/seeds.js (VERSÃO FINAL COMPLETA - Garante E-mail Único)

import { sequelize, models } from './config/db.js';
import { faker } from '@faker-js/faker/locale/pt_BR';

// IDs das subcategorias que VAMOS CRIAR (Camisetas, Polo, Jeans, Bermudas, Bonés)
const CATEGORIA_IDS = [4, 5, 6, 7, 8];

// IDs dos Tipos de Usuário que VAMOS CRIAR
const TIPO_CLIENTE_ID = 1;
const TIPO_VENDEDOR_ID = 2;

// Arrays de dados para gerar produtos realistas
const MARCAS = ["Tribo Urbana", "Hype", "Basic", "Flow", "Urban", "Element", "Core"];
const TIPOS_CAMISETA = ["Estampada", "Básica", "Gola V", "Regata", "Manga Longa", "Oversized"];
const TIPOS_JEANS = ["Slim Fit", "Reta", "Skinny", "Destroyed", "Comfort", "Baggy"];
const TIPOS_BERMUDA = ["Sarja", "Moletom", "Cargo", "Chino", "Jeans"];
const TIPOS_POLO = ["Piquet", "Malha", "Listrada", "Lisa"];
const TIPOS_BONE = ["Aba Curva", "Aba Reta", "Trucker", "Dad Hat"];
const CORES = ["Preta", "Branca", "Cinza Mescla", "Azul Marinho", "Vermelha", "Verde Musgo", "Bege"];
const LAVAGENS_JEANS = ["Clássica", "Escura", "Destroyed", "Delavê"];

// --- NOSSAS FUNÇÕES "FÁBRICA" ---

const gerarTelefone = () => `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`;

// 1. (MUDANÇA) Adicionado 'i' (índice) para garantir email único
async function criarVendedor(area, i) { 
    const nome = faker.person.firstName();
    const sobrenome = faker.person.lastName();

    const usuario = await models.Usuario.create({
        Nome: `${nome} ${sobrenome} (Vendedor)`,
        // 2. (MUDANÇA) Adicionado 'i' ao sobrenome para o email
        Email: faker.internet.email({ firstName: nome, lastName: `${sobrenome}${i}`, provider: 'loja.com' }),
        Senha_hash: '$2a$10$fakehash...senha123',
        Telefone: gerarTelefone(), Data_cadastro: new Date(), TipoUsuario_ID: TIPO_VENDEDOR_ID, Ativo: true,
    });
    
    await models.Vendedor.create({
        ID_usuario: usuario.ID_usuario, AreaResponsavel: area,
    });
    return usuario;
}

// 3. (MUDANÇA) Adicionado 'i' (índice) para garantir email único
async function criarCliente(i) {
    const nome = faker.person.firstName();
    const sobrenome = faker.person.lastName();

    const usuario = await models.Usuario.create({
        Nome: `${nome} ${sobrenome}`,
        // 4. (MUDANÇA) Adicionado 'i' ao sobrenome para o email
        Email: faker.internet.email({ firstName: nome, lastName: `${sobrenome}${i}`, provider: 'cliente.com' }),
        Senha_hash: '$2a$10$fakehash...senha123',
        Telefone: gerarTelefone(), Data_cadastro: new Date(), TipoUsuario_ID: TIPO_CLIENTE_ID, Ativo: true,
    });
    
    await models.Cliente.create({
        ID_usuario: usuario.ID_usuario,
        CPF: faker.string.numeric(11), // Correção do CPF
        DataNasc: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    });
    return usuario;
}

// Função 'criarProduto' não recebe mais 'vendedorId'
async function criarProduto() {
    const catId = faker.helpers.arrayElement(CATEGORIA_IDS);
    let nomeProduto = '';

    switch (catId) {
        case 4: 
            nomeProduto = `Camiseta ${faker.helpers.arrayElement(TIPOS_CAMISETA)} ${faker.helpers.arrayElement(MARCAS)} (${faker.helpers.arrayElement(CORES)})`;
            break;
        case 5: 
            nomeProduto = `Camisa Polo ${faker.helpers.arrayElement(TIPOS_POLO)} (${faker.helpers.arrayElement(CORES)})`;
            break;
        case 6: 
            nomeProduto = `Calça Jeans ${faker.helpers.arrayElement(TIPOS_JEANS)} (${faker.helpers.arrayElement(LAVAGENS_JEANS)})`;
            break;
        case 7: 
            nomeProduto = `Bermuda ${faker.helpers.arrayElement(TIPOS_BERMUDA)} (${faker.helpers.arrayElement(CORES)})`;
            break;
        case 8: 
            nomeProduto = `Boné ${faker.helpers.arrayElement(TIPOS_BONE)} (${faker.helpers.arrayElement(CORES)})`;
            break;
        default:
            nomeProduto = "Produto Genérico"; // Fallback
    }

    await models.Produto.create({
        Nome: nomeProduto,
        Descricao: `Produto de alta qualidade: ${nomeProduto}. 100% Algodão.`,
        Preco: faker.commerce.price({ min: 79, max: 350, dec: 2 }),
        Estoque: faker.number.int({ min: 20, max: 200 }),
        Ativo: true, 
        Categoria_ID: catId, 
        Vendedor_ID: null // Vendedor_ID agora é nulo
    });
}

// --- FUNÇÕES DE CONTROLE DO SCRIPT ---

async function limparBanco() {
    console.log("Desligando verificação de chaves estrangeiras...");
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    console.log("Limpando (TRUNCATE) tabelas...");
    const tabelasParaLimpar = [
        'ImagemProduto', 'Produto', 'Categoria', 
        'Cliente', 'Vendedor', 'Usuario'
        // Deixamos TipoUsuario de fora de propósito
    ];
    
    for (const tabela of tabelasParaLimpar) {
        await sequelize.query(`TRUNCATE TABLE ${tabela}`);
    }
    
    console.log("Ligando verificação de chaves estrangeiras...");
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Banco limpo!");
}

async function criarDadosBase() {
    console.log("Criando Tipos de Usuário...");
    // O 'ignore' previne erro se eles já existirem
    await models.TipoUsuario.bulkCreate([
        { ID_Tipo: TIPO_CLIENTE_ID, Nome: 'Cliente' },
        { ID_Tipo: TIPO_VENDEDOR_ID, Nome: 'Vendedor' },
        { ID_Tipo: 3, Nome: 'Administrador' },
        { ID_Tipo: 4, Nome: 'ResponsavelLogistica' }
    ], { ignoreDuplicates: true });

    console.log("Criando Categorias Base...");
    // Categorias Raiz
    await models.Categoria.bulkCreate([
        { ID_categoria: 1, Nome: 'Camisas', Descricao: 'Camisetas, camisas polo e sociais.', Categoria_pai_ID: null },
        { ID_categoria: 2, Nome: 'Calças', Descricao: 'Jeans, sarja e bermudas.', Categoria_pai_ID: null },
        { ID_categoria: 3, Nome: 'Acessórios', Descricao: 'Bonés, cintos e carteiras.', Categoria_pai_ID: null }
    ]);
    
    // Sub-Categorias (com os IDs que o 'criarProduto' espera)
    await models.Categoria.bulkCreate([
        { ID_categoria: 4, Nome: 'Camisetas', Descricao: 'Camisetas básicas e estampadas.', Categoria_pai_ID: 1 },
        { ID_categoria: 5, Nome: 'Camisas Polo', Descricao: 'Polos de piquet e algodão.', Categoria_pai_ID: 1 },
        { ID_categoria: 6, Nome: 'Jeans', Descricao: 'Calças jeans de diversas lavagens.', Categoria_pai_ID: 2 },
        { ID_categoria: 7, Nome: 'Bermudas', Descricao: 'Bermudas de sarja e moletom.', Categoria_pai_ID: 2 },
        { ID_categoria: 8, Nome: 'Bonés', Descricao: 'Bonés aba curva e aba reta.', Categoria_pai_ID: 3 }
    ]);
    
    console.log("✅ Dados base (Tipos e Categorias) criados!");
}


// --- O SCRIPT PRINCIPAL ---

const popularBanco = async () => {
    try {
        console.log("Iniciando script de povoamento...");
        await sequelize.authenticate();
        console.log("Conexão estabelecida.");

        // --- QUANTIDADES ---
        const TOTAL_VENDEDORES = 10;
        const TOTAL_CLIENTES = 200;
        const TOTAL_PRODUTOS = 400;
        // -------------------

        // 1. LIMPA O BANCO
        await limparBanco();
        
        // 2. CRIA OS DADOS ESSENCIAIS
        await criarDadosBase();

        // 3. CRIA OS VENDEDORES
        console.log(`\nCriando ${TOTAL_VENDEDORES} Vendedores...`);
        const vendedoresCriados = [];
        const areasVenda = ["Camisetas", "Calças", "Acessórios", "Estoque", "Gerência", "Social", "Esportivo", "Tênis", "Relógios", "Básico"];
        for (let i = 0; i < TOTAL_VENDEDORES; i++) {
            // 5. (MUDANÇA) Passando 'i' para a função
            const vendedor = await criarVendedor(areasVenda[i % areasVenda.length], i);
            vendedoresCriados.push(vendedor);
        }
        console.log("✅ Vendedores criados!");

        // 4. CRIA OS CLIENTES
        console.log(`\nCriando ${TOTAL_CLIENTES} Clientes...`);
        const promessasClientes = [];
        for (let i = 0; i < TOTAL_CLIENTES; i++) {
            // 6. (MUDANÇA) Passando 'i' para a função
            promessasClientes.push(criarCliente(i));
        }
        await Promise.all(promessasClientes);
        console.log("✅ Clientes criados!");
        
        // 5. CRIA OS PRODUTOS
        console.log(`\nCriando ${TOTAL_PRODUTOS} Produtos...`);
        const promessasProdutos = [];
        for (let i = 0; i < TOTAL_PRODUTOS; i++) {
            promessasProdutos.push(criarProduto()); // Não passa mais ID de vendedor
        }
        await Promise.all(promessasProdutos); 
        console.log("✅ Produtos criados!");


        console.log("\n-----------------------------------------");
        console.log("🎉 BANCO POPULADO COM SUCESSO! 🎉");
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("\n❌ ERRO AO POPULAR O BANCO:", error);
    } finally {
        // Fecha a conexão para o script terminar
        await sequelize.close();
    }
};

// Inicia o script
popularBanco();