
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App.tsx'
import './index.css'

console.log('Initializing main.tsx');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found');
} else {
  console.log('Root element found, rendering app');
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering the app:', error);
  }
}
