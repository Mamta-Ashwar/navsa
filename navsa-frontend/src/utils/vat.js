export function normalizeCountryName(value = '') {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[.]/g, '')
    .replace(/\s+/g, ' ')
}

export function isUnitedKingdomCountry(value) {
  const country = normalizeCountryName(value)
  return [
    'united kingdom',
    'uk',
    'u k',
    'great britain',
    'gb',
    'gbr',
  ].includes(country)
}

export function formatVatRate(value) {
  const rate = Number(value || 0)
  if (!Number.isFinite(rate)) return '0'
  return rate.toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
}

export function getProductVatRate(product) {
  if (!product || product.vat_charge_for_uk === false || product.vat_charge_for_uk === 0) {
    return 0
  }
  const rate = Number(product.vat_rate || 0)
  return Number.isFinite(rate) ? rate : 0
}

export function getEmbeddedRegisteredCountry(user) {
  return (
    user?.customer_detail?.country ||
    user?.customerDetail?.country ||
    user?.customer_details?.country ||
    ''
  )
}

export async function fetchRegisteredCustomerCountry(user, token) {
  const embedded = getEmbeddedRegisteredCountry(user)
  if (embedded) return embedded
  if (!user?.id && !user?.email) return ''

  const BASE = import.meta.env.VITE_API_URL || '/api'
  const params = new URLSearchParams()
  if (user?.id) params.set('user_id', user.id)
  else if (user?.email) params.set('email', user.email)

  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${BASE}/profile?${params.toString()}`, { headers })
  if (!response.ok) {
    throw new Error('Unable to verify your registered country for VAT.')
  }

  const payload = await response.json()
  return payload?.customer_detail?.country || payload?.user?.customer_detail?.country || ''
}
