import { createContext, useContext, useEffect, useState } from 'react'
import {
  getOrderQuantityPermissions,
  normalizeOrderQtyAllowed,
  sanitizeOrderQuantities,
} from '../utils/orderQuantity'

const CartContext = createContext(null)
const BASKET_KEY = 'navsa_basket'
const WISHLIST_KEY = 'navsa_wishlist'
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

function loadFromStorage(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function calcCases(item, caseQty = 0, layerQty = 0, palletQty = 0) {
  return (
    Number(caseQty || 0) +
    Number(layerQty || 0) * Number(item.layer_quantity || 0) +
    Number(palletQty || 0) * Number(item.pallet_quantity || 0)
  )
}


function normaliseBasketItem(item) {
  const orderQtyAllowed = normalizeOrderQtyAllowed(item?.order_qty_allowed)
  const hadStructuredQuantity =
    Number(item.caseQty || 0) > 0 ||
    Number(item.layerQty || 0) > 0 ||
    Number(item.palletQty || 0) > 0

  const quantities = sanitizeOrderQuantities(
    { ...item, order_qty_allowed: orderQtyAllowed },
    {
      caseQty: item.caseQty,
      layerQty: item.layerQty,
      palletQty: item.palletQty,
    },
  )

  return {
    ...item,
    order_qty_allowed: orderQtyAllowed,
    ...quantities,
    totalCases: hadStructuredQuantity
      ? calcCases(item, quantities.caseQty, quantities.layerQty, quantities.palletQty)
      : Math.max(0, Number(item.totalCases || 0)),
  }
}

function loadBasketFromStorage() {
  return loadFromStorage(BASKET_KEY)
    .map(normaliseBasketItem)
    .filter(item => Number(item.totalCases || 0) > 0)
}

async function fetchCurrentProduct(productId) {
  try {
    const response = await fetch(
      `${API_BASE}/products/${encodeURIComponent(productId)}`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      },
    )

    if (response.status === 404) {
      return { __catalogueUnavailable: true }
    }

    if (!response.ok) {
      return { __catalogueFetchFailed: true }
    }

    const payload = await response.json()
    const product = payload?.data ?? payload?.product ?? payload

    return product && typeof product === 'object' ? product : null
  } catch (error) {
    console.error(`Could not refresh stored product ${productId}:`, error)
    return { __catalogueFetchFailed: true }
  }
}

function mergeCurrentProductIntoBasketItem(item, product) {
  if (!product) return normaliseBasketItem(item)

  const orderQtyAllowed = normalizeOrderQtyAllowed(product.order_qty_allowed)
  const currentItem = {
    ...item,
    description: product.description ?? item.description,
    brand: product.brand?.brand_name ?? item.brand,
    web_image: product.web_image ?? item.web_image,
    price: product.price ?? item.price,
    reference: product.reference ?? product.navsa_product_code ?? item.reference,
    navsa_product_code: product.navsa_product_code ?? item.navsa_product_code,
    order_qty_allowed: orderQtyAllowed,
    layer_quantity: product.layer_quantity ?? item.layer_quantity,
    pallet_quantity: product.pallet_quantity ?? item.pallet_quantity,
    units_of:
      product.units_of ?? product.inner_case_quantity ?? product.case_size ?? item.units_of,
    inner_case_quantity:
      product.inner_case_quantity ?? product.units_of ?? item.inner_case_quantity,
    weight: product.weight ?? item.weight,
    volume: product.volume ?? item.volume,
    storage_type: product.storage_type ?? item.storage_type ?? 'Ambient',
  }

  const quantities = sanitizeOrderQuantities(currentItem, {
    caseQty: item.caseQty,
    layerQty: item.layerQty,
    palletQty: item.palletQty,
  })

  return {
    ...currentItem,
    ...quantities,
    totalCases: calcCases(
      currentItem,
      quantities.caseQty,
      quantities.layerQty,
      quantities.palletQty,
    ),
  }
}

function mergeCurrentProductIntoWishlistItem(item, product) {
  if (!product) return item

  return {
    ...item,
    description: product.description ?? item.description,
    brand: product.brand ?? item.brand,
    web_image: product.web_image ?? item.web_image,
    price: product.price ?? item.price,
    reference: product.reference ?? product.navsa_product_code ?? item.reference,
    navsa_product_code: product.navsa_product_code ?? item.navsa_product_code,
    order_qty_allowed: normalizeOrderQtyAllowed(product.order_qty_allowed),
    layer_quantity: product.layer_quantity ?? item.layer_quantity,
    pallet_quantity: product.pallet_quantity ?? item.pallet_quantity,
    units_of:
      product.units_of ?? product.inner_case_quantity ?? product.case_size ?? item.units_of,
    inner_case_quantity:
      product.inner_case_quantity ?? product.units_of ?? item.inner_case_quantity,
    weight: product.weight ?? item.weight,
    volume: product.volume ?? item.volume,
    storage_type: product.storage_type ?? item.storage_type,
    barcode_ean: product.barcode_ean ?? item.barcode_ean,
    category: product.category ?? item.category,
  }
}

function unitsPerCase(item) {
  return Number(item.units_of || item.inner_case_quantity || item.case_size || 1)
}

function lineWeight(item) {
  return Number(item.weight || 0) * unitsPerCase(item) * Number(item.totalCases || 0)
}

function lineVolume(item) {
  return Number(item.volume || 0) * Number(item.totalCases || 0)
}

export function CartProvider({ children }) {
  const [basketItems, setBasketItems] = useState(() => loadBasketFromStorage())
  const [wishlistItems, setWishlistItems] = useState(() => loadFromStorage(WISHLIST_KEY))

  useEffect(() => {
    localStorage.setItem(BASKET_KEY, JSON.stringify(basketItems))
  }, [basketItems])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  useEffect(() => {
    let cancelled = false
    let syncInProgress = false

    async function syncStoredProductsWithCatalogue() {
      if (cancelled || syncInProgress) return

      const storedBasket = loadFromStorage(BASKET_KEY)
      const storedWishlist = loadFromStorage(WISHLIST_KEY)
      const ids = [
        ...new Set(
          [...storedBasket, ...storedWishlist]
            .map(item => item?.id)
            .filter(id => id !== null && id !== undefined && id !== ''),
        ),
      ]

      if (!ids.length) return

      syncInProgress = true

      try {
        const products = await Promise.all(
          ids.map(async id => [String(id), await fetchCurrentProduct(id)]),
        )

        if (cancelled) return

        const currentById = new Map(products)

        const refreshedBasket = storedBasket
          .flatMap(item => {
            const current = currentById.get(String(item.id))

            // A 404 means the product is no longer available publicly
            // (deleted, hidden, or obsolete). Remove the stale stored copy.
            if (current?.__catalogueUnavailable) return []

            // A temporary API/network failure must never destroy the user's basket.
            if (!current || current?.__catalogueFetchFailed) {
              return [normaliseBasketItem(item)]
            }

            return [mergeCurrentProductIntoBasketItem(item, current)]
          })
          .filter(item => Number(item.totalCases || 0) > 0)

        const refreshedWishlist = storedWishlist.flatMap(item => {
          const current = currentById.get(String(item.id))

          if (current?.__catalogueUnavailable) return []
          if (!current || current?.__catalogueFetchFailed) return [item]

          return [mergeCurrentProductIntoWishlistItem(item, current)]
        })

        setBasketItems(refreshedBasket)
        setWishlistItems(refreshedWishlist)
      } finally {
        syncInProgress = false
      }
    }

    syncStoredProductsWithCatalogue()

    const handleWindowFocus = () => {
      syncStoredProductsWithCatalogue()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncStoredProductsWithCatalogue()
      }
    }

    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  function addToBasket(product, { caseQty = 0, layerQty = 0, palletQty = 0 } = {}) {
    const orderQtyAllowed = normalizeOrderQtyAllowed(product?.order_qty_allowed)
    const productWithRule = {
      ...product,
      order_qty_allowed: orderQtyAllowed,
    }

    const incoming = sanitizeOrderQuantities(productWithRule, {
      caseQty,
      layerQty,
      palletQty,
    })

    const totalCases = calcCases(
      productWithRule,
      incoming.caseQty,
      incoming.layerQty,
      incoming.palletQty,
    )

    if (totalCases <= 0) return false

    setBasketItems(prev => {
      const existing = prev.find(item => item.id === product.id)

      if (existing) {
        return prev.map(item => {
          if (item.id !== product.id) return item

          const combined = sanitizeOrderQuantities(
            {
              ...item,
              order_qty_allowed: orderQtyAllowed,
              layer_quantity: product.layer_quantity ?? item.layer_quantity,
              pallet_quantity: product.pallet_quantity ?? item.pallet_quantity,
            },
            {
              caseQty: Number(item.caseQty || 0) + incoming.caseQty,
              layerQty: Number(item.layerQty || 0) + incoming.layerQty,
              palletQty: Number(item.palletQty || 0) + incoming.palletQty,
            },
          )

          return {
            ...item,
            order_qty_allowed: orderQtyAllowed,
            layer_quantity: product.layer_quantity ?? item.layer_quantity,
            pallet_quantity: product.pallet_quantity ?? item.pallet_quantity,
            ...combined,
            totalCases: calcCases(
              productWithRule,
              combined.caseQty,
              combined.layerQty,
              combined.palletQty,
            ),
          }
        })
      }

      return [
        ...prev,
        {
          id: product.id,
          description: product.description,
          brand: product.brand?.brand_name || '',
          web_image: product.web_image || '',
          price: product.price || 0,
          reference: product.reference,
          order_qty_allowed: orderQtyAllowed,

          layer_quantity: product.layer_quantity || 0,
          pallet_quantity: product.pallet_quantity || 0,
          units_of: product.units_of || product.inner_case_quantity || product.case_size || 1,
          inner_case_quantity: product.inner_case_quantity || product.units_of || 1,

          weight: product.weight || 0,
          volume: product.volume || 0,
          storage_type: product.storage_type || 'Ambient',

          ...incoming,
          totalCases,
        },
      ]
    })

    return true
  }

  function changeCaseQty(id, amount) {
    setBasketItems(prev =>
      prev
        .map(item => {
          if (item.id !== id) return item

          const { caseAllowed } = getOrderQuantityPermissions(item?.order_qty_allowed)
          if (!caseAllowed) return item

          const caseQty = Math.max(0, Number(item.caseQty || 0) + amount)
          const layerQty = Number(item.layerQty || 0)
          const palletQty = Number(item.palletQty || 0)

          return {
            ...item,
            caseQty,
            totalCases: calcCases(item, caseQty, layerQty, palletQty),
          }
        })
        .filter(item => Number(item.totalCases || 0) > 0)
    )
  }

  function changeLayerQty(id, amount) {
    setBasketItems(prev =>
      prev
        .map(item => {
          if (item.id !== id) return item

          const { layerAllowed } = getOrderQuantityPermissions(item?.order_qty_allowed)
          if (!layerAllowed || Number(item.layer_quantity || 0) <= 0) return item

          const caseQty = Number(item.caseQty || 0)
          const layerQty = Math.max(0, Number(item.layerQty || 0) + amount)
          const palletQty = Number(item.palletQty || 0)

          return {
            ...item,
            layerQty,
            totalCases: calcCases(item, caseQty, layerQty, palletQty),
          }
        })
        .filter(item => Number(item.totalCases || 0) > 0)
    )
  }

  function changePalletQty(id, amount) {
    setBasketItems(prev =>
      prev
        .map(item => {
          if (item.id !== id) return item

          const { palletAllowed } = getOrderQuantityPermissions(item?.order_qty_allowed)
          if (!palletAllowed || Number(item.pallet_quantity || 0) <= 0) return item

          const caseQty = Number(item.caseQty || 0)
          const layerQty = Number(item.layerQty || 0)
          const palletQty = Math.max(0, Number(item.palletQty || 0) + amount)

          return {
            ...item,
            palletQty,
            totalCases: calcCases(item, caseQty, layerQty, palletQty),
          }
        })
        .filter(item => Number(item.totalCases || 0) > 0)
    )
  }

  function removeFromBasket(id) {
    setBasketItems(prev => prev.filter(item => item.id !== id))
  }

  function removeByStorageType(type) {
    setBasketItems(prev => prev.filter(item => (item.storage_type || 'Ambient') !== type))
  }

  function removeAmbientAndChilled() {
    setBasketItems(prev =>
      prev.filter(item => {
        const type = item.storage_type || 'Ambient'
        return type !== 'Ambient' && type !== 'Chilled'
      })
    )
  }

  function clearBasket() {
    setBasketItems([])
  }

  function addToWishlist(product) {
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev

      return [
        ...prev,
        {
          id: product.id,
          description: product.description,
          brand: product.brand?.brand_name || '',
          web_image: product.web_image || '',
          price: product.price,
          reference: product.reference ?? product.navsa_product_code,
          navsa_product_code: product.navsa_product_code,
          order_qty_allowed: normalizeOrderQtyAllowed(product.order_qty_allowed),
          layer_quantity: product.layer_quantity || 0,
          pallet_quantity: product.pallet_quantity || 0,
          units_of: product.units_of || product.inner_case_quantity || product.case_size || 1,
          inner_case_quantity: product.inner_case_quantity || product.units_of || 1,
          weight: product.weight || 0,
          volume: product.volume || 0,
          storage_type: product.storage_type || 'Ambient',
        },
      ]
    })
  }

  function removeFromWishlist(id) {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
  }

  function isInWishlist(id) {
    return wishlistItems.some(item => item.id === id)
  }

  const basketCount = basketItems.reduce((sum, item) => sum + Number(item.totalCases || 0), 0)

  const basketTotal = basketItems.reduce(
    (sum, item) => sum + Number(item.totalCases || 0) * Number(item.price || 0),
    0
  )

  const basketWeight = basketItems.reduce((sum, item) => sum + lineWeight(item), 0)
  const basketVolume = basketItems.reduce((sum, item) => sum + lineVolume(item), 0)
  const wishlistCount = wishlistItems.length

  return (
    <CartContext.Provider
      value={{
        basketItems,
        wishlistItems,
        addToBasket,
        changeCaseQty,
        changeLayerQty,
        changePalletQty,
        removeFromBasket,
        removeByStorageType,
        removeAmbientAndChilled,
        clearBasket,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        basketCount,
        basketTotal,
        basketWeight,
        basketVolume,
        wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}