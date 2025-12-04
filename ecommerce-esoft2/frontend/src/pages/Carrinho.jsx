import React, { useState, useEffect, useContext } from 'react';
import CarrinhoService from '../services/CarrinhoService';
import PedidoService from '../services/PedidoService';
import { VendaContext } from '../context/VendaContext';
import { Link } from 'react-router-dom';

// --- Material UI ---
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, IconButton,
    Grid, Alert, CircularProgress, Divider, Card, CardContent
} from '@mui/material';

// --- Ícones ---
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCartCheckout as CheckoutIcon,
    Storefront as StoreIcon,
    CheckCircle as SuccessIcon
} from '@mui/icons-material';

function Carrinho() {
    const { clienteAtivo } = useContext(VendaContext);

    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false); 
    const [sucesso, setSucesso] = useState(false); 
    
    // (CORREÇÃO) Removemos 'setEnderecoId' pois não vamos usar mais.
    // O valor '1' fica fixo aqui.
    const [enderecoId] = useState(1); 

    const carregarCarrinho = () => {
        if (!clienteAtivo) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        CarrinhoService.listarItens(clienteAtivo.ID_usuario)
            .then(response => {
                setItens(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar carrinho:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        carregarCarrinho();
    }, [clienteAtivo]);

    const calcularTotal = () => {
        return itens.reduce((acc, item) => {
            const preco = parseFloat(item.produto.Preco);
            return acc + (preco * item.Quantidade);
        }, 0);
    };

    const handleAlterarQuantidade = async (item, novaQuantidade) => {
        if (novaQuantidade < 1) return; 

        try {
            await CarrinhoService.atualizarItem({
                Produto_ID: item.Produto_ID,
                Quantidade: novaQuantidade,
                Cliente_ID: clienteAtivo.ID_usuario
            });
            carregarCarrinho(); 
        } catch { 
            alert("Erro ao atualizar quantidade.");
        }
    };

    const handleRemover = async (item) => {
        if (!window.confirm(`Remover ${item.produto.Nome} do carrinho?`)) return;

        try {
            await CarrinhoService.removerItem(item.Produto_ID, clienteAtivo.ID_usuario);
            carregarCarrinho();
        } catch { 
            alert("Erro ao remover item.");
        }
    };

    const handleFinalizar = async () => {
        setProcessando(true);
        try {
            const dadosPedido = {
                Cliente_ID: clienteAtivo.ID_usuario,
                EnderecoEntrega_ID: enderecoId 
            };

            await PedidoService.finalizarPedido(dadosPedido);
            setSucesso(true); 
            
        } catch (error) {
            const msg = error.response?.data?.mensagem || "Erro desconhecido";
            alert("Erro ao finalizar: " + msg);
        } finally {
            setProcessando(false);
        }
    };

    if (!clienteAtivo) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Alert severity="warning" sx={{ mb: 4, justifyContent: 'center' }}>
                    <Typography variant="h6">Nenhum cliente selecionado</Typography>
                </Alert>
                <Typography sx={{ mb: 3 }}>Você precisa selecionar um cliente para ver o carrinho dele.</Typography>
                <Button variant="contained" component={Link} to="/clientes">Ir para Clientes</Button>
            </Container>
        );
    }

    if (sucesso) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
                    <SuccessIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom color="success.main">
                        Pedido Realizado!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        A venda para <strong>{clienteAtivo.Nome}</strong> foi registrada com sucesso.
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button variant="outlined" component={Link} to="/vender">Nova Venda</Button>
                        <Button variant="contained" component={Link} to="/">Voltar ao Início</Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Carrinho de Compras
            </Typography>

            <Alert severity="info" icon={<StoreIcon />} sx={{ mb: 4 }}>
                Cliente: <strong>{clienteAtivo.Nome}</strong> (CPF: {clienteAtivo.CPF || 'N/A'})
            </Alert>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
            ) : itens.length === 0 ? (
                <Paper sx={{ p: 5, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">O carrinho está vazio.</Typography>
                    <Button sx={{ mt: 2 }} variant="contained" component={Link} to="/vender">Adicionar Produtos</Button>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produto</TableCell>
                                        <TableCell align="center">Preço</TableCell>
                                        <TableCell align="center">Qtd</TableCell>
                                        <TableCell align="center">Subtotal</TableCell>
                                        <TableCell align="center">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itens.map((item) => (
                                        <TableRow key={item.Produto_ID}>
                                            <TableCell>
                                                <Typography variant="body1" fontWeight="bold">{item.produto.Nome}</Typography>
                                                <Typography variant="caption" color="text.secondary">Estoque: {item.produto.Estoque}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                R$ {parseFloat(item.produto.Preco).toFixed(2).replace('.', ',')}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconButton size="small" onClick={() => handleAlterarQuantidade(item, item.Quantidade - 1)}>
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                    <Box sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}>
                                                        {item.Quantidade}
                                                    </Box>
                                                    <IconButton size="small" onClick={() => handleAlterarQuantidade(item, item.Quantidade + 1)}>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                R$ {(parseFloat(item.produto.Preco) * item.Quantidade).toFixed(2).replace('.', ',')}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => handleRemover(item)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Resumo do Pedido</Typography>
                                <Divider sx={{ my: 2 }} />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>Itens:</Typography>
                                    <Typography>{itens.length}</Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h5" fontWeight="bold">Total:</Typography>
                                    <Typography variant="h5" fontWeight="bold" color="primary">
                                        R$ {calcularTotal().toFixed(2).replace('.', ',')}
                                    </Typography>
                                </Box>

                                {/* Campo de endereço foi removido daqui */}

                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    fullWidth 
                                    size="large"
                                    startIcon={!processando && <CheckoutIcon />}
                                    disabled={processando}
                                    onClick={handleFinalizar}
                                >
                                    {processando ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Venda'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default Carrinho;