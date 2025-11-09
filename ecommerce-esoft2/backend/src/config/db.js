// backend/src/config/db.js

import { Sequelize } from 'sequelize';
import 'dotenv/config';

// --- ADICIONE ISTO PARA DEPURAR ---
console.log("--- DEBUG DO .ENV ---");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PASS (Tipo):", typeof process.env.DB_PASS); // <-- Adicione isso
console.log("DB_PASS (Valor):", process.env.DB_PASS);     // <-- E isso
console.log("---------------------");
// ----------------------------------

// Importação dos Modelos 
import TipoUsuario from '../models/TipoUsuario.js';
import Usuario from '../models/Usuario.js';
import Cliente from '../models/Cliente.js';
import Vendedor from '../models/Vendedor.js';
import Categoria from '../models/Categoria.js';
import Produto from '../models/Produto.js';
import ImagemProduto from '../models/ImagemProduto.js';
// NOTA: Não vamos importar 'Administrador' ou 'ResponsavelLogistica'
// porque não tem controllers para eles ainda.

// 1. Configuração da Conexão
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASS === undefined || !process.env.DB_HOST) {
throw new Error("Variáveis de ambiente do banco de dados (DB_NAME, DB_USER, DB_HOST, DB_PASS) não estão definidas no .env!");}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        // Desativa a pluralização automática do Sequelize
        // Assim, o modelo 'Usuario' vai procurar a tabela 'Usuario'
        define: {
            freezeTableName: true, 
            timestamps: false  
        }
    }
);

// 2. Inicialização dos Modelos
// Colocamos todos em um objeto para facilitar a associação
const models = {
    TipoUsuario: TipoUsuario.init(sequelize, Sequelize),
    Usuario: Usuario.init(sequelize, Sequelize),
    Cliente: Cliente.init(sequelize, Sequelize),
    Vendedor: Vendedor.init(sequelize, Sequelize),
    Categoria: Categoria.init(sequelize, Sequelize),
    Produto: Produto.init(sequelize, Sequelize),
    ImagemProduto: ImagemProduto.init(sequelize, Sequelize),
};

// 3. Definição das Associações (Relações)
// Aqui recriamos CADA "chave estrangeira" do seu modelo lógico

// --- Relações de Usuário ---
// Usuario 1:1 TipoUsuario
models.TipoUsuario.hasMany(models.Usuario, { foreignKey: 'TipoUsuario_ID', as: 'usuarios' });
models.Usuario.belongsTo(models.TipoUsuario, { foreignKey: 'TipoUsuario_ID', as: 'tipoUsuario' });

// Herança (Subclasses) de Usuário
// Cliente 1:1 Usuario
models.Usuario.hasOne(models.Cliente, { foreignKey: 'ID_usuario', as: 'clienteInfo' });
models.Cliente.belongsTo(models.Usuario, { foreignKey: 'ID_usuario', as: 'usuarioBase' });

// Vendedor 1:1 Usuario
models.Usuario.hasOne(models.Vendedor, { foreignKey: 'ID_usuario', as: 'vendedorInfo' });
models.Vendedor.belongsTo(models.Usuario, { foreignKey: 'ID_usuario', as: 'usuarioBase' });

// --- Relações de Categoria ---
// Categoria (Recursiva)
models.Categoria.hasMany(models.Categoria, { foreignKey: 'Categoria_pai_ID', as: 'subCategorias' });
models.Categoria.belongsTo(models.Categoria, { foreignKey: 'Categoria_pai_ID', as: 'categoriaPai' });

// --- Relações de Produto ---
// Produto N:1 Categoria
models.Categoria.hasMany(models.Produto, { foreignKey: 'Categoria_ID', as: 'produtos' });
models.Produto.belongsTo(models.Categoria, { foreignKey: 'Categoria_ID', as: 'categoria' });

// Produto N:1 Vendedor
// NOTA: Seu modelo diz Vendedor_ID, então a FK é 'Vendedor', que herda 'ID_usuario'
models.Vendedor.hasMany(models.Produto, { foreignKey: 'Vendedor_ID', as: 'produtos' });
models.Produto.belongsTo(models.Vendedor, { foreignKey: 'Vendedor_ID', as: 'vendedor' });

// Produto 1:N ImagemProduto
models.Produto.hasMany(models.ImagemProduto, { foreignKey: 'Produto_ID', as: 'imagens' });
models.ImagemProduto.belongsTo(models.Produto, { foreignKey: 'Produto_ID', as: 'produto' });


console.log("(V) Modelos e associações inicializados.");

// 4. Função de Conexão
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`(V) MySQL Conectado: ${process.env.DB_HOST}`);
        
        // Sincroniza o banco. NÃO USE {force: true} ou {alter: true} em produção!
        // Como você já tem o modelo, o ideal é não usar .sync() e sim 'migrations'.
        // Mas para desenvolvimento, 'alter: true' ajuda a criar as tabelas.
        await sequelize.sync({ alter: true }); 
        console.log("(V) Modelos sincronizados com o banco de dados.");

    } catch (error) {
        console.error(`(X) Erro na Conexão com MySQL: ${error.message}`);
        process.exit(1);
    }
};

// Exportamos a instância do sequelize e os modelos inicializados
export { sequelize, connectDB, models };
export default sequelize;