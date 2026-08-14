export function normalizeOrderQtyAllowed(value) {
  const rule = String(value ?? '').trim().toUpperCase()

  if (rule === 'PALLET' || rule === 'CASE') {
    return rule
  }

  return 'DEFAULT'
}

export function getOrderQuantityPermissions(value) {
  const rule = normalizeOrderQtyAllowed(value)

  return {
    rule,
    caseAllowed: rule === 'CASE',
    layerAllowed: rule !== 'PALLET',
    palletAllowed: true,
  }
}

export function sanitizeOrderQuantities(
  item,
  { caseQty = 0, layerQty = 0, palletQty = 0 } = {},
) {
  const { caseAllowed, layerAllowed, palletAllowed } =
    getOrderQuantityPermissions(item?.order_qty_allowed)

  return {
    caseQty: caseAllowed ? Math.max(0, Number(caseQty || 0)) : 0,
    layerQty:
      layerAllowed && Number(item?.layer_quantity || 0) > 0
        ? Math.max(0, Number(layerQty || 0))
        : 0,
    palletQty:
      palletAllowed && Number(item?.pallet_quantity || 0) > 0
        ? Math.max(0, Number(palletQty || 0))
        : 0,
  }
}
