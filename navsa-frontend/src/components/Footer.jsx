import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
} from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import {
  getPublicDeals,
  PUBLIC_DEALS_REFRESH_MS,
} from '../services/publicDeals'
import './Footer.css'

const categories = [
  'Chocolates',
  'Groceries',
  'Seasonal',
  'Health & Personal Care',
  'Chilled Items',
  'Confectionery',
  'Crisps & Snacks',
  'Cold & Hot Beverages',
  'Pet Care & Food',
  'Biscuits',
  'Cleaning & Households',
  'Frozen',
  'Baby and Kids',
]

const informationLinks = [
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  { label: 'Privacy & Cookies', to: '/privacy-and-cookies' },
  { label: 'Offers', to: '/offers' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Contact Us', to: '/contact-us' },
]

function Footer() {
  const [promotions, setPromotions] = useState([])
  const [promotionsLoaded, setPromotionsLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadPromotions = async (force = false) => {
      try {
        const result = await getPublicDeals({ force })
        if (!cancelled) setPromotions(result)
      } catch {
        if (!cancelled) setPromotions([])
      } finally {
        if (!cancelled) setPromotionsLoaded(true)
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

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__grid">
          <section className="site-footer__brand">
            <img
              src="/logos/navsa-logo.png"
              alt="NAVSA International"
            />

            <p>
              Wholesale exporter, distributor and consolidator of leading
              British FMCG products.
            </p>

            <address>
              Unit 18, Regus House, Fairbourne Drive<br />
              Milton Keynes, MK10 9RG, United Kingdom
            </address>

            <div className="site-footer__socials">
              <a
                href="https://facebook.com/navsainternational"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="footer-social-icon footer-social-icon--facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://instagram.com/navsainternational"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="footer-social-icon footer-social-icon--instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://x.com/navsaintl"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="footer-social-icon footer-social-icon--x"
              >
                <FaXTwitter />
              </a>

              <a
                href="https://linkedin.com/company/navsa-international-limited"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="footer-social-icon footer-social-icon--linkedin"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </section>

          <section className="site-footer__links">
            <h3>Quick Links</h3>

            {informationLinks.map(link => (
              (
                link.to === '/terms-and-conditions' ||
                link.to === '/privacy-and-cookies' ||
                link.to === '/about-us' ||
                link.to === '/contact-us'
              ) ? (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={(event) => {
                    event.preventDefault()
                    window.location.assign(link.to)
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.to} to={link.to}>
                  {link.label}
                </Link>
              )
            ))}

            <div className="site-footer__account-links">
              <span>Trade Accounts</span>
              <Link to="/account/create">Become a Customer</Link>
              <Link to="/account/supplier">Become a Supplier</Link>
            </div>
          </section>

          <section>
            <h3>Product Categories</h3>

            <div className="site-footer__category-grid">
              {categories.map(category => (
                <Link
                  key={category}
                  to={`/shop?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h3>Contact NAVSA</h3>

            <a href="tel:+441908909160">
              <FaPhoneAlt />
              +44 (0) 1908 909160
            </a>

            <a href="mailto:sales@navsainternational.com">
              <FaEnvelope />
              sales@navsainternational.com
            </a>

            <a
              href="https://wa.me/447544359587"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
              +44 7544 359587
            </a>

            <div className="site-footer__deals">
              <span>Latest Promotions</span>

              {promotions.map((promotion) => (
                <a
                  key={promotion.id || `${promotion.title}-${promotion.file_url}`}
                  href={promotion.file_url}
                  target="_blank"
                  rel="noreferrer"
                  title={`Open ${promotion.title}`}
                >
                  {promotion.title}
                </a>
              ))}

              {promotionsLoaded && promotions.length === 0 && (
                <small className="site-footer__deals-empty">
                  No current promotions
                </small>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>
          © {new Date().getFullYear()} NAVSA INTERNATIONAL LIMITED —
          All Rights Reserved.
        </span>

        <span>
          Companies House No. 13041212 · VAT GB364947456 · EORI 13041212
        </span>
      </div>
    </footer>
  )
}

export default Footer