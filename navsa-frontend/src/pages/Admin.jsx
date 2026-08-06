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
// // import { useState } from 'react';
// // import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
// // import { LayoutDashboard, Package, Tag, Users, Settings, LogOut, Lock, UserCheck, ChevronDown, Building2 } from 'lucide-react';
// // import AdminDashboard  from './admin/AdminDashboard';
// // import AdminUsers      from './admin/AdminUsers';
// // import AdminSuppliers  from './admin/AdminSuppliers';
// // import AdminProducts   from './admin/AdminProducts';
// // import AdminOffers     from './admin/AdminOffers';
// // import AdminBrands     from './admin/AdminBrands';
// // import AdminCategories from './admin/AdminCategories';
// // import AdminRegistrations from './admin/AdminRegistrations';
// // import AdminPdfs from './admin/AdminPdfs';

// // function AdminShell({ onLogout }) {
// //   const location = useLocation();
// //   const [profileOpen, setProfileOpen] = useState(false);
// //   const adminUser = (() => { try { return JSON.parse(localStorage.getItem('admin_user') || '{}'); } catch { return {}; } })();
// //   const initials = (adminUser.name || 'A').charAt(0).toUpperCase();

// //   return (
// //     <div className="admin-layout admin-bg">

// //       <aside className="admin-sidebar glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
// //         <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1rem' }}>
// //           <h2 style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
// //             <Package size={24} /> Navsa Admin
// //           </h2>
// //         </div>

// //         <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
// //           <NavLink to="/admin/dashboard" className={({isActive}) => `admin-nav-item ${isActive || location.pathname === '/admin' ? 'active' : ''}`}>
// //             <LayoutDashboard size={20} /> Dashboard
// //           </NavLink>
// //           <NavLink to="/admin/products" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <Package size={20} /> Products
// //           </NavLink>
// //           <NavLink to="/admin/offers" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <Tag size={20} /> Offers & Promotions
// //           </NavLink>
// //           <NavLink to="/admin/registrations" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <UserCheck size={20} /> Registrations
// //           </NavLink>
// //           <NavLink to="/admin/users" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <Users size={20} /> Customers
// //           </NavLink>
// //           <NavLink to="/admin/suppliers" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <Building2 size={20} /> Suppliers
// //           </NavLink>
// //           <NavLink to="/admin/brands" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <Settings size={20} /> Brands
// //           </NavLink>
// //           <NavLink to="/admin/categories" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <Settings size={20} /> Categories
// //           </NavLink>
// //           <NavLink to="/admin/pdfs" className={({isActive}) => `admin-nav-item ${isActive ? 'active' : ''}`}>
// //             <Package size={20} /> PDFs & Banners
// //           </NavLink>
// //         </nav>

// //         <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
// //           <button onClick={onLogout} className="admin-btn admin-btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444' }}>
// //             <LogOut size={20} /> Logout
// //           </button>
// //         </div>
// //       </aside>

// //       <main className="admin-main-content">

// //         <header className="glass-header admin-flex-between" style={{ padding: '1rem 2rem', position: 'relative' }}>
// //           <div />
// //           <div className="admin-flex-center" style={{ gap: '1rem', position: 'relative' }}>

// //             <button
// //               onClick={() => setProfileOpen(o => !o)}
// //               style={{
// //                 display: 'flex', alignItems: 'center', gap: '8px',
// //                 background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
// //                 borderRadius: '24px', padding: '6px 12px 6px 6px', cursor: 'pointer', color: '#fff'
// //               }}
// //             >
// //               <div style={{
// //                 width: '32px', height: '32px', borderRadius: '50%',
// //                 background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
// //                 color: '#fff', display: 'flex', alignItems: 'center',
// //                 justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
// //               }}>
// //                 {initials}
// //               </div>
// //               <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
// //                 <div style={{ fontSize: '13px', fontWeight: 600 }}>{adminUser.name || 'Admin'}</div>
// //                 <div style={{ fontSize: '10px', color: '#94a3b8' }}>Administrator</div>
// //               </div>
// //               <ChevronDown size={14} style={{ color: '#94a3b8', marginLeft: '2px', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
// //             </button>

// //             {profileOpen && (
// //               <div style={{
// //                 position: 'absolute', top: 'calc(100% + 8px)', right: 0,
// //                 background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
// //                 borderRadius: '12px', padding: '12px', minWidth: '240px',
// //                 boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 1000
// //               }}>

// //                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
// //                   <div style={{
// //                     width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
// //                     background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
// //                     display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                     fontSize: '20px', fontWeight: 'bold', color: '#fff'
// //                   }}>
// //                     {initials}
// //                   </div>
// //                   <div>
// //                     <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{adminUser.name || 'Admin User'}</div>
// //                     <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{adminUser.email || 'admin@navsainternational.com'}</div>
// //                     <div style={{ marginTop: '6px' }}>
// //                       <span style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', letterSpacing: '0.5px' }}>ADMINISTRATOR</span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <button
// //                   onClick={() => { setProfileOpen(false); onLogout(); }}
// //                   style={{
// //                     width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
// //                     background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
// //                     color: '#ef4444', borderRadius: '8px', padding: '8px 12px',
// //                     cursor: 'pointer', fontSize: '13px', fontWeight: 600
// //                   }}
// //                 >
// //                   <LogOut size={15} /> Sign Out
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </header>

// //         <div className="admin-page-content">
// //           <Routes>
// //             <Route path="/" element={<Navigate to="dashboard" replace />} />
// //             <Route path="dashboard" element={<AdminDashboard />} />
// //             <Route path="products" element={<AdminProducts />} />
// //             <Route path="offers" element={<AdminOffers />} />
// //             <Route path="registrations" element={<AdminRegistrations />} />
// //             <Route path="users" element={<AdminUsers />} />
// //             <Route path="suppliers" element={<AdminSuppliers />} />
// //             <Route path="brands" element={<AdminBrands />} />
// //             <Route path="categories" element={<AdminCategories />} />
// //             <Route path="pdfs" element={<AdminPdfs />} />
// //           </Routes>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // function AdminLogin({ onLogin }) {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     setLoading(true);
// //     try {
// //       const res = await fetch('/api/login', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json'
// //         },
// //         body: JSON.stringify({ email, password }),
// //       });

// //       const contentType = res.headers.get('content-type');
// //       if (!contentType || !contentType.includes('application/json')) {
// //         throw new Error('Server returned invalid response. Please check server logs.');
// //       }

// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.message || 'Login failed');
// //       localStorage.setItem('admin_token', data.token);
// //       localStorage.setItem('admin_user', JSON.stringify(data.user));
// //       onLogin();
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="admin-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //       <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
// //         <h2 style={{ color: '#3b82f6', textAlign: 'center', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// //           <Lock size={22} /> Admin Login
// //         </h2>
// //         <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>Sign in to access the admin panel</p>

// //         {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

// //         <form onSubmit={handleSubmit}>
// //           <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email</label>
// //           <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="admin-input-field" style={{ width: '100%', padding: '10px 14px', marginBottom: '16px' }} />

// //           <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password</label>
// //           <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="admin-input-field" style={{ width: '100%', padding: '10px 14px', marginBottom: '24px' }} />

// //           <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px' }}>
// //             {loading ? 'Signing in...' : 'Sign In'}
// //           </button>
// //         </form>

// //         <div style={{
// //           marginTop: '20px',
// //           padding: '12px',
// //           background: 'rgba(255,255,255,0.05)',
// //           border: '1px dashed rgba(255,255,255,0.15)',
// //           borderRadius: '6px',
// //           fontSize: '12px',
// //           color: '#94a3b8',
// //           display: 'flex',
// //           flexDirection: 'column',
// //           gap: '6px'
// //         }}>
// //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //             <strong>Demo Credentials:</strong>
// //             <button
// //               type="button"
// //               onClick={() => {
// //                 setEmail('admin@navsainternational.com');
// //                 setPassword('password');
// //               }}
// //               className="admin-btn"
// //               style={{ padding: '3px 8px', fontSize: '11px', background: '#3b82f6', color: '#fff', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
// //             >
// //               Auto Fill
// //             </button>
// //           </div>
// //           <div><strong>Email:</strong> admin@navsainternational.com</div>
// //           <div><strong>Password:</strong> password</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function Admin() {
// //   const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('admin_token'));

// //   const logout = () => {
// //     localStorage.removeItem('admin_token');
// //     localStorage.removeItem('admin_user');
// //     setIsLoggedIn(false);
// //   };

// //   if (!isLoggedIn) {
// //     return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
// //   }

// //   return <AdminShell onLogout={logout} />;
// // }

// import { useState } from 'react';
// import {
//   Routes,
//   Route,
//   Navigate,
//   NavLink,
//   useLocation,
// } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Package,
//   Tag,
//   Users,
//   Settings,
//   LogOut,
//   Lock,
//   UserCheck,
//   ChevronDown,
//   ChevronRight,
//   Building2,
//   Menu,
//   X,
//   ShieldCheck,
//   FolderTree,
//   BadgePercent,
//   FileStack,
//   Eye,
//   EyeOff,
//   Database,
//   CircleCheck,
// } from 'lucide-react';

// import '../admin.css';
// import AdminDashboard from './admin/AdminDashboard';
// import AdminUsers from './admin/AdminUsers';
// import AdminSuppliers from './admin/AdminSuppliers';
// import AdminProducts from './admin/AdminProducts';
// import AdminOffers from './admin/AdminOffers';
// import AdminBrands from './admin/AdminBrands';
// import AdminCategories from './admin/AdminCategories';
// import AdminRegistrations from './admin/AdminRegistrations';
// import AdminPdfs from './admin/AdminPdfs';

// const navigationSections = [
//   {
//     label: 'Overview',
//     items: [
//       {
//         to: '/admin/dashboard',
//         label: 'Dashboard',
//         icon: LayoutDashboard,
//       },
//     ],
//   },
//   {
//     label: 'Catalogue',
//     items: [
//       {
//         to: '/admin/products',
//         label: 'Products',
//         icon: Package,
//       },
//       {
//         to: '/admin/offers',
//         label: 'Offers & Promotions',
//         icon: BadgePercent,
//       },
//       {
//         to: '/admin/brands',
//         label: 'Brands',
//         icon: Tag,
//       },
//       {
//         to: '/admin/categories',
//         label: 'Categories',
//         icon: FolderTree,
//       },
//     ],
//   },
//   {
//     label: 'Trade Accounts',
//     items: [
//       {
//         to: '/admin/registrations',
//         label: 'Registrations',
//         icon: UserCheck,
//       },
//       {
//         to: '/admin/users',
//         label: 'Customers',
//         icon: Users,
//       },
//       {
//         to: '/admin/suppliers',
//         label: 'Suppliers',
//         icon: Building2,
//       },
//     ],
//   },
//   {
//     label: 'Content',
//     items: [
//       {
//         to: '/admin/pdfs',
//         label: 'PDFs & Banners',
//         icon: FileStack,
//       },
//     ],
//   },
// ];

// const pageDetails = {
//   '/admin': {
//     eyebrow: 'Overview',
//     title: 'Dashboard',
//     description: 'Monitor catalogue activity and trade account operations.',
//   },
//   '/admin/dashboard': {
//     eyebrow: 'Overview',
//     title: 'Dashboard',
//     description: 'Monitor catalogue activity and trade account operations.',
//   },
//   '/admin/products': {
//     eyebrow: 'Catalogue',
//     title: 'Products',
//     description: 'Manage product information, availability and web visibility.',
//   },
//   '/admin/offers': {
//     eyebrow: 'Catalogue',
//     title: 'Offers & Promotions',
//     description: 'Create and maintain promotional catalogue activity.',
//   },
//   '/admin/registrations': {
//     eyebrow: 'Trade Accounts',
//     title: 'Registrations',
//     description: 'Review pending customer and supplier applications.',
//   },
//   '/admin/users': {
//     eyebrow: 'Trade Accounts',
//     title: 'Customers',
//     description: 'Manage approved customer accounts and account status.',
//   },
//   '/admin/suppliers': {
//     eyebrow: 'Trade Accounts',
//     title: 'Suppliers',
//     description: 'Manage approved supplier applications and records.',
//   },
//   '/admin/brands': {
//     eyebrow: 'Catalogue',
//     title: 'Brands',
//     description: 'Organise and maintain the NAVSA brand directory.',
//   },
//   '/admin/categories': {
//     eyebrow: 'Catalogue',
//     title: 'Categories',
//     description: 'Organise the product catalogue into clear categories.',
//   },
//   '/admin/pdfs': {
//     eyebrow: 'Content',
//     title: 'PDFs & Banners',
//     description: 'Manage promotional PDFs, documents and homepage banners.',
//   },
// };

// function getAdminUser() {
//   try {
//     return JSON.parse(localStorage.getItem('admin_user') || '{}');
//   } catch {
//     return {};
//   }
// }

// function AdminShell({ onLogout }) {
//   const location = useLocation();
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const adminUser = getAdminUser();
//   const initials = (adminUser.name || 'A').charAt(0).toUpperCase();
//   const currentPage = pageDetails[location.pathname] || pageDetails['/admin'];

//   const closeSidebar = () => setSidebarOpen(false);

//   return (
//     <div className="admin-layout admin-bg">
//       <button
//         type="button"
//         className={`admin-sidebar-overlay ${sidebarOpen ? 'is-visible' : ''}`}
//         aria-label="Close navigation"
//         onClick={closeSidebar}
//       />

//       <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
//         <div className="admin-sidebar__brand">
//           <div className="admin-sidebar__brand-mark">
//             <ShieldCheck size={25} strokeWidth={2.2} />
//           </div>

//           <div className="admin-sidebar__brand-copy">
//             <strong>NAVSA</strong>
//             <span>Administration</span>
//           </div>

//           <button
//             type="button"
//             className="admin-sidebar__mobile-close"
//             aria-label="Close navigation"
//             onClick={closeSidebar}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="admin-sidebar__workspace">
//           <span className="admin-sidebar__workspace-label">Workspace</span>
//           <div className="admin-sidebar__workspace-row">
//             <div className="admin-sidebar__workspace-icon">
//               <Database size={17} />
//             </div>
//             <div>
//               <strong>Trade Portal</strong>
//               <span>Production management</span>
//             </div>
//           </div>
//         </div>

//         <nav className="admin-sidebar__navigation" aria-label="Admin navigation">
//           {navigationSections.map((section) => (
//             <div className="admin-nav-section" key={section.label}>
//               <span className="admin-nav-section__label">{section.label}</span>

//               <div className="admin-nav-section__items">
//                 {section.items.map((item) => {
//                   const Icon = item.icon;

//                   return (
//                     <NavLink
//                       key={item.to}
//                       to={item.to}
//                       onClick={closeSidebar}
//                       className={({ isActive }) =>
//                         `admin-nav-item ${
//                           isActive ||
//                           (item.to === '/admin/dashboard' &&
//                             location.pathname === '/admin')
//                             ? 'active'
//                             : ''
//                         }`
//                       }
//                     >
//                       <span className="admin-nav-item__icon">
//                         <Icon size={18} strokeWidth={2} />
//                       </span>
//                       <span className="admin-nav-item__label">{item.label}</span>
//                       <ChevronRight
//                         className="admin-nav-item__arrow"
//                         size={15}
//                         strokeWidth={2}
//                       />
//                     </NavLink>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </nav>

//         <div className="admin-sidebar__footer">
//           <div className="admin-system-status">
//             <span className="admin-system-status__indicator" />
//             <div>
//               <strong>System online</strong>
//               <span>Admin services available</span>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onLogout}
//             className="admin-sidebar__logout"
//           >
//             <LogOut size={18} />
//             <span>Sign out</span>
//           </button>
//         </div>
//       </aside>

//       <main className="admin-main-content">
//         <header className="glass-header admin-topbar">
//           <div className="admin-topbar__left">
//             <button
//               type="button"
//               className="admin-mobile-menu"
//               aria-label="Open navigation"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu size={21} />
//             </button>

//             <div className="admin-page-identity">
//               <span>{currentPage.eyebrow}</span>
//               <div>
//                 <h1>{currentPage.title}</h1>
//                 <p>{currentPage.description}</p>
//               </div>
//             </div>
//           </div>

//           <div className="admin-topbar__right">
//             <div className="admin-secure-session">
//               <CircleCheck size={16} />
//               <span>Secure session</span>
//             </div>

//             <div className="admin-profile">
//               <button
//                 type="button"
//                 className={`admin-profile__trigger ${
//                   profileOpen ? 'is-open' : ''
//                 }`}
//                 aria-expanded={profileOpen}
//                 onClick={() => setProfileOpen((open) => !open)}
//               >
//                 <span className="admin-profile__avatar">{initials}</span>

//                 <span className="admin-profile__summary">
//                   <strong>{adminUser.name || 'Admin User'}</strong>
//                   <small>Administrator</small>
//                 </span>

//                 <ChevronDown
//                   className="admin-profile__chevron"
//                   size={15}
//                   strokeWidth={2.2}
//                 />
//               </button>

//               {profileOpen && (
//                 <div className="admin-profile__menu">
//                   <div className="admin-profile__menu-header">
//                     <span className="admin-profile__menu-avatar">
//                       {initials}
//                     </span>

//                     <div>
//                       <strong>{adminUser.name || 'Admin User'}</strong>
//                       <span>
//                         {adminUser.email ||
//                           'admin@navsainternational.com'}
//                       </span>
//                       <small>Administrator account</small>
//                     </div>
//                   </div>

//                   <div className="admin-profile__menu-divider" />

//                   <button
//                     type="button"
//                     className="admin-profile__signout"
//                     onClick={() => {
//                       setProfileOpen(false);
//                       onLogout();
//                     }}
//                   >
//                     <LogOut size={16} />
//                     Sign out securely
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         <div className="admin-page-content">
//           <Routes>
//             <Route path="/" element={<Navigate to="dashboard" replace />} />
//             <Route path="dashboard" element={<AdminDashboard />} />
//             <Route path="products" element={<AdminProducts />} />
//             <Route path="offers" element={<AdminOffers />} />
//             <Route
//               path="registrations"
//               element={<AdminRegistrations />}
//             />
//             <Route path="users" element={<AdminUsers />} />
//             <Route path="suppliers" element={<AdminSuppliers />} />
//             <Route path="brands" element={<AdminBrands />} />
//             <Route path="categories" element={<AdminCategories />} />
//             <Route path="pdfs" element={<AdminPdfs />} />
//           </Routes>
//         </div>
//       </main>
//     </div>
//   );
// }

// function AdminLogin({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const contentType = response.headers.get('content-type');

//       if (!contentType || !contentType.includes('application/json')) {
//         throw new Error(
//           'Server returned an invalid response. Please check the server logs.'
//         );
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       localStorage.setItem('admin_token', data.token);
//       localStorage.setItem('admin_user', JSON.stringify(data.user));
//       onLogin();
//     } catch (loginError) {
//       setError(loginError.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="admin-login-page admin-bg">
//       <div className="admin-login-layout">
//         <section className="admin-login-introduction">
//           <div className="admin-login-brand">
//             <span className="admin-login-brand__mark">
//               <ShieldCheck size={28} strokeWidth={2.2} />
//             </span>
//             <div>
//               <strong>NAVSA</strong>
//               <span>Administration</span>
//             </div>
//           </div>

//           <div className="admin-login-introduction__content">
//             <span className="admin-login-eyebrow">
//               Secure trade management
//             </span>

//             <h1>One professional workspace for NAVSA operations.</h1>

//             <p>
//               Manage the product catalogue, trade registrations, suppliers,
//               promotional documents and website content from one protected
//               administration portal.
//             </p>

//             <div className="admin-login-features">
//               <div>
//                 <Package size={18} />
//                 <span>Catalogue and stock management</span>
//               </div>
//               <div>
//                 <UserCheck size={18} />
//                 <span>Customer and supplier approvals</span>
//               </div>
//               <div>
//                 <FileStack size={18} />
//                 <span>Promotional content control</span>
//               </div>
//             </div>
//           </div>

//           <div className="admin-login-introduction__footer">
//             NAVSA International Limited
//           </div>
//         </section>

//         <section className="admin-login-card">
//           <div className="admin-login-card__icon">
//             <Lock size={22} />
//           </div>

//           <div className="admin-login-card__heading">
//             <span>Administrator access</span>
//             <h2>Welcome back</h2>
//             <p>Enter your authorised credentials to continue.</p>
//           </div>

//           {error && (
//             <div className="admin-login-error" role="alert">
//               {error}
//             </div>
//           )}

//           <form className="admin-login-form" onSubmit={handleSubmit}>
//             <label className="admin-login-field">
//               <span>Email address</span>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(event) => setEmail(event.target.value)}
//                 required
//                 autoComplete="username"
//                 className="admin-input-field"
//                 placeholder="admin@company.com"
//               />
//             </label>

//             <label className="admin-login-field">
//               <span>Password</span>

//               <span className="admin-password-field">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   required
//                   autoComplete="current-password"
//                   className="admin-input-field"
//                   placeholder="Enter your password"
//                 />

//                 <button
//                   type="button"
//                   aria-label={
//                     showPassword ? 'Hide password' : 'Show password'
//                   }
//                   onClick={() =>
//                     setShowPassword((isVisible) => !isVisible)
//                   }
//                 >
//                   {showPassword ? (
//                     <EyeOff size={18} />
//                   ) : (
//                     <Eye size={18} />
//                   )}
//                 </button>
//               </span>
//             </label>

//             <button
//               type="submit"
//               disabled={loading}
//               className="admin-btn admin-btn-primary admin-login-submit"
//             >
//               {loading ? 'Signing in…' : 'Sign in securely'}
//               {!loading && <ChevronRight size={18} />}
//             </button>
//           </form>

//           <div className="admin-login-security">
//             <ShieldCheck size={17} />
//             <span>
//               Access is restricted to authorised NAVSA administrators.
//             </span>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default function Admin() {
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     () => Boolean(localStorage.getItem('admin_token'))
//   );

//   const logout = () => {
//     localStorage.removeItem('admin_token');
//     localStorage.removeItem('admin_user');
//     setIsLoggedIn(false);
//   };

//   if (!isLoggedIn) {
//     return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
//   }

//   return <AdminShell onLogout={logout} />;
// }

import { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';

const navigationSections = [
  {
    label: 'Overview',
    items: [
      {
        to: '/admin/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
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
      },
      {
        to: '/admin/offers',
        label: 'Offers & Promotions',
        icon: BadgePercent,
      },
      {
        to: '/admin/brands',
        label: 'Brands',
        icon: Tag,
      },
      {
        to: '/admin/categories',
        label: 'Categories',
        icon: FolderTree,
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
      },
      {
        to: '/admin/users',
        label: 'Customers',
        icon: Users,
      },
      {
        to: '/admin/suppliers',
        label: 'Suppliers',
        icon: Building2,
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
  '/admin/pdfs': {
    eyebrow: 'Content',
    title: 'PDFs & Banners',
    description: 'Manage promotional PDFs, documents and homepage banners.',
  },
};

function clearStoredAdminSession() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  localStorage.removeItem('admin_remember_me');
  sessionStorage.removeItem('admin_session_active');
}

function getStoredAdminToken() {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return null;
  }

  const rememberLogin =
    localStorage.getItem('admin_remember_me') === 'true';
  const activeBrowserSession =
    sessionStorage.getItem('admin_session_active') === 'true';

  if (!rememberLogin && !activeBrowserSession) {
    clearStoredAdminSession();
    return null;
  }

  return token;
}

function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem('admin_user') || '{}');
  } catch {
    return {};
  }
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminUser = getAdminUser();
  const initials = (adminUser.name || 'A').charAt(0).toUpperCase();
  const currentPage = pageDetails[location.pathname] || pageDetails['/admin'];

  const closeSidebar = () => setSidebarOpen(false);

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
          {navigationSections.map((section) => (
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

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={logout}
            className="admin-btn admin-btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', color: '#ef4444' }}
          >
            <LogOut size={20} /> Logout
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
            onClick={onLogout}
            className="admin-sidebar__logout"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        {/* Topbar */}
        <header className="glass-header admin-flex-between" style={{ padding: '1rem 2rem', position: 'relative', zIndex: 100 }}>
          <div />
          <div className="admin-flex-center" style={{ gap: '1rem', position: 'relative' }}>
        <header className="glass-header admin-topbar">
          <div className="admin-topbar__left">
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
            </div>
          </div>

          <div className="admin-topbar__right">
            <div className="admin-secure-session">
              <CircleCheck size={16} />
              <span>Secure session</span>
            </div>

            <div className="admin-profile">
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
                  <strong>{adminUser.name || 'Admin User'}</strong>
                  <small>Administrator</small>
                </span>

                <ChevronDown
                  className="admin-profile__chevron"
                  size={15}
                  strokeWidth={2.2}
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
              {profileOpen && (
                <div className="admin-profile__menu">
                  <div className="admin-profile__menu-header">
                    <span className="admin-profile__menu-avatar">
                      {initials}
                    </span>

                    <div>
                      <strong>{adminUser.name || 'Admin User'}</strong>
                      <span>
                        {adminUser.email ||
                          'admin@navsainternational.com'}
                      </span>
                      <small>Administrator account</small>
                    </div>
                  </div>

                  <div className="admin-profile__menu-divider" />

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
                  <button
                    type="button"
                    className="admin-profile__signout"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
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
            <Route path="products" element={<AdminProducts />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route
              path="registrations"
              element={<AdminRegistrations />}
            />
            <Route path="users" element={<AdminUsers />} />
            <Route path="suppliers" element={<AdminSuppliers />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="pdfs" element={<AdminPdfs />} />
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
  const [rememberLogin, setRememberLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${BASE}/login`, {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data);
    } catch (err) {
      setError(err.message);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      localStorage.setItem(
        'admin_remember_me',
        String(rememberLogin)
      );

      if (rememberLogin) {
        sessionStorage.removeItem('admin_session_active');
      } else {
        sessionStorage.setItem('admin_session_active', 'true');
      }

      onLogin();
    } catch (loginError) {
      setError(loginError.message);
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

            <label className="admin-remember-login">
              <input
                type="checkbox"
                checked={rememberLogin}
                onChange={(event) =>
                  setRememberLogin(event.target.checked)
                }
              />

              <span className="admin-remember-login__box" />

              <span className="admin-remember-login__copy">
                <strong>Keep me logged in</strong>
                <small>Use only on a private, trusted device.</small>
              </span>
            </label>
          </form>

          <div className="admin-login-security">
            <ShieldCheck size={17} />
            <span>
              Access is restricted to authorised NAVSA administrators.
            </span>
          </div>
        </div>
        </section>
      </div>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(getStoredAdminToken())
  );

  const logout = () => {
    clearStoredAdminSession();
    setIsLoggedIn(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminShell />;
}