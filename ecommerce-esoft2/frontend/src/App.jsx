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

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Rotas de Cliente */}
        <Route path="/" element={<CadastroCliente />} />
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
      </Routes>
    </>
  );
}

export default App;