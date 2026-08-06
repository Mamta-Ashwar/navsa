// import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import {
//   deletePdf,
//   getPdfs,
//   reorderPdfs,
//   updatePdf,
//   uploadPdf,
// } from '../../services/adminApi'
// import {
//   Eye,
//   GripVertical,
//   Pencil,
//   Plus,
//   Save,
//   Trash2,
//   Upload,
//   X,
// } from 'lucide-react'
// import AdminBanners from './AdminBanners'

// const EMPTY_FORM = {
//   title: '',
//   type: 'deal',
//   badge: '',
//   valid_from: '',
//   valid_to: '',
//   validity_text: '',
//   description: '',
//   is_active: true,
//   file: null,
// }

// const TABS = [
//   { key: 'deal', label: 'Deals & Promotion PDFs' },
//   { key: 'banner', label: 'Banners' },
//   { key: 'other', label: 'Other Documents' },
// ]

// const COLORS = {
//   heading: '#f8fafc',
//   label: '#dbeafe',
//   muted: '#a8b7cc',
//   body: '#e8eef7',
//   link: '#60a5fa',
//   danger: '#fb7185',
// }

// function safeText(value) {
//   return typeof value === 'string' ? value : ''
// }

// function normaliseForm(source = {}) {
//   return {
//     ...EMPTY_FORM,
//     ...source,
//     title: safeText(source.title),
//     type: safeText(source.type) || 'deal',
//     badge: safeText(source.badge),
//     valid_from: safeText(source.valid_from),
//     valid_to: safeText(source.valid_to),
//     validity_text: safeText(source.validity_text),
//     description: safeText(source.description),
//     is_active: source.is_active !== false,
//     file: null,
//   }
// }

// function fileUrl(pdf) {
//   if (pdf.file_url) return pdf.file_url
//   const apiBase = import.meta.env.VITE_API_URL || ''
//   const siteBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase
//   return `${siteBase || ''}/storage/${pdf.file_path}`
// }

// function formatDate(value) {
//   if (!value) return ''
//   const date = new Date(`${value}T00:00:00`)
//   if (Number.isNaN(date.getTime())) return value
//   return new Intl.DateTimeFormat('en-GB').format(date)
// }

// function moveItem(items, fromIndex, toIndex) {
//   const next = [...items]
//   const [moved] = next.splice(fromIndex, 1)
//   next.splice(toIndex, 0, moved)
//   return next
// }

// function PdfForm({ initial, activeDealCount, onCancel, onSaved }) {
//   const [form, setForm] = useState(() => normaliseForm(initial))
//   const [busy, setBusy] = useState(false)
//   const fileInputRef = useRef(null)
//   const editing = Boolean(initial?.id)

//   const set = (key, value) => {
//     setForm((current) => ({ ...current, [key]: value }))
//   }

//   const submit = async (event) => {
//     event.preventDefault()

//     const title = safeText(form.title).trim()
//     const badge = safeText(form.badge).trim()
//     const validityText = safeText(form.validity_text).trim()
//     const description = safeText(form.description).trim()

//     if (!title) {
//       alert('Please enter the title.')
//       return
//     }

//     if (!editing && !form.file) {
//       alert('Please choose a PDF file.')
//       return
//     }

//     if (form.valid_from && form.valid_to && form.valid_to < form.valid_from) {
//       alert('Valid To cannot be earlier than Valid From.')
//       return
//     }

//     if (
//       form.type === 'deal'
//       && form.is_active
//       && !initial?.is_active
//       && activeDealCount >= 4
//     ) {
//       alert('Only four deal PDFs can be active at the same time.')
//       return
//     }

//     setBusy(true)

//     try {
//       const payload = new FormData()
//       payload.append('title', title)
//       payload.append('type', form.type || 'deal')
//       payload.append('badge', badge)
//       payload.append('valid_from', form.valid_from || '')
//       payload.append('valid_to', form.valid_to || '')
//       payload.append('validity_text', validityText)
//       payload.append('description', description)
//       payload.append('is_active', form.is_active ? '1' : '0')
//       if (form.file) payload.append('file', form.file)

//       if (editing) {
//         await updatePdf(initial.id, payload)
//       } else {
//         await uploadPdf(payload)
//       }

//       await onSaved()
//     } catch (error) {
//       alert(error?.message || 'Unable to save PDF.')
//     } finally {
//       setBusy(false)
//     }
//   }

//   const labelStyle = {
//     display: 'block',
//     marginBottom: '7px',
//     color: COLORS.label,
//     fontWeight: 700,
//     fontSize: '13px',
//   }

//   return (
//     <form
//       onSubmit={submit}
//       className="glass-panel"
//       style={{ padding: '24px', marginBottom: '22px', color: COLORS.body }}
//     >
//       <div className="admin-flex-between" style={{ marginBottom: '18px' }}>
//         <div>
//           <h3 style={{ margin: 0, color: COLORS.heading }}>
//             {editing ? 'Edit PDF' : 'Add PDF'}
//           </h3>
//           <p style={{ color: COLORS.muted, margin: '5px 0 0' }}>
//             {form.type === 'deal'
//               ? 'Save the catalogue details here. Change its position by dragging the row after saving.'
//               : 'Upload and manage downloadable documents.'}
//           </p>
//         </div>

//         <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">
//           <X size={17} /> Close
//         </button>
//       </div>

//       <div
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
//           gap: '14px',
//         }}
//       >
//         <label>
//           <span style={labelStyle}>Document type</span>
//           <select
//             className="admin-input-field"
//             value={form.type}
//             onChange={(event) => set('type', event.target.value)}
//             style={{ width: '100%', color: COLORS.heading }}
//           >
//             <option value="deal">Deal / Promotion PDF</option>
//             <option value="other">Other Document</option>
//           </select>
//         </label>

//         <label>
//           <span style={labelStyle}>Title</span>
//           <input
//             className="admin-input-field"
//             value={form.title}
//             onChange={(event) => set('title', event.target.value)}
//             placeholder="NAVSA P10"
//             maxLength={255}
//             style={{ width: '100%', color: COLORS.heading }}
//           />
//         </label>

//         {form.type === 'deal' && (
//           <>
//             <label>
//               <span style={labelStyle}>Badge</span>
//               <input
//                 className="admin-input-field"
//                 value={form.badge}
//                 onChange={(event) => set('badge', event.target.value)}
//                 placeholder="LATEST, NEW, CHRISTMAS"
//                 maxLength={50}
//                 style={{ width: '100%', color: COLORS.heading }}
//               />
//             </label>

//             <div
//               style={{
//                 alignSelf: 'end',
//                 minHeight: '46px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '0 14px',
//                 border: '1px dashed rgba(96,165,250,.45)',
//                 borderRadius: '10px',
//                 color: COLORS.muted,
//                 fontSize: '13px',
//               }}
//             >
//               Order is controlled by dragging the catalogue rows.
//             </div>

//             <label>
//               <span style={labelStyle}>Valid from</span>
//               <input
//                 type="date"
//                 className="admin-input-field"
//                 value={form.valid_from}
//                 onChange={(event) => set('valid_from', event.target.value)}
//                 style={{ width: '100%', color: COLORS.heading, colorScheme: 'dark' }}
//               />
//             </label>

//             <label>
//               <span style={labelStyle}>Valid to</span>
//               <input
//                 type="date"
//                 className="admin-input-field"
//                 value={form.valid_to}
//                 onChange={(event) => set('valid_to', event.target.value)}
//                 style={{ width: '100%', color: COLORS.heading, colorScheme: 'dark' }}
//               />
//             </label>

//             <label style={{ gridColumn: '1 / -1' }}>
//               <span style={labelStyle}>Validity text override</span>
//               <input
//                 className="admin-input-field"
//                 value={form.validity_text}
//                 onChange={(event) => set('validity_text', event.target.value)}
//                 placeholder="Seasonal Specials — leave blank to show the dates"
//                 maxLength={255}
//                 style={{ width: '100%', color: COLORS.heading }}
//               />
//             </label>

//             <label style={{ gridColumn: '1 / -1' }}>
//               <span style={labelStyle}>Frontend description</span>
//               <textarea
//                 className="admin-input-field"
//                 value={form.description}
//                 onChange={(event) => set('description', event.target.value)}
//                 placeholder="Monthly impulse promotions with all the top UK brands..."
//                 maxLength={2000}
//                 rows={4}
//                 style={{ width: '100%', resize: 'vertical', color: COLORS.heading }}
//               />
//             </label>
//           </>
//         )}

//         <label style={{ gridColumn: '1 / -1' }}>
//           <span style={labelStyle}>{editing ? 'Replace PDF (optional)' : 'PDF file'}</span>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="application/pdf,.pdf"
//             className="admin-input-field"
//             onChange={(event) => set('file', event.target.files?.[0] || null)}
//             style={{ width: '100%', color: COLORS.body }}
//           />
//         </label>

//         {form.type === 'deal' && (
//           <label
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '10px',
//               gridColumn: '1 / -1',
//               color: COLORS.body,
//               fontWeight: 600,
//             }}
//           >
//             <input
//               type="checkbox"
//               checked={Boolean(form.is_active)}
//               onChange={(event) => set('is_active', event.target.checked)}
//             />
//             <span>Show this deal on the public website</span>
//           </label>
//         )}
//       </div>

//       <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
//         <button type="submit" disabled={busy} className="admin-btn admin-btn-primary">
//           {editing ? <Save size={17} /> : <Upload size={17} />}
//           {busy ? 'Saving...' : editing ? 'Save Changes' : 'Upload PDF'}
//         </button>
//         <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">
//           Cancel
//         </button>
//       </div>
//     </form>
//   )
// }

// export default function AdminPdfs() {
//   const [pdfs, setPdfs] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [tab, setTab] = useState('deal')
//   const [editing, setEditing] = useState(null)
//   const [showForm, setShowForm] = useState(false)
//   const [draggedId, setDraggedId] = useState(null)
//   const [dragOverId, setDragOverId] = useState(null)
//   const [savingOrder, setSavingOrder] = useState(false)

//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const result = await getPdfs()
//       setPdfs(Array.isArray(result) ? result : [])
//     } catch (error) {
//       alert(error?.message || 'Unable to load PDFs.')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     load()
//   }, [load])

//   const displayed = useMemo(() => {
//     const items = pdfs.filter((pdf) => pdf.type === tab)
//     if (tab === 'deal') {
//       return [...items].sort(
//         (a, b) => Number(a.sort_order) - Number(b.sort_order) || Number(a.id) - Number(b.id),
//       )
//     }
//     return items
//   }, [pdfs, tab])

//   const activeDealCount = useMemo(
//     () => pdfs.filter((pdf) => pdf.type === 'deal' && pdf.is_active).length,
//     [pdfs],
//   )

//   const openCreate = () => {
//     setEditing(null)
//     setShowForm(true)
//   }

//   const openEdit = (pdf) => {
//     setEditing(normaliseForm(pdf))
//     setShowForm(true)
//   }

//   const closeForm = () => {
//     setEditing(null)
//     setShowForm(false)
//   }

//   const saved = async () => {
//     closeForm()
//     await load()
//   }

//   const remove = async (pdf) => {
//     if (!confirm(`Delete “${pdf.title}”? This also deletes the uploaded PDF file.`)) return
//     try {
//       await deletePdf(pdf.id)
//       await load()
//     } catch (error) {
//       alert(error?.message || 'Unable to delete PDF.')
//     }
//   }

//   const saveDraggedOrder = async (fromId, toId) => {
//     if (savingOrder || fromId === toId) return

//     const orderedDeals = [...displayed]
//     const fromIndex = orderedDeals.findIndex((pdf) => Number(pdf.id) === Number(fromId))
//     const toIndex = orderedDeals.findIndex((pdf) => Number(pdf.id) === Number(toId))
//     if (fromIndex < 0 || toIndex < 0) return

//     const reordered = moveItem(orderedDeals, fromIndex, toIndex).map((pdf, index) => ({
//       ...pdf,
//       sort_order: index + 1,
//     }))

//     const previous = pdfs
//     const orderById = new Map(reordered.map((pdf) => [Number(pdf.id), pdf.sort_order]))
//     setPdfs((current) => current.map((pdf) => (
//       orderById.has(Number(pdf.id))
//         ? { ...pdf, sort_order: orderById.get(Number(pdf.id)) }
//         : pdf
//     )))
//     setSavingOrder(true)

//     try {
//       const response = await reorderPdfs(reordered.map((pdf) => Number(pdf.id)))
//       if (Array.isArray(response?.pdfs)) {
//         const updated = new Map(response.pdfs.map((pdf) => [Number(pdf.id), pdf]))
//         setPdfs((current) => current.map((pdf) => updated.get(Number(pdf.id)) || pdf))
//       } else {
//         await load()
//       }
//     } catch (error) {
//       setPdfs(previous)
//       alert(error?.message || 'Unable to save catalogue order.')
//     } finally {
//       setSavingOrder(false)
//       setDraggedId(null)
//       setDragOverId(null)
//     }
//   }

//   return (
//     <div style={{ color: COLORS.body }}>
//       <div className="admin-flex-between mb-6">
//         <div>
//           <h1 style={{ marginBottom: '0.25rem', color: COLORS.heading }}>PDFs & Banners</h1>
//           <p style={{ color: COLORS.muted }}>
//             Manage deal brochures, homepage banners and other documents without changing website code.
//           </p>
//         </div>
//         {tab !== 'banner' && (
//           <button onClick={openCreate} className="admin-btn admin-btn-primary">
//             <Plus size={18} /> Add PDF
//           </button>
//         )}
//       </div>

//       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
//         {TABS.map((item) => (
//           <button
//             key={item.key}
//             type="button"
//             onClick={() => {
//               setTab(item.key)
//               closeForm()
//             }}
//             className={`admin-btn ${tab === item.key ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
//           >
//             {item.label}
//           </button>
//         ))}
//       </div>

//       {tab !== 'banner' && showForm && (
//         <PdfForm
//           key={editing?.id || `new-${tab}`}
//           initial={editing || { ...EMPTY_FORM, type: tab }}
//           activeDealCount={activeDealCount}
//           onCancel={closeForm}
//           onSaved={saved}
//         />
//       )}

//       {tab === 'banner' ? (
//         <AdminBanners />
//       ) : (
//         <>
//       {tab === 'deal' && (
//         <div
//           className="glass-panel"
//           style={{
//             padding: '16px',
//             marginBottom: '20px',
//             border: '1px solid rgba(59,130,246,0.35)',
//             color: COLORS.body,
//           }}
//         >
//           <strong style={{ color: COLORS.heading }}>
//             Public website deals: {activeDealCount}/4 active
//           </strong>
//           <p style={{ color: COLORS.muted, margin: '6px 0 0' }}>
//             Hold the grip icon and drag a row up or down. Positions are saved automatically as 1, 2, 3… with no duplicates.
//           </p>
//           {savingOrder && (
//             <div style={{ color: '#93c5fd', marginTop: '8px', fontWeight: 700 }}>
//               Saving catalogue order…
//             </div>
//           )}
//         </div>
//       )}

//       <div className="glass-panel" style={{ padding: '1.5rem', color: COLORS.body }}>
//         {loading ? (
//           <div style={{ color: COLORS.muted, padding: '40px', textAlign: 'center' }}>
//             Loading PDFs…
//           </div>
//         ) : displayed.length === 0 ? (
//           <div style={{ color: COLORS.muted, padding: '40px', textAlign: 'center' }}>
//             No documents found in this section.
//           </div>
//         ) : (
//           <div className="admin-table-container">
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   {tab === 'deal' && <th style={{ width: '54px' }}>Move</th>}
//                   <th>Title</th>
//                   {tab === 'deal' && <th>Badge</th>}
//                   {tab === 'deal' && <th>Validity</th>}
//                   {tab === 'deal' && <th>Order</th>}
//                   {tab === 'deal' && <th>Website</th>}
//                   <th>PDF</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {displayed.map((pdf) => {
//                   const validity = pdf.validity_text
//                     || (pdf.valid_from && pdf.valid_to
//                       ? `${formatDate(pdf.valid_from)} to ${formatDate(pdf.valid_to)}`
//                       : '—')
//                   const isDragging = Number(draggedId) === Number(pdf.id)
//                   const isDragOver = Number(dragOverId) === Number(pdf.id)

//                   return (
//                     <tr
//                       key={pdf.id}
//                       draggable={tab === 'deal' && !savingOrder}
//                       onDragStart={(event) => {
//                         if (tab !== 'deal' || savingOrder) return
//                         setDraggedId(pdf.id)
//                         event.dataTransfer.effectAllowed = 'move'
//                         event.dataTransfer.setData('text/plain', String(pdf.id))
//                       }}
//                       onDragEnter={(event) => {
//                         if (tab !== 'deal' || savingOrder) return
//                         event.preventDefault()
//                         setDragOverId(pdf.id)
//                       }}
//                       onDragOver={(event) => {
//                         if (tab !== 'deal' || savingOrder) return
//                         event.preventDefault()
//                         event.dataTransfer.dropEffect = 'move'
//                       }}
//                       onDrop={(event) => {
//                         if (tab !== 'deal' || savingOrder) return
//                         event.preventDefault()
//                         const fromId = Number(event.dataTransfer.getData('text/plain') || draggedId)
//                         saveDraggedOrder(fromId, pdf.id)
//                       }}
//                       onDragEnd={() => {
//                         setDraggedId(null)
//                         setDragOverId(null)
//                       }}
//                       style={{
//                         opacity: isDragging ? 0.5 : 1,
//                         outline: isDragOver && !isDragging ? '2px solid #3b82f6' : 'none',
//                         outlineOffset: '-2px',
//                         transition: 'opacity .15s ease, outline .15s ease',
//                       }}
//                     >
//                       {tab === 'deal' && (
//                         <td>
//                           <button
//                             type="button"
//                             className="admin-btn admin-btn-ghost"
//                             title="Hold and drag to reorder"
//                             aria-label={`Move ${pdf.title}`}
//                             style={{ cursor: savingOrder ? 'wait' : 'grab', padding: '8px' }}
//                             disabled={savingOrder}
//                           >
//                             <GripVertical size={18} />
//                           </button>
//                         </td>
//                       )}

//                       <td>
//                         <div style={{ fontWeight: 700, color: COLORS.heading }}>{pdf.title}</div>
//                         {pdf.description && (
//                           <div style={{ color: COLORS.muted, fontSize: '12px', marginTop: '4px', maxWidth: '420px' }}>
//                             {pdf.description}
//                           </div>
//                         )}
//                       </td>

//                       {tab === 'deal' && <td style={{ color: COLORS.body }}>{pdf.badge || 'PROMOTION'}</td>}
//                       {tab === 'deal' && <td style={{ color: COLORS.body }}>{validity}</td>}
//                       {tab === 'deal' && (
//                         <td>
//                           <span
//                             style={{
//                               display: 'inline-grid',
//                               placeItems: 'center',
//                               width: '32px',
//                               height: '32px',
//                               borderRadius: '50%',
//                               background: 'rgba(59,130,246,.16)',
//                               color: '#bfdbfe',
//                               fontWeight: 800,
//                             }}
//                           >
//                             {pdf.sort_order}
//                           </span>
//                         </td>
//                       )}
//                       {tab === 'deal' && (
//                         <td>
//                           <span className={`admin-badge ${pdf.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
//                             {pdf.is_active ? 'Visible' : 'Hidden'}
//                           </span>
//                         </td>
//                       )}

//                       <td>
//                         <a
//                           href={fileUrl(pdf)}
//                           target="_blank"
//                           rel="noreferrer"
//                           style={{ color: COLORS.link, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
//                         >
//                           <Eye size={16} /> View
//                         </a>
//                       </td>

//                       <td>
//                         <div style={{ display: 'flex', gap: '6px' }}>
//                           <button type="button" onClick={() => openEdit(pdf)} className="admin-btn admin-btn-ghost" title="Edit">
//                             <Pencil size={16} />
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => remove(pdf)}
//                             className="admin-btn admin-btn-ghost"
//                             style={{ color: COLORS.danger }}
//                             title="Delete"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//         </>
//       )}
//     </div>
//   )
// }

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  deletePdf,
  getPdfs,
  reorderPdfs,
  updatePdf,
  uploadPdf,
} from '../../services/adminApi'
import {
  Eye,
  GripVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import AdminBanners from './AdminBanners'

const EMPTY_FORM = {
  title: '',
  type: 'deal',
  badge: '',
  valid_from: '',
  valid_to: '',
  validity_text: '',
  description: '',
  is_active: true,
  file: null,
}

const TABS = [
  { key: 'deal', label: 'Deals & Promotion PDFs' },
  { key: 'banner', label: 'Banners' },
  { key: 'deal', label: 'Deals & Promotion' },
  { key: 'banner', label: 'Banner' },
  { key: 'other', label: 'Other Documents' },
  { key: 'upcoming', label: 'Upcoming' },
]

const COLORS = {
  heading: '#f8fafc',
  label: '#dbeafe',
  muted: '#a8b7cc',
  body: '#e8eef7',
  link: '#60a5fa',
  danger: '#fb7185',
}

function safeText(value) {
  return typeof value === 'string' ? value : ''
}

function normaliseForm(source = {}) {
  return {
    ...EMPTY_FORM,
    ...source,
    title: safeText(source.title),
    type: safeText(source.type) || 'deal',
    badge: safeText(source.badge),
    valid_from: safeText(source.valid_from),
    valid_to: safeText(source.valid_to),
    validity_text: safeText(source.validity_text),
    description: safeText(source.description),
    is_active: source.is_active !== false,
    file: null,
  }
}

function fileUrl(pdf) {
  if (pdf.file_url) return pdf.file_url
  const apiBase = import.meta.env.VITE_API_URL || ''
  const siteBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase
  return `${siteBase || ''}/storage/${pdf.file_path}`
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB').format(date)
}

function moveItem(items, fromIndex, toIndex) {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

function PdfForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(() => normaliseForm(initial))
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef(null)
  const editing = Boolean(initial?.id)

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()

    const title = safeText(form.title).trim()
    const badge = safeText(form.badge).trim()
    const validityText = safeText(form.validity_text).trim()
    const description = safeText(form.description).trim()

    if (!title) {
      alert('Please enter the title.')
      return
    }

    if (!editing && !form.file) {
      alert('Please choose a PDF file.')
      return
    }

    if (form.valid_from && form.valid_to && form.valid_to < form.valid_from) {
      alert('Valid To cannot be earlier than Valid From.')
      return
    }

    setBusy(true)

    try {
      const payload = new FormData()
      payload.append('title', title)
      payload.append('type', form.type || 'deal')
      payload.append('badge', badge)
      payload.append('valid_from', form.valid_from || '')
      payload.append('valid_to', form.valid_to || '')
      payload.append('validity_text', validityText)
      payload.append('description', description)
      payload.append('is_active', form.is_active ? '1' : '0')
      if (form.file) payload.append('file', form.file)

      if (editing) {
        await updatePdf(initial.id, payload)
      } else {
        await uploadPdf(payload)
      }

      await onSaved()
    } catch (error) {
      alert(error?.message || 'Unable to save PDF.')
    } finally {
      setBusy(false)
    }
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '7px',
    color: COLORS.label,
    fontWeight: 700,
    fontSize: '13px',
  }

  return (
    <form
      onSubmit={submit}
      className="glass-panel"
      style={{ padding: '24px', marginBottom: '22px', color: COLORS.body }}
    >
      <div className="admin-flex-between" style={{ marginBottom: '18px' }}>
        <div>
          <h3 style={{ margin: 0, color: COLORS.heading }}>
            {editing ? 'Edit PDF' : 'Add PDF'}
          </h3>
          <p style={{ color: COLORS.muted, margin: '5px 0 0' }}>
            {form.type === 'deal'
              ? 'Save the catalogue details here. Change its position by dragging the row after saving.'
              : 'Upload and manage downloadable documents.'}
          </p>
        </div>

        <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">
          <X size={17} /> Close
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '14px',
        }}
      >
        <label>
          <span style={labelStyle}>Document type</span>
          <select
            className="admin-input-field"
            value={form.type}
            onChange={(event) => set('type', event.target.value)}
            style={{ width: '100%', color: COLORS.heading }}
          >
            <option value="deal">Deal / Promotion PDF</option>
            <option value="other">Other Document</option>
            <option value="deal">Deals & Promotion</option>
            <option value="banner">Banner</option>
            <option value="other">Other Documents</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </label>

        <label>
          <span style={labelStyle}>Title</span>
          <input
            className="admin-input-field"
            value={form.title}
            onChange={(event) => set('title', event.target.value)}
            placeholder="NAVSA P10"
            maxLength={255}
            style={{ width: '100%', color: COLORS.heading }}
          />
        </label>

        {form.type === 'deal' && (
          <>
            <label>
              <span style={labelStyle}>Badge</span>
              <input
                className="admin-input-field"
                value={form.badge}
                onChange={(event) => set('badge', event.target.value)}
                placeholder="LATEST, NEW, CHRISTMAS"
                maxLength={50}
                style={{ width: '100%', color: COLORS.heading }}
              />
            </label>

            <div
              style={{
                alignSelf: 'end',
                minHeight: '46px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
                border: '1px dashed rgba(96,165,250,.45)',
                borderRadius: '10px',
                color: COLORS.muted,
                fontSize: '13px',
              }}
            >
              Order is controlled by dragging the catalogue rows.
            </div>

            <label>
              <span style={labelStyle}>Valid from</span>
              <input
                type="date"
                className="admin-input-field"
                value={form.valid_from}
                onChange={(event) => set('valid_from', event.target.value)}
                style={{ width: '100%', color: COLORS.heading, colorScheme: 'dark' }}
              />
            </label>

            <label>
              <span style={labelStyle}>Valid to</span>
              <input
                type="date"
                className="admin-input-field"
                value={form.valid_to}
                onChange={(event) => set('valid_to', event.target.value)}
                style={{ width: '100%', color: COLORS.heading, colorScheme: 'dark' }}
              />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Validity text override</span>
              <input
                className="admin-input-field"
                value={form.validity_text}
                onChange={(event) => set('validity_text', event.target.value)}
                placeholder="Seasonal Specials — leave blank to show the dates"
                maxLength={255}
                style={{ width: '100%', color: COLORS.heading }}
              />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              <span style={labelStyle}>Frontend description</span>
              <textarea
                className="admin-input-field"
                value={form.description}
                onChange={(event) => set('description', event.target.value)}
                placeholder="Monthly impulse promotions with all the top UK brands..."
                maxLength={2000}
                rows={4}
                style={{ width: '100%', resize: 'vertical', color: COLORS.heading }}
              />
            </label>
          </>
        )}

        <label style={{ gridColumn: '1 / -1' }}>
          <span style={labelStyle}>{editing ? 'Replace PDF (optional)' : 'PDF file'}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="admin-input-field"
            onChange={(event) => set('file', event.target.files?.[0] || null)}
            style={{ width: '100%', color: COLORS.body }}
          />
        </label>

        {form.type === 'deal' && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              gridColumn: '1 / -1',
              color: COLORS.body,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={Boolean(form.is_active)}
              onChange={(event) => set('is_active', event.target.checked)}
            />
            <span>Show this deal on the public website</span>
          </label>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" disabled={busy} className="admin-btn admin-btn-primary">
          {editing ? <Save size={17} /> : <Upload size={17} />}
          {busy ? 'Saving...' : editing ? 'Save Changes' : 'Upload PDF'}
        </button>
        <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminPdfs() {
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('deal')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [savingOrder, setSavingOrder] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPdfs()
      setPdfs(Array.isArray(result) ? result : [])
    } catch (error) {
      alert(error?.message || 'Unable to load PDFs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const displayed = useMemo(() => {
    const items = pdfs.filter((pdf) => pdf.type === tab)
    if (tab === 'deal') {
      return [...items].sort(
        (a, b) => Number(a.sort_order) - Number(b.sort_order) || Number(a.id) - Number(b.id),
      )
    }
    return items
  }, [pdfs, tab])

  const activeDealCount = useMemo(
    () => pdfs.filter((pdf) => pdf.type === 'deal' && pdf.is_active).length,
    [pdfs],
  )

  const openCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (pdf) => {
    setEditing(normaliseForm(pdf))
    setShowForm(true)
  }

  const closeForm = () => {
    setEditing(null)
    setShowForm(false)
  }

  const saved = async () => {
    closeForm()
    await load()
  }

  const remove = async (pdf) => {
    if (!confirm(`Delete “${pdf.title}”? This also deletes the uploaded PDF file.`)) return
    try {
      await deletePdf(pdf.id)
      await load()
    } catch (error) {
      alert(error?.message || 'Unable to delete PDF.')
    }
  }

  const saveDraggedOrder = async (fromId, toId) => {
    if (savingOrder || fromId === toId) return

    const orderedDeals = [...displayed]
    const fromIndex = orderedDeals.findIndex((pdf) => Number(pdf.id) === Number(fromId))
    const toIndex = orderedDeals.findIndex((pdf) => Number(pdf.id) === Number(toId))
    if (fromIndex < 0 || toIndex < 0) return

    const reordered = moveItem(orderedDeals, fromIndex, toIndex).map((pdf, index) => ({
      ...pdf,
      sort_order: index + 1,
    }))

    const previous = pdfs
    const orderById = new Map(reordered.map((pdf) => [Number(pdf.id), pdf.sort_order]))
    setPdfs((current) => current.map((pdf) => (
      orderById.has(Number(pdf.id))
        ? { ...pdf, sort_order: orderById.get(Number(pdf.id)) }
        : pdf
    )))
    setSavingOrder(true)

    try {
      const response = await reorderPdfs(reordered.map((pdf) => Number(pdf.id)))
      if (Array.isArray(response?.pdfs)) {
        const updated = new Map(response.pdfs.map((pdf) => [Number(pdf.id), pdf]))
        setPdfs((current) => current.map((pdf) => updated.get(Number(pdf.id)) || pdf))
      } else {
        await load()
      }
    } catch (error) {
      setPdfs(previous)
      alert(error?.message || 'Unable to save catalogue order.')
    } finally {
      setSavingOrder(false)
      setDraggedId(null)
      setDragOverId(null)
    }
  }

  return (
    <div style={{ color: COLORS.body }}>
      <div className="admin-flex-between mb-6">
        <div>
          <h1 style={{ marginBottom: '0.25rem', color: COLORS.heading }}>PDFs & Banners</h1>
          <p style={{ color: COLORS.muted }}>
            Manage deal brochures, homepage banners and other documents without changing website code.
          </p>
        </div>
        {tab !== 'banner' && (
          <button onClick={openCreate} className="admin-btn admin-btn-primary">
            <Plus size={18} /> Add PDF
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setTab(item.key)
              closeForm()
            }}
            className={`admin-btn ${tab === item.key ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== 'banner' && showForm && (
        <PdfForm
          key={editing?.id || `new-${tab}`}
          initial={editing || { ...EMPTY_FORM, type: tab }}
          onCancel={closeForm}
          onSaved={saved}
        />
      )}

      {tab === 'banner' ? (
        <AdminBanners />
      ) : (
        <>
      {tab === 'deal' && (
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid rgba(59,130,246,0.35)',
            color: COLORS.body,
          }}
        >
          <strong style={{ color: COLORS.heading }}>
            Public website deals: {activeDealCount} active
          </strong>
          <p style={{ color: COLORS.muted, margin: '6px 0 0' }}>
            Every active deal appears automatically in the website top bar and footer. Hold the grip icon and drag a row up or down to control the display order.
          </p>
          {savingOrder && (
            <div style={{ color: '#93c5fd', marginTop: '8px', fontWeight: 700 }}>
              Saving catalogue order…
            </div>
          )}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.5rem', color: COLORS.body }}>
        {loading ? (
          <div style={{ color: COLORS.muted, padding: '40px', textAlign: 'center' }}>
            Loading PDFs…
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ color: COLORS.muted, padding: '40px', textAlign: 'center' }}>
            No documents found in this section.
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  {tab === 'deal' && <th style={{ width: '54px' }}>Move</th>}
                  <th>Title</th>
                  {tab === 'deal' && <th>Badge</th>}
                  {tab === 'deal' && <th>Validity</th>}
                  {tab === 'deal' && <th>Order</th>}
                  {tab === 'deal' && <th>Website</th>}
                  <th>PDF</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {displayed.map((pdf) => {
                  const validity = pdf.validity_text
                    || (pdf.valid_from && pdf.valid_to
                      ? `${formatDate(pdf.valid_from)} to ${formatDate(pdf.valid_to)}`
                      : '—')
                  const isDragging = Number(draggedId) === Number(pdf.id)
                  const isDragOver = Number(dragOverId) === Number(pdf.id)

                  return (
                    <tr
                      key={pdf.id}
                      draggable={tab === 'deal' && !savingOrder}
                      onDragStart={(event) => {
                        if (tab !== 'deal' || savingOrder) return
                        setDraggedId(pdf.id)
                        event.dataTransfer.effectAllowed = 'move'
                        event.dataTransfer.setData('text/plain', String(pdf.id))
                      }}
                      onDragEnter={(event) => {
                        if (tab !== 'deal' || savingOrder) return
                        event.preventDefault()
                        setDragOverId(pdf.id)
                      }}
                      onDragOver={(event) => {
                        if (tab !== 'deal' || savingOrder) return
                        event.preventDefault()
                        event.dataTransfer.dropEffect = 'move'
                      }}
                      onDrop={(event) => {
                        if (tab !== 'deal' || savingOrder) return
                        event.preventDefault()
                        const fromId = Number(event.dataTransfer.getData('text/plain') || draggedId)
                        saveDraggedOrder(fromId, pdf.id)
                      }}
                      onDragEnd={() => {
                        setDraggedId(null)
                        setDragOverId(null)
                      }}
                      style={{
                        opacity: isDragging ? 0.5 : 1,
                        outline: isDragOver && !isDragging ? '2px solid #3b82f6' : 'none',
                        outlineOffset: '-2px',
                        transition: 'opacity .15s ease, outline .15s ease',
                      }}
                    >
                      {tab === 'deal' && (
                        <td>
                          <button
                            type="button"
                            className="admin-btn admin-btn-ghost"
                            title="Hold and drag to reorder"
                            aria-label={`Move ${pdf.title}`}
                            style={{ cursor: savingOrder ? 'wait' : 'grab', padding: '8px' }}
                            disabled={savingOrder}
                          >
                            <GripVertical size={18} />
                          </button>
                        </td>
                      )}

                      <td>
                        <div style={{ fontWeight: 700, color: COLORS.heading }}>{pdf.title}</div>
                        {pdf.description && (
                          <div style={{ color: COLORS.muted, fontSize: '12px', marginTop: '4px', maxWidth: '420px' }}>
                            {pdf.description}
                          </div>
                        )}
                      </td>

                      {tab === 'deal' && <td style={{ color: COLORS.body }}>{pdf.badge || 'PROMOTION'}</td>}
                      {tab === 'deal' && <td style={{ color: COLORS.body }}>{validity}</td>}
                      {tab === 'deal' && (
                        <td>
                          <span
                            style={{
                              display: 'inline-grid',
                              placeItems: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'rgba(59,130,246,.16)',
                              color: '#bfdbfe',
                              fontWeight: 800,
                            }}
                          >
                            {pdf.sort_order}
                          </span>
                        </td>
                      )}
                      {tab === 'deal' && (
                        <td>
                          <span className={`admin-badge ${pdf.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                            {pdf.is_active ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                      )}

                      <td>
                        <a
                          href={fileUrl(pdf)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: COLORS.link, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Eye size={16} /> View
                        </a>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button type="button" onClick={() => openEdit(pdf)} className="admin-btn admin-btn-ghost" title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(pdf)}
                            className="admin-btn admin-btn-ghost"
                            style={{ color: COLORS.danger }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  )
}