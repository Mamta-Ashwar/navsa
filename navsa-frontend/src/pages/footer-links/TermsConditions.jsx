import { useEffect, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaArrowRight,
  FaEnvelope,
  FaFileContract,
} from 'react-icons/fa'
import './TermsConditions.css'

const pageLinks = [
  ['terms-and-conditions', 'Terms & Conditions'],
  ['terms-of-use', 'Terms of Use'],
  ['contact-us', 'Contact us'],
]

function LegalSection({ id, number, title, children }) {
  return (
    <section id={id} className="terms-section terms-section--legal">
      <div className="terms-section__number">{number}</div>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </section>
  )
}

function TermsConditions() {
  const location = useLocation()

  useLayoutEffect(() => {
    if (location.hash) {
      return
    }

    const root = document.documentElement
    const body = document.body
    const previousRootBehaviour = root.style.scrollBehavior
    const previousBodyBehaviour = body.style.scrollBehavior

    root.style.scrollBehavior = 'auto'
    body.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)

    root.style.scrollBehavior = previousRootBehaviour
    body.style.scrollBehavior = previousBodyBehaviour
  }, [location.key, location.hash])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Terms & Conditions | NAVSA International'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="terms-page">
      <section className="terms-hero">
        <div className="terms-hero__shape terms-hero__shape--one" />
        <div className="terms-hero__shape terms-hero__shape--two" />

        <div className="terms-container terms-hero__inner">
          <nav className="terms-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Terms &amp; Conditions</span>
          </nav>

          <div className="terms-hero__content">
            <div>
              <span className="terms-eyebrow">
                <FaFileContract />
                Website, Business &amp; Trade Terms
              </span>

              <h1>Terms &amp; Conditions</h1>

            </div>

            <div className="terms-hero__meta" aria-label="Company information">
              <span>Operated by</span>
              <strong>NAVSA International Limited</strong>
              <small>Company No. 13041212</small>
            </div>
          </div>
        </div>
      </section>

      <section
        className="terms-quick-access"
        aria-label="Terms and conditions page navigation"
      >
        <div className="terms-container terms-quick-access__grid">
          <div className="terms-nav-card">
            <span className="terms-nav-card__label">On this page</span>

            <nav aria-label="Terms and conditions contents">
              {pageLinks.map(([id, label], index) => (
                <a key={id} href={`#${id}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="terms-help-card">
            <FaEnvelope />
            <div>
              <span>Questions about these terms?</span>
              <a href="mailto:sales@navsainternational.com">
                sales@navsainternational.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="terms-container terms-layout">
        <article className="terms-document">
          <section
            id="terms-and-conditions"
            className="terms-document-group"
          >
            <div className="terms-group-heading">
              <h2>TERMS &amp; CONDITIONS</h2>
              <p>
                By using our website or submitting an enquiry, you agree to the
                following terms.
              </p>
            </div>

            <LegalSection
              id="business-use-only"
              number="01"
              title="Business Use Only"
            >
              <p>
                Our website and services are intended exclusively for business
                customers. By submitting an enquiry, you confirm that you are
                acting on behalf of a business and not as a consumer.
              </p>
            </LegalSection>

            <LegalSection
              id="quotations"
              number="02"
              title="Quotations"
            >
              <p>
                All quotations are subject to product availability and price
                changes. The company reserves the right to amend or withdraw any
                offer prior to order confirmation.
              </p>
            </LegalSection>

            <LegalSection
              id="product-information"
              number="03"
              title="Product Information"
            >
              <p>
                We make every effort to ensure that all product information,
                descriptions, and images are accurate and up to date. However,
                some images or descriptions may be indicative only. Customers
                must confirm all final product details at the time of order
                placement.
              </p>
            </LegalSection>

            <LegalSection
              id="enquiry-submissions"
              number="04"
              title="Enquiry Submissions"
            >
              <p>
                By submitting your contact details or product lists, you grant
                us permission to contact you regarding your enquiry. All personal
                data will be handled in accordance with our Privacy Policy.
              </p>
            </LegalSection>

            <LegalSection
              id="inspection-of-goods"
              number="05"
              title="Inspection of Goods"
            >
              <p>
                Customers must inspect all goods prior to leaving the warehouse.
                Any shortages or discrepancies cannot be rectified once goods
                have departed.
              </p>
            </LegalSection>

            <LegalSection
              id="price-maintenance"
              number="06"
              title="Price Maintenance"
            >
              <p>
                All price-maintained goods are strictly subject to retail price
                maintenance and must be sold in accordance with the applicable
                maintained pricing.
              </p>
            </LegalSection>

            <LegalSection
              id="claims-and-payments"
              number="07"
              title="Claims and Payments"
            >
              <p>
                In the event of a claim by the customer against the company, the
                customer shall not withhold or delay payment for any goods
                ordered. If the company is found liable, a credit will be issued
                once liability has been confirmed.
              </p>
            </LegalSection>

            <LegalSection
              id="retention-of-title"
              number="08"
              title="Retention of Title"
            >
              <p>
                Until full payment for all goods under all contracts between the
                parties has been received in full:
              </p>

              <ol className="terms-roman-list" type="i">
                <li>
                  The goods remain the property of the company, though all risk
                  and responsibility for them passes to the purchaser upon
                  delivery.
                </li>
                <li>
                  The purchaser may sell the goods in the ordinary course of
                  business but must hold and pursue any claims for the proceeds
                  of such sale, equal to the price of the goods, on behalf of the
                  company.
                </li>
              </ol>
            </LegalSection>

            <LegalSection
              id="restocking-fee"
              number="09"
              title="Restocking Fee"
            >
              <p>
                The company reserves the right to charge a restocking fee of no
                less than £50.00 per pallet for any order that is cancelled or
                refused after completion.
              </p>
            </LegalSection>

            <LegalSection
              id="terms-intellectual-property"
              number="10"
              title="Intellectual Property"
            >
              <p>
                All content on this website — including images, text, branding,
                and other materials — is the exclusive property of Navsa
                International Limited and may not be used, copied, or reproduced
                in any form without prior written consent.
              </p>
            </LegalSection>
          </section>

          <section
            id="terms-of-use"
            className="terms-document-group"
          >
            <div className="terms-group-heading terms-group-heading--blue">
              <h2>TERMS OF USE</h2>
              <p>
                These Terms of Use, together with our Privacy Policy and Terms
                and Conditions of Sale, set out the terms on which you may access
                and use our website, www.navsainternational.co.uk, whether as a
                guest or registered user. Use of the site includes accessing,
                browsing, or registering to use it.
              </p>
              <p>
                By using our website, you confirm that you accept these Terms of
                Use and agree to comply with them. If you do not agree, you must
                not use the site.
              </p>
            </div>

            <LegalSection
              id="information-about-us"
              number="01"
              title="Information About Us"
            >
              <p>
                www.navsainternational.co.uk is operated by Navsa International
                Limited, registered in England and Wales under company number
                13041212. Our registered office is at 18 Regus House, Fairbourne
                Drive, Milton Keynes, MK10 9RG.
              </p>
            </LegalSection>

            <LegalSection
              id="changes-to-terms"
              number="02"
              title="Changes to These Terms and Our Site"
            >
              <p>
                We may revise these Terms of Use at any time by amending this
                page. You should check this page regularly, as any changes are
                legally binding. We may update or change our site or its content
                at any time without notice.
              </p>
            </LegalSection>

            <LegalSection
              id="accessing-our-site"
              number="03"
              title="Accessing Our Site"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>3.1.</strong> Our site is made available free of
                  charge. You are responsible for all arrangements necessary to
                  access it.
                </p>
                <p>
                  <strong>3.2.</strong> We do not guarantee uninterrupted or
                  error-free access and may suspend, withdraw, or modify access
                  without notice. We accept no liability for the site being
                  unavailable at any time.
                </p>
                <p>
                  <strong>3.3.</strong> You are responsible for ensuring that
                  anyone accessing the site through your connection is aware of
                  and complies with these Terms of Use.
                </p>
                <p>
                  <strong>3.4.</strong> The site is directed to businesses in
                  the United Kingdom. Access from outside the UK is at your own
                  risk.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="account-and-password"
              number="04"
              title="Your Account and Password"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>4.1.</strong> Any account number, password, or security
                  information must be treated as strictly confidential and not
                  disclosed to any third party.
                </p>
                <p>
                  <strong>4.2.</strong> We reserve the right to disable any
                  account or password if we believe you have failed to comply
                  with these terms.
                </p>
                <p>
                  <strong>4.3.</strong> If you suspect your account credentials
                  have been compromised, you must contact us immediately to reset
                  your password.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="terms-use-intellectual-property"
              number="05"
              title="Intellectual Property Rights"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>5.1.</strong> We are the owner or licensee of all
                  intellectual property rights in the site and its content.
                </p>
                <p>
                  <strong>5.2.</strong> You must not modify or reproduce any
                  materials you have printed or downloaded from the site, nor use
                  any graphics or media separately from accompanying text.
                </p>
                <p>
                  <strong>5.3.</strong> You must not use any part of the site’s
                  content for commercial purposes other than purchasing our
                  products or services.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="acceptable-use"
              number="06"
              title="Acceptable Use"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>6.1.</strong> Access to product listings and prices is
                  restricted to registered customers only and must remain
                  confidential. Disclosure to any third party is prohibited.
                </p>
                <p>
                  <strong>6.2.</strong> You must not use the site:
                </p>

                <div className="terms-subclauses">
                  <p>
                    <strong>6.2.1.</strong> In violation of any applicable law or
                    regulation;
                  </p>
                  <p>
                    <strong>6.2.2.</strong> For any unlawful, fraudulent, or
                    harmful purpose;
                  </p>
                  <p>
                    <strong>6.2.3.</strong> To transmit or upload any viruses or
                    malicious code;
                  </p>
                  <p>
                    <strong>6.2.4.</strong> To copy, reproduce, or sell any part
                    of the site or use automated tools such as data mining or
                    scraping;
                  </p>
                  <p>
                    <strong>6.2.5.</strong> To gain unauthorised access to or
                    disrupt any part of the site or its systems.
                  </p>
                </div>

                <p>
                  <strong>6.3.</strong> Any breach of these terms may result in
                  immediate withdrawal of your access and further action as
                  deemed appropriate.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="no-reliance"
              number="07"
              title="No Reliance on Information"
            >
              <p>
                We make reasonable efforts to update the information on the site
                but make no warranties or representations that it is accurate,
                complete, or current.
              </p>
            </LegalSection>

            <LegalSection
              id="limitation-of-liability"
              number="08"
              title="Limitation of Liability"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>8.1.</strong> Nothing in these terms limits our
                  liability for death or personal injury caused by negligence,
                  fraud, or any liability that cannot be excluded by law.
                </p>
                <p>
                  <strong>8.2.</strong> To the extent permitted by law, we
                  exclude all implied conditions and warranties and will not be
                  liable for any loss or damage arising from use or inability to
                  use the site.
                </p>
                <p>
                  <strong>8.3.</strong> We accept no responsibility for any loss
                  or damage caused by viruses or other harmful material arising
                  from use of the site or linked websites.
                </p>
                <p>
                  <strong>8.4.</strong> We are not responsible for the content of
                  external websites and accept no liability for any resulting
                  loss or damage.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="uploading-content"
              number="09"
              title="Uploading Content or Posting"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>9.1.</strong> Any content uploaded or posted to the
                  site must comply with these Terms of Use. You warrant that it
                  meets these requirements and accept responsibility for any
                  breach.
                </p>
                <p>
                  <strong>9.2.</strong> We reserve the right to remove any
                  content that fails to comply with these terms.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="viruses"
              number="10"
              title="Viruses"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>10.1.</strong> We do not guarantee that the site will
                  be secure or free from bugs or viruses.
                </p>
                <p>
                  <strong>10.2.</strong> You are responsible for using reliable
                  virus protection software.
                </p>
                <p>
                  <strong>10.3.</strong> Misuse of the site by introducing
                  viruses, trojans, or unauthorised access is strictly prohibited
                  and constitutes a criminal offence under the Computer Misuse
                  Act 1990. Breaches will be reported to law enforcement, and
                  your right to use the site will end immediately.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="links"
              number="11"
              title="Links"
            >
              <div className="terms-numbered-clauses">
                <p>
                  <strong>11.1.</strong> You must not link to our website without
                  prior written consent.
                </p>
                <p>
                  <strong>11.2.</strong> Any third-party links on the site are
                  provided for information only. We accept no responsibility for
                  their content or operation.
                </p>
              </div>
            </LegalSection>

            <LegalSection
              id="applicable-law"
              number="12"
              title="Applicable Law"
            >
              <p>
                These Terms of Use are governed by and construed in accordance
                with English law, and both parties submit to the exclusive
                jurisdiction of the courts of England and Wales.
              </p>
            </LegalSection>

            <LegalSection
              id="terms-contact"
              number="13"
              title="Contact Us"
            >
              <p>
                To contact us, please use the details provided on the Contact
                page of our website.
              </p>
            </LegalSection>
          </section>

          <section
            id="contact-us"
            className="terms-document-group"
          >
            <div className="terms-group-heading terms-group-heading--contact">
              <span>Contact NAVSA</span>
              <h2>QUESTIONS OR ASSISTANCE</h2>
              <p>
                Questions about the website, your trade account, an enquiry or
                an order can be sent to the NAVSA team.
              </p>
            </div>

            <div className="terms-contact-card terms-contact-card--standalone">
              <div>
                <span>Email</span>
                <a href="mailto:sales@navsainternational.com">
                  sales@navsainternational.com
                </a>
              </div>

              <div>
                <span>Telephone</span>
                <a href="tel:+441908909160">+44 (0) 1908 909160</a>
              </div>

              <div>
                <span>Address</span>
                <p>
                  Unit 18, Regus House, Fairbourne Drive, Milton Keynes,
                  MK10 9RG, United Kingdom
                </p>
              </div>
            </div>
          </section>

          <div className="terms-document__footer">
            <div>
              <strong>Need further assistance?</strong>
              <span>
                Our team is available to help with trade-account and order
                enquiries.
              </span>
            </div>

            <Link to="/contact">
              Contact NAVSA
              <FaArrowRight />
            </Link>
          </div>
        </article>
      </div>
    </main>
  )
}

export default TermsConditions