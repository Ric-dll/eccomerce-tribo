import React, { useState, useEffect } from 'react';
import ProdutoService from '../services/ProdutoService';
import CategoriaService from '../services/CategoriaService';
import { useNavigate } from 'react-router-dom';
import {
    Box, TextField, Button, Typography, Paper, Alert,
    CircularProgress, Grid, MenuItem, Container
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; 

function CadastroProduto() {
    const navigate = useNavigate(); 
    
    const [formData, setFormData] = useState({
        Nome: '', Descricao: '', Preco: '', Estoque: '', Categoria_ID: '',
    });
    
    const [categorias, setCategorias] = useState([]);

    const [message, setMessage] = useState('');
    
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        setLoading(true);
        CategoriaService.listarCategorias()
            .then(response => {
                setCategorias(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Erro ao buscar categorias:", error);
                setMessage("Erro ao carregar categorias. Tente recarregar.");
            })
            .finally(() => {
                setLoading(false); // Termina o loading
            });
    }, []);

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'Preco') {
            value = value.replace(',', '.');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true); // Usa o loading principal

        if (!formData.Categoria_ID) {
            setMessage('Por favor, selecione uma Categoria.');
            setLoading(false);
            return;
        }
    
        const dataToSend = {
            Nome: formData.Nome,
            Descricao: formData.Descricao,
            Preco: parseFloat(String(formData.Preco).replace(',', '.')), 
            Estoque: parseInt(formData.Estoque, 10),
            Categoria_ID: parseInt(formData.Categoria_ID, 10),
            // (O mock de imagens ainda está aqui)
            imagens: [
                { url: 'http://examplo.com/imagemQualquer.png', ordem: 0 },
                { url: 'http://examplo.com/imagemQualquer.png', ordem: 1 }
            ]
        };

        if (isNaN(dataToSend.Preco) || isNaN(dataToSend.Estoque) || isNaN(dataToSend.Categoria_ID)) {
             setMessage('Erro: Preço, Estoque ou Categoria inválidos.');
             setLoading(false);
             return;
        }
        
        try {
            await ProdutoService.cadastrarProduto(dataToSend);
            setMessage('✅ Produto cadastrado com sucesso! Redirecionando...');
            setFormData({ Nome: '', Descricao: '', Preco: '', Estoque: '', Categoria_ID: '' });
            setTimeout(() => navigate('/produtos'), 1500); 

        } catch (error) {
            const apiErrorMessage = error.response?.data?.mensagem || 
                                    error.response?.data?.error || 
                                    error.message;
            
            const customMsg = `Erro ao cadastrar produto. API respondeu: ${apiErrorMessage || 'Erro desconhecido.'}`;
            setMessage(customMsg);
        } finally {
            setLoading(false);
        }
    };
    
    // Tela de loading da página
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', color: 'primary.main' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* ... (Logo e Título) ... */}
            <Paper elevation={10} sx={{ padding: { xs: 3, md: 5 } }}>
                <Typography variant="h4" component="h1" align="center" color="text.primary" sx={{ mb: 4 }} >
                    Cadastrar Produto
                </Typography>
                
                {message && (
                    <Alert severity={message.startsWith('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={6}>
                            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                                Informações
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                
                                <TextField 
                                    label="Nome do Produto" name="Nome" 
                                    value={formData.Nome} onChange={handleChange} 
                                    required fullWidth
                                />
                                <TextField
                                    label="Descrição" name="Descricao" 
                                    rows={3} multiline
                                    value={formData.Descricao} onChange={handleChange} 
                                    fullWidth
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField 
                                            label="Preço (R$)" name="Preco" 
                                            type="text" placeholder="59,90" 
                                            value={formData.Preco} onChange={handleChange} 
                                            required fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                            label="Estoque" name="Estoque" 
                                            type="number" placeholder="150" 
                                            value={formData.Estoque} onChange={handleChange} 
                                            required fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <TextField 
                                    label="Categoria"
                                    name="Categoria_ID"
                                    value={formData.Categoria_ID} 
                                    onChange={handleChange} 
                                    required fullWidth select
                                >
                                    <MenuItem value="">Selecione...</MenuItem>
                                    {categorias.map(cat => (
                                        <MenuItem key={cat.ID_categoria} value={cat.ID_categoria}>
                                            {cat.Nome} 
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {/* --- CAMPO DE VENDEDOR FOI REMOVIDO PARA ESSA ÚLTIMA VERSÃO --- */}

                            </Box>
                        </Grid>
                        {/* ... (Coluna da Direita - Imagem Mock) ... */}
                    </Grid>

                    {/* --- BOTÕES DE AÇÃO --- */}
                    <Box sx={{
                        mt: 4, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
                        display: 'flex', justifyContent: 'flex-end', gap: 2, 
                    }}>
                        <Button 
                            variant="text" color="secondary" 
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/produtos')} 
                        >
                            Cancelar
                        </Button>
                        
                        <Button 
                            type="submit" variant="outlined" color="primary"
                            startIcon={!loading && <SendIcon />}
                            disabled={loading} // Agora usa o loading principal
                            size="large"
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Produto'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default CadastroProduto;