import { useState, useRef, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  Settings,
  LogOut,
  Lock,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Building2,
  Menu,
  X,
  ShieldCheck,
  FolderTree,
  BadgePercent,
  FileStack,
  Eye,
  EyeOff,
  Database,
  CircleCheck,
  ShoppingBag,
  FileBarChart,
} from 'lucide-react';

import '../admin.css';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminSuppliers from './admin/AdminSuppliers';
import AdminProducts from './admin/AdminProducts';
import AdminOffers from './admin/AdminOffers';
import AdminBrands from './admin/AdminBrands';
import AdminCategories from './admin/AdminCategories';
import AdminRegistrations from './admin/AdminRegistrations';
import AdminPdfs from './admin/AdminPdfs';
import AdminRoles from './admin/AdminRoles';
import AdminOrders from './admin/AdminOrders';
import AdminReports from './admin/AdminReports';
import { useAuth } from '../context/AuthContext';

const navigationSections = [
  {
    label: 'Overview',
    items: [
      {
        to: '/admin/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        permission: null,
      },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      {
        to: '/admin/products',
        label: 'Products',
        icon: Package,
        permission: 'products.view',
      },
      {
        to: '/admin/offers',
        label: 'Offers & Promotions',
        icon: BadgePercent,
        permission: 'offers.view',
      },
      {
        to: '/admin/brands',
        label: 'Brands',
        icon: Tag,
        permission: 'brands.manage',
      },
      {
        to: '/admin/categories',
        label: 'Categories',
        icon: FolderTree,
        permission: 'categories.manage',
      },
      {
        to: '/admin/orders',
        label: 'Orders',
        icon: ShoppingBag,
        permission: null,
      },
    ],
  },
  {
    label: 'Trade Accounts',
    items: [
      {
        to: '/admin/registrations',
        label: 'Registrations',
        icon: UserCheck,
        permission: 'registrations.view',
      },
      {
        to: '/admin/users',
        label: 'Customers',
        icon: Users,
        permission: 'customers.view',
      },
      {
        to: '/admin/suppliers',
        label: 'Suppliers',
        icon: Building2,
        permission: 'suppliers.view',
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        to: '/admin/pdfs',
        label: 'PDFs & Banners',
        icon: FileStack,
        permission: (hasPermission) => hasPermission('banners.manage') || hasPermission('pdfs.manage'),
      },
      {
        to: '/admin/reports',
        label: 'Order Reports',
        icon: FileBarChart,
        permission: null,
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        to: '/admin/roles',
        label: 'Access Control',
        icon: ShieldCheck,
        permission: 'roles.view',
      },
    ],
  },
];

const pageDetails = {
  '/admin': {
    eyebrow: 'Overview',
    title: 'Dashboard',
    description: 'Monitor catalogue activity and trade account operations.',
  },
  '/admin/dashboard': {
    eyebrow: 'Overview',
    title: 'Dashboard',
    description: 'Monitor catalogue activity and trade account operations.',
  },
  '/admin/products': {
    eyebrow: 'Catalogue',
    title: 'Products',
    description: 'Manage product information, availability and web visibility.',
  },
  '/admin/offers': {
    eyebrow: 'Catalogue',
    title: 'Offers & Promotions',
    description: 'Create and maintain promotional catalogue activity.',
  },
  '/admin/registrations': {
    eyebrow: 'Trade Accounts',
    title: 'Registrations',
    description: 'Review pending customer and supplier applications.',
  },
  '/admin/users': {
    eyebrow: 'Trade Accounts',
    title: 'Customers',
    description: 'Manage approved customer accounts and account status.',
  },
  '/admin/suppliers': {
    eyebrow: 'Trade Accounts',
    title: 'Suppliers',
    description: 'Manage approved supplier applications and records.',
  },
  '/admin/brands': {
    eyebrow: 'Catalogue',
    title: 'Brands',
    description: 'Organise and maintain the NAVSA brand directory.',
  },
  '/admin/categories': {
    eyebrow: 'Catalogue',
    title: 'Categories',
    description: 'Organise the product catalogue into clear categories.',
  },
  '/admin/orders': {
    eyebrow: 'Catalogue',
    title: 'Orders',
    description: 'View trade customer orders, order items, delivery details and order status.',
  },
  '/admin/pdfs': {
    eyebrow: 'Content',
    title: 'PDFs & Banners',
    description: 'Manage promotional PDFs, documents and homepage banners.',
  },
  '/admin/reports': {
    eyebrow: 'Content',
    title: 'Order & Stock Reports',
    description: 'List of completed trade orders, product stock prices, case quantities, and sales summaries.',
  },
  '/admin/roles': {
    eyebrow: 'Administration',
    title: 'Access Control',
    description: 'Manage administrator roles, permissions, and security settings.',
  },
};

function AdminShell() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileRef = useRef(null);

  const { user, roles, logout, hasPermission } = useAuth();

  const initials = (user?.name || 'A').charAt(0).toUpperCase();
  const primaryRole = roles[0] || user?.role || 'Administrator';
  const currentPage = pageDetails[location.pathname] || pageDetails['/admin'];

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (!profileOpen) return;

    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  // Filter sections by permissions
  const filteredSections = navigationSections.map((section) => {
    const items = section.items.filter((item) => {
      if (!item.permission) return true;
      if (typeof item.permission === 'function') {
        return item.permission(hasPermission);
      }
      return hasPermission(item.permission);
    });
    return { ...section, items };
  }).filter((section) => section.items.length > 0);

  return (
    <div className="admin-layout admin-bg">
      <button
        type="button"
        className={`admin-sidebar-overlay ${sidebarOpen ? 'is-visible' : ''}`}
        aria-label="Close navigation"
        onClick={closeSidebar}
      />

      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-mark">
            <ShieldCheck size={25} strokeWidth={2.2} />
          </div>

          <div className="admin-sidebar__brand-copy">
            <strong>NAVSA</strong>
            <span>Administration</span>
          </div>

          <button
            type="button"
            className="admin-sidebar__mobile-close"
            aria-label="Close navigation"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar__workspace">
          <span className="admin-sidebar__workspace-label">Workspace</span>
          <div className="admin-sidebar__workspace-row">
            <div className="admin-sidebar__workspace-icon">
              <Database size={17} />
            </div>
            <div>
              <strong>Trade Portal</strong>
              <span>Production management</span>
            </div>
          </div>
        </div>

        <nav className="admin-sidebar__navigation" aria-label="Admin navigation">
          {filteredSections.map((section) => (
            <div className="admin-nav-section" key={section.label}>
              <span className="admin-nav-section__label">{section.label}</span>

              <div className="admin-nav-section__items">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `admin-nav-item ${
                          isActive ||
                          (item.to === '/admin/dashboard' &&
                            location.pathname === '/admin')
                            ? 'active'
                            : ''
                        }`
                      }
                    >
                      <span className="admin-nav-item__icon">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <span className="admin-nav-item__label">{item.label}</span>
                      <ChevronRight
                        className="admin-nav-item__arrow"
                        size={15}
                        strokeWidth={2}
                      />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-system-status">
            <span className="admin-system-status__indicator" />
            <div>
              <strong>System online</strong>
              <span>Admin services available</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="admin-sidebar__logout"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <header className="glass-header admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-mobile-menu"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div className="admin-page-identity">
              <span>{currentPage.eyebrow}</span>
              <div>
                <h1>{currentPage.title}</h1>
                <p>{currentPage.description}</p>
              </div>
            </div>
          </div>

          <div className="admin-topbar__right">
            <div className="admin-secure-session">
              <CircleCheck size={16} />
              <span>Secure session</span>
            </div>

            <div className="admin-profile" ref={profileRef}>
              <button
                type="button"
                className={`admin-profile__trigger ${
                  profileOpen ? 'is-open' : ''
                }`}
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
              >
                <span className="admin-profile__avatar">{initials}</span>

                <span className="admin-profile__summary">
                  <strong>{user?.name || 'Admin User'}</strong>
                  <small>{primaryRole}</small>
                </span>

                <ChevronDown
                  className="admin-profile__chevron"
                  size={15}
                  strokeWidth={2.2}
                />
              </button>

              {profileOpen && (
                <div className="admin-profile__menu">
                  <div className="admin-profile__menu-header">
                    <span className="admin-profile__menu-avatar">
                      {initials}
                    </span>

                    <div>
                      <strong>{user?.name || 'Admin User'}</strong>
                      <span>{user?.email || 'admin@navsainternational.com'}</span>
                      <small style={{ textTransform: 'capitalize' }}>{primaryRole}</small>
                    </div>
                  </div>

                  <div className="admin-profile__menu-divider" />

                  <button
                    type="button"
                    className="admin-profile__signout"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} />
                    Sign out securely
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-page-content">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route
              path="products"
              element={hasPermission('products.view') ? <AdminProducts /> : <Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="offers"
              element={hasPermission('offers.view') ? <AdminOffers /> : <Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="registrations"
              element={hasPermission('registrations.view') ? <AdminRegistrations /> : <Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="users"
              element={hasPermission('customers.view') ? <AdminUsers /> : <Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="suppliers"
              element={hasPermission('suppliers.view') ? <AdminSuppliers /> : <Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="brands"
              element={hasPermission('brands.manage') ? <AdminBrands /> : <Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="categories"
              element={hasPermission('categories.manage') ? <AdminCategories /> : <Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="orders"
              element={<AdminOrders />}
            />
            <Route
              path="pdfs"
              element={
                hasPermission('banners.manage') || hasPermission('pdfs.manage') ? (
                  <AdminPdfs />
                ) : (
                  <Navigate to="/admin/dashboard" replace />
                )
              }
            />
            <Route
              path="reports"
              element={<AdminReports />}
            />
            <Route
              path="roles"
              element={hasPermission('roles.view') ? <AdminRoles /> : <Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(
          'Server returned an invalid response. Please check the server logs.'
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page admin-bg">
      <div className="admin-login-layout">
        <section className="admin-login-introduction">
          <div className="admin-login-introduction__top">
            <img
              className="admin-login-logo"
              src="/logos/navsa-logo.png"
              alt="NAVSA International"
            />

            <span className="admin-login-introduction__badge">
              <ShieldCheck size={15} strokeWidth={2.2} />
              Secure admin access
            </span>
          </div>

          <div className="admin-login-introduction__copy">
            <h1>Trade Administration Portal</h1>
            <p>
              Securely manage NAVSA products, business accounts, promotional
              documents and website content.
            </p>
          </div>

          <div className="admin-login-introduction__footer">
            NAVSA International Limited
          </div>
        </section>

        <section className="admin-login-card">
          <div className="admin-login-card__icon">
            <Lock size={22} />
          </div>

          <div className="admin-login-card__heading">
            <span>Administrator access</span>
            <h2>Welcome back</h2>
            <p>Enter your authorised credentials to continue.</p>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="admin-login-field">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="username"
                className="admin-input-field"
                placeholder="admin@company.com"
              />
            </label>

            <label className="admin-login-field">
              <span>Password</span>

              <span className="admin-password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="admin-input-field"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  onClick={() =>
                    setShowPassword((isVisible) => !isVisible)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary admin-login-submit"
            >
              {loading ? 'Signing in…' : 'Sign in securely'}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#94a3b8',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ fontWeight: 600, color: '#e2e8f0' }}>
              Quick Login Credentials:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('info@navsainternational.com');
                  setPassword('Info@123');
                }}
                style={{ padding: '5px 8px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
              >
                Director
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('accounts@navsainternational.com');
                  setPassword('Accounts@123');
                }}
                style={{ padding: '5px 8px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
              >
                Accounts
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('webmaster@navsainternational.com');
                  setPassword('Web@123');
                }}
                style={{ padding: '5px 8px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
              >
                Webmaster
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('product@navsainternational.com');
                  setPassword('Product@123');
                }}
                style={{ padding: '5px 8px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
              >
                Product Manager
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@navsainternational.com');
                  setPassword('Admin@123');
                }}
                style={{ padding: '5px 8px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
              >
                Admin (Restricted)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sales@navsainternational.com');
                  setPassword('Sales@123');
                }}
                style={{ padding: '5px 8px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
              >
                Sales
              </button>
            </div>
          </div>

          <div className="admin-login-security" style={{ marginTop: '16px' }}>
            <ShieldCheck size={17} />
            <span>
              Access is restricted to authorised NAVSA administrators.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminShell />;
}