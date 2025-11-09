// frontend/src/pages/ListaClientes.jsx (CORRIGIDO E COMPLETO)

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
    Container          
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Ícone para o botão

function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Nenhuma mudança necessária no useEffect
    useEffect(() => {
        UsuarioService.listarClientes()
            .then(response => {
                setClientes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar clientes:", error);
                setLoading(false); // <--- Adicionado para parar o loading em caso de erro
            });
    }, []);

    // Nenhuma mudança necessária na tela de carregamento
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

    // Nenhuma mudança necessária no Container ou Cabeçalho
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}> 
            
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4 
            }}>
                <Typography variant="h4" component="h1" color="text.primary">
                    Lista de Clientes
                </Typography>
                
                <Button 
                    component={Link} 
                    to="/clientes/cadastrar" // Ajustei o link para a rota de cadastro correta
                    variant="contained" 
                    color="primary"     
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
                    {/* Cabeçalho da Tabela (Nenhuma mudança) */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Corpo da Tabela (AQUI ESTÃO AS MUDANÇAS) */}
                    <TableBody>
                        {clientes.map(cliente => (
                            <TableRow 
                                // 1. (MUDANÇA) 'key' usa a nova PK do SQL
                                key={cliente.ID_usuario}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* 2. (MUDANÇA) 'nome' agora é 'Nome' */}
                                <TableCell>{cliente.Nome}</TableCell>
                                
                                {/* 3. (MUDANÇA) 'email' agora é 'Email' */}
                                <TableCell>{cliente.Email}</TableCell>
                                
                                {/* 4. (MUDANÇA) 'telefone' agora é 'Telefone' */}
                                <TableCell>{cliente.Telefone || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default ListaClientes;