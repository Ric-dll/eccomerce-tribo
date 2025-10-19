import React, { useState } from 'react';
import UsuarioService from '../services/UsuarioService';
import { Link } from 'react-router-dom';

function CadastroCliente() {
    // Tarefa: Gerenciar o estado (useState) dos formulários
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        telefone: '',
        dataNasc: '',
    });
    
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Tarefa: Implementar o código que diz: "Quando o botão é clicado..."
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            // "...pegue os dados do estado e use o Service para enviar para a API."
            await UsuarioService.cadastrarCliente(formData);
            setMessage('Cliente cadastrado com sucesso!');
            setFormData({ nome: '', email: '', senha: '', cpf: '', telefone: '', dataNasc: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.mensagem || 'Erro ao cadastrar cliente.';
            setMessage(errorMsg);
        }
    };

    // Estilos de esqueleto (Pessoa 3 irá refinar)
    return (
        <div className="p-4 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Cadastro de Cliente</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} className="p-2 bg-gray-700" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 bg-gray-700" required />
                <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} className="p-2 bg-gray-700" required />
                <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} className="p-2 bg-gray-700" />
                <input type="tel" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} className="p-2 bg-gray-700" />
                <input type="date" name="dataNasc" value={formData.dataNasc} onChange={handleChange} className="p-2 bg-gray-700" />
                
                <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 rounded">Cadastrar</button>
            </form>
            {message && <p className="mt-4">{message}</p>}
            <Link to="/clientes" className="text-blue-400 mt-4 inline-block">Ver Clientes</Link>
        </div>
    );
}

export default CadastroCliente;