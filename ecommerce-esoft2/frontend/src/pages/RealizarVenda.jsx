import React, { useState, useEffect, useContext } from 'react';
import UsuarioService from '../services/UsuarioService';
import ProdutoService from '../services/ProdutoService';
import CarrinhoService from '../services/CarrinhoService';
import { VendaContext } from '../context/VendaContext';
import { useNavigate } from 'react-router-dom';

// MUI
import { 
    Container, Box, Typography, Paper, Button, 
    TextField, Autocomplete, Snackbar, Alert, CircularProgress, Divider
} from '@mui/material';

// Ícones 
import { 
    AddShoppingCart as AddShoppingCartIcon, 
    PointOfSale as PointOfSaleIcon, 
    ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';

function RealizarVenda() {
    const navigate = useNavigate();
    const { clienteAtivo, selecionarCliente } = useContext(VendaContext);

    const [listaClientes, setListaClientes] = useState([]);
    const [listaProdutos, setListaProdutos] = useState([]);
    const [loadingDados, setLoadingDados] = useState(true);

    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState(1);

    const [aviso, setAviso] = useState({ open: false, msg: '', tipo: 'success' });
    const [loadingAdd, setLoadingAdd] = useState(false);

    useEffect(() => {
        Promise.all([
            UsuarioService.listarClientes({}), 
            ProdutoService.listarProdutos({})
        ]).then(([resClientes, resProdutos]) => {
            setListaClientes(resClientes.data || []);
            setListaProdutos(resProdutos.data || []);
            setLoadingDados(false);
        }).catch(err => {
            console.error("Erro ao carregar dados:", err);
            setAviso({ open: true, msg: "Erro ao carregar dados do sistema.", tipo: 'error' });
            setLoadingDados(false);
        });
    }, []);

    const handleAdicionar = async () => {
        if (!clienteAtivo) {
            setAviso({ open: true, msg: "Selecione um Cliente primeiro!", tipo: 'warning' });
            return;
        }
        if (!produtoSelecionado) {
            setAviso({ open: true, msg: "Selecione um Produto!", tipo: 'warning' });
            return;
        }
        if (quantidade < 1) {
            setAviso({ open: true, msg: "Quantidade inválida.", tipo: 'warning' });
            return;
        }

        setLoadingAdd(true);
        try {
            await CarrinhoService.adicionarItem({
                Produto_ID: produtoSelecionado.ID_produto,
                Quantidade: parseInt(quantidade),
                Cliente_ID: clienteAtivo.ID_usuario
            });
            
            setAviso({ open: true, msg: `✅ ${produtoSelecionado.Nome} adicionado!`, tipo: 'success' });
            setProdutoSelecionado(null); 
            setQuantidade(1);

        } catch (error) {
            const msg = error.response?.data?.mensagem || "Erro ao adicionar.";
            setAviso({ open: true, msg: `❌ ${msg}`, tipo: 'error' });
        } finally {
            setLoadingAdd(false);
        }
    };

    if (loadingDados) {
        return <Box sx={{ display:'flex', justifyContent:'center', mt:10 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PointOfSaleIcon fontSize="large" color="primary" /> 
                Realizar Venda (PDV)
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Selecione o cliente e adicione produtos ao carrinho.
            </Typography>

            <Paper elevation={3} sx={{ p: 4 }}>
                
                {/* --- SEÇÃO 1: CLIENTE --- */}
                <Typography variant="h6" gutterBottom color="primary">1. Quem é o Cliente?</Typography>
                <Box sx={{ mb: 4 }}>
                    <Autocomplete
                        fullWidth
                        options={listaClientes}
                        getOptionLabel={(option) => `${option.Nome} (CPF: ${option.clienteInfo?.CPF || 'N/A'})`}
                        value={clienteAtivo}
                        onChange={(event, newValue) => selecionarCliente(newValue)}
                        renderInput={(params) => <TextField {...params} label="Pesquisar Cliente..." placeholder="Digite o nome" />}
                        isOptionEqualToValue={(option, value) => option.ID_usuario === value?.ID_usuario}
                    />
                    {!clienteAtivo && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                            Nenhum cliente selecionado. O carrinho ficará vinculado a quem você escolher aqui.
                        </Alert>
                    )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* --- SEÇÃO 2: PRODUTOS (LAYOUT COM FLEXBOX) --- */}
                <Typography variant="h6" gutterBottom color="primary">2. Adicionar Produtos</Typography>
                
                {/* Usamos Box com display: flex para ter controle total da largura */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, // Coluna no celular, Linha no PC
                    gap: 2, 
                    alignItems: 'stretch' 
                }}>
                    
                    {/* CAMPO DE PRODUTO: flexGrow: 1 faz ele ocupar TODO o espaço sobrando */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Autocomplete
                            fullWidth
                            options={listaProdutos}
                            getOptionLabel={(option) => option.Nome}
                            value={produtoSelecionado}
                            onChange={(event, newValue) => setProdutoSelecionado(newValue)}
                            
                            // Configuração para o Menu abrir bem largo
                            slotProps={{
                                paper: { sx: { width: 'fit-content', minWidth: '100%' } }
                            }}

                            renderOption={(props, option) => (
                                <li {...props} style={{ display: 'block', padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500, whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                            {option.Nome}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Preço: R$ {parseFloat(option.Preco).toFixed(2)} | Estoque: {option.Estoque}
                                        </Typography>
                                    </Box>
                                </li>
                            )}
                            
                            renderInput={(params) => <TextField {...params} label="Pesquisar Produto..." fullWidth />}
                            isOptionEqualToValue={(option, value) => option.ID_produto === value?.ID_produto}
                            disabled={!clienteAtivo} 
                        />
                    </Box>

                    {/* CAMPO QUANTIDADE: Largura fixa pequena */}
                    <Box sx={{ width: { xs: '100%', md: '100px' } }}>
                        <TextField 
                            label="Qtd" 
                            type="number" 
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            fullWidth
                            disabled={!clienteAtivo}
                            InputProps={{ inputProps: { min: 1 } }}
                        />
                    </Box>

                    {/* BOTÃO ADICIONAR: Largura fixa média */}
                    <Box sx={{ width: { xs: '100%', md: '140px' } }}>
                        <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ height: '56px' }} 
                            startIcon={!loadingAdd && <AddShoppingCartIcon />}
                            onClick={handleAdicionar}
                            disabled={!clienteAtivo || loadingAdd}
                        >
                            {loadingAdd ? <CircularProgress size={24} color="inherit" /> : "Adicionar"}
                        </Button>
                    </Box>

                </Box>

                {/* --- INFO DO PRODUTO SELECIONADO --- */}
                {produtoSelecionado && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="body2">
                            <strong>Preço Unitário:</strong> R$ {parseFloat(produtoSelecionado.Preco).toFixed(2)} | 
                            <strong> Estoque Atual:</strong> {produtoSelecionado.Estoque}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 4 }} />

                {/* --- RODAPÉ: IR PARA PAGAMENTO --- */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        variant="contained" 
                        color="success" 
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/carrinho')}
                        disabled={!clienteAtivo}
                    >
                        Ver Carrinho e Finalizar
                    </Button>
                </Box>

            </Paper>

            <Snackbar open={aviso.open} autoHideDuration={3000} onClose={() => setAviso({...aviso, open:false})}>
                <Alert severity={aviso.tipo} variant="filled">{aviso.msg}</Alert>
            </Snackbar>
        </Container>
    );
}

export default RealizarVenda;