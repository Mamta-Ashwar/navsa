import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  Eye,
  Pencil,
  RotateCcw,
  Save,
  Snowflake,
  Trash2,
  X,
} from 'lucide-react'
import { deleteUser, getSuppliers, updateSupplier } from '../../services/adminApi'
import NoticeModal from '../../components/NoticeModal'
import ConfirmModal from '../../components/common/ConfirmModal'

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

const displayList = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.length ? parsed.join(', ') : '—'
    } catch {
    }
  }

  return displayValue(value)
}

const toBoolean = (value) => value === true || value === 1 || value === '1'

const toCommaText = (value) => {
  if (Array.isArray(value)) return value.join(', ')

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.join(', ')
    } catch {
      return value
    }
  }

  return ''
}

const formatDate = (value, includeTime = false) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return includeTime ? date.toLocaleString() : date.toLocaleDateString()
}

function SupplierStatusBadge({ status }) {
  const badgeClass = status === 'approved'
    ? 'admin-badge-success'
    : status === 'frozen'
      ? 'admin-badge-info'
      : status === 'rejected'
        ? 'admin-badge-danger'
        : 'admin-badge-warning'

  return <span className={`admin-badge ${badgeClass}`}>{status || 'unknown'}</span>
}

function DetailRow({ label, value }) {
  return (
    <div className="supplier-detail-row">
      <span>{label}</span>
      <strong>{displayValue(value)}</strong>
    </div>
  )
}

function DetailSection({ title, children, fullWidth = false }) {
  return (
    <section className={`supplier-detail-section${fullWidth ? ' supplier-detail-section--full' : ''}`}>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

function SupplierDetailModal({ user, onClose, onEdit }) {
  const detail = user.supplier_detail || {}

  return (
    <div className="supplier-modal-backdrop" onClick={onClose}>
      <div className="supplier-detail-modal glass-panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="supplier-modal-close" onClick={onClose} aria-label="Close supplier details">
          <X size={20} />
        </button>

        <div className="supplier-detail-header">
          <div className="supplier-detail-avatar">
            {(user.name || detail.company_name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="supplier-detail-eyebrow">SUPPLIER ACCOUNT</span>
            <h2>{user.name || 'Supplier'}</h2>
            <p>{user.email}</p>
            <SupplierStatusBadge status={user.status} />
          </div>
          <button type="button" className="admin-btn admin-btn-primary supplier-detail-edit" onClick={() => onEdit(user)}>
            <Pencil size={15} /> Edit Supplier
          </button>
        </div>

        <div className="supplier-detail-grid">
          <DetailSection title="Account Details">
            <DetailRow label="Full Name" value={user.name} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Company" value={user.company_name || detail.company_name} />
            <DetailRow label="Role" value={user.role || 'supplier'} />
            <DetailRow label="Status" value={user.status} />
            <DetailRow label="Submitted" value={formatDate(user.created_at, true)} />
            <DetailRow label="Approved" value={formatDate(user.approved_at, true)} />
          </DetailSection>

          <DetailSection title="Company Information">
            <DetailRow label="Company Type" value={detail.company_type} />
            <DetailRow label="Registration Number" value={detail.company_registration_number} />
            <DetailRow label="Website" value={detail.website_url} />
            <DetailRow label="Additional Comments" value={detail.additional_comments} />
          </DetailSection>

          <DetailSection title="Contact Information">
            <DetailRow label="Mobile Phone" value={detail.mobile_phone || user.phone} />
            <DetailRow label="Business Phone" value={detail.business_phone} />
            <DetailRow label="Preferred Contact Times" value={displayList(detail.contact_time)} />
          </DetailSection>

          <DetailSection title="Business Address">
            <DetailRow label="Address Line 1" value={detail.address_line_1} />
            <DetailRow label="Address Line 2" value={detail.address_line_2} />
            <DetailRow label="City/Town" value={detail.city} />
            <DetailRow label="County/State" value={detail.county} />
            <DetailRow label="Country" value={detail.country} />
            <DetailRow label="Postcode" value={detail.postcode} />
          </DetailSection>

          <DetailSection title="Supply Information" fullWidth>
            <DetailRow label="Categories Supplied" value={displayList(detail.categories_supplied)} />
            <DetailRow label="News & Updates Consent" value={toBoolean(detail.consent_news) ? 'Yes' : 'No'} />
            <DetailRow label="Marketing Consent" value={toBoolean(detail.consent_marketing) ? 'Yes' : 'No'} />
          </DetailSection>
        </div>
      </div>
    </div>
  )
}

function EditField({ label, required = false, children }) {
  return (
    <label className="supplier-edit-field">
      <span>{label}{required ? ' *' : ''}</span>
      {children}
    </label>
  )
}

function SupplierEditPage({ user, onCancel, onSaved }) {
  const detail = user.supplier_detail || {}
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const initialCategories = useMemo(
    () => toCommaText(detail.categories_supplied),
    [detail.categories_supplied],
  )
  const initialContactTimes = useMemo(
    () => toCommaText(detail.contact_time),
    [detail.contact_time],
  )

  const [form, setForm] = useState({
    first_name: detail.first_name || '',
    last_name: detail.last_name || '',
    email: user.email || detail.email_address || '',
    company_name: user.company_name || detail.company_name || '',
    status: user.status || 'approved',
    mobile_phone: detail.mobile_phone || user.phone || '',
    business_phone: detail.business_phone || '',
    company_type: detail.company_type || '',
    company_registration_number: detail.company_registration_number || '',
    website_url: detail.website_url || '',
    address_line_1: detail.address_line_1 || '',
    address_line_2: detail.address_line_2 || '',
    city: detail.city || '',
    county: detail.county || '',
    country: detail.country || '',
    postcode: detail.postcode || '',
    additional_comments: detail.additional_comments || '',
    categories_text: initialCategories,
    contact_time_text: initialContactTimes,
    consent_news: toBoolean(detail.consent_news),
    consent_marketing: toBoolean(detail.consent_marketing),
  })

  const setValue = (event) => {
    const { name, type, checked, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const commaList = (value) => value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await updateSupplier(user.id, {
        email: form.email.trim(),
        company_name: form.company_name.trim(),
        status: form.status,
        supplier_detail: {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          mobile_phone: form.mobile_phone.trim(),
          business_phone: form.business_phone.trim(),
          company_name: form.company_name.trim(),
          company_type: form.company_type.trim(),
          company_registration_number: form.company_registration_number.trim(),
          website_url: form.website_url.trim(),
          address_line_1: form.address_line_1.trim(),
          address_line_2: form.address_line_2.trim(),
          city: form.city.trim(),
          county: form.county.trim(),
          country: form.country.trim(),
          postcode: form.postcode.trim(),
          additional_comments: form.additional_comments.trim(),
          categories_supplied: commaList(form.categories_text),
          contact_time: commaList(form.contact_time_text),
          consent_news: Boolean(form.consent_news),
          consent_marketing: Boolean(form.consent_marketing),
        },
      })

      await onSaved()
    } catch (saveError) {
      setError(saveError.message || 'Unable to save supplier details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="supplier-edit-page">
      <div className="supplier-edit-page__header">
        <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel} disabled={saving}>
          <ArrowLeft size={16} /> Back to Suppliers
        </button>
        <div>
          <span>SUPPLIER MANAGEMENT</span>
          <h2>Edit Supplier Details</h2>
          <p>{user.name} · {user.email}</p>
        </div>
      </div>

      {error && <div className="supplier-page-error">{error}</div>}

      <form className="supplier-edit-form" onSubmit={submit}>
        <section className="supplier-edit-section">
          <h3>Account & Company</h3>
          <div className="supplier-edit-grid">
            <EditField label="First Name" required>
              <input className="admin-input-field" name="first_name" value={form.first_name} onChange={setValue} required />
            </EditField>
            <EditField label="Last Name" required>
              <input className="admin-input-field" name="last_name" value={form.last_name} onChange={setValue} required />
            </EditField>
            <EditField label="Email" required>
              <input type="email" className="admin-input-field" name="email" value={form.email} onChange={setValue} required />
            </EditField>
            <EditField label="Company Name" required>
              <input className="admin-input-field" name="company_name" value={form.company_name} onChange={setValue} required />
            </EditField>
            <EditField label="Status" required>
              <select className="admin-input-field" name="status" value={form.status} onChange={setValue} required>
                <option value="approved">Approved</option>
                <option value="frozen">Frozen</option>
                <option value="rejected">Rejected</option>
              </select>
            </EditField>
            <EditField label="Company Type">
              <input className="admin-input-field" name="company_type" value={form.company_type} onChange={setValue} />
            </EditField>
            <EditField label="Company Registration Number">
              <input className="admin-input-field" name="company_registration_number" value={form.company_registration_number} onChange={setValue} />
            </EditField>
            <EditField label="Website">
              <input className="admin-input-field" name="website_url" value={form.website_url} onChange={setValue} placeholder="https://" />
            </EditField>
          </div>
        </section>

        <section className="supplier-edit-section">
          <h3>Contact Information</h3>
          <div className="supplier-edit-grid">
            <EditField label="Mobile Phone">
              <input className="admin-input-field" name="mobile_phone" value={form.mobile_phone} onChange={setValue} />
            </EditField>
            <EditField label="Business Phone">
              <input className="admin-input-field" name="business_phone" value={form.business_phone} onChange={setValue} />
            </EditField>
            <EditField label="Preferred Contact Times (comma-separated)">
              <input className="admin-input-field" name="contact_time_text" value={form.contact_time_text} onChange={setValue} placeholder="Morning, Afternoon" />
            </EditField>
          </div>
        </section>

        <section className="supplier-edit-section">
          <h3>Business Address</h3>
          <div className="supplier-edit-grid">
            <EditField label="Address Line 1">
              <input className="admin-input-field" name="address_line_1" value={form.address_line_1} onChange={setValue} />
            </EditField>
            <EditField label="Address Line 2">
              <input className="admin-input-field" name="address_line_2" value={form.address_line_2} onChange={setValue} />
            </EditField>
            <EditField label="City/Town">
              <input className="admin-input-field" name="city" value={form.city} onChange={setValue} />
            </EditField>
            <EditField label="County/State">
              <input className="admin-input-field" name="county" value={form.county} onChange={setValue} />
            </EditField>
            <EditField label="Country">
              <input className="admin-input-field" name="country" value={form.country} onChange={setValue} />
            </EditField>
            <EditField label="Postcode">
              <input className="admin-input-field" name="postcode" value={form.postcode} onChange={setValue} />
            </EditField>
          </div>
        </section>

        <section className="supplier-edit-section">
          <h3>Supply Details & Preferences</h3>
          <div className="supplier-edit-grid">
            <EditField label="Categories Supplied (comma-separated)">
              <textarea className="admin-input-field" name="categories_text" value={form.categories_text} onChange={setValue} rows={4} />
            </EditField>
            <EditField label="Additional Comments">
              <textarea className="admin-input-field" name="additional_comments" value={form.additional_comments} onChange={setValue} rows={4} />
            </EditField>
          </div>
          <div className="supplier-consent-grid">
            <label>
              <input type="checkbox" name="consent_news" checked={form.consent_news} onChange={setValue} />
              Supplier consented to news and product updates.
            </label>
            <label>
              <input type="checkbox" name="consent_marketing" checked={form.consent_marketing} onChange={setValue} />
              Supplier consented to marketing communications.
            </label>
          </div>
        </section>

        <div className="supplier-edit-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Supplier Details'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SupplierRow({ user, onView, onEdit, onRequestAction, busy }) {
  const detail = user.supplier_detail || {}
  const actionButton = (title, icon, action, className = '') => (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`supplier-row-action ${className}`}
      disabled={busy}
      onClick={(event) => {
        event.stopPropagation()
        action()
      }}
    >
      {icon}
    </button>
  )

  return (
    <tr onClick={() => onView(user)} className="supplier-table-row">
      <td>
        <div className="supplier-primary-value">{user.name || `${detail.first_name || ''} ${detail.last_name || ''}`.trim() || '—'}</div>
        <div className="supplier-secondary-value">{user.email || detail.email_address || '—'}</div>
      </td>
      <td>
        <div className="supplier-primary-value">{user.company_name || detail.company_name || '—'}</div>
        <div className="supplier-secondary-value">{detail.company_type || '—'}</div>
      </td>
      <td>{detail.mobile_phone || detail.business_phone || user.phone || '—'}</td>
      <td>{detail.country || '—'}</td>
      <td className="supplier-categories-cell">{displayList(detail.categories_supplied)}</td>
      <td><SupplierStatusBadge status={user.status} /></td>
      <td>{formatDate(user.approved_at)}</td>
      <td onClick={(event) => event.stopPropagation()}>
        <div className="supplier-row-actions">
          {actionButton('View supplier', <Eye size={16} />, () => onView(user))}
          {actionButton('Edit supplier', <Pencil size={16} />, () => onEdit(user))}
          {user.status === 'approved' && actionButton(
            'Freeze supplier',
            <Snowflake size={16} />,
            () => onRequestAction(user, 'freeze'),
            'supplier-row-action--freeze',
          )}
          {(user.status === 'frozen' || user.status === 'rejected') && actionButton(
            user.status === 'frozen' ? 'Unfreeze supplier' : 'Approve supplier',
            <RotateCcw size={16} />,
            () => onRequestAction(user, 'approve'),
            'supplier-row-action--approve',
          )}
          {actionButton(
            'Delete supplier permanently',
            <Trash2 size={16} />,
            () => onRequestAction(user, 'delete'),
            'supplier-row-action--delete',
          )}
        </div>
      </td>
    </tr>
  )
}

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [meta, setMeta] = useState({})
  const [filter, setFilter] = useState('approved')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [confirmAction, setConfirmAction] = useState({ open:false, user:null, action:null })
  const [actionProcessing, setActionProcessing] = useState(false)
  const [notice, setNotice] = useState({ open:false, title:'', message:'', type:'success' })

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const params = { page }
      if (filter !== 'all') params.status = filter
      if (search.trim()) params.search = search.trim()

      const response = await getSuppliers(params)
      setSuppliers(Array.isArray(response.data) ? response.data : [])
      setMeta({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total,
      })
    } catch (error) {
      setNotice({
        open: true,
        title: 'Unable to Load Suppliers',
        message: error.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [filter, page, search])

  useEffect(() => {
    load()
  }, [load])

  const requestAction = (user, action) => {
    setConfirmAction({ open:true, user, action })
  }

  const closeConfirmation = () => {
    if (actionProcessing) return
    setConfirmAction({ open:false, user:null, action:null })
  }

  const processAction = async () => {
    const { user, action } = confirmAction
    if (!user || !action) return

    setActionProcessing(true)

    try {
      if (action === 'delete') {
        await deleteUser(user.id)
      } else {
        await updateSupplier(user.id, {
          status: action === 'freeze' ? 'frozen' : 'approved',
        })
      }

      setConfirmAction({ open:false, user:null, action:null })
      setSelected(null)
      await load()

      setNotice({
        open: true,
        title: action === 'delete'
          ? 'Supplier Deleted'
          : action === 'freeze'
            ? 'Supplier Frozen'
            : 'Supplier Approved',
        message: action === 'delete'
          ? `Supplier "${user.name}" was permanently deleted.`
          : action === 'freeze'
            ? `Supplier "${user.name}" was frozen successfully.`
            : `Supplier "${user.name}" is now approved and active.`,
        type: 'success',
      })
    } catch (error) {
      setConfirmAction({ open:false, user:null, action:null })
      setNotice({
        open: true,
        title: 'Action Failed',
        message: error.message,
        type: 'error',
      })
    } finally {
      setActionProcessing(false)
    }
  }

  const finishEdit = async () => {
    await load()
    setEditing(null)
  }

  if (editing) {
    return (
      <SupplierEditPage
        user={editing}
        onCancel={() => setEditing(null)}
        onSaved={finishEdit}
      />
    )
  }

  const modalContent = {
    approve: {
      title: confirmAction.user?.status === 'frozen' ? 'Unfreeze Supplier?' : 'Approve Supplier?',
      message: `Are you sure you want to activate "${confirmAction.user?.name || 'this supplier'}"?`,
      description: 'The supplier account will be marked as approved.',
      confirmText: confirmAction.user?.status === 'frozen' ? 'Unfreeze Supplier' : 'Approve Supplier',
      eyebrow: 'SUPPLIER ACTIVATION',
      icon: '✓',
      variant: 'success',
    },
    freeze: {
      title: 'Freeze Supplier?',
      message: `Are you sure you want to freeze "${confirmAction.user?.name || 'this supplier'}"?`,
      description: 'The supplier account will remain saved but will no longer be active.',
      confirmText: 'Freeze Supplier',
      eyebrow: 'SUPPLIER FREEZE',
      icon: '❄',
      variant: 'warning',
    },
    delete: {
      title: 'Delete Supplier Permanently?',
      message: `Are you sure you want to permanently delete "${confirmAction.user?.name || 'this supplier'}"?`,
      description: 'The supplier account and linked supplier details will be removed. This action cannot be undone.',
      confirmText: 'Delete Permanently',
      eyebrow: 'PERMANENT DELETION',
      icon: '!',
      variant: 'danger',
    },
  }

  const currentModal = modalContent[confirmAction.action] || modalContent.freeze

  const filterButton = (label, value) => (
    <button
      type="button"
      className={`admin-btn ${filter === value ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
      onClick={() => {
        setFilter(value)
        setPage(1)
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="admin-suppliers-page">
      {selected && (
        <SupplierDetailModal
          user={selected}
          onClose={() => setSelected(null)}
          onEdit={(user) => {
            setSelected(null)
            setEditing(user)
          }}
        />
      )}

      <div className="supplier-page-header">
        <div>
          <span className="supplier-page-eyebrow">SUPPLIER DIRECTORY</span>
          <h1><Building2 size={25} /> Suppliers</h1>
          <p>Approved supplier applications are stored here after they leave the pending Registrations tab.</p>
        </div>
        <div className="supplier-page-total">
          <strong>{meta.total || 0}</strong>
          <span>{filter === 'all' ? 'processed suppliers' : `${filter} suppliers`}</span>
        </div>
      </div>

      <div className="supplier-toolbar">
        <div className="supplier-filter-tabs">
          {filterButton('Approved', 'approved')}
          {filterButton('Frozen', 'frozen')}
          {filterButton('Rejected', 'rejected')}
          {filterButton('All Processed', 'all')}
        </div>

        <label className="supplier-search">
          <span className="sr-only">Search suppliers</span>
          <input
            className="admin-input-field"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search supplier, company, country…"
          />
        </label>
      </div>

      <div className="glass-panel supplier-list-panel">
        {loading ? (
          <div className="supplier-empty-state">Loading suppliers…</div>
        ) : suppliers.length === 0 ? (
          <div className="supplier-empty-state">
            <Building2 size={35} />
            <strong>No {filter === 'all' ? 'processed' : filter} suppliers found.</strong>
            <span>Approved supplier applications will appear here automatically.</span>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table supplier-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Categories Supplied</th>
                  <th>Status</th>
                  <th>Approved</th>
                  <th className="supplier-actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <SupplierRow
                    key={supplier.id}
                    user={supplier}
                    onView={setSelected}
                    onEdit={setEditing}
                    onRequestAction={requestAction}
                    busy={actionProcessing && confirmAction.user?.id === supplier.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="supplier-pagination">
        <span>Page {meta.current_page || 1} of {meta.last_page || 1} ({meta.total || 0} suppliers)</span>
        <div>
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            ← Previous
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            disabled={page >= (meta.last_page || 1)}
            onClick={() => setPage((current) => Math.min(meta.last_page || 1, current + 1))}
          >
            Next →
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmAction.open}
        title={currentModal.title}
        message={currentModal.message}
        description={currentModal.description}
        confirmText={currentModal.confirmText}
        cancelText="Cancel"
        eyebrow={currentModal.eyebrow}
        icon={currentModal.icon}
        variant={currentModal.variant}
        loading={actionProcessing}
        closeOnBackdrop={!actionProcessing}
        onConfirm={processAction}
        onClose={closeConfirmation}
      />

      <NoticeModal
        open={notice.open}
        title={notice.title}
        message={notice.message}
        type={notice.type}
        buttonText="OK"
        onClose={() => setNotice((current) => ({ ...current, open:false }))}
      />
    </div>
  )
}