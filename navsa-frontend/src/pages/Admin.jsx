import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
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
  Building2,
  ShieldCheck,
} from 'lucide-react';
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
import { useAuth } from '../context/AuthContext';

function AdminShell() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, roles, logout, hasPermission } = useAuth();

  const initials = (user?.name || 'A').charAt(0).toUpperCase();
  const primaryRole = roles[0] || user?.role || 'Administrator';

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

  return (
    <div className="admin-layout admin-bg">
      <aside
        className="admin-sidebar glass-panel"
        style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
          <h2 style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={24} /> Navsa Admin
          </h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-item ${isActive || location.pathname === '/admin' ? 'active' : ''}`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          {hasPermission('products.view') && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Package size={20} /> Products
            </NavLink>
          )}

          {hasPermission('offers.view') && (
            <NavLink
              to="/admin/offers"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Tag size={20} /> Offers & Promotions
            </NavLink>
          )}

          {hasPermission('registrations.view') && (
            <NavLink
              to="/admin/registrations"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <UserCheck size={20} /> Registrations
            </NavLink>
          )}

          {hasPermission('customers.view') && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Users size={20} /> Customers
            </NavLink>
          )}

          {hasPermission('suppliers.view') && (
            <NavLink
              to="/admin/suppliers"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Building2 size={20} /> Suppliers
            </NavLink>
          )}

          {hasPermission('brands.manage') && (
            <NavLink
              to="/admin/brands"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Settings size={20} /> Brands
            </NavLink>
          )}

          {hasPermission('categories.manage') && (
            <NavLink
              to="/admin/categories"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Settings size={20} /> Categories
            </NavLink>
          )}

          {(hasPermission('banners.manage') || hasPermission('pdfs.manage')) && (
            <NavLink
              to="/admin/pdfs"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Package size={20} /> PDFs & Banners
            </NavLink>
          )}

          {hasPermission('roles.view') && (
            <NavLink
              to="/admin/roles"
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <ShieldCheck size={20} /> Access Control
            </NavLink>
          )}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={logout}
            className="admin-btn admin-btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444' }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        {/* Topbar */}
        <header className="glass-header admin-flex-between" style={{ padding: '1rem 2rem', position: 'relative', zIndex: 100 }}>
          <div />
          <div className="admin-flex-center" style={{ gap: '1rem', position: 'relative' }}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '24px',
                padding: '6px 12px 6px 6px',
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                {initials}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name || 'Admin'}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize' }}>
                  {primaryRole}
                </div>
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: '#94a3b8',
                  marginLeft: '2px',
                  transform: profileOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {profileOpen && (
              <div
                ref={profileRef}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '12px',
                  minWidth: '240px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                  zIndex: 9999,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>
                      {user?.name || 'Admin User'}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                      {user?.email || 'admin@navsa.com'}
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span
                        style={{
                          background: 'rgba(59,130,246,0.2)',
                          color: '#3b82f6',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {primaryRole}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response. Please check server logs.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2
          style={{
            color: '#3b82f6',
            textAlign: 'center',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Lock size={22} /> Admin Login
        </h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
          Sign in to access the admin panel
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="admin-input-field"
            style={{ width: '100%', padding: '10px 14px', marginBottom: '16px' }}
          />

          <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="admin-input-field"
            style={{ width: '100%', padding: '10px 14px', marginBottom: '24px' }}
          />

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px dashed rgba(255,255,255,0.15)',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '2px' }}>
            Quick Login Credentials:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setEmail('info@navsainternational.com');
                setPassword('Info@123');
              }}
              style={{ padding: '4px 6px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
            >
              Director
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('accounts@navsainternational.com');
                setPassword('Accounts@123');
              }}
              style={{ padding: '4px 6px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
            >
              Accounts
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('webmaster@navsainternational.com');
                setPassword('Web@123');
              }}
              style={{ padding: '4px 6px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
            >
              Webmaster
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('product@navsainternational.com');
                setPassword('Product@123');
              }}
              style={{ padding: '4px 6px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
            >
              Product Manager
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@navsainternational.com');
                setPassword('Admin@123');
              }}
              style={{ padding: '4px 6px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
            >
              Admin (Restricted)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('sales@navsainternational.com');
                setPassword('Sales@123');
              }}
              style={{ padding: '4px 6px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3b82f6', color: '#60a5fa', borderRadius: '4px', cursor: 'pointer', textAlign: 'left' }}
            >
              Sales
            </button>
          </div>
        </div>
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