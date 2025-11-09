// frontend/src/pages/ListaVendedores.jsx (CORRIGIDO E COMPLETO)

import React, { useState, useEffect } from 'react';
import UsuarioService from '../services/UsuarioService';
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
import AddIcon from '@mui/icons-material/Add'; // Ícone para o botão

function ListaVendedores() {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Nenhuma mudança necessária no useEffect
    useEffect(() => {
        UsuarioService.listarVendedores()
            .then(response => {
                setVendedores(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar vendedores:", error);
                setError("Erro ao carregar a lista de vendedores.");
                setLoading(false);
            });
    }, []);
    
    // --- TELA DE CARREGAMENTO (Nenhuma mudança) ---
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
    
    // --- TELA DE ERRO (Nenhuma mudança) ---
    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    {error}
                </Alert>
            </Container>
        );
    }

    // --- TELA PRINCIPAL (Nenhuma mudança no Cabeçalho) ---
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4 
            }}>
                <Typography variant="h4" component="h1" color="text.primary">
                    Lista de Vendedores ({vendedores.length})
                </Typography>
                
                <Button 
                    component={Link} 
                    to="/vendedores/cadastrar" 
                    variant="contained" 
                    color="primary"     
                    startIcon={<AddIcon />}
                >
                    Novo Vendedor
                </Button>
            </Box>
            
            {/* --- TABELA (MUI) --- */}
            <TableContainer component={Paper}>
                <Table>
                    {/* Cabeçalho (Nenhuma mudança) */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Área Responsável</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        </TableRow>
                    </TableHead>
                    
                    {/* Corpo da Tabela (AQUI ESTÃO AS MUDANÇAS) */}
                    <TableBody>
                        {vendedores.map(vendedor => (
                            <TableRow 
                                // 1. (MUDANÇA) 'key' usa a nova PK do SQL
                                key={vendedor.ID_usuario}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* 2. (MUDANÇA) 'nome' agora é 'Nome' (do obj base) */}
                                <TableCell sx={{ fontWeight: 500 }}>{vendedor.Nome}</TableCell>
                                
                                {/* 3. (MUDANÇA) 'email' agora é 'Email' (do obj base) */}
                                <TableCell>{vendedor.Email}</TableCell>
                                
                                {/* 4. (MUDANÇA) Acessa o obj 'vendedorInfo' aninhado */}
                                <TableCell>
                                    {vendedor.vendedorInfo ? vendedor.vendedorInfo.AreaResponsavel : 'N/A'}
                                </TableCell>
                                
                                {/* 5. (MUDANÇA) ID usa a nova PK */}
                                <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                    {vendedor.ID_usuario}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Mensagem de Tabela Vazia (Nenhuma mudança) */}
            {vendedores.length === 0 && (
                 <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                     Nenhum vendedor cadastrado no momento.
                 </Typography>
            )}
        </Container>
    );
}

export default ListaVendedores;