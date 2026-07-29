const API_BASE = import.meta.env.VITE_API_URL || '/api'
const headers = { 'Accept': 'application/json' }

export async function getContainers() {
  const response = await fetch(`${API_BASE}/shipping/containers`, { headers })
  if (!response.ok) throw new Error('Failed to load containers')
  return response.json()
}

export async function getCountries() {
  const response = await fetch(`${API_BASE}/shipping/countries`, { headers })
  if (!response.ok) throw new Error('Failed to load countries')
  return response.json()
}

export async function getPorts(countryId) {
  if (!countryId) return []

  const response = await fetch(`${API_BASE}/shipping/ports/${countryId}`, { headers })
  if (!response.ok) throw new Error('Failed to load ports')
  return response.json()
}