import './index.css'
import ProductDetail from './pages/ProductDetail'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Brands from './pages/Brands'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Account from './pages/Account'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import Basket from './pages/Basket'
import Services from './pages/Services'
import ScrollToHash from './components/ScrollToHash'
import Admin from './pages/Admin'
import BecomeCustomer from './pages/BecomeCustomer'
import BecomeSupplier from './pages/BecomeSupplier'
import Tradeshow from './pages/Tradeshow'
import TermsConditions from './pages/footer-links/TermsConditions'
import PrivacyCookies from './pages/footer-links/PrivacyCookies'
import AboutUs from './pages/footer-links/AboutUs'
import ContactUs from './pages/footer-links/ContactUs'

function PlaceholderPage({ title, message = 'This page is being prepared.' }) {
  return (
    <main className="placeholder-page" style={{
      minHeight: '60vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '72px 24px',
      background:
        'radial-gradient(circle at top left, rgba(28, 78, 137, 0.14), transparent 34%), #f4f7fb',
      color: '#0b284d',
      fontFamily: "'Inter', Arial, sans-serif",
    }}>
      <div style={{
        width: 'min(100%, 720px)',
        padding: '54px 32px',
        textAlign: 'center',
        background: '#ffffff',
        border: '1px solid rgba(15, 55, 98, 0.12)',
        borderRadius: '24px',
        boxShadow: '0 24px 60px rgba(11, 40, 77, 0.12)',
      }}>
        <span style={{
          display: 'inline-flex',
          marginBottom: '16px',
          padding: '8px 14px',
          color: '#d95713',
          background: '#fff3e9',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          NAVSA Information
        </span>

        <h1 style={{
          margin: '0 0 14px',
          color: '#0b284d',
          fontSize: 'clamp(32px, 5vw, 48px)',
          lineHeight: 1.1,
          fontWeight: 800,
        }}>
          {title}
        </h1>

        <p style={{
          maxWidth: '520px',
          margin: '0 auto',
          color: '#61728a',
          fontSize: '16px',
          lineHeight: 1.75,
        }}>
          {message}
        </p>
      </div>
    </main>
  )
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/*" element={<Admin />} />

        <Route
          path="/*"
          element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/account/login" element={<Account />} />
                <Route path="/account/create" element={<BecomeCustomer />} />
                <Route path="/account/supplier" element={<BecomeSupplier />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account/profile" element={<Profile />} />

                <Route path="/account" element={<Navigate to="/profile" replace />} />
                <Route path="/become-a-customer" element={<Navigate to="/account/create" replace />} />
                <Route path="/become-a-supplier" element={<Navigate to="/account/supplier" replace />} />
                <Route path="/account/become-a-supplier" element={<Navigate to="/account/supplier" replace />} />

                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/brand" element={<Brands />} />
                <Route path="/services" element={<Services />} />

                <Route path="/terms-and-conditions" element={<TermsConditions />} />
                <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />

                <Route
                  path="/privacy-and-cookies"
                  element={<PrivacyCookies />}
                />
                <Route path="/privacy" element={<Navigate to="/privacy-and-cookies" replace />} />

                <Route
                  path="/offers"
                  element={
                    <PlaceholderPage
                      title="Offers"
                      message="NAVSA's latest offers page will be added here."
                    />
                  }
                />
                <Route
                  path="/new-arrivals"
                  element={
                    <PlaceholderPage
                      title="New Arrivals"
                      message="NAVSA's new product arrivals page will be added here."
                    />
                  }
                />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/about" element={<Navigate to="/about-us" replace />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
                <Route path="/page/contact-us" element={<Navigate to="/contact-us" replace />} />

                <Route path="/tradeshow" element={<Tradeshow />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App