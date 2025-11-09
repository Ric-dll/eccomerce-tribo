// frontend/src/pages/CadastroProduto.jsx (CORRIGIDO - VERSÃO FINAL DINÂMICA)

import React, { useState, useEffect } from 'react';
import ProdutoService from '../services/ProdutoService';
import CategoriaService from '../services/CategoriaService';
import UsuarioService from '../services/UsuarioService'; // 1. (MUDANÇA) Importar o serviço de Usuário
import { useNavigate } from 'react-router-dom';

import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Grid,       
    MenuItem,   
    Container   
} from '@mui/material';
// --- Ícones do MUI ---
import { 
    Send as SendIcon, 
    Cancel as CancelIcon, 
    PhotoCamera as PhotoCameraIcon 
} from '@mui/icons-material';

function CadastroProduto() {
    const navigate = useNavigate(); 
    
    // 2. (MUDANÇA) Adicionado 'Vendedor_ID' ao estado do formulário
    const [formData, setFormData] = useState({
        Nome: '',
        Descricao: '',
        Preco: '',
        Estoque: '',
        Categoria_ID: '',
        Vendedor_ID: '', // <-- ADICIONADO
    });
    
    const [categorias, setCategorias] = useState([]);
    const [vendedores, setVendedores] = useState([]); // 3. (MUDANÇA) Novo estado para os vendedores
    const [message, setMessage] = useState('');
    
    // 4. (MUDANÇA) 'loading' agora é para o carregamento da PÁGINA (dados)
    const [loading, setLoading] = useState(true); 
    const [submitLoading, setSubmitLoading] = useState(false); // Novo estado para o loading do BOTÃO

    // 5. (MUDANÇA) useEffect agora busca Categorias E Vendedores
    useEffect(() => {
        // Usamos Promise.all para buscar os dois ao mesmo tempo
        Promise.all([
            CategoriaService.listarCategorias(),
            UsuarioService.listarVendedores()
        ])
        .then(([categoriaResponse, vendedorResponse]) => {
            setCategorias(Array.isArray(categoriaResponse.data) ? categoriaResponse.data : []);
            setVendedores(Array.isArray(vendedorResponse.data) ? vendedorResponse.data : []);
        })
        .catch(error => {
            console.error("Erro ao buscar dados iniciais (categorias ou vendedores):", error);
            setMessage("Erro ao carregar dados. Tente recarregar a página.");
        })
        .finally(() => {
            setLoading(false); // Termina o loading da PÁGINA
        });
    }, []);

    // Lógica de handleChange (sem mudança, já é dinâmica)
    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'Preco') {
            value = value.replace(',', '.');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    // Lógica de handleSubmit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setSubmitLoading(true); // Usa o loading do BOTÃO

        // 6. (MUDANÇA) Adicionada validação para Vendedor_ID
        if (!formData.Categoria_ID || !formData.Vendedor_ID) {
            setMessage('Por favor, selecione uma Categoria e um Vendedor.');
            setSubmitLoading(false);
            return;
        }
        
        // 7. (MUDANÇA) 'dataToSend' agora é 100% dinâmico
        const dataToSend = {
            Nome: formData.Nome,
            Descricao: formData.Descricao,
            Preco: parseFloat(String(formData.Preco).replace(',', '.')), 
            Estoque: parseInt(formData.Estoque, 10),
            Categoria_ID: parseInt(formData.Categoria_ID, 10),
            Vendedor_ID: parseInt(formData.Vendedor_ID, 10), // <-- AGORA VEM DO FORMULÁRIO

            // O mock de imagens ainda está aqui, pois não criamos um uploader.
            // Isso não quebra o código.
            imagens: [
                { url: 'http://example.com/imagem_mock_1.jpg', ordem: 0 },
                { url: 'http://example.com/imagem_mock_2.jpg', ordem: 1 }
            ]
        };

        if (isNaN(dataToSend.Preco) || isNaN(dataToSend.Estoque) || isNaN(dataToSend.Categoria_ID) || isNaN(dataToSend.Vendedor_ID)) {
             setMessage('Erro: Preço, Estoque, Categoria ou Vendedor inválidos.');
             setSubmitLoading(false);
             return;
        }
        
        try {
            await ProdutoService.cadastrarProduto(dataToSend);
            
            setMessage('✅ Produto cadastrado com sucesso! Redirecionando...');
            
            // 8. (MUDANÇA) Resetar o formulário (incluindo Vendedor_ID)
            setFormData({ Nome: '', Descricao: '', Preco: '', Estoque: '', Categoria_ID: '', Vendedor_ID: '' });
            setTimeout(() => navigate('/produtos'), 1500); 

        } catch (error) {
            const apiErrorMessage = error.response?.data?.mensagem || 
                                    error.response?.data?.error || 
                                    error.message;
            
            const customMsg = `Erro ao cadastrar produto. API respondeu: ${apiErrorMessage || 'Erro desconhecido.'}`;
            setMessage(customMsg);

        } finally {
            setSubmitLoading(false); // Para o loading do BOTÃO
        }
    };
    
    // 9. (MUDANÇA) Se a página estiver carregando os dados, mostra o spinner
    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: 'calc(100vh - 64px)', 
                color: 'primary.main' 
            }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

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
                            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                                Informações
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                
                                {/* Campos (Nome, Descricao, Preco, Estoque) - Sem Mudança */}
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

                                {/* Dropdown de Categoria (Sem mudança, já estava correto) */}
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

                                {/* 10. (MUDANÇA) NOVO DROPDOWN DE VENDEDOR */}
                                <TextField 
                                    label="Vendedor"
                                    name="Vendedor_ID"
                                    value={formData.Vendedor_ID} 
                                    onChange={handleChange} 
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem value="">Selecione...</MenuItem>
                                    {vendedores.map(vendedor => (
                                        <MenuItem key={vendedor.ID_usuario} value={vendedor.ID_usuario}>
                                            {vendedor.Nome} {/* A API retorna o 'Nome' do usuário base */}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </Box>
                        </Grid>

                        {/* --- COLUNA DIREITA (Mock de Fotos) --- */}
                        <Grid item xs={12} lg={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            {/* ... (sem mudanças) ... */}
                        </Grid>
                    </Grid>

                    {/* --- BOTÕES DE AÇÃO --- */}
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
                        
                        {/* 11. (MUDANÇA) Botão agora usa 'submitLoading' */}
                        <Button 
                            type="submit" 
                            variant="outlined" 
                            color="primary"
                            startIcon={!submitLoading && <SendIcon />}
                            disabled={submitLoading} // Usa o estado de submit
                            size="large"
                        >
                            {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Produto'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default CadastroProduto;