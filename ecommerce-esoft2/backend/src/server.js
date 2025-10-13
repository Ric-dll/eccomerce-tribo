const express = require('express');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Usa a porta 3001 definida no .env

// Rota de teste simples (health check)
app.get('/', (req, res) => {
    res.send('API funcionando! Porta: ' + PORT);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    // No futuro, a função de conexão com o MongoDB será chamada aqui.
});
