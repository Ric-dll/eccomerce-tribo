import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Importa o tema que criamos


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envolvendo TUDO com o ThemeProvider */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reseta o CSS e aplica o fundo padrão */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);