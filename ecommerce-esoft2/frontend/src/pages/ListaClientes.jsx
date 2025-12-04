import React, { useState, useEffect, useContext } from 'react';
import UsuarioService from '../services/UsuarioService';
import { Link } from 'react-router-dom';
import { VendaContext } from '../context/VendaContext';

// --- Importações do Material UI ---
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, Container,
    TextField, InputAdornment, Chip, Alert
} from '@mui/material';

// --- Ícones (Forma segura para evitar erro de cache do Vite) ---
import { 
    Add as AddIcon, 
    Search as SearchIcon, 
    CheckCircle as CheckCircleIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para Busca
    const [termoBusca, setTermoBusca] = useState('');

    // Consumindo o Contexto Global
    const { selecionarCliente, clienteAtivo, limparCliente} = useContext(VendaContext);

    // Função que busca os dados (agora aceita filtros)
    const carregarClientes = () => {
        setLoading(true);
        // Envia o 'termoBusca' como 'search' para o backend
        const params = {
            search: termoBusca,
            sort: 'Nome', // Ordenação padrão
            order: 'ASC'
        };

        UsuarioService.listarClientes(params)
            .then(response => {
                setClientes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar clientes:", error);
                setLoading(false);
            });
    };

    // useEffect dispara quando a página carrega OU quando 'termoBusca' muda
    // (Adicionamos um pequeno delay para não chamar a API a cada letra digitada seria o ideal, 
    // mas para simplificar faremos direto no onBlur ou Enter, ou useEffect simples)
    useEffect(() => {
        carregarClientes();
    }, [termoBusca]); // <--- Recarrega sempre que a busca muda

    // --- RENDERIZAÇÃO ---

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            
            {/* CABEÇALHO COM TÍTULO E BOTÃO NOVO */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" color="text.primary">
                    Lista de Clientes
                </Typography>
                <Button 
                    component={Link} to="/clientes/cadastrar" 
                    variant="contained" color="primary" startIcon={<AddIcon />}
                >
                    Novo Cliente
                </Button>
            </Box>

            {/* BARRA DE BUSCA */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    label="Buscar Cliente (Nome ou Email)"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* FEEDBACK DE CLIENTE ATIVO */}
            {clienteAtivo && (
                <Alert 
                    severity="info"
                    icon={<ShoppingCartIcon />}
                    sx={{ mb: 2 }} // Margem em baixo
                >
                    <strong>Vendendo para:</strong> {clienteAtivo.Nome} (ID: {clienteAtivo.ID_usuario})
                </Alert>
            )}

            {/* TABELA */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Ação (Venda)</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : clientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Nenhum cliente encontrado.</TableCell>
                            </TableRow>
                        ) : (
                            clientes.map(cliente => {
                                // Verifica se este é o cliente selecionado atualmente
                                const isSelected = clienteAtivo && clienteAtivo.ID_usuario === cliente.ID_usuario;

                                return (
                                    <TableRow key={cliente.ID_usuario} sx={{ backgroundColor: isSelected ? 'action.hover' : 'inherit' }}>
                                    <TableCell>{cliente.Nome}</TableCell>
                                    <TableCell>{cliente.Email}</TableCell>
                                    <TableCell>{cliente.Telefone || '-'}</TableCell>
                                    <TableCell align="center">
                                        {isSelected ? (
                                            // Adicionamos onDelete
                                            <Chip 
                                                icon={<CheckCircleIcon />} 
                                                label="Selecionado" 
                                                color="success" 
                                                variant="outlined"
                                                onDelete={() => limparCliente()} // <--- O X chama essa função
                                            />
                                        ) : (
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={() => selecionarCliente(cliente)}
                                            >
                                                Selecionar
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default ListaClientes;