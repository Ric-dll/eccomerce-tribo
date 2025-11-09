// frontend/src/pages/ListaProdutos.jsx (CORRIGIDO E COMPLETO)

import React, { useState, useEffect } from 'react';
import ProdutoService from '../services/ProdutoService';
import { Link } from 'react-router-dom';

// --- Importações do Material UI ---
import {
    Box,
    Typography,
    Button,
    Paper,             
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,  
    Container,         
    Alert,             
    AlertTitle         
} from '@mui/material';
// --- Ícones ---
import AddIcon from '@mui/icons-material/Add'; 
import EditIcon from '@mui/icons-material/Edit'; 

function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Lógica de Busca (Nenhuma mudança necessária)
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
    
    // --- Renderização de Estados (Nenhuma mudança necessária) ---
    
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
            {/* --- CABEÇALHO DA PÁGINA (Nenhuma mudança necessária) --- */}
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
                    variant="contained" 
                    color="primary"     
                    startIcon={<AddIcon />}
                >
                    + Novo Produto
                </Button>
            </Box>
            
            {/* --- TABELA (MUI) --- */}
            <TableContainer component={Paper}>
                <Table>
                    {/* Cabeçalho (Nenhuma mudança) */}
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
                    
                    {/* Corpo da Tabela (AQUI ESTÃO AS MUDANÇAS) */}
                    <TableBody>
                        {produtos.map(produto => (
                            <TableRow 
                                // 1. (MUDANÇA) 'key' usa a nova PK do SQL
                                key={produto.ID_produto}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* 2. (MUDANÇA) 'nome' agora é 'Nome' */}
                                <TableCell sx={{ fontWeight: 500 }}>{produto.Nome}</TableCell>
                                
                                {/* 3. (MUDANÇA) 'preco' agora é 'Preco' */}
                                <TableCell>
                                    R$ {Number(produto.Preco).toFixed(2).replace('.', ',')}
                                </TableCell>
                                
                                {/* 4. (MUDANÇA) 'estoque' agora é 'Estoque' */}
                                <TableCell>{produto.Estoque}</TableCell>
                                
                                {/* 5. (MUDANÇA) 'categoria.nome' agora é 'categoria.Nome' */}
                                <TableCell>
                                    {produto.categoria ? produto.categoria.Nome : 'N/A'}
                                </TableCell>
                                
                                {/* 6. (MUDANÇA) Esta é a maior mudança. */}
                                {/* O nome do Vendedor agora está em 'vendedor.usuarioBase.Nome' */}
                                <TableCell>
                                    {produto.vendedor && produto.vendedor.usuarioBase 
                                        ? produto.vendedor.usuarioBase.Nome 
                                        : 'N/A'}
                                </TableCell>
                                
                                <TableCell align="right">
                                    <Button 
                                        component={Link} 
                                        // 7. (MUDANÇA) Link usa a nova PK
                                        to={`/produtos/editar/${produto.ID_produto}`} 
                                        variant="text" 
                                        color="primary" 
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
            
            {/* Mensagem de Tabela Vazia (Nenhuma mudança) */}
            {produtos.length === 0 && (
                 <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                     Nenhum produto cadastrado no momento.
                 </Typography>
            )}
        </Container>
    );
}

export default ListaProdutos;