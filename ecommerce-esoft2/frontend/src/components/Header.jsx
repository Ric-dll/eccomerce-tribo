// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav className="p-4 bg-gray-800 text-white flex gap-4">
            <Link to="/" className="hover:text-blue-400">Cadastro Cliente</Link>
            <Link to="/clientes" className="hover:text-blue-400">Lista Clientes</Link>
            <Link to="/categorias/cadastrar" className="hover:text-blue-400">Cadastro Categoria</Link>
            <Link to="/categorias" className="hover:text-blue-400">Lista Categorias</Link>
            {/* Adicione links para Vendedor e Produto aqui */}
        </nav>
    );
}

export default Header;