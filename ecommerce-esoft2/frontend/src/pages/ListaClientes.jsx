import React, { useState, useEffect } from 'react';
import UsuarioService from '../services/UsuarioService';
import { Link } from 'react-router-dom';

function ListaClientes() {
    // Tarefa: Gerenciar o estado (useState) das listas
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Tarefa: Usar o Service para buscar dados
        UsuarioService.listarClientes()
            .then(response => {
                setClientes(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Erro ao buscar clientes:", error));
    }, []);

    if (loading) return <p className="text-white">Carregando...</p>;

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
            <Link to="/" className="text-blue-400 mb-4 inline-block">Novo Cliente</Link>
            <table className="w-full text-left">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="p-2">Nome</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Telefone</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800">
                    {clientes.map(cliente => (
                        <tr key={cliente._id}>
                            <td className="p-2">{cliente.nome}</td>
                            <td className="p-2">{cliente.email}</td>
                            <td className="p-2">{cliente.telefone || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaClientes;