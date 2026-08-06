const DEFAULT_API_BASE = '/api'
const CACHE_KEY = 'navsa_public_deals_v1'
const CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000

export const PUBLIC_DEALS_REFRESH_MS = 30 * 1000

let memoryDeals = null
let memoryFetchedAt = 0
let pendingRequest = null

function getApiBase() {
  return (import.meta.env.VITE_API_URL || DEFAULT_API_BASE).replace(/\/+$/, '')
}

function getApiOrigin() {
  const apiBase = getApiBase()

  try {
    return new URL(apiBase, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

function resolveFileUrl(pdf) {
  const apiOrigin = getApiOrigin()
  const suppliedUrl = typeof pdf?.file_url === 'string' ? pdf.file_url.trim() : ''

  if (suppliedUrl) {
    try {
      const resolved = new URL(suppliedUrl, apiOrigin)
      const currentHostIsLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      const suppliedHostIsLocal = ['localhost', '127.0.0.1'].includes(resolved.hostname)

      if (currentHostIsLocal || !suppliedHostIsLocal || !pdf?.file_path) {
        return resolved.href
      }
    } catch {
      // Fall through to the stored file path.
    }
  }

  if (pdf?.file_path) {
    const cleanPath = String(pdf.file_path).replace(/^\/+/, '')
    return new URL(`/storage/${cleanPath}`, apiOrigin).href
  }

  return ''
}

function normalisePayload(payload) {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.deals)
        ? payload.deals
        : []

  return source
    .map((pdf) => ({
      ...pdf,
      id: Number(pdf?.id) || 0,
      title: typeof pdf?.title === 'string' ? pdf.title.trim() : '',
      validity_text: typeof pdf?.validity_text === 'string'
        ? pdf.validity_text.trim()
        : '',
      file_url: resolveFileUrl(pdf),
      sort_order: Number(pdf?.sort_order) || 0,
    }))
    .filter((pdf) => pdf.title && pdf.file_url)
    .sort(
      (a, b) => a.sort_order - b.sort_order || a.id - b.id,
    )
}

function readStoredDeals() {
  try {
    const stored = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (!stored || !Array.isArray(stored.items) || !stored.savedAt) return null
    if (Date.now() - Number(stored.savedAt) > CACHE_MAX_AGE_MS) return null
    return normalisePayload(stored.items)
  } catch {
    return null
  }
}

function storeDeals(items) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ items, savedAt: Date.now() }),
    )
  } catch {
    // The website still works when browser storage is unavailable.
  }
}

export async function getPublicDeals({ force = false } = {}) {
  const now = Date.now()

  if (
    !force
    && Array.isArray(memoryDeals)
    && now - memoryFetchedAt < PUBLIC_DEALS_REFRESH_MS
  ) {
    return memoryDeals
  }

  if (pendingRequest) return pendingRequest

  pendingRequest = fetch(`${getApiBase()}/deals`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
    .then(async (response) => {
      const payload = await response.json().catch(() => [])
      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || `HTTP ${response.status}`)
      }

      const deals = normalisePayload(payload)
      memoryDeals = deals
      memoryFetchedAt = Date.now()
      storeDeals(deals)
      return deals
    })
    .catch((error) => {
      const storedDeals = readStoredDeals()
      if (storedDeals) {
        memoryDeals = storedDeals
        memoryFetchedAt = Date.now()
        return storedDeals
      }
      throw error
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

function formatDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return ''
  return `${match[3]}/${match[2]}/${match[1]}`
}

export function getPromotionDisplayText(deal) {
  const title = String(deal?.title || '').trim()
  const validityText = String(deal?.validity_text || '').trim()

  if (validityText) {
    return `${title} ${validityText}`.trim()
  }

  const validFrom = formatDate(deal?.valid_from)
  const validTo = formatDate(deal?.valid_to)

  if (validFrom && validTo) {
    return `${title} VALID ${validFrom} TO ${validTo}`
  }

  return title
}