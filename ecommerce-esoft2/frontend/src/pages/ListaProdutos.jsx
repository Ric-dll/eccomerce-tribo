import React, { useState, useEffect } from 'react';
import ProdutoService from '../services/ProdutoService';
import { Link } from 'react-router-dom';

function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ProdutoService.listarProdutos()
            .then(response => {
                setProdutos(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Erro ao buscar produtos:", error));
    }, []);

    if (loading) return <p className="text-white">Carregando...</p>;

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Lista de Produtos</h1>
            <Link to="/produtos/cadastrar" className="text-purple-400 mb-4 inline-block">Novo Produto</Link>
            <table className="w-full text-left">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="p-2">Nome</th>
                        <th className="p-2">Preço</th>
                        <th className="p-2">Estoque</th>
                        <th className="p-2">Categoria</th>
                        <th className="p-2">Vendedor</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800">
                    {produtos.map(produto => (
                        <tr key={produto._id}>
                            <td className="p-2">{produto.nome}</td>
                            <td className="p-2">R$ {produto.preco.toFixed(2)}</td>
                            <td className="p-2">{produto.estoque}</td>
                            {/* O backend (Pessoa 1) popula 'categoria' e 'vendedor' */}
                            <td className="p-2">{produto.categoria ? produto.categoria.nome : 'N/A'}</td>
                            <td className="p-2">{produto.vendedor ? produto.vendedor.nome : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaProdutos;