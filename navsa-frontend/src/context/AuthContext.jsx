import { createContext, useContext, useState } from 'react';
import { logoutAdmin } from '../services/adminApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user') || localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || localStorage.getItem('admin_token') || null;
  });

  const [roles, setRoles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_roles') || '[]');
    } catch {
      return [];
    }
  });

  const [permissions, setPermissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_permissions') || '[]');
    } catch {
      return [];
    }
  });

  const login = (data) => {
    const { user, token, roles = [], permissions = [] } = data;
    setUser(user);
    setToken(token);
    setRoles(roles);
    setPermissions(permissions);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_roles', JSON.stringify(roles));
    localStorage.setItem('admin_permissions', JSON.stringify(permissions));
  };

  const clearLocalSession = () => {
    setUser(null);
    setToken(null);
    setRoles([]);
    setPermissions([]);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_roles');
    localStorage.removeItem('admin_permissions');
  };

  const logout = async () => {
    const tokenToRevoke =
      token || localStorage.getItem('admin_token') || null;

    if (!tokenToRevoke) {
      clearLocalSession();
      return;
    }

    // Revoke the current Sanctum token on the server first.
    // If revocation fails because of a network/server problem, keep the
    // local session so the user can retry instead of showing a false
    // "securely signed out" state while the token is still valid.
    await logoutAdmin(tokenToRevoke);

    clearLocalSession();
  };

  // Permission verification helpers
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

  return (
    <AuthContext.Provider
      value={{
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
        isAuthenticated: !!token,
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