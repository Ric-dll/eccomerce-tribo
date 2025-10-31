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
    Container          // Para limitar a largura da tabela 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Ícone para o botão

function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UsuarioService.listarClientes()
            .then(response => {
                setClientes(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Erro ao buscar clientes:", error));
    }, []);

    // --- TELA DE CARREGAMENTO (MUI) ---
    if (loading) {
        return (
            // Box para centralizar o spinner
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                // calc(100vh - 64px) -> 100% da altura menos a AppBar
                minHeight: 'calc(100vh - 64px)', 
                color: 'primary.main' // Branco
            }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    // --- TELA PRINCIPAL (MUI) ---
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}> {/* py: 4 = padding vertical */}
            
            {/* --- CABEÇALHO DA PÁGINA --- */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', // Título na esquerda, Botão na direita
                alignItems: 'center', 
                mb: 4 // Margem inferior
            }}>
                <Typography variant="h4" component="h1" color="text.primary">
                    Lista de Clientes
                </Typography>
                
                {/* Botão que leva para a página de cadastro (que é a raiz '/') */}
                <Button 
                    component={Link} 
                    to="/" 
                    variant="contained" // Botão sólido
                    color="primary"     // Cor branca (com texto preto, do nosso tema)
                    startIcon={<AddIcon />}
                >
                    Novo Cliente
                </Button>
            </Box>

            {/* --- TABELA (MUI) --- */}
            <TableContainer 
                component={Paper}
            >
                <Table>
                    {/* Cabeçalho da Tabela */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Corpo da Tabela */}
                    <TableBody>
                        {clientes.map(cliente => (
                            <TableRow 
                                key={cliente._id}
                                // Remove a borda da última linha (detalhe de design)
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{cliente.nome}</TableCell>
                                <TableCell>{cliente.email}</TableCell>
                                <TableCell>{cliente.telefone || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default ListaClientes;