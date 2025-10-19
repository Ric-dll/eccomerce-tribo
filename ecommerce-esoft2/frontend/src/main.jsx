// frontend/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa o Roteador
import './index.css'; // Importa o Tailwind
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Envolve o App com o Roteador */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);