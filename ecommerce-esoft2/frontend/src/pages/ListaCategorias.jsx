import React, { useState, useEffect } from 'react';
import CategoriaService from '../services/CategoriaService';
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

function ListaCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        CategoriaService.listarCategorias()
            .then(response => {
                setCategorias(response.data);
                setLoading(false); // <--- Desliga o loading
            })
            .catch(error => {
                console.error("Erro ao buscar categorias:", error);
                setLoading(false); // <--- Desliga o loading em caso de erro
            });
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
        // Container para centralizar e limitar a largura da página
        <Container maxWidth="lg" sx={{ py: 4 }}> {/* py: 4 = padding vertical */}
            
            {/* --- CABEÇALHO DA PÁGINA --- */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', // Título na esquerda, Botão na direita
                alignItems: 'center', 
                mb: 4 // Margem inferior
            }}>
                <Typography variant="h4" component="h1" color="text.primary">
                    Lista de Categorias
                </Typography>
                
                {/* Botão que leva para a página de cadastro */}
                <Button 
                    component={Link} 
                    to="/categorias/cadastrar" // Link para o cadastro
                    variant="contained" // Botão sólido
                    color="primary"     // Cor branca (com texto preto)
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
                    {/* Cabeçalho da Tabela */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Categoria Pai</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Corpo da Tabela */}
                    <TableBody>
                        {categorias.map(cat => (
                            <TableRow 
                                key={cat._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{cat.nome}</TableCell>
                                {}
                                <TableCell>{cat.categoriaPai ? cat.categoriaPai.nome : 'N/A (Raiz)'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default ListaCategorias;