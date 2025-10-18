// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Importa a navegação

// Importa as páginas que criamos
import CadastroCliente from './pages/CadastroCliente';
import ListaClientes from './pages/ListaClientes';
import CadastroCategoria from './pages/CadastroCategoria';
import ListaCategorias from './pages/ListaCategorias';
// (Importe as outras páginas de Vendedor e Produto aqui)

function App() {
  // O App agora atua como o controlador central de rotas
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<CadastroCliente />} />
        <Route path="/clientes" element={<ListaClientes />} />
        <Route path="/categorias/cadastrar" element={<CadastroCategoria />} />
        <Route path="/categorias" element={<ListaCategorias />} />
        
        {/* Rotas para Vendedor (Exemplo)
        <Route path="/vendedores/cadastrar" element={<CadastroVendedor />} />
        <Route path="/vendedores" element={<ListaVendedores />} />
        */}
        
        {/* Rotas para Produto (Exemplo)
        <Route path="/produtos/cadastrar" element={<CadastroProduto />} />
        <Route path="/produtos" element={<ListaProdutos />} />
        */}
      </Routes>
    </>
  );
}

export default App;