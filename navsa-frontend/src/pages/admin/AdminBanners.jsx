// import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import {
//   deleteBanner,
//   getBanners,
//   getBrands,
//   reorderBanners,
//   updateBanner,
//   uploadBanner,
// } from '../../services/adminApi'
// import {
//   ArrowDown,
//   ArrowUp,
//   Eye,
//   EyeOff,
//   GripVertical,
//   ImagePlus,
//   Pencil,
//   Plus,
//   Save,
//   Trash2,
//   Upload,
//   X,
// } from 'lucide-react'

// const POSITIONS = [
//   { key: 'hero', label: 'Top Banners' },
//   { key: 'middle', label: 'Middle Banners' },
//   { key: 'bottom', label: 'Bottom Banners' },
// ]

// const OVERLAYS = [
//   { key: 'left', label: 'Left' },
//   { key: 'center', label: 'Centre' },
//   { key: 'right', label: 'Right' },
// ]

// const EMPTY_FORM = {
//   position: 'hero',
//   brand_id: '',
//   link_url: '',
//   button_text: 'See more',
//   overlay_position: 'left',
//   is_active: true,
//   image: null,
// }

// const COLORS = {
//   heading: '#f8fafc',
//   body: '#e2e8f0',
//   muted: '#94a3b8',
//   label: '#dbeafe',
//   link: '#60a5fa',
//   danger: '#fb7185',
// }

// function safeText(value) {
//   return typeof value === 'string' ? value : ''
// }

// function imageUrl(banner) {
//   if (banner.image_url) return banner.image_url
//   if (!banner.image_path) return ''
//   if (/^https?:\/\//i.test(banner.image_path) || banner.image_path.startsWith('/')) {
//     return banner.image_path
//   }
//   const apiBase = import.meta.env.VITE_API_URL || ''
//   const siteBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase
//   return `${siteBase || ''}/storage/${banner.image_path}`
// }

// function brandName(banner) {
//   return banner.brand_name || banner.brand?.brand_name || 'General / no brand'
// }

// function normaliseForm(source = {}, position = 'hero') {
//   return {
//     ...EMPTY_FORM,
//     ...source,
//     position: source.position || position,
//     brand_id: source.brand_id ? String(source.brand_id) : '',
//     link_url: safeText(source.link_url),
//     button_text: safeText(source.button_text),
//     overlay_position: source.overlay_position || 'left',
//     is_active: source.is_active !== false,
//     image: null,
//   }
// }

// function shopLink(name) {
//   return name ? `/shop?brand=${encodeURIComponent(name)}` : ''
// }

// function BannerForm({ initial, defaultPosition, brands, onCancel, onSaved }) {
//   const editing = Boolean(initial?.id)
//   const [form, setForm] = useState(() => normaliseForm(initial, defaultPosition))
//   const [busy, setBusy] = useState(false)
//   const [preview, setPreview] = useState(() => (editing ? imageUrl(initial) : ''))
//   const fileInputRef = useRef(null)

//   useEffect(() => () => {
//     if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
//   }, [preview])

//   const set = (key, value) => setForm(current => ({ ...current, [key]: value }))

//   const changeBrand = (value) => {
//     setForm(current => {
//       const previousBrand = brands.find(brand => String(brand.id) === String(current.brand_id))
//       const nextBrand = brands.find(brand => String(brand.id) === String(value))
//       const previousAutomaticLink = shopLink(previousBrand?.brand_name)
//       const shouldReplaceLink = !current.link_url.trim() || current.link_url === previousAutomaticLink

//       return {
//         ...current,
//         brand_id: value,
//         link_url: shouldReplaceLink ? shopLink(nextBrand?.brand_name) : current.link_url,
//       }
//     })
//   }

//   const changeImage = (file) => {
//     if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
//     set('image', file || null)
//     setPreview(file ? URL.createObjectURL(file) : (editing ? imageUrl(initial) : ''))
//   }

//   const submit = async (event) => {
//     event.preventDefault()

//     if (!editing && !form.image) {
//       alert('Please choose a banner image.')
//       return
//     }

//     setBusy(true)

//     try {
//       const payload = new FormData()
//       payload.append('position', form.position)
//       payload.append('brand_id', form.brand_id || '')
//       payload.append('link_url', form.link_url.trim())
//       payload.append('button_text', form.button_text.trim())
//       payload.append('overlay_position', form.overlay_position)
//       payload.append('is_active', form.is_active ? '1' : '0')
//       if (form.image) payload.append('image', form.image)

//       if (editing) {
//         await updateBanner(initial.id, payload)
//       } else {
//         await uploadBanner(payload)
//       }

//       await onSaved()
//     } catch (error) {
//       alert(error?.message || 'Unable to save banner.')
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
//     <form onSubmit={submit} className="glass-panel" style={{ padding: '24px', marginBottom: '22px', color: COLORS.body }}>
//       <div className="admin-flex-between" style={{ marginBottom: '18px', gap: '14px', flexWrap: 'wrap' }}>
//         <div>
//           <h3 style={{ margin: 0, color: COLORS.heading }}>{editing ? 'Edit Banner' : 'Add Banner'}</h3>
//           <p style={{ color: COLORS.muted, margin: '5px 0 0' }}>
//             Upload the image and use only the fields currently needed by NAVSA.
//           </p>
//         </div>
//         <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">
//           <X size={17} /> Close
//         </button>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
//         <label>
//           <span style={labelStyle}>Banner section</span>
//           <select className="admin-input-field" value={form.position} onChange={event => set('position', event.target.value)} style={{ width: '100%', color: COLORS.heading }}>
//             {POSITIONS.map(position => <option key={position.key} value={position.key}>{position.label}</option>)}
//           </select>
//         </label>

//         <label>
//           <span style={labelStyle}>Brand</span>
//           <select className="admin-input-field" value={form.brand_id} onChange={event => changeBrand(event.target.value)} style={{ width: '100%', color: COLORS.heading }}>
//             <option value="">General / no brand</option>
//             {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.brand_name}</option>)}
//           </select>
//         </label>

//         <label>
//           <span style={labelStyle}>Banner link</span>
//           <input className="admin-input-field" value={form.link_url} onChange={event => set('link_url', event.target.value)} placeholder="/shop?brand=Pepsi or https://..." maxLength={2048} style={{ width: '100%', color: COLORS.heading }} />
//         </label>

//         <label>
//           <span style={labelStyle}>Button text</span>
//           <input className="admin-input-field" value={form.button_text} onChange={event => set('button_text', event.target.value)} placeholder="See more" maxLength={80} style={{ width: '100%', color: COLORS.heading }} />
//         </label>

//         <label>
//           <span style={labelStyle}>Button overlay position</span>
//           <select className="admin-input-field" value={form.overlay_position} onChange={event => set('overlay_position', event.target.value)} style={{ width: '100%', color: COLORS.heading }}>
//             {OVERLAYS.map(option => <option key={option.key} value={option.key}>{option.label}</option>)}
//           </select>
//         </label>

//         <label style={{ alignSelf: 'end', minHeight: '46px', display: 'flex', alignItems: 'center', gap: '10px', color: COLORS.body, fontWeight: 600 }}>
//           <input type="checkbox" checked={Boolean(form.is_active)} onChange={event => set('is_active', event.target.checked)} />
//           Show this banner on the website
//         </label>

//         <label style={{ gridColumn: '1 / -1' }}>
//           <span style={labelStyle}>{editing ? 'Replace banner image (optional)' : 'Banner image'}</span>
//           <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="admin-input-field" onChange={event => changeImage(event.target.files?.[0] || null)} style={{ width: '100%', color: COLORS.body }} />
//           <span style={{ display: 'block', color: COLORS.muted, fontSize: '12px', marginTop: '7px' }}>
//             JPG, PNG or WebP, maximum 10 MB. Use the same dimensions for every banner in the same section; 1600 px wide is recommended.
//           </span>
//         </label>
//       </div>

//       {preview && (
//         <div style={{ marginTop: '18px', border: '1px solid rgba(148,163,184,.28)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
//           <img src={preview} alt="Selected banner preview" style={{ display: 'block', width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
//         </div>
//       )}

//       <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
//         <button type="submit" disabled={busy} className="admin-btn admin-btn-primary">
//           {editing ? <Save size={17} /> : <Upload size={17} />}
//           {busy ? 'Saving...' : editing ? 'Save Changes' : 'Upload Banner'}
//         </button>
//         <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">Cancel</button>
//       </div>
//     </form>
//   )
// }

// function moveItem(items, fromIndex, toIndex) {
//   const next = [...items]
//   const [moved] = next.splice(fromIndex, 1)
//   next.splice(toIndex, 0, moved)
//   return next
// }

// export default function AdminBanners() {
//   const [banners, setBanners] = useState([])
//   const [brands, setBrands] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showForm, setShowForm] = useState(false)
//   const [editing, setEditing] = useState(null)
//   const [defaultPosition, setDefaultPosition] = useState('hero')
//   const [dragged, setDragged] = useState(null)
//   const [dragOverId, setDragOverId] = useState(null)
//   const [savingOrder, setSavingOrder] = useState(false)

//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const [bannerResult, brandResult] = await Promise.all([getBanners(), getBrands()])
//       setBanners(Array.isArray(bannerResult) ? bannerResult : [])
//       setBrands(Array.isArray(brandResult) ? brandResult.filter(brand => brand.status !== 0 && !brand.deleted) : [])
//     } catch (error) {
//       alert(error?.message || 'Unable to load banners.')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => { load() }, [load])

//   const grouped = useMemo(() => Object.fromEntries(POSITIONS.map(position => [
//     position.key,
//     banners
//       .filter(banner => banner.position === position.key)
//       .sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || Number(a.id) - Number(b.id)),
//   ])), [banners])

//   const openCreate = (position) => {
//     setEditing(null)
//     setDefaultPosition(position)
//     setShowForm(true)
//   }

//   const openEdit = (banner) => {
//     setEditing(banner)
//     setDefaultPosition(banner.position)
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

//   const remove = async (banner) => {
//     if (!confirm(`Delete the ${brandName(banner)} banner? This also deletes its uploaded image from the server.`)) return
//     try {
//       await deleteBanner(banner.id)
//       await load()
//     } catch (error) {
//       alert(error?.message || 'Unable to delete banner.')
//     }
//   }

//   const saveOrder = async (position, nextItems) => {
//     const previous = banners
//     const orderMap = new Map(nextItems.map((banner, index) => [Number(banner.id), index + 1]))
//     setBanners(current => current.map(banner => orderMap.has(Number(banner.id)) ? { ...banner, sort_order: orderMap.get(Number(banner.id)) } : banner))
//     setSavingOrder(true)

//     try {
//       const response = await reorderBanners(position, nextItems.map(banner => Number(banner.id)))
//       if (Array.isArray(response?.banners)) {
//         const updated = new Map(response.banners.map(banner => [Number(banner.id), banner]))
//         setBanners(current => current.map(banner => updated.get(Number(banner.id)) || banner))
//       } else {
//         await load()
//       }
//     } catch (error) {
//       setBanners(previous)
//       alert(error?.message || 'Unable to save banner order.')
//     } finally {
//       setSavingOrder(false)
//       setDragged(null)
//       setDragOverId(null)
//     }
//   }

//   const moveByButton = (position, id, direction) => {
//     if (savingOrder) return
//     const items = grouped[position]
//     const fromIndex = items.findIndex(item => Number(item.id) === Number(id))
//     const toIndex = fromIndex + direction
//     if (fromIndex < 0 || toIndex < 0 || toIndex >= items.length) return
//     saveOrder(position, moveItem(items, fromIndex, toIndex))
//   }

//   const dropOn = (position, toId) => {
//     if (!dragged || dragged.position !== position || savingOrder) return
//     const items = grouped[position]
//     const fromIndex = items.findIndex(item => Number(item.id) === Number(dragged.id))
//     const toIndex = items.findIndex(item => Number(item.id) === Number(toId))
//     if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return
//     saveOrder(position, moveItem(items, fromIndex, toIndex))
//   }

//   if (loading) {
//     return <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: COLORS.muted }}>Loading banners…</div>
//   }

//   return (
//     <div style={{ color: COLORS.body }}>
//       <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px', border: '1px solid rgba(59,130,246,.35)' }}>
//         <strong style={{ color: COLORS.heading }}>Homepage banner management</strong>
//         <p style={{ color: COLORS.muted, margin: '6px 0 0' }}>
//           Add any number of top, middle or bottom banners. Drag rows to change their order, or use the arrow buttons on mobile.
//         </p>
//         {savingOrder && <div style={{ color: '#93c5fd', marginTop: '8px', fontWeight: 700 }}>Saving banner order…</div>}
//       </div>

//       {showForm && (
//         <BannerForm
//           key={editing?.id || `new-${defaultPosition}`}
//           initial={editing}
//           defaultPosition={defaultPosition}
//           brands={brands}
//           onCancel={closeForm}
//           onSaved={saved}
//         />
//       )}

//       {POSITIONS.map(position => {
//         const items = grouped[position.key] || []
//         const visibleCount = items.filter(item => item.is_active).length

//         return (
//           <section key={position.key} className="glass-panel" style={{ padding: '20px', marginBottom: '22px' }}>
//             <div className="admin-flex-between" style={{ gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
//               <div>
//                 <h3 style={{ margin: 0, color: COLORS.heading }}>{position.label}</h3>
//                 <p style={{ color: COLORS.muted, margin: '5px 0 0' }}>{visibleCount} visible / {items.length} total</p>
//               </div>
//               <button type="button" onClick={() => openCreate(position.key)} className="admin-btn admin-btn-primary">
//                 <Plus size={17} /> Add {position.label.replace(' Banners', '')} Banner
//               </button>
//             </div>

//             {items.length === 0 ? (
//               <div style={{ padding: '28px', textAlign: 'center', color: COLORS.muted, border: '1px dashed rgba(148,163,184,.25)', borderRadius: '12px' }}>
//                 No banners in this section.
//               </div>
//             ) : (
//               <div className="admin-table-container">
//                 <table className="admin-table">
//                   <thead>
//                     <tr>
//                       <th style={{ width: '110px' }}>Move</th>
//                       <th>Preview</th>
//                       <th>Brand</th>
//                       <th>Link</th>
//                       <th>Button</th>
//                       <th>Overlay</th>
//                       <th>Order</th>
//                       <th>Website</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.map((banner, index) => {
//                       const isDragging = Number(dragged?.id) === Number(banner.id)
//                       const isDragOver = Number(dragOverId) === Number(banner.id)

//                       return (
//                         <tr
//                           key={banner.id}
//                           draggable={!savingOrder}
//                           onDragStart={event => {
//                             setDragged({ id: banner.id, position: position.key })
//                             event.dataTransfer.effectAllowed = 'move'
//                             event.dataTransfer.setData('text/plain', String(banner.id))
//                           }}
//                           onDragEnter={event => {
//                             event.preventDefault()
//                             setDragOverId(banner.id)
//                           }}
//                           onDragOver={event => {
//                             event.preventDefault()
//                             event.dataTransfer.dropEffect = 'move'
//                           }}
//                           onDrop={event => {
//                             event.preventDefault()
//                             dropOn(position.key, banner.id)
//                           }}
//                           onDragEnd={() => {
//                             setDragged(null)
//                             setDragOverId(null)
//                           }}
//                           style={{
//                             opacity: isDragging ? 0.5 : 1,
//                             outline: isDragOver && !isDragging ? '2px solid #3b82f6' : 'none',
//                             outlineOffset: '-2px',
//                           }}
//                         >
//                           <td>
//                             <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
//                               <button type="button" className="admin-btn admin-btn-ghost" title="Drag to reorder" disabled={savingOrder} style={{ cursor: savingOrder ? 'wait' : 'grab', padding: '7px' }}>
//                                 <GripVertical size={17} />
//                               </button>
//                               <button type="button" className="admin-btn admin-btn-ghost" title="Move up" disabled={savingOrder || index === 0} onClick={() => moveByButton(position.key, banner.id, -1)} style={{ padding: '7px' }}>
//                                 <ArrowUp size={15} />
//                               </button>
//                               <button type="button" className="admin-btn admin-btn-ghost" title="Move down" disabled={savingOrder || index === items.length - 1} onClick={() => moveByButton(position.key, banner.id, 1)} style={{ padding: '7px' }}>
//                                 <ArrowDown size={15} />
//                               </button>
//                             </div>
//                           </td>

//                           <td>
//                             <a href={imageUrl(banner)} target="_blank" rel="noreferrer" title="Open full banner image">
//                               <img src={imageUrl(banner)} alt={`${brandName(banner)} banner`} style={{ display: 'block', width: '150px', height: '58px', objectFit: 'contain', background: '#fff', borderRadius: '6px' }} />
//                             </a>
//                           </td>

//                           <td style={{ color: COLORS.heading, fontWeight: 700 }}>{brandName(banner)}</td>

//                           <td>
//                             {banner.link_url ? (
//                               <a href={banner.link_url} target={/^https?:\/\//i.test(banner.link_url) ? '_blank' : undefined} rel="noreferrer" style={{ color: COLORS.link, maxWidth: '260px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={banner.link_url}>
//                                 {banner.link_url}
//                               </a>
//                             ) : <span style={{ color: COLORS.muted }}>—</span>}
//                           </td>

//                           <td style={{ color: COLORS.body }}>{banner.button_text || '—'}</td>
//                           <td style={{ color: COLORS.body, textTransform: 'capitalize' }}>{banner.overlay_position || 'left'}</td>
//                           <td><span style={{ display: 'inline-grid', placeItems: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,.16)', color: '#bfdbfe', fontWeight: 800 }}>{banner.sort_order}</span></td>
//                           <td>
//                             <span className={`admin-badge ${banner.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
//                               {banner.is_active ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
//                             </span>
//                           </td>
//                           <td>
//                             <div style={{ display: 'flex', gap: '6px' }}>
//                               <button type="button" onClick={() => openEdit(banner)} className="admin-btn admin-btn-ghost" title="Edit"><Pencil size={16} /></button>
//                               <button type="button" onClick={() => remove(banner)} className="admin-btn admin-btn-ghost" title="Delete" style={{ color: COLORS.danger }}><Trash2 size={16} /></button>
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>
//         )
//       })}
//     </div>
//   )
// }

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  deleteBanner,
  getBanners,
  getBrands,
  reorderBanners,
  updateBanner,
  uploadBanner,
} from '../../services/adminApi'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

const POSITIONS = [
  { key: 'hero', label: 'Top Banners' },
  { key: 'middle', label: 'Middle Banners' },
  { key: 'bottom', label: 'Bottom Banners' },
]

const OVERLAYS = [
  { key: 'left', label: 'Left' },
  { key: 'center', label: 'Centre' },
  { key: 'right', label: 'Right' },
]

const EMPTY_FORM = {
  position: 'hero',
  brand_id: '',
  link_url: '',
  button_text: 'See more',
  overlay_position: 'left',
  is_active: true,
  image: null,
}

const COLORS = {
  heading: '#f8fafc',
  body: '#e2e8f0',
  muted: '#94a3b8',
  label: '#dbeafe',
  link: '#60a5fa',
  danger: '#fb7185',
}

function safeText(value) {
  return typeof value === 'string' ? value : ''
}

function imageUrl(banner) {
  if (banner.image_url) return banner.image_url
  if (!banner.image_path) return ''
  if (/^https?:\/\//i.test(banner.image_path) || banner.image_path.startsWith('/')) {
    return banner.image_path
  }
  const apiBase = import.meta.env.VITE_API_URL || ''
  const siteBase = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase
  return `${siteBase || ''}/storage/${banner.image_path}`
}

function brandName(banner) {
  return banner.brand_name || banner.brand?.brand_name || 'General / no brand'
}

function normaliseForm(source = {}, position = 'hero') {
  return {
    ...EMPTY_FORM,
    ...source,
    position: source.position || position,
    brand_id: source.brand_id ? String(source.brand_id) : '',
    link_url: safeText(source.link_url),
    button_text: safeText(source.button_text),
    overlay_position: source.overlay_position || 'left',
    is_active: source.is_active !== false,
    image: null,
  }
}

function shopLink(name) {
  return name ? `/shop?brand=${encodeURIComponent(name)}` : ''
}

function BannerForm({ initial, defaultPosition, brands, onCancel, onSaved }) {
  const editing = Boolean(initial?.id)
  const [form, setForm] = useState(() => normaliseForm(initial, defaultPosition))
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(() => (editing ? imageUrl(initial) : ''))
  const fileInputRef = useRef(null)

  useEffect(() => () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
  }, [preview])

  const set = (key, value) => setForm(current => ({ ...current, [key]: value }))

  const changeBrand = (value) => {
    setForm(current => {
      const previousBrand = brands.find(brand => String(brand.id) === String(current.brand_id))
      const nextBrand = brands.find(brand => String(brand.id) === String(value))
      const previousAutomaticLink = shopLink(previousBrand?.brand_name)
      const shouldReplaceLink = !current.link_url.trim() || current.link_url === previousAutomaticLink

      return {
        ...current,
        brand_id: value,
        link_url: shouldReplaceLink ? shopLink(nextBrand?.brand_name) : current.link_url,
      }
    })
  }

  const changeImage = (file) => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    set('image', file || null)
    setPreview(file ? URL.createObjectURL(file) : (editing ? imageUrl(initial) : ''))
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!editing && !form.image) {
      alert('Please choose a banner image.')
      return
    }

    setBusy(true)

    try {
      const payload = new FormData()
      payload.append('position', form.position)
      payload.append('brand_id', form.brand_id || '')
      payload.append('link_url', form.link_url.trim())
      payload.append('button_text', form.button_text.trim())
      payload.append('overlay_position', form.overlay_position)
      payload.append('is_active', form.is_active ? '1' : '0')
      if (form.image) payload.append('image', form.image)

      if (editing) {
        await updateBanner(initial.id, payload)
      } else {
        await uploadBanner(payload)
      }

      await onSaved()
    } catch (error) {
      alert(error?.message || 'Unable to save banner.')
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
    <form onSubmit={submit} className="glass-panel" style={{ padding: '24px', marginBottom: '22px', color: COLORS.body }}>
      <div className="admin-flex-between" style={{ marginBottom: '18px', gap: '14px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, color: COLORS.heading }}>{editing ? 'Edit Banner' : 'Add Banner'}</h3>
          <p style={{ color: COLORS.muted, margin: '5px 0 0' }}>
            Upload the image and use only the fields currently needed by NAVSA.
          </p>
        </div>
        <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">
          <X size={17} /> Close
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <label>
          <span style={labelStyle}>Banner section</span>
          <select className="admin-input-field" value={form.position} onChange={event => set('position', event.target.value)} style={{ width: '100%', color: COLORS.heading }}>
            {POSITIONS.map(position => <option key={position.key} value={position.key}>{position.label}</option>)}
          </select>
        </label>

        <label>
          <span style={labelStyle}>Brand</span>
          <select className="admin-input-field" value={form.brand_id} onChange={event => changeBrand(event.target.value)} style={{ width: '100%', color: COLORS.heading }}>
            <option value="">General / no brand</option>
            {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.brand_name}</option>)}
          </select>
        </label>

        <label>
          <span style={labelStyle}>Banner link</span>
          <input className="admin-input-field" value={form.link_url} onChange={event => set('link_url', event.target.value)} placeholder="/shop?brand=Pepsi or https://..." maxLength={2048} style={{ width: '100%', color: COLORS.heading }} />
        </label>

        <label>
          <span style={labelStyle}>Button text</span>
          <input className="admin-input-field" value={form.button_text} onChange={event => set('button_text', event.target.value)} placeholder="See more" maxLength={80} style={{ width: '100%', color: COLORS.heading }} />
        </label>

        <label>
          <span style={labelStyle}>Button overlay position</span>
          <select className="admin-input-field" value={form.overlay_position} onChange={event => set('overlay_position', event.target.value)} style={{ width: '100%', color: COLORS.heading }}>
            {OVERLAYS.map(option => <option key={option.key} value={option.key}>{option.label}</option>)}
          </select>
        </label>

        <label style={{ alignSelf: 'end', minHeight: '46px', display: 'flex', alignItems: 'center', gap: '10px', color: COLORS.body, fontWeight: 600 }}>
          <input type="checkbox" checked={Boolean(form.is_active)} onChange={event => set('is_active', event.target.checked)} />
          Show this banner on the website
        </label>

        <label style={{ gridColumn: '1 / -1' }}>
          <span style={labelStyle}>{editing ? 'Replace banner image (optional)' : 'Banner image'}</span>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="admin-input-field" onChange={event => changeImage(event.target.files?.[0] || null)} style={{ width: '100%', color: COLORS.body }} />
          <span style={{ display: 'block', color: COLORS.muted, fontSize: '12px', marginTop: '7px' }}>
            JPG, PNG or WebP, maximum 10 MB. Use the same dimensions for every banner in the same section; 1600 px wide is recommended.
          </span>
        </label>
      </div>

      {preview && (
        <div style={{ marginTop: '18px', border: '1px solid rgba(148,163,184,.28)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
          <img src={preview} alt="Selected banner preview" style={{ display: 'block', width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button type="submit" disabled={busy} className="admin-btn admin-btn-primary">
          {editing ? <Save size={17} /> : <Upload size={17} />}
          {busy ? 'Saving...' : editing ? 'Save Changes' : 'Upload Banner'}
        </button>
        <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost">Cancel</button>
      </div>
    </form>
  )
}

function moveItem(items, fromIndex, toIndex) {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [defaultPosition, setDefaultPosition] = useState('hero')
  const [dragged, setDragged] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const formSectionRef = useRef(null)
  const scrollToEditFormRef = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [bannerResult, brandResult] = await Promise.all([getBanners(), getBrands()])
      setBanners(Array.isArray(bannerResult) ? bannerResult : [])
      setBrands(Array.isArray(brandResult) ? brandResult.filter(brand => brand.status !== 0 && !brand.deleted) : [])
    } catch (error) {
      alert(error?.message || 'Unable to load banners.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!showForm || !scrollToEditFormRef.current) return undefined

    scrollToEditFormRef.current = false

    const frame = window.requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [showForm, editing])

  const grouped = useMemo(() => Object.fromEntries(POSITIONS.map(position => [
    position.key,
    banners
      .filter(banner => banner.position === position.key)
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order) || Number(a.id) - Number(b.id)),
  ])), [banners])

  const openCreate = (position) => {
    setEditing(null)
    setDefaultPosition(position)
    setShowForm(true)
  }

  const openEdit = (banner) => {
    scrollToEditFormRef.current = true
    setEditing(banner)
    setDefaultPosition(banner.position)
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

  const remove = async (banner) => {
    if (!confirm(`Delete the ${brandName(banner)} banner? This also deletes its uploaded image from the server.`)) return
    try {
      await deleteBanner(banner.id)
      await load()
    } catch (error) {
      alert(error?.message || 'Unable to delete banner.')
    }
  }

  const saveOrder = async (position, nextItems) => {
    const previous = banners
    const orderMap = new Map(nextItems.map((banner, index) => [Number(banner.id), index + 1]))
    setBanners(current => current.map(banner => orderMap.has(Number(banner.id)) ? { ...banner, sort_order: orderMap.get(Number(banner.id)) } : banner))
    setSavingOrder(true)

    try {
      const response = await reorderBanners(position, nextItems.map(banner => Number(banner.id)))
      if (Array.isArray(response?.banners)) {
        const updated = new Map(response.banners.map(banner => [Number(banner.id), banner]))
        setBanners(current => current.map(banner => updated.get(Number(banner.id)) || banner))
      } else {
        await load()
      }
    } catch (error) {
      setBanners(previous)
      alert(error?.message || 'Unable to save banner order.')
    } finally {
      setSavingOrder(false)
      setDragged(null)
      setDragOverId(null)
    }
  }

  const moveByButton = (position, id, direction) => {
    if (savingOrder) return
    const items = grouped[position]
    const fromIndex = items.findIndex(item => Number(item.id) === Number(id))
    const toIndex = fromIndex + direction
    if (fromIndex < 0 || toIndex < 0 || toIndex >= items.length) return
    saveOrder(position, moveItem(items, fromIndex, toIndex))
  }

  const dropOn = (position, toId) => {
    if (!dragged || dragged.position !== position || savingOrder) return
    const items = grouped[position]
    const fromIndex = items.findIndex(item => Number(item.id) === Number(dragged.id))
    const toIndex = items.findIndex(item => Number(item.id) === Number(toId))
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return
    saveOrder(position, moveItem(items, fromIndex, toIndex))
  }

  if (loading) {
    return <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: COLORS.muted }}>Loading banners…</div>
  }

  return (
    <div style={{ color: COLORS.body }}>
      <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px', border: '1px solid rgba(59,130,246,.35)' }}>
        <strong style={{ color: COLORS.heading }}>Homepage banner management</strong>
        <p style={{ color: COLORS.muted, margin: '6px 0 0' }}>
          Add any number of top, middle or bottom banners. Drag rows to change their order, or use the arrow buttons on mobile.
        </p>
        {savingOrder && <div style={{ color: '#93c5fd', marginTop: '8px', fontWeight: 700 }}>Saving banner order…</div>}
      </div>

      {showForm && (
        <div ref={formSectionRef} style={{ scrollMarginTop: '24px' }}>
          <BannerForm
            key={editing?.id || `new-${defaultPosition}`}
            initial={editing}
            defaultPosition={defaultPosition}
            brands={brands}
            onCancel={closeForm}
            onSaved={saved}
          />
        </div>
      )}

      {POSITIONS.map(position => {
        const items = grouped[position.key] || []
        const visibleCount = items.filter(item => item.is_active).length

        return (
          <section key={position.key} className="glass-panel" style={{ padding: '20px', marginBottom: '22px' }}>
            <div className="admin-flex-between" style={{ gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: COLORS.heading }}>{position.label}</h3>
                <p style={{ color: COLORS.muted, margin: '5px 0 0' }}>{visibleCount} visible / {items.length} total</p>
              </div>
              <button type="button" onClick={() => openCreate(position.key)} className="admin-btn admin-btn-primary">
                <Plus size={17} /> Add {position.label.replace(' Banners', '')} Banner
              </button>
            </div>

            {items.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', color: COLORS.muted, border: '1px dashed rgba(148,163,184,.25)', borderRadius: '12px' }}>
                No banners in this section.
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '110px' }}>Move</th>
                      <th>Preview</th>
                      <th>Brand</th>
                      <th>Link</th>
                      <th>Button</th>
                      <th>Overlay</th>
                      <th>Order</th>
                      <th>Website</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((banner, index) => {
                      const isDragging = Number(dragged?.id) === Number(banner.id)
                      const isDragOver = Number(dragOverId) === Number(banner.id)

                      return (
                        <tr
                          key={banner.id}
                          draggable={!savingOrder}
                          onDragStart={event => {
                            setDragged({ id: banner.id, position: position.key })
                            event.dataTransfer.effectAllowed = 'move'
                            event.dataTransfer.setData('text/plain', String(banner.id))
                          }}
                          onDragEnter={event => {
                            event.preventDefault()
                            setDragOverId(banner.id)
                          }}
                          onDragOver={event => {
                            event.preventDefault()
                            event.dataTransfer.dropEffect = 'move'
                          }}
                          onDrop={event => {
                            event.preventDefault()
                            dropOn(position.key, banner.id)
                          }}
                          onDragEnd={() => {
                            setDragged(null)
                            setDragOverId(null)
                          }}
                          style={{
                            opacity: isDragging ? 0.5 : 1,
                            outline: isDragOver && !isDragging ? '2px solid #3b82f6' : 'none',
                            outlineOffset: '-2px',
                          }}
                        >
                          <td>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              <button type="button" className="admin-btn admin-btn-ghost" title="Drag to reorder" disabled={savingOrder} style={{ cursor: savingOrder ? 'wait' : 'grab', padding: '7px' }}>
                                <GripVertical size={17} />
                              </button>
                              <button type="button" className="admin-btn admin-btn-ghost" title="Move up" disabled={savingOrder || index === 0} onClick={() => moveByButton(position.key, banner.id, -1)} style={{ padding: '7px' }}>
                                <ArrowUp size={15} />
                              </button>
                              <button type="button" className="admin-btn admin-btn-ghost" title="Move down" disabled={savingOrder || index === items.length - 1} onClick={() => moveByButton(position.key, banner.id, 1)} style={{ padding: '7px' }}>
                                <ArrowDown size={15} />
                              </button>
                            </div>
                          </td>

                          <td>
                            <a href={imageUrl(banner)} target="_blank" rel="noreferrer" title="Open full banner image">
                              <img src={imageUrl(banner)} alt={`${brandName(banner)} banner`} style={{ display: 'block', width: '150px', height: '58px', objectFit: 'contain', background: '#fff', borderRadius: '6px' }} />
                            </a>
                          </td>

                          <td style={{ color: COLORS.heading, fontWeight: 700 }}>{brandName(banner)}</td>

                          <td>
                            {banner.link_url ? (
                              <a href={banner.link_url} target={/^https?:\/\//i.test(banner.link_url) ? '_blank' : undefined} rel="noreferrer" style={{ color: COLORS.link, maxWidth: '260px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={banner.link_url}>
                                {banner.link_url}
                              </a>
                            ) : <span style={{ color: COLORS.muted }}>—</span>}
                          </td>

                          <td style={{ color: COLORS.body }}>{banner.button_text || '—'}</td>
                          <td style={{ color: COLORS.body, textTransform: 'capitalize' }}>{banner.overlay_position || 'left'}</td>
                          <td><span style={{ display: 'inline-grid', placeItems: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,.16)', color: '#bfdbfe', fontWeight: 800 }}>{banner.sort_order}</span></td>
                          <td>
                            <span className={`admin-badge ${banner.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                              {banner.is_active ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button type="button" onClick={() => openEdit(banner)} className="admin-btn admin-btn-ghost" title="Edit"><Pencil size={16} /></button>
                              <button type="button" onClick={() => remove(banner)} className="admin-btn admin-btn-ghost" title="Delete" style={{ color: COLORS.danger }}><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}