// const BASE = import.meta.env.VITE_API_URL || '/api'
// const KEY = import.meta.env.VITE_ADMIN_KEY || 'navsa2024'

// const headers = () => ({
//   'Content-Type': 'application/json',
//   'X-Admin-Key': KEY,
//   Accept: 'application/json',
// })

// async function readResponse(res) {
//   const data = await res.json().catch(() => ({}))
//   if (!res.ok) {
//     throw new Error(
//       data.message
//       || data.error
//       || Object.values(data.errors || {}).flat().join(', ')
//       || `HTTP ${res.status}`,
//     )
//   }
//   return data
// }

// async function req(method, path, body) {
//   const opts = { method, headers: headers() }
//   if (body !== undefined) opts.body = JSON.stringify(body)
//   const res = await fetch(`${BASE}/admin${path}`, opts)
//   return readResponse(res)
// }

// export const getStats = () => req('GET', '/stats')

// export const getProducts = (params = {}) => {
//   const qs = new URLSearchParams(params).toString()
//   return req('GET', `/products${qs ? `?${qs}` : ''}`)
// }
// export const createProduct = (data) => req('POST', '/products', data)
// export const updateProduct = (id, data) => req('PUT', `/products/${id}`, data)
// export const toggleWeb = (id) => req('PATCH', `/products/${id}/toggle-web`)
// export const toggleOffer = (id, label) => req('PATCH', `/products/${id}/toggle-offer`, label ? { offer_label: label } : {})
// export const toggleBestOffer = (id) => req('PATCH', `/products/${id}/toggle-best-offer`)
// export const toggleNewArrival = (id) => req('PATCH', `/products/${id}/toggle-new-arrival`)
// export const updateStock = (id, stock_quantity, price, price_list) => (
//   req('PATCH', `/products/${id}/stock`, { stock_quantity, price, price_list })
// )
// export const softDeleteProduct = (id) => req('PATCH', `/products/${id}/soft-delete`)
// export const restoreProduct = (id) => req('PATCH', `/products/${id}/restore`)
// export const hardDeleteProduct = (id) => req('DELETE', `/products/${id}`)
// export const clearAllOffers = () => req('PATCH', '/products/clear-offers')

// export const getUsers = (params = {}) => {
//   const qs = new URLSearchParams(params).toString()
//   return req('GET', `/users${qs ? `?${qs}` : ''}`)
// }
// export const updateUser = (id, data) => req('PUT', `/users/${id}`, data)
// export const deleteUser = (id) => req('DELETE', `/users/${id}`)

// export const getSuppliers = (params = {}) => {
//   const qs = new URLSearchParams(params).toString()
//   return req('GET', `/suppliers${qs ? `?${qs}` : ''}`)
// }
// export const updateSupplier = (id, data) => req('PUT', `/suppliers/${id}`, data)

// export const getBrands = () => req('GET', '/brands')
// export const createBrand = (brand_name) => req('POST', '/brands', { brand_name })
// export const updateBrand = (id, data) => req('PUT', `/brands/${id}`, data)
// export const softDeleteBrand = (id) => req('PATCH', `/brands/${id}/soft-delete`)
// export const hardDeleteBrand = (id) => req('DELETE', `/brands/${id}`)

// export const getCategories = () => req('GET', '/categories')
// export const createCategory = (category_name) => req('POST', '/categories', { category_name })
// export const updateCategory = (id, data) => req('PUT', `/categories/${id}`, data)
// export const softDeleteCategory = (id) => req('PATCH', `/categories/${id}/soft-delete`)
// export const hardDeleteCategory = (id) => req('DELETE', `/categories/${id}`)

// export const getRegistrations = (type = 'customer') => {
//   const query = type ? `?type=${encodeURIComponent(type)}` : ''
//   return req('GET', `/registrations${query}`)
// }
// export const approveRegistration = (id) => req('POST', `/registrations/${id}/approve`)
// export const rejectRegistration = (id) => req('POST', `/registrations/${id}/reject`)

// export const getPdfs = () => req('GET', '/pdfs')

// export const uploadPdf = async (formData) => {
//   const res = await fetch(`${BASE}/admin/pdfs`, {
//     method: 'POST',
//     headers: {
//       'X-Admin-Key': KEY,
//       Accept: 'application/json',
//     },
//     body: formData,
//   })
//   return readResponse(res)
// }

// export const updatePdf = async (id, formData) => {
//   const res = await fetch(`${BASE}/admin/pdfs/${id}`, {
//     method: 'POST',
//     headers: {
//       'X-Admin-Key': KEY,
//       Accept: 'application/json',
//     },
//     body: formData,
//   })
//   return readResponse(res)
// }

// export const reorderPdfs = (ids) => req('POST', '/pdfs/reorder', { ids })
// export const deletePdf = (id) => req('DELETE', `/pdfs/${id}`)

// export const getBanners = (position = '') => {
//   const query = position ? `?position=${encodeURIComponent(position)}` : ''
//   return req('GET', `/banners${query}`)
// }

// async function sendBannerForm(path, formData) {
//   const res = await fetch(`${BASE}/admin${path}`, {
//     method: 'POST',
//     headers: {
//       'X-Admin-Key': KEY,
//       Accept: 'application/json',
//     },
//     body: formData,
//   })
//   return readResponse(res)
// }

// export const uploadBanner = (formData) => sendBannerForm('/banners', formData)
// export const updateBanner = (id, formData) => sendBannerForm(`/banners/${id}`, formData)
// export const reorderBanners = (position, ids) => req('POST', '/banners/reorder', { position, ids })
// export const deleteBanner = (id) => req('DELETE', `/banners/${id}`)

const BASE = import.meta.env.VITE_API_URL || '/api'
const KEY = import.meta.env.VITE_ADMIN_KEY || 'navsa2024'

const headers = () => {
  const token = localStorage.getItem('admin_token')
  const h = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Admin-Key': KEY,
  }
  if (token) {
    h['Authorization'] = `Bearer ${token}`
  }
  return h
}

const fileHeaders = () => {
  const token = localStorage.getItem('admin_token')
  const h = {
    'X-Admin-Key': KEY,
    'Accept': 'application/json',
  }
  if (token) {
    h['Authorization'] = `Bearer ${token}`
  }
  return h
}

async function readResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      data.message
      || data.error
      || Object.values(data.errors || {}).flat().join(', ')
      || `HTTP ${res.status}`,
    )
  }
  return data
}

async function req(method, path, body) {
  const opts = { method, headers: headers() }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}/admin${path}`, opts)
  return readResponse(res)
}

export const getStats = () => req('GET', '/stats')

export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/products${qs ? `?${qs}` : ''}`)
}
export const createProduct = (data) => req('POST', '/products', data)
export const updateProduct = (id, data) => req('PUT', `/products/${id}`, data)
export const toggleWeb = (id) => req('PATCH', `/products/${id}/toggle-web`)
export const toggleOffer = (id, label) => req('PATCH', `/products/${id}/toggle-offer`, label ? { offer_label: label } : {})
export const toggleBestOffer = (id) => req('PATCH', `/products/${id}/toggle-best-offer`)
export const toggleNewArrival = (id) => req('PATCH', `/products/${id}/toggle-new-arrival`)
export const updateStock = (id, stock_quantity, price, price_list) => (
  req('PATCH', `/products/${id}/stock`, { stock_quantity, price, price_list })
)
export const softDeleteProduct = (id) => req('PATCH', `/products/${id}/soft-delete`)
export const restoreProduct = (id) => req('PATCH', `/products/${id}/restore`)
export const hardDeleteProduct = (id) => req('DELETE', `/products/${id}`)
export const clearAllOffers = () => req('PATCH', '/products/clear-offers')

export const uploadErpExcel = async (formData) => {
  const res = await fetch(`${BASE}/admin/import-erp`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const getUsers = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/users${qs ? `?${qs}` : ''}`)
}
export const updateUser = (id, data) => req('PUT', `/users/${id}`, data)
export const deleteUser = (id) => req('DELETE', `/users/${id}`)

export const getSuppliers = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/suppliers${qs ? `?${qs}` : ''}`)
}
export const updateSupplier = (id, data) => req('PUT', `/suppliers/${id}`, data)

export const getBrands = () => req('GET', '/brands')
export const createBrand = (brand_name) => req('POST', '/brands', { brand_name })
export const updateBrand = (id, data) => req('PUT', `/brands/${id}`, data)
export const softDeleteBrand = (id) => req('PATCH', `/brands/${id}/soft-delete`)
export const hardDeleteBrand = (id) => req('DELETE', `/brands/${id}`)

export const getCategories = () => req('GET', '/categories')
export const createCategory = (category_name) => req('POST', '/categories', { category_name })
export const updateCategory = (id, data) => req('PUT', `/categories/${id}`, data)
export const softDeleteCategory = (id) => req('PATCH', `/categories/${id}/soft-delete`)
export const hardDeleteCategory = (id) => req('DELETE', `/categories/${id}`)

export const getRegistrations = (type = 'customer') => {
  const query = type ? `?type=${encodeURIComponent(type)}` : ''
  return req('GET', `/registrations${query}`)
}
export const approveRegistration = (id) => req('POST', `/registrations/${id}/approve`)
export const rejectRegistration = (id) => req('POST', `/registrations/${id}/reject`)

export const getPdfs = () => req('GET', '/pdfs')

export const uploadPdf = async (formData) => {
  const res = await fetch(`${BASE}/admin/pdfs`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const updatePdf = async (id, formData) => {
  const res = await fetch(`${BASE}/admin/pdfs/${id}`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const reorderPdfs = (ids) => req('POST', '/pdfs/reorder', { ids })
export const deletePdf = (id) => req('DELETE', `/pdfs/${id}`)

export const getBanners = (position = '') => {
  const query = position ? `?position=${encodeURIComponent(position)}` : ''
  return req('GET', `/banners${query}`)
}

async function sendBannerForm(path, formData) {
  const res = await fetch(`${BASE}/admin${path}`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const uploadBanner = (formData) => sendBannerForm('/banners', formData)
export const updateBanner = (id, formData) => sendBannerForm(`/banners/${id}`, formData)
export const reorderBanners = (position, ids) => req('POST', '/banners/reorder', { position, ids })
export const deleteBanner = (id) => req('DELETE', `/banners/${id}`)