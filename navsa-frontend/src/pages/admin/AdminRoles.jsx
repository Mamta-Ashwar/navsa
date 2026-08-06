import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, CheckCircle, Save, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoles() {
  const { token, isSuperAdmin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        fetch('/api/admin/roles', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/permissions', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (rolesRes.ok && permsRes.ok) {
        const rolesData = await rolesRes.json();
        const permsData = await permsRes.json();
        setRoles(rolesData);
        setPermissions(permsData);
        if (rolesData.length > 0 && !selectedRole) {
          selectRole(rolesData[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch roles & permissions', err);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions.map((p) => p.name));
  };

  const togglePermission = (permName) => {
    setRolePermissions((prev) =>
      prev.includes(permName) ? prev.filter((p) => p !== permName) : [...prev, permName]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      const res = await fetch(`/api/admin/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissions: rolePermissions }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: `Permissions updated for ${selectedRole.name}` });
        fetchData();
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update permissions' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error updating permissions' });
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoleName.trim(), permissions: [] }),
      });

      if (res.ok) {
        setNewRoleName('');
        setShowCreateModal(false);
        setStatusMessage({ type: 'success', text: 'Role created successfully!' });
        fetchData();
      } else {
        const data = await res.json();
        setStatusMessage({ type: 'error', text: data.message || 'Failed to create role' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error creating role' });
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Group permissions by prefix (module)
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const prefix = perm.name.split('.')[0] || 'general';
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(perm);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#fff' }}>
        <p>Loading Roles & Permissions Configuration...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck color="#3b82f6" size={32} /> Role & Access Control Management
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Configure module-level permissions for each role dynamically.
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-btn admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Add New Role
          </button>
        )}
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${statusMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: statusMessage.type === 'success' ? '#4ade80' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {statusMessage.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        {/* Roles List */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Roles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {roles.map((r) => {
              const active = selectedRole && selectedRole.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => selectRole(r)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    textAlign: 'left',
                    background: active ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#60a5fa' : '#cbd5e1',
                    cursor: 'pointer',
                    fontWeight: active ? 600 : 400,
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{r.name}</span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                    {r.permissions?.length || 0} perms
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Permissions Configuration Matrix */}
        {selectedRole ? (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '1.3rem' }}>
                  Permissions for <span style={{ color: '#60a5fa' }}>{selectedRole.name}</span>
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  Toggle permissions below and click Save Changes.
                </p>
              </div>
              <button
                onClick={handleSavePermissions}
                className="admin-btn admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={18} /> Save Changes
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                <div key={moduleName} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <h4 style={{ color: '#3b82f6', textTransform: 'capitalize', marginBottom: '1rem', fontSize: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
                    {moduleName} Module
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {perms.map((p) => {
                      const checked = rolePermissions.includes(p.name);
                      return (
                        <label
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: checked ? '#fff' : '#94a3b8',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            background: checked ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(p.name)}
                            style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                          />
                          <span style={{ fontSize: '0.9rem' }}>{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            Select a role on the left to configure its permissions.
          </div>
        )}
      </div>

      {/* Modal for creating a new role */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Create New Role</h3>
            <form onSubmit={handleCreateRole}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Role Name</label>
                <input
                  type="text"
                  placeholder="e.g. inventory-manager"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="admin-btn admin-btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
