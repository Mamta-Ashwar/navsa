import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaTruck,
  FaUserPlus,
} from 'react-icons/fa'
import './Account.css'

function Account() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="account-login-page">
      <div className="account-login-shell">
        <section className="account-login-intro" aria-label="NAVSA trade account benefits">
          <span className="account-login-eyebrow">NAVSA TRADE PORTAL</span>
          <h1>
            <span>Welcome back to</span>
            <span>your trade account</span>
          </h1>
          <p>
            Sign in to access your approved NAVSA account and continue browsing
            our wholesale product catalogue.
          </p>

          <div className="account-login-benefits">
            <div>
              <FaCheckCircle />
              <span>Access approved trade pricing</span>
            </div>
            <div>
              <FaTruck />
              <span>Manage your wholesale shopping journey</span>
            </div>
            <div>
              <FaShieldAlt />
              <span>Secure account access</span>
            </div>
          </div>

          <div className="account-login-intro-brand" aria-label="NAVSA International">
            <img src="/logos/navsa-logo.png" alt="NAVSA International" />
          </div>

          <div className="account-login-support">
            <span>Not registered yet?</span>
            <Link to="/account/create">Apply for a customer account</Link>
          </div>
        </section>

        <section className="account-login-panel">
          <div className="account-login-card">
            <div className="account-login-card__header">
              <div className="account-login-card__icon" aria-hidden="true">
                <FaLock />
              </div>
              <div>
                <span>Secure sign in</span>
                <h2>Trade Account Login</h2>
              </div>
            </div>

            {error && (
              <div className="account-login-error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="account-login-form">
              <div className="account-login-field">
                <label htmlFor="trade-login-email">Email address</label>
                <div className="account-login-input-wrap">
                  <FaEnvelope className="account-login-field-icon" aria-hidden="true" />
                  <input
                    id="trade-login-email"
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="account-login-field">
                <label htmlFor="trade-login-password">Password</label>
                <div className="account-login-input-wrap">
                  <FaLock className="account-login-field-icon" aria-hidden="true" />
                  <input
                    id="trade-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="account-password-toggle"
                    onClick={() => setShowPassword(current => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="account-login-submit"
                disabled={loading}
              >
                <span>{loading ? 'Signing in…' : 'Log In'}</span>
                {!loading && <FaArrowRight aria-hidden="true" />}
              </button>
            </form>

            <div className="account-login-divider"><span>New to NAVSA?</span></div>

            <div className="account-login-actions">
              <Link to="/account/create" className="account-create-link">
                <FaUserPlus aria-hidden="true" />
                <span>Create a customer account</span>
              </Link>

              <p className="account-supplier-prompt">Want to become our supplier?</p>

              <Link
                to="/account/supplier"
                className="account-create-link account-supplier-button"
              >
                <FaTruck aria-hidden="true" />
                <span>Create a supplier account</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Account