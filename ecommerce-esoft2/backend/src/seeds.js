import { sequelize, models } from './config/db.js';
import { faker } from '@faker-js/faker/locale/pt_BR';

// IDs das subcategorias (Camisetas, Polo, Jeans, Bermudas, Bonés)
const CATEGORIA_IDS = [4, 5, 6, 7, 8];
const TIPO_CLIENTE_ID = 1;
const TIPO_VENDEDOR_ID = 2;

// --- DADOS RICOS (Do seu script antigo) ---
const MARCAS = ["Tribo Urbana", "Hype", "Basic", "Flow", "Urban", "Element", "Core", "Vibe", "Zenith"];
const TIPOS_CAMISETA = ["Estampada", "Básica", "Gola V", "Regata", "Manga Longa", "Oversized", "Slim"];
const TIPOS_JEANS = ["Slim Fit", "Reta", "Skinny", "Destroyed", "Comfort", "Baggy", "Jogger"];
const TIPOS_BERMUDA = ["Sarja", "Moletom", "Cargo", "Chino", "Jeans", "Surf"];
const TIPOS_POLO = ["Piquet", "Malha", "Listrada", "Lisa", "Com Bolso"];
const TIPOS_BONE = ["Aba Curva", "Aba Reta", "Trucker", "Dad Hat", "Snapback"];
const CORES = ["Preta", "Branca", "Cinza Mescla", "Azul Marinho", "Vermelha", "Verde Musgo", "Bege", "Amarela", "Vinho"];
const LAVAGENS_JEANS = ["Clássica", "Escura", "Destroyed", "Delavê", "Stone Washed", "Preta"];

// --- FUNÇÕES FÁBRICA ---

const gerarTelefone = () => `(11) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`;

async function criarVendedor(area, i) { 
    const nome = faker.person.firstName();
    const sobrenome = faker.person.lastName();
    const usuario = await models.Usuario.create({
        Nome: `${nome} ${sobrenome} (Vendedor)`,
        Email: faker.internet.email({ firstName: nome, lastName: `Vend${i}`, provider: 'loja.com' }),
        Senha_hash: '$2a$10$fakehash...senha123',
        Telefone: gerarTelefone(), Data_cadastro: new Date(), TipoUsuario_ID: TIPO_VENDEDOR_ID, Ativo: true,
    });
    await models.Vendedor.create({ ID_usuario: usuario.ID_usuario, AreaResponsavel: area });
    return usuario;
}

async function criarCliente(i) {
    const nome = faker.person.firstName();
    const sobrenome = faker.person.lastName();
    const usuario = await models.Usuario.create({
        Nome: `${nome} ${sobrenome}`,
        Email: faker.internet.email({ firstName: nome, lastName: `Cli${i}`, provider: 'cliente.com' }),
        Senha_hash: '$2a$10$fakehash...senha123',
        Telefone: gerarTelefone(), Data_cadastro: new Date(), TipoUsuario_ID: TIPO_CLIENTE_ID, Ativo: true,
    });
    await models.Cliente.create({
        ID_usuario: usuario.ID_usuario,
        CPF: faker.string.numeric(11), 
        DataNasc: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    });
    return usuario;
}

// Lógica RICA de criação de produtos
async function criarProduto() {
    const catId = faker.helpers.arrayElement(CATEGORIA_IDS);
    let nomeProduto = '';
    let descricaoProduto = '';

    // Seleciona nome baseado na categoria usando os arrays ricos
    switch (catId) {
        case 4: // Camisetas
            const tipoC = faker.helpers.arrayElement(TIPOS_CAMISETA);
            nomeProduto = `Camiseta ${tipoC} ${faker.helpers.arrayElement(MARCAS)} (${faker.helpers.arrayElement(CORES)})`;
            descricaoProduto = `Camiseta estilo ${tipoC} confeccionada em algodão de alta qualidade. Ideal para o dia a dia.`;
            break;
        case 5: // Polo
            const tipoP = faker.helpers.arrayElement(TIPOS_POLO);
            nomeProduto = `Camisa Polo ${tipoP} ${faker.helpers.arrayElement(MARCAS)} (${faker.helpers.arrayElement(CORES)})`;
            descricaoProduto = `Polo ${tipoP} elegante e confortável. Acabamento premium.`;
            break;
        case 6: // Jeans
            const tipoJ = faker.helpers.arrayElement(TIPOS_JEANS);
            const lavagem = faker.helpers.arrayElement(LAVAGENS_JEANS);
            nomeProduto = `Calça Jeans ${tipoJ} ${lavagem}`;
            descricaoProduto = `Jeans ${tipoJ} com lavagem ${lavagem}. Durabilidade e estilo para qualquer ocasião.`;
            break;
        case 7: // Bermudas
            const tipoB = faker.helpers.arrayElement(TIPOS_BERMUDA);
            nomeProduto = `Bermuda ${tipoB} ${faker.helpers.arrayElement(MARCAS)} (${faker.helpers.arrayElement(CORES)})`;
            descricaoProduto = `Bermuda ${tipoB} leve e versátil. Perfeita para dias quentes.`;
            break;
        case 8: // Bonés
            const tipoBo = faker.helpers.arrayElement(TIPOS_BONE);
            nomeProduto = `Boné ${tipoBo} ${faker.helpers.arrayElement(MARCAS)} (${faker.helpers.arrayElement(CORES)})`;
            descricaoProduto = `Boné estilo ${tipoBo} com ajuste regulável e bordado exclusivo.`;
            break;
    }

    return await models.Produto.create({
        Nome: nomeProduto,
        Descricao: descricaoProduto,
        Preco: faker.commerce.price({ min: 50, max: 300, dec: 2 }),
        Estoque: faker.number.int({ min: 50, max: 500 }), 
        Ativo: true, 
        Categoria_ID: catId, 
        Vendedor_ID: null
    });
}

// --- VENDAS HISTÓRICAS (O segredo do Dashboard) ---
async function criarVendasPassadas(clientes, produtos) {
    console.log("⏳ Gerando histórico de vendas...");
    const TOTAL_VENDAS_FAKE = 200; // Aumentei um pouco
    const vendasPromessas = [];

    for (let i = 0; i < TOTAL_VENDAS_FAKE; i++) {
        const dataVenda = faker.date.recent({ days: 30 });
        const cliente = faker.helpers.arrayElement(clientes);
        
        // Cada venda tem de 1 a 4 produtos
        const qtdItens = faker.number.int({ min: 1, max: 4 });
        const produtosEscolhidos = faker.helpers.arrayElements(produtos, qtdItens);
        
        let totalPedido = 0;
        const itensParaSalvar = [];

        for (const prod of produtosEscolhidos) {
            const qtd = faker.number.int({ min: 1, max: 3 });
            const preco = parseFloat(prod.Preco);
            totalPedido += (preco * qtd);

            itensParaSalvar.push({
                Quantidade: qtd,
                PrecoUnitario: preco,
                Produto_ID: prod.ID_produto
            });
        }

        const vendaProcesso = async () => {
            const pedido = await models.Pedido.create({
                DataPedido: dataVenda,
                Total: totalPedido,
                StatusPedido_ID: 4, // Entregue
                Cliente_ID: cliente.clienteInfo.ID_usuario,
                EnderecoEntrega_ID: 1
            });

            const itensComID = itensParaSalvar.map(item => ({ ...item, Pedido_ID: pedido.ID_pedido }));
            await models.ItemPedido.bulkCreate(itensComID);
        };
        vendasPromessas.push(vendaProcesso());
    }
    await Promise.all(vendasPromessas);
    console.log(`✅ ${TOTAL_VENDAS_FAKE} Vendas históricas criadas!`);
}

// --- CONTROLE DO SCRIPT ---

async function limparBanco() {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    // Limpa todas as tabelas (incluindo as de pedido)
    const tabelas = ['ItemPedido', 'Pedido', 'ItemCarrinho', 'Carrinho', 'ImagemProduto', 'Produto', 'Categoria', 'Cliente', 'Vendedor', 'Usuario'];
    for (const t of tabelas) await sequelize.query(`TRUNCATE TABLE ${t}`);
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("✅ Banco limpo!");
}

async function criarDadosBase() {
    await models.TipoUsuario.bulkCreate([
        { ID_Tipo: 1, Nome: 'Cliente' }, { ID_Tipo: 2, Nome: 'Vendedor' },
        { ID_Tipo: 3, Nome: 'Administrador' }, { ID_Tipo: 4, Nome: 'ResponsavelLogistica' }
    ], { ignoreDuplicates: true });

    await models.StatusPedido.bulkCreate([
        { ID_StatusPedido: 1, Nome: 'Aguardando Pagamento' },
        { ID_StatusPedido: 2, Nome: 'Processando' },
        { ID_StatusPedido: 3, Nome: 'Enviado' },
        { ID_StatusPedido: 4, Nome: 'Entregue' }, 
        { ID_StatusPedido: 5, Nome: 'Cancelado' }
    ], { ignoreDuplicates: true });

    await models.Categoria.bulkCreate([
        { ID_categoria: 1, Nome: 'Roupas', Categoria_pai_ID: null },
        { ID_categoria: 2, Nome: 'Calças', Categoria_pai_ID: null },
        { ID_categoria: 3, Nome: 'Acessórios', Categoria_pai_ID: null }
    ]);
    
    await models.Categoria.bulkCreate([
        { ID_categoria: 4, Nome: 'Camisetas', Categoria_pai_ID: 1 },
        { ID_categoria: 5, Nome: 'Camisas Polo', Categoria_pai_ID: 1 },
        { ID_categoria: 6, Nome: 'Jeans', Categoria_pai_ID: 2 },
        { ID_categoria: 7, Nome: 'Bermudas', Categoria_pai_ID: 2 },
        { ID_categoria: 8, Nome: 'Bonés', Categoria_pai_ID: 3 }
    ]);
    console.log("Dados base criados!");
}

const popularBanco = async () => {
    try {
        await sequelize.authenticate();
        await limparBanco();
        await criarDadosBase();

        // 1. Vendedores (5)
        const vendedores = [];
        for (let i = 0; i < 5; i++) vendedores.push(await criarVendedor("Geral", i));
        console.log("✅ Vendedores criados");

        // 2. Clientes (50)
        const clientes = [];
        for (let i = 0; i < 50; i++) {
            const usuario = await criarCliente(i);
            const clienteCompleto = await models.Usuario.findByPk(usuario.ID_usuario, {
                include: [{ model: models.Cliente, as: 'clienteInfo' }]
            });
            clientes.push(clienteCompleto);
        }
        console.log("Clientes criados");
        
        // 3. Produtos (150 - Aumentado para ter mais variedade)
        const produtos = [];
        for (let i = 0; i < 150; i++) produtos.push(await criarProduto());
        console.log("Produtos criados");

        // 4. VENDAS HISTÓRICAS
        await criarVendasPassadas(clientes, produtos);

        console.log("\n-----------------------------------------");
        console.log("  BANCO POPULADO: DADOS RICOS + VENDAS!  ");
        console.log("-----------------------------------------");

    } catch (error) {
        console.error("\n❌ ERRO:", error);
    } finally {
        await sequelize.close();
    }
};

popularBanco();