import React, { useState } from 'react';
import UsuarioService from '../services/UsuarioService';
import { Link } from 'react-router-dom';

function CadastroVendedor() {
    // Estado do formulário para Vendedor
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        areaResponsavel: '',
    });
    
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // Usa o Service para cadastrar VENDEDOR
            await UsuarioService.cadastrarVendedor(formData);
            setMessage('Vendedor cadastrado com sucesso!');
            setFormData({ nome: '', email: '', senha: '', telefone: '', areaResponsavel: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.mensagem || 'Erro ao cadastrar vendedor.';
            setMessage(errorMsg);
        }
    };

    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Vendedor</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} className="p-2 bg-gray-700" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 bg-gray-700" required />
                <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} className="p-2 bg-gray-700" required />
                <input type="tel" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} className="p-2 bg-gray-700" />
                <input type="text" name="areaResponsavel" placeholder="Área Responsável" value={formData.areaResponsavel} onChange={handleChange} className="p-2 bg-gray-700" />
                
                <button type="submit" className="p-2 bg-green-600 hover:bg-green-700 rounded">Cadastrar</button>
            </form>
            {message && <p className="mt-4">{message}</p>}
            <Link to="/vendedores" className="text-green-400 mt-4 inline-block">Ver Vendedores</Link>
        </div>
    );
}

export default CadastroVendedor;