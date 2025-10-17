// 1. IMPORTAÇÕES
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Pacote para carregar variáveis de ambiente

// Carrega as variáveis de ambiente do .env imediatamente
dotenv.config(); 

import connectDB from './config/db.js'; // Conexão DB

// Importa as Rotas
import usuarioRoutes from './routes/usuarioRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';


// 2. CONEXÃO E INICIALIZAÇÃO
// Chama a função para conectar ao DB (a função já cuida de erros e logs)
connectDB(); 

const app = express();
const PORT = process.env.PORT || 3001; // Lê a porta do .env ou usa 3001


// 3. MIDDLEWARES ESSENCIAIS (Antes das Rotas) especificamente
// Middleware CORS: Permite que o Front-end (5173) se comunique com o Back-end (3001)
app.use(cors({
    origin: 'http://localhost:5173' 
}));

// Middleware Body Parser: Permite que o Express leia JSON do corpo da requisição POST
app.use(express.json()); 


// 4. ROTAS
// Rota de Teste Simples (Health Check)
app.get('/', (req, res) => {
    res.send('API- TRIBO Eccomerce está funcionando! Porta: ' + PORT);
});

// MAPEAMENTO DAS ROTAS DA API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/produtos', produtoRoutes);


// 5. INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
