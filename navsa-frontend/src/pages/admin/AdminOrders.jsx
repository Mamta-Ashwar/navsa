// import { useState, useEffect, useCallback } from 'react';
// import {
//   Search,
//   ShoppingBag,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   XCircle,
//   Eye,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   MapPin,
//   DollarSign,
//   Printer,
//   Trash2,
//   RotateCcw,
// } from 'lucide-react';
// import { getOrders, updateOrderStatus, bulkUpdateOrderStatus, softDeleteOrder, restoreOrder, bulkSoftDeleteOrders, bulkRestoreOrders } from '../../services/adminApi';
// import ConfirmModal from '../../components/common/ConfirmModal';

// const STATUS_CONFIG = {
//   processing: {
//     label: 'Processing',
//     bg: 'rgba(59, 130, 246, 0.15)',
//     color: '#60a5fa',
//     border: 'rgba(59, 130, 246, 0.3)',
//     icon: Clock,
//   },
//   pending: {
//     label: 'Pending',
//     bg: 'rgba(245, 158, 11, 0.15)',
//     color: '#fbbf24',
//     border: 'rgba(245, 158, 11, 0.3)',
//     icon: AlertCircle,
//   },
//   completed: {
//     label: 'Completed',
//     bg: 'rgba(16, 185, 129, 0.2)',
//     color: '#10b981',
//     border: 'rgba(16, 185, 129, 0.4)',
//     icon: CheckCircle2,
//   },
//   cancelled: {
//     label: 'Cancelled',
//     bg: 'rgba(239, 68, 68, 0.15)',
//     color: '#f87171',
//     border: 'rgba(239, 68, 68, 0.3)',
//     icon: XCircle,
//   },
// };

// function StatusBadge({ status }) {
//   const normalized = (status || 'processing').toLowerCase();
//   const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.processing;
//   const Icon = config.icon;

//   return (
//     <span
//       style={{
//         display: 'inline-flex',
//         alignItems: 'center',
//         gap: '6px',
//         padding: '4px 10px',
//         borderRadius: '20px',
//         fontSize: '12px',
//         fontWeight: 600,
//         background: config.bg,
//         color: config.color,
//         border: `1px solid ${config.border}`,
//         textTransform: 'capitalize',
//       }}
//     >
//       <Icon size={13} />
//       {config.label}
//     </span>
//   );
// }

// function getFullAddressLines(order, customerDetail) {
//   const rawLines = [];

//   const isMeaningful = (str) => {
//     if (!str || typeof str !== 'string') return false;
//     const trimmed = str.trim();
//     if (!trimmed) return false;
//     // Filter out single non-digit character test entries like "m", ".", "-", etc.
//     if (trimmed.length === 1 && !/\d/.test(trimmed)) return false;
//     if (['m', 'n/a', 'na', 'none', 'null', 'undefined', '.', '-'].includes(trimmed.toLowerCase())) return false;
//     return true;
//   };

//   const line1 = customerDetail?.shipping_address_line_1 || customerDetail?.address_line_1;
//   const line2 = customerDetail?.shipping_address_line_2 || customerDetail?.address_line_2;
//   const city = customerDetail?.shipping_city || customerDetail?.city;
//   const state = customerDetail?.shipping_province || customerDetail?.province;
//   const zip = customerDetail?.shipping_zip_code || customerDetail?.zip_code;
//   const country = customerDetail?.shipping_country || customerDetail?.country;

//   if (isMeaningful(line1)) {
//     rawLines.push(line1.trim());
//   }

//   if (isMeaningful(line2) && !rawLines.some((l) => l.toLowerCase() === line2.trim().toLowerCase())) {
//     rawLines.push(line2.trim());
//   }

//   if (isMeaningful(order?.shipping_address)) {
//     const parts = order.shipping_address.split(/[\r\n]+/).map((p) => p.trim()).filter(isMeaningful);
//     for (const part of parts) {
//       if (!rawLines.some((l) => l.toLowerCase().includes(part.toLowerCase()) || part.toLowerCase().includes(l.toLowerCase()))) {
//         rawLines.push(part);
//       }
//     }
//   }

//   const cityStateZip = [city, state, zip].filter(isMeaningful).map((s) => s.trim()).join(', ');
//   if (cityStateZip) {
//     rawLines.push(cityStateZip);
//   }

//   if (isMeaningful(country)) {
//     rawLines.push(country.trim());
//   }

//   const finalLines = [];
//   for (const line of rawLines) {
//     if (!finalLines.some((existing) => existing.toLowerCase() === line.toLowerCase())) {
//       finalLines.push(line);
//     }
//   }

//   return finalLines.length > 0 ? finalLines : ['No address provided'];
// }

// function getBillingAddressLines(customerDetail, user) {
//   const isMeaningful = (str) => {
//     if (!str || typeof str !== 'string') return false;
//     const trimmed = str.trim();
//     if (!trimmed) return false;
//     if (trimmed.length === 1 && !/\d/.test(trimmed)) return false;
//     if (['m', 'n/a', 'na', 'none', 'null', 'undefined', '.', '-'].includes(trimmed.toLowerCase())) return false;
//     return true;
//   };

//   const rawLines = [];
//   const line1 = customerDetail?.address_line_1;
//   const line2 = customerDetail?.address_line_2;
//   const city = customerDetail?.city;
//   const state = customerDetail?.province || customerDetail?.state;
//   const zip = customerDetail?.zip_code;
//   const country = customerDetail?.country || user?.country;

//   if (isMeaningful(line1)) rawLines.push(line1.trim());
//   if (isMeaningful(line2)) rawLines.push(line2.trim());

//   const cityStateZip = [city, state, zip].filter(isMeaningful).map((s) => s.trim()).join(', ');
//   if (cityStateZip) rawLines.push(cityStateZip);
//   if (isMeaningful(country)) rawLines.push(country.trim());

//   return rawLines.length > 0 ? rawLines : ['Same as Shipping Address'];
// }

// function OrderDetailModal({ order, onClose, onStatusUpdate, readOnly = false }) {
//   const [currentStatus, setCurrentStatus] = useState(order.status || 'processing');
//   const [updating, setUpdating] = useState(false);

//   const user = order.user || {};
//   const customerDetail = user.customer_detail || {};
//   const addressLines = getFullAddressLines(order, customerDetail);
//   const billingLines = getBillingAddressLines(customerDetail, user);

//   const formattedDate = order.created_at
//     ? new Date(order.created_at).toLocaleString('en-GB', {
//         dateStyle: 'medium',
//         timeStyle: 'short',
//       })
//     : 'N/A';

//   const handleStatusChange = async (newStatus) => {
//     setUpdating(true);
//     try {
//       await updateOrderStatus(order.id, newStatus);
//       setCurrentStatus(newStatus);
//       if (onStatusUpdate) {
//         onStatusUpdate(order.id, newStatus);
//       }
//     } catch (err) {
//       alert(err.message || 'Failed to update order status');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handlePrintAddress = () => {
//     const printWindow = window.open('', '_blank', 'width=650,height=750');
//     if (!printWindow) return;

//     const recipientName = user.name || (customerDetail.first_name ? `${customerDetail.first_name || ''} ${customerDetail.last_name || ''}`.trim() : 'Customer');

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Dispatch Label - ${order.order_number}</title>
//           <style>
//             * { box-sizing: border-box; margin: 0; padding: 0; }
//             body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
//             .dispatch-label { border: 3px solid #0f172a; border-radius: 12px; padding: 30px; max-width: 550px; margin: 0 auto; }
//             .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
//             .brand-name { font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #0f172a; text-transform: uppercase; }
//             .order-no { font-size: 16px; font-weight: 700; background: #0f172a; color: #fff; padding: 4px 10px; border-radius: 6px; }
//             .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #64748b; margin-bottom: 8px; }
//             .recipient-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
//             .recipient-name { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
//             .company-name { font-size: 15px; font-weight: 600; color: #334155; margin-bottom: 12px; }
//             .address-block { font-size: 15px; line-height: 1.6; color: #1e293b; font-weight: 500; }
//             .contact-info { margin-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #475569; display: flex; flex-direction: column; gap: 4px; padding-top: 10px; }
//             .shipping-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; background: #f1f5f9; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #3b82f6; }
//             .notes-box { margin-top: 16px; font-size: 12px; background: #fffbeb; border: 1px solid #fef3c7; color: #92400e; padding: 10px; border-radius: 6px; }
//             @media print {
//               body { padding: 0; }
//               .dispatch-label { border: 3px solid #000; width: 100%; max-width: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="dispatch-label">
//             <div class="header">
//               <div class="brand-name">NAVSA INTERNATIONAL</div>
//               <div class="order-no">${order.order_number}</div>
//             </div>

//             <div class="section-label">SHIP TO / DELIVERY ADDRESS</div>
//             <div class="recipient-card">
//               <div class="recipient-name">${recipientName}</div>
//               ${user.company_name ? `<div class="company-name">${user.company_name}</div>` : ''}
//               <div class="address-block">
//                 ${addressLines.map((line) => `<div>${line}</div>`).join('')}
//               </div>
//               <div class="contact-info">
//                 <div>Email: ${user.email || 'N/A'}</div>
//                 <div>Phone: ${user.phone || customerDetail.mobile || 'N/A'}</div>
//               </div>
//             </div>

//             <div class="shipping-meta">
//               <div><strong>Order Date:</strong> ${formattedDate}</div>
//               <div><strong>Method:</strong> ${order.shipping_method || 'Standard Delivery'}</div>
//             </div>

//             ${order.notes ? `<div class="notes-box"><strong>Notes:</strong> ${order.notes}</div>` : ''}
//           </div>
//           <script>
//             window.onload = function() { window.print(); }
//           </script>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(htmlContent);
//     printWindow.document.close();
//   };

//   // Calculate items breakdown
//   let netSubtotal = 0;
//   const processedItems = (order.items || []).map((item) => {
//     const price = parseFloat(item.unit_price || item.product?.price || 0);
//     let cases = parseInt(item.case_quantity || item.quantity || 0);
//     let sub = parseFloat(item.subtotal || 0);

//     if ((!cases || cases <= 1) && sub > price && price > 0) {
//       cases = Math.round(sub / price);
//     } else if (!cases || cases <= 0) {
//       cases = 1;
//     }

//     if (!sub || sub <= 0) {
//       sub = price * cases;
//     }

//     netSubtotal += sub;

//     return {
//       ...item,
//       computedCases: cases,
//       computedPrice: price,
//       computedSubtotal: sub,
//       computedVatRate: Number(item.vat_rate || 0),
//       computedVatAmount: isNaN(Number(item.vat_amount)) ? 0 : Number(item.vat_amount || 0),
//       computedLineTotal: Number(item.line_total || 0) > 0 ? Number(item.line_total) : sub + Number(item.vat_amount || 0),
//     };
//   });

//   const registeredCountry = order.customer_country || customerDetail.country || user.country || '';
//   const isUK = Boolean(order.vat_applied) || /^(uk|u k|united kingdom|great britain|gb|gbr)$/i.test(String(registeredCountry).trim());
//   const vatAmount = isUK
//     ? processedItems.reduce((sum, item) => sum + Number(item.vat_amount || 0), 0)
//     : 0;
//   const storedNetSubtotal = Number(order.subtotal || 0);
//   const finalNetSubtotal = storedNetSubtotal > 0 ? storedNetSubtotal : netSubtotal;
//   const grandTotalAmount = Number(order.grand_total || order.total_amount || 0) > 0
//     ? Number(order.grand_total || order.total_amount)
//     : finalNetSubtotal + vatAmount;

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         inset: 0,
//         background: 'rgba(15, 23, 42, 0.85)',
//         backdropFilter: 'blur(8px)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 9999,
//         padding: '20px',
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           background: '#0f172a',
//           border: '1px solid rgba(255, 255, 255, 0.1)',
//           borderRadius: '16px',
//           width: '100%',
//           maxWidth: '960px',
//           maxHeight: '90vh',
//           overflowY: 'auto',
//           padding: '24px',
//           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
//           color: '#fff',
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start',
//             paddingBottom: '20px',
//             borderBottom: '1px solid rgba(255,255,255,0.08)',
//             marginBottom: '24px',
//           }}
//         >
//           <div>
//             <div style={{ fontSize: '12px', textTransform: 'uppercase', tracking: '1px', color: '#94a3b8', fontWeight: 600 }}>
//               ORDER DETAILS
//             </div>
//             <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0', color: '#fff' }}>
//               {order.order_number}
//             </h2>
//             <div style={{ fontSize: '13px', color: '#94a3b8' }}>
//               Placed on {formattedDate}
//             </div>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <StatusBadge status={currentStatus} />

//             <div style={{ position: 'relative' }}>
//               <select
//                 value={currentStatus}
//                 onChange={(e) => handleStatusChange(e.target.value)}
//                 disabled={updating || readOnly}
//                 style={{
//                   background: 'rgba(30, 41, 59, 0.9)',
//                   color: '#fff',
//                   border: '1px solid rgba(148, 163, 184, 0.2)',
//                   padding: '6px 12px',
//                   borderRadius: '8px',
//                   fontSize: '13px',
//                   fontWeight: 600,
//                   outline: 'none',
//                   cursor: 'pointer',
//                 }}
//               >
//                 <option value="processing">Processing</option>
//                 <option value="pending">Pending</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>

//             <button
//               onClick={onClose}
//               style={{
//                 background: 'rgba(255, 255, 255, 0.05)',
//                 border: 'none',
//                 color: '#94a3b8',
//                 width: '32px',
//                 height: '32px',
//                 borderRadius: '8px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//               }}
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Billing Details, Shipping Address & Shipping Specifications */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
//           {/* 1. Billing Details */}
//           <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
//               <User size={16} />
//               <strong style={{ fontSize: '14px' }}>Billing Details</strong>
//             </div>
//             <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
//               <div><strong>Name:</strong> {user.name || 'Guest User'}</div>
//               <div><strong>Email:</strong> {user.email || 'N/A'}</div>
//               {user.company_name && <div><strong>Company:</strong> {user.company_name}</div>}
//               <div>
//                 <strong>Phone:</strong>{' '}
//                 {user.phone ||
//                   user.phone_number ||
//                   user.mobile ||
//                   customerDetail.mobile ||
//                   customerDetail.registered_phone ||
//                   customerDetail.shipping_telephone ||
//                   'N/A'}
//               </div>
//               <div style={{ marginTop: '4px' }}>
//                 <strong style={{ display: 'block', marginBottom: '4px', color: '#94a3b8' }}>Billing Address:</strong>
//                 <div
//                   style={{
//                     padding: '8px 12px',
//                     background: 'rgba(15, 23, 42, 0.6)',
//                     borderRadius: '6px',
//                     borderLeft: '3px solid #38bdf8',
//                     lineHeight: '1.5',
//                     color: '#fff',
//                   }}
//                 >
//                   {billingLines.map((line, i) => (
//                     <div key={i}>{line}</div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 2. Shipping Address */}
//           <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
//                 <MapPin size={16} />
//                 <strong style={{ fontSize: '14px' }}>Shipping Address</strong>
//               </div>
//               <button
//                 type="button"
//                 onClick={handlePrintAddress}
//                 style={{
//                   display: 'inline-flex',
//                   alignItems: 'center',
//                   gap: '6px',
//                   padding: '5px 12px',
//                   fontSize: '12px',
//                   fontWeight: 600,
//                   background: 'rgba(59, 130, 246, 0.2)',
//                   color: '#60a5fa',
//                   border: '1px solid rgba(59, 130, 246, 0.4)',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                 }}
//                 title="Print Address / Shipping Label"
//               >
//                 <Printer size={14} />
//                 Print Address
//               </button>
//             </div>
//             <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#cbd5e1' }}>
//               <div>
//                 <strong style={{ display: 'block', marginBottom: '4px', color: '#94a3b8' }}>Delivery Address:</strong>
//                 <div
//                   style={{
//                     padding: '8px 12px',
//                     background: 'rgba(15, 23, 42, 0.6)',
//                     borderRadius: '6px',
//                     borderLeft: '3px solid #10b981',
//                     lineHeight: '1.5',
//                     color: '#fff',
//                   }}
//                 >
//                   {addressLines.map((line, i) => (
//                     <div key={i}>{line}</div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 3. Shipping Details & Freight Meta */}
//           <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
//               <Truck size={16} />
//               <strong style={{ fontSize: '14px' }}>Shipping Details</strong>
//             </div>
//             <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
//               <div><strong>Method / Container:</strong> {order.shipping_method || '20 ft Dry (Standard)'}</div>
//               <div><strong>Currency:</strong> GBP (£)</div>
//               <div><strong>Destination Port:</strong> Liverpool Port, UK</div>
//               <div><strong>Ex Works:</strong> No</div>

//               <div
//                 style={{
//                   marginTop: '6px',
//                   padding: '8px 10px',
//                   background: 'rgba(30, 41, 59, 0.6)',
//                   borderRadius: '6px',
//                   fontSize: '12px',
//                   color: '#94a3b8',
//                   border: '1px solid rgba(255, 255, 255, 0.05)',
//                 }}
//               >
//                 <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>NAVSA Container Specs:</div>
//                 <div>Cubic Volume: 33.20 m³ / 1,172.44 ft³</div>
//                 <div>Gross Weight: 23,956 kg | Payload: 21,727 kg</div>
//                 {order.notes && (
//                   <div style={{ marginTop: '4px', color: '#f8fafc', fontStyle: 'italic' }}>
//                     Notes: {order.notes}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Order Items Table */}
//         <div style={{ marginBottom: '24px' }}>
//           <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>
//             Ordered Items ({processedItems.length})
//           </h4>
//           <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
//               <thead>
//                 <tr style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
//                   <th style={{ padding: '10px 14px' }}>Code</th>
//                   <th style={{ padding: '10px 14px' }}>Product</th>
//                   <th style={{ padding: '10px 14px', textAlign: 'center' }}>Cases</th>
//                   <th style={{ padding: '10px 14px', textAlign: 'right' }}>Price/Case</th>
//                   <th style={{ padding: '10px 14px', textAlign: 'right' }}>Net</th>
//                   {isUK && <th style={{ padding: '10px 14px', textAlign: 'right' }}>VAT</th>}
//                   {isUK && <th style={{ padding: '10px 14px', textAlign: 'right' }}>Line Total</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {processedItems.map((item, idx) => {
//                   return (
//                     <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
//                       <td style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 600 }}>
//                         {item.navsa_product_code || '—'}
//                       </td>
//                       <td style={{ padding: '12px 14px', color: '#fff' }}>
//                         {item.product_name || item.product?.description || 'Product Item'}
//                       </td>
//                       <td style={{ padding: '12px 14px', textAlign: 'center', color: '#cbd5e1', fontWeight: 600 }}>
//                         {item.computedCases}
//                       </td>
//                       <td style={{ padding: '12px 14px', textAlign: 'right', color: '#cbd5e1' }}>
//                         £{item.computedPrice.toFixed(2)}
//                       </td>
//                       <td style={{ padding: '12px 14px', textAlign: 'right', color: '#fff', fontWeight: 600 }}>
//                         <div>£{item.computedSubtotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
//                         <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
//                           ({item.computedCases} × £{item.computedPrice.toFixed(2)})
//                         </div>
//                       </td>
//                       {isUK && (
//                         <td style={{ padding: '12px 14px', textAlign: 'right', color: '#fbbf24' }}>
//                           <div>{item.computedVatRate.toFixed(3).replace(/\.?0+$/, '')}%</div>
//                           <div style={{ fontSize: '11px' }}>£{item.computedVatAmount.toFixed(2)}</div>
//                         </td>
//                       )}
//                       {isUK && (
//                         <td style={{ padding: '12px 14px', textAlign: 'right', color: '#fff', fontWeight: 700 }}>
//                           £{item.computedLineTotal.toFixed(2)}
//                         </td>
//                       )}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Order Total Summary */}
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-end',
//             paddingTop: '16px',
//             borderTop: '1px solid rgba(255,255,255,0.1)',
//           }}
//         >
//           <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
//               <span>Subtotal:</span>
//               <strong style={{ color: '#fff' }}>
//                 £{finalNetSubtotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </strong>
//             </div>
//             {isUK && (
//               <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
//                 <span>VAT Total:</span>
//                 <strong style={{ color: '#f59e0b' }}>
//                   £{vatAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </strong>
//               </div>
//             )}
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 fontSize: '18px',
//                 fontWeight: 700,
//                 color: '#60a5fa',
//                 marginTop: '6px',
//                 paddingTop: '8px',
//                 borderTop: '1px dashed rgba(255,255,255,0.1)',
//               }}
//             >
//               <span>Total Amount:</span>
//               <span>
//                 £{grandTotalAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [stats, setStats] = useState({
//     total_orders: 0,
//     processing_orders: 0,
//     completed_orders: 0,
//     total_revenue: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [selectedOrderIds, setSelectedOrderIds] = useState([]);
//   const [bulkAction, setBulkAction] = useState('');
//   const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
//   const [bulkUpdating, setBulkUpdating] = useState(false);
//   const [bulkError, setBulkError] = useState('');
//   const [showDeleted, setShowDeleted] = useState(false);
//   const [rowUpdatingId, setRowUpdatingId] = useState(null);
//   const [orderActionConfirm, setOrderActionConfirm] = useState({ open: false, order: null, action: null });
//   const [orderActionLoading, setOrderActionLoading] = useState(false);

//   const fetchOrdersData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getOrders({
//         page: currentPage,
//         search,
//         status: selectedStatus,
//         show_deleted: showDeleted ? 1 : 0,
//       });

//       if (res.orders) {
//         setOrders(res.orders.data || []);
//         setTotalPages(res.orders.last_page || 1);
//       } else {
//         setOrders(Array.isArray(res) ? res : []);
//         setTotalPages(1);
//       }

//       if (res.stats) {
//         setStats(res.stats);
//       }
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, search, selectedStatus, showDeleted]);

//   useEffect(() => {
//     fetchOrdersData();
//   }, [fetchOrdersData]);

//   useEffect(() => {
//     setSelectedOrderIds([]);
//     setBulkAction('');
//     setBulkError('');
//   }, [currentPage, search, selectedStatus, showDeleted]);

//   const handleStatusUpdateInList = (orderId, newStatus) => {
//     setOrders((prev) =>
//       prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
//     );
//     fetchOrdersData();
//   };

//   const handleRowStatusChange = async (orderId, newStatus) => {
//     setRowUpdatingId(orderId);
//     setBulkError('');
//     try {
//       await updateOrderStatus(orderId, newStatus);
//       await fetchOrdersData();
//     } catch (error) {
//       setBulkError(error.message || 'Unable to update order status.');
//     } finally {
//       setRowUpdatingId(null);
//     }
//   };

//   const requestOrderAction = (order, action) => {
//     setOrderActionConfirm({ open: true, order, action });
//   };

//   const confirmOrderAction = async () => {
//     const { order, action } = orderActionConfirm;
//     if (!order || !action) return;
//     setOrderActionLoading(true);
//     setBulkError('');
//     try {
//       if (action === 'delete') await softDeleteOrder(order.id);
//       else if (action === 'restore') await restoreOrder(order.id);
//       setOrderActionConfirm({ open: false, order: null, action: null });
//       setSelectedOrderIds((prev) => prev.filter((id) => id !== order.id));
//       await fetchOrdersData();
//     } catch (error) {
//       setBulkError(error.message || `Unable to ${action} order.`);
//     } finally {
//       setOrderActionLoading(false);
//     }
//   };

//   const allVisibleSelected =
//     orders.length > 0 && orders.every((order) => selectedOrderIds.includes(order.id));

//   const toggleSelectAllVisible = () => {
//     if (allVisibleSelected) {
//       setSelectedOrderIds([]);
//       return;
//     }
//     setSelectedOrderIds(orders.map((order) => order.id));
//   };

//   const toggleOrderSelection = (orderId) => {
//     setSelectedOrderIds((prev) =>
//       prev.includes(orderId)
//         ? prev.filter((id) => id !== orderId)
//         : [...prev, orderId]
//     );
//   };

//   const bulkActionLabel = {
//     pending: 'Mark as Pending',
//     processing: 'Mark as Processing',
//     completed: 'Mark as Completed',
//     cancelled: 'Cancel Orders',
//     delete: 'Delete Orders',
//     restore: 'Restore Orders',
//   }[bulkAction] || 'Update Orders';

//   const requestBulkUpdate = () => {
//     setBulkError('');
//     if (selectedOrderIds.length === 0) {
//       setBulkError('Select at least one order first.');
//       return;
//     }
//     if (!bulkAction) {
//       setBulkError('Choose a bulk action first.');
//       return;
//     }
//     setBulkConfirmOpen(true);
//   };

//   const confirmBulkUpdate = async () => {
//     if (!bulkAction || selectedOrderIds.length === 0) return;

//     setBulkUpdating(true);
//     setBulkError('');
//     try {
//       if (bulkAction === 'delete') await bulkSoftDeleteOrders(selectedOrderIds);
//       else if (bulkAction === 'restore') await bulkRestoreOrders(selectedOrderIds);
//       else await bulkUpdateOrderStatus(selectedOrderIds, bulkAction);
//       setBulkConfirmOpen(false);
//       setSelectedOrderIds([]);
//       setBulkAction('');
//       await fetchOrdersData();
//     } catch (err) {
//       setBulkError(err.message || 'Failed to update selected orders.');
//       setBulkConfirmOpen(false);
//     } finally {
//       setBulkUpdating(false);
//     }
//   };

//   const confirmVariant = bulkAction === 'delete'
//     ? 'danger'
//     : ['completed', 'restore'].includes(bulkAction)
//       ? 'success'
//       : 'warning';

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//       {/* Header Stats */}
//       <div
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
//           gap: '16px',
//         }}
//       >
//         <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <ShoppingBag size={22} />
//           </div>
//           <div>
//             <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Total Orders</span>
//             <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{stats.total_orders}</div>
//           </div>
//         </div>

//         <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <Clock size={22} />
//           </div>
//           <div>
//             <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Processing</span>
//             <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{stats.processing_orders}</div>
//           </div>
//         </div>

//         <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <CheckCircle2 size={22} />
//           </div>
//           <div>
//             <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Completed</span>
//             <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{stats.completed_orders}</div>
//           </div>
//         </div>

//         <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <DollarSign size={22} />
//           </div>
//           <div>
//             <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Completed Revenue</span>
//             <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
//               £{Number(stats.total_revenue || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="glass-panel" style={{ padding: '24px' }}>
//         {/* Search + status filters */}
//         <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '10px', padding: '8px 14px', width: '320px', maxWidth: '100%' }}>
//             <Search size={18} style={{ color: '#64748b' }} />
//             <input
//               type="text"
//               placeholder="Search order #, customer, email..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setCurrentPage(1);
//               }}
//               style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '100%' }}
//             />
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
//             {['all', 'processing', 'pending', 'completed', 'cancelled'].map((st) => (
//               <button
//                 key={st}
//                 onClick={() => {
//                   setSelectedStatus(st);
//                   setCurrentPage(1);
//                 }}
//                 style={{
//                   background: selectedStatus === st ? '#3b82f6' : 'rgba(15, 23, 42, 0.6)',
//                   color: selectedStatus === st ? '#fff' : '#94a3b8',
//                   border: `1px solid ${selectedStatus === st ? '#3b82f6' : 'rgba(148, 163, 184, 0.2)'}`,
//                   padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
//                   cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
//                 }}
//               >
//                 {st}
//               </button>
//             ))}
//             <button
//               type="button"
//               onClick={() => { setShowDeleted((value) => !value); setSelectedOrderIds([]); setBulkAction(''); setCurrentPage(1); }}
//               style={{ marginLeft: '8px', background: showDeleted ? 'rgba(16,185,129,0.14)' : 'rgba(51,65,85,0.6)', color: showDeleted ? '#34d399' : '#cbd5e1', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
//             >
//               {showDeleted ? '← Back to Active Orders' : `Show Deleted (${stats.deleted_orders || 0})`}
//             </button>
//           </div>
//         </div>

//         {/* Bulk action bar */}
//         <div
//           style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
//             gap: '12px', marginBottom: '16px', padding: '12px 14px', borderRadius: '10px',
//             background: selectedOrderIds.length > 0 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(15, 23, 42, 0.45)',
//             border: selectedOrderIds.length > 0 ? '1px solid rgba(59, 130, 246, 0.28)' : '1px solid rgba(148, 163, 184, 0.12)',
//           }}
//         >
//           <div style={{ color: selectedOrderIds.length > 0 ? '#93c5fd' : '#64748b', fontSize: '13px', fontWeight: 700 }}>
//             {selectedOrderIds.length > 0 ? `${selectedOrderIds.length} order(s) selected` : 'Select orders to use bulk actions'}
//           </div>

//           <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
//             <select
//               value={bulkAction}
//               onChange={(e) => setBulkAction(e.target.value)}
//               disabled={selectedOrderIds.length === 0 || bulkUpdating}
//               style={{
//                 minWidth: '190px', background: '#0f1d31', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.25)',
//                 borderRadius: '8px', padding: '8px 10px', fontSize: '13px', outline: 'none',
//                 opacity: selectedOrderIds.length === 0 ? 0.55 : 1,
//               }}
//             >
//               <option value="">Bulk actions…</option>
//               {showDeleted ? (
//                 <option value="restore">Restore Selected</option>
//               ) : (
//                 <>
//                   <option value="pending">Mark as Pending</option>
//                   <option value="processing">Mark as Processing</option>
//                   <option value="completed">Mark as Completed</option>
//                   <option value="cancelled">Cancel Orders</option>
//                   <option value="delete">Delete Selected</option>
//                 </>
//               )}
//             </select>
//             <button
//               type="button"
//               onClick={requestBulkUpdate}
//               disabled={selectedOrderIds.length === 0 || !bulkAction || bulkUpdating}
//               style={{
//                 background: selectedOrderIds.length > 0 && bulkAction ? '#2563eb' : 'rgba(51,65,85,0.7)', color: '#fff',
//                 border: '1px solid rgba(96,165,250,0.28)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
//                 fontWeight: 700, cursor: selectedOrderIds.length > 0 && bulkAction ? 'pointer' : 'not-allowed',
//               }}
//             >
//               Apply
//             </button>
//             {selectedOrderIds.length > 0 && (
//               <button
//                 type="button"
//                 onClick={() => { setSelectedOrderIds([]); setBulkAction(''); setBulkError(''); }}
//                 style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer' }}
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {bulkError && (
//           <div role="alert" style={{ marginBottom: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(127,29,29,0.18)', border: '1px solid rgba(248,113,113,0.35)', color: '#fecaca', fontSize: '13px' }}>
//             {bulkError}
//           </div>
//         )}

//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
//             <thead>
//               <tr style={{ background: 'rgba(15, 23, 42, 0.7)', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
//                 <th style={{ padding: '12px 12px', width: '44px', textAlign: 'center' }}>
//                   <input
//                     type="checkbox"
//                     aria-label="Select all orders on this page"
//                     checked={allVisibleSelected}
//                     onChange={toggleSelectAllVisible}
//                     disabled={orders.length === 0 || loading}
//                     style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }}
//                   />
//                 </th>
//                 <th style={{ padding: '12px 16px' }}>Order #</th>
//                 <th style={{ padding: '12px 16px' }}>Customer</th>
//                 <th style={{ padding: '12px 16px' }}>Date</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'center' }}>Items</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Amount</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
//                 <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading orders...</td></tr>
//               ) : orders.length === 0 ? (
//                 <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No orders found.</td></tr>
//               ) : (
//                 orders.map((order) => {
//                   const customerName = order.user?.name || order.user?.company_name || 'Guest User';
//                   const dateStr = order.created_at
//                     ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
//                     : 'N/A';

//                   const computedOrderTotal = (order.items || []).reduce((sum, item) => {
//                     const price = parseFloat(item.unit_price || 0);
//                     let cases = parseInt(item.case_quantity || item.quantity || 0);
//                     let sub = parseFloat(item.subtotal || 0);
//                     if ((!cases || cases <= 1) && sub > price && price > 0) cases = Math.round(sub / price);
//                     else if (!cases || cases <= 0) cases = 1;
//                     if (!sub || sub <= 0) sub = price * cases;
//                     return sum + sub;
//                   }, 0);

//                   const finalRowTotal = parseFloat(order.grand_total || order.total_amount || 0) > 0
//                     ? parseFloat(order.grand_total || order.total_amount)
//                     : computedOrderTotal;
//                   const isChecked = selectedOrderIds.includes(order.id);

//                   return (
//                     <tr
//                       key={order.id}
//                       style={{
//                         borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s',
//                         background: isChecked ? 'rgba(59,130,246,0.08)' : 'transparent',
//                       }}
//                     >
//                       <td style={{ padding: '14px 12px', textAlign: 'center' }}>
//                         <input
//                           type="checkbox"
//                           aria-label={`Select order ${order.order_number}`}
//                           checked={isChecked}
//                           onChange={() => toggleOrderSelection(order.id)}
//                           style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }}
//                         />
//                       </td>
//                       <td style={{ padding: '14px 16px', fontWeight: 700, color: '#38bdf8' }}>{order.order_number}</td>
//                       <td style={{ padding: '14px 16px', color: '#f8fafc' }}>
//                         <div style={{ fontWeight: 600 }}>{customerName}</div>
//                         <div style={{ fontSize: '12px', color: '#64748b' }}>{order.user?.email}</div>
//                       </td>
//                       <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{dateStr}</td>
//                       <td style={{ padding: '14px 16px', textAlign: 'center', color: '#cbd5e1' }}>{order.total_items || (order.items ? order.items.length : 0)}</td>
//                       <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#fff' }}>
//                         £{finalRowTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </td>
//                       <td style={{ padding: '14px 16px', textAlign: 'center' }}>
//                         {showDeleted ? (
//                           <StatusBadge status={order.status} />
//                         ) : (
//                           <select
//                             value={order.status || 'processing'}
//                             onChange={(e) => handleRowStatusChange(order.id, e.target.value)}
//                             disabled={rowUpdatingId === order.id}
//                             style={{ background: '#0f2238', color: '#fff', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="processing">Processing</option>
//                             <option value="completed">Completed</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                         )}
//                       </td>
//                       <td style={{ padding: '14px 16px', textAlign: 'right' }}>
//                         <div style={{ display: 'inline-flex', gap: '7px' }}>
//                           <button
//                             onClick={() => setSelectedOrder(order)}
//                             style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
//                           >
//                             <Eye size={15} /> View
//                           </button>
//                           {showDeleted ? (
//                             <button onClick={() => requestOrderAction(order, 'restore')} title="Restore order" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.28)', padding: '6px 9px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
//                               <RotateCcw size={16} />
//                             </button>
//                           ) : (
//                             <button onClick={() => requestOrderAction(order, 'delete')} title="Delete order" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.28)', padding: '6px 9px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
//                               <Trash2 size={16} />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
//             <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', color: currentPage <= 1 ? '#475569' : '#fff', padding: '6px 12px', borderRadius: '6px', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
//               <ChevronLeft size={16} />
//             </button>
//             <span style={{ fontSize: '13px', color: '#94a3b8' }}>Page {currentPage} of {totalPages}</span>
//             <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', color: currentPage >= totalPages ? '#475569' : '#fff', padding: '6px 12px', borderRadius: '6px', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         )}
//       </div>

//       {selectedOrder && (
//         <OrderDetailModal order={selectedOrder} readOnly={showDeleted} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdateInList} />
//       )}

//       <ConfirmModal
//         open={bulkConfirmOpen}
//         title={bulkActionLabel}
//         eyebrow="BULK ORDER UPDATE"
//         variant={confirmVariant}
//         icon={bulkAction === 'restore' ? '↻' : bulkAction === 'delete' || bulkAction === 'cancelled' ? '!' : '✓'}
//         loading={bulkUpdating}
//         confirmText={bulkActionLabel}
//         message={`Apply “${bulkActionLabel}” to ${selectedOrderIds.length} selected order(s)?`}
//         description={bulkAction === 'delete' ? 'Deleted orders stay recoverable in Show Deleted. No order is permanently destroyed.' : bulkAction === 'restore' ? 'The selected orders will return to the active Orders list.' : 'This updates the selected order statuses.'}
//         onClose={() => !bulkUpdating && setBulkConfirmOpen(false)}
//         onConfirm={confirmBulkUpdate}
//       />

//       <ConfirmModal
//         open={orderActionConfirm.open}
//         title={orderActionConfirm.action === 'restore' ? 'Restore Order' : 'Delete Order'}
//         eyebrow="ORDER MANAGEMENT"
//         variant={orderActionConfirm.action === 'restore' ? 'success' : 'danger'}
//         icon={orderActionConfirm.action === 'restore' ? '↻' : '!'}
//         loading={orderActionLoading}
//         confirmText={orderActionConfirm.action === 'restore' ? 'Restore Order' : 'Delete Order'}
//         message={orderActionConfirm.order ? `${orderActionConfirm.action === 'restore' ? 'Restore' : 'Delete'} ${orderActionConfirm.order.order_number}?` : ''}
//         description={orderActionConfirm.action === 'restore' ? 'This order will return to the active Orders list.' : 'The order will be moved to Show Deleted and remains recoverable.'}
//         onClose={() => !orderActionLoading && setOrderActionConfirm({ open: false, order: null, action: null })}
//         onConfirm={confirmOrderAction}
//       />
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  XCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  DollarSign,
  Printer,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { getOrders, updateOrderStatus, bulkUpdateOrderStatus, softDeleteOrder, restoreOrder, bulkSoftDeleteOrders, bulkRestoreOrders } from '../../services/adminApi';
import ConfirmModal from '../../components/common/ConfirmModal';

const STATUS_CONFIG = {
  processing: {
    label: 'Processing',
    bg: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    border: 'rgba(59, 130, 246, 0.3)',
    icon: Clock,
  },
  pending: {
    label: 'Pending',
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    border: 'rgba(245, 158, 11, 0.3)',
    icon: AlertCircle,
  },
  completed: {
    label: 'Completed',
    bg: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    border: 'rgba(16, 185, 129, 0.4)',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    border: 'rgba(239, 68, 68, 0.3)',
    icon: XCircle,
  },
};

function StatusBadge({ status }) {
  const normalized = (status || 'processing').toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.processing;
  const Icon = config.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        textTransform: 'capitalize',
      }}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

function getFullAddressLines(order, customerDetail) {
  const rawLines = [];

  const isMeaningful = (str) => {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    if (!trimmed) return false;
    // Filter out single non-digit character test entries like "m", ".", "-", etc.
    if (trimmed.length === 1 && !/\d/.test(trimmed)) return false;
    if (['m', 'n/a', 'na', 'none', 'null', 'undefined', '.', '-'].includes(trimmed.toLowerCase())) return false;
    return true;
  };

  const line1 = customerDetail?.shipping_address_line_1 || customerDetail?.address_line_1;
  const line2 = customerDetail?.shipping_address_line_2 || customerDetail?.address_line_2;
  const city = customerDetail?.shipping_city || customerDetail?.city;
  const state = customerDetail?.shipping_province || customerDetail?.province;
  const zip = customerDetail?.shipping_zip_code || customerDetail?.zip_code;
  const country = customerDetail?.shipping_country || customerDetail?.country;

  if (isMeaningful(line1)) {
    rawLines.push(line1.trim());
  }

  if (isMeaningful(line2) && !rawLines.some((l) => l.toLowerCase() === line2.trim().toLowerCase())) {
    rawLines.push(line2.trim());
  }

  if (isMeaningful(order?.shipping_address)) {
    const parts = order.shipping_address.split(/[\r\n]+/).map((p) => p.trim()).filter(isMeaningful);
    for (const part of parts) {
      if (!rawLines.some((l) => l.toLowerCase().includes(part.toLowerCase()) || part.toLowerCase().includes(l.toLowerCase()))) {
        rawLines.push(part);
      }
    }
  }

  const cityStateZip = [city, state, zip].filter(isMeaningful).map((s) => s.trim()).join(', ');
  if (cityStateZip) {
    rawLines.push(cityStateZip);
  }

  if (isMeaningful(country)) {
    rawLines.push(country.trim());
  }

  const finalLines = [];
  for (const line of rawLines) {
    if (!finalLines.some((existing) => existing.toLowerCase() === line.toLowerCase())) {
      finalLines.push(line);
    }
  }

  return finalLines.length > 0 ? finalLines : ['No address provided'];
}

function getBillingAddressLines(customerDetail, user) {
  const isMeaningful = (str) => {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    if (!trimmed) return false;
    if (trimmed.length === 1 && !/\d/.test(trimmed)) return false;
    if (['m', 'n/a', 'na', 'none', 'null', 'undefined', '.', '-'].includes(trimmed.toLowerCase())) return false;
    return true;
  };

  const rawLines = [];
  const line1 = customerDetail?.address_line_1;
  const line2 = customerDetail?.address_line_2;
  const city = customerDetail?.city;
  const state = customerDetail?.province || customerDetail?.state;
  const zip = customerDetail?.zip_code;
  const country = customerDetail?.country || user?.country;

  if (isMeaningful(line1)) rawLines.push(line1.trim());
  if (isMeaningful(line2)) rawLines.push(line2.trim());

  const cityStateZip = [city, state, zip].filter(isMeaningful).map((s) => s.trim()).join(', ');
  if (cityStateZip) rawLines.push(cityStateZip);
  if (isMeaningful(country)) rawLines.push(country.trim());

  return rawLines.length > 0 ? rawLines : ['Same as Shipping Address'];
}

function OrderDetailModal({ order, onClose, onStatusUpdate, readOnly = false }) {
  const [currentStatus, setCurrentStatus] = useState(order.status || 'processing');
  const [updating, setUpdating] = useState(false);

  const user = order.user || {};
  const customerDetail = user.customer_detail || {};
  const addressLines = getFullAddressLines(order, customerDetail);
  const billingLines = getBillingAddressLines(customerDetail, user);

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'N/A';

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setCurrentStatus(newStatus);
      if (onStatusUpdate) {
        onStatusUpdate(order.id, newStatus);
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintAddress = () => {
    const printWindow = window.open('', '_blank', 'width=650,height=750');
    if (!printWindow) return;

    const recipientName = user.name || (customerDetail.first_name ? `${customerDetail.first_name || ''} ${customerDetail.last_name || ''}`.trim() : 'Customer');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dispatch Label - ${order.order_number}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
            .dispatch-label { border: 3px solid #0f172a; border-radius: 12px; padding: 30px; max-width: 550px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
            .brand-name { font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #0f172a; text-transform: uppercase; }
            .order-no { font-size: 16px; font-weight: 700; background: #0f172a; color: #fff; padding: 4px 10px; border-radius: 6px; }
            .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #64748b; margin-bottom: 8px; }
            .recipient-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
            .recipient-name { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
            .company-name { font-size: 15px; font-weight: 600; color: #334155; margin-bottom: 12px; }
            .address-block { font-size: 15px; line-height: 1.6; color: #1e293b; font-weight: 500; }
            .contact-info { margin-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #475569; display: flex; flex-direction: column; gap: 4px; padding-top: 10px; }
            .shipping-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; background: #f1f5f9; padding: 12px 16px; border-radius: 6px; border-left: 4px solid #3b82f6; }
            .notes-box { margin-top: 16px; font-size: 12px; background: #fffbeb; border: 1px solid #fef3c7; color: #92400e; padding: 10px; border-radius: 6px; }
            @media print {
              body { padding: 0; }
              .dispatch-label { border: 3px solid #000; width: 100%; max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="dispatch-label">
            <div class="header">
              <div class="brand-name">NAVSA INTERNATIONAL</div>
              <div class="order-no">${order.order_number}</div>
            </div>

            <div class="section-label">SHIP TO / DELIVERY ADDRESS</div>
            <div class="recipient-card">
              <div class="recipient-name">${recipientName}</div>
              ${user.company_name ? `<div class="company-name">${user.company_name}</div>` : ''}
              <div class="address-block">
                ${addressLines.map((line) => `<div>${line}</div>`).join('')}
              </div>
              <div class="contact-info">
                <div>Email: ${user.email || 'N/A'}</div>
                <div>Phone: ${user.phone || customerDetail.mobile || 'N/A'}</div>
              </div>
            </div>

            <div class="shipping-meta">
              <div><strong>Order Date:</strong> ${formattedDate}</div>
              <div><strong>Method:</strong> ${order.shipping_method || 'Standard Delivery'}</div>
            </div>

            ${order.notes ? `<div class="notes-box"><strong>Notes:</strong> ${order.notes}</div>` : ''}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Calculate items breakdown
  let netSubtotal = 0;
  const processedItems = (order.items || []).map((item) => {
    const price = parseFloat(item.unit_price || item.product?.price || 0);
    let cases = parseInt(item.case_quantity || item.quantity || 0);
    let sub = parseFloat(item.subtotal || 0);

    if ((!cases || cases <= 1) && sub > price && price > 0) {
      cases = Math.round(sub / price);
    } else if (!cases || cases <= 0) {
      cases = 1;
    }

    if (!sub || sub <= 0) {
      sub = price * cases;
    }

    netSubtotal += sub;

    return {
      ...item,
      computedCases: cases,
      computedPrice: price,
      computedSubtotal: sub,
      computedVatRate: Number(item.vat_rate || 0),
      computedVatAmount: isNaN(Number(item.vat_amount)) ? 0 : Number(item.vat_amount || 0),
      computedLineTotal: Number(item.line_total || 0) > 0 ? Number(item.line_total) : sub + Number(item.vat_amount || 0),
    };
  });

  const registeredCountry = order.customer_country || customerDetail.country || user.country || '';
  const isUK = Boolean(order.vat_applied) || /^(uk|u k|united kingdom|great britain|gb|gbr)$/i.test(String(registeredCountry).trim());
  const vatAmount = isUK
    ? processedItems.reduce((sum, item) => sum + Number(item.vat_amount || 0), 0)
    : 0;
  const storedNetSubtotal = Number(order.subtotal || 0);
  const finalNetSubtotal = storedNetSubtotal > 0 ? storedNetSubtotal : netSubtotal;
  const grandTotalAmount = Number(order.grand_total || order.total_amount || 0) > 0
    ? Number(order.grand_total || order.total_amount)
    : finalNetSubtotal + vatAmount;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          color: '#fff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', tracking: '1px', color: '#94a3b8', fontWeight: 600 }}>
              ORDER DETAILS
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0', color: '#fff' }}>
              {order.order_number}
            </h2>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              Placed on {formattedDate}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge status={currentStatus} />

            <div style={{ position: 'relative' }}>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating || readOnly}
                style={{
                  background: 'rgba(30, 41, 59, 0.9)',
                  color: '#fff',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: '#94a3b8',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Billing Details, Shipping Address & Shipping Specifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* 1. Billing Details */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
              <User size={16} />
              <strong style={{ fontSize: '14px' }}>Billing Details</strong>
            </div>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
              <div><strong>Name:</strong> {user.name || 'Guest User'}</div>
              <div><strong>Email:</strong> {user.email || 'N/A'}</div>
              {user.company_name && <div><strong>Company:</strong> {user.company_name}</div>}
              <div>
                <strong>Phone:</strong>{' '}
                {user.phone ||
                  user.phone_number ||
                  user.mobile ||
                  customerDetail.mobile ||
                  customerDetail.registered_phone ||
                  customerDetail.shipping_telephone ||
                  'N/A'}
              </div>
              <div style={{ marginTop: '4px' }}>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#94a3b8' }}>Billing Address:</strong>
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #38bdf8',
                    lineHeight: '1.5',
                    color: '#fff',
                  }}
                >
                  {billingLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                <MapPin size={16} />
                <strong style={{ fontSize: '14px' }}>Shipping Address</strong>
              </div>
              <button
                type="button"
                onClick={handlePrintAddress}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                title="Print Address / Shipping Label"
              >
                <Printer size={14} />
                Print Address
              </button>
            </div>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#cbd5e1' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', color: '#94a3b8' }}>Delivery Address:</strong>
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #10b981',
                    lineHeight: '1.5',
                    color: '#fff',
                  }}
                >
                  {addressLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Shipping Details & Freight Meta */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#38bdf8' }}>
              <Truck size={16} />
              <strong style={{ fontSize: '14px' }}>Shipping Details</strong>
            </div>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
              <div><strong>Method / Container:</strong> {order.shipping_method || '20 ft Dry (Standard)'}</div>
              <div><strong>Currency:</strong> GBP (£)</div>
              <div><strong>Destination Port:</strong> Liverpool Port, UK</div>
              <div><strong>Ex Works:</strong> No</div>

              <div
                style={{
                  marginTop: '6px',
                  padding: '8px 10px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>NAVSA Container Specs:</div>
                <div>Cubic Volume: 33.20 m³ / 1,172.44 ft³</div>
                <div>Gross Weight: 23,956 kg | Payload: 21,727 kg</div>
                {order.notes && (
                  <div style={{ marginTop: '4px', color: '#f8fafc', fontStyle: 'italic' }}>
                    Notes: {order.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: '#e2e8f0' }}>
            Ordered Items ({processedItems.length})
          </h4>
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '10px 14px' }}>Code</th>
                  <th style={{ padding: '10px 14px' }}>Product</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Cases</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Price/Case</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Net</th>
                  {isUK && <th style={{ padding: '10px 14px', textAlign: 'right' }}>VAT</th>}
                  {isUK && <th style={{ padding: '10px 14px', textAlign: 'right' }}>Line Total</th>}
                </tr>
              </thead>
              <tbody>
                {processedItems.map((item, idx) => {
                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 14px', color: '#38bdf8', fontWeight: 600 }}>
                        {item.navsa_product_code || '—'}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#fff' }}>
                        {item.product_name || item.product?.description || 'Product Item'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', color: '#cbd5e1', fontWeight: 600 }}>
                        {item.computedCases}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: '#cbd5e1' }}>
                        £{item.computedPrice.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: '#fff', fontWeight: 600 }}>
                        <div>£{item.computedSubtotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                          ({item.computedCases} × £{item.computedPrice.toFixed(2)})
                        </div>
                      </td>
                      {isUK && (
                        <td style={{ padding: '12px 14px', textAlign: 'right', color: '#fbbf24' }}>
                          <div>{item.computedVatRate.toFixed(3).replace(/\.?0+$/, '')}%</div>
                          <div style={{ fontSize: '11px' }}>£{item.computedVatAmount.toFixed(2)}</div>
                        </td>
                      )}
                      {isUK && (
                        <td style={{ padding: '12px 14px', textAlign: 'right', color: '#fff', fontWeight: 700 }}>
                          £{item.computedLineTotal.toFixed(2)}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Total Summary */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span>Subtotal:</span>
              <strong style={{ color: '#fff' }}>
                £{finalNetSubtotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            {isUK && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>VAT Total:</span>
                <strong style={{ color: '#f59e0b' }}>
                  £{vatAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 700,
                color: '#60a5fa',
                marginTop: '6px',
                paddingTop: '8px',
                borderTop: '1px dashed rgba(255,255,255,0.1)',
              }}
            >
              <span>Total Amount:</span>
              <span>
                £{grandTotalAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total_orders: 0,
    processing_orders: 0,
    completed_orders: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkError, setBulkError] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [rowUpdatingId, setRowUpdatingId] = useState(null);
  const [orderActionConfirm, setOrderActionConfirm] = useState({ open: false, order: null, action: null });
  const [orderActionLoading, setOrderActionLoading] = useState(false);

  const fetchOrdersData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders({
        page: currentPage,
        search,
        status: selectedStatus,
        show_deleted: showDeleted ? 1 : 0,
      });

      if (res.orders) {
        setOrders(res.orders.data || []);
        setTotalPages(res.orders.last_page || 1);
      } else {
        setOrders(Array.isArray(res) ? res : []);
        setTotalPages(1);
      }

      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, selectedStatus, showDeleted]);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  useEffect(() => {
    setSelectedOrderIds([]);
    setBulkAction('');
    setBulkError('');
  }, [currentPage, search, selectedStatus, showDeleted]);

  const handleStatusUpdateInList = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    fetchOrdersData();
  };

  const handleRowStatusChange = async (orderId, newStatus) => {
    setRowUpdatingId(orderId);
    setBulkError('');
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrdersData();
    } catch (error) {
      setBulkError(error.message || 'Unable to update order status.');
    } finally {
      setRowUpdatingId(null);
    }
  };

  const requestOrderAction = (order, action) => {
    setOrderActionConfirm({ open: true, order, action });
  };

  const confirmOrderAction = async () => {
    const { order, action } = orderActionConfirm;
    if (!order || !action) return;
    setOrderActionLoading(true);
    setBulkError('');
    try {
      if (action === 'delete') await softDeleteOrder(order.id);
      else if (action === 'restore') await restoreOrder(order.id);
      setOrderActionConfirm({ open: false, order: null, action: null });
      setSelectedOrderIds((prev) => prev.filter((id) => id !== order.id));
      await fetchOrdersData();
    } catch (error) {
      setBulkError(error.message || `Unable to ${action} order.`);
    } finally {
      setOrderActionLoading(false);
    }
  };

  const allVisibleSelected =
    orders.length > 0 && orders.every((order) => selectedOrderIds.includes(order.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedOrderIds([]);
      return;
    }
    setSelectedOrderIds(orders.map((order) => order.id));
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const bulkActionLabel = {
    pending: 'Mark as Pending',
    processing: 'Mark as Processing',
    completed: 'Mark as Completed',
    cancelled: 'Cancel Orders',
    delete: 'Delete Orders',
    restore: 'Restore Orders',
  }[bulkAction] || 'Update Orders';

  const requestBulkUpdate = () => {
    setBulkError('');
    if (selectedOrderIds.length === 0) {
      setBulkError('Select at least one order first.');
      return;
    }
    if (!bulkAction) {
      setBulkError('Choose a bulk action first.');
      return;
    }
    setBulkConfirmOpen(true);
  };

  const confirmBulkUpdate = async () => {
    if (!bulkAction || selectedOrderIds.length === 0) return;

    setBulkUpdating(true);
    setBulkError('');
    try {
      if (bulkAction === 'delete') await bulkSoftDeleteOrders(selectedOrderIds);
      else if (bulkAction === 'restore') await bulkRestoreOrders(selectedOrderIds);
      else await bulkUpdateOrderStatus(selectedOrderIds, bulkAction);
      setBulkConfirmOpen(false);
      setSelectedOrderIds([]);
      setBulkAction('');
      await fetchOrdersData();
    } catch (err) {
      setBulkError(err.message || 'Failed to update selected orders.');
      setBulkConfirmOpen(false);
    } finally {
      setBulkUpdating(false);
    }
  };

  const confirmVariant = bulkAction === 'delete'
    ? 'danger'
    : ['completed', 'restore'].includes(bulkAction)
      ? 'success'
      : 'warning';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Total Orders</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{stats.total_orders}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Processing</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{stats.processing_orders}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Completed</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{stats.completed_orders}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Completed Revenue</span>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              £{Number(stats.total_revenue || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Search + status filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '10px', padding: '8px 14px', width: '320px', maxWidth: '100%' }}>
            <Search size={18} style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search order #, customer, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'processing', 'pending', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setSelectedStatus(st);
                  setCurrentPage(1);
                }}
                style={{
                  background: selectedStatus === st ? '#3b82f6' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedStatus === st ? '#fff' : '#94a3b8',
                  border: `1px solid ${selectedStatus === st ? '#3b82f6' : 'rgba(148, 163, 184, 0.2)'}`,
                  padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
                }}
              >
                {st}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setShowDeleted((value) => !value); setSelectedOrderIds([]); setBulkAction(''); setCurrentPage(1); }}
              style={{ marginLeft: '8px', background: showDeleted ? 'rgba(16,185,129,0.14)' : 'rgba(51,65,85,0.6)', color: showDeleted ? '#34d399' : '#cbd5e1', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              {showDeleted ? '← Back to Active Orders' : `Show Deleted (${stats.deleted_orders || 0})`}
            </button>
          </div>
        </div>

        {/* Bulk action bar */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
            gap: '12px', marginBottom: '16px', padding: '12px 14px', borderRadius: '10px',
            background: selectedOrderIds.length > 0 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(15, 23, 42, 0.45)',
            border: selectedOrderIds.length > 0 ? '1px solid rgba(59, 130, 246, 0.28)' : '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >
          <div style={{ color: selectedOrderIds.length > 0 ? '#93c5fd' : '#64748b', fontSize: '13px', fontWeight: 700 }}>
            {selectedOrderIds.length > 0 ? `${selectedOrderIds.length} order(s) selected` : 'Select orders to use bulk actions'}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              disabled={selectedOrderIds.length === 0 || bulkUpdating}
              style={{
                minWidth: '190px', background: '#0f1d31', color: '#e2e8f0', border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: '8px', padding: '8px 10px', fontSize: '13px', outline: 'none',
                opacity: selectedOrderIds.length === 0 ? 0.55 : 1,
              }}
            >
              <option value="">Bulk actions…</option>
              {showDeleted ? (
                <option value="restore">Restore Selected</option>
              ) : (
                <>
                  <option value="pending">Mark as Pending</option>
                  <option value="processing">Mark as Processing</option>
                  <option value="completed">Mark as Completed</option>
                  <option value="cancelled">Cancel Orders</option>
                  <option value="delete">Delete Selected</option>
                </>
              )}
            </select>
            <button
              type="button"
              onClick={requestBulkUpdate}
              disabled={selectedOrderIds.length === 0 || !bulkAction || bulkUpdating}
              style={{
                background: selectedOrderIds.length > 0 && bulkAction ? '#2563eb' : 'rgba(51,65,85,0.7)', color: '#fff',
                border: '1px solid rgba(96,165,250,0.28)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px',
                fontWeight: 700, cursor: selectedOrderIds.length > 0 && bulkAction ? 'pointer' : 'not-allowed',
              }}
            >
              Apply
            </button>
            {selectedOrderIds.length > 0 && (
              <button
                type="button"
                onClick={() => { setSelectedOrderIds([]); setBulkAction(''); setBulkError(''); }}
                style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {bulkError && (
          <div role="alert" style={{ marginBottom: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(127,29,29,0.18)', border: '1px solid rgba(248,113,113,0.35)', color: '#fecaca', fontSize: '13px' }}>
            {bulkError}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.7)', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '12px 12px', width: '44px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    aria-label="Select all orders on this page"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAllVisible}
                    disabled={orders.length === 0 || loading}
                    style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 16px' }}>Order #</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Items</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No orders found.</td></tr>
              ) : (
                orders.map((order) => {
                  const customerName = order.user?.name || order.user?.company_name || 'Guest User';
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'N/A';

                  const computedOrderTotal = (order.items || []).reduce((sum, item) => {
                    const price = parseFloat(item.unit_price || 0);
                    let cases = parseInt(item.case_quantity || item.quantity || 0);
                    let sub = parseFloat(item.subtotal || 0);
                    if ((!cases || cases <= 1) && sub > price && price > 0) cases = Math.round(sub / price);
                    else if (!cases || cases <= 0) cases = 1;
                    if (!sub || sub <= 0) sub = price * cases;
                    return sum + sub;
                  }, 0);

                  const finalRowTotal = parseFloat(order.grand_total || order.total_amount || 0) > 0
                    ? parseFloat(order.grand_total || order.total_amount)
                    : computedOrderTotal;
                  const isChecked = selectedOrderIds.includes(order.id);

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s',
                        background: isChecked ? 'rgba(59,130,246,0.08)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          aria-label={`Select order ${order.order_number}`}
                          checked={isChecked}
                          onChange={() => toggleOrderSelection(order.id)}
                          style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#38bdf8' }}>{order.order_number}</td>
                      <td style={{ padding: '14px 16px', color: '#f8fafc' }}>
                        <div style={{ fontWeight: 600 }}>{customerName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{order.user?.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{dateStr}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#cbd5e1' }}>{order.total_items || (order.items ? order.items.length : 0)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                        £{finalRowTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {showDeleted ? (
                          <StatusBadge status={order.status} />
                        ) : (
                          <select
                            value={order.status || 'processing'}
                            onChange={(e) => handleRowStatusChange(order.id, e.target.value)}
                            disabled={rowUpdatingId === order.id}
                            style={{ background: '#0f2238', color: '#fff', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '7px' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Eye size={15} /> View
                          </button>
                          {showDeleted ? (
                            <button onClick={() => requestOrderAction(order, 'restore')} title="Restore order" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.28)', padding: '6px 9px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button onClick={() => requestOrderAction(order, 'delete')} title="Delete order" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.28)', padding: '6px 9px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', color: currentPage <= 1 ? '#475569' : '#fff', padding: '6px 12px', borderRadius: '6px', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.2)', color: currentPage >= totalPages ? '#475569' : '#fff', padding: '6px 12px', borderRadius: '6px', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} readOnly={showDeleted} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdateInList} />
      )}

      <ConfirmModal
        open={bulkConfirmOpen}
        title={bulkActionLabel}
        eyebrow="BULK ORDER UPDATE"
        variant={confirmVariant}
        icon={bulkAction === 'restore' ? '↻' : bulkAction === 'delete' || bulkAction === 'cancelled' ? '!' : '✓'}
        loading={bulkUpdating}
        confirmText={bulkActionLabel}
        message={`Apply “${bulkActionLabel}” to ${selectedOrderIds.length} selected order(s)?`}
        description={bulkAction === 'delete' ? 'Deleted orders stay recoverable in Show Deleted. No order is permanently destroyed.' : bulkAction === 'restore' ? 'The selected orders will return to the active Orders list.' : 'This updates the selected order statuses.'}
        onClose={() => !bulkUpdating && setBulkConfirmOpen(false)}
        onConfirm={confirmBulkUpdate}
      />

      <ConfirmModal
        open={orderActionConfirm.open}
        title={orderActionConfirm.action === 'restore' ? 'Restore Order' : 'Delete Order'}
        eyebrow="ORDER MANAGEMENT"
        variant={orderActionConfirm.action === 'restore' ? 'success' : 'danger'}
        icon={orderActionConfirm.action === 'restore' ? '↻' : '!'}
        loading={orderActionLoading}
        confirmText={orderActionConfirm.action === 'restore' ? 'Restore Order' : 'Delete Order'}
        message={orderActionConfirm.order ? `${orderActionConfirm.action === 'restore' ? 'Restore' : 'Delete'} ${orderActionConfirm.order.order_number}?` : ''}
        description={orderActionConfirm.action === 'restore' ? 'This order will return to the active Orders list.' : 'The order will be moved to Show Deleted and remains recoverable.'}
        onClose={() => !orderActionLoading && setOrderActionConfirm({ open: false, order: null, action: null })}
        onConfirm={confirmOrderAction}
      />
    </div>
  );
}