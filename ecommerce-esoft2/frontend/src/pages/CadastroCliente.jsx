// frontend/src/pages/CadastroCliente.jsx (CORRIGIDO)

import React, { useState } from 'react';
import UsuarioService from '../services/UsuarioService';
import { Link, useNavigate } from 'react-router-dom';

import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function CadastroCliente() {

    const navigate = useNavigate();
    
    // 1. (MUDANÇA) O estado usa os nomes da API SQL
    const [formData, setFormData] = useState({
        Nome: '', Email: '', Senha: '', CPF: '', Telefone: '', DataNasc: '',
    });
    
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

   const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            // 'formData' já está no formato correto que o backend (corrigido) espera
            await UsuarioService.cadastrarCliente(formData);
            
            // 2. (MUDANÇA) Mensagem de sucesso para o Alert
            setMessage('✅ Cliente cadastrado com sucesso!');
            
            // 3. (MUDANÇA) Resetar o formulário com os nomes corretos
            setFormData({ Nome: '', Email: '', Senha: '', CPF: '', Telefone: '', DataNasc: '' });
            
            setTimeout(() => navigate('/clientes'), 1500);

        } catch (error) {
            const errorMsg = error.response?.data?.mensagem || 'Falha de conexão com a API.';
            const errorStatus = error.response?.status;
            
            setMessage(`Erro ao cadastrar cliente. Status: ${errorStatus || 'N/A'}. Mensagem: ${errorMsg}`);
            
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                width: '100%', // Garante que o 'pai' ocupe a largura toda
                
                // --- A MÁGICA ESTÁ AQUI ---
                display: 'flex',
                justifyContent: 'center', // Centraliza horizontalmente
                alignItems: 'center',     // Centraliza verticalmente
                // -------------------------

                // Bônus: Pega a cor de fundo do seu tema e adiciona um padding
                backgroundColor: 'background.default', 
                color: 'text.primary', 
                py: 4, // Padding vertical (para rolagem em telas pequenas)
            }}
        >
            <Box 
                sx={{
                    width: '100%',
                    maxWidth: 500, 
                    padding: 2, 
                }}
            >
                
                {/* Logo (Não esqueça de adicionar o seu componente de Logo aqui!) */}
                <Box
                    component="img"
                    src="/tribo" // <-- NOME DO ARQUIVO DA LOGO (como nos seus outros arquivos)
                    alt="Logo da Loja"
                    sx={{
                        width: 'auto',      
                        maxHeight: '120px', 
                        mb: 3,             
                        display: 'block',  
                        mx: 'auto'         
                    }}
                />
                
                <Paper 
                    elevation={10} 
                    sx={{ 
                        padding: 5, 
                    }}
                >
                    <Typography 
                        variant="h4" 
                        component="h1" // <-- Adicionado para semântica
                        gutterBottom     // <-- Adicionado para espaçamento
                        align="center" 
                        color="text.primary"
                        sx={{ mb: 4 }} 
                    >
                        Cadastro de Cliente
                    </Typography>
                    
                    {message && (
                        <Alert 
                            severity={message.startsWith('✅') ? 'success' : 'error'} 
                            sx={{ mb: 2 }}
                        >
                            {message}
                        </Alert>
                    )}

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        
                        <TextField 
                            label="Nome" 
                            name="Nome" 
                            value={formData.Nome} 
                            onChange={handleChange} 
                            required 
                            fullWidth
                        />
                        <TextField 
                            label="Email" 
                            name="Email" 
                            type="email" 
                            value={formData.Email} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
                        />
                        <TextField 
                            label="Senha" 
                            name="Senha" 
                            type="password" 
                            value={formData.Senha} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
                        />
                        <TextField 
                            label="CPF" 
                            name="CPF" 
                            value={formData.CPF} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            label="Telefone" 
                            name="Telefone" 
                            type="tel" 
                            value={formData.Telefone} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            label="Data de Nascimento" 
                            name="DataNasc" 
                            type="date" 
                            value={formData.DataNasc} 
                            onChange={handleChange} 
                            fullWidth 
                            InputLabelProps={{ shrink: true }}
                        />
                        
                        <Button 
                            type="submit" 
                            disabled={loading}
                            variant="outlined" 
                            color="primary" 
                            endIcon={!loading && <SendIcon />} 
                            size="large" 
                            sx={{ mt: 1 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar Cliente'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link to="/clientes" style={{ textDecoration: 'none' }}>
                             <Typography color="primary" variant="body2">Ver Clientes</Typography>
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default CadastroCliente;