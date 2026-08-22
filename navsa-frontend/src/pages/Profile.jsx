import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaUser,
  FaShoppingBag,
  FaEdit,
  FaCheckCircle,
  FaRedoAlt,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaExclamationCircle,
  FaCalendarAlt,
  FaTag,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../utils/currency'
import './Profile.css'

export default function Profile() {
  const { user, login, logout } = useAuth()
  const { reorderItems } = useCart()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'orders'
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [reorderingId, setReorderingId] = useState(null)
  const [expandedOrders, setExpandedOrders] = useState({})

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.mobile || '',
    company_name: user?.company_name || '',
    address_line_1: user?.customer_detail?.address_line_1 || '',
    address_line_2: user?.customer_detail?.address_line_2 || '',
    city: user?.customer_detail?.city || '',
    province: user?.customer_detail?.province || '',
    zip_code: user?.customer_detail?.zip_code || '',
    country: user?.customer_detail?.country || 'United Kingdom',
  })

  // Load user profile details from backend
  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        const BASE = import.meta.env.VITE_API_URL || '/api'
        const res = await fetch(`${BASE}/profile?user_id=${user.id}&email=${encodeURIComponent(user.email)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.user) {
            const u = data.user
            const cd = data.customer_detail || {}
            setFormData({
              name: u.name || '',
              email: u.email || '',
              phone: u.phone || cd.mobile || '',
              company_name: u.company_name || '',
              address_line_1: cd.address_line_1 || '',
              address_line_2: cd.address_line_2 || '',
              city: cd.city || '',
              province: cd.province || cd.region || '',
              zip_code: cd.zip_code || '',
              country: cd.country || 'United Kingdom',
            })
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
    }

    fetchProfile()
  }, [user])

  // Load orders history
  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      setLoadingOrders(true)
      try {
        const BASE = import.meta.env.VITE_API_URL || '/api'
        const res = await fetch(`${BASE}/orders?user_id=${user.id}&email=${encodeURIComponent(user.email)}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(Array.isArray(data) ? data : [])
        } else {
          setOrders([])
        }
      } catch (err) {
        console.error('Failed to load orders:', err)
        setOrders([])
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-unauth-card">
            <FaExclamationCircle className="profile-unauth-icon" />
            <h2>Please Sign In to Access Your Profile</h2>
            <p>You need to be logged in to view your profile details, edit information, and see your trade order history.</p>
            <Link to="/account/login" className="profile-btn profile-btn-primary">
              Log In to Trade Account
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api'
      const response = await fetch(`${BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      // Update AuthContext user data
      login({
        user: { ...user, ...formData },
        token: localStorage.getItem('token') || localStorage.getItem('admin_token'),
      })

      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (err) {
      setErrorMessage(err.message || 'Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }))
  }

  const handleReorder = async (order) => {
    setReorderingId(order.id)
    setSuccessMessage('')

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api'
      const res = await fetch(`${BASE}/orders/${order.id}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      let itemsToAdd = []

      if (res.ok) {
        const data = await res.json()
        itemsToAdd = data.items || []
      }

      if (!itemsToAdd || itemsToAdd.length === 0) {
        // Fallback to order's existing items if API is offline
        itemsToAdd = (order.items || []).map(item => ({
          id: item.product_id || item.id,
          navsa_product_code: item.navsa_product_code,
          description: item.product_name,
          price: Number(item.unit_price || 0),
          case_quantity: item.case_quantity || 1,
          units_per_case: item.units_per_case || 1,
        }))
      }

      // Add to cart with current prices
      reorderItems(itemsToAdd)

      setSuccessMessage(`Order #${order.order_number} items added to your cart with current prices! Redirecting to Basket…`)
      
      setTimeout(() => {
        navigate('/basket')
      }, 1500)

    } catch (err) {
      console.error('Reorder error:', err)
      // Fallback local reorder
      const fallbackItems = (order.items || []).map(item => ({
        id: item.product_id || item.id,
        navsa_product_code: item.navsa_product_code,
        description: item.product_name,
        price: Number(item.unit_price || 0),
        case_quantity: item.case_quantity || 1,
      }))
      reorderItems(fallbackItems)
      navigate('/basket')
    } finally {
      setReorderingId(null)
    }
  }

  const handleSignOut = async () => {
    if (loggingOut) return

    setErrorMessage('')
    setLoggingOut(true)

    try {
      await logout()
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Sign out failed:', err)
      setErrorMessage(
        'Sign out could not be completed. Please check your connection and try again.'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        
        {/* Profile Header Banner */}
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-header-info">
            <h1>{user.name || user.company_name || 'Trade Account'}</h1>
            <p><FaEnvelope /> {user.email} &bull; <FaBuilding /> {user.company_name || 'Registered Trade Member'}</p>
          </div>
          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleSignOut}
            disabled={loggingOut}
          >
            <FaSignOutAlt /> {loggingOut ? 'Signing Out…' : 'Sign Out'}
          </button>
        </div>

        {/* Success / Error Alerts */}
        {successMessage && (
          <div className="profile-alert profile-alert-success">
            <FaCheckCircle /> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="profile-alert profile-alert-error">
            <FaExclamationCircle /> {errorMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab ${activeTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaEdit /> My Profile Details
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> Order History & Reorder
            {orders.length > 0 && <span className="profile-tab-badge">{orders.length}</span>}
          </button>
        </div>

        {/* TAB 1: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2><FaUser /> Account Details</h2>
              <p>Update your trade business contact information and shipping address.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="profile-form-grid">
                
                <div className="profile-form-field">
                  <label htmlFor="name"><FaUser /> Full Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="email"><FaEnvelope /> Email Address (Account ID)</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="is-disabled"
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="phone"><FaPhone /> Phone / Mobile Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+44 7123 456789"
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="company_name"><FaBuilding /> Company / Business Name</label>
                  <input
                    id="company_name"
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="NAVSA Wholesale Ltd"
                  />
                </div>

                <div className="profile-form-field profile-field-full">
                  <label htmlFor="address_line_1"><FaMapMarkerAlt /> Address Line 1</label>
                  <input
                    id="address_line_1"
                    type="text"
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleInputChange}
                    placeholder="Building 4, Commerce Park"
                  />
                </div>

                <div className="profile-form-field profile-field-full">
                  <label htmlFor="address_line_2">Address Line 2 (Optional)</label>
                  <input
                    id="address_line_2"
                    type="text"
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleInputChange}
                    placeholder="Street / Estate"
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="city">City / Town</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="London"
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="province">County / Region</label>
                  <input
                    id="province"
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="Greater London"
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="zip_code">Postcode / ZIP</label>
                  <input
                    id="zip_code"
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    placeholder="EC1A 1BB"
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="country">Country</label>
                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="United Kingdom"
                  />
                </div>

              </div>

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="profile-btn profile-btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving Changes…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY & REORDER */}
        {activeTab === 'orders' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2><FaShoppingBag /> Order History</h2>
              <p>View past trade orders and easily reorder items with current live database pricing.</p>
            </div>

            {loadingOrders ? (
              <div className="profile-loading">Loading your order history…</div>
            ) : orders.length === 0 ? (
              <div className="profile-empty-orders">
                <FaBoxOpen className="profile-empty-icon" />
                <h3>No Orders Found</h3>
                <p>You haven't placed any wholesale orders yet.</p>
                <Link to="/shop" className="profile-btn profile-btn-primary">
                  Browse Product Catalogue
                </Link>
              </div>
            ) : (
              <div className="profile-orders-list">
                {orders.map(order => {
                  const isExpanded = expandedOrders[order.id] !== false // Default open

                  return (
                    <div key={order.id} className="profile-order-card">
                      
                      {/* Order Header Summary */}
                      <div className="profile-order-header">
                        <div className="profile-order-main-info">
                          <span className="profile-order-number">{order.order_number}</span>
                          <span className="profile-order-date">
                            <FaCalendarAlt /> {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className={`profile-order-status status-${order.status || 'processing'}`}>
                            {order.status || 'processing'}
                          </span>
                        </div>

                        <div className="profile-order-header-right">
                          <div className="profile-order-total">
                            <small>Order Total</small>
                            <strong>{formatPrice(order.total_amount)}</strong>
                          </div>

                          <button
                            type="button"
                            className="profile-reorder-btn"
                            disabled={reorderingId === order.id}
                            onClick={() => handleReorder(order)}
                          >
                            <FaRedoAlt className={reorderingId === order.id ? 'spin' : ''} />
                            <span>{reorderingId === order.id ? 'Updating Prices…' : 'Reorder (Current Prices)'}</span>
                          </button>

                          <button
                            type="button"
                            className="profile-expand-btn"
                            onClick={() => toggleOrderExpand(order.id)}
                            aria-label="Toggle details"
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>
                      </div>

                      {/* Order Details & Items (Collapsible) */}
                      {isExpanded && (
                        <div className="profile-order-details">
                          {order.shipping_address && (
                            <div className="profile-order-shipping-note">
                              <strong>Shipping:</strong> {order.shipping_method || 'Delivery'} &bull; {order.shipping_address}
                            </div>
                          )}

                          <table className="profile-order-items-table">
                            <thead>
                              <tr>
                                <th>Product Details</th>
                                <th>SKU</th>
                                <th>Cases</th>
                                <th>Price / Case</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(order.items || []).map((item, idx) => (
                                <tr key={item.id || idx}>
                                  <td>
                                    <div className="profile-item-title">
                                      <strong>{item.product_name || item.description || 'Product'}</strong>
                                      {item.units_per_case && <small>Units / Case: {item.units_per_case}</small>}
                                    </div>
                                  </td>
                                  <td><span className="profile-sku">{item.navsa_product_code || '-'}</span></td>
                                  <td><strong>{item.case_quantity || item.quantity || 1} cases</strong></td>
                                  <td>{formatPrice(item.unit_price)}</td>
                                  <td><strong>{formatPrice((item.unit_price || 0) * (item.case_quantity || 1))}</strong></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
