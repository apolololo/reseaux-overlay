
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error handler for global uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
