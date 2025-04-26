
import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot desde 'react-dom/client'
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root'); // Obtén el elemento raíz
const root = createRoot(rootElement); // Crea la raíz

root.render( // Renderiza tu aplicación dentro de la raíz
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
