import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';

// Importa TODAS as páginas
import CadastroCliente from './pages/CadastroCliente';
import ListaClientes from './pages/ListaClientes';
import CadastroCategoria from './pages/CadastroCategoria';
import ListaCategorias from './pages/ListaCategorias';
import CadastroVendedor from './pages/CadastroVendedor';
import ListaVendedores from './pages/ListaVendedores';
import CadastroProduto from './pages/CadastroProduto';
import ListaProdutos from './pages/ListaProdutos';
import Carrinho from './pages/Carrinho';
import RealizarVenda from './pages/RealizarVenda'; 
import DashboardAdmin from './pages/DashboardAdmin';

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* --- A Rota Raiz agora é o Dashboard --- */}
        <Route path="/" element={<DashboardAdmin />} />
        
        {/* Rotas de Cliente */}
        <Route path="/clientes/cadastrar" element={<CadastroCliente />} />
        <Route path="/clientes" element={<ListaClientes />} />
        
        {/* Rotas de Categoria */}
        <Route path="/categorias/cadastrar" element={<CadastroCategoria />} />
        <Route path="/categorias" element={<ListaCategorias />} />
        
        {/* Rotas de Vendedor */}
        <Route path="/vendedores/cadastrar" element={<CadastroVendedor />} />
        <Route path="/vendedores" element={<ListaVendedores />} />
        
        {/* Rotas de Produto */}
        <Route path="/produtos/cadastrar" element={<CadastroProduto />} />
        <Route path="/produtos" element={<ListaProdutos />} />

        {/* Rotas de Venda (PESSOA 2) */}
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/vender" element={<RealizarVenda />} />
      </Routes>
    </>
  );
}

export default App;