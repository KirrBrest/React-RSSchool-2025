import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from '@/App.tsx';
import ErrorBoundary from '@/components/errors/ErrorBoundary';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <HashRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HashRouter>
  );
} else {
  console.error('Element with id "root" not found');
}
