import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Pencil, Save, X } from 'lucide-react'
import { deleteUser, getUsers, updateUser } from '../../services/adminApi'
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

const whatsappOptInText = (detail) => {
  if (toBoolean(detail?.whatsapp_offers_opt_in)) return 'Yes'
  if (detail?.whatsapp_offers_phone) return 'Yes (legacy WhatsApp number saved)'
  return 'No'
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'16px' }}>
      <span style={{ color:'#94a3b8', fontSize:'12px', fontWeight:600, flexShrink:0 }}>{label}</span>
      <span style={{ color:'#fff', fontSize:'13px', textAlign:'right', wordBreak:'break-word' }}>{displayValue(value)}</span>
    </div>
  )
}

function DetailSection({ title, children, fullWidth = false }) {
  return (
    <section style={{
      gridColumn: fullWidth ? '1 / -1' : undefined,
      background:'rgba(255,255,255,0.035)',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:'12px',
      padding:'16px',
    }}>
      <h3 style={{ color:'#fff', fontSize:'14px', margin:'0 0 14px' }}>{title}</h3>
      <div style={{ display:'grid', gap:'10px' }}>{children}</div>
    </section>
  )
}

function UserDetailModal({ user, onClose, onEdit }) {
  const detail = user.customer_detail
  const supplier = user.supplier_detail

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, padding:'20px' }}>
      <div onClick={event => event.stopPropagation()} style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'900px', maxHeight:'90vh', overflowY:'auto', padding:'28px', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }} aria-label="Close customer details"><X size={20}/></button>

        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {(user.name || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:'18px' }}>{user.name}</div>
            <div style={{ color:'#94a3b8', fontSize:'13px' }}>{user.email}</div>
            <span style={{ marginTop:'6px', display:'inline-block', background: user.status==='approved' ? 'rgba(16,185,129,0.15)' : user.status==='frozen' ? 'rgba(56,189,248,0.15)' : 'rgba(239,68,68,0.15)', color: user.status==='approved' ? '#10b981' : user.status==='frozen' ? '#38bdf8' : '#ef4444', fontSize:'11px', fontWeight:700, padding:'2px 10px', borderRadius:'10px', letterSpacing:'0.4px', textTransform:'uppercase' }}>{user.status || 'unknown'}</span>
          </div>
          {detail && (
            <button
              type="button"
              onClick={() => onEdit(user)}
              className="admin-btn admin-btn-primary"
              style={{ display:'flex', alignItems:'center', gap:'7px', marginRight:'28px' }}
            >
              <Pencil size={15}/> Edit Details
            </button>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'16px' }}>
          <DetailSection title="Account Details">
            <DetailRow label="Full Name" value={user.name} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Role" value={user.role || 'customer'} />
            <DetailRow label="Company" value={user.company_name} />
            <DetailRow label="Primary Phone" value={user.phone} />
            <DetailRow label="Status" value={user.status} />
            <DetailRow label="Registered" value={user.created_at ? new Date(user.created_at).toLocaleString() : '—'} />
            <DetailRow label="Last Updated" value={user.updated_at ? new Date(user.updated_at).toLocaleString() : '—'} />
          </DetailSection>

          {detail && (
            <>
              <DetailSection title="Business Details">
                <DetailRow label="Position" value={detail.position} />
                <DetailRow label="Nature" value={detail.business_nature} />
                <DetailRow label="Trading Years" value={detail.trading_years} />
                <DetailRow label="Turnover" value={detail.turnover} />
                <DetailRow label="Director" value={detail.director_name} />
                <DetailRow label="Company Registration No." value={detail.company_registration_number} />
                <DetailRow label="VAT Number" value={detail.vat_number} />
                <DetailRow label="Customer Group" value={detail.customer_group} />
                <DetailRow label="Website" value={detail.website} />
              </DetailSection>

              <DetailSection title="Contact Numbers">
                <DetailRow label="Registered Company Phone" value={detail.registered_phone} />
                <DetailRow label="Mobile Number" value={detail.mobile} />
                <DetailRow label="WhatsApp Offers Opt-in" value={whatsappOptInText(detail)} />
              </DetailSection>

              <DetailSection title="Billing Address">
                <DetailRow label="Address Line 1" value={detail.address_line_1} />
                <DetailRow label="Address Line 2" value={detail.address_line_2} />
                <DetailRow label="City/Town" value={detail.city} />
                <DetailRow label="State/Province" value={detail.province} />
                <DetailRow label="Country" value={detail.country} />
                <DetailRow label="Post/Zip Code" value={detail.zip_code} />
              </DetailSection>

              <DetailSection title="Shipping Details">
                {detail.same_as_billing ? (
                  <DetailRow label="Shipping Address" value="Same as billing address" />
                ) : (
                  <>
                    <DetailRow label="Address Line 1" value={detail.shipping_address_line_1} />
                    <DetailRow label="Address Line 2" value={detail.shipping_address_line_2} />
                    <DetailRow label="City/Town" value={detail.shipping_city} />
                    <DetailRow label="State/Province" value={detail.shipping_province} />
                    <DetailRow label="Country" value={detail.shipping_country} />
                    <DetailRow label="Post/Zip Code" value={detail.shipping_zip_code} />
                    <DetailRow label="Telephone" value={detail.shipping_telephone} />
                  </>
                )}
              </DetailSection>

              <DetailSection title="Accounts Information">
                <DetailRow label="Accounts Name" value={detail.account_name} />
                <DetailRow label="Accounts Email" value={detail.account_email} />
                <DetailRow label="Other Wholesalers" value={detail.other_wholesalers} />
                <DetailRow label="Average Order Value" value={detail.average_order_value} />
              </DetailSection>

              <DetailSection title="Preferences" fullWidth>
                <DetailRow label="Region" value={detail.region} />
                <DetailRow label="Currency" value={detail.currency} />
                <DetailRow label="Import Preference" value={detail.import_full_containers} />
                <DetailRow label="Brands" value={detail.brands_interested} />
                <DetailRow label="Categories" value={displayList(detail.categories_interested)} />
                <DetailRow label="EORI Number" value={detail.eori_number} />
              </DetailSection>
            </>
          )}

          {supplier && (
            <>
              <DetailSection title="Supplier Details">
                <DetailRow label="Company Type" value={supplier.company_type} />
                <DetailRow label="Registration No." value={supplier.company_registration_number} />
                <DetailRow label="Website" value={supplier.website_url} />
                <DetailRow label="Business Phone" value={supplier.business_phone} />
              </DetailSection>
              <DetailSection title="Supplier Preferences">
                <DetailRow label="Categories Supplied" value={displayList(supplier.categories_supplied)} />
                <DetailRow label="Preferred Times" value={displayList(supplier.contact_time)} />
                <DetailRow label="News & Updates" value={supplier.consent_news ? 'Yes' : 'No'} />
                <DetailRow label="Marketing Mailers" value={supplier.consent_marketing ? 'Yes' : 'No'} />
              </DetailSection>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const sectionStyle = {
  background:'rgba(255,255,255,0.035)',
  border:'1px solid rgba(255,255,255,0.08)',
  borderRadius:'12px',
  padding:'18px',
}

const gridStyle = {
  display:'grid',
  gridTemplateColumns:'repeat(auto-fit, minmax(230px, 1fr))',
  gap:'14px',
}

const inputStyle = {
  width:'100%',
  boxSizing:'border-box',
  padding:'10px 12px',
}

function EditField({ label, required = false, children }) {
  return (
    <label style={{ display:'grid', gap:'6px', color:'#cbd5e1', fontSize:'12px', fontWeight:600 }}>
      <span>{label}{required ? ' *' : ''}</span>
      {children}
    </label>
  )
}

function PreservedOption({ value, options }) {
  if (!value || options.includes(value)) return null
  return <option value={value}>{value} (existing value)</option>
}

function CustomerEditPage({ user, onCancel, onSaved }) {
  const detail = user.customer_detail || {}
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const initialCategories = useMemo(() => {
    if (Array.isArray(detail.categories_interested)) return detail.categories_interested.join(', ')
    if (typeof detail.categories_interested === 'string') {
      try {
        const parsed = JSON.parse(detail.categories_interested)
        if (Array.isArray(parsed)) return parsed.join(', ')
      } catch {
        return detail.categories_interested
      }
    }
    return ''
  }, [detail.categories_interested])

  const [form, setForm] = useState({
    email: user.email || '',
    company_name: user.company_name || '',
    status: user.status || 'approved',
    first_name: detail.first_name || '',
    last_name: detail.last_name || '',
    region: detail.region || '',
    country: detail.country || '',
    position: detail.position || '',
    company_registration_number: detail.company_registration_number || '',
    vat_number: detail.vat_number || '',
    customer_group: detail.customer_group || '',
    trading_years: detail.trading_years || '',
    business_nature: detail.business_nature || '',
    website: detail.website || '',
    director_name: detail.director_name || '',
    currency: detail.currency || '',
    registered_phone: detail.registered_phone || '',
    mobile: detail.mobile || '',
    whatsapp_offers_opt_in: toBoolean(detail.whatsapp_offers_opt_in) || Boolean(detail.whatsapp_offers_phone),
    address_line_1: detail.address_line_1 || '',
    address_line_2: detail.address_line_2 || '',
    city: detail.city || '',
    province: detail.province || '',
    zip_code: detail.zip_code || '',
    same_as_billing: detail.same_as_billing === undefined ? true : toBoolean(detail.same_as_billing),
    shipping_address_line_1: detail.shipping_address_line_1 || '',
    shipping_address_line_2: detail.shipping_address_line_2 || '',
    shipping_city: detail.shipping_city || '',
    shipping_province: detail.shipping_province || '',
    shipping_zip_code: detail.shipping_zip_code || '',
    shipping_country: detail.shipping_country || '',
    shipping_telephone: detail.shipping_telephone || '',
    account_name: detail.account_name || '',
    account_email: detail.account_email || '',
    other_wholesalers: detail.other_wholesalers || '',
    average_order_value: detail.average_order_value || '',
    turnover: detail.turnover || '',
    import_full_containers: detail.import_full_containers || '',
    brands_interested: detail.brands_interested || '',
    categories_text: initialCategories,
    eori_number: detail.eori_number || '',
  })

  const isUkCustomer = form.region === 'UK' || form.country.trim().toLowerCase() === 'united kingdom'

  const setValue = (event) => {
    const { name, value, type, checked } = event.target
    setError('')
    setForm(previous => {
      const next = { ...previous, [name]: type === 'checkbox' ? checked : value }
      if ((name === 'region' || name === 'country') && !(next.region === 'UK' || next.country.trim().toLowerCase() === 'united kingdom')) {
        next.vat_number = ''
      }
      if (name === 'same_as_billing' && checked) {
        next.shipping_address_line_1 = ''
        next.shipping_address_line_2 = ''
        next.shipping_city = ''
        next.shipping_province = ''
        next.shipping_zip_code = ''
        next.shipping_country = ''
        next.shipping_telephone = ''
      }
      return next
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.whatsapp_offers_opt_in && !form.mobile.trim()) {
      setError('Mobile Number is required when WhatsApp offers are selected.')
      return
    }

    if (isUkCustomer && !form.vat_number.trim()) {
      setError('VAT Number is required for UK customers.')
      return
    }

    if (!form.same_as_billing && (!form.shipping_country.trim() || !form.shipping_telephone.trim())) {
      setError('Shipping Country and Shipping Telephone are required when shipping differs from billing.')
      return
    }

    const categories = form.categories_text
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    setSaving(true)
    try {
      await updateUser(user.id, {
        email: form.email.trim(),
        company_name: form.company_name.trim(),
        status: form.status,
        customer_detail: {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          region: form.region,
          country: form.country.trim(),
          position: form.position.trim(),
          company_registration_number: form.company_registration_number.trim(),
          vat_number: isUkCustomer ? form.vat_number.trim() : '',
          customer_group: form.customer_group || null,
          trading_years: form.trading_years,
          business_nature: form.business_nature,
          website: form.website.trim(),
          director_name: form.director_name.trim(),
          currency: form.currency,
          registered_phone: form.registered_phone.trim(),
          mobile: form.mobile.trim(),
          whatsapp_offers_opt_in: Boolean(form.whatsapp_offers_opt_in),
          address_line_1: form.address_line_1.trim(),
          address_line_2: form.address_line_2.trim(),
          city: form.city.trim(),
          province: form.province.trim(),
          zip_code: form.zip_code.trim(),
          same_as_billing: Boolean(form.same_as_billing),
          shipping_address_line_1: form.same_as_billing ? '' : form.shipping_address_line_1.trim(),
          shipping_address_line_2: form.same_as_billing ? '' : form.shipping_address_line_2.trim(),
          shipping_city: form.same_as_billing ? '' : form.shipping_city.trim(),
          shipping_province: form.same_as_billing ? '' : form.shipping_province.trim(),
          shipping_zip_code: form.same_as_billing ? '' : form.shipping_zip_code.trim(),
          shipping_country: form.same_as_billing ? '' : form.shipping_country.trim(),
          shipping_telephone: form.same_as_billing ? '' : form.shipping_telephone.trim(),
          account_name: form.account_name.trim(),
          account_email: form.account_email.trim(),
          other_wholesalers: form.other_wholesalers || null,
          average_order_value: form.average_order_value,
          turnover: form.turnover,
          import_full_containers: form.import_full_containers,
          brands_interested: form.brands_interested.trim(),
          categories_interested: categories,
          eori_number: form.eori_number.trim(),
        },
      })
      await onSaved()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const tradingOptions = ['0-1', '1-2', '2-5', '5+']
  const businessOptions = ['Multiples', 'Discount', 'Pharmacy', 'Retail', 'Traders', 'Wholesale', 'Online', 'Amazon']
  const averageOptions = ['£5,000 - £10,000 (UK & Europe only)', '£10,000 - £20,000', '£20,000 - £40,000', '£40,000+']
  const turnoverOptions = ['0 - 500,000', '500,000 - 1,000,000', '1,000,000 - 5,000,000', '5,000,000- 10,000,000', '20,000,000 +']

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
        <button type="button" onClick={onCancel} className="admin-btn admin-btn-ghost" style={{ display:'flex', alignItems:'center', gap:'7px', border:'1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={16}/> Back to Customers
        </button>
        <div>
          <h2 style={{ margin:0 }}>Edit Customer Details</h2>
          <p style={{ margin:'4px 0 0', color:'#94a3b8', fontSize:'13px' }}>{user.name} · {user.email}</p>
        </div>
      </div>

      {error && <div style={{ marginBottom:'16px', padding:'12px 14px', borderRadius:'8px', background:'rgba(239,68,68,0.12)', color:'#ef4444' }}>{error}</div>}

      <form onSubmit={submit} style={{ display:'grid', gap:'16px' }}>
        <section style={sectionStyle}>
          <h3 style={{ margin:'0 0 14px' }}>Account & Company</h3>
          <div style={gridStyle}>
            <EditField label="First Name" required><input className="admin-input-field" style={inputStyle} name="first_name" value={form.first_name} onChange={setValue} required /></EditField>
            <EditField label="Last Name" required><input className="admin-input-field" style={inputStyle} name="last_name" value={form.last_name} onChange={setValue} required /></EditField>
            <EditField label="Email" required><input type="email" className="admin-input-field" style={inputStyle} name="email" value={form.email} onChange={setValue} required /></EditField>
            <EditField label="Registered Company Name" required><input className="admin-input-field" style={inputStyle} name="company_name" value={form.company_name} onChange={setValue} required /></EditField>
            <EditField label="Status" required>
              <select className="admin-input-field" style={inputStyle} name="status" value={form.status} onChange={setValue} required>
                <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="frozen">Frozen</option>
              </select>
            </EditField>
            <EditField label="Customer Group (Admin Only)">
              <select className="admin-input-field" style={inputStyle} name="customer_group" value={form.customer_group} onChange={setValue}>
                <option value="">Not assigned</option>
                <option value="Group 1">Group 1</option>
                <option value="Group 2">Group 2</option>
              </select>
            </EditField>
          </div>
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin:'0 0 14px' }}>Business Details</h3>
          <div style={gridStyle}>
            <EditField label="Region" required><select className="admin-input-field" style={inputStyle} name="region" value={form.region} onChange={setValue} required><option value="">Select</option><option value="UK">UK</option><option value="Europe">Europe</option><option value="International">International</option></select></EditField>
            <EditField label="Country" required><input className="admin-input-field" style={inputStyle} name="country" value={form.country} onChange={setValue} required /></EditField>
            <EditField label="Position"><input className="admin-input-field" style={inputStyle} name="position" value={form.position} onChange={setValue} /></EditField>
            <EditField label="Company Registration Number"><input className="admin-input-field" style={inputStyle} name="company_registration_number" value={form.company_registration_number} onChange={setValue} /></EditField>
            {isUkCustomer && <EditField label="VAT Number" required><input className="admin-input-field" style={inputStyle} name="vat_number" value={form.vat_number} onChange={setValue} required /></EditField>}
            <EditField label="Trading Years" required><select className="admin-input-field" style={inputStyle} name="trading_years" value={form.trading_years} onChange={setValue} required><option value="">Select</option><PreservedOption value={form.trading_years} options={tradingOptions}/>{tradingOptions.map(value => <option key={value} value={value}>{value}</option>)}</select></EditField>
            <EditField label="Nature of Business" required><select className="admin-input-field" style={inputStyle} name="business_nature" value={form.business_nature} onChange={setValue} required><option value="">Select</option><PreservedOption value={form.business_nature} options={businessOptions}/>{businessOptions.map(value => <option key={value} value={value}>{value}</option>)}</select></EditField>
            <EditField label="Website"><input className="admin-input-field" style={inputStyle} placeholder="https://" name="website" value={form.website} onChange={setValue} /></EditField>
            <EditField label="Director Name" required><input className="admin-input-field" style={inputStyle} name="director_name" value={form.director_name} onChange={setValue} required /></EditField>
            <EditField label="Currency" required><select className="admin-input-field" style={inputStyle} name="currency" value={form.currency} onChange={setValue} required><option value="">Select</option><option value="GBP">GBP £</option><option value="EURO">EURO €</option><option value="DOLLAR">DOLLAR $</option></select></EditField>
          </div>
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin:'0 0 14px' }}>Contact Numbers</h3>
          <div style={gridStyle}>
            <EditField label="Registered Company Phone" required><input className="admin-input-field" style={inputStyle} name="registered_phone" value={form.registered_phone} onChange={setValue} required /></EditField>
            <EditField label="Mobile Number" required={form.whatsapp_offers_opt_in}><input className="admin-input-field" style={inputStyle} name="mobile" value={form.mobile} onChange={setValue} required={form.whatsapp_offers_opt_in} /></EditField>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:'9px', marginTop:'14px', color:'#cbd5e1', fontSize:'13px', cursor:'pointer' }}>
            <input type="checkbox" name="whatsapp_offers_opt_in" checked={form.whatsapp_offers_opt_in} onChange={setValue} />
            Customer would like to receive offers via WhatsApp.
          </label>
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin:'0 0 14px' }}>Billing Address</h3>
          <div style={gridStyle}>
            <EditField label="Address Line 1" required><input className="admin-input-field" style={inputStyle} name="address_line_1" value={form.address_line_1} onChange={setValue} required /></EditField>
            <EditField label="Address Line 2"><input className="admin-input-field" style={inputStyle} name="address_line_2" value={form.address_line_2} onChange={setValue} /></EditField>
            <EditField label="City/Town" required><input className="admin-input-field" style={inputStyle} name="city" value={form.city} onChange={setValue} required /></EditField>
            <EditField label="State/Province" required><input className="admin-input-field" style={inputStyle} name="province" value={form.province} onChange={setValue} required /></EditField>
            <EditField label="Post/Zip Code" required><input className="admin-input-field" style={inputStyle} name="zip_code" value={form.zip_code} onChange={setValue} required /></EditField>
          </div>
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin:'0 0 14px' }}>Shipping Address</h3>
          <label style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'14px', color:'#cbd5e1', fontSize:'13px', cursor:'pointer' }}><input type="checkbox" name="same_as_billing" checked={form.same_as_billing} onChange={setValue}/> Shipping address is the same as billing address</label>
          {!form.same_as_billing && <div style={gridStyle}>
            <EditField label="Address Line 1" required><input className="admin-input-field" style={inputStyle} name="shipping_address_line_1" value={form.shipping_address_line_1} onChange={setValue} required /></EditField>
            <EditField label="Address Line 2"><input className="admin-input-field" style={inputStyle} name="shipping_address_line_2" value={form.shipping_address_line_2} onChange={setValue} /></EditField>
            <EditField label="City/Town" required><input className="admin-input-field" style={inputStyle} name="shipping_city" value={form.shipping_city} onChange={setValue} required /></EditField>
            <EditField label="State/Province" required><input className="admin-input-field" style={inputStyle} name="shipping_province" value={form.shipping_province} onChange={setValue} required /></EditField>
            <EditField label="Post/Zip Code" required><input className="admin-input-field" style={inputStyle} name="shipping_zip_code" value={form.shipping_zip_code} onChange={setValue} required /></EditField>
            <EditField label="Country" required><input className="admin-input-field" style={inputStyle} name="shipping_country" value={form.shipping_country} onChange={setValue} required /></EditField>
            <EditField label="Telephone" required><input className="admin-input-field" style={inputStyle} name="shipping_telephone" value={form.shipping_telephone} onChange={setValue} required /></EditField>
          </div>}
        </section>

        <section style={sectionStyle}>
          <h3 style={{ margin:'0 0 14px' }}>Accounts & Preferences</h3>
          <div style={gridStyle}>
            <EditField label="Accounts Name" required><input className="admin-input-field" style={inputStyle} name="account_name" value={form.account_name} onChange={setValue} required /></EditField>
            <EditField label="Accounts Email" required><input type="email" className="admin-input-field" style={inputStyle} name="account_email" value={form.account_email} onChange={setValue} required /></EditField>
            <EditField label="Other Wholesalers"><select className="admin-input-field" style={inputStyle} name="other_wholesalers" value={form.other_wholesalers} onChange={setValue}><option value="">Not specified</option><option value="Yes">Yes</option><option value="No">No</option></select></EditField>
            <EditField label="Average Order Value" required><select className="admin-input-field" style={inputStyle} name="average_order_value" value={form.average_order_value} onChange={setValue} required><option value="">Select</option><PreservedOption value={form.average_order_value} options={averageOptions}/>{averageOptions.map(value => <option key={value} value={value}>{value}</option>)}</select></EditField>
            <EditField label="Company Turnover" required><select className="admin-input-field" style={inputStyle} name="turnover" value={form.turnover} onChange={setValue} required><option value="">Select</option><PreservedOption value={form.turnover} options={turnoverOptions}/>{turnoverOptions.map(value => <option key={value} value={value}>{value}</option>)}</select></EditField>
            <EditField label="Import Preference" required><select className="admin-input-field" style={inputStyle} name="import_full_containers" value={form.import_full_containers} onChange={setValue} required><option value="">Select</option><option value="Containers">Containers</option><option value="Pallets">Pallets</option><option value="Cases">Cases</option></select></EditField>
            <EditField label="Brands Interested In" required><input className="admin-input-field" style={inputStyle} placeholder="Comma-separated" name="brands_interested" value={form.brands_interested} onChange={setValue} required /></EditField>
            <EditField label="EORI Number"><input className="admin-input-field" style={inputStyle} name="eori_number" value={form.eori_number} onChange={setValue} /></EditField>
          </div>
          <div style={{ marginTop:'14px' }}><EditField label="Categories Interested In (comma-separated)"><textarea className="admin-input-field" style={{ ...inputStyle, minHeight:'90px', resize:'vertical' }} name="categories_text" value={form.categories_text} onChange={setValue} /></EditField></div>
        </section>

        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', position:'sticky', bottom:0, padding:'14px', background:'rgba(15,23,42,0.96)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px' }}>
          <button type="button" onClick={onCancel} disabled={saving} className="admin-btn admin-btn-ghost" style={{ border:'1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ display:'flex', alignItems:'center', gap:'7px' }}><Save size={16}/>{saving ? 'Saving…' : 'Save Customer Details'}</button>
        </div>
      </form>
    </div>
  )
}

function Badge({ status }) {
  const badgeClass = status === 'approved' ? 'admin-badge-success' : status === 'rejected' ? 'admin-badge-danger' : status === 'frozen' ? 'admin-badge-info' : 'admin-badge-warning'
  return <span className={`admin-badge ${badgeClass}`}>{status}</span>
}

function UserRow({ user, onView, onEdit, onRequestAction, busy }) {
  const btn = (label, action, type, title) => (
    <button onClick={action} disabled={busy} title={title || label} className="admin-btn admin-btn-ghost"
      style={{ padding:'4px 8px', fontSize:'11px', color:type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'info' ? '#38bdf8' : '#3b82f6', border:'1px solid rgba(255,255,255,0.1)', display:'inline-flex', alignItems:'center', gap:'4px' }}>
      {label}
    </button>
  )

  return (
    <tr onClick={onView} style={{ cursor:'pointer' }}>
      <td>
        <div style={{ color:'#fff', fontWeight:600, fontSize:'14px' }}>{user.name}</div>
        <div style={{ color:'#94a3b8', fontSize:'12px' }}>{user.email}</div>
      </td>
      <td>{user.company_name || '—'}</td>
      <td>{user.phone || '—'}</td>
      <td><Badge status={user.status || 'approved'} /></td>
      <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
      <td onClick={event => event.stopPropagation()}>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {user.customer_detail && btn(<Pencil size={14}/>, event => { event.stopPropagation(); onEdit(user) }, 'primary', 'Edit customer details')}
          {user.status !== 'approved' && btn('✓ Approve', event => { event.stopPropagation(); onRequestAction(user, 'approve') }, 'success')}
          {user.status !== 'rejected' && btn('✗ Reject', event => { event.stopPropagation(); onRequestAction(user, 'reject') }, 'danger')}
          {user.status === 'approved' && btn('❄️ Freeze', event => { event.stopPropagation(); onRequestAction(user, 'freeze') }, 'info')}
          {btn('🗑 Delete', event => { event.stopPropagation(); onRequestAction(user, 'delete') }, 'danger')}
        </div>
      </td>
    </tr>
  )
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({})
  const [filter, setFilter] = useState('all')
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
      const params = { page, type: 'customer' }
      if (filter !== 'all') params.status = filter
      if (search) params.search = search
      const res = await getUsers(params)
      const customers = (res.data || []).filter(user => (
        user.role !== 'admin'
        && (
          (user.customer_detail && !user.supplier_detail)
          || (user.role === 'customer' && !user.supplier_detail)
        )
      ))
      setUsers(customers)
      setMeta({ current_page:res.current_page, last_page:res.last_page, total:res.total })
    } catch (error) {
      setNotice({
        open: true,
        title: 'Unable to Load Customers',
        message: error.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [filter, search, page])

  useEffect(() => { load() }, [load])

  const requestUserAction = (user, action) => {
    setConfirmAction({ open:true, user, action })
  }

  const closeActionConfirmation = () => {
    if (actionProcessing) return
    setConfirmAction({ open:false, user:null, action:null })
  }

  const processUserAction = async () => {
    const { user, action } = confirmAction
    if (!user || !action) return

    const statusByAction = {
      approve: 'approved',
      reject: 'rejected',
      freeze: 'frozen',
    }

    const successMessageByAction = {
      approve: `Customer "${user.name}" was approved successfully.`,
      reject: `Customer "${user.name}" was rejected successfully.`,
      freeze: `Customer "${user.name}" was frozen successfully.`,
      delete: `Customer "${user.name}" was permanently deleted.`,
    }

    setActionProcessing(true)
    try {
      if (action === 'delete') {
        await deleteUser(user.id)
      } else {
        await updateUser(user.id, { status: statusByAction[action] })
      }

      setConfirmAction({ open:false, user:null, action:null })
      await load()
      setSelected(null)
      setNotice({
        open: true,
        title: action === 'delete' ? 'Customer Deleted' : 'Customer Updated',
        message: successMessageByAction[action],
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

  const openEdit = (user) => {
    setSelected(null)
    setEditing(user)
  }

  const finishEdit = async () => {
    await load()
    setEditing(null)
  }

  if (editing) {
    return <CustomerEditPage user={editing} onCancel={() => setEditing(null)} onSaved={finishEdit} />
  }

  const actionModalContent = {
    approve: {
      title: 'Approve Customer?',
      message: `Are you sure you want to approve "${confirmAction.user?.name || 'this customer'}"?`,
      description: 'The customer will be able to use the approved account.',
      confirmText: 'Approve Customer',
      eyebrow: 'CUSTOMER APPROVAL',
      icon: '✓',
      variant: 'success',
    },
    reject: {
      title: 'Reject Customer?',
      message: `Are you sure you want to reject "${confirmAction.user?.name || 'this customer'}"?`,
      description: 'The customer account will be marked as rejected.',
      confirmText: 'Reject Customer',
      eyebrow: 'CUSTOMER REJECTION',
      icon: '!',
      variant: 'danger',
    },
    freeze: {
      title: 'Freeze Customer?',
      message: `Are you sure you want to freeze "${confirmAction.user?.name || 'this customer'}"?`,
      description: 'The customer will not be able to log in while the account is frozen.',
      confirmText: 'Freeze Customer',
      eyebrow: 'ACCOUNT FREEZE',
      icon: '❄',
      variant: 'warning',
    },
    delete: {
      title: 'Delete Customer Permanently?',
      message: `Are you sure you want to permanently delete "${confirmAction.user?.name || 'this customer'}"?`,
      description: 'This action cannot be undone.',
      confirmText: 'Delete Permanently',
      eyebrow: 'PERMANENT DELETION',
      icon: '!',
      variant: 'danger',
    },
  }

  const currentActionModal = actionModalContent[confirmAction.action] || actionModalContent.reject

  const pill = (label, value) => (
    <button onClick={() => { setFilter(value); setPage(1) }} className="admin-btn admin-btn-ghost" style={{
      background:filter === value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      color:filter === value ? '#3b82f6' : '#94a3b8',
      border:`1px solid ${filter === value ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
    }}>{label}</button>
  )

  return (
    <div>
      {selected && <UserDetailModal user={selected} onClose={() => setSelected(null)} onEdit={openEdit} />}
      <h2 style={{ marginBottom:'20px' }}>👥 User Management</h2>

      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px', alignItems:'center' }}>
        {pill('All', 'all')}
        {pill('✓ Approved', 'approved')}
        {pill('❄️ Frozen', 'frozen')}
        {pill('✗ Rejected', 'rejected')}
        <input
          value={search}
          onChange={event => { setSearch(event.target.value); setPage(1) }}
          placeholder="Search name, email, company…"
          className="admin-input-field"
          style={{ marginLeft:'auto', width:'240px' }}
        />
      </div>

      <div className="glass-panel" style={{ overflowX:'auto', padding:'1.5rem' }}>
        {loading ? (
          <div style={{ color:'#94a3b8', padding:'40px', textAlign:'center' }}>Loading users…</div>
        ) : users.length === 0 ? (
          <div style={{ color:'#94a3b8', padding:'40px', textAlign:'center' }}>No users found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {['User', 'Company', 'Phone', 'Status', 'Registered', 'Actions'].map(header => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  onView={() => setSelected(user)}
                  onEdit={openEdit}
                  onRequestAction={requestUserAction}
                  busy={actionProcessing && confirmAction.user?.id === user.id}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display:'flex', gap:'8px', marginTop:'16px', alignItems:'center', color:'#94a3b8', fontSize:'13px' }}>
        <span>Page {meta.current_page || 1} of {meta.last_page || 1} ({meta.total || 0} users)</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:'6px' }}>
          <button onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page <= 1} className="admin-btn admin-btn-ghost" style={{ border:'1px solid rgba(255,255,255,0.1)' }}>← Prev</button>
          <button onClick={() => setPage(current => Math.min(meta.last_page || 1, current + 1))} disabled={page >= (meta.last_page || 1)} className="admin-btn admin-btn-ghost" style={{ border:'1px solid rgba(255,255,255,0.1)' }}>Next →</button>
        </div>
      </div>

      <ConfirmModal
        open={confirmAction.open}
        title={currentActionModal.title}
        message={currentActionModal.message}
        description={currentActionModal.description}
        confirmText={currentActionModal.confirmText}
        cancelText="Cancel"
        eyebrow={currentActionModal.eyebrow}
        icon={currentActionModal.icon}
        variant={currentActionModal.variant}
        loading={actionProcessing}
        closeOnBackdrop={!actionProcessing}
        onConfirm={processUserAction}
        onClose={closeActionConfirmation}
      />

      <NoticeModal
        open={notice.open}
        title={notice.title}
        message={notice.message}
        type={notice.type}
        buttonText="OK"
        onClose={() => setNotice(current => ({ ...current, open:false }))}
      />
    </div>
  )
}