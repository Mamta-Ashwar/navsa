import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  FaChevronDown,
  FaHeart,
  FaSearch,
  FaShoppingBasket,
  FaUser,
  FaSignOutAlt,
  FaTag,
  FaBolt,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaTrashAlt,
  FaFileAlt,
  FaHome,
  FaHistory,
  FaThLarge,
} from 'react-icons/fa'
import {
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md'
import { useCart } from '../../context/CartContext'
import { useCurrency } from '../../utils/currency'
import { useAuth } from '../../context/AuthContext'
import './HeaderMain.css'

const CATEGORIES = [
  { label: 'Chocolates', db: 'Chocolates' },
  { label: 'Groceries', db: 'Groceries' },
  { label: 'Confectionery', db: 'Confectionery' },
  { label: 'Crisps & Snacks', db: 'Crisps & Snacks' },
  { label: 'Cold and Hot Beverages', db: 'Cold and Hot Beverages' },
  { label: 'Biscuits', db: 'Biscuits' },
  { label: 'Seasonal', db: 'Seasonal' },
  { label: 'Chilled Items', db: 'Chilled Items' },
  { label: 'Frozen', db: 'Frozen' },
  { label: 'Baby and Kids', db: 'Baby and Kids' },
  { label: 'Health and Personal Care', db: 'Health and Personal Care' },
  { label: 'Pet Care and Food', db: 'Pet Care and Food' },
  { label: 'Cleaning & Households', db: 'Cleaning & Households' },
]

const LANGUAGES = [
  { value: '', label: 'Select Language' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pl', label: 'Polish' },
  { value: 'es', label: 'Spanish' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD US Dollar' },
  { value: 'EUR', label: 'EUR Euro' },
  { value: 'GBP', label: 'GBP Pound Sterling' },
]

function normaliseProducts(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.products)) return payload.products
  return []
}

function getProductImage(product) {
  if (!product?.web_image) return null
  return `/products/${product.web_image}`
}

export default function HeaderMain() {
  const navigate = useNavigate()
  const { wishlistCount, basketCount, basketTotal } = useCart()
  const { formatPrice } = useCurrency()
  const { user, logout, isAuthenticated, token } = useAuth()

  const searchAreaRef = useRef(null)
  const searchRequestRef = useRef(null)
  const profileMenuRef = useRef(null)

  const [shopOpen, setShopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('navsa_language')
    return saved === 'en' ? '' : saved || ''
  })

  const [currency, setCurrency] = useState(
    () => localStorage.getItem('navsa_currency') || 'GBP'
  )

  const [pricesHidden, setPricesHidden] = useState(
    () => localStorage.getItem('navsa_prices_hidden') === 'true'
  )

  function handleLanguageChange(selectedLang) {
    const lang = selectedLang || 'en'
    setLanguage(selectedLang)
    localStorage.setItem('navsa_language', selectedLang)

    const cookieVal = `/en/${lang}`
    document.cookie = `googtrans=${cookieVal}; path=/;`
    document.cookie = `googtrans=${cookieVal}; domain=${window.location.hostname}; path=/;`

    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl')
      document.documentElement.setAttribute('lang', 'ar')
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
      document.documentElement.setAttribute('lang', lang)
    }

    window.dispatchEvent(
      new CustomEvent('navsa-language-change', {
        detail: { language: selectedLang },
      })
    )

    const googleSelect = document.querySelector('.goog-te-combo')
    if (googleSelect) {
      googleSelect.value = lang
      googleSelect.dispatchEvent(new Event('change'))
    } else {
      window.location.reload()
    }
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('navsa_language') || ''
    if (savedLang) {
      const lang = savedLang === 'en' ? 'en' : savedLang
      const cookieVal = `/en/${lang}`
      document.cookie = `googtrans=${cookieVal}; path=/;`
      if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('navsa_currency', currency)

    window.dispatchEvent(
      new CustomEvent('navsa-currency-change', {
        detail: { currency },
      })
    )
  }, [currency])

  useEffect(() => {
    localStorage.setItem(
      'navsa_prices_hidden',
      String(pricesHidden)
    )

    document.documentElement.classList.toggle(
      'navsa-prices-hidden',
      pricesHidden
    )

    window.dispatchEvent(
      new CustomEvent('navsa-price-visibility-change', {
        detail: { hidden: pricesHidden },
      })
    )
  }, [pricesHidden])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
        setActiveSuggestion(-1)
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setShowSuggestions(false)
        setActiveSuggestion(-1)
        setShopOpen(false)
        setMobileOpen(false)
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    function handleScroll() {
      setIsSticky(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const value = search.trim()

    // Product search suggestions are trade-only. Logged-out visitors can still
    // submit a search and will land on the existing Shop access gate.
    if (!isAuthenticated || !token) {
      searchRequestRef.current?.abort()
      setSuggestions([])
      setSuggestionsLoading(false)
      setShowSuggestions(false)
      setActiveSuggestion(-1)
      return
    }

    if (value.length < 3) {
      searchRequestRef.current?.abort()
      setSuggestions([])
      setSuggestionsLoading(false)
      setShowSuggestions(value.length > 0)
      setActiveSuggestion(-1)
      return
    }

    const timer = window.setTimeout(async () => {
      searchRequestRef.current?.abort()

      const controller = new AbortController()
      searchRequestRef.current = controller
      setSuggestionsLoading(true)

      try {
        const BASE = import.meta.env.VITE_API_URL || '/api'
        const response = await fetch(
          `${BASE}/products?search=${encodeURIComponent(value)}&page=1`,
          { 
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Search request failed: ${response.status}`)
        }

        const payload = await response.json()
        setSuggestions(normaliseProducts(payload).slice(0, 8))
        setShowSuggestions(true)
        setActiveSuggestion(-1)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Header search error:', error)
          setSuggestions([])
          setShowSuggestions(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setSuggestionsLoading(false)
        }
      }
    }, 260)

    return () => window.clearTimeout(timer)
  }, [search, isAuthenticated, token])

  async function handleSignOut() {
    if (loggingOut) return

    setProfileDropdownOpen(false)
    setLoggingOut(true)

    try {
      await logout()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Sign out failed:', error)
      window.alert(
        'Sign out could not be completed. Please check your connection and try again.'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  function closeMenus() {
    setShopOpen(false)
    setMobileOpen(false)
  }

  function runSearch(value = search) {
    const cleanValue = String(value || '').trim()

    if (cleanValue && cleanValue.length < 3) {
      setSuggestions([])
      setSuggestionsLoading(false)
      setShowSuggestions(true)
      setActiveSuggestion(-1)
      return
    }

    setShowSuggestions(false)
    setActiveSuggestion(-1)
    closeMenus()

    navigate(
      cleanValue
        ? `/shop?search=${encodeURIComponent(cleanValue)}`
        : '/shop'
    )
  }

  function handleSearchSubmit(event) {
    event.preventDefault()

    if (
      activeSuggestion >= 0 &&
      suggestions[activeSuggestion]
    ) {
      openSuggestion(suggestions[activeSuggestion])
      return
    }

    runSearch()
  }

  function openSuggestion(product) {
    setSearch(product.description || product.reference || '')
    setShowSuggestions(false)
    setActiveSuggestion(-1)
    closeMenus()

    if (product?.id) {
      navigate(`/product/${product.id}`)
      return
    }

    runSearch(product.description || product.reference || '')
  }

  function handleSearchKeyDown(event) {
    if (!showSuggestions) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveSuggestion(current =>
        Math.min(current + 1, suggestions.length - 1)
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveSuggestion(current =>
        Math.max(current - 1, -1)
      )
    }

    if (
      event.key === 'Enter' &&
      activeSuggestion >= 0 &&
      suggestions[activeSuggestion]
    ) {
      event.preventDefault()
      openSuggestion(suggestions[activeSuggestion])
    }
  }

  return (
    <div className={`header-main${isSticky ? ' header-main--sticky' : ''}`}>
      <div className="header-main__brand-row">
        <div className="header-main__brand-side">
          <img
            src="/logos/award.jpg"
            alt="King's Award for Enterprise"
            className="header-main__award"
          />

          <Link
            to="/account/create"
            className="header-main__customer-button"
          >
            Become a Customer
          </Link>
        </div>

        <Link to="/" className="header-main__logo-link">
          <img
            src="/logos/navsa-logo.png"
            alt="NAVSA International"
            className="header-main__logo"
          />
        </Link>

        <div className="header-main__brand-side header-main__brand-side--right">
          {user ? (
            <div className="header-main__profile-wrapper" ref={profileMenuRef}>
              <button
                type="button"
                className="header-main__account-button header-main__profile-button"
                onClick={() => setProfileDropdownOpen(current => !current)}
                aria-expanded={profileDropdownOpen}
              >
                <FaUser />
                <span>{user.name || user.company_name || 'My Profile'}</span>
                <FaChevronDown style={{ fontSize: '10px', marginLeft: '2px' }} />
              </button>

              {profileDropdownOpen && (
                <div className="header-main__profile-dropdown">
                  <div className="header-main__profile-header">
                    <strong>{user.name || 'Trade Customer'}</strong>
                    <small>{user.email}</small>
                  </div>

                  <div className="header-main__profile-menu">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="header-main__profile-menu-item"
                    >
                      <FaUser />
                      <span>My Profile</span>
                    </Link>

                    {(user.role === 'admin' || user.role === 'super-admin' || user.is_admin) && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="header-main__profile-menu-item"
                      >
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      className="header-main__profile-menu-item header-main__profile-menu-logout"
                      onClick={handleSignOut}
                      disabled={loggingOut}
                    >
                      <FaSignOutAlt />
                      <span>{loggingOut ? 'Signing Out…' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/account/login"
              className="header-main__account-button"
            >
              <FaUser />
              <span>Customer Login</span>
            </Link>
          )}

          <img
            src="/logos/award.jpg"
            alt="King's Award for Enterprise"
            className="header-main__award"
          />
        </div>
      </div>

      <button
        type="button"
        className="header-main__mobile-toggle"
        onClick={() => setMobileOpen(current => !current)}
        aria-expanded={mobileOpen}
      >
        <span>Menu & Product Search</span>
        <FaChevronDown />
      </button>

      <div
        className={`header-main__commerce-row ${
          mobileOpen ? 'is-open' : ''
        }`}
      >
        <nav
          className="header-main__navigation"
          aria-label="Primary navigation"
        >
          <Link to="/" onClick={closeMenus}>
            Home
          </Link>

          <div
            className="header-main__shop-menu"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              to="/shop"
              className={shopOpen ? 'is-active' : ''}
              onClick={closeMenus}
              aria-expanded={shopOpen}
            >
              Shop
              <FaChevronDown />
            </Link>

            {shopOpen && (
              <div className="header-main__mega-menu">
                <div className="header-main__mega-top">
                  <section className="header-main__mega-categories">
                    <h3>Product Categories</h3>

                    <div className="header-main__category-grid">
                      {CATEGORIES.map(category => (
                        <Link
                          key={category.db}
                          to={`/shop?category=${encodeURIComponent(
                            category.db
                          )}`}
                          onClick={closeMenus}
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </section>

                  <section className="header-main__mega-quickaccess">
                    <h3>Quick Access</h3>

                    <div className="header-main__mega-quick-list">
                      <Link to="/" onClick={closeMenus}>
                        <FaHome /> My Home
                      </Link>

                      <Link to="/wishlist" onClick={closeMenus}>
                        <FaHeart /> My Favorites
                      </Link>

                      <Link to="/shop" onClick={closeMenus}>
                        <FaHistory /> Previous Products
                      </Link>

                      <Link to="/shop" onClick={closeMenus}>
                        <FaThLarge /> All Products
                      </Link>
                    </div>
                  </section>
                </div>

                <div className="header-main__promo-grid">
                  <button
                    type="button"
                    className="header-main__promo-btn promo-edlp"
                    onClick={e => e.preventDefault()}
                  >
                    <FaTag /> EVERY DAY LOW PRICE
                  </button>

                  <button
                    type="button"
                    className="header-main__promo-btn promo-presell"
                    onClick={e => e.preventDefault()}
                  >
                    <FaBolt /> PRESELL
                  </button>

                  <button
                    type="button"
                    className="header-main__promo-btn promo-monthly"
                    onClick={e => e.preventDefault()}
                  >
                    <FaCalendarAlt /> MONTHLY PROMOTIONS
                  </button>

                  <button
                    type="button"
                    className="header-main__promo-btn promo-weekly"
                    onClick={e => e.preventDefault()}
                  >
                    <FaClock /> WEEKLY DEALS
                  </button>

                  <button
                    type="button"
                    className="header-main__promo-btn promo-seasonal"
                    onClick={e => e.preventDefault()}
                  >
                    <FaTag /> SEASONAL OFFERS
                  </button>

                  <button
                    type="button"
                    className="header-main__promo-btn promo-new"
                    onClick={e => e.preventDefault()}
                  >
                    <FaStar /> NEW
                  </button>

                  <button
                    type="button"
                    className="header-main__promo-btn promo-clearance"
                    onClick={e => e.preventDefault()}
                  >
                    <FaTrashAlt /> CLEARANCE
                  </button>

                  <button
                    type="button"
                    className="header-main__promo-btn promo-latest"
                    onClick={e => e.preventDefault()}
                  >
                    <FaFileAlt /> LATEST DEALS
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link to="/brand" onClick={closeMenus}>
            Brand
            <FaChevronDown />
          </Link>
        </nav>

        <div
          className="header-main__search-area"
          ref={searchAreaRef}
        >
          <form
            className="header-main__search"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              onFocus={() => {
                if (
                  isAuthenticated &&
                  (search.trim().length >= 3 || suggestionsLoading)
                ) {
                  setShowSuggestions(true)
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search Directory of 20,000+ British Products"
              aria-label="Search products"
              autoComplete="off"
            />

            <button type="submit" aria-label="Search products">
              <FaSearch />
            </button>
          </form>

          {showSuggestions && (
            <div
              className="header-main__suggestions"
              role="listbox"
            >
              {search.trim().length > 0 &&
                search.trim().length < 3 && (
                  <div className="header-main__search-warning">
                    Please enter a search term of at least 3 characters
                  </div>
                )}

              {search.trim().length >= 3 && suggestionsLoading && (
                <div className="header-main__suggestion-status">
                  Searching products…
                </div>
              )}

              {search.trim().length >= 3 &&
                !suggestionsLoading &&
                suggestions.length === 0 && (
                  <button
                    type="button"
                    className="header-main__no-results"
                    onClick={() => runSearch()}
                  >
                    No quick matches. Search all products for
                    “{search.trim()}” →
                  </button>
                )}

              {search.trim().length >= 3 &&
                !suggestionsLoading &&
                suggestions.map((product, index) => {
                  const image = getProductImage(product)
                  const brandName =
                    product.brand?.brand_name ||
                    product.brand_name ||
                    ''

                  return (
                    <button
                      key={
                        product.id ||
                        `${product.reference}-${index}`
                      }
                      type="button"
                      role="option"
                      aria-selected={activeSuggestion === index}
                      className={`header-main__suggestion ${
                        activeSuggestion === index
                          ? 'is-active'
                          : ''
                      }`}
                      onMouseEnter={() =>
                        setActiveSuggestion(index)
                      }
                      onClick={() => openSuggestion(product)}
                    >
                      <span className="header-main__suggestion-image">
                        {image ? (
                          <img src={image} alt="" loading="lazy" />
                        ) : (
                          <FaShoppingBasket />
                        )}
                      </span>

                      <span className="header-main__suggestion-copy">
                        <strong>
                          {product.description ||
                            product.reference ||
                            'Product'}
                        </strong>

                        <small>
                          {[
                            brandName,
                            product.reference
                              ? `SKU ${product.reference}`
                              : '',
                            product.barcode_ean
                              ? `EAN ${product.barcode_ean}`
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </small>
                      </span>

                      {!pricesHidden && (
                        <span className="header-main__suggestion-price">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </button>
                  )
                })}

              {search.trim().length >= 3 &&
                !suggestionsLoading &&
                suggestions.length > 0 && (
                  <button
                    type="button"
                    className="header-main__view-all-results"
                    onClick={() => runSearch()}
                  >
                    View all results for “{search.trim()}” →
                  </button>
                )}
            </div>
          )}
        </div>

        <div className="header-main__controls">
          <label className="header-main__select notranslate" translate="no">
            <span className="sr-only">Select language</span>

            <select
              className="notranslate"
              translate="no"
              value={language}
              onChange={event =>
                handleLanguageChange(event.target.value)
              }
              aria-label="Select language"
            >
              {LANGUAGES.map(option => (
                <option
                  key={option.value || 'select-language'}
                  value={option.value}
                  className="notranslate"
                  translate="no"
                >
                  {option.label}
                </option>
              ))}
            </select>

            <FaChevronDown />
          </label>

          <label className="header-main__select header-main__currency notranslate" translate="no">
            <span className="sr-only">Select currency</span>

            <select
              className="notranslate"
              translate="no"
              value={currency}
              onChange={event =>
                setCurrency(event.target.value)
              }
              aria-label="Select currency"
            >
              {CURRENCIES.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  className="notranslate"
                  translate="no"
                >
                  {option.label}
                </option>
              ))}
            </select>

            <FaChevronDown />
          </label>

          <button
            type="button"
            className={`header-main__price-toggle ${
              pricesHidden ? 'is-active' : ''
            }`}
            onClick={() =>
              setPricesHidden(current => !current)
            }
            aria-label={
              pricesHidden ? 'Show prices' : 'Hide prices'
            }
            title={
              pricesHidden ? 'Show prices' : 'Hide prices'
            }
          >
            {pricesHidden ? (
              <MdVisibility />
            ) : (
              <MdVisibilityOff />
            )}
          </button>

          <Link
            to="/basket"
            className="header-main__basket"
            onClick={closeMenus}
          >
            <span className="header-main__icon">
              <FaShoppingBasket />

              {basketCount > 0 && <span>{basketCount}</span>}
            </span>

            <span className="header-main__basket-copy">
              <strong>{basketCount} items</strong>

              {!pricesHidden && (
                <small>
                  {formatPrice(basketTotal)}
                </small>
              )}
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="header-main__wishlist"
            onClick={closeMenus}
          >
            <span className="header-main__icon">
              <FaHeart />

              {wishlistCount > 0 && <span>{wishlistCount}</span>}
            </span>

            <span>My Wishlist</span>
          </Link>
        </div>
      </div>
    </div>
  )
}