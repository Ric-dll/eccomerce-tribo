// frontend/src/pages/ListaCategorias.jsx (CORRIGIDO E COMPLETO)

import React, { useState, useEffect } from 'react';
import CategoriaService from '../services/CategoriaService';
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

function ListaCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true); 

    // Nenhuma mudança necessária no useEffect
    useEffect(() => {
        CategoriaService.listarCategorias()
            .then(response => {
                setCategorias(response.data);
                setLoading(false); 
            })
            .catch(error => {
                console.error("Erro ao buscar categorias:", error);
                setLoading(false); 
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

    // Nenhuma mudança necessária no Container ou no Cabeçalho
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}> 
            
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4 
            }}>
                <Typography variant="h4" component="h1" color="text.primary">
                    Lista de Categorias
                </Typography>
                
                <Button 
                    component={Link} 
                    to="/categorias/cadastrar" 
                    variant="contained" 
                    color="primary"     
                    startIcon={<AddIcon />}
                >
                    Nova Categoria
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Categoria Pai</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Corpo da Tabela (AQUI ESTÃO AS MUDANÇAS) */}
                    <TableBody>
                        {categorias.map(cat => (
                            <TableRow 
                                // 1. (MUDANÇA) 'key' usa a nova PK do SQL
                                key={cat.ID_categoria}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* 2. (MUDANÇA) Campo 'nome' agora é 'Nome' */}
                                <TableCell>{cat.Nome}</TableCell>
                                
                                {/* 3. (MUDANÇA) 'cat.categoriaPai.nome' agora é 'cat.categoriaPai.Nome' */}
                                <TableCell>{cat.categoriaPai ? cat.categoriaPai.Nome : 'N/A (Raiz)'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default ListaCategorias;