import { createContext, useContext, useState } from 'react';
import { logoutAdmin as revokeAuthToken } from '../services/adminApi';

const AuthContext = createContext(null);

const CUSTOMER_USER_KEY = 'user';
const CUSTOMER_TOKEN_KEY = 'token';

const ADMIN_USER_KEY = 'admin_user';
const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_ROLES_KEY = 'admin_roles';
const ADMIN_PERMISSIONS_KEY = 'admin_permissions';

function safeParse(value, fallback = null) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function isAdminAccount(user) {
  return Boolean(
    user &&
      (user.role === 'admin' ||
        user.role === 'super-admin' ||
        user.is_admin === true ||
        user.is_admin === 1)
  );
}

function getInitialCustomerSession() {
  const storedUser = safeParse(localStorage.getItem(CUSTOMER_USER_KEY));
  const storedToken = localStorage.getItem(CUSTOMER_TOKEN_KEY);

  // Older NAVSA builds copied every login into both the public and admin keys.
  // Remove those legacy admin keys from localStorage so they can never silently
  // authenticate /admin again. New admin sessions live only in sessionStorage.
  const legacyAdminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  const hadLegacyAdminSession = Boolean(
    legacyAdminToken || localStorage.getItem(ADMIN_USER_KEY)
  );

  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_ROLES_KEY);
  localStorage.removeItem(ADMIN_PERMISSIONS_KEY);

  // If the old shared session belonged to an administrator, force one clean
  // sign-in after this upgrade instead of restoring that admin automatically as
  // a public-site customer session.
  if (
    hadLegacyAdminSession &&
    isAdminAccount(storedUser) &&
    (!legacyAdminToken || !storedToken || legacyAdminToken === storedToken)
  ) {
    localStorage.removeItem(CUSTOMER_USER_KEY);
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    return { user: null, token: null };
  }

  if (!storedUser || !storedToken) {
    return { user: null, token: null };
  }

  return { user: storedUser, token: storedToken };
}

function getInitialAdminSession() {
  const adminUser = safeParse(sessionStorage.getItem(ADMIN_USER_KEY));
  const adminToken = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  const adminRoles = safeParse(sessionStorage.getItem(ADMIN_ROLES_KEY), []);
  const adminPermissions = safeParse(
    sessionStorage.getItem(ADMIN_PERMISSIONS_KEY),
    []
  );

  if (!adminUser || !adminToken) {
    return {
      adminUser: null,
      adminToken: null,
      adminRoles: [],
      adminPermissions: [],
    };
  }

  return {
    adminUser,
    adminToken,
    adminRoles: Array.isArray(adminRoles) ? adminRoles : [],
    adminPermissions: Array.isArray(adminPermissions)
      ? adminPermissions
      : [],
  };
}

export function AuthProvider({ children }) {
  const [initialCustomer] = useState(getInitialCustomerSession);
  const [initialAdmin] = useState(getInitialAdminSession);

  // Public/customer session. This is intentionally independent from admin.
  const [user, setUser] = useState(initialCustomer.user);
  const [token, setToken] = useState(initialCustomer.token);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Administration session. sessionStorage keeps the admin signed in during
  // refreshes in the current tab, but does not persist it as the public account.
  const [adminUser, setAdminUser] = useState(initialAdmin.adminUser);
  const [adminToken, setAdminToken] = useState(initialAdmin.adminToken);
  const [adminRoles, setAdminRoles] = useState(initialAdmin.adminRoles);
  const [adminPermissions, setAdminPermissions] = useState(
    initialAdmin.adminPermissions
  );

  const login = (data) => {
    const {
      user: nextUser,
      token: nextToken,
      roles: nextRoles = [],
      permissions: nextPermissions = [],
    } = data;

    setUser(nextUser || null);
    setToken(nextToken || null);
    setRoles(Array.isArray(nextRoles) ? nextRoles : []);
    setPermissions(Array.isArray(nextPermissions) ? nextPermissions : []);

    if (nextUser && nextToken) {
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(nextUser));
      localStorage.setItem(CUSTOMER_TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(CUSTOMER_USER_KEY);
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    }

    // Never create an admin session from a public/customer login.
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_ROLES_KEY);
    localStorage.removeItem(ADMIN_PERMISSIONS_KEY);
  };

  const adminLogin = (data) => {
    const {
      user: nextAdminUser,
      token: nextAdminToken,
      roles: nextAdminRoles = [],
      permissions: nextAdminPermissions = [],
    } = data;

    setAdminUser(nextAdminUser || null);
    setAdminToken(nextAdminToken || null);
    setAdminRoles(Array.isArray(nextAdminRoles) ? nextAdminRoles : []);
    setAdminPermissions(
      Array.isArray(nextAdminPermissions) ? nextAdminPermissions : []
    );

    if (nextAdminUser && nextAdminToken) {
      sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(nextAdminUser));
      sessionStorage.setItem(ADMIN_TOKEN_KEY, nextAdminToken);
      sessionStorage.setItem(
        ADMIN_ROLES_KEY,
        JSON.stringify(Array.isArray(nextAdminRoles) ? nextAdminRoles : [])
      );
      sessionStorage.setItem(
        ADMIN_PERMISSIONS_KEY,
        JSON.stringify(
          Array.isArray(nextAdminPermissions) ? nextAdminPermissions : []
        )
      );
    }
  };

  const clearCustomerSession = () => {
    setUser(null);
    setToken(null);
    setRoles([]);
    setPermissions([]);

    localStorage.removeItem(CUSTOMER_USER_KEY);
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);

    // Clean any legacy shared-auth leftovers as well.
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_ROLES_KEY);
    localStorage.removeItem(ADMIN_PERMISSIONS_KEY);
  };

  const clearAdminSession = () => {
    setAdminUser(null);
    setAdminToken(null);
    setAdminRoles([]);
    setAdminPermissions([]);

    sessionStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_ROLES_KEY);
    sessionStorage.removeItem(ADMIN_PERMISSIONS_KEY);

    // Remove obsolete admin keys from old builds if they still exist.
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_ROLES_KEY);
    localStorage.removeItem(ADMIN_PERMISSIONS_KEY);
  };

  const logout = async () => {
    const tokenToRevoke = token || localStorage.getItem(CUSTOMER_TOKEN_KEY);

    try {
      if (tokenToRevoke) {
        await revokeAuthToken(tokenToRevoke);
      }
    } finally {
      // A public sign-out must always sign this browser out locally, even if the
      // network is temporarily unavailable. It never touches the admin session.
      clearCustomerSession();
    }
  };

  const adminLogout = async () => {
    const tokenToRevoke =
      adminToken || sessionStorage.getItem(ADMIN_TOKEN_KEY);

    try {
      if (tokenToRevoke) {
        await revokeAuthToken(tokenToRevoke);
      }
    } finally {
      // Admin sign-out is isolated from the public/customer account.
      clearAdminSession();
    }
  };

  // Public/customer helpers retained for existing components.
  const isSuperAdmin = roles.includes('super-admin');
  const hasPermission = (permissionName) => {
    if (isSuperAdmin) return true;
    return permissions.includes(permissionName);
  };
  const hasRole = (roleName) => {
    if (isSuperAdmin && roleName === 'super-admin') return true;
    return roles.includes(roleName);
  };
  const hasAnyPermission = (permissionList = []) => {
    if (isSuperAdmin) return true;
    return permissionList.some((perm) => permissions.includes(perm));
  };

  // Dedicated admin authorization helpers.
  const isAdminSuperAdmin = adminRoles.includes('super-admin');
  const adminHasPermission = (permissionName) => {
    if (isAdminSuperAdmin) return true;
    return adminPermissions.includes(permissionName);
  };
  const adminHasRole = (roleName) => {
    if (isAdminSuperAdmin && roleName === 'super-admin') return true;
    return adminRoles.includes(roleName);
  };
  const adminHasAnyPermission = (permissionList = []) => {
    if (isAdminSuperAdmin) return true;
    return permissionList.some((perm) => adminPermissions.includes(perm));
  };

  return (
    <AuthContext.Provider
      value={{
        // Public/customer session
        user,
        token,
        roles,
        permissions,
        isSuperAdmin,
        login,
        logout,
        hasPermission,
        hasRole,
        hasAnyPermission,
        isAuthenticated: Boolean(user && token),

        // Administration session
        adminUser,
        adminToken,
        adminRoles,
        adminPermissions,
        isAdminSuperAdmin,
        adminLogin,
        adminLogout,
        adminHasPermission,
        adminHasRole,
        adminHasAnyPermission,
        isAdminAuthenticated: Boolean(adminUser && adminToken),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
