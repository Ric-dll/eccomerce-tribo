// frontend/src/pages/CadastroVendedor.jsx (CORRIGIDO E COMPLETO)

import React, { useState } from 'react';
import UsuarioService from '../services/UsuarioService';
import { Link } from 'react-router-dom';

// --- Importações do Material UI ---
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send'; // Ícone do botão

function CadastroVendedor() {
    // 1. (MUDANÇA) Estado do formulário usa os nomes da API SQL
    const [formData, setFormData] = useState({
        Nome: '',
        Email: '',
        Senha: '',
        Telefone: '',
        AreaResponsavel: '', // Antes era 'areaResponsavel'
    });
    
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // O 'handleChange' genérico continua funcionando perfeitamente
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            // O 'formData' já está no formato correto que o backend espera
            await UsuarioService.cadastrarVendedor(formData);
            
            // 2. (MUDANÇA) Mensagem de sucesso padronizada
            setMessage('✅ Vendedor cadastrado com sucesso!');
            
            // 3. (MUDANÇA) Resetar o formulário com os nomes corretos
            setFormData({ Nome: '', Email: '', Senha: '', Telefone: '', AreaResponsavel: '' });

        } catch (error) {
            // Caminho de erro (o backend retornou 400, 500, etc.)
            const errorMsg = error.response?.data?.mensagem || 'Falha de conexão com a API.';
            const errorStatus = error.response?.status;
            
            setMessage(`Erro ao cadastrar vendedor. Status: ${errorStatus || 'N/A'}. Mensagem: ${errorMsg}`);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        // Box de Fundo (preto, centralizado)
        <Box 
            sx={{ 
                minHeight: '100vh', 
                width: '100%',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'background.default', 
                color: 'text.primary', 
                py: 4, 
            }}
        >
            {/* Box de Conteúdo (limita a largura) */}
            <Box 
                sx={{
                    width: '100%',
                    maxWidth: 500, 
                    padding: 2, 
                }}
            >
                {/* Logo */}
                <Box
                    component="img"
                    src="/tribo"
                    alt="Logo da Loja"
                    sx={{
                        width: 'auto',      
                        maxHeight: '120px',
                        mb: 3,             
                        display: 'block',  
                        mx: 'auto'         
                    }}
                />
                
                {/* Container do Formulário (cinza escuro, bordas arredondadas) */}
                <Paper 
                    elevation={10} 
                    sx={{ padding: 5 }}
                >
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        align="center" 
                        color="text.primary"
                        sx={{ mb: 4 }} 
                    >
                        Cadastro de Vendedor
                    </Typography>
                    
                    {/* Mensagem de Alerta (Sucesso/Erro) */}
                    {message && (
                        // 4. (MUDANÇA) Lógica do Alert corrigida
                        <Alert 
                            severity={message.startsWith('✅') ? 'success' : 'error'} 
                            sx={{ mb: 2 }} 
                        >
                            {message}
                        </Alert>
                    )}

                    {/* Formulário */}
                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        {/* 5. (MUDANÇA) 'name' e 'value' dos TextFields atualizados */}
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
                            label="Telefone" 
                            name="Telefone" 
                            type="tel" 
                            value={formData.Telefone} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            label="Área Responsável" 
                            name="AreaResponsavel" 
                            value={formData.AreaResponsavel} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                        
                        {/* Botão de Cadastro (Outlined, Branco) */}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            variant="outlined" 
                            color="primary" 
                            endIcon={!loading && <SendIcon />} 
                            size="large" 
                            sx={{ mt: 1 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar Vendedor'}
                        </Button>
                    </Box>

                    {/* Link para Ver Vendedores */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link to="/vendedores" style={{ textDecoration: 'none' }}>
                             <Typography color="primary" variant="body2">
                                 Ver Vendedores
                             </Typography>
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default CadastroVendedor;