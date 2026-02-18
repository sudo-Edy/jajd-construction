import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/grayscale.css'; // Dark mode styles

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root and render
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
