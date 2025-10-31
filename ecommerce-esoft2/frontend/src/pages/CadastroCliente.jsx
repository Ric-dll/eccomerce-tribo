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
    const [formData, setFormData] = useState({
        nome: '', email: '', senha: '', cpf: '', telefone: '', dataNasc: '',
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
            await UsuarioService.cadastrarCliente(formData);
            
            setMessage('Cliente cadastrado com sucesso!');
            setFormData({ nome: '', email: '', senha: '', cpf: '', telefone: '', dataNasc: '' });
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
                width: '100%',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'background.default', 
                color: 'text.primary', 
                // Adiciona padding vertical à página inteira para garantir espaço
                py: 4, 
            }}
        >
            <Box 
                sx={{
                    width: '100%',
                    maxWidth: 500, 
                    padding: 2, 
                }}
            >
                {}
                <Box
                    component="img"
                    src="/tribo" // <-- NOME DO ARQUIVO DA LOGO
                    alt="Logo da Loja"
                    sx={{
                        width: 'auto',      
                        maxHeight: '120px', // Altura máxima da logo
                        mb: 3,             // Margem inferior (separa do Paper)
                        display: 'block',  // Para centralizar com margin
                        mx: 'auto'         // Centraliza horizontalmente
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
                        component="h1" 
                        gutterBottom 
                        align="center" 
                        color="text.primary"
                        
                        sx={{ mb: 4 }} 
                    >
                        Cadastro de Cliente
                    </Typography>
                    
                    {message && (
                        <Alert 
                            severity={message.startsWith('Yes') ? 'success' : 'error'} 
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
                        {}
                        <TextField 
                            label="Nome" 
                            name="nome" 
                            value={formData.nome} 
                            onChange={handleChange} 
                            required 
                            fullWidth
                        />
                        <TextField 
                            label="Email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
                        />
                        <TextField 
                            label="Senha" 
                            name="senha" 
                            type="password" 
                            value={formData.senha} 
                            onChange={handleChange} 
                            required 
                            fullWidth 
                        />
                        <TextField 
                            label="CPF" 
                            name="cpf" 
                            value={formData.cpf} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            label="Telefone" 
                            name="telefone" 
                            type="tel" 
                            value={formData.telefone} 
                            onChange={handleChange} 
                            fullWidth 
                        />
                        <TextField 
                            label="Data de Nascimento" 
                            name="dataNasc" 
                            type="date" 
                            value={formData.dataNasc} 
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