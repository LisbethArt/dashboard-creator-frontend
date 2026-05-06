import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AnalysisFlowProvider } from './context/AnalysisFlowContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AnalysisFlowProvider>
        <App />
      </AnalysisFlowProvider>
    </ThemeProvider>
  </BrowserRouter>,
)
