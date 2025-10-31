import React, { useState, useEffect } from 'react';
import UsuarioService from '../services/UsuarioService';
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
import AddIcon from '@mui/icons-material/Add'; // Ícone para o botão

function ListaVendedores() {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Busca a lista de VENDEDORES
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
    
    // --- TELA DE CARREGAMENTO (MUI) ---
    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: 'calc(100vh - 64px)', 
                color: 'primary.main' // Branco
            }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }
    
    // --- TELA DE ERRO (MUI) ---
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

    // --- TELA PRINCIPAL (MUI) ---
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
                    Lista de Vendedores ({vendedores.length})
                </Typography>
                
                <Button 
                    component={Link} 
                    to="/vendedores/cadastrar" 
                    variant="contained" // Botão sólido (branco com texto preto)
                    color="primary"     
                    startIcon={<AddIcon />}
                >
                    Novo Vendedor
                </Button>
            </Box>
            
            {/* --- TABELA (MUI) --- */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Área Responsável</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vendedores.map(vendedor => (
                            <TableRow 
                                key={vendedor._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ fontWeight: 500 }}>{vendedor.nome}</TableCell>
                                <TableCell>{vendedor.email}</TableCell>
                                <TableCell>{vendedor.areaResponsavel || 'N/A'}</TableCell>
                                {/* Replicando seu estilo de ID (fonte pequena e cinza) */}
                                <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                    {vendedor._id}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Mensagem de Tabela Vazia */}
            {vendedores.length === 0 && (
                 <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                     Nenhum vendedor cadastrado no momento.
                 </Typography>
            )}
        </Container>
    );
}

export default ListaVendedores;