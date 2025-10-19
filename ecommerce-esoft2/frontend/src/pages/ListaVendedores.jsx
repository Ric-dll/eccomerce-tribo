import React, { useState, useEffect } from 'react';
import UsuarioService from '../services/UsuarioService';
import { Link } from 'react-router-dom';

function ListaVendedores() {
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca a lista de VENDEDORES
        UsuarioService.listarVendedores()
            .then(response => {
                setVendedores(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Erro ao buscar vendedores:", error));
    }, []);

    if (loading) return <p className="text-white">Carregando...</p>;

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Lista de Vendedores</h1>
            <Link to="/vendedores/cadastrar" className="text-green-400 mb-4 inline-block">Novo Vendedor</Link>
            <table className="w-full text-left">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="p-2">Nome</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Área Responsável</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800">
                    {vendedores.map(vendedor => (
                        <tr key={vendedor._id}>
                            <td className="p-2">{vendedor.nome}</td>
                            <td className="p-2">{vendedor.email}</td>
                            <td className="p-2">{vendedor.areaResponsavel || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaVendedores;