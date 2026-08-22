import { Link } from 'react-router-dom'
import './ProductAccessGate.css'

export default function ProductAccessGate() {
  return (
    <section className="product-access-gate-section" aria-labelledby="product-access-gate-title">
      <div className="product-access-gate-panel">
        <div className="product-access-gate-icon" aria-hidden="true">🔒</div>

        <h1 id="product-access-gate-title">Please Log In to View Products</h1>

        <p>
          Access is limited to approved trade and wholesale customers. Please log in or apply for a trade account to view our product directory, category listings, and wholesale prices.
        </p>

        <div className="product-access-gate-actions">
          <Link to="/login" className="product-access-gate-login">
            Log In
          </Link>
          <Link to="/register" className="product-access-gate-register">
            Become a Customer
          </Link>
        </div>
      </div>
    </section>
  )
}
