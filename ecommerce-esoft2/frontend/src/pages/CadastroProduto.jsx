import React, { useState, useEffect } from 'react';
import ProdutoService from '../services/ProdutoService';
import CategoriaService from '../services/CategoriaService';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Grid,       // Para o layout de 2 colunas
    MenuItem,   // Para o Select
    Container   // Para limitar a largura total
} from '@mui/material';
// --- Ícones do MUI ---
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // Para o placeholder

function CadastroProduto() {
    const navigate = useNavigate(); 
    
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
        categoria: '', 
    });
    
    const [categorias, setCategorias] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Busca dados na API ao carregar (apenas Categorias)
    useEffect(() => {
        CategoriaService.listarCategorias()
            .then(response => setCategorias(Array.isArray(response.data) ? response.data : []))
            .catch(error => console.error("Erro ao buscar categorias:", error));
    }, []);

    // Lógica de handleChange
    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'preco') {
            value = value.replace(',', '.');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    // Lógica de handleSubmit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (!formData.categoria) {
            setMessage('Por favor, selecione uma categoria.');
            setLoading(false);
            return;
        }
        
        const dataToSend = {
            ...formData,
            preco: parseFloat(String(formData.preco).replace(',', '.')), 
            estoque: parseInt(formData.estoque, 10),
        };

        if (isNaN(dataToSend.preco) || isNaN(dataToSend.estoque)) {
             setMessage('Erro: Preço ou Estoque inválidos. Por favor, insira apenas números.');
             setLoading(false);
             return;
        }
        
        try {
            await ProdutoService.cadastrarProduto(dataToSend);
            setMessage('Produto cadastrado com sucesso! Redirecionando...');
            setFormData({ nome: '', descricao: '', preco: '', estoque: '', categoria: '' });
            setTimeout(() => navigate('/produtos'), 1500); 

        } catch (error) {
            const apiErrorMessage = error.response?.data?.mensagem || 
                                    error.response?.data?.error || 
                                    error.message;
            
            const customMsg = `Erro ao cadastrar produto. API respondeu: ${apiErrorMessage || 'Erro desconhecido.'}. Se o erro persistir, a API (Backend) está exigindo o campo 'vendedor', que foi removido a seu pedido.`;
            
            setMessage(customMsg);

        } finally {
            if (!message.startsWith('yes')) {
                 setLoading(false);
            }
        }
    };
    

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
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
            
            <Paper elevation={10} sx={{ padding: { xs: 3, md: 5 } }}>
                
                <Typography 
                    variant="h4" 
                    component="h1" 
                    align="center" 
                    color="text.primary"
                    sx={{ mb: 4 }} 
                >
                    Cadastrar Produto
                </Typography>
                
                {message && (
                    <Alert 
                        severity={message.startsWith('✅') ? 'success' : 'error'} 
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        
                        {/* --- COLUNA ESQUERDA (Informações) --- */}
                        <Grid item xs={12} lg={6}>
                            {}
                            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                                Informações
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField 
                                    label="Nome do Produto"
                                    name="nome" 
                                    value={formData.nome} 
                                    onChange={handleChange} 
                                    required 
                                    fullWidth
                                />

                                <TextField
                                    label="Descrição"
                                    name="descricao" 
                                    rows={3} 
                                    multiline
                                    value={formData.descricao} 
                                    onChange={handleChange} 
                                    fullWidth
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField 
                                            label="Preço (R$)"
                                            name="preco" 
                                            type="text" 
                                            placeholder="59,90" 
                                            value={formData.preco} 
                                            onChange={handleChange} 
                                            required 
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                            label="Estoque"
                                            name="estoque" 
                                            type="number"
                                            placeholder="150" 
                                            value={formData.estoque} 
                                            onChange={handleChange} 
                                            required 
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <TextField 
                                    label="Categoria"
                                    name="categoria"
                                    value={formData.categoria} 
                                    onChange={handleChange} 
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem value="">Selecione...</MenuItem>
                                    {categorias.map(cat => (
                                        <MenuItem key={cat._id} value={cat._id}>
                                            {cat.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Grid>

                        {}
                        {}
                        <Grid item xs={12} lg={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                                Fotos (Mock)
                            </Typography>
                            
                            {/* Placeholder de Imagem */}
                            <Box sx={{
                                flexGrow: 1, // Isso faz o Box preencher o espaço restante verticalmente
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '250px', 
                                border: '2px dashed',
                                borderColor: 'rgba(255, 255, 255, 0.5)', 
                                borderRadius: '30px', 
                                backgroundColor: 'background.default', 
                                cursor: 'pointer',
                                p: 2, // Padding interno
                            }}>
                                <PhotoCameraIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} /> {/* Aumentei o ícone */}
                                <Typography color="text.secondary" variant="body2">
                                    Enviar imagem (Mock)
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {}
                    <Box sx={{
                        mt: 4,
                        pt: 2,
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2, 
                    }}>
                        <Button 
                            variant="text" 
                            color="secondary" 
                            startIcon={<CancelIcon />}
                            onClick={() => navigate('/produtos')} 
                        >
                            Cancelar
                        </Button>
                        
                        <Button 
                            type="submit" 
                            variant="outlined" 
                            color="primary"
                            startIcon={!loading && <SendIcon />}
                            disabled={loading}
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