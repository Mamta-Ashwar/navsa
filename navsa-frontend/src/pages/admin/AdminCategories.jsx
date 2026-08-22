import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  FolderTree,
  ImageIcon,
  Layers3,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import ConfirmModal from '../../components/common/ConfirmModal'
import {
  bulkHardDeleteCategories,
  bulkHardDeleteSubCategories,
  bulkHideCategories,
  bulkHideSubCategories,
  bulkRestoreCategories,
  bulkRestoreSubCategories,
  bulkShowCategories,
  bulkShowSubCategories,
  bulkSoftDeleteCategories,
  bulkSoftDeleteSubCategories,
  createCategory,
  createSubCategory,
  getAdminSubCategories,
  getCategories,
  hardDeleteCategory,
  hardDeleteSubCategory,
  restoreCategory,
  restoreSubCategory,
  softDeleteCategory,
  softDeleteSubCategory,
  updateCategory,
  updateSubCategory,
  uploadCategoryImage,
} from '../../services/adminApi'
import './AdminCategories.css'

const MAIN_TAB = 'main'
const SUB_TAB = 'sub'
const STATUS_FILTERS = ['all', 'active', 'hidden', 'deleted']
const STORAGE_TYPES = ['Ambient', 'Frozen', 'Chilled']

const asBool = (value) => value === true || value === 1 || value === '1'
const isDeleted = (row) => asBool(row?.deleted)
const isActive = (row) => !isDeleted(row) && asBool(row?.status)
const isHidden = (row) => !isDeleted(row) && !asBool(row?.status)

function statusLabel(row) {
  if (isDeleted(row)) return 'Deleted'
  return asBool(row?.status) ? 'Active' : 'Hidden'
}

function rowName(tab, row) {
  return tab === MAIN_TAB ? row.category_name : row.sub_category_name
}

function categoryImageUrl(row) {
  const value = String(row?.image_url || row?.image_path || '').trim()
  if (!value) return ''
  return value
}

function MainCategoryEdit({ row, busy, onCancel, onSave }) {
  const [name, setName] = useState(row.category_name || '')

  return (
    <div className="admin-categories-edit admin-categories-edit--main">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSave({ category_name: name.trim() })
          if (event.key === 'Escape') onCancel()
        }}
        disabled={busy}
        autoFocus
      />
      <button
        type="button"
        className="is-save"
        disabled={busy || !name.trim()}
        onClick={() => onSave({ category_name: name.trim() })}
        title="Save category"
      >
        <Check size={15} />
      </button>
      <button type="button" disabled={busy} onClick={onCancel} title="Cancel editing">
        <X size={15} />
      </button>
    </div>
  )
}

function SubCategoryEdit({ row, categories, busy, onCancel, onSave }) {
  const [name, setName] = useState(row.sub_category_name || '')
  const [groupCode, setGroupCode] = useState(row.group_code || '')
  const [categoryId, setCategoryId] = useState(String(row.category_id || ''))

  const save = () => {
    if (!name.trim() || !groupCode.trim() || !categoryId) return
    onSave({
      category_id: Number(categoryId),
      sub_category_name: name.trim(),
      group_code: groupCode.trim().toUpperCase(),
    })
  }

  return (
    <div className="admin-categories-edit admin-categories-edit--sub">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Subcategory name"
        disabled={busy}
        autoFocus
      />
      <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={busy}>
        {categories
          .filter((category) => !isDeleted(category))
          .map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
      </select>
      <input
        value={groupCode}
        onChange={(event) => setGroupCode(event.target.value.toUpperCase())}
        onKeyDown={(event) => {
          if (event.key === 'Enter') save()
          if (event.key === 'Escape') onCancel()
        }}
        placeholder="Group code"
        maxLength={10}
        disabled={busy}
      />
      <button
        type="button"
        className="is-save"
        disabled={busy || !name.trim() || !groupCode.trim() || !categoryId}
        onClick={save}
        title="Save subcategory"
      >
        <Check size={15} />
      </button>
      <button type="button" disabled={busy} onClick={onCancel} title="Cancel editing">
        <X size={15} />
      </button>
    </div>
  )
}

export default function AdminCategories() {
  const [tab, setTab] = useState(MAIN_TAB)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [editingId, setEditingId] = useState(null)
  const [rowBusyId, setRowBusyId] = useState(null)
  const [imageBusyId, setImageBusyId] = useState(null)
  const [storageBusyId, setStorageBusyId] = useState(null)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState(null)
  const messageTimerRef = useRef(null)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubName, setNewSubName] = useState('')
  const [newSubGroupCode, setNewSubGroupCode] = useState('')
  const [newSubStorageType, setNewSubStorageType] = useState('Ambient')
  const [newSubCategoryId, setNewSubCategoryId] = useState('')

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    row: null,
    bulk: false,
  })

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text })
    window.clearTimeout(messageTimerRef.current)
    messageTimerRef.current = window.setTimeout(() => setMessage(null), 5000)
  }, [])

  useEffect(() => () => window.clearTimeout(messageTimerRef.current), [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [categoryRows, subCategoryRows] = await Promise.all([
        getCategories({ show_deleted: 1 }),
        getAdminSubCategories({ show_deleted: 1 }),
      ])

      const nextCategories = Array.isArray(categoryRows) ? categoryRows : []
      const nextSubCategories = Array.isArray(subCategoryRows) ? subCategoryRows : []

      setCategories(nextCategories)
      setSubCategories(nextSubCategories)

      const firstAvailable = nextCategories.find((category) => !isDeleted(category))
      if (firstAvailable) {
        setNewSubCategoryId((current) => current || String(firstAvailable.id))
      }
    } catch (error) {
      showMessage('error', error.message || 'Unable to load categories.')
    } finally {
      setLoading(false)
    }
  }, [showMessage])

  useEffect(() => {
    load()
  }, [load])

  const rows = tab === MAIN_TAB ? categories : subCategories

  const counts = useMemo(() => ({
    available: rows.filter((row) => !isDeleted(row)).length,
    active: rows.filter(isActive).length,
    hidden: rows.filter(isHidden).length,
    deleted: rows.filter(isDeleted).length,
  }), [rows])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesStatus =
        statusFilter === 'deleted'
          ? isDeleted(row)
          : statusFilter === 'active'
            ? isActive(row)
            : statusFilter === 'hidden'
              ? isHidden(row)
              : !isDeleted(row)

      if (!matchesStatus) return false
      if (!query) return true

      if (tab === MAIN_TAB) {
        return (
          (row.category_name || '').toLowerCase().includes(query)
          || String(row.id).includes(query)
        )
      }

      return (
        (row.sub_category_name || '').toLowerCase().includes(query)
        || (row.group_code || '').toLowerCase().includes(query)
        || (row.storage_type || '').toLowerCase().includes(query)
        || (row.category?.category_name || '').toLowerCase().includes(query)
        || String(row.id).includes(query)
      )
    })
  }, [rows, search, statusFilter, tab])

  const filteredIds = useMemo(
    () => filteredRows.map((row) => Number(row.id)),
    [filteredRows],
  )

  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id))

  const switchTab = (nextTab) => {
    setTab(nextTab)
    setSearch('')
    setStatusFilter('all')
    setSelectedIds(new Set())
    setEditingId(null)
  }

  const changeFilter = (filter) => {
    setStatusFilter(filter)
    setSelectedIds(new Set())
    setEditingId(null)
  }

  const toggleSelected = (id) => {
    const numericId = Number(id)
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(numericId)) next.delete(numericId)
      else next.add(numericId)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (allFilteredSelected) filteredIds.forEach((id) => next.delete(id))
      else filteredIds.forEach((id) => next.add(id))
      return next
    })
  }

  const addMainCategory = async () => {
    const name = newCategoryName.trim()
    if (!name || adding) return
    setAdding(true)
    try {
      await createCategory(name)
      setNewCategoryName('')
      showMessage('success', `“${name}” was added as a main category.`)
      await load()
    } catch (error) {
      showMessage('error', error.message)
    } finally {
      setAdding(false)
    }
  }

  const addSubCategory = async () => {
    const name = newSubName.trim()
    const groupCode = newSubGroupCode.trim().toUpperCase()
    const categoryId = Number(newSubCategoryId)
    if (!name || !groupCode || !categoryId || adding) return

    setAdding(true)
    try {
      await createSubCategory({
        category_id: categoryId,
        sub_category_name: name,
        group_code: groupCode,
        storage_type: newSubStorageType,
      })
      setNewSubName('')
      setNewSubGroupCode('')
      setNewSubStorageType('Ambient')
      showMessage('success', `“${name}” was added as a subcategory.`)
      await load()
    } catch (error) {
      showMessage('error', error.message)
    } finally {
      setAdding(false)
    }
  }

  const changeMainCategoryImage = async (row, file) => {
    if (!file || imageBusyId) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Please choose a JPG, PNG or WebP category image.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('error', 'Category images must be 10 MB or smaller.')
      return
    }

    setImageBusyId(Number(row.id))
    try {
      const payload = new FormData()
      payload.append('image', file)
      await uploadCategoryImage(row.id, payload)
      showMessage('success', `Image for “${row.category_name}” was updated.`)
      await load()
    } catch (error) {
      showMessage('error', error.message || 'Unable to upload category image.')
    } finally {
      setImageBusyId(null)
    }
  }

  const saveRow = async (row, data) => {
    if (rowBusyId) return
    setRowBusyId(Number(row.id))
    try {
      if (tab === MAIN_TAB) {
        await updateCategory(row.id, {
          category_name: data.category_name,
          status: asBool(row.status) ? 1 : 0,
        })
        showMessage('success', `“${data.category_name}” was updated.`)
      } else {
        await updateSubCategory(row.id, {
          category_id: data.category_id,
          sub_category_name: data.sub_category_name,
          group_code: data.group_code,
          storage_type: row.storage_type || 'Ambient',
          status: asBool(row.status) ? 1 : 0,
        })
        showMessage('success', `“${data.sub_category_name}” was updated.`)
      }
      setEditingId(null)
      await load()
    } catch (error) {
      showMessage('error', error.message)
    } finally {
      setRowBusyId(null)
    }
  }

  const changeSubCategoryStorage = async (row, nextStorageType) => {
    if (
      tab !== SUB_TAB
      || isDeleted(row)
      || storageBusyId
      || !STORAGE_TYPES.includes(nextStorageType)
      || nextStorageType === row.storage_type
    ) {
      return
    }

    setStorageBusyId(Number(row.id))
    try {
      const result = await updateSubCategory(row.id, {
        category_id: Number(row.category_id),
        sub_category_name: row.sub_category_name,
        group_code: row.group_code,
        storage_type: nextStorageType,
        status: asBool(row.status) ? 1 : 0,
      })

      const productCount = Number(result?.storage_products_updated ?? row.products_count ?? 0)
      showMessage(
        'success',
        `“${row.sub_category_name}” is now ${nextStorageType}. ${productCount.toLocaleString()} linked product${productCount === 1 ? '' : 's'} updated too.`,
      )
      await load()
    } catch (error) {
      showMessage('error', error.message || 'Unable to update the storage type.')
    } finally {
      setStorageBusyId(null)
    }
  }

  const requestAction = (row, action) => {
    setConfirmDialog({ open: true, action, row, bulk: false })
  }

  const requestBulkAction = (action) => {
    if (selectedIds.size === 0 || bulkBusy) return
    setConfirmDialog({ open: true, action, row: null, bulk: true })
  }

  const closeConfirmation = () => {
    if (bulkBusy || rowBusyId) return
    setConfirmDialog({ open: false, action: null, row: null, bulk: false })
  }

  const executeConfirmation = async () => {
    const { action, row, bulk } = confirmDialog
    if (!action) return

    const payload = { ids: [...selectedIds] }

    try {
      if (bulk) {
        setBulkBusy(true)

        const actions = tab === MAIN_TAB
          ? {
              show: () => bulkShowCategories(payload),
              hide: () => bulkHideCategories(payload),
              delete: () => bulkSoftDeleteCategories(payload),
              restore: () => bulkRestoreCategories(payload),
              'permanent-delete': () => bulkHardDeleteCategories(payload),
            }
          : {
              show: () => bulkShowSubCategories(payload),
              hide: () => bulkHideSubCategories(payload),
              delete: () => bulkSoftDeleteSubCategories(payload),
              restore: () => bulkRestoreSubCategories(payload),
              'permanent-delete': () => bulkHardDeleteSubCategories(payload),
            }

        const result = await actions[action]?.()
        if (!result) throw new Error('Unsupported bulk action.')
        showMessage('success', result.message || 'Selected records were updated.')
        setSelectedIds(new Set())
      } else {
        setRowBusyId(Number(row.id))

        if (tab === MAIN_TAB) {
          if (action === 'show' || action === 'hide') {
            await updateCategory(row.id, {
              category_name: row.category_name,
              status: action === 'show' ? 1 : 0,
            })
          } else if (action === 'delete') {
            await softDeleteCategory(row.id)
          } else if (action === 'restore') {
            await restoreCategory(row.id)
          } else if (action === 'permanent-delete') {
            await hardDeleteCategory(row.id)
          }
        } else {
          if (action === 'show' || action === 'hide') {
            await updateSubCategory(row.id, {
              category_id: Number(row.category_id),
              sub_category_name: row.sub_category_name,
              group_code: row.group_code,
              status: action === 'show' ? 1 : 0,
            })
          } else if (action === 'delete') {
            await softDeleteSubCategory(row.id)
          } else if (action === 'restore') {
            await restoreSubCategory(row.id)
          } else if (action === 'permanent-delete') {
            await hardDeleteSubCategory(row.id)
          }
        }

        const actionText = {
          show: 'shown',
          hide: 'hidden',
          delete: 'moved to Deleted',
          restore: 'restored as hidden',
          'permanent-delete': 'permanently deleted',
        }[action]
        showMessage('success', `“${rowName(tab, row)}” was ${actionText}.`)
      }

      setConfirmDialog({ open: false, action: null, row: null, bulk: false })
      await load()
    } catch (error) {
      setConfirmDialog({ open: false, action: null, row: null, bulk: false })
      showMessage('error', error.message || 'The category action could not be completed.')
    } finally {
      setBulkBusy(false)
      setRowBusyId(null)
    }
  }

  const actionMeta = useMemo(() => {
    const { action, row, bulk } = confirmDialog
    const target = tab === MAIN_TAB ? 'category' : 'subcategory'
    const targetPlural = tab === MAIN_TAB ? 'categories' : 'subcategories'
    const count = selectedIds.size
    const name = row ? rowName(tab, row) : ''

    if (action === 'show') {
      return {
        title: bulk ? `Show ${count} selected ${targetPlural}?` : `Show this ${target}?`,
        message: bulk ? `${count.toLocaleString()} selected ${targetPlural}` : <strong>{name}</strong>,
        description: tab === MAIN_TAB
          ? 'The selected main category will become available publicly. Its active subcategories can appear again too.'
          : 'The selected subcategory will become available publicly when its main category is also active.',
        confirmText: bulk ? 'Show selected' : `Show ${target}`,
        eyebrow: `SHOW ${target.toUpperCase()}`,
        icon: <Eye size={29} />,
        variant: 'success',
      }
    }

    if (action === 'hide') {
      return {
        title: bulk ? `Hide ${count} selected ${targetPlural}?` : `Hide this ${target}?`,
        message: bulk ? `${count.toLocaleString()} selected ${targetPlural}` : <strong>{name}</strong>,
        description: tab === MAIN_TAB
          ? 'Products stay assigned. The main category and its subcategories stop being offered through the public category navigation until shown again.'
          : 'Products stay assigned. The subcategory is hidden publicly until shown again.',
        confirmText: bulk ? 'Hide selected' : `Hide ${target}`,
        eyebrow: `HIDE ${target.toUpperCase()}`,
        icon: <EyeOff size={29} />,
        variant: 'warning',
      }
    }

    if (action === 'delete') {
      return {
        title: bulk ? `Move ${count} selected ${targetPlural} to Deleted?` : `Move this ${target} to Deleted?`,
        message: bulk ? `${count.toLocaleString()} selected ${targetPlural}` : <strong>{name}</strong>,
        description: 'This is recoverable. Existing products keep their category IDs. The record can be restored later from the Deleted filter.',
        confirmText: bulk ? 'Move selected to Deleted' : 'Move to Deleted',
        eyebrow: `DELETE ${target.toUpperCase()}`,
        icon: <Trash2 size={29} />,
        variant: 'danger',
      }
    }

    if (action === 'restore') {
      return {
        title: bulk ? `Restore ${count} selected ${targetPlural}?` : `Restore this ${target}?`,
        message: bulk ? `${count.toLocaleString()} selected ${targetPlural}` : <strong>{name}</strong>,
        description: 'Restored records return as Hidden, not public. Use Show afterwards when you are ready to make them visible.',
        confirmText: bulk ? 'Restore selected' : `Restore ${target}`,
        eyebrow: `RESTORE ${target.toUpperCase()}`,
        icon: <RotateCcw size={29} />,
        variant: 'success',
      }
    }

    return {
      title: bulk ? `Permanently delete ${count} selected ${targetPlural}?` : `Permanently delete this ${target}?`,
      message: bulk ? `${count.toLocaleString()} selected ${targetPlural}` : <strong>{name}</strong>,
      description: tab === MAIN_TAB
        ? 'This cannot be undone. Permanent deletion is blocked if products or subcategories are still assigned to a main category.'
        : 'This cannot be undone. Permanent deletion is blocked if products are still assigned to a subcategory.',
      confirmText: bulk ? 'Delete selected permanently' : 'Delete permanently',
      eyebrow: 'PERMANENT DELETE',
      icon: <Trash2 size={29} />,
      variant: 'danger',
    }
  }, [confirmDialog, selectedIds.size, tab])

  const currentTabTitle = tab === MAIN_TAB ? 'Main Categories' : 'Subcategories'

  return (
    <div className="admin-categories-page">
      <ConfirmModal
        open={confirmDialog.open}
        title={actionMeta.title}
        message={actionMeta.message}
        description={actionMeta.description}
        confirmText={actionMeta.confirmText}
        cancelText="Cancel"
        eyebrow={actionMeta.eyebrow}
        icon={actionMeta.icon}
        variant={actionMeta.variant}
        loading={bulkBusy || Boolean(rowBusyId)}
        closeOnBackdrop={!bulkBusy && !rowBusyId}
        onConfirm={executeConfirmation}
        onClose={closeConfirmation}
      />

      <div className="admin-categories-heading admin-flex-between mb-6">
        <div>
          <h1>Categories</h1>
          <p>Manage main categories, subcategories, visibility and product classification.</p>
        </div>
      </div>

      <div className="admin-categories-tabs" role="tablist" aria-label="Category sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === MAIN_TAB}
          onClick={() => switchTab(MAIN_TAB)}
          className={`admin-btn ${tab === MAIN_TAB ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
        >
          <FolderTree size={17} /> Main Categories ({categories.filter((row) => !isDeleted(row)).length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === SUB_TAB}
          onClick={() => switchTab(SUB_TAB)}
          className={`admin-btn ${tab === SUB_TAB ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
        >
          <Layers3 size={17} /> Subcategories ({subCategories.filter((row) => !isDeleted(row)).length})
        </button>
      </div>

      {message && (
        <div className={`admin-categories-message ${message.type === 'error' ? 'is-error' : 'is-success'}`} role="status">
          {message.type === 'error' ? <X size={17} /> : <CheckCircle2 size={17} />}
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss message">
            <X size={15} />
          </button>
        </div>
      )}

      <section className="glass-panel admin-categories-add">
        {tab === MAIN_TAB ? (
          <>
            <div className="admin-categories-add__label">
              <FolderTree size={17} />
              <div>
                <strong>Add a main category</strong>
                <span>These are the top-level categories shown in your catalogue.</span>
              </div>
            </div>
            <div className="admin-categories-add__main-form">
              <input
                className="admin-input-field"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && addMainCategory()}
                placeholder="New main category name…"
              />
              <button
                type="button"
                onClick={addMainCategory}
                disabled={adding || !newCategoryName.trim()}
                className="admin-btn admin-btn-primary"
              >
                <Plus size={17} /> {adding ? 'Adding…' : 'Add Category'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="admin-categories-add__label">
              <Layers3 size={17} />
              <div>
                <strong>Add a subcategory</strong>
                <span>Each subcategory belongs to one main category and has a unique ERP group code.</span>
              </div>
            </div>
            <div className="admin-categories-add__sub-form">
              <select
                className="admin-input-field"
                value={newSubCategoryId}
                onChange={(event) => setNewSubCategoryId(event.target.value)}
              >
                <option value="">Select main category…</option>
                {categories
                  .filter((category) => !isDeleted(category))
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
              </select>
              <input
                className="admin-input-field"
                value={newSubName}
                onChange={(event) => setNewSubName(event.target.value)}
                placeholder="Subcategory name…"
              />
              <input
                className="admin-input-field"
                value={newSubGroupCode}
                onChange={(event) => setNewSubGroupCode(event.target.value.toUpperCase())}
                onKeyDown={(event) => event.key === 'Enter' && addSubCategory()}
                placeholder="Group code…"
                maxLength={10}
              />
              <select
                className={`admin-input-field admin-categories-new-storage is-${newSubStorageType.toLowerCase()}`}
                value={newSubStorageType}
                onChange={(event) => setNewSubStorageType(event.target.value)}
                aria-label="Storage type for new subcategory"
                title="Storage type"
              >
                {STORAGE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSubCategory}
                disabled={adding || !newSubName.trim() || !newSubGroupCode.trim() || !newSubCategoryId}
                className="admin-btn admin-btn-primary"
              >
                <Plus size={17} /> {adding ? 'Adding…' : 'Add Subcategory'}
              </button>
            </div>
          </>
        )}
      </section>

      <section className="glass-panel admin-categories-controls">
        <div className="admin-categories-search">
          <Search size={18} aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setSelectedIds(new Set())
            }}
            placeholder={tab === MAIN_TAB ? 'Search main categories or ID…' : 'Search subcategories, main category, group code, storage type or ID…'}
            aria-label={`Search ${currentTabTitle}`}
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="admin-categories-filters" aria-label="Status filter">
          {STATUS_FILTERS.map((filter) => {
            const label = filter === 'all'
              ? `All (${counts.available})`
              : filter === 'active'
                ? `Active (${counts.active})`
                : filter === 'hidden'
                  ? `Hidden (${counts.hidden})`
                  : `Deleted (${counts.deleted})`
            return (
              <button
                key={filter}
                type="button"
                className={statusFilter === filter ? 'is-active' : ''}
                onClick={() => changeFilter(filter)}
              >
                {label}
              </button>
            )
          })}
        </div>
        <span className="admin-categories-matching">{filteredRows.length.toLocaleString()} matching</span>
      </section>

      {selectedIds.size > 0 && (
        <section className="admin-categories-bulk">
          <div>
            <strong>{selectedIds.size.toLocaleString()} selected</strong>
            <span>Bulk actions apply only to the selected {tab === MAIN_TAB ? 'main categories' : 'subcategories'}.</span>
          </div>
          <div className="admin-categories-bulk__actions">
            {statusFilter !== 'deleted' ? (
              <>
                <button type="button" className="is-show" disabled={bulkBusy} onClick={() => requestBulkAction('show')}>
                  <Eye size={16} /> Show
                </button>
                <button type="button" className="is-hide" disabled={bulkBusy} onClick={() => requestBulkAction('hide')}>
                  <EyeOff size={16} /> Hide
                </button>
                <button type="button" className="is-delete" disabled={bulkBusy} onClick={() => requestBulkAction('delete')}>
                  <Trash2 size={16} /> Delete
                </button>
              </>
            ) : (
              <>
                <button type="button" className="is-show" disabled={bulkBusy} onClick={() => requestBulkAction('restore')}>
                  <RotateCcw size={16} /> Restore
                </button>
                <button type="button" className="is-delete" disabled={bulkBusy} onClick={() => requestBulkAction('permanent-delete')}>
                  <Trash2 size={16} /> Delete Permanently
                </button>
              </>
            )}
            <button type="button" className="is-clear" disabled={bulkBusy} onClick={() => setSelectedIds(new Set())}>
              <X size={16} /> Clear
            </button>
          </div>
        </section>
      )}

      <section className="glass-panel admin-categories-table-wrap">
        {loading ? (
          <div className="admin-categories-state">Loading {currentTabTitle.toLowerCase()}…</div>
        ) : filteredRows.length === 0 ? (
          <div className="admin-categories-state">
            <strong>No {currentTabTitle.toLowerCase()} found</strong>
            <span>Try another search or status filter.</span>
          </div>
        ) : (
          <table className="admin-categories-table">
            <thead>
              <tr>
                <th className="is-check">
                  <label className="admin-categories-checkbox">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAll}
                      aria-label={`Select all matching ${currentTabTitle}`}
                    />
                    <span><Check size={13} /></span>
                  </label>
                </th>
                {tab === MAIN_TAB ? (
                  <>
                    <th>Category Name</th>
                    <th>Image</th>
                    <th>Products</th>
                    <th>Subcategories</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </>
                ) : (
                  <>
                    <th>Subcategory</th>
                    <th>Main Category</th>
                    <th>Group Code</th>
                    <th>Storage Type</th>
                    <th>Products</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const checked = selectedIds.has(Number(row.id))
                const imageBusy = Number(imageBusyId) === Number(row.id)
                const storageBusy = Number(storageBusyId) === Number(row.id)
                const busy = Number(rowBusyId) === Number(row.id) || imageBusy || storageBusy
                const deleted = isDeleted(row)
                const imageUrl = tab === MAIN_TAB ? categoryImageUrl(row) : ''
                const parentDeleted = tab === SUB_TAB && isDeleted(row.category)
                const parentHidden = tab === SUB_TAB && !parentDeleted && row.category && !asBool(row.category.status)

                return (
                  <tr key={row.id} className={checked ? 'is-selected' : ''}>
                    <td className="is-check">
                      <label className="admin-categories-checkbox">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelected(row.id)}
                          aria-label={`Select ${rowName(tab, row)}`}
                        />
                        <span><Check size={13} /></span>
                      </label>
                    </td>

                    {tab === MAIN_TAB ? (
                      <>
                        <td className="admin-categories-name-cell">
                          {editingId === row.id ? (
                            <MainCategoryEdit
                              row={row}
                              busy={busy}
                              onCancel={() => setEditingId(null)}
                              onSave={(data) => saveRow(row, data)}
                            />
                          ) : (
                            <div className="admin-categories-name">
                              <strong>{row.category_name}</strong>
                              <small>Category ID #{row.id}</small>
                            </div>
                          )}
                        </td>
                        <td className="admin-categories-image-cell">
                          <div className="admin-categories-image-manager">
                            <div className="admin-categories-image-preview">
                              {imageUrl ? (
                                <img src={imageUrl} alt={`${row.category_name} category`} loading="lazy" />
                              ) : (
                                <span><ImageIcon size={18} /> No image</span>
                              )}
                            </div>
                            {!deleted && (
                              <label
                                className={`admin-categories-image-upload ${imageBusy ? 'is-busy' : ''}`}
                                title={imageUrl ? 'Change category image' : 'Upload category image'}
                              >
                                <Upload size={14} />
                                <span>{imageBusy ? 'Uploading…' : imageUrl ? 'Change' : 'Upload'}</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                                  disabled={busy}
                                  onChange={(event) => {
                                    const file = event.target.files?.[0] || null
                                    event.target.value = ''
                                    if (file) changeMainCategoryImage(row, file)
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </td>
                        <td><span className="admin-categories-number">{Number(row.products_count ?? 0).toLocaleString()}</span></td>
                        <td><span className="admin-categories-number">{Number(row.sub_categories_count ?? 0).toLocaleString()}</span></td>
                      </>
                    ) : (
                      <>
                        <td className="admin-categories-name-cell">
                          {editingId === row.id ? (
                            <SubCategoryEdit
                              row={row}
                              categories={categories}
                              busy={busy}
                              onCancel={() => setEditingId(null)}
                              onSave={(data) => saveRow(row, data)}
                            />
                          ) : (
                            <div className="admin-categories-name">
                              <strong>{row.sub_category_name}</strong>
                              <small>Subcategory ID #{row.id}</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="admin-categories-parent">
                            <strong>{row.category?.category_name || `Category #${row.category_id}`}</strong>
                            {parentDeleted && <small className="is-warning">Parent deleted</small>}
                            {parentHidden && <small className="is-warning">Parent hidden</small>}
                          </div>
                        </td>
                        <td><code className="admin-categories-code">{row.group_code || '—'}</code></td>
                        <td>
                          <select
                            className={`admin-categories-storage-select ${
                              row.storage_type
                                ? `is-${String(row.storage_type).toLowerCase()}`
                                : 'is-unmapped'
                            }`}
                            value={row.storage_type || ''}
                            disabled={storageBusy || deleted}
                            onChange={(event) => changeSubCategoryStorage(row, event.target.value)}
                            aria-label={`Storage type for ${row.sub_category_name}`}
                            title={
                              deleted
                                ? 'Restore this subcategory before changing its storage type.'
                                : `Stored in storage_group_mapping for ${row.group_code}. Changing this also updates linked products.`
                            }
                          >
                            {!row.storage_type && <option value="" disabled>Not mapped</option>}
                            {STORAGE_TYPES.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </td>
                        <td><span className="admin-categories-number">{Number(row.products_count ?? 0).toLocaleString()}</span></td>
                      </>
                    )}

                    {tab === MAIN_TAB && (
                      <td>
                        <span className={`admin-categories-status ${deleted ? 'is-deleted' : asBool(row.status) ? 'is-active' : 'is-hidden'}`}>
                          {statusLabel(row)}
                        </span>
                      </td>
                    )}

                    <td>
                      <div className="admin-categories-actions">
                        {!deleted ? (
                          <>
                            {editingId !== row.id && (
                              <button
                                type="button"
                                className="is-edit"
                                disabled={busy}
                                onClick={() => setEditingId(row.id)}
                                title={`Edit ${tab === MAIN_TAB ? 'category' : 'subcategory'}`}
                              >
                                <Edit2 size={16} />
                              </button>
                            )}
                            <button
                              type="button"
                              className={asBool(row.status) ? 'is-hide' : 'is-show'}
                              disabled={busy}
                              onClick={() => requestAction(row, asBool(row.status) ? 'hide' : 'show')}
                              title={asBool(row.status) ? 'Hide' : 'Show'}
                            >
                              {asBool(row.status) ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              type="button"
                              className="is-delete"
                              disabled={busy}
                              onClick={() => requestAction(row, 'delete')}
                              title="Move to Deleted"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="is-show"
                              disabled={busy}
                              onClick={() => requestAction(row, 'restore')}
                              title="Restore"
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              type="button"
                              className="is-delete"
                              disabled={
                                busy
                                || Number(row.products_count ?? 0) > 0
                                || (tab === MAIN_TAB && Number(row.sub_categories_count ?? 0) > 0)
                              }
                              onClick={() => requestAction(row, 'permanent-delete')}
                              title={
                                Number(row.products_count ?? 0) > 0
                                  ? 'Permanent delete is blocked while products use this record'
                                  : tab === MAIN_TAB && Number(row.sub_categories_count ?? 0) > 0
                                    ? 'Permanent delete is blocked while subcategories belong to this main category'
                                    : 'Delete permanently'
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
