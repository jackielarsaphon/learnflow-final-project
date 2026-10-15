import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ProgressProvider } from './hooks/useProgress.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<StrictMode><ProgressProvider><App /></ProgressProvider></StrictMode>);
