import React, { useState, useEffect } from 'react';
import ProdutoService from '../services/ProdutoService';
import { Link } from 'react-router-dom';

// --- Importações do Material UI ---
import {
    Box,
    Typography,
    Button,
    Paper,             // O container cinza escuro
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,  // Spinner de carregamento
    Container,         // Para limitar a largura da tabela
    Alert,             // Para exibir a mensagem de erro
    AlertTitle         // Título para o Alerta
} from '@mui/material';
// --- Ícones ---
import AddIcon from '@mui/icons-material/Add'; 
import EditIcon from '@mui/icons-material/Edit'; // Ícone para o botão "Editar"

function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Lógica de Busca 
    useEffect(() => {
        ProdutoService.listarProdutos()
            .then(response => {
                setProdutos(Array.isArray(response.data) ? response.data : []);
            })
            .catch(err => {
                console.error("Erro ao buscar produtos:", err);
                setError("Erro ao carregar a lista de produtos.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    
    // --- Renderização de Estados ---
    
    if (loading) return (
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
    
    if (error) return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error">
                <AlertTitle>Erro de Carregamento</AlertTitle>
                {error}
            </Alert>
        </Container>
    );
    
    // --- Renderização da Tabela ---

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* --- CABEÇALHO DA PÁGINA --- */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4 
            }}>
                <Typography variant="h4" component="h1" color="text.primary">
                    Lista de Produtos ({produtos.length})
                </Typography>
                <Button 
                    component={Link} 
                    to="/produtos/cadastrar" 
                    variant="contained" // Botão sólido 
                    color="primary"     
                    startIcon={<AddIcon />}
                >
                    + Novo Produto
                </Button>
            </Box>
            
            {/* --- TABELA (MUI) --- */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Preço</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estoque</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Vendedor</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {produtos.map(produto => (
                            <TableRow 
                                key={produto._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ fontWeight: 500 }}>{produto.nome}</TableCell>
                                <TableCell>
                                    R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                                </TableCell>
                                <TableCell>{produto.estoque}</TableCell>
                                <TableCell>
                                    {produto.categoria ? produto.categoria.nome : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {produto.vendedor ? produto.vendedor.nome || 'N/A' : 'N/A'}
                                </TableCell>
                                <TableCell align="right">
                                    <Button 
                                        component={Link} 
                                        to={`/produtos/editar/${produto._id}`} 
                                        variant="text" // Botão sutil
                                        color="primary" // Cor branca (do tema)
                                        startIcon={<EditIcon />}
                                    >
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Mensagem de Tabela Vazia */}
            {produtos.length === 0 && (
                 <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                     Nenhum produto cadastrado no momento.
                 </Typography>
            )}
        </Container>
    );
}

export default ListaProdutos;
