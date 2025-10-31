import React, { useState, useEffect } from 'react';
import CategoriaService from '../services/CategoriaService';
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
    MenuItem
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send'; // Ícone do botão

function CadastroCategoria() {
    const [formData, setFormData] = useState({ nome: '', descricao: '', categoriaPai: '' });
    const [categorias, setCategorias] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // (Sua lógica 'useEffect' e 'handleChange' permanece a mesma)
    useEffect(() => {
        CategoriaService.listarCategorias()
            .then(response => {
                setCategorias(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => console.error("Erro ao buscar categorias:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // (Sua lógica 'handleSubmit' permanece a mesma)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const dataToSubmit = {
            ...formData,
            categoriaPai: formData.categoriaPai || null
        };

        try {
            await CategoriaService.cadastrarCategoria(dataToSubmit);
            setMessage('Categoria cadastrada com sucesso!');
            setFormData({ nome: '', descricao: '', categoriaPai: '' });
            
            const response = await CategoriaService.listarCategorias();
            setCategorias(response.data);

        } catch (error) {
            const errorMsg = error.response?.data?.mensagem || 'Erro ao cadastrar categoria.';
            setMessage(errorMsg);
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
                        Cadastro de Categoria
                    </Typography>
                    
                    {/* Mensagem de Alerta (Sucesso/Erro) */}
                    {message && (
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
                        {/* Nome da Categoria (TextField) */}
                        <TextField 
                            label="Nome da Categoria" 
                            name="nome" 
                            value={formData.nome} 
                            onChange={handleChange} 
                            required 
                            fullWidth
                        />
                        
                        {/* Descrição (TextField multiline) */}
                        <TextField 
                            label="Descrição" 
                            name="descricao" 
                            value={formData.descricao} 
                            onChange={handleChange} 
                            fullWidth
                            multiline 
                            rows={4}      
                        />
                        
                        {/* Categoria Pai (TextField select) */}
                        <TextField 
                            label="Categoria Pai"
                            name="categoriaPai"
                            value={formData.categoriaPai} 
                            onChange={handleChange} 
                            fullWidth
                            select 
                        >
                            <MenuItem value="">
                                <em>Nenhuma (Categoria Raiz)</em>
                            </MenuItem>
                            {categorias.map(cat => (
                                <MenuItem key={cat._id} value={cat._id}>
                                    {cat.nome}
                                </MenuItem>
                            ))}
                        </TextField>

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
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar Categoria'}
                        </Button>
                    </Box>

                    {/* Link para Ver Categorias */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link to="/categorias" style={{ textDecoration: 'none' }}>
                             <Typography color="primary" variant="body2">
                                 Ver Categorias Cadastradas
                             </Typography>
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default CadastroCategoria;