import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CanteenProvider } from './context/CanteenContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CanteenProvider>
      <App />
    </CanteenProvider>
  </StrictMode>,
)
