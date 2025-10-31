import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Importações dos componentes Material UI
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Collapse,       // <--Para o efeito sanfona
    ListItemIcon    // <--Para os ícones
} from '@mui/material';

// ---  Importação de Ícones ---
import MenuIcon from '@mui/icons-material/Menu'; 
import GroupIcon from '@mui/icons-material/Group'; // Ícone para Clientes
import StorefrontIcon from '@mui/icons-material/Storefront'; // Ícone para Vendedores
import CategoryIcon from '@mui/icons-material/Category'; // Ícone para Categorias
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Ícone para Produtos
import ExpandLess from '@mui/icons-material/ExpandLess'; // Seta para cima
import ExpandMore from '@mui/icons-material/ExpandMore'; // Seta para baixo

function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // --- States para controlar cada submenu ---
    const [openClientes, setOpenClientes] = useState(false);
    const [openVendedores, setOpenVendedores] = useState(false);
    const [openCategorias, setOpenCategorias] = useState(false);
    const [openProdutos, setOpenProdutos] = useState(false);
    
    // Função para abrir/fechar o menu
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuLinksList = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
 
        >
            <List>
                {}
                <ListItemButton onClick={() => setOpenClientes(!openClientes)}>
                    <ListItemIcon>
                        <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="Clientes" />
                    {openClientes ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openClientes} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Cadastrar Cliente" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/clientes" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Listar Clientes" />
                        </ListItemButton>
                    </List>
                </Collapse>
                
                <Divider sx={{ my: 1 }} />

                {}
                <ListItemButton onClick={() => setOpenVendedores(!openVendedores)}>
                    <ListItemIcon>
                        <StorefrontIcon />
                    </ListItemIcon>
                    <ListItemText primary="Vendedores" />
                    {openVendedores ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openVendedores} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/vendedores/cadastrar" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Cadastrar Vendedor" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/vendedores" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Listar Vendedores" />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider sx={{ my: 1 }} />

                {}
                <ListItemButton onClick={() => setOpenCategorias(!openCategorias)}>
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Categorias" />
                    {openCategorias ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openCategorias} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/categorias/cadastrar" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Cadastrar Categoria" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/categorias" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Listar Categorias" />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider sx={{ my: 1 }} />

                {}
                <ListItemButton onClick={() => setOpenProdutos(!openProdutos)}>
                    <ListItemIcon>
                        <Inventory2Icon />
                    </ListItemIcon>
                    <ListItemText primary="Produtos" />
                    {openProdutos ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openProdutos} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/produtos/cadastrar" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Cadastrar Produto" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/produtos" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Listar Produtos" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </Box>
    );

    return (
        <>
            {}
            <AppBar 
                position="static" 
                sx={{ 
                    backgroundColor: '#121212'
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit" 
                        aria-label="menu"
                        sx={{ mr: 2 }} 
                        onClick={toggleDrawer(true)} 
                    >
                        <MenuIcon />
                    </IconButton>
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Painel de Controle
                    </Typography>

                </Toolbar>
            </AppBar>

            {}
            <Drawer
                anchor="left" 
                open={drawerOpen} 
                onClose={toggleDrawer(false)} 
            >
                {}
                {menuLinksList()}
            </Drawer>
        </>
    );
}

export default Header;