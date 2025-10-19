import React, { useState, useEffect } from 'react';
import CategoriaService from '../services/CategoriaService';
import { Link } from 'react-router-dom';

function ListaCategorias() {
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        CategoriaService.listarCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => console.error("Erro ao buscar categorias:", error));
    }, []);

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Lista de Categorias</h1>
            <Link to="/categorias/cadastrar" className="text-blue-400 mb-4 inline-block">Nova Categoria</Link>
            <table className="w-full text-left">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="p-2">Nome</th>
                        <th className="p-2">Categoria Pai</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800">
                    {categorias.map(cat => (
                        <tr key={cat._id}>
                            <td className="p-2">{cat.nome}</td>
                            {/* O backend (Pessoa 1) popula o nome da categoriaPai */}
                            <td className="p-2">{cat.categoriaPai ? cat.categoriaPai.nome : 'N/A (Raiz)'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaCategorias;