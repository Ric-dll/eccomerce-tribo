import React, { useState, useEffect } from 'react';
import CategoriaService from '../services/CategoriaService';
import { Link } from 'react-router-dom';

function CadastroCategoria() {
    const [formData, setFormData] = useState({ nome: '', descricao: '', categoriaPai: '' });
    const [categorias, setCategorias] = useState([]);
    const [message, setMessage] = useState('');

    // Busca categorias existentes para usar no dropdown de "Categoria Pai"
    useEffect(() => {
        CategoriaService.listarCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => console.error("Erro ao buscar categorias:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        // Trata o campo 'categoriaPai' para ser null se estiver vazio
        const dataToSubmit = {
            ...formData,
            categoriaPai: formData.categoriaPai || null
        };

        try {
            await CategoriaService.cadastrarCategoria(dataToSubmit);
            setMessage('Categoria cadastrada com sucesso!');
            setFormData({ nome: '', descricao: '', categoriaPai: '' });
            // Atualiza a lista de categorias no dropdown
            CategoriaService.listarCategorias().then(response => setCategorias(response.data));
        } catch (error) {
            setMessage(error.response?.data?.mensagem || 'Erro ao cadastrar categoria.');
        }
    };

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Categoria</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <input type="text" name="nome" placeholder="Nome da Categoria" value={formData.nome} onChange={handleChange} className="p-2 bg-gray-700" required />
                <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} className="p-2 bg-gray-700" />
                
                <select name="categoriaPai" value={formData.categoriaPai} onChange={handleChange} className="p-2 bg-gray-700">
                    <option value="">Nenhuma (Categoria Raiz)</option>
                    {categorias.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.nome}</option>
                    ))}
                </select>

                <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 rounded">Cadastrar</button>
            </form>
            {message && <p className="mt-4">{message}</p>}
            <Link to="/categorias" className="text-blue-400 mt-4 inline-block">Ver Categorias</Link>
        </div>
    );
}

export default CadastroCategoria;