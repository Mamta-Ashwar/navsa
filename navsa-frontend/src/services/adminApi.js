// const BASE = import.meta.env.VITE_API_URL || '/api'

// const headers = () => {
//   const token = localStorage.getItem('admin_token')

//   const h = {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }

//   if (token) {
//     // Standard Sanctum Bearer authentication.
//     // Works normally in local development and on compatible servers.
//     h['Authorization'] = `Bearer ${token}`

//     // IONOS strips the standard Authorization header during the /api rewrite.
//     // The production API bridge converts this back into HTTP_AUTHORIZATION.
//     h['X-Navsa-Auth'] = `Bearer ${token}`
//   }

//   return h
// }

// const fileHeaders = () => {
//   const token = localStorage.getItem('admin_token')

//   const h = {
//     'Accept': 'application/json',
//   }

//   if (token) {
//     h['Authorization'] = `Bearer ${token}`
//     h['X-Navsa-Auth'] = `Bearer ${token}`
//   }

//   return h
// }

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

// export const logoutAdmin = async (tokenOverride = null) => {
//   const token = tokenOverride || localStorage.getItem('admin_token')

//   const h = {
//     'Accept': 'application/json',
//   }

//   if (token) {
//     h['Authorization'] = `Bearer ${token}`
//     h['X-Navsa-Auth'] = `Bearer ${token}`
//   }

//   const res = await fetch(`${BASE}/logout`, {
//     method: 'POST',
//     headers: h,
//   })

//   // If the token is already invalid/revoked, local logout may safely continue.
//   if (res.status === 401) {
//     return { message: 'Session already invalid or revoked.' }
//   }

//   return readResponse(res)
// }

// export const getStats = () => req('GET', '/stats')

// export const getProducts = (params = {}) => {
//   const qs = new URLSearchParams(params).toString()
//   return req('GET', `/products${qs ? `?${qs}` : ''}`)
// }

// export const getVatCodes = () => req('GET', '/vat-codes')
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
// export const bulkHideProducts = (payload) => req('PATCH', '/products/bulk-hide', payload)
// export const bulkShowProducts = (payload) => req('PATCH', '/products/bulk-show', payload)
// export const bulkSoftDeleteProducts = (payload) => req('PATCH', '/products/bulk-soft-delete', payload)
// export const bulkRestoreProducts = (payload) => req('PATCH', '/products/bulk-restore', payload)
// export const bulkHardDeleteProducts = (payload) => req('DELETE', '/products/bulk-hard-delete', payload)

// export const uploadProductImage = async (id, formData) => {
//   const res = await fetch(`${BASE}/admin/products/${id}/image`, {
//     method: 'POST',
//     headers: fileHeaders(),
//     body: formData,
//   })
//   return readResponse(res)
// }

// export const selectProductImage = (id, source, image_id = null) => (
//   req('PATCH', `/products/${id}/image-selection`, { source, image_id })
// )

// export const removeProductImage = (id, source, image_id = null) => (
//   req('DELETE', `/products/${id}/image`, { source, image_id })
// )

// export const uploadErpExcel = async (formData) => {
//   const res = await fetch(`${BASE}/admin/import-erp`, {
//     method: 'POST',
//     headers: fileHeaders(),
//     body: formData,
//   })
//   return readResponse(res)
// }

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

// export const getBrands = (params = {}) => {
//   const query = new URLSearchParams(params).toString()
//   return req('GET', `/brands${query ? '?' + query : ''}`)
// }
// export const createBrand = (brand_name) => req('POST', '/brands', { brand_name })
// export const updateBrand = (id, data) => req('PUT', `/brands/${id}`, data)
// export const softDeleteBrand = (id) => req('PATCH', `/brands/${id}/soft-delete`)
// export const restoreBrand = (id) => req('PATCH', `/brands/${id}/restore`)
// export const hardDeleteBrand = (id) => req('DELETE', `/brands/${id}`)
// export const bulkHideBrands = (payload) => req('PATCH', '/brands/bulk-hide', payload)
// export const bulkShowBrands = (payload) => req('PATCH', '/brands/bulk-show', payload)
// export const bulkSoftDeleteBrands = (payload) => req('PATCH', '/brands/bulk-soft-delete', payload)
// export const bulkRestoreBrands = (payload) => req('PATCH', '/brands/bulk-restore', payload)

// export const getCategories = (params = {}) => {
//   const query = new URLSearchParams(params).toString()
//   return req('GET', `/categories${query ? '?' + query : ''}`)
// }
// export const createCategory = (category_name) => req('POST', '/categories', { category_name })
// export const updateCategory = (id, data) => req('PUT', `/categories/${id}`, data)
// export const softDeleteCategory = (id) => req('PATCH', `/categories/${id}/soft-delete`)
// export const restoreCategory = (id) => req('PATCH', `/categories/${id}/restore`)
// export const hardDeleteCategory = (id) => req('DELETE', `/categories/${id}`)
// export const bulkHideCategories = (payload) => req('PATCH', '/categories/bulk-hide', payload)
// export const bulkShowCategories = (payload) => req('PATCH', '/categories/bulk-show', payload)
// export const bulkSoftDeleteCategories = (payload) => req('PATCH', '/categories/bulk-soft-delete', payload)
// export const bulkRestoreCategories = (payload) => req('PATCH', '/categories/bulk-restore', payload)
// export const bulkHardDeleteCategories = (payload) => req('DELETE', '/categories/bulk-hard-delete', payload)

// export const getAdminSubCategories = (params = {}) => {
//   const query = new URLSearchParams(params).toString()
//   return req('GET', `/sub-categories${query ? '?' + query : ''}`)
// }
// export const createSubCategory = (data) => req('POST', '/sub-categories', data)
// export const updateSubCategory = (id, data) => req('PUT', `/sub-categories/${id}`, data)
// export const softDeleteSubCategory = (id) => req('PATCH', `/sub-categories/${id}/soft-delete`)
// export const restoreSubCategory = (id) => req('PATCH', `/sub-categories/${id}/restore`)
// export const hardDeleteSubCategory = (id) => req('DELETE', `/sub-categories/${id}`)
// export const bulkHideSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-hide', payload)
// export const bulkShowSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-show', payload)
// export const bulkSoftDeleteSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-soft-delete', payload)
// export const bulkRestoreSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-restore', payload)
// export const bulkHardDeleteSubCategories = (payload) => req('DELETE', '/sub-categories/bulk-hard-delete', payload)

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
//     headers: fileHeaders(),
//     body: formData,
//   })
//   return readResponse(res)
// }

// export const updatePdf = async (id, formData) => {
//   const res = await fetch(`${BASE}/admin/pdfs/${id}`, {
//     method: 'POST',
//     headers: fileHeaders(),
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
//     headers: fileHeaders(),
//     body: formData,
//   })
//   return readResponse(res)
// }

// export const uploadBanner = (formData) => sendBannerForm('/banners', formData)
// export const updateBanner = (id, formData) => sendBannerForm(`/banners/${id}`, formData)
// export const reorderBanners = (position, ids) => req('POST', '/banners/reorder', { position, ids })
// export const deleteBanner = (id) => req('DELETE', `/banners/${id}`)

const BASE = import.meta.env.VITE_API_URL || '/api'

const headers = () => {
  const token = localStorage.getItem('admin_token')

  const h = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (token) {
    // Standard Sanctum Bearer authentication.
    // Works normally in local development and on compatible servers.
    h['Authorization'] = `Bearer ${token}`

    // IONOS strips the standard Authorization header during the /api rewrite.
    // The production API bridge converts this back into HTTP_AUTHORIZATION.
    h['X-Navsa-Auth'] = `Bearer ${token}`
  }

  return h
}

const fileHeaders = () => {
  const token = localStorage.getItem('admin_token')

  const h = {
    'Accept': 'application/json',
  }

  if (token) {
    h['Authorization'] = `Bearer ${token}`
    h['X-Navsa-Auth'] = `Bearer ${token}`
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

export const logoutAdmin = async (tokenOverride = null) => {
  const token = tokenOverride || localStorage.getItem('admin_token')

  const h = {
    'Accept': 'application/json',
  }

  if (token) {
    h['Authorization'] = `Bearer ${token}`
    h['X-Navsa-Auth'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}/logout`, {
    method: 'POST',
    headers: h,
  })

  // If the token is already invalid/revoked, local logout may safely continue.
  if (res.status === 401) {
    return { message: 'Session already invalid or revoked.' }
  }

  return readResponse(res)
}

export const getStats = () => req('GET', '/stats')

export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/products${qs ? `?${qs}` : ''}`)
}

export const getVatCodes = () => req('GET', '/vat-codes')
export const createProduct = (data) => req('POST', '/products', data)
export const updateProduct = (id, data) => req('PUT', `/products/${id}`, data)
export const toggleWeb = (id) => req('PATCH', `/products/${id}/toggle-web`)
export const toggleOffer = (id, payload) => req('PATCH', `/products/${id}/toggle-offer`, typeof payload === 'string' ? { offer_label: payload } : (payload || {}))
export const toggleBestOffer = (id, payload) => req('PATCH', `/products/${id}/toggle-best-offer`, payload || {})
export const toggleNewArrival = (id, payload) => req('PATCH', `/products/${id}/toggle-new-arrival`, payload || {})
export const updateStock = (id, stock_quantity, price, price_list) => (
  req('PATCH', `/products/${id}/stock`, { stock_quantity, price, price_list })
)
export const softDeleteProduct = (id) => req('PATCH', `/products/${id}/soft-delete`)
export const restoreProduct = (id) => req('PATCH', `/products/${id}/restore`)
export const hardDeleteProduct = (id) => req('DELETE', `/products/${id}`)
export const clearAllOffers = () => req('PATCH', '/products/clear-offers')
export const bulkHideProducts = (payload) => req('PATCH', '/products/bulk-hide', payload)
export const bulkShowProducts = (payload) => req('PATCH', '/products/bulk-show', payload)
export const bulkSoftDeleteProducts = (payload) => req('PATCH', '/products/bulk-soft-delete', payload)
export const bulkRestoreProducts = (payload) => req('PATCH', '/products/bulk-restore', payload)
export const bulkHardDeleteProducts = (payload) => req('DELETE', '/products/bulk-hard-delete', payload)

export const uploadProductImage = async (id, formData) => {
  const res = await fetch(`${BASE}/admin/products/${id}/image`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const selectProductImage = (id, source, image_id = null) => (
  req('PATCH', `/products/${id}/image-selection`, { source, image_id })
)

export const removeProductImage = (id, source, image_id = null) => (
  req('DELETE', `/products/${id}/image`, { source, image_id })
)

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

export const getBrands = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return req('GET', `/brands${query ? '?' + query : ''}`)
}
export const createBrand = (brand_name) => req('POST', '/brands', { brand_name })
export const updateBrand = (id, data) => req('PUT', `/brands/${id}`, data)
export const softDeleteBrand = (id) => req('PATCH', `/brands/${id}/soft-delete`)
export const restoreBrand = (id) => req('PATCH', `/brands/${id}/restore`)
export const hardDeleteBrand = (id) => req('DELETE', `/brands/${id}`)
export const bulkHideBrands = (payload) => req('PATCH', '/brands/bulk-hide', payload)
export const bulkShowBrands = (payload) => req('PATCH', '/brands/bulk-show', payload)
export const bulkSoftDeleteBrands = (payload) => req('PATCH', '/brands/bulk-soft-delete', payload)
export const bulkRestoreBrands = (payload) => req('PATCH', '/brands/bulk-restore', payload)

export const getCategories = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return req('GET', `/categories${query ? '?' + query : ''}`)
}
export const createCategory = (category_name) => req('POST', '/categories', { category_name })
export const updateCategory = (id, data) => req('PUT', `/categories/${id}`, data)
export const uploadCategoryImage = async (id, formData) => {
  const res = await fetch(`${BASE}/admin/categories/${id}/image`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}
export const softDeleteCategory = (id) => req('PATCH', `/categories/${id}/soft-delete`)
export const restoreCategory = (id) => req('PATCH', `/categories/${id}/restore`)
export const hardDeleteCategory = (id) => req('DELETE', `/categories/${id}`)
export const bulkHideCategories = (payload) => req('PATCH', '/categories/bulk-hide', payload)
export const bulkShowCategories = (payload) => req('PATCH', '/categories/bulk-show', payload)
export const bulkSoftDeleteCategories = (payload) => req('PATCH', '/categories/bulk-soft-delete', payload)
export const bulkRestoreCategories = (payload) => req('PATCH', '/categories/bulk-restore', payload)
export const bulkHardDeleteCategories = (payload) => req('DELETE', '/categories/bulk-hard-delete', payload)

export const getAdminSubCategories = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return req('GET', `/sub-categories${query ? '?' + query : ''}`)
}
export const createSubCategory = (data) => req('POST', '/sub-categories', data)
export const updateSubCategory = (id, data) => req('PUT', `/sub-categories/${id}`, data)
export const softDeleteSubCategory = (id) => req('PATCH', `/sub-categories/${id}/soft-delete`)
export const restoreSubCategory = (id) => req('PATCH', `/sub-categories/${id}/restore`)
export const hardDeleteSubCategory = (id) => req('DELETE', `/sub-categories/${id}`)
export const bulkHideSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-hide', payload)
export const bulkShowSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-show', payload)
export const bulkSoftDeleteSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-soft-delete', payload)
export const bulkRestoreSubCategories = (payload) => req('PATCH', '/sub-categories/bulk-restore', payload)
export const bulkHardDeleteSubCategories = (payload) => req('DELETE', '/sub-categories/bulk-hard-delete', payload)

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

export const getOrders = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/orders${qs ? `?${qs}` : ''}`)
}
export const getOrder = (id) => req('GET', `/orders/${id}`)
export const updateOrderStatus = (id, status) => req('PATCH', `/orders/${id}/status`, { status })

// Import & Export API functions
export const exportProducts = (format = 'csv') => {
  const token = localStorage.getItem('admin_token')
  window.open(`${BASE}/admin/export/products?format=${format}&token=${encodeURIComponent(token || '')}`, '_blank')
}

export const importProductsFile = async (formData) => {
  const res = await fetch(`${BASE}/admin/import/products`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const importProductsJSON = (items) => req('POST', '/import/products', { items })

export const exportBrands = (format = 'csv') => {
  const token = localStorage.getItem('admin_token')
  window.open(`${BASE}/admin/export/brands?format=${format}&token=${encodeURIComponent(token || '')}`, '_blank')
}

export const importBrandsFile = async (formData) => {
  const res = await fetch(`${BASE}/admin/import/brands`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const importBrandsJSON = (items) => req('POST', '/import/brands', { items })

export const exportCategories = (format = 'csv') => {
  const token = localStorage.getItem('admin_token')
  window.open(`${BASE}/admin/export/categories?format=${format}&token=${encodeURIComponent(token || '')}`, '_blank')
}

export const importCategoriesFile = async (formData) => {
  const res = await fetch(`${BASE}/admin/import/categories`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}

export const importCategoriesJSON = (items) => req('POST', '/import/categories', { items })

export const exportFullBackup = () => {
  window.open(`${BASE}/admin/export/full-backup`, '_blank')
}

export const importFullRestoreFile = async (formData) => {
  const res = await fetch(`${BASE}/admin/import/full-restore`, {
    method: 'POST',
    headers: fileHeaders(),
    body: formData,
  })
  return readResponse(res)
}