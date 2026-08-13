import { useEffect, useState } from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import {
  getPromotionDisplayText,
  getPublicDeals,
  PUBLIC_DEALS_REFRESH_MS,
} from '../../services/publicDeals'
import './TopBar.css'

const ROTATION_INTERVAL_MS = 5000

export default function TopBar() {
  const [promotions, setPromotions] = useState([])
  const [promotionIndex, setPromotionIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    const loadPromotions = async (force = false) => {
      try {
        const result = await getPublicDeals({ force })
        if (!cancelled) setPromotions(result)
      } catch {
        if (!cancelled) setPromotions([])
      }
    }

    loadPromotions()
    const refreshTimer = window.setInterval(
      () => loadPromotions(true),
      PUBLIC_DEALS_REFRESH_MS,
    )

    return () => {
      cancelled = true
      window.clearInterval(refreshTimer)
    }
  }, [])

  useEffect(() => {
    setPromotionIndex(0)

    if (promotions.length <= 1) return undefined

    const rotationTimer = window.setInterval(() => {
      setPromotionIndex(current => (current + 1) % promotions.length)
    }, ROTATION_INTERVAL_MS)

    return () => window.clearInterval(rotationTimer)
  }, [promotions.length])

  const socialLinks = [
    {
      icon: <FaFacebookF />,
      url: 'https://facebook.com/navsainternational',
      label: 'Facebook',
    },
    {
      icon: <FaInstagram />,
      url: 'https://instagram.com/navsainternational',
      label: 'Instagram',
    },
    {
      icon: <FaXTwitter />,
      url: 'https://x.com/navsaintl',
      label: 'X',
    },
    {
      icon: <FaLinkedinIn />,
      url: 'https://linkedin.com/company/navsa-international-limited',
      label: 'LinkedIn',
    },
  ]

  const activePromotion = promotions[promotionIndex] || null
  const promotionText = activePromotion
    ? getPromotionDisplayText(activePromotion)
    : 'NAVSA INTERNATIONAL'

  return (
    <div className="top-bar">
      <div className="top-bar__inner">
        <div className="top-bar__socials">
          {socialLinks.map(item => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className={`top-bar__social-icon top-bar__social-icon--${item.label.toLowerCase()}`}
            >
              {item.icon}
            </a>
          ))}
        </div>

        {activePromotion ? (
          <a
            key={activePromotion.id || promotionIndex}
            href={activePromotion.file_url}
            target="_blank"
            rel="noreferrer"
            className="top-bar__promotion"
            title={`Open ${activePromotion.title}`}
            aria-live="polite"
          >
            {promotionText}
          </a>
        ) : (
          <span
            className="top-bar__promotion top-bar__promotion--static"
            aria-live="polite"
          >
            {promotionText}
          </span>
        )}

        <div className="top-bar__contact">
          <a href="tel:+441908909160">
            <FaPhoneAlt />
            <span>+44 (0) 1908 909160</span>
          </a>

          <a href="mailto:sales@navsainternational.com">
            <FaEnvelope />
            <span>sales@navsainternational.com</span>
          </a>
        </div>
      </div>
    </div>
  )
}