
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import { ConversationalAIProvider } from './contexts/ConversationalAIContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <ConversationalAIProvider>
      <App />
    </ConversationalAIProvider>
  </ThemeProvider>
);
