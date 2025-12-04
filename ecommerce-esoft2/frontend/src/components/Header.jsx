import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Header = () => {
    const navigate = useNavigate();

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                {/* LOGO / TÍTULO */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <StorefrontIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Tribo Admin
                    </Typography>
                </Box>

                {/* MENU DE NAVEGAÇÃO */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    {/* Botões de Cadastros/Listas */}
                    <Button color="inherit" component={Link} to="/clientes">Clientes</Button>
                    <Button color="inherit" component={Link} to="/produtos">Produtos</Button>
                    <Button color="inherit" component={Link} to="/categorias">Categorias</Button>
                    <Button color="inherit" component={Link} to="/vendedores">Vendedores</Button>
                </Box>

                {/* BOTÕES DE AÇÃO (VENDA) */}
                <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
                    {/* Botão de Destaque: PDV */}
                    <Button 
                        variant="contained" 
                        color="secondary" // Cor de destaque
                        component={Link} 
                        to="/vender"
                        sx={{ fontWeight: 'bold' }}
                    >
                        Realizar Venda
                    </Button>

                    {/* Botão do Carrinho */}
                    <IconButton color="inherit" component={Link} to="/carrinho">
                        <ShoppingCartIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;