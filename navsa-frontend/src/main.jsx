import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ShippingProvider } from './context/ShippingContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ShippingProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ShippingProvider>
    </AuthProvider>
  </StrictMode>,
)