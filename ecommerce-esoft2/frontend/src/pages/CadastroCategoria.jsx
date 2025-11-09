// frontend/src/pages/CadastroCategoria.jsx (CORRIGIDO)

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
    // 1. (MUDANÇA) O estado inicial agora usa os nomes da API SQL
    const [formData, setFormData] = useState({ 
        Nome: '', 
        Descricao: '', 
        Categoria_pai_ID: '' 
    });
    
    const [categorias, setCategorias] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        CategoriaService.listarCategorias()
            .then(response => {
                setCategorias(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => console.error("Erro ao buscar categorias:", error));
    }, []);

    // Esta função (handleChange) funciona como estava,
    // pois ela lê o 'name' do e.target
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        // 2. (MUDANÇA) Prepara os dados para envio com os nomes corretos
        const dataToSubmit = {
            ...formData,
            // Garante que o valor enviado seja 'null' se estiver vazio
            Categoria_pai_ID: formData.Categoria_pai_ID || null
        };

        try {
            await CategoriaService.cadastrarCategoria(dataToSubmit);
            
            // 3. (MUDANÇA) Mensagem de sucesso (usei um emoji para diferenciar)
            setMessage('✅ Categoria cadastrada com sucesso!');
            
            // 4. (MUDANÇA) Reseta o formulário para os novos nomes de estado
            setFormData({ Nome: '', Descricao: '', Categoria_pai_ID: '' });
            
            // Atualiza a lista
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
            <Box 
                sx={{
                    width: '100%',
                    maxWidth: 500, 
                    padding: 2, 
                }}
            >
                {/* ... (Seu Logo e Paper) ... */}
                <Paper 
                    elevation={10} 
                    sx={{ padding: 5 }}
                >
                    {/* ... (Seu Typography e Alert) ... */}
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
                        {/* 5. (MUDANÇA) O 'name' agora é "Nome" (maiúsculo) */}
                        <TextField 
                            label="Nome da Categoria" 
                            name="Nome" 
                            value={formData.Nome} 
                            onChange={handleChange} 
                            required 
                            fullWidth
                        />
                        
                        {/* 6. (MUDANÇA) O 'name' agora é "Descricao" (maiúsculo) */}
                        <TextField 
                            label="Descrição" 
                            name="Descricao" 
                            value={formData.Descricao} 
                            onChange={handleChange} 
                            fullWidth
                            multiline 
                            rows={4}      
                        />
                        
                        {/* 7. (MUDANÇA) O 'name' agora é "Categoria_pai_ID" */}
                        <TextField 
                            label="Categoria Pai"
                            name="Categoria_pai_ID"
                            value={formData.Categoria_pai_ID} 
                            onChange={handleChange} 
                            fullWidth
                            select 
                        >
                            <MenuItem value="">
                                <em>Nenhuma (Categoria Raiz)</em>
                            </MenuItem>
                            
                            {/* 8. (MUDANÇA) O 'key' e 'value' usam 'ID_categoria' */}
                            {categorias.map(cat => (
                                <MenuItem key={cat.ID_categoria} value={cat.ID_categoria}>
                                    {cat.Nome} {/* cat.Nome já deve estar correto vindo da API */}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* ... (Seu Botão e Link) ... */}
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