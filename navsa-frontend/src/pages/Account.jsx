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
  FaUser,
  FaUserPlus,
  FaSignOutAlt,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import './Account.css'

function Account() {
  const { user, login, logout } = useAuth()
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

      login({
        user: data.user,
        token: data.token,
        roles: data.user?.role ? [data.user.role] : [],
        permissions: data.permissions || [],
      })
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
          {user ? (
            <div className="account-login-card">
              <div className="account-login-card__header">
                <div className="account-login-card__icon" aria-hidden="true">
                  <FaUser />
                </div>
                <div>
                  <span>Trade Portal Active</span>
                  <h2>My Account Profile</h2>
                </div>
              </div>

              <div style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                <p style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 'bold', color: '#17457e' }}>
                  {user.name || user.company_name || 'Valued Account'}
                </p>
                <p style={{ margin: '0 0 6px', color: '#555' }}>
                  <strong>Email:</strong> {user.email}
                </p>
                {user.company_name && (
                  <p style={{ margin: '0 0 6px', color: '#555' }}>
                    <strong>Company:</strong> {user.company_name}
                  </p>
                )}
                <p style={{ margin: '0', color: '#555' }}>
                  <strong>Status:</strong> <span style={{ color: '#2e7d32', fontWeight: 600 }}>{user.status || 'Active'}</span>
                </p>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(user.role === 'admin' || user.role === 'super-admin' || user.is_admin) && (
                  <Link to="/admin" className="account-login-submit" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                    Go to Admin Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    setError(null)
                    try {
                      await logout()
                      navigate('/', { replace: true })
                    } catch (logoutError) {
                      console.error('Sign out failed:', logoutError)
                      setError('Sign out could not be completed. Please try again.')
                    }
                  }}
                  className="account-login-submit"
                  style={{ background: '#d32f2f', border: 'none', cursor: 'pointer' }}
                >
                  <FaSignOutAlt style={{ marginRight: '8px' }} />
                  <span>Sign Out / Logout</span>
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </section>
      </div>
    </main>
  )
}

export default Account