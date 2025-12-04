import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const VendaContext = createContext();

export const VendaProvider = ({ children }) => {
    const [clienteAtivo, setClienteAtivo] = useState(() => {
        const salvo = localStorage.getItem('clienteAtivo');
        if (salvo) {
            try {
                return JSON.parse(salvo);
            } catch { 
                return null;
            }
        }
        return null;
    });

    const selecionarCliente = (cliente) => {
        setClienteAtivo(cliente);
        localStorage.setItem('clienteAtivo', JSON.stringify(cliente));
        alert(`Cliente "${cliente.Nome}" selecionado para venda!`);
    };

    const limparCliente = () => {
        setClienteAtivo(null);
        localStorage.removeItem('clienteAtivo');
    };

    return (
        <VendaContext.Provider value={{ clienteAtivo, selecionarCliente, limparCliente }}>
            {children}
        </VendaContext.Provider>
    );
};