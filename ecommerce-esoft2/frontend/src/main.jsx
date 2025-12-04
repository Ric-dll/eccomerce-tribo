import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 

// 1. Importar o nosso Contexto de Vendas
import { VendaProvider } from './context/VendaContext.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        {/* 2. Envolver o App com o VendaProvider AQUI */}
        <VendaProvider>
            <App />
        </VendaProvider>
        {/* ----------------------------------------- */}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);