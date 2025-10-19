import React, { useState, useEffect } from 'react';
import ProdutoService from '../services/ProdutoService';
import CategoriaService from '../services/CategoriaService';
import UsuarioService from '../services/UsuarioService';
import { Link } from 'react-router-dom';

function CadastroProduto() {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
        categoria: '', // Será o ID da categoria
        vendedor: '',  // Será o ID do vendedor
    });
    
    // Estados para armazenar as listas de categorias e vendedores
    const [categorias, setCategorias] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    
    const [message, setMessage] = useState('');

    // Hook para buscar dados das listas quando o componente carregar
    useEffect(() => {
        // Busca categorias
        CategoriaService.listarCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => console.error("Erro ao buscar categorias:", error));

        // Busca vendedores
        UsuarioService.listarVendedores()
            .then(response => setVendedores(response.data))
            .catch(error => console.error("Erro ao buscar vendedores:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Validação simples para os <select>
        if (!formData.categoria || !formData.vendedor) {
            setMessage('Por favor, selecione uma categoria e um vendedor.');
            return;
        }

        try {
            await ProdutoService.cadastrarProduto(formData);
            setMessage('Produto cadastrado com sucesso!');
            setFormData({ nome: '', descricao: '', preco: '', estoque: '', categoria: '', vendedor: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.mensagem || 'Erro ao cadastrar produto.';
            setMessage(errorMsg);
        }
    };

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Produto</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <input type="text" name="nome" placeholder="Nome do Produto" value={formData.nome} onChange={handleChange} className="p-2 bg-gray-700" required />
                <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} className="p-2 bg-gray-700" />
                <input type="number" name="preco" placeholder="Preço" value={formData.preco} onChange={handleChange} className="p-2 bg-gray-700" required />
                <input type="number" name="estoque" placeholder="Estoque" value={formData.estoque} onChange={handleChange} className="p-2 bg-gray-700" required />
                
                {/* Dropdown para Categorias */}
                <select name="categoria" value={formData.categoria} onChange={handleChange} className="p-2 bg-gray-700" required>
                    <option value="">Selecione uma Categoria</option>
                    {categorias.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.nome}</option>
                    ))}
                </select>

                {/* Dropdown para Vendedores */}
                <select name="vendedor" value={formData.vendedor} onChange={handleChange} className="p-2 bg-gray-700" required>
                    <option value="">Selecione um Vendedor</option>
                    {vendedores.map(vend => (
                        <option key={vend._id} value={vend._id}>{vend.nome}</option>
                    ))}
                </select>

                <button type="submit" className="p-2 bg-purple-600 hover:bg-purple-700 rounded">Cadastrar Produto</button>
            </form>
            {message && <p className="mt-4">{message}</p>}
            <Link to="/produtos" className="text-purple-400 mt-4 inline-block">Ver Produtos</Link>
        </div>
    );
}

export default CadastroProduto;