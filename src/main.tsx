import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from '@/App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <HashRouter>
      <App />
    </HashRouter>
  );
} else {
  console.error('Element with id "root" not found');
}
