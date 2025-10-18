// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav className="p-4 bg-gray-800 text-white flex flex-wrap gap-x-4 gap-y-2">
            <span className="font-bold">Clientes:</span>
            <Link to="/" className="hover:text-blue-400">Cadastrar</Link>
            <Link to="/clientes" className="hover:text-blue-400">Listar</Link>
            
            <span className="font-bold ml-4">Vendedores:</span>
            <Link to="/vendedores/cadastrar" className="hover:text-green-400">Cadastrar</Link>
            <Link to="/vendedores" className="hover:text-green-400">Listar</Link>

            <span className="font-bold ml-4">Categorias:</span>
            <Link to="/categorias/cadastrar" className="hover:text-yellow-400">Cadastrar</Link>
            <Link to="/categorias" className="hover:text-yellow-400">Listar</Link>

            <span className="font-bold ml-4">Produtos:</span>
            <Link to="/produtos/cadastrar" className="hover:text-purple-400">Cadastrar</Link>
            <Link to="/produtos" className="hover:text-purple-400">Listar</Link>
        </nav>
    );
}

export default Header;