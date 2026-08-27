import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrderSuccessModal.css'

export default function OrderSuccessModal({
  order,
  onClose,
  formatPrice,
}) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(6)

  const orderNumber = order?.order_number || 'NAV-' + Math.floor(100000 + Math.random() * 900000)
  const totalAmount = order?.total_amount || 0
  const totalItems = order?.total_items || order?.items?.length || 1
  const shippingMethod = order?.shipping_method || 'Standard Freight'

  useEffect(() => {
    // Prevent body scrolling while modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      document.body.style.overflow = originalOverflow
    }
  }, [navigate])

  const handleCopyOrderNumber = () => {
    navigator.clipboard?.writeText(orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGoHome = () => {
    if (onClose) onClose()
    navigate('/')
  }

  const handleViewOrders = () => {
    if (onClose) onClose()
    navigate('/profile', { state: { tab: 'orders' } })
  }

  return (
    <div className="order-success-backdrop" role="dialog" aria-modal="true">
      <div className="order-success-modal">
        {/* Animated Celebration Icon */}
        <div className="order-success-icon-wrap">
          <div className="order-success-icon-pulse"></div>
          <div className="order-success-icon">
            <svg
              className="order-success-checkmark"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="order-success-circle"
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="order-success-check"
                d="M15 27L22 34L37 19"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title and Confirmation */}
        <div className="order-success-header">
          <span className="order-success-badge">Trade Order Confirmed</span>
          <h2 className="order-success-title">Order Placed Successfully!</h2>
          <p className="order-success-subtitle">
            Thank you for your business. Your wholesale order has been submitted to our operations team and is now being processed.
          </p>
        </div>

        {/* Order Reference Pill */}
        <div className="order-success-reference-box">
          <span className="order-ref-label">Order Reference:</span>
          <strong className="order-ref-code">{orderNumber}</strong>
          <button
            type="button"
            className="order-ref-copy-btn"
            onClick={handleCopyOrderNumber}
            title="Copy Order Number"
          >
            {copied ? (
              <span className="copied-text">✓ Copied</span>
            ) : (
              <span>Copy</span>
            )}
          </button>
        </div>

        {/* Order Summary Cards */}
        <div className="order-success-summary-grid">
          <div className="order-summary-card">
            <span className="card-label">Total Amount</span>
            <strong className="card-value card-price">
              {formatPrice ? formatPrice(totalAmount) : `£${Number(totalAmount).toFixed(2)}`}
            </strong>
          </div>

          <div className="order-summary-card">
            <span className="card-label">Total Volume</span>
            <strong className="card-value">{totalItems} {totalItems === 1 ? 'Product / Case' : 'Products / Cases'}</strong>
          </div>

          <div className="order-summary-card full-width">
            <span className="card-label">Shipping / Delivery</span>
            <strong className="card-value card-shipping">{shippingMethod}</strong>
          </div>
        </div>

        {/* Auto-redirect progress */}
        <div className="order-redirect-box">
          <div className="redirect-text">
            <span>Redirecting to Home Page in <strong>{timeLeft}s</strong></span>
          </div>
          <div className="redirect-progress-bar">
            <div
              className="redirect-progress-fill"
              style={{ width: `${((6 - timeLeft) / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        <div className="order-success-actions">
          <button
            type="button"
            className="order-success-btn primary"
            onClick={handleGoHome}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Go to Home Page
          </button>

          <button
            type="button"
            className="order-success-btn secondary"
            onClick={handleViewOrders}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            View Order History
          </button>
        </div>
      </div>
    </div>
  )
}
