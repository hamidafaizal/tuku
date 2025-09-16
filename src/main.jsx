import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '/src/index.css';
import App from '/src/App.jsx';
import { ModeProvider } from '/src/context/ModeContext.jsx';
import { AuthProvider } from '/src/context/AuthContext.jsx'; // Impor AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ModeProvider>
        <App />
      </ModeProvider>
    </AuthProvider>
  </StrictMode>,
);

