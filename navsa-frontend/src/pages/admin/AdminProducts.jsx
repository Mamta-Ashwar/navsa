// import {
//   getProducts, toggleWeb, toggleOffer, toggleBestOffer, toggleNewArrival, updateStock,
//   softDeleteProduct, hardDeleteProduct, restoreProduct, updateProduct, createProduct, uploadErpExcel, uploadProductImage, selectProductImage, removeProductImage
// } from '../../services/adminApi'
// import { getBrands, getCategories } from '../../services/adminApi'
// import Barcode from 'react-barcode'
// import { Plus, Edit2, Trash2, Filter, Eye, EyeOff, RotateCcw, X, Upload, Printer, Download } from 'lucide-react';
// import { useEffect, useState, useCallback, useRef } from 'react'
// import ConfirmModal from '../../components/common/ConfirmModal'

// function ProductDetailModal({ product, onClose }) {
//   const rows = [
//     ['NAVSA Product Code', product.navsa_product_code || '—'],
//     ['Barcode (EAN)',    product.barcode_ean || '—'],
//     ['Description',     product.description || '—'],
//     ['Brand',           product.brand?.brand_name || '—'],
//     ['Category',        product.category?.category_name || '—'],
//     ['Sell Price',      product.price != null ? `£${product.price}` : '—'],
//     ['List Price',      product.price_list != null ? `£${product.price_list}` : '—'],
//     ['Stock',           product.stock_quantity ?? 0],
//     ['Live on Web',     product.live_for_web ? 'Yes ✔' : 'No ✘'],
//     ['Is Offer',        product.is_offer ? `Yes — ${product.offer_label || ''}` : 'No'],
//     ['Best Offer',      product.is_best_offer ? 'Yes ✔' : 'No'],
//     ['New Arrival',     product.is_new_arrival ? 'Yes ✔' : 'No'],
//     ['Status',          product.deleted ? '🗑 Deleted' : product.live_for_web ? 'Live' : 'Hidden'],
//     ['Created',         product.created_at ? new Date(product.created_at).toLocaleString() : '—'],
//     ['Updated',         product.updated_at ? new Date(product.updated_at).toLocaleString() : '—'],
//   ]
//   return (
//     <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'20px' }}>
//       <div onClick={e => e.stopPropagation()} style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflowY:'auto', padding:'28px', position:'relative' }}>
//         <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
//         <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
//           <div style={{ width:'50px', height:'50px', borderRadius:'12px', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>📦</div>
//           <div>
//             <div style={{ color:'#fff', fontWeight:700, fontSize:'17px', lineHeight:1.3 }}>{product.description?.slice(0,60) || 'Product'}</div>
//             <div style={{ color:'#94a3b8', fontSize:'12px', marginTop:'3px' }}>NAVSA Code: {product.navsa_product_code || '—'} {product.barcode_ean ? `• EAN: ${product.barcode_ean}` : ''}</div>
//             <span style={{ marginTop:'6px', display:'inline-block', background: product.live_for_web ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: product.live_for_web ? '#10b981' : '#ef4444', fontSize:'10px', fontWeight:700, padding:'2px 10px', borderRadius:'10px' }}>{product.live_for_web ? 'LIVE' : 'HIDDEN'}</span>
//             {product.is_offer && <span style={{ marginTop:'6px', marginLeft:'6px', display:'inline-block', background:'rgba(245,158,11,0.15)', color:'#f59e0b', fontSize:'10px', fontWeight:700, padding:'2px 10px', borderRadius:'10px' }}>OFFER</span>}
//           </div>
//         </div>
//         <div style={{ display:'grid', gap:'12px' }}>
//           {rows.map(([label, val]) => (
//             <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
//               <span style={{ color:'#94a3b8', fontSize:'12px', fontWeight:600, flexShrink:0, minWidth:'120px' }}>{label}</span>
//               <span style={{ color:'#fff', fontSize:'13px', textAlign:'right', wordBreak:'break-word' }}>{String(val)}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// const BLANK_PRODUCT = {
//   description: '',
//   navsa_product_code: '',
//   barcode_ean: '',
//   price: '',
//   live_for_web: 1,
//   stock_quantity: 0,
//   brand_id: null,
//   category_id: null
// }

// function StockModal({ product, onClose, onSaved }) {
//   const [stock, setStock]   = useState(product.stock_quantity ?? 0)
//   const [price, setPrice]   = useState(product.price ?? '')
//   const [list,  setList]    = useState(product.price_list ?? '')
//   const [busy,  setBusy]    = useState(false)

//   const save = async () => {
//     setBusy(true)
//     try {
//       await updateStock(product.id, parseInt(stock), price || undefined, list || undefined)
//       onSaved()
//       onClose()
//     } catch (e) { alert(e.message) }
//     finally { setBusy(false) }
//   }

//   return (
//     <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
//       <div className="glass-panel" style={{ padding:'32px', width:'360px', background: '#0f172a' }}>
//         <h3 style={{ marginBottom:'20px', fontSize:'18px' }}>Edit Stock & Price</h3>
//         <div style={{ color:'#94a3b8', fontSize:'12px', marginBottom:'16px' }}>
//           {product.navsa_product_code || '—'} — {product.description?.slice(0,50)}
//         </div>
//         {[
//           { label:'Stock Quantity', val:stock, set:setStock, type:'number' },
//           { label:'Sell Price (£)',  val:price, set:setPrice, type:'number' },
//           { label:'List Price (£)',  val:list,  set:setList,  type:'number' },
//         ].map(({ label, val, set, type }) => (
//           <div key={label} className="admin-input-group">
//             <label>{label}</label>
//             <input type={type} className="admin-input-field" value={val} onChange={e => set(e.target.value)} />
//           </div>
//         ))}
//         <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
//           <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ flex:1 }}>
//             {busy ? 'Saving…' : '💾 Save'}
//           </button>
//           <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ flex:1, border: '1px solid rgba(255,255,255,0.1)' }}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// function OfferModal({ product, onClose, onSaved }) {
//   const [label, setLabel] = useState(product.offer_label || '')
//   const [busy, setBusy]   = useState(false)
//   const save = async () => {
//     setBusy(true)
//     try {
//       await toggleOffer(product.id, label)
//       onSaved(); onClose()
//     } catch (e) { alert(e.message) }
//     finally { setBusy(false) }
//   }
//   return (
//     <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
//       <div className="glass-panel" style={{ padding:'32px', width:'340px', background: '#0f172a' }}>
//         <h3 style={{ marginBottom:'16px' }}>Set Offer Label</h3>
//         <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 20% OFF, FLASH DEAL…"
//           className="admin-input-field" style={{ width:'100%', marginBottom:'16px' }} />
//         <div style={{ display:'flex', gap:'10px' }}>
//           <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ flex:1 }}>
//             {busy ? '…' : '✓ Enable Offer'}
//           </button>
//           <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ flex:1, border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// const ALL_TABS = ['General', 'Advanced', 'Extra', 'Images', 'Related', 'Website description']

// const EXTRA_FIELDS = [
//   {
//     key: 'order_qty_allowed',
//     label: 'ORDER QTY ALLOWED',
//     type: 'select',
//     options: [
//       { value: 'DEFAULT', label: 'DEFAULT (Layer & Pallet Allowed)' },
//       { value: 'PALLET',  label: 'PALLET (Only Pallet Allowed)' },
//       { value: 'CASE',    label: 'CASE (Case, Layer & Pallet Allowed)' },
//     ]
//   },
//   { key: 'price_list',      label: 'PriceList',                     type: 'text' },
//   { key: 'price',           label: 'Standard price',                type: 'number' },
//   { key: 'promotion_price', label: 'Promotion Price (£)',           type: 'number' },
//   { key: 'from_date',       label: 'FromDate',                      type: 'date' },
//   { key: 'to_date',         label: 'ToDate',                        type: 'date' },
//   { key: 'shelf_life',      label: 'Shelf Life in Days',            type: 'number' },
//   { key: 'bbd',             label: 'Best before date (indicative)', type: 'text' },
// ]

// const ADVANCED_FIELDS = [
//   { key: 'cost',               label: 'Cost (£)',           type: 'number' },
//   { key: 'cost_from_date',     label: 'Cost From Date',     type: 'date' },
//   { key: 'cost_to_date',       label: 'Cost To Date',       type: 'date' },
//   { key: 'vat_code',           label: 'VAT Code',           type: 'select', options: [
//     { value: 'A', label: 'A (20%)' },
//     { value: 'Z', label: 'Z (0%)' },
//   ] },
//   { key: 'storage_type',       label: 'Storage Type',       type: 'select', options: ['Ambient','Frozen','Chilled'] },
//   { key: 'supplier_reference', label: 'Supplier Reference', type: 'text' },
//   { key: 'obsolete',           label: 'Obsolete',           type: 'text' },
//   { key: 'group_desc',         label: 'Group Description',  type: 'text' },
//   { key: 'qty_desc',           label: 'Qty Description',    type: 'select', options: [
//     { value: 'Case', label: 'Case' },
//     { value: 'Layer', label: 'Layer' },
//     { value: 'Pallet', label: 'Pallet' },
//   ] },
//   { key: 'units_of',            label: 'Units Of',           type: 'text' },
//   { key: 'inner_case_quantity', label: 'InnerCaseQuantity',  type: 'number' },
//   { key: 'outer_case_quantity', label: 'OuterCaseQuantity',  type: 'number' },
//   { key: 'layer_quantity',      label: 'Layer Quantity',     type: 'number' },
//   { key: 'pallet_quantity',     label: 'Pallet Quantity',    type: 'number' },
//   { key: 'weight',              label: 'Unit Weight',        type: 'number' },
//   { key: 'volume',              label: 'Unit Volume',        type: 'number' },
//   { key: 'comm_code',           label: 'Comm Code',          type: 'text' },
//   { key: 'intra_country',       label: 'Intra Country',      type: 'text' },
//   { key: 'intra_type',          label: 'IntraType',           type: 'text' },
// ]

// const WEBSITE_DESCRIPTION_FIELDS = [
//   { key: 'web_short_description', label: 'WebShortDescription', type: 'text' },
//   { key: 'web_long_description',  label: 'WebLongDescription',  type: 'textarea' },
// ]

// // ── Shared style tokens used by EditProductModal ───────────────────────────
// const EP_INP    = { width:'100%', padding:'7px 10px', border:'1px solid #ccc', borderRadius:'4px', fontSize:'14px', boxSizing:'border-box', background:'#fff', color:'#333', outline:'none' }
// const EP_BTN_SM = { background:'#f5f5f5', color:'#333', border:'1px solid #ccc', borderRadius:'4px', padding:'6px 12px', cursor:'pointer', fontSize:'13px', whiteSpace:'nowrap' }
// const EP_BTN_ORG = { background:'#f97316', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', cursor:'pointer', fontSize:'14px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }
// const EP_BTN_GH  = { background:'transparent', color:'#555', border:'1px solid #ccc', borderRadius:'4px', padding:'8px 18px', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', gap:'6px' }

// // Must be outside EditProductModal — if defined inside, React recreates it
// // on every keystroke causing inputs to lose focus (cursor jumps out).
// function FieldRow({ label, required, children }) {
//   return (
//     <tr>
//       <td style={{ width:'210px', verticalAlign:'top', paddingRight:'14px', paddingTop:'10px', textAlign:'right', fontSize:'13px', color:'#555', whiteSpace:'nowrap' }}>
//         {required && <span style={{ color:'#999', fontSize:'11px', marginRight:'4px' }}>(REQUIRED)</span>}{label}
//       </td>
//       <td style={{ paddingBottom:'12px', paddingTop:'4px' }}>{children}</td>
//     </tr>
//   )
// }


// function normalizeQtyDescForDisplay(value) {
//   const raw = String(value || '').trim()
//   if (!raw) return ''

//   const normalized = raw.toLowerCase()
//   if (normalized === 'case') return 'Case'
//   if (normalized === 'layer') return 'Layer'
//   if (normalized === 'pallet') return 'Pallet'

//   return raw
// }


// function isValidEan13(value) {
//   const digits = String(value || '').replace(/\D/g, '')
//   if (digits.length !== 13) return false

//   let sum = 0
//   for (let i = 0; i < 12; i += 1) {
//     const digit = Number(digits[i])
//     sum += i % 2 === 0 ? digit : digit * 3
//   }

//   const expected = (10 - (sum % 10)) % 10
//   return expected === Number(digits[12])
// }

// function getBarcodeRenderConfig(rawValue) {
//   const value = String(rawValue ?? '').trim()
//   if (!value) return null

//   const digits = value.replace(/\D/g, '')
//   if (digits === value && isValidEan13(digits)) {
//     return { value: digits, format: 'EAN13', validEan13: true }
//   }

//   // Preserve the exact ERP value. CODE128 is only a rendering fallback for
//   // test/legacy values whose EAN-13 checksum is not valid.
//   return { value, format: 'CODE128', validEan13: false }
// }

// function BarcodePreviewModal({ product, onClose }) {
//   const labelRef = useRef(null)
//   const barcodeOnlyRef = useRef(null)
//   const config = getBarcodeRenderConfig(product?.barcode_ean)

//   if (!config) return null

//   const productName = product?.description || 'Product'
//   const rawPrice = product?.effective_price ?? product?.price
//   const priceText = rawPrice === null || rawPrice === undefined || rawPrice === ''
//     ? null
//     : `£${Number(rawPrice).toFixed(2)}`

//   const printLabel = () => {
//     const labelMarkup = labelRef.current?.innerHTML
//     if (!labelMarkup) return

//     const printWindow = window.open('', '_blank', 'width=720,height=520')
//     if (!printWindow) {
//       alert('Please allow pop-ups for this site so the barcode print window can open.')
//       return
//     }

//     printWindow.document.write(`
//       <!doctype html>
//       <html>
//         <head>
//           <meta charset="utf-8" />
//           <title>Barcode ${String(product?.barcode_ean || '')}</title>
//           <style>
//             * { box-sizing: border-box; }
//             body {
//               margin: 0;
//               padding: 24px;
//               font-family: Arial, Helvetica, sans-serif;
//               background: #fff;
//               color: #000;
//             }
//             .print-wrap {
//               display: flex;
//               justify-content: center;
//               align-items: flex-start;
//             }
//             @page { margin: 12mm; }
//             @media print {
//               body { padding: 0; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="print-wrap">${labelMarkup}</div>
//         </body>
//       </html>
//     `)

//     printWindow.document.close()
//     printWindow.focus()
//     window.setTimeout(() => {
//       printWindow.print()
//     }, 250)
//   }

//   const downloadBarcode = () => {
//     const sourceSvg = barcodeOnlyRef.current?.querySelector('svg')
//     if (!sourceSvg) return

//     const svg = sourceSvg.cloneNode(true)
//     svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

//     const width = Math.max(1, Math.ceil(parseFloat(svg.getAttribute('width')) || 320))
//     const height = Math.max(1, Math.ceil(parseFloat(svg.getAttribute('height')) || 100))
//     const svgText = new XMLSerializer().serializeToString(svg)
//     const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
//     const svgUrl = URL.createObjectURL(svgBlob)
//     const image = new Image()

//     image.onload = () => {
//       const scale = 3
//       const canvas = document.createElement('canvas')
//       canvas.width = width * scale
//       canvas.height = height * scale

//       const ctx = canvas.getContext('2d')
//       if (!ctx) {
//         URL.revokeObjectURL(svgUrl)
//         return
//       }

//       ctx.fillStyle = '#ffffff'
//       ctx.fillRect(0, 0, canvas.width, canvas.height)
//       ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
//       URL.revokeObjectURL(svgUrl)

//       canvas.toBlob(blob => {
//         if (!blob) return

//         const pngUrl = URL.createObjectURL(blob)
//         const link = document.createElement('a')
//         const safeName = String(product?.barcode_ean || 'barcode').replace(/[^A-Za-z0-9_-]/g, '_')
//         link.href = pngUrl
//         link.download = `${safeName}.png`
//         document.body.appendChild(link)
//         link.click()
//         link.remove()
//         URL.revokeObjectURL(pngUrl)
//       }, 'image/png')
//     }

//     image.onerror = () => {
//       URL.revokeObjectURL(svgUrl)
//       alert('The barcode image could not be generated. Please try again.')
//     }

//     image.src = svgUrl
//   }

//   return (
//     <div
//       onClick={onClose}
//       style={{
//         position:'fixed', inset:0, background:'rgba(0,0,0,.72)',
//         display:'flex', alignItems:'center', justifyContent:'center',
//         zIndex:2200, padding:'20px'
//       }}
//     >
//       <div
//         onClick={e => e.stopPropagation()}
//         style={{
//           width:'100%', maxWidth:'620px', background:'#f3f4f6',
//           borderRadius:'10px', padding:'20px', boxShadow:'0 20px 60px rgba(0,0,0,.35)',
//           color:'#111', position:'relative'
//         }}
//       >
//         <button
//           type="button"
//           onClick={onClose}
//           aria-label="Close barcode preview"
//           style={{
//             position:'absolute', right:'14px', top:'12px', border:'none',
//             background:'transparent', cursor:'pointer', color:'#555'
//           }}
//         >
//           <X size={20} />
//         </button>

//         <h3 style={{ margin:'0 0 16px', fontSize:'18px' }}>Barcode preview</h3>

//         <div style={{ display:'flex', justifyContent:'center', padding:'18px 10px' }}>
//           <div
//             ref={labelRef}
//             style={{
//               width:'340px', minHeight:'170px', background:'#fff',
//               border:'1px solid #d1d5db', padding:'16px 18px',
//               display:'flex', flexDirection:'column', alignItems:'center',
//               justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,.12)'
//             }}
//           >
//             <div style={{ fontWeight:700, fontSize:'16px', textAlign:'center', marginBottom:'4px' }}>
//               {productName}
//             </div>
//             {priceText && (
//               <div style={{ fontSize:'13px', marginBottom:'10px' }}>
//                 Price: {priceText}
//               </div>
//             )}
//             <Barcode
//               value={config.value}
//               format={config.format}
//               width={2}
//               height={62}
//               margin={4}
//               fontSize={13}
//               displayValue
//               background="#ffffff"
//               lineColor="#000000"
//             />
//           </div>
//         </div>

//         {!config.validEan13 && (
//           <div style={{
//             margin:'0 auto 14px', maxWidth:'480px', fontSize:'12px',
//             color:'#92400e', background:'#fffbeb', border:'1px solid #fde68a',
//             borderRadius:'6px', padding:'8px 10px', lineHeight:1.4
//           }}>
//             This stored value does not have a valid EAN-13 checksum. The exact ERP value is preserved,
//             and Code 128 is used only for the preview/download so the barcode can still be rendered.
//           </div>
//         )}

//         <div style={{ display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap' }}>
//           <button
//             type="button"
//             onClick={printLabel}
//             style={{ ...EP_BTN_SM, display:'inline-flex', alignItems:'center', gap:'7px' }}
//           >
//             <Printer size={16} /> Print label
//           </button>
//           <button
//             type="button"
//             onClick={downloadBarcode}
//             style={{ ...EP_BTN_SM, display:'inline-flex', alignItems:'center', gap:'7px' }}
//           >
//             <Download size={16} /> Download barcode PNG
//           </button>
//         </div>

//         {/* Off-screen render used only to create the downloadable barcode-only PNG. */}
//         <div
//           ref={barcodeOnlyRef}
//           aria-hidden="true"
//           style={{ position:'fixed', left:'-10000px', top:'-10000px', background:'#fff' }}
//         >
//           <Barcode
//             value={config.value}
//             format={config.format}
//             width={2}
//             height={70}
//             margin={8}
//             displayValue={false}
//             background="#ffffff"
//             lineColor="#000000"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// function adminProductImageUrl(filename, cacheBust = '') {
//   const raw = String(filename || '').trim()
//   if (!raw) return ''
//   if (/^https?:\/\//i.test(raw)) return raw

//   const clean = raw.replace(/^\/+/, '')
//   const parts = clean.split('/').filter(Boolean).map(encodeURIComponent)
//   const relative = parts.join('/')
//   const base = relative.startsWith('products/') ? `/${relative}` : `/products/${relative}`
//   return cacheBust ? `${base}?v=${encodeURIComponent(cacheBust)}` : base
// }

// function AdminProductImageTile({
//   filename,
//   label,
//   selected,
//   onSelect,
//   onRemove,
//   cacheBust,
//   disabled = false,
// }) {
//   const [failed, setFailed] = useState(false)

//   useEffect(() => {
//     setFailed(false)
//   }, [filename, cacheBust])

//   if (!filename) return null

//   const src = adminProductImageUrl(filename, cacheBust)

//   return (
//     <div
//       role="button"
//       tabIndex={disabled ? -1 : 0}
//       onClick={() => {
//         if (!disabled) onSelect?.()
//       }}
//       onKeyDown={event => {
//         if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
//           event.preventDefault()
//           onSelect?.()
//         }
//       }}
//       title="Use this image on the website"
//       style={{
//         width:'220px',
//         padding:0,
//         border: selected ? '2px solid #2563eb' : '1px solid #d1d5db',
//         borderRadius:'4px',
//         background:'#fff',
//         cursor: disabled ? 'wait' : 'pointer',
//         overflow:'hidden',
//         position:'relative',
//         textAlign:'left',
//         boxShadow: selected ? '0 0 0 2px rgba(37,99,235,.12)' : 'none',
//         opacity: disabled ? .72 : 1,
//       }}
//     >
//       <button
//         type="button"
//         aria-label={`Remove ${label}`}
//         title="Remove image"
//         disabled={disabled}
//         onClick={event => {
//           event.stopPropagation()
//           if (!disabled) onRemove?.()
//         }}
//         style={{
//           position:'absolute',
//           top:'8px',
//           right:'8px',
//           zIndex:3,
//           width:'25px',
//           height:'25px',
//           borderRadius:'50%',
//           border:'1px solid #d1d5db',
//           background:'#fff',
//           color:'#dc2626',
//           display:'flex',
//           alignItems:'center',
//           justifyContent:'center',
//           padding:0,
//           cursor: disabled ? 'wait' : 'pointer',
//           fontSize:'18px',
//           lineHeight:1,
//           fontWeight:700,
//           boxShadow:'0 1px 4px rgba(0,0,0,.15)',
//         }}
//       >
//         ×
//       </button>

//       <div style={{ height:'220px', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px', background:'#fff' }}>
//         {!failed ? (
//           <img
//             src={src}
//             alt={label}
//             onError={() => setFailed(true)}
//             style={{ maxWidth:'100%', maxHeight:'200px', objectFit:'contain', display:'block' }}
//           />
//         ) : (
//           <div style={{ color:'#9ca3af', fontSize:'12px', textAlign:'center', lineHeight:1.5, padding:'10px' }}>
//             Image file not found.<br />
//             <span style={{ wordBreak:'break-all' }}>{filename}</span>
//           </div>
//         )}
//       </div>

//       <div style={{
//         position:'relative',
//         borderTop:'1px solid #e5e7eb',
//         padding: selected ? '9px 38px 9px 10px' : '9px 10px',
//         minHeight:'37px',
//         boxSizing:'border-box',
//         fontSize:'12px',
//         fontWeight:600,
//         color:'#374151',
//         textAlign:'center'
//       }}>
//         {label}
//         {selected && (
//           <span
//             aria-label="Selected for website"
//             title="Currently used on the website"
//             style={{
//               position:'absolute',
//               right:'8px',
//               top:'50%',
//               transform:'translateY(-50%)',
//               width:'24px',
//               height:'24px',
//               borderRadius:'50%',
//               background:'#2563eb',
//               color:'#fff',
//               display:'flex',
//               alignItems:'center',
//               justifyContent:'center',
//               fontSize:'15px',
//               fontWeight:700
//             }}
//           >✓</span>
//         )}
//       </div>
//     </div>
//   )
// }

// function EditProductModal({ product, onClose, onSaved }) {
//   const [form, setForm] = useState(() => {
//     const currentRule = String(product?.order_qty_allowed || 'DEFAULT').toUpperCase()
//     const normalized = ['DEFAULT', 'PALLET', 'CASE'].includes(currentRule) ? currentRule : 'DEFAULT'
//     return {
//       ...product,
//       order_qty_allowed: normalized
//     }
//   })
//   const [tab, setTab]   = useState('General')
//   const [relatedProductsType, setRelatedProductsType] = useState('None')
//   const [busy, setBusy] = useState(false)
//   const [barcodePreviewOpen, setBarcodePreviewOpen] = useState(false)
//   const [imageUploading, setImageUploading] = useState(false)
//   const [imageSelecting, setImageSelecting] = useState(false)
//   const [imageDeleting, setImageDeleting] = useState(false)
//   const [imageRemoveConfirm, setImageRemoveConfirm] = useState({
//     open: false,
//     source: null,
//     imageId: null,
//   })
//   const [imageUploadError, setImageUploadError] = useState('')
//   const [imageCacheBust, setImageCacheBust] = useState('')
//   const imageFileRef = useRef(null)
//   const [allBrands,     setAllBrands]     = useState([])
//   const [allCategories, setAllCategories] = useState([])
//   const [catSearch,     setCatSearch]     = useState('')
//   const [showCatDrop,   setShowCatDrop]   = useState(false)

//   // selected categories: array of {id, name, type: 'brand'|'category'}
//   const [selCats, setSelCats] = useState(() => {
//     const arr = []
//     if (product.brand)    arr.push({ id: `b_${product.brand_id}`,    name: product.brand.brand_name,       type: 'brand' })
//     if (product.category) arr.push({ id: `c_${product.category_id}`, name: product.category.category_name, type: 'category' })
//     return arr
//   })

//   useEffect(() => {
//     getBrands().then(d => setAllBrands(d || [])).catch(() => {})
//     getCategories().then(d => setAllCategories(d || [])).catch(() => {})

//     if (product && product.shelf_life) {
//       const days = parseInt(product.shelf_life, 10)
//       if (!isNaN(days) && days > 0) {
//         const d = new Date()
//         d.setDate(d.getDate() + days)
//         const calcBbd = d.toISOString().split('T')[0]
//         setForm(f => ({ ...f, bbd: f.bbd || calcBbd }))
//       }
//     }
//   }, [product])

//   const addCat = (item) => {
//     if (!selCats.find(s => s.id === item.id)) {
//       const next = [...selCats, item]
//       setSelCats(next)
//       // update form: set brand_id / category_id to first of each type
//       const brand = next.find(s => s.type === 'brand')
//       const cat   = next.find(s => s.type === 'category')
//       setForm(f => ({ ...f, brand_id: brand ? parseInt(brand.id.slice(2)) : f.brand_id, category_id: cat ? parseInt(cat.id.slice(2)) : f.category_id }))
//     }
//     setCatSearch('')
//     setShowCatDrop(false)
//   }

//   const removeCat = (id) => {
//     const next = selCats.filter(s => s.id !== id)
//     setSelCats(next)
//     const brand = next.find(s => s.type === 'brand')
//     const cat   = next.find(s => s.type === 'category')
//     setForm(f => ({ ...f, brand_id: brand ? parseInt(brand.id.slice(2)) : null, category_id: cat ? parseInt(cat.id.slice(2)) : null }))
//   }

//   const catOptions = [
//     ...allBrands.map(b => ({ id: `b_${b.id}`, name: `- ${b.brand_name}`, type: 'brand' })),
//     ...allCategories.map(c => ({ id: `c_${c.id}`, name: `-- ${c.category_name}`, type: 'category' })),
//   ].filter(o => o.name.toLowerCase().includes(catSearch.toLowerCase()) && !selCats.find(s => s.id === o.id))

//   const hc = (key, val) => {
//     setForm(f => {
//       const next = { ...f, [key]: val }
//       if (key === 'shelf_life') {
//         const days = parseInt(val, 10)
//         if (!isNaN(days) && days > 0) {
//           const d = new Date()
//           d.setDate(d.getDate() + days)
//           next.bbd = d.toISOString().split('T')[0]
//         } else {
//           next.bbd = ''
//         }
//       }
//       return next
//     })
//   }


//   const applyImageMetadata = (result) => {
//     const hasErpImage = Object.prototype.hasOwnProperty.call(result, 'erp_web_image')
//     const hasEffectiveImage = Object.prototype.hasOwnProperty.call(result, 'effective_web_image')

//     setForm(current => ({
//       ...current,
//       web_image: hasErpImage ? result.erp_web_image : current.web_image,
//       erp_web_image: hasErpImage
//         ? result.erp_web_image
//         : (current.erp_web_image ?? current.web_image),
//       manual_web_image: result.manual_web_image ?? null,
//       effective_web_image: hasEffectiveImage
//         ? result.effective_web_image
//         : (result.manual_web_image ?? current.erp_web_image ?? current.web_image),
//       selected_image_source: result.selected_image_source || (result.manual_web_image ? 'manual' : 'erp'),
//       selected_image_id: result.selected_image_id ?? null,
//       manual_images: Array.isArray(result.manual_images) ? result.manual_images : (current.manual_images || []),
//     }))
//     setImageCacheBust(String(Date.now()))
//   }

//   const handleProductImageUpload = async (event) => {
//     const file = event.target.files?.[0]
//     event.target.value = ''

//     if (!file) return
//     if (!product?.id) {
//       alert('Please save the product before uploading an image.')
//       return
//     }

//     const uploadData = new FormData()
//     uploadData.append('image', file)

//     setImageUploading(true)
//     setImageUploadError('')

//     try {
//       const result = await uploadProductImage(product.id, uploadData)
//       applyImageMetadata(result)
//       onSaved?.()
//     } catch (error) {
//       setImageUploadError(error.message || 'Image upload failed.')
//     } finally {
//       setImageUploading(false)
//     }
//   }

//   const handleSelectWebsiteImage = async (source, imageId = null) => {
//     if (!product?.id || imageSelecting) return

//     setImageSelecting(true)
//     setImageUploadError('')

//     try {
//       const result = await selectProductImage(product.id, source, imageId)
//       applyImageMetadata(result)
//       onSaved?.()
//     } catch (error) {
//       setImageUploadError(error.message || 'The website image could not be changed.')
//     } finally {
//       setImageSelecting(false)
//     }
//   }

//   const handleRemoveProductImage = (source, imageId = null) => {
//     if (!product?.id || imageDeleting) return

//     setImageRemoveConfirm({
//       open: true,
//       source,
//       imageId,
//     })
//   }

//   const confirmRemoveProductImage = async () => {
//     if (!product?.id || imageDeleting || !imageRemoveConfirm.source) return

//     const { source, imageId } = imageRemoveConfirm

//     setImageDeleting(true)
//     setImageUploadError('')

//     try {
//       const result = await removeProductImage(product.id, source, imageId)
//       applyImageMetadata(result)
//         setImageRemoveConfirm({ open: false, source: null, imageId: null })
//       onSaved?.()
//     } catch (error) {
//       setImageUploadError(error.message || 'The image could not be removed.')
//       setImageRemoveConfirm({ open: false, source: null, imageId: null })
//     } finally {
//       setImageDeleting(false)
//     }
//   }

//   const save = async (closeAfter) => {
//     if (!product?.id && !String(form.navsa_product_code || '').trim()) {
//       alert('NAVSA Product Code is required for a manually created product.')
//       return
//     }

//     setBusy(true)
//     try {
//       const payload = { ...form }
//       if (product && product.id) {
//         delete payload.navsa_product_code
//         delete payload.reference
//         await updateProduct(product.id, payload)
//       } else {
//         await createProduct(payload)
//       }
//       onSaved()
//       if (closeAfter) onClose()
//     } catch (e) { alert(e.message) }
//     finally { setBusy(false) }
//   }

//   const inp    = EP_INP
//   const btnSm  = EP_BTN_SM
//   const btnOrg = EP_BTN_ORG
//   const btnGh  = EP_BTN_GH
//   const Row    = FieldRow

//   const renderGeneral = () => (
//     <table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>
//       <Row label="Product name" required>
//         <input value={form.description || ''} onChange={e => hc('description', e.target.value)} style={{ ...inp }} />
//       </Row>
//       <Row label="Categories" required>
//         <div style={{ position:'relative' }}>
//           <div
//             onClick={() => setShowCatDrop(v => !v)}
//             style={{ border:'1px solid #ccc', borderRadius:'4px', padding:'6px 8px', display:'flex', flexWrap:'wrap', gap:'6px', minHeight:'38px', background:'#fff', cursor:'text' }}
//           >
//             {selCats.map(s => (
//               <span key={s.id} style={{ background:'#dbeafe', color:'#1d4ed8', borderRadius:'4px', padding:'2px 8px', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px' }}>
//                 {s.name}
//                 <span onClick={e => { e.stopPropagation(); removeCat(s.id) }} style={{ cursor:'pointer', fontWeight:'bold', marginLeft:'2px' }}>×</span>
//               </span>
//             ))}
//             <input
//               value={catSearch}
//               onChange={e => { setCatSearch(e.target.value); setShowCatDrop(true) }}
//               onClick={e => { e.stopPropagation(); setShowCatDrop(true) }}
//               placeholder={selCats.length === 0 ? 'Search brand or category...' : ''}
//               style={{ border:'none', outline:'none', fontSize:'13px', minWidth:'120px', flex:1, color:'#333', background:'transparent' }}
//             />
//           </div>
//           {showCatDrop && catOptions.length > 0 && (
//             <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #ccc', borderRadius:'4px', zIndex:10, maxHeight:'200px', overflowY:'auto', boxShadow:'0 4px 12px rgba(0,0,0,.15)' }}>
//               {catOptions.slice(0, 30).map(o => (
//                 <div key={o.id} onClick={() => addCat(o)}
//                   style={{ padding:'8px 12px', cursor:'pointer', fontSize:'13px', color:'#333' }}
//                   onMouseEnter={e => e.target.style.background='#f0f4ff'}
//                   onMouseLeave={e => e.target.style.background='transparent'}
//                 >
//                   {o.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </Row>
//       <Row label="NAVSA Product Code" required>
//         <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
//           <input
//             value={form.navsa_product_code || ''}
//             onChange={e => {
//               if (!product?.id) hc('navsa_product_code', e.target.value)
//             }}
//             readOnly={Boolean(product?.id)}
//             placeholder="e.g. 467357"
//             title={product?.id ? 'Imported NAVSA Product Code — this identifier cannot be changed in the admin panel.' : 'Enter the NAVSA Product Code for this manually created product.'}
//             style={{
//               ...inp,
//               maxWidth:'200px',
//               background: product?.id ? '#f3f4f6' : '#fff',
//               color: product?.id ? '#4b5563' : '#333',
//               cursor: product?.id ? 'default' : 'text'
//             }}
//           />
//           {product?.id && (
//             <span style={{ color:'#6b7280', fontSize:'12px' }}>Read-only ERP identifier</span>
//           )}
//         </div>
//       </Row>
//       <Row label="Barcode (EAN-13)">
//         <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
//           <input
//             value={form.barcode_ean || ''}
//             onChange={e => hc('barcode_ean', e.target.value)}
//             placeholder="13-digit EAN barcode"
//             style={{ ...inp, maxWidth:'200px' }}
//           />
//           <button
//             type="button"
//             onClick={() => setBarcodePreviewOpen(true)}
//             disabled={!String(form.barcode_ean || '').trim()}
//             title="Preview / print barcode"
//             aria-label="Preview / print barcode"
//             style={{
//               ...btnSm,
//               width:'38px',
//               height:'36px',
//               padding:0,
//               display:'inline-flex',
//               alignItems:'center',
//               justifyContent:'center',
//               opacity: String(form.barcode_ean || '').trim() ? 1 : .45,
//               cursor: String(form.barcode_ean || '').trim() ? 'pointer' : 'not-allowed'
//             }}
//           >
//             <Printer size={17} />
//           </button>
//         </div>
//       </Row>
//       <Row label="Barcode Case">
//         <input value={form.barcode_case || ''} onChange={e => hc('barcode_case', e.target.value)} placeholder="Case barcode" style={{ ...inp, maxWidth:'200px' }} />
//       </Row>
//       <Row label="Price (£)" required>
//         <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
//           <input type="number" step="0.01" value={form.price || ''} onChange={e => hc('price', e.target.value)} style={{ ...inp, maxWidth:'140px' }} />
//           <span style={{ color:'#1d4ed8', fontSize:'13px', cursor:'pointer' }}>(Advanced pricing info)</span>
//         </div>
//       </Row>
//       <Row label="Live?">
//         <div style={{ display:'flex', gap:'20px', paddingTop:'8px' }}>
//           <label style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'14px', color:'#333' }}>
//             <input type="radio" name={`live_${product?.id || 'new'}`} checked={form.live_for_web === true || Number(form.live_for_web) === 1} onChange={() => hc('live_for_web', 1)} /> Yes
//           </label>
//           <label style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'14px', color:'#333' }}>
//             <input type="radio" name={`live_${product?.id || 'new'}`} checked={!(form.live_for_web === true || Number(form.live_for_web) === 1)} onChange={() => hc('live_for_web', 0)} /> No
//           </label>
//         </div>
//       </Row>
//       <tr><td colSpan={2} style={{ paddingBottom:'12px' }}>
//         <div style={{ border:'1px solid #ccc', borderRadius:'4px', overflow:'hidden' }}>
//           <textarea rows={5} value={form.web_long_description || ''} onChange={e => hc('web_long_description', e.target.value)}
//             style={{ width:'100%', border:'none', outline:'none', padding:'10px', fontSize:'14px', resize:'vertical', fontFamily:'inherit', boxSizing:'border-box', color:'#333', display:'block' }} />
//         </div>
//       </td></tr>
//     </tbody></table>
//   )

//   const renderImages = () => {
//     const erpImageName = String(form.erp_web_image || form.web_image || '').trim()
//     const manualImages = Array.isArray(form.manual_images)
//       ? form.manual_images
//       : (Array.isArray(product?.manual_images) ? product.manual_images : [])
//     const selectedSource = form.selected_image_source || product?.selected_image_source || (form.manual_web_image ? 'manual' : 'erp')
//     const selectedImageId = Number(form.selected_image_id ?? product?.selected_image_id ?? 0) || null
//     const imageBusy = imageUploading || imageSelecting || imageDeleting

//     return (
//       <div style={{ color:'#333' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap', paddingBottom:'18px', borderBottom:'1px solid #e5e7eb' }}>
//           <button
//             type="button"
//             onClick={() => imageFileRef.current?.click()}
//             disabled={imageBusy || !product?.id}
//             style={{
//               ...btnSm,
//               display:'inline-flex', alignItems:'center', gap:'7px',
//               opacity: imageBusy || !product?.id ? .55 : 1,
//               cursor: imageBusy || !product?.id ? 'not-allowed' : 'pointer'
//             }}
//           >
//             <Upload size={17} /> {imageUploading ? 'Uploading...' : 'Upload Files'}
//           </button>
//           <input
//             ref={imageFileRef}
//             type="file"
//             accept="image/*"
//             onChange={handleProductImageUpload}
//             style={{ display:'none' }}
//           />
//           <span style={{ color:'#4b5563', fontSize:'13px' }}>
//             <strong>Square</strong> size recommended: 1600px x 1600px
//           </span>
//         </div>

//         {!product?.id && (
//           <div style={{ marginTop:'12px', color:'#92400e', fontSize:'12px' }}>
//             Save this new product first, then the image upload button will become available.
//           </div>
//         )}

//         {imageUploadError && (
//           <div style={{ marginTop:'12px', padding:'9px 11px', border:'1px solid #fecaca', background:'#fef2f2', color:'#b91c1c', borderRadius:'5px', fontSize:'12px' }}>
//             {imageUploadError}
//           </div>
//         )}

//         <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', flexWrap:'wrap', marginTop:'18px' }}>
//           <AdminProductImageTile
//             filename={erpImageName}
//             label="ERP WebImage"
//             selected={selectedSource === 'erp'}
//             onSelect={() => handleSelectWebsiteImage('erp')}
//             onRemove={() => handleRemoveProductImage('erp')}
//             cacheBust="erp"
//             disabled={imageBusy}
//           />

//           {manualImages.map(image => {
//             const isSelected = selectedSource === 'manual' && Number(image.id) === selectedImageId
//             return (
//               <AdminProductImageTile
//                 key={image.id}
//                 filename={image.image_name}
//                 label={isSelected ? 'Current website image (manual upload)' : 'Manual upload'}
//                 selected={isSelected}
//                 onSelect={() => handleSelectWebsiteImage('manual', image.id)}
//                 onRemove={() => handleRemoveProductImage('manual', image.id)}
//                 cacheBust={imageCacheBust || image.id}
//                 disabled={imageBusy}
//               />
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const renderRelated = () => (
//     <div style={{ color:'#333' }}>
//       <div style={{ paddingBottom:'18px', borderBottom:'1px solid #e5e7eb', color:'#4b5563', fontSize:'13px', lineHeight:1.55 }}>
//         Related Products allows you to link a product/s to another product in your webshop; also known as upsell/cross sell.
//       </div>

//       <table style={{ width:'100%', borderCollapse:'collapse', marginTop:'18px' }}>
//         <tbody>
//           <Row label="Related Products Type">
//             <select
//               value={relatedProductsType}
//               onChange={e => setRelatedProductsType(e.target.value)}
//               style={{ ...inp, maxWidth:'340px' }}
//             >
//               <option value="None">None</option>
//               <option value="Category">Category</option>
//               <option value="Same Category">Same Category</option>
//               <option value="Selected Products">Selected Products</option>
//             </select>
//           </Row>
//         </tbody>
//       </table>
//     </div>
//   )

//   const renderFieldList = (fields) => (
//     <table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>
//       {fields.map(f => {
//         const isBbd = f.key === 'bbd'
//         const isReadOnly = Boolean(f.readOnly)
//         let fieldVal = form[f.key] || ''
//         if (f.type === 'date' && fieldVal && typeof fieldVal === 'string') {
//           fieldVal = fieldVal.split('T')[0].split(' ')[0]
//         }
//         const selectValue = f.key === 'qty_desc'
//           ? normalizeQtyDescForDisplay(form[f.key])
//           : (form[f.key] || '')

//         return (
//           <Row key={f.key + f.label} label={f.label}>
//             {f.type === 'textarea' ? (
//               <textarea rows={3} value={form[f.key] || ''} onChange={e => hc(f.key, e.target.value)} style={{ ...inp, resize:'vertical' }} />
//             ) : f.type === 'select' ? (
//               <select
//                 value={selectValue}
//                 onChange={e => { if (!isReadOnly) hc(f.key, e.target.value) }}
//                 aria-readonly={isReadOnly ? 'true' : undefined}
//                 title={isReadOnly ? 'ERP-controlled value from the Datafeed QtyDesc column. The options can be viewed but the saved value cannot be changed here.' : undefined}
//                 style={{
//                   ...inp,
//                   background: isReadOnly ? '#f3f4f6' : '#fff',
//                   color: isReadOnly ? '#4b5563' : '#333',
//                   cursor: isReadOnly ? 'default' : 'pointer'
//                 }}
//               >
//                 {!selectValue && <option value="">—</option>}
//                 {f.options.map(o => {
//                   const val = typeof o === 'object' ? o.value : o
//                   const lbl = typeof o === 'object' ? o.label : o
//                   return <option key={val} value={val}>{lbl}</option>
//                 })}
//               </select>
//             ) : (
//               <input
//                 type={f.type || 'text'}
//                 value={fieldVal}
//                 onChange={e => hc(f.key, e.target.value)}
//                 disabled={isBbd}
//                 style={{
//                   ...inp,
//                   maxWidth: f.type === 'number' ? '200px' : '100%',
//                   background: isBbd ? '#f3f4f6' : '#fff',
//                   color: isBbd ? '#6b7280' : '#333',
//                   cursor: isBbd ? 'not-allowed' : 'text'
//                 }}
//               />
//             )}
//           </Row>
//         )
//       })}
//     </tbody></table>
//   )

//   const renderTab = () => {
//     if (tab === 'General')  return renderGeneral()
//     if (tab === 'Advanced') return renderFieldList(ADVANCED_FIELDS)
//     if (tab === 'Extra')    return renderFieldList(EXTRA_FIELDS)
//     if (tab === 'Images')   return renderImages()
//     if (tab === 'Related')  return renderRelated()
//     if (tab === 'Website description') return renderFieldList(WEBSITE_DESCRIPTION_FIELDS)
//     return null
//   }

//   return (
//     <>
//       {barcodePreviewOpen && (
//         <BarcodePreviewModal
//           product={{ ...product, ...form }}
//           onClose={() => setBarcodePreviewOpen(false)}
//         />
//       )}
//       <ConfirmModal
//         open={imageRemoveConfirm.open}
//         title="Remove image?"
//         message="Are you sure you want to remove this image?"
//         confirmText="Yes, remove"
//         cancelText="Cancel"
//         eyebrow="REMOVE IMAGE"
//         icon="×"
//         variant="danger"
//         loading={imageDeleting}
//         closeOnBackdrop={!imageDeleting}
//         onConfirm={confirmRemoveProductImage}
//         onClose={() => {
//           if (!imageDeleting) {
//             setImageRemoveConfirm({ open: false, source: null, imageId: null })
//           }
//         }}
//       />
//       <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, overflowY:'auto', padding:'20px' }}>
//       <div style={{ background:'#fff', borderRadius:'8px', width:'100%', maxWidth:'860px', boxShadow:'0 8px 40px rgba(0,0,0,.35)', display:'flex', flexDirection:'column', maxHeight:'92vh', color:'#333' }}>
//         <div style={{ padding:'18px 24px 0', borderBottom:'1px solid #e5e7eb', position:'relative' }}>
//           <button type="button" onClick={onClose} style={{ position:'absolute', right:'16px', top:'16px', background:'none', border:'none', fontSize:'22px', cursor:'pointer', color:'#666', lineHeight:1 }}>x</button>
//           <h3 style={{ margin:0, marginBottom:'14px', fontSize:'20px', fontWeight:700, color:'#111' }}>Edit a product</h3>
//           <div style={{ display:'flex', overflowX:'auto' }}>
//             {ALL_TABS.map(t => (
//               <button type="button" key={t} onClick={() => setTab(t)} style={{
//                 padding:'8px 16px', background:'transparent', border:'none',
//                 borderBottom: t === tab ? '2px solid #1d4ed8' : '2px solid transparent',
//                 color: t === tab ? '#1d4ed8' : '#555', cursor:'pointer', fontSize:'13px',
//                 fontWeight: t === tab ? 600 : 400, whiteSpace:'nowrap'
//               }}>{t}</button>
//             ))}
//           </div>
//         </div>
//         <form onSubmit={e => e.preventDefault()} style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'hidden' }}>
//           <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
//             {renderTab()}
//           </div>
//           <div style={{ padding:'14px 24px', borderTop:'1px solid #e5e7eb', display:'flex', gap:'10px', justifyContent:'flex-end', background:'#fafafa', borderRadius:'0 0 8px 8px' }}>
//             <button type="button" onClick={onClose} style={btnGh}>Cancel</button>
//             <button type="button" onClick={() => save(true)} disabled={busy} style={btnOrg}>
//               {busy ? 'Saving...' : 'Save changes & close'}
//             </button>
//             <button type="button" onClick={() => save(false)} disabled={busy} style={{ ...btnOrg, background:'#ea580c' }}>
//               {busy ? 'Saving...' : 'Save changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//     </>
//   )
// }

// function ErpImportModal({ onClose, onImportDone, mode = 'erp' }) {
//   const [file, setFile] = useState(null)
//   const [uploading, setUploading] = useState(false)
//   const [result, setResult] = useState(null)
//   const [error, setError] = useState(null)

//   const isStep1 = mode === 'step1'
//   const modalTitle = isStep1 ? 'Step 1 Converted Excel Import' : 'Bulk ERP Excel Import'
//   const modalSubtitle = isStep1 
//     ? 'Upload converted website data file (Step 1 - Converted file from ERP to Website Data.xlsx)'
//     : 'Upload your ERP system file (e.g. Datafeed from ERP system.xlsx)'
//   const accentGradient = isStep1 ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#10b981,#059669)'
//   const accentColor = isStep1 ? '#3b82f6' : '#10b981'

//   const handleUpload = async (e) => {
//     e.preventDefault()
//     if (!file) return
//     setUploading(true)
//     setError(null)
//     setResult(null)

//     const formData = new FormData()
//     formData.append('file', file)
//     if (mode) {
//       formData.append('mode', mode)
//     }

//     try {
//       const res = await uploadErpExcel(formData)
//       setResult(res)
//       if (onImportDone) onImportDone()
//     } catch (err) {
//       setError(err.message || 'Failed to import Excel file.')
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'20px' }}>
//       <div onClick={e => e.stopPropagation()} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'560px', padding:'28px', position:'relative', color:'#fff' }}>
//         <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
        
//         <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
//           <div style={{ width:'46px', height:'46px', borderRadius:'12px', background: accentGradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>📊</div>
//           <div>
//             <h3 style={{ margin:0, fontSize:'18px', fontWeight:700 }}>{modalTitle}</h3>
//             <p style={{ margin:'2px 0 0', color:'#94a3b8', fontSize:'12px' }}>{modalSubtitle}</p>
//           </div>
//         </div>

//         {!result ? (
//           <form onSubmit={handleUpload}>
//             <div style={{ border:'2px dashed rgba(255,255,255,0.2)', borderRadius:'12px', padding:'24px', textAlign:'center', background:'rgba(255,255,255,0.02)', marginBottom:'20px' }}>
//               <Upload size={36} style={{ color: accentColor, marginBottom:'12px' }} />
//               <div style={{ fontSize:'14px', fontWeight:600, marginBottom:'4px' }}>Select or Drag ERP Excel File (.xlsx, .xls)</div>
//               <div style={{ fontSize:'12px', color:'#94a3b8', marginBottom:'16px' }}>Existing products will be updated; new products will be created automatically.</div>
//               <input
//                 type="file"
//                 accept=".xlsx,.xls,.csv"
//                 onChange={e => {
//                   setFile(e.target.files[0])
//                   setError(null)
//                 }}
//                 style={{ display:'none' }}
//                 id="erp-file-input"
//               />
//               <label htmlFor="erp-file-input" style={{ background:'rgba(59,130,246,0.15)', color:'#3b82f6', border:'1px solid rgba(59,130,246,0.3)', padding:'8px 18px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:600, display:'inline-block' }}>
//                 {file ? file.name : '📁 Browse Excel File'}
//               </label>
//             </div>

//             {error && (
//               <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', padding:'14px 16px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px', whiteSpace:'pre-line', lineHeight:1.5, maxHeight:'220px', overflowY:'auto' }}>
//                 ⚠️ {error}
//               </div>
//             )}

//             {uploading ? (
//               <div style={{ textAlign:'center', padding:'16px' }}>
//                 <div style={{ display:'inline-block', width:'28px', height:'28px', border:'3px solid rgba(16,185,129,0.3)', borderTopColor:'#10b981', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
//                 <p style={{ margin:'12px 0 0', color:'#10b981', fontSize:'13px', fontWeight:600 }}>Processing ERP file... Please wait (~20,000 products)</p>
//                 <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
//               </div>
//             ) : (
//               <button
//                 type="submit"
//                 disabled={!file}
//                 className="admin-btn"
//                 style={{ width:'100%', background: file ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.1)', color: file ? '#fff' : '#64748b', cursor: file ? 'pointer' : 'not-allowed', padding:'12px', fontSize:'14px', fontWeight:700, borderRadius:'8px' }}
//               >
//                 🚀 Upload & Sync Products
//               </button>
//             )}
//           </form>
//         ) : (
//           <div>
//             <div style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'12px', padding:'20px', marginBottom:'20px' }}>
//               <div style={{ color:'#10b981', fontWeight:700, fontSize:'16px', marginBottom:'12px' }}>✅ {result.message}</div>
//               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', fontSize:'13px' }}>
//                 <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
//                   <span style={{ color:'#94a3b8' }}>Total Processed:</span> <strong style={{ color:'#fff' }}>{result.total}</strong>
//                 </div>
//                 <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
//                   <span style={{ color:'#94a3b8' }}>Imported:</span> <strong style={{ color:'#10b981' }}>{result.imported}</strong>
//                 </div>
//                 <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
//                   <span style={{ color:'#94a3b8' }}>New Created:</span> <strong style={{ color:'#3b82f6' }}>{result.created}</strong>
//                 </div>
//                 <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
//                   <span style={{ color:'#94a3b8' }}>Existing Updated:</span> <strong style={{ color:'#f59e0b' }}>{result.updated}</strong>
//                 </div>
//               </div>
//             </div>

//             <button onClick={onClose} className="admin-btn admin-btn-primary" style={{ width:'100%', padding:'10px' }}>
//               View Excel Data in Catalog
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


// export default function AdminProducts() {
//   const [data,    setData]    = useState({ data: [], last_page: 1, total: 0 })
//   const [page,    setPage]    = useState(1)
//   const [search,  setSearch]  = useState('')
//   const [filter,  setFilter]  = useState({})
//   const [loading, setLoading] = useState(true)
//   const [stockModal, setStockModal] = useState(null)
//   const [offerModal, setOfferModal] = useState(null)
//   const [editModal, setEditModal]   = useState(null)
//   const [detailModal, setDetailModal] = useState(null)

//   const [confirmDialog, setConfirmDialog] = useState({
//     open: false,
//     action: null,
//     product: null,
//   })
//   const [actionProcessing, setActionProcessing] = useState(false)
//   const [actionError, setActionError] = useState('')
//   const [erpModalOpen, setErpModalOpen] = useState(false)
//   const [step1ModalOpen, setStep1ModalOpen] = useState(false)

//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const params = { page, per_page: 20, ...filter }
//       if (search) params.search = search
//       const res = await getProducts(params)
//       setData(res)
//     } catch (e) { alert(e.message) }
//     finally { setLoading(false) }
//   }, [page, search, filter])

//   useEffect(() => { load() }, [load])

//   const doToggleWeb = async (id) => {
//     try { await toggleWeb(id); load() } catch (e) { alert(e.message) }
//   }

//   const doToggleOffer = async (product) => {
//     if (product.is_offer) {
//       try { await toggleOffer(product.id); load() } catch (e) { alert(e.message) }
//     } else {
//       setOfferModal(product)
//     }
//   }

//   const doToggleBestOffer = async (id) => {
//     try { await toggleBestOffer(id); load() } catch (e) { alert(e.message) }
//   }

//   const doToggleNewArrival = async (id) => {
//     try { await toggleNewArrival(id); load() } catch (e) { alert(e.message) }
//   }

//   const requestProductAction = (product, action) => {
//     setConfirmDialog({
//       open: true,
//       action,
//       product,
//     })
//   }

//   const closeProductConfirmation = () => {
//     if (actionProcessing) return

//     setConfirmDialog({
//       open: false,
//       action: null,
//       product: null,
//     })
//   }

//   const confirmProductAction = async () => {
//     const product = confirmDialog.product
//     const action = confirmDialog.action

//     if (!product || !action) return

//     setActionProcessing(true)
//     setActionError('')

//     try {
//       if (action === 'permanent-delete') {
//         await hardDeleteProduct(product.id)
//       } else if (action === 'restore') {
//         await restoreProduct(product.id)
//       } else {
//         await softDeleteProduct(product.id)
//       }

//       setConfirmDialog({
//         open: false,
//         action: null,
//         product: null,
//       })

//       await load()
//     } catch (error) {
//       setConfirmDialog({
//         open: false,
//         action: null,
//         product: null,
//       })

//       setActionError(
//         error.message || 'The product could not be updated. Please try again.'
//       )
//     } finally {
//       setActionProcessing(false)
//     }
//   }

//   const sel = (val, onChange, opts, placeholder) => (
//     <select value={val} onChange={e => onChange(e.target.value)} className="admin-input-field" style={{ cursor: 'pointer', padding: '0.5rem' }}>
//       <option value="">{placeholder}</option>
//       {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//     </select>
//   )

//   return (
//     <div>
//       <ConfirmModal
//         open={confirmDialog.open}
//         title={
//           confirmDialog.action === 'permanent-delete'
//             ? 'Permanently delete this product?'
//             : confirmDialog.action === 'restore'
//               ? 'Restore this product?'
//               : 'Move product to Deleted Items?'
//         }
//         message={
//           confirmDialog.product ? (
//             <strong>
//               {confirmDialog.product.description ||
//                 `Product ${confirmDialog.product.navsa_product_code || ''}`}
//             </strong>
//           ) : null
//         }
//         description={
//           confirmDialog.action === 'permanent-delete'
//             ? 'This action cannot be undone. The product and its saved information will be permanently removed.'
//             : confirmDialog.action === 'restore'
//               ? 'The product will return to the active catalogue and will immediately be visible on the public website.'
//               : 'The product will be removed from the website and active catalogue, but it can be restored later from Show Deleted.'
//         }
//         confirmText={
//           confirmDialog.action === 'permanent-delete'
//             ? 'Delete permanently'
//             : confirmDialog.action === 'restore'
//               ? 'Restore product'
//               : 'Move to Deleted Items'
//         }
//         cancelText="Cancel"
//         eyebrow={
//           confirmDialog.action === 'permanent-delete'
//             ? 'PERMANENT DELETE'
//             : confirmDialog.action === 'restore'
//               ? 'RESTORE PRODUCT'
//               : 'DELETE PRODUCT'
//         }
//         icon={
//           confirmDialog.action === 'permanent-delete'
//             ? '×'
//             : confirmDialog.action === 'restore'
//               ? '↻'
//               : '!'
//         }
//         variant={confirmDialog.action === 'restore' ? 'success' : 'danger'}
//         loading={actionProcessing}
//         closeOnBackdrop={!actionProcessing}
//         onConfirm={confirmProductAction}
//         onClose={closeProductConfirmation}
//       />

//       {actionError && (
//         <div
//           role="alert"
//           style={{
//             marginBottom: '1rem',
//             padding: '0.85rem 1rem',
//             border: '1px solid rgba(239, 68, 68, 0.35)',
//             borderRadius: '10px',
//             color: '#fecaca',
//             background: 'rgba(127, 29, 29, 0.22)',
//           }}
//         >
//           {actionError}
//         </div>
//       )}
//       {stockModal   && <StockModal product={stockModal} onClose={() => setStockModal(null)} onSaved={load} />}
//       {offerModal   && <OfferModal product={offerModal} onClose={() => setOfferModal(null)} onSaved={load} />}
//       {editModal    && <EditProductModal product={editModal} onClose={() => setEditModal(null)} onSaved={load} />}
//       {detailModal  && <ProductDetailModal product={detailModal} onClose={() => setDetailModal(null)} />}
//       {erpModalOpen   && <ErpImportModal mode="erp" onClose={() => setErpModalOpen(false)} onImportDone={load} />}
//       {step1ModalOpen && <ErpImportModal mode="step1" onClose={() => setStep1ModalOpen(false)} onImportDone={load} />}

//       <div className="admin-flex-between mb-6">
//         <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
//           <div>
//             <h1 style={{ marginBottom: '0.25rem' }}>Products Management</h1>
//             <p style={{ color: '#94a3b8' }}>Manage your catalog and inventory</p>
//           </div>
//           <button
//             onClick={() => setErpModalOpen(true)}
//             className="admin-btn"
//             style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', gap: '8px', padding: '10px 18px', fontWeight: 600 }}
//           >
//             <Upload size={18} /> Bulk ERP Import (.xlsx)
//           </button>
//           <button
//             onClick={() => setStep1ModalOpen(true)}
//             className="admin-btn"
//             style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', gap: '8px', padding: '10px 18px', fontWeight: 600 }}
//           >
//             <Upload size={18} /> Step 1 Converted Import (.xlsx)
//           </button>
//         </div>
//         <button onClick={() => setEditModal(BLANK_PRODUCT)} className="admin-btn admin-btn-primary">
//           <Plus size={18} /> Add Product
//         </button>
//       </div>

//       <div className="glass-panel" style={{ padding: '1.5rem' }}>
//         {/* Search + Filters */}
//         <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
//           <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
//             placeholder="Search description, NAVSA Product Code, barcode…"
//             className="admin-input-field" style={{ flex: '1', minWidth: '200px' }} />
//           {sel(filter.is_offer  || '', v => { setFilter(f=>({...f, is_offer: v})); setPage(1) },
//             [{ value:'1', label:'Offer Only' },{ value:'0', label:'Non-Offer' }], 'All — Offers')}
//           {sel(filter.live_for_web || '', v => { setFilter(f=>({...f, live_for_web: v})); setPage(1) },
//             [{ value:'1', label:'Live Only' },{ value:'0', label:'Hidden Only' }], 'All — Visibility')}
//           {filter.low_stock
//             ? <button onClick={() => { setFilter(f=>({...f, low_stock:undefined})); setPage(1) }}
//                 className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#f59e0b' }}>⚠ Low Stock ✕</button>
//             : <button onClick={() => { setFilter(f=>({...f, low_stock:1})); setPage(1) }}
//                 className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>⚠ Low Stock</button>
//           }
//           <button
//             onClick={() => {
//               setFilter(filter.show_deleted ? {} : { show_deleted: 1 })
//               setPage(1)
//             }}
//             className="admin-btn admin-btn-ghost"
//             style={{
//               border: '1px solid rgba(255,255,255,0.1)',
//               color: filter.show_deleted ? '#3b82f6' : '#94a3b8'
//             }}
//           >
//             {filter.show_deleted ? '← Back to Active Products' : '🗑 Show Deleted'}
//           </button>
//         </div>

//         {/* Table */}
//         <div className="admin-table-container">
//           {loading ? (
//             <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading products…</div>
//           ) : data.data?.length === 0 ? (
//             <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>No products found.</div>
//           ) : (
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   <th style={{ width: '120px' }}>Ref</th>
//                   <th style={{ minWidth: '280px' }}>Description</th>
//                   <th style={{ width: '150px' }}>Brand</th>
//                   <th style={{ width: '150px' }}>Category</th>
//                   <th style={{ width: '110px', textAlign: 'center' }}>New Arrivals</th>
//                   <th style={{ width: '90px', textAlign: 'center' }}>WIGIG</th>
//                   <th style={{ width: '100px', textAlign: 'center' }}>Best-Sellers</th>
//                   <th style={{ width: '140px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.data?.map(p => (
//                   <tr key={p.id} style={{ opacity: p.deleted ? 0.5 : 1, cursor:'pointer' }} onClick={() => setDetailModal(p)}>
//                     <td style={{ color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 600 }}>{p.navsa_product_code || p.navsa_product_code || '—'}</td>
//                     <td style={{ minWidth: '280px', maxWidth: '500px' }}>
//                       <div style={{ fontWeight: 500, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
//                       {p.is_offer && p.offer_label && (
//                         <span className="admin-badge admin-badge-warning" style={{ marginTop: '4px', display: 'inline-block' }}>{p.offer_label}</span>
//                       )}
//                     </td>
//                     <td>{p.brand?.brand_name || '—'}</td>
//                     <td>{p.category?.category_name || '—'}</td>
//                     <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
//                        <label className="admin-switch">
//                         <input type="checkbox" checked={!!p.is_offer} onChange={() => !p.deleted && doToggleOffer(p)} />
//                         <span className="admin-slider"></span>
//                       </label>
//                     </td>
//                     <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
//                        <label className="admin-switch">
//                         <input type="checkbox" checked={!!p.is_best_offer} onChange={() => !p.deleted && doToggleBestOffer(p.id)} />
//                         <span className="admin-slider"></span>
//                       </label>
//                     </td>
//                     <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
//                        <label className="admin-switch">
//                         <input type="checkbox" checked={!!p.is_new_arrival} onChange={() => !p.deleted && doToggleNewArrival(p.id)} />
//                         <span className="admin-slider"></span>
//                       </label>
//                     </td>
//                     <td onClick={e => e.stopPropagation()} style={{ width: '140px', textAlign: 'right', paddingRight: '1rem', whiteSpace: 'nowrap' }}>
//                       <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
//                         {!p.deleted ? (
//                           <>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 setEditModal(p)
//                               }}
//                               className="admin-btn admin-btn-ghost"
//                               style={{ padding: '0.5rem', color: '#3b82f6' }}
//                               title="Edit product"
//                               aria-label="Edit product"
//                             >
//                               <Edit2 size={16} />
//                             </button>

//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 doToggleWeb(p.id)
//                               }}
//                               className="admin-btn admin-btn-ghost"
//                               style={{
//                                 padding: '0.5rem',
//                                 color: p.live_for_web ? '#f59e0b' : '#10b981'
//                               }}
//                               title={p.live_for_web ? 'Hide from website' : 'Show on website'}
//                               aria-label={p.live_for_web ? 'Hide from website' : 'Show on website'}
//                             >
//                               {p.live_for_web ? <EyeOff size={16} /> : <Eye size={16} />}
//                             </button>

//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 requestProductAction(p, 'move-to-deleted')
//                               }}
//                               className="admin-btn admin-btn-ghost"
//                               style={{ padding: '0.5rem', color: '#ef4444' }}
//                               title="Move to Deleted Items"
//                               aria-label="Move to Deleted Items"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 requestProductAction(p, 'restore')
//                               }}
//                               className="admin-btn admin-btn-ghost"
//                               style={{ padding: '0.5rem', color: '#10b981' }}
//                               title="Restore product as live"
//                               aria-label="Restore product"
//                             >
//                               <RotateCcw size={16} />
//                             </button>

//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 requestProductAction(p, 'permanent-delete')
//                               }}
//                               className="admin-btn admin-btn-ghost"
//                               style={{ padding: '0.5rem', color: '#ef4444' }}
//                               title="Delete permanently"
//                               aria-label="Delete product permanently"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
//           <span>{data.total} products — Page {data.current_page} of {data.last_page}</span>
//           <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
//             <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>← Prev</button>
//             <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page >= data.last_page} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Next →</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import {
  getProducts, toggleWeb, toggleOffer, toggleBestOffer, toggleNewArrival, updateStock,
  softDeleteProduct, hardDeleteProduct, restoreProduct, updateProduct, createProduct, uploadErpExcel, uploadProductImage, selectProductImage, removeProductImage
} from '../../services/adminApi'
import { getBrands, getCategories } from '../../services/adminApi'
import Barcode from 'react-barcode'
import { Plus, Edit2, Trash2, Filter, Eye, EyeOff, RotateCcw, X, Upload, Printer, Download } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'

function ProductDetailModal({ product, onClose }) {
  const rows = [
    ['NAVSA Product Code', product.navsa_product_code || '—'],
    ['Barcode (EAN)',    product.barcode_ean || '—'],
    ['Description',     product.description || '—'],
    ['Brand',           product.brand?.brand_name || '—'],
    ['Category',        product.category?.category_name || '—'],
    ['Sell Price',      product.price != null ? `£${product.price}` : '—'],
    ['List Price',      product.price_list != null ? `£${product.price_list}` : '—'],
    ['Stock',           product.stock_quantity ?? 0],
    ['Live on Web',     product.live_for_web ? 'Yes ✔' : 'No ✘'],
    ['Is Offer',        product.is_offer ? `Yes — ${product.offer_label || ''}` : 'No'],
    ['Best Offer',      product.is_best_offer ? 'Yes ✔' : 'No'],
    ['New Arrival',     product.is_new_arrival ? 'Yes ✔' : 'No'],
    ['Status',          product.deleted ? '🗑 Deleted' : product.live_for_web ? 'Live' : 'Hidden'],
    ['Created',         product.created_at ? new Date(product.created_at).toLocaleString() : '—'],
    ['Updated',         product.updated_at ? new Date(product.updated_at).toLocaleString() : '—'],
  ]
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflowY:'auto', padding:'28px', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
        <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:'50px', height:'50px', borderRadius:'12px', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>📦</div>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:'17px', lineHeight:1.3 }}>{product.description?.slice(0,60) || 'Product'}</div>
            <div style={{ color:'#94a3b8', fontSize:'12px', marginTop:'3px' }}>NAVSA Code: {product.navsa_product_code || '—'} {product.barcode_ean ? `• EAN: ${product.barcode_ean}` : ''}</div>
            <span style={{ marginTop:'6px', display:'inline-block', background: product.live_for_web ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: product.live_for_web ? '#10b981' : '#ef4444', fontSize:'10px', fontWeight:700, padding:'2px 10px', borderRadius:'10px' }}>{product.live_for_web ? 'LIVE' : 'HIDDEN'}</span>
            {product.is_offer && <span style={{ marginTop:'6px', marginLeft:'6px', display:'inline-block', background:'rgba(245,158,11,0.15)', color:'#f59e0b', fontSize:'10px', fontWeight:700, padding:'2px 10px', borderRadius:'10px' }}>OFFER</span>}
          </div>
        </div>
        <div style={{ display:'grid', gap:'12px' }}>
          {rows.map(([label, val]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
              <span style={{ color:'#94a3b8', fontSize:'12px', fontWeight:600, flexShrink:0, minWidth:'120px' }}>{label}</span>
              <span style={{ color:'#fff', fontSize:'13px', textAlign:'right', wordBreak:'break-word' }}>{String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const BLANK_PRODUCT = {
  description: '',
  navsa_product_code: '',
  barcode_ean: '',
  price: '',
  live_for_web: 1,
  stock_quantity: 0,
  brand_id: null,
  category_id: null
}

function StockModal({ product, onClose, onSaved }) {
  const [stock, setStock]   = useState(product.stock_quantity ?? 0)
  const [price, setPrice]   = useState(product.price ?? '')
  const [list,  setList]    = useState(product.price_list ?? '')
  const [busy,  setBusy]    = useState(false)

  const save = async () => {
    setBusy(true)
    try {
      await updateStock(product.id, parseInt(stock), price || undefined, list || undefined)
      onSaved()
      onClose()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div className="glass-panel" style={{ padding:'32px', width:'360px', background: '#0f172a' }}>
        <h3 style={{ marginBottom:'20px', fontSize:'18px' }}>Edit Stock & Price</h3>
        <div style={{ color:'#94a3b8', fontSize:'12px', marginBottom:'16px' }}>
          {product.navsa_product_code || '—'} — {product.description?.slice(0,50)}
        </div>
        {[
          { label:'Stock Quantity', val:stock, set:setStock, type:'number' },
          { label:'Sell Price (£)',  val:price, set:setPrice, type:'number' },
          { label:'List Price (£)',  val:list,  set:setList,  type:'number' },
        ].map(({ label, val, set, type }) => (
          <div key={label} className="admin-input-group">
            <label>{label}</label>
            <input type={type} className="admin-input-field" value={val} onChange={e => set(e.target.value)} />
          </div>
        ))}
        <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
          <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ flex:1 }}>
            {busy ? 'Saving…' : '💾 Save'}
          </button>
          <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ flex:1, border: '1px solid rgba(255,255,255,0.1)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function OfferModal({ product, onClose, onSaved }) {
  const [label, setLabel] = useState(product.offer_label || '')
  const [busy, setBusy]   = useState(false)
  const save = async () => {
    setBusy(true)
    try {
      await toggleOffer(product.id, label)
      onSaved(); onClose()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div className="glass-panel" style={{ padding:'32px', width:'340px', background: '#0f172a' }}>
        <h3 style={{ marginBottom:'16px' }}>Set Offer Label</h3>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 20% OFF, FLASH DEAL…"
          className="admin-input-field" style={{ width:'100%', marginBottom:'16px' }} />
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={save} disabled={busy} className="admin-btn admin-btn-primary" style={{ flex:1 }}>
            {busy ? '…' : '✓ Enable Offer'}
          </button>
          <button onClick={onClose} className="admin-btn admin-btn-ghost" style={{ flex:1, border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

const ALL_TABS = ['General', 'Advanced', 'Extra', 'Images', 'Related', 'Website description']

const EXTRA_FIELDS = [
  {
    key: 'order_qty_allowed',
    label: 'ORDER QTY ALLOWED',
    type: 'select',
    options: [
      { value: 'DEFAULT', label: 'DEFAULT (Layer & Pallet Allowed)' },
      { value: 'PALLET',  label: 'PALLET (Only Pallet Allowed)' },
      { value: 'CASE',    label: 'CASE (Case, Layer & Pallet Allowed)' },
    ]
  },
  { key: 'price_list',      label: 'PriceList',                     type: 'text' },
  { key: 'price',           label: 'Standard price',                type: 'number' },
  { key: 'promotion_price', label: 'Promotion Price (£)',           type: 'number' },
  { key: 'from_date',       label: 'FromDate',                      type: 'date' },
  { key: 'to_date',         label: 'ToDate',                        type: 'date' },
  { key: 'shelf_life',      label: 'Shelf Life in Days',            type: 'number' },
  { key: 'bbd',             label: 'Best before date (indicative)', type: 'text' },
]

const ADVANCED_FIELDS = [
  { key: 'cost',               label: 'Cost (£)',           type: 'number' },
  { key: 'cost_from_date',     label: 'Cost From Date',     type: 'date' },
  { key: 'cost_to_date',       label: 'Cost To Date',       type: 'date' },
  { key: 'vat_code',           label: 'VAT Code',           type: 'select', options: [
    { value: 'A', label: 'A (20%)' },
    { value: 'Z', label: 'Z (0%)' },
  ] },
  { key: 'storage_type',       label: 'Storage Type',       type: 'select', options: ['Ambient','Frozen','Chilled'] },
  { key: 'supplier_reference', label: 'Supplier Reference', type: 'text' },
  { key: 'obsolete',           label: 'Obsolete',           type: 'text' },
  { key: 'group_desc',         label: 'Group Description',  type: 'text' },
  { key: 'qty_desc',           label: 'Qty Description',    type: 'select', options: [
    { value: 'Case', label: 'Case' },
    { value: 'Layer', label: 'Layer' },
    { value: 'Pallet', label: 'Pallet' },
  ] },
  { key: 'units_of',            label: 'Units Of',           type: 'text' },
  { key: 'inner_case_quantity', label: 'InnerCaseQuantity',  type: 'number' },
  { key: 'outer_case_quantity', label: 'OuterCaseQuantity',  type: 'number' },
  { key: 'layer_quantity',      label: 'Layer Quantity',     type: 'number' },
  { key: 'pallet_quantity',     label: 'Pallet Quantity',    type: 'number' },
  { key: 'weight',              label: 'Unit Weight',        type: 'number' },
  { key: 'volume',              label: 'Unit Volume',        type: 'number' },
  { key: 'comm_code',           label: 'Comm Code',          type: 'text' },
  { key: 'intra_country',       label: 'Intra Country',      type: 'text' },
  { key: 'intra_type',          label: 'IntraType',           type: 'text' },
]

const WEBSITE_DESCRIPTION_FIELDS = [
  { key: 'web_short_description', label: 'WebShortDescription', type: 'text' },
  { key: 'web_long_description',  label: 'WebLongDescription',  type: 'textarea' },
]

// ── Shared style tokens used by EditProductModal ───────────────────────────
const EP_INP    = { width:'100%', padding:'7px 10px', border:'1px solid #ccc', borderRadius:'4px', fontSize:'14px', boxSizing:'border-box', background:'#fff', color:'#333', outline:'none' }
const EP_BTN_SM = { background:'#f5f5f5', color:'#333', border:'1px solid #ccc', borderRadius:'4px', padding:'6px 12px', cursor:'pointer', fontSize:'13px', whiteSpace:'nowrap' }
const EP_BTN_ORG = { background:'#f97316', color:'#fff', border:'none', borderRadius:'4px', padding:'8px 18px', cursor:'pointer', fontSize:'14px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }
const EP_BTN_GH  = { background:'transparent', color:'#555', border:'1px solid #ccc', borderRadius:'4px', padding:'8px 18px', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', gap:'6px' }

// Must be outside EditProductModal — if defined inside, React recreates it
// on every keystroke causing inputs to lose focus (cursor jumps out).
function FieldRow({ label, required, children }) {
  return (
    <tr>
      <td style={{ width:'210px', verticalAlign:'top', paddingRight:'14px', paddingTop:'10px', textAlign:'right', fontSize:'13px', color:'#555', whiteSpace:'nowrap' }}>
        {required && <span style={{ color:'#999', fontSize:'11px', marginRight:'4px' }}>(REQUIRED)</span>}{label}
      </td>
      <td style={{ paddingBottom:'12px', paddingTop:'4px' }}>{children}</td>
    </tr>
  )
}


function normalizeQtyDescForDisplay(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  const normalized = raw.toLowerCase()
  if (normalized === 'case') return 'Case'
  if (normalized === 'layer') return 'Layer'
  if (normalized === 'pallet') return 'Pallet'

  return raw
}


function hasValidEanChecksum(digits) {
  if (digits.length === 13) {
    let sum = 0
    for (let i = 0; i < 12; i += 1) {
      const digit = Number(digits[i])
      sum += i % 2 === 0 ? digit : digit * 3
    }
    return ((10 - (sum % 10)) % 10) === Number(digits[12])
  }

  if (digits.length === 8) {
    let sum = 0
    for (let i = 0; i < 7; i += 1) {
      const digit = Number(digits[i])
      sum += i % 2 === 0 ? digit * 3 : digit
    }
    return ((10 - (sum % 10)) % 10) === Number(digits[7])
  }

  return true
}

// Keep admin barcode rendering identical to the public Product Details page.
// The ERP feed occasionally supplies EAN values without a leading zero, so
// values shorter than the minimum EAN-13 payload are left-padded before they
// are passed to react-barcode / JsBarcode. A checksum-invalid full EAN value
// is preserved exactly and rendered as CODE128 rather than silently changing it.
function getBarcodeRenderConfig(rawValue) {
  const digits = String(rawValue || '').replace(/\D/g, '')

  if (!digits) return null

  if (digits.length === 7) {
    return {
      value: digits,
      format: 'EAN8',
      usesCode128Fallback: false,
    }
  }

  if (digits.length === 8) {
    const valid = hasValidEanChecksum(digits)
    return {
      value: digits,
      format: valid ? 'EAN8' : 'CODE128',
      usesCode128Fallback: !valid,
    }
  }

  if (digits.length >= 9 && digits.length <= 12) {
    return {
      value: digits.length < 12 ? digits.padStart(12, '0') : digits,
      format: 'EAN13',
      usesCode128Fallback: false,
    }
  }

  if (digits.length === 13) {
    const valid = hasValidEanChecksum(digits)
    return {
      value: digits,
      format: valid ? 'EAN13' : 'CODE128',
      usesCode128Fallback: !valid,
    }
  }

  return null
}

function BarcodePreviewModal({ product, onClose }) {
  const labelRef = useRef(null)
  const barcodeOnlyRef = useRef(null)
  const config = getBarcodeRenderConfig(product?.barcode_ean)

  if (!config) return null

  const productName = product?.description || 'Product'
  const rawPrice = product?.effective_price ?? product?.price
  const priceText = rawPrice === null || rawPrice === undefined || rawPrice === ''
    ? null
    : `£${Number(rawPrice).toFixed(2)}`

  const printLabel = () => {
    const labelMarkup = labelRef.current?.innerHTML
    if (!labelMarkup) return

    const printWindow = window.open('', '_blank', 'width=720,height=520')
    if (!printWindow) {
      alert('Please allow pop-ups for this site so the barcode print window can open.')
      return
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Barcode ${String(product?.barcode_ean || '')}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              font-family: Arial, Helvetica, sans-serif;
              background: #fff;
              color: #000;
            }
            .print-wrap {
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
            @page { margin: 12mm; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-wrap">${labelMarkup}</div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    window.setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const downloadBarcode = () => {
    const sourceSvg = barcodeOnlyRef.current?.querySelector('svg')
    if (!sourceSvg) return

    const svg = sourceSvg.cloneNode(true)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const width = Math.max(1, Math.ceil(parseFloat(svg.getAttribute('width')) || 320))
    const height = Math.max(1, Math.ceil(parseFloat(svg.getAttribute('height')) || 100))
    const svgText = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)
    const image = new Image()

    image.onload = () => {
      const scale = 3
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(svgUrl)
        return
      }

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(svgUrl)

      canvas.toBlob(blob => {
        if (!blob) return

        const pngUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        const safeName = String(product?.barcode_ean || 'barcode').replace(/[^A-Za-z0-9_-]/g, '_')
        link.href = pngUrl
        link.download = `${safeName}.png`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(pngUrl)
      }, 'image/png')
    }

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl)
      alert('The barcode image could not be generated. Please try again.')
    }

    image.src = svgUrl
  }

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,.72)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:2200, padding:'20px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:'100%', maxWidth:'620px', background:'#f3f4f6',
          borderRadius:'10px', padding:'20px', boxShadow:'0 20px 60px rgba(0,0,0,.35)',
          color:'#111', position:'relative'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close barcode preview"
          style={{
            position:'absolute', right:'14px', top:'12px', border:'none',
            background:'transparent', cursor:'pointer', color:'#555'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ margin:'0 0 16px', fontSize:'18px' }}>Barcode preview</h3>

        <div style={{ display:'flex', justifyContent:'center', padding:'18px 10px' }}>
          <div
            ref={labelRef}
            style={{
              width:'340px', minHeight:'170px', background:'#fff',
              border:'1px solid #d1d5db', padding:'16px 18px',
              display:'flex', flexDirection:'column', alignItems:'center',
              justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,.12)'
            }}
          >
            <div style={{ fontWeight:700, fontSize:'16px', textAlign:'center', marginBottom:'4px' }}>
              {productName}
            </div>
            {priceText && (
              <div style={{ fontSize:'13px', marginBottom:'10px' }}>
                Price: {priceText}
              </div>
            )}
            <Barcode
              value={config.value}
              format={config.format}
              width={2}
              height={62}
              margin={4}
              fontSize={13}
              displayValue
              background="#ffffff"
              lineColor="#000000"
            />
          </div>
        </div>

        {config.usesCode128Fallback && (
          <div style={{
            margin:'0 auto 14px', maxWidth:'480px', fontSize:'12px',
            color:'#92400e', background:'#fffbeb', border:'1px solid #fde68a',
            borderRadius:'6px', padding:'8px 10px', lineHeight:1.4
          }}>
            This stored EAN value does not have a valid EAN checksum. The exact ERP value is preserved,
            and Code 128 is used only as a safe rendering fallback so the stored number is not silently changed.
          </div>
        )}

        <div style={{ display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap' }}>
          <button
            type="button"
            onClick={printLabel}
            style={{ ...EP_BTN_SM, display:'inline-flex', alignItems:'center', gap:'7px' }}
          >
            <Printer size={16} /> Print label
          </button>
          <button
            type="button"
            onClick={downloadBarcode}
            style={{ ...EP_BTN_SM, display:'inline-flex', alignItems:'center', gap:'7px' }}
          >
            <Download size={16} /> Download barcode PNG
          </button>
        </div>

        {/* Off-screen render used only to create the downloadable barcode-only PNG. */}
        <div
          ref={barcodeOnlyRef}
          aria-hidden="true"
          style={{ position:'fixed', left:'-10000px', top:'-10000px', background:'#fff' }}
        >
          <Barcode
            value={config.value}
            format={config.format}
            width={2}
            height={70}
            margin={8}
            displayValue={false}
            background="#ffffff"
            lineColor="#000000"
          />
        </div>
      </div>
    </div>
  )
}

function adminProductImageUrl(filename, cacheBust = '') {
  const raw = String(filename || '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw

  const clean = raw.replace(/^\/+/, '')
  const parts = clean.split('/').filter(Boolean).map(encodeURIComponent)
  const relative = parts.join('/')
  const base = relative.startsWith('products/') ? `/${relative}` : `/products/${relative}`
  return cacheBust ? `${base}?v=${encodeURIComponent(cacheBust)}` : base
}

function AdminProductImageTile({
  filename,
  label,
  selected,
  onSelect,
  onRemove,
  cacheBust,
  disabled = false,
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [filename, cacheBust])

  if (!filename) return null

  const src = adminProductImageUrl(filename, cacheBust)

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onSelect?.()
      }}
      onKeyDown={event => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onSelect?.()
        }
      }}
      title="Use this image on the website"
      style={{
        width:'220px',
        padding:0,
        border: selected ? '2px solid #2563eb' : '1px solid #d1d5db',
        borderRadius:'4px',
        background:'#fff',
        cursor: disabled ? 'wait' : 'pointer',
        overflow:'hidden',
        position:'relative',
        textAlign:'left',
        boxShadow: selected ? '0 0 0 2px rgba(37,99,235,.12)' : 'none',
        opacity: disabled ? .72 : 1,
      }}
    >
      <button
        type="button"
        aria-label={`Remove ${label}`}
        title="Remove image"
        disabled={disabled}
        onClick={event => {
          event.stopPropagation()
          if (!disabled) onRemove?.()
        }}
        style={{
          position:'absolute',
          top:'8px',
          right:'8px',
          zIndex:3,
          width:'25px',
          height:'25px',
          borderRadius:'50%',
          border:'1px solid #d1d5db',
          background:'#fff',
          color:'#dc2626',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          padding:0,
          cursor: disabled ? 'wait' : 'pointer',
          fontSize:'18px',
          lineHeight:1,
          fontWeight:700,
          boxShadow:'0 1px 4px rgba(0,0,0,.15)',
        }}
      >
        ×
      </button>

      <div style={{ height:'220px', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px', background:'#fff' }}>
        {!failed ? (
          <img
            src={src}
            alt={label}
            onError={() => setFailed(true)}
            style={{ maxWidth:'100%', maxHeight:'200px', objectFit:'contain', display:'block' }}
          />
        ) : (
          <div style={{ color:'#9ca3af', fontSize:'12px', textAlign:'center', lineHeight:1.5, padding:'10px' }}>
            Image file not found.<br />
            <span style={{ wordBreak:'break-all' }}>{filename}</span>
          </div>
        )}
      </div>

      <div style={{
        position:'relative',
        borderTop:'1px solid #e5e7eb',
        padding: selected ? '9px 38px 9px 10px' : '9px 10px',
        minHeight:'37px',
        boxSizing:'border-box',
        fontSize:'12px',
        fontWeight:600,
        color:'#374151',
        textAlign:'center'
      }}>
        {label}
        {selected && (
          <span
            aria-label="Selected for website"
            title="Currently used on the website"
            style={{
              position:'absolute',
              right:'8px',
              top:'50%',
              transform:'translateY(-50%)',
              width:'24px',
              height:'24px',
              borderRadius:'50%',
              background:'#2563eb',
              color:'#fff',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:'15px',
              fontWeight:700
            }}
          >✓</span>
        )}
      </div>
    </div>
  )
}

function EditProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(() => {
    const currentRule = String(product?.order_qty_allowed || 'DEFAULT').toUpperCase()
    const normalized = ['DEFAULT', 'PALLET', 'CASE'].includes(currentRule) ? currentRule : 'DEFAULT'
    return {
      ...product,
      order_qty_allowed: normalized
    }
  })
  const [tab, setTab]   = useState('General')
  const [relatedProductsType, setRelatedProductsType] = useState('None')
  const [busy, setBusy] = useState(false)
  const [barcodePreviewOpen, setBarcodePreviewOpen] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageSelecting, setImageSelecting] = useState(false)
  const [imageDeleting, setImageDeleting] = useState(false)
  const [imageRemoveConfirm, setImageRemoveConfirm] = useState({
    open: false,
    source: null,
    imageId: null,
  })
  const [imageUploadError, setImageUploadError] = useState('')
  const [imageCacheBust, setImageCacheBust] = useState('')
  const imageFileRef = useRef(null)
  const [allBrands,     setAllBrands]     = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [catSearch,     setCatSearch]     = useState('')
  const [showCatDrop,   setShowCatDrop]   = useState(false)

  // selected categories: array of {id, name, type: 'brand'|'category'}
  const [selCats, setSelCats] = useState(() => {
    const arr = []
    if (product.brand)    arr.push({ id: `b_${product.brand_id}`,    name: product.brand.brand_name,       type: 'brand' })
    if (product.category) arr.push({ id: `c_${product.category_id}`, name: product.category.category_name, type: 'category' })
    return arr
  })

  useEffect(() => {
    getBrands().then(d => setAllBrands(d || [])).catch(() => {})
    getCategories().then(d => setAllCategories(d || [])).catch(() => {})

    if (product && product.shelf_life) {
      const days = parseInt(product.shelf_life, 10)
      if (!isNaN(days) && days > 0) {
        const d = new Date()
        d.setDate(d.getDate() + days)
        const calcBbd = d.toISOString().split('T')[0]
        setForm(f => ({ ...f, bbd: f.bbd || calcBbd }))
      }
    }
  }, [product])

  const addCat = (item) => {
    if (!selCats.find(s => s.id === item.id)) {
      const next = [...selCats, item]
      setSelCats(next)
      // update form: set brand_id / category_id to first of each type
      const brand = next.find(s => s.type === 'brand')
      const cat   = next.find(s => s.type === 'category')
      setForm(f => ({ ...f, brand_id: brand ? parseInt(brand.id.slice(2)) : f.brand_id, category_id: cat ? parseInt(cat.id.slice(2)) : f.category_id }))
    }
    setCatSearch('')
    setShowCatDrop(false)
  }

  const removeCat = (id) => {
    const next = selCats.filter(s => s.id !== id)
    setSelCats(next)
    const brand = next.find(s => s.type === 'brand')
    const cat   = next.find(s => s.type === 'category')
    setForm(f => ({ ...f, brand_id: brand ? parseInt(brand.id.slice(2)) : null, category_id: cat ? parseInt(cat.id.slice(2)) : null }))
  }

  const catOptions = [
    ...allBrands.map(b => ({ id: `b_${b.id}`, name: `- ${b.brand_name}`, type: 'brand' })),
    ...allCategories.map(c => ({ id: `c_${c.id}`, name: `-- ${c.category_name}`, type: 'category' })),
  ].filter(o => o.name.toLowerCase().includes(catSearch.toLowerCase()) && !selCats.find(s => s.id === o.id))

  const hc = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val }
      if (key === 'shelf_life') {
        const days = parseInt(val, 10)
        if (!isNaN(days) && days > 0) {
          const d = new Date()
          d.setDate(d.getDate() + days)
          next.bbd = d.toISOString().split('T')[0]
        } else {
          next.bbd = ''
        }
      }
      return next
    })
  }


  const applyImageMetadata = (result) => {
    const hasErpImage = Object.prototype.hasOwnProperty.call(result, 'erp_web_image')
    const hasEffectiveImage = Object.prototype.hasOwnProperty.call(result, 'effective_web_image')

    setForm(current => ({
      ...current,
      web_image: hasErpImage ? result.erp_web_image : current.web_image,
      erp_web_image: hasErpImage
        ? result.erp_web_image
        : (current.erp_web_image ?? current.web_image),
      manual_web_image: result.manual_web_image ?? null,
      effective_web_image: hasEffectiveImage
        ? result.effective_web_image
        : (result.manual_web_image ?? current.erp_web_image ?? current.web_image),
      selected_image_source: result.selected_image_source || (result.manual_web_image ? 'manual' : 'erp'),
      selected_image_id: result.selected_image_id ?? null,
      manual_images: Array.isArray(result.manual_images) ? result.manual_images : (current.manual_images || []),
    }))
    setImageCacheBust(String(Date.now()))
  }

  const handleProductImageUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return
    if (!product?.id) {
      alert('Please save the product before uploading an image.')
      return
    }

    const uploadData = new FormData()
    uploadData.append('image', file)

    setImageUploading(true)
    setImageUploadError('')

    try {
      const result = await uploadProductImage(product.id, uploadData)
      applyImageMetadata(result)
      onSaved?.()
    } catch (error) {
      setImageUploadError(error.message || 'Image upload failed.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSelectWebsiteImage = async (source, imageId = null) => {
    if (!product?.id || imageSelecting) return

    setImageSelecting(true)
    setImageUploadError('')

    try {
      const result = await selectProductImage(product.id, source, imageId)
      applyImageMetadata(result)
      onSaved?.()
    } catch (error) {
      setImageUploadError(error.message || 'The website image could not be changed.')
    } finally {
      setImageSelecting(false)
    }
  }

  const handleRemoveProductImage = (source, imageId = null) => {
    if (!product?.id || imageDeleting) return

    setImageRemoveConfirm({
      open: true,
      source,
      imageId,
    })
  }

  const confirmRemoveProductImage = async () => {
    if (!product?.id || imageDeleting || !imageRemoveConfirm.source) return

    const { source, imageId } = imageRemoveConfirm

    setImageDeleting(true)
    setImageUploadError('')

    try {
      const result = await removeProductImage(product.id, source, imageId)
      applyImageMetadata(result)
        setImageRemoveConfirm({ open: false, source: null, imageId: null })
      onSaved?.()
    } catch (error) {
      setImageUploadError(error.message || 'The image could not be removed.')
      setImageRemoveConfirm({ open: false, source: null, imageId: null })
    } finally {
      setImageDeleting(false)
    }
  }

  const save = async (closeAfter) => {
    if (!product?.id && !String(form.navsa_product_code || '').trim()) {
      alert('NAVSA Product Code is required for a manually created product.')
      return
    }

    setBusy(true)
    try {
      const payload = { ...form }
      if (product && product.id) {
        delete payload.navsa_product_code
        delete payload.reference
        await updateProduct(product.id, payload)
      } else {
        await createProduct(payload)
      }
      onSaved()
      if (closeAfter) onClose()
    } catch (e) { alert(e.message) }
    finally { setBusy(false) }
  }

  const inp    = EP_INP
  const btnSm  = EP_BTN_SM
  const btnOrg = EP_BTN_ORG
  const btnGh  = EP_BTN_GH
  const Row    = FieldRow

  const renderGeneral = () => (
    <table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>
      <Row label="Product name" required>
        <input value={form.description || ''} onChange={e => hc('description', e.target.value)} style={{ ...inp }} />
      </Row>
      <Row label="Categories" required>
        <div style={{ position:'relative' }}>
          <div
            onClick={() => setShowCatDrop(v => !v)}
            style={{ border:'1px solid #ccc', borderRadius:'4px', padding:'6px 8px', display:'flex', flexWrap:'wrap', gap:'6px', minHeight:'38px', background:'#fff', cursor:'text' }}
          >
            {selCats.map(s => (
              <span key={s.id} style={{ background:'#dbeafe', color:'#1d4ed8', borderRadius:'4px', padding:'2px 8px', fontSize:'13px', display:'flex', alignItems:'center', gap:'4px' }}>
                {s.name}
                <span onClick={e => { e.stopPropagation(); removeCat(s.id) }} style={{ cursor:'pointer', fontWeight:'bold', marginLeft:'2px' }}>×</span>
              </span>
            ))}
            <input
              value={catSearch}
              onChange={e => { setCatSearch(e.target.value); setShowCatDrop(true) }}
              onClick={e => { e.stopPropagation(); setShowCatDrop(true) }}
              placeholder={selCats.length === 0 ? 'Search brand or category...' : ''}
              style={{ border:'none', outline:'none', fontSize:'13px', minWidth:'120px', flex:1, color:'#333', background:'transparent' }}
            />
          </div>
          {showCatDrop && catOptions.length > 0 && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #ccc', borderRadius:'4px', zIndex:10, maxHeight:'200px', overflowY:'auto', boxShadow:'0 4px 12px rgba(0,0,0,.15)' }}>
              {catOptions.slice(0, 30).map(o => (
                <div key={o.id} onClick={() => addCat(o)}
                  style={{ padding:'8px 12px', cursor:'pointer', fontSize:'13px', color:'#333' }}
                  onMouseEnter={e => e.target.style.background='#f0f4ff'}
                  onMouseLeave={e => e.target.style.background='transparent'}
                >
                  {o.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </Row>
      <Row label="NAVSA Product Code" required>
        <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
          <input
            value={form.navsa_product_code || ''}
            onChange={e => {
              if (!product?.id) hc('navsa_product_code', e.target.value)
            }}
            readOnly={Boolean(product?.id)}
            placeholder="e.g. 467357"
            title={product?.id ? 'Imported NAVSA Product Code — this identifier cannot be changed in the admin panel.' : 'Enter the NAVSA Product Code for this manually created product.'}
            style={{
              ...inp,
              maxWidth:'200px',
              background: product?.id ? '#f3f4f6' : '#fff',
              color: product?.id ? '#4b5563' : '#333',
              cursor: product?.id ? 'default' : 'text'
            }}
          />
          {product?.id && (
            <span style={{ color:'#6b7280', fontSize:'12px' }}>Read-only ERP identifier</span>
          )}
        </div>
      </Row>
      <Row label="Barcode (EAN-13)">
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <input
            value={form.barcode_ean || ''}
            onChange={e => hc('barcode_ean', e.target.value)}
            placeholder="13-digit EAN barcode"
            style={{ ...inp, maxWidth:'200px' }}
          />
          <button
            type="button"
            onClick={() => setBarcodePreviewOpen(true)}
            disabled={!String(form.barcode_ean || '').trim()}
            title="Preview / print barcode"
            aria-label="Preview / print barcode"
            style={{
              ...btnSm,
              width:'38px',
              height:'36px',
              padding:0,
              display:'inline-flex',
              alignItems:'center',
              justifyContent:'center',
              opacity: String(form.barcode_ean || '').trim() ? 1 : .45,
              cursor: String(form.barcode_ean || '').trim() ? 'pointer' : 'not-allowed'
            }}
          >
            <Printer size={17} />
          </button>
        </div>
      </Row>
      <Row label="Barcode Case">
        <input value={form.barcode_case || ''} onChange={e => hc('barcode_case', e.target.value)} placeholder="Case barcode" style={{ ...inp, maxWidth:'200px' }} />
      </Row>
      <Row label="Price (£)" required>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <input type="number" step="0.01" value={form.price || ''} onChange={e => hc('price', e.target.value)} style={{ ...inp, maxWidth:'140px' }} />
          <span style={{ color:'#1d4ed8', fontSize:'13px', cursor:'pointer' }}>(Advanced pricing info)</span>
        </div>
      </Row>
      <Row label="Live?">
        <div style={{ display:'flex', gap:'20px', paddingTop:'8px' }}>
          <label style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'14px', color:'#333' }}>
            <input type="radio" name={`live_${product?.id || 'new'}`} checked={form.live_for_web === true || Number(form.live_for_web) === 1} onChange={() => hc('live_for_web', 1)} /> Yes
          </label>
          <label style={{ display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'14px', color:'#333' }}>
            <input type="radio" name={`live_${product?.id || 'new'}`} checked={!(form.live_for_web === true || Number(form.live_for_web) === 1)} onChange={() => hc('live_for_web', 0)} /> No
          </label>
        </div>
      </Row>
      <tr><td colSpan={2} style={{ paddingBottom:'12px' }}>
        <div style={{ border:'1px solid #ccc', borderRadius:'4px', overflow:'hidden' }}>
          <textarea rows={5} value={form.web_long_description || ''} onChange={e => hc('web_long_description', e.target.value)}
            style={{ width:'100%', border:'none', outline:'none', padding:'10px', fontSize:'14px', resize:'vertical', fontFamily:'inherit', boxSizing:'border-box', color:'#333', display:'block' }} />
        </div>
      </td></tr>
    </tbody></table>
  )

  const renderImages = () => {
    const erpImageName = String(form.erp_web_image || form.web_image || '').trim()
    const manualImages = Array.isArray(form.manual_images)
      ? form.manual_images
      : (Array.isArray(product?.manual_images) ? product.manual_images : [])
    const selectedSource = form.selected_image_source || product?.selected_image_source || (form.manual_web_image ? 'manual' : 'erp')
    const selectedImageId = Number(form.selected_image_id ?? product?.selected_image_id ?? 0) || null
    const imageBusy = imageUploading || imageSelecting || imageDeleting

    return (
      <div style={{ color:'#333' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap', paddingBottom:'18px', borderBottom:'1px solid #e5e7eb' }}>
          <button
            type="button"
            onClick={() => imageFileRef.current?.click()}
            disabled={imageBusy || !product?.id}
            style={{
              ...btnSm,
              display:'inline-flex', alignItems:'center', gap:'7px',
              opacity: imageBusy || !product?.id ? .55 : 1,
              cursor: imageBusy || !product?.id ? 'not-allowed' : 'pointer'
            }}
          >
            <Upload size={17} /> {imageUploading ? 'Uploading...' : 'Upload Files'}
          </button>
          <input
            ref={imageFileRef}
            type="file"
            accept="image/*"
            onChange={handleProductImageUpload}
            style={{ display:'none' }}
          />
          <span style={{ color:'#4b5563', fontSize:'13px' }}>
            <strong>Square</strong> size recommended: 1600px x 1600px
          </span>
        </div>

        {!product?.id && (
          <div style={{ marginTop:'12px', color:'#92400e', fontSize:'12px' }}>
            Save this new product first, then the image upload button will become available.
          </div>
        )}

        {imageUploadError && (
          <div style={{ marginTop:'12px', padding:'9px 11px', border:'1px solid #fecaca', background:'#fef2f2', color:'#b91c1c', borderRadius:'5px', fontSize:'12px' }}>
            {imageUploadError}
          </div>
        )}

        <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', flexWrap:'wrap', marginTop:'18px' }}>
          <AdminProductImageTile
            filename={erpImageName}
            label="ERP WebImage"
            selected={selectedSource === 'erp'}
            onSelect={() => handleSelectWebsiteImage('erp')}
            onRemove={() => handleRemoveProductImage('erp')}
            cacheBust="erp"
            disabled={imageBusy}
          />

          {manualImages.map(image => {
            const isSelected = selectedSource === 'manual' && Number(image.id) === selectedImageId
            return (
              <AdminProductImageTile
                key={image.id}
                filename={image.image_name}
                label={isSelected ? 'Current website image (manual upload)' : 'Manual upload'}
                selected={isSelected}
                onSelect={() => handleSelectWebsiteImage('manual', image.id)}
                onRemove={() => handleRemoveProductImage('manual', image.id)}
                cacheBust={imageCacheBust || image.id}
                disabled={imageBusy}
              />
            )
          })}
        </div>
      </div>
    )
  }

  const renderRelated = () => (
    <div style={{ color:'#333' }}>
      <div style={{ paddingBottom:'18px', borderBottom:'1px solid #e5e7eb', color:'#4b5563', fontSize:'13px', lineHeight:1.55 }}>
        Related Products allows you to link a product/s to another product in your webshop; also known as upsell/cross sell.
      </div>

      <table style={{ width:'100%', borderCollapse:'collapse', marginTop:'18px' }}>
        <tbody>
          <Row label="Related Products Type">
            <select
              value={relatedProductsType}
              onChange={e => setRelatedProductsType(e.target.value)}
              style={{ ...inp, maxWidth:'340px' }}
            >
              <option value="None">None</option>
              <option value="Category">Category</option>
              <option value="Same Category">Same Category</option>
              <option value="Selected Products">Selected Products</option>
            </select>
          </Row>
        </tbody>
      </table>
    </div>
  )

  const renderFieldList = (fields) => (
    <table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>
      {fields.map(f => {
        const isBbd = f.key === 'bbd'
        const isReadOnly = Boolean(f.readOnly)
        let fieldVal = form[f.key] || ''
        if (f.type === 'date' && fieldVal && typeof fieldVal === 'string') {
          fieldVal = fieldVal.split('T')[0].split(' ')[0]
        }
        const selectValue = f.key === 'qty_desc'
          ? normalizeQtyDescForDisplay(form[f.key])
          : (form[f.key] || '')

        return (
          <Row key={f.key + f.label} label={f.label}>
            {f.type === 'textarea' ? (
              <textarea rows={3} value={form[f.key] || ''} onChange={e => hc(f.key, e.target.value)} style={{ ...inp, resize:'vertical' }} />
            ) : f.type === 'select' ? (
              <select
                value={selectValue}
                onChange={e => { if (!isReadOnly) hc(f.key, e.target.value) }}
                aria-readonly={isReadOnly ? 'true' : undefined}
                title={isReadOnly ? 'ERP-controlled value from the Datafeed QtyDesc column. The options can be viewed but the saved value cannot be changed here.' : undefined}
                style={{
                  ...inp,
                  background: isReadOnly ? '#f3f4f6' : '#fff',
                  color: isReadOnly ? '#4b5563' : '#333',
                  cursor: isReadOnly ? 'default' : 'pointer'
                }}
              >
                {!selectValue && <option value="">—</option>}
                {f.options.map(o => {
                  const val = typeof o === 'object' ? o.value : o
                  const lbl = typeof o === 'object' ? o.label : o
                  return <option key={val} value={val}>{lbl}</option>
                })}
              </select>
            ) : (
              <input
                type={f.type || 'text'}
                value={fieldVal}
                onChange={e => hc(f.key, e.target.value)}
                disabled={isBbd}
                style={{
                  ...inp,
                  maxWidth: f.type === 'number' ? '200px' : '100%',
                  background: isBbd ? '#f3f4f6' : '#fff',
                  color: isBbd ? '#6b7280' : '#333',
                  cursor: isBbd ? 'not-allowed' : 'text'
                }}
              />
            )}
          </Row>
        )
      })}
    </tbody></table>
  )

  const renderTab = () => {
    if (tab === 'General')  return renderGeneral()
    if (tab === 'Advanced') return renderFieldList(ADVANCED_FIELDS)
    if (tab === 'Extra')    return renderFieldList(EXTRA_FIELDS)
    if (tab === 'Images')   return renderImages()
    if (tab === 'Related')  return renderRelated()
    if (tab === 'Website description') return renderFieldList(WEBSITE_DESCRIPTION_FIELDS)
    return null
  }

  return (
    <>
      {barcodePreviewOpen && (
        <BarcodePreviewModal
          product={{ ...product, ...form }}
          onClose={() => setBarcodePreviewOpen(false)}
        />
      )}
      <ConfirmModal
        open={imageRemoveConfirm.open}
        title="Remove image?"
        message="Are you sure you want to remove this image?"
        confirmText="Yes, remove"
        cancelText="Cancel"
        eyebrow="REMOVE IMAGE"
        icon="×"
        variant="danger"
        loading={imageDeleting}
        closeOnBackdrop={!imageDeleting}
        onConfirm={confirmRemoveProductImage}
        onClose={() => {
          if (!imageDeleting) {
            setImageRemoveConfirm({ open: false, source: null, imageId: null })
          }
        }}
      />
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, overflowY:'auto', padding:'20px' }}>
      <div style={{ background:'#fff', borderRadius:'8px', width:'100%', maxWidth:'860px', boxShadow:'0 8px 40px rgba(0,0,0,.35)', display:'flex', flexDirection:'column', maxHeight:'92vh', color:'#333' }}>
        <div style={{ padding:'18px 24px 0', borderBottom:'1px solid #e5e7eb', position:'relative' }}>
          <button type="button" onClick={onClose} style={{ position:'absolute', right:'16px', top:'16px', background:'none', border:'none', fontSize:'22px', cursor:'pointer', color:'#666', lineHeight:1 }}>x</button>
          <h3 style={{ margin:0, marginBottom:'14px', fontSize:'20px', fontWeight:700, color:'#111' }}>Edit a product</h3>
          <div style={{ display:'flex', overflowX:'auto' }}>
            {ALL_TABS.map(t => (
              <button type="button" key={t} onClick={() => setTab(t)} style={{
                padding:'8px 16px', background:'transparent', border:'none',
                borderBottom: t === tab ? '2px solid #1d4ed8' : '2px solid transparent',
                color: t === tab ? '#1d4ed8' : '#555', cursor:'pointer', fontSize:'13px',
                fontWeight: t === tab ? 600 : 400, whiteSpace:'nowrap'
              }}>{t}</button>
            ))}
          </div>
        </div>
        <form onSubmit={e => e.preventDefault()} style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'hidden' }}>
          <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
            {renderTab()}
          </div>
          <div style={{ padding:'14px 24px', borderTop:'1px solid #e5e7eb', display:'flex', gap:'10px', justifyContent:'flex-end', background:'#fafafa', borderRadius:'0 0 8px 8px' }}>
            <button type="button" onClick={onClose} style={btnGh}>Cancel</button>
            <button type="button" onClick={() => save(true)} disabled={busy} style={btnOrg}>
              {busy ? 'Saving...' : 'Save changes & close'}
            </button>
            <button type="button" onClick={() => save(false)} disabled={busy} style={{ ...btnOrg, background:'#ea580c' }}>
              {busy ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

function ErpImportModal({ onClose, onImportDone, mode = 'erp' }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const isStep1 = mode === 'step1'
  const modalTitle = isStep1 ? 'Step 1 Converted Excel Import' : 'Bulk ERP Excel Import'
  const modalSubtitle = isStep1 
    ? 'Upload converted website data file (Step 1 - Converted file from ERP to Website Data.xlsx)'
    : 'Upload your ERP system file (e.g. Datafeed from ERP system.xlsx)'
  const accentGradient = isStep1 ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'linear-gradient(135deg,#10b981,#059669)'
  const accentColor = isStep1 ? '#3b82f6' : '#10b981'

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    if (mode) {
      formData.append('mode', mode)
    }

    try {
      const res = await uploadErpExcel(formData)
      setResult(res)
      if (onImportDone) onImportDone()
    } catch (err) {
      setError(err.message || 'Failed to import Excel file.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'560px', padding:'28px', position:'relative', color:'#fff' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><X size={20}/></button>
        
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', paddingBottom:'16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:'46px', height:'46px', borderRadius:'12px', background: accentGradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>📊</div>
          <div>
            <h3 style={{ margin:0, fontSize:'18px', fontWeight:700 }}>{modalTitle}</h3>
            <p style={{ margin:'2px 0 0', color:'#94a3b8', fontSize:'12px' }}>{modalSubtitle}</p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleUpload}>
            <div style={{ border:'2px dashed rgba(255,255,255,0.2)', borderRadius:'12px', padding:'24px', textAlign:'center', background:'rgba(255,255,255,0.02)', marginBottom:'20px' }}>
              <Upload size={36} style={{ color: accentColor, marginBottom:'12px' }} />
              <div style={{ fontSize:'14px', fontWeight:600, marginBottom:'4px' }}>Select or Drag ERP Excel File (.xlsx, .xls)</div>
              <div style={{ fontSize:'12px', color:'#94a3b8', marginBottom:'16px' }}>Existing products will be updated; new products will be created automatically.</div>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={e => {
                  setFile(e.target.files[0])
                  setError(null)
                }}
                style={{ display:'none' }}
                id="erp-file-input"
              />
              <label htmlFor="erp-file-input" style={{ background:'rgba(59,130,246,0.15)', color:'#3b82f6', border:'1px solid rgba(59,130,246,0.3)', padding:'8px 18px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:600, display:'inline-block' }}>
                {file ? file.name : '📁 Browse Excel File'}
              </label>
            </div>

            {error && (
              <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', padding:'14px 16px', borderRadius:'8px', fontSize:'13px', marginBottom:'16px', whiteSpace:'pre-line', lineHeight:1.5, maxHeight:'220px', overflowY:'auto' }}>
                ⚠️ {error}
              </div>
            )}

            {uploading ? (
              <div style={{ textAlign:'center', padding:'16px' }}>
                <div style={{ display:'inline-block', width:'28px', height:'28px', border:'3px solid rgba(16,185,129,0.3)', borderTopColor:'#10b981', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                <p style={{ margin:'12px 0 0', color:'#10b981', fontSize:'13px', fontWeight:600 }}>Processing ERP file... Please wait (~20,000 products)</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!file}
                className="admin-btn"
                style={{ width:'100%', background: file ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.1)', color: file ? '#fff' : '#64748b', cursor: file ? 'pointer' : 'not-allowed', padding:'12px', fontSize:'14px', fontWeight:700, borderRadius:'8px' }}
              >
                🚀 Upload & Sync Products
              </button>
            )}
          </form>
        ) : (
          <div>
            <div style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'12px', padding:'20px', marginBottom:'20px' }}>
              <div style={{ color:'#10b981', fontWeight:700, fontSize:'16px', marginBottom:'12px' }}>✅ {result.message}</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', fontSize:'13px' }}>
                <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
                  <span style={{ color:'#94a3b8' }}>Total Processed:</span> <strong style={{ color:'#fff' }}>{result.total}</strong>
                </div>
                <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
                  <span style={{ color:'#94a3b8' }}>Imported:</span> <strong style={{ color:'#10b981' }}>{result.imported}</strong>
                </div>
                <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
                  <span style={{ color:'#94a3b8' }}>New Created:</span> <strong style={{ color:'#3b82f6' }}>{result.created}</strong>
                </div>
                <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px' }}>
                  <span style={{ color:'#94a3b8' }}>Existing Updated:</span> <strong style={{ color:'#f59e0b' }}>{result.updated}</strong>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="admin-btn admin-btn-primary" style={{ width:'100%', padding:'10px' }}>
              View Excel Data in Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


export default function AdminProducts() {
  const [data,    setData]    = useState({ data: [], last_page: 1, total: 0 })
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState({})
  const [loading, setLoading] = useState(true)
  const [stockModal, setStockModal] = useState(null)
  const [offerModal, setOfferModal] = useState(null)
  const [editModal, setEditModal]   = useState(null)
  const [detailModal, setDetailModal] = useState(null)

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    product: null,
  })
  const [actionProcessing, setActionProcessing] = useState(false)
  const [actionError, setActionError] = useState('')
  const [erpModalOpen, setErpModalOpen] = useState(false)
  const [step1ModalOpen, setStep1ModalOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, per_page: 20, ...filter }
      if (search) params.search = search
      const res = await getProducts(params)
      setData(res)
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [page, search, filter])

  useEffect(() => { load() }, [load])

  const doToggleWeb = async (id) => {
    try { await toggleWeb(id); load() } catch (e) { alert(e.message) }
  }

  const doToggleOffer = async (product) => {
    if (product.is_offer) {
      try { await toggleOffer(product.id); load() } catch (e) { alert(e.message) }
    } else {
      setOfferModal(product)
    }
  }

  const doToggleBestOffer = async (id) => {
    try { await toggleBestOffer(id); load() } catch (e) { alert(e.message) }
  }

  const doToggleNewArrival = async (id) => {
    try { await toggleNewArrival(id); load() } catch (e) { alert(e.message) }
  }

  const requestProductAction = (product, action) => {
    setConfirmDialog({
      open: true,
      action,
      product,
    })
  }

  const closeProductConfirmation = () => {
    if (actionProcessing) return

    setConfirmDialog({
      open: false,
      action: null,
      product: null,
    })
  }

  const confirmProductAction = async () => {
    const product = confirmDialog.product
    const action = confirmDialog.action

    if (!product || !action) return

    setActionProcessing(true)
    setActionError('')

    try {
      if (action === 'permanent-delete') {
        await hardDeleteProduct(product.id)
      } else if (action === 'restore') {
        await restoreProduct(product.id)
      } else {
        await softDeleteProduct(product.id)
      }

      setConfirmDialog({
        open: false,
        action: null,
        product: null,
      })

      await load()
    } catch (error) {
      setConfirmDialog({
        open: false,
        action: null,
        product: null,
      })

      setActionError(
        error.message || 'The product could not be updated. Please try again.'
      )
    } finally {
      setActionProcessing(false)
    }
  }

  const sel = (val, onChange, opts, placeholder) => (
    <select value={val} onChange={e => onChange(e.target.value)} className="admin-input-field" style={{ cursor: 'pointer', padding: '0.5rem' }}>
      <option value="">{placeholder}</option>
      {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )

  return (
    <div>
      <ConfirmModal
        open={confirmDialog.open}
        title={
          confirmDialog.action === 'permanent-delete'
            ? 'Permanently delete this product?'
            : confirmDialog.action === 'restore'
              ? 'Restore this product?'
              : 'Move product to Deleted Items?'
        }
        message={
          confirmDialog.product ? (
            <strong>
              {confirmDialog.product.description ||
                `Product ${confirmDialog.product.navsa_product_code || ''}`}
            </strong>
          ) : null
        }
        description={
          confirmDialog.action === 'permanent-delete'
            ? 'This action cannot be undone. The product and its saved information will be permanently removed.'
            : confirmDialog.action === 'restore'
              ? 'The product will return to the active catalogue and will immediately be visible on the public website.'
              : 'The product will be removed from the website and active catalogue, but it can be restored later from Show Deleted.'
        }
        confirmText={
          confirmDialog.action === 'permanent-delete'
            ? 'Delete permanently'
            : confirmDialog.action === 'restore'
              ? 'Restore product'
              : 'Move to Deleted Items'
        }
        cancelText="Cancel"
        eyebrow={
          confirmDialog.action === 'permanent-delete'
            ? 'PERMANENT DELETE'
            : confirmDialog.action === 'restore'
              ? 'RESTORE PRODUCT'
              : 'DELETE PRODUCT'
        }
        icon={
          confirmDialog.action === 'permanent-delete'
            ? '×'
            : confirmDialog.action === 'restore'
              ? '↻'
              : '!'
        }
        variant={confirmDialog.action === 'restore' ? 'success' : 'danger'}
        loading={actionProcessing}
        closeOnBackdrop={!actionProcessing}
        onConfirm={confirmProductAction}
        onClose={closeProductConfirmation}
      />

      {actionError && (
        <div
          role="alert"
          style={{
            marginBottom: '1rem',
            padding: '0.85rem 1rem',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            color: '#fecaca',
            background: 'rgba(127, 29, 29, 0.22)',
          }}
        >
          {actionError}
        </div>
      )}
      {stockModal   && <StockModal product={stockModal} onClose={() => setStockModal(null)} onSaved={load} />}
      {offerModal   && <OfferModal product={offerModal} onClose={() => setOfferModal(null)} onSaved={load} />}
      {editModal    && <EditProductModal product={editModal} onClose={() => setEditModal(null)} onSaved={load} />}
      {detailModal  && <ProductDetailModal product={detailModal} onClose={() => setDetailModal(null)} />}
      {erpModalOpen   && <ErpImportModal mode="erp" onClose={() => setErpModalOpen(false)} onImportDone={load} />}
      {step1ModalOpen && <ErpImportModal mode="step1" onClose={() => setStep1ModalOpen(false)} onImportDone={load} />}

      <div className="admin-flex-between mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>Products Management</h1>
            <p style={{ color: '#94a3b8' }}>Manage your catalog and inventory</p>
          </div>
          <button
            onClick={() => setErpModalOpen(true)}
            className="admin-btn"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', gap: '8px', padding: '10px 18px', fontWeight: 600 }}
          >
            <Upload size={18} /> Bulk ERP Import (.xlsx)
          </button>
          <button
            onClick={() => setStep1ModalOpen(true)}
            className="admin-btn"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', gap: '8px', padding: '10px 18px', fontWeight: 600 }}
          >
            <Upload size={18} /> Step 1 Converted Import (.xlsx)
          </button>
        </div>
        <button onClick={() => setEditModal(BLANK_PRODUCT)} className="admin-btn admin-btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search description, NAVSA Product Code, barcode…"
            className="admin-input-field" style={{ flex: '1', minWidth: '200px' }} />
          {sel(filter.is_offer  || '', v => { setFilter(f=>({...f, is_offer: v})); setPage(1) },
            [{ value:'1', label:'Offer Only' },{ value:'0', label:'Non-Offer' }], 'All — Offers')}
          {sel(filter.live_for_web || '', v => { setFilter(f=>({...f, live_for_web: v})); setPage(1) },
            [{ value:'1', label:'Live Only' },{ value:'0', label:'Hidden Only' }], 'All — Visibility')}
          {filter.low_stock
            ? <button onClick={() => { setFilter(f=>({...f, low_stock:undefined})); setPage(1) }}
                className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#f59e0b' }}>⚠ Low Stock ✕</button>
            : <button onClick={() => { setFilter(f=>({...f, low_stock:1})); setPage(1) }}
                className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>⚠ Low Stock</button>
          }
          <button
            onClick={() => {
              setFilter(filter.show_deleted ? {} : { show_deleted: 1 })
              setPage(1)
            }}
            className="admin-btn admin-btn-ghost"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: filter.show_deleted ? '#3b82f6' : '#94a3b8'
            }}
          >
            {filter.show_deleted ? '← Back to Active Products' : '🗑 Show Deleted'}
          </button>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          {loading ? (
            <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading products…</div>
          ) : data.data?.length === 0 ? (
            <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>No products found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Ref</th>
                  <th style={{ minWidth: '280px' }}>Description</th>
                  <th style={{ width: '150px' }}>Brand</th>
                  <th style={{ width: '150px' }}>Category</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>New Arrivals</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>WIGIG</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Best-Sellers</th>
                  <th style={{ width: '140px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data?.map(p => (
                  <tr key={p.id} style={{ opacity: p.deleted ? 0.5 : 1, cursor:'pointer' }} onClick={() => setDetailModal(p)}>
                    <td style={{ color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 600 }}>{p.navsa_product_code || p.navsa_product_code || '—'}</td>
                    <td style={{ minWidth: '280px', maxWidth: '500px' }}>
                      <div style={{ fontWeight: 500, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
                      {p.is_offer && p.offer_label && (
                        <span className="admin-badge admin-badge-warning" style={{ marginTop: '4px', display: 'inline-block' }}>{p.offer_label}</span>
                      )}
                    </td>
                    <td>{p.brand?.brand_name || '—'}</td>
                    <td>{p.category?.category_name || '—'}</td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                       <label className="admin-switch">
                        <input type="checkbox" checked={!!p.is_offer} onChange={() => !p.deleted && doToggleOffer(p)} />
                        <span className="admin-slider"></span>
                      </label>
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                       <label className="admin-switch">
                        <input type="checkbox" checked={!!p.is_best_offer} onChange={() => !p.deleted && doToggleBestOffer(p.id)} />
                        <span className="admin-slider"></span>
                      </label>
                    </td>
                    <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                       <label className="admin-switch">
                        <input type="checkbox" checked={!!p.is_new_arrival} onChange={() => !p.deleted && doToggleNewArrival(p.id)} />
                        <span className="admin-slider"></span>
                      </label>
                    </td>
                    <td onClick={e => e.stopPropagation()} style={{ width: '140px', textAlign: 'right', paddingRight: '1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {!p.deleted ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditModal(p)
                              }}
                              className="admin-btn admin-btn-ghost"
                              style={{ padding: '0.5rem', color: '#3b82f6' }}
                              title="Edit product"
                              aria-label="Edit product"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                doToggleWeb(p.id)
                              }}
                              className="admin-btn admin-btn-ghost"
                              style={{
                                padding: '0.5rem',
                                color: p.live_for_web ? '#f59e0b' : '#10b981'
                              }}
                              title={p.live_for_web ? 'Hide from website' : 'Show on website'}
                              aria-label={p.live_for_web ? 'Hide from website' : 'Show on website'}
                            >
                              {p.live_for_web ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                requestProductAction(p, 'move-to-deleted')
                              }}
                              className="admin-btn admin-btn-ghost"
                              style={{ padding: '0.5rem', color: '#ef4444' }}
                              title="Move to Deleted Items"
                              aria-label="Move to Deleted Items"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                requestProductAction(p, 'restore')
                              }}
                              className="admin-btn admin-btn-ghost"
                              style={{ padding: '0.5rem', color: '#10b981' }}
                              title="Restore product as live"
                              aria-label="Restore product"
                            >
                              <RotateCcw size={16} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                requestProductAction(p, 'permanent-delete')
                              }}
                              className="admin-btn admin-btn-ghost"
                              style={{ padding: '0.5rem', color: '#ef4444' }}
                              title="Delete permanently"
                              aria-label="Delete product permanently"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', color: '#94a3b8', fontSize: '13px' }}>
          <span>{data.total} products — Page {data.current_page} of {data.last_page}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>← Prev</button>
            <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page >= data.last_page} className="admin-btn admin-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}