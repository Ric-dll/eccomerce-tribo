import React, { useState, useEffect } from 'react';
import AdminService from '../services/AdminService';

// --- Material UI ---
import {
    Container, Grid, Paper, Typography, Box, CircularProgress, 
    Card, CardContent, Divider
} from '@mui/material';

// --- Ícones ---
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// --- (Gráficos) ---
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function DashboardAdmin() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Busca os dados do backend ao carregar a página
    useEffect(() => {
        AdminService.getStats()
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar dashboard:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Box sx={{ display:'flex', justifyContent:'center', mt: 10 }}><CircularProgress /></Box>;
    }

    if (!stats) {
        return <Typography align="center" sx={{ mt: 5 }}>Erro ao carregar dados.</Typography>;
    }

    // Função para formatar dinheiro (R$)
    const formatMoney = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    // Função para formatar data no gráfico (2023-11-15 -> 15/11)
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                Dashboard de Vendas
            </Typography>

            {/* --- 1. CARDS DE KPI (Indicadores) --- */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                
                {/* Faturamento Total */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.light', color: 'success.main', mr: 2 }}>
                                    <AttachMoneyIcon fontSize="large" />
                                </Box>
                                <Typography variant="h6" color="text.secondary">Faturamento (30 dias)</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                {formatMoney(stats.faturamentoTotal)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Total de Pedidos */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
                                    <ShoppingBagIcon fontSize="large" />
                                </Box>
                                <Typography variant="h6" color="text.secondary">Pedidos Realizados</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                {stats.pedidosTotais}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Novos Clientes */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.main', mr: 2 }}>
                                    <GroupAddIcon fontSize="large" />
                                </Box>
                                <Typography variant="h6" color="text.secondary">Novos Clientes</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                {stats.novosClientes}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* --- 2. GRÁFICO DE LINHA --- */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">Evolução Diária de Vendas</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={stats.vendasPorDia} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis 
                                dataKey="data" 
                                tickFormatter={formatDate} 
                                stroke="#666"
                            />
                            <YAxis 
                                stroke="#666"
                                tickFormatter={(value) => `R$${value}`}
                            />
                            <Tooltip 
                                formatter={(value) => [formatMoney(value), 'Vendas']}
                                labelFormatter={(label) => formatDate(label)}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="totalVendas" 
                                stroke="#1976d2" 
                                strokeWidth={3}
                                activeDot={{ r: 8 }} 
                                name="Vendas"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Container>
    );
}

export default DashboardAdmin;