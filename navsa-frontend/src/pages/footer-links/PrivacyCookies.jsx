// import { useEffect, useLayoutEffect } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import {
//   FaBuilding,
//   FaCookieBite,
//   FaDatabase,
//   FaEnvelope,
//   FaFileShield,
//   FaLock,
//   FaUserShield,
// } from 'react-icons/fa6'
// import './PrivacyCookies.css'

// const pageLinks = [
//   ['policy-contact', 'Policy & Contact'],
//   ['information-collected', 'Information We Collect'],
//   ['other-sources', 'Other Sources'],
//   ['cookies', 'Cookies'],
//   ['information-use', 'How We Use Information'],
//   ['information-disclosure', 'Disclosure'],
//   ['data-storage', 'Data Storage'],
//   ['your-rights', 'Your Rights'],
//   ['policy-updates', 'Policy Updates'],
// ]

// function PolicySection({ id, number, title, icon, children }) {
//   return (
//     <section id={id} className="privacy-section">
//       <div className="privacy-section__number">{number}</div>

//       <div className="privacy-section__content">
//         <div className="privacy-section__heading">
//           <span className="privacy-section__icon" aria-hidden="true">
//             {icon}
//           </span>
//           <h2>{title}</h2>
//         </div>

//         {children}
//       </div>
//     </section>
//   )
// }

// function PrivacyCookies() {
//   const location = useLocation()

//   useLayoutEffect(() => {
//     if (location.hash) {
//       return
//     }

//     const root = document.documentElement
//     const body = document.body
//     const previousRootBehaviour = root.style.scrollBehavior
//     const previousBodyBehaviour = body.style.scrollBehavior

//     root.style.scrollBehavior = 'auto'
//     body.style.scrollBehavior = 'auto'
//     window.scrollTo(0, 0)

//     root.style.scrollBehavior = previousRootBehaviour
//     body.style.scrollBehavior = previousBodyBehaviour
//   }, [location.key, location.hash])

//   useEffect(() => {
//     const previousTitle = document.title
//     document.title = 'Privacy & Cookies | NAVSA International'

//     return () => {
//       document.title = previousTitle
//     }
//   }, [])

//   return (
//     <main className="privacy-page">
//       <section className="privacy-hero">
//         <div className="privacy-hero__shape privacy-hero__shape--one" />
//         <div className="privacy-hero__shape privacy-hero__shape--two" />

//         <div className="privacy-container privacy-hero__inner">
//           <nav className="privacy-breadcrumb" aria-label="Breadcrumb">
//             <Link to="/">Home</Link>
//             <span>/</span>
//             <span>Privacy &amp; Cookies</span>
//           </nav>

//           <div className="privacy-hero__content">
//             <div>
//               <span className="privacy-eyebrow">
//                 <FaFileShield />
//                 Data Protection &amp; Cookies
//               </span>

//               <h1>Privacy Policy</h1>
//             </div>

//             <div className="privacy-hero__meta">
//               <span>Data Controller</span>
//               <strong>NAVSA International Limited</strong>
//               <small>Company No. 13041212</small>
//             </div>
//           </div>

//           <div className="privacy-introduction">
//             <p>
//               Navsa International Limited (“NAVSA”, “we”, “us”, or “our”)
//               collects and uses personal data about our past, present, and
//               prospective customers to conduct business operations effectively
//               and to meet customer requirements.
//             </p>

//             <p>
//               We recognise that the lawful and responsible handling of personal
//               information is essential to our success and to maintaining your
//               trust. This Privacy Policy, together with our Terms of Use,
//               explains how we collect, store, and use your personal information
//               and outlines your rights in relation to it.
//             </p>

//             <p>
//               By using our website or providing your personal data, you consent
//               to the practices described in this policy.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section
//         className="privacy-quick-access"
//         aria-label="Privacy policy page navigation"
//       >
//         <div className="privacy-container privacy-quick-access__grid">
//           <div className="privacy-nav-card">
//             <span className="privacy-nav-card__label">On this page</span>

//             <nav aria-label="Privacy policy contents">
//               {pageLinks.map(([id, label], index) => (
//                 <a key={id} href={`#${id}`}>
//                   <span>{String(index + 1).padStart(2, '0')}</span>
//                   {label}
//                 </a>
//               ))}
//             </nav>
//           </div>

//           <div className="privacy-help-card">
//             <FaEnvelope />
//             <div>
//               <span>Privacy or data protection enquiries</span>
//               <a href="mailto:info@navsainternational.com">
//                 info@navsainternational.com
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="privacy-container privacy-layout">
//         <article className="privacy-document">
//           <PolicySection
//             id="policy-contact"
//             number="01"
//             title="Our Policy and Contact Information"
//             icon={<FaUserShield />}
//           >
//             <div className="privacy-numbered-clauses">
//               <p>
//                 <strong>1.1.</strong> Any personal data we collect, store, or
//                 process — whether electronically or in physical form — will be
//                 managed with appropriate safeguards to ensure compliance with
//                 applicable data protection laws, including the UK General Data
//                 Protection Regulation (UK GDPR), the Data Protection Act 2018,
//                 and the Privacy and Electronic Communications Regulations 2003.
//               </p>

//               <div>
//                 <p>
//                   <strong>1.2.</strong> NAVSA fully endorses the principles of
//                   data protection, which require that personal data must be:
//                 </p>

//                 <ul>
//                   <li>Processed lawfully, fairly, and transparently</li>
//                   <li>
//                     Collected for specific and legitimate purposes and not
//                     processed in ways incompatible with those purposes
//                   </li>
//                   <li>Adequate, relevant, and limited to what is necessary</li>
//                   <li>Accurate and kept up to date</li>
//                   <li>Retained only for as long as necessary</li>
//                   <li>
//                     Processed in a way that upholds individuals’ rights
//                   </li>
//                   <li>Kept secure</li>
//                   <li>
//                     Not transferred outside the UK or EEA without appropriate
//                     safeguards
//                   </li>
//                 </ul>
//               </div>

//               <p>
//                 <strong>1.3.</strong> We collect and process personal data
//                 solely to maintain and manage our business relationships with
//                 customers, suppliers, and partners.
//               </p>

//               <p>
//                 <strong>1.4.</strong> Navsa International Limited (company
//                 number 13041212) is the Data Controller responsible for your
//                 personal information. Our registered office is:
//                 <br />
//                 18 Regus House, Fairbourne Drive, Milton Keynes, MK10 9RG,
//                 United Kingdom.
//               </p>

//               <p>
//                 <strong>1.5.</strong> For privacy or data protection enquiries,
//                 please contact our Data Protection Officer by email at{' '}
//                 <a href="mailto:info@navsainternational.com">
//                   info@navsainternational.com
//                 </a>
//                 , or by post at the above address.
//               </p>

//               <div>
//                 <p>
//                   <strong>1.6.</strong> To meet our data protection obligations,
//                   we will:
//                 </p>

//                 <ul>
//                   <li>Collect and use personal data fairly and lawfully</li>
//                   <li>Specify the purpose for which personal data is used</li>
//                   <li>
//                     Collect only the data required for operational or legal
//                     purposes
//                   </li>
//                   <li>Keep data accurate and up to date</li>
//                   <li>Review how long data is retained</li>
//                   <li>
//                     Ensure that individuals can exercise their legal rights
//                     regarding their data
//                   </li>
//                   <li>
//                     Maintain robust security to prevent unauthorised access or
//                     loss
//                   </li>
//                   <li>
//                     Prevent the transfer of data to any country without adequate
//                     protection measures
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </PolicySection>

//           <PolicySection
//             id="information-collected"
//             number="02"
//             title="Information We May Collect from You"
//             icon={<FaDatabase />}
//           >
//             <div className="privacy-numbered-clauses">
//               <div>
//                 <h3>2.1. Information You Provide:</h3>
//                 <p>
//                   When you register as a customer, submit an enquiry, complete
//                   forms on our website (www.navsainternational.co.uk), or contact
//                   us by phone or email, we may collect personal data such as:
//                 </p>

//                 <ul>
//                   <li>
//                     Name, age, and contact details (address, email, telephone
//                     numbers)
//                   </li>
//                   <li>
//                     Business information (company name, position, partners, or
//                     directors)
//                   </li>
//                   <li>
//                     Payment details, bank information, and credit card details
//                   </li>
//                   <li>
//                     Login credentials, customer numbers, or passwords
//                   </li>
//                 </ul>

//                 <p>
//                   You must ensure you have permission to share the personal data
//                   of any third party you provide to us.
//                 </p>
//               </div>

//               <div>
//                 <h3>2.2. Information We Collect Automatically:</h3>
//                 <p>
//                   When you visit our website, we may collect technical
//                   information, including:
//                 </p>

//                 <ul>
//                   <li>
//                     IP address, browser type, operating system, and device
//                     details
//                   </li>
//                   <li>Login activity, products viewed, and site interactions</li>
//                   <li>
//                     Visit duration, page response times, and error information
//                   </li>
//                   <li>
//                     Geo-location data identifying your location within the UK
//                   </li>
//                 </ul>

//                 <p>
//                   We may also collect CCTV footage at our premises for safety and
//                   security purposes.
//                 </p>
//               </div>

//               <div>
//                 <h3>2.3. Sensitive Data:</h3>
//                 <p>
//                   If we collect any special category data (e.g., health,
//                   ethnicity, or criminal history), we will ensure we have your
//                   explicit consent before collecting, using, or storing it.
//                 </p>
//               </div>
//             </div>
//           </PolicySection>

//           <PolicySection
//             id="other-sources"
//             number="03"
//             title="Information from Other Sources"
//             icon={<FaBuilding />}
//           >
//             <p>We may receive information about you from:</p>

//             <ul>
//               <li>Other NAVSA group companies</li>
//               <li>
//                 Service providers such as payment processors, logistics
//                 partners, analytics providers, and credit reference agencies
//               </li>
//               <li>Publicly available or industry databases</li>
//             </ul>
//           </PolicySection>

//           <PolicySection
//             id="cookies"
//             number="04"
//             title="Cookies"
//             icon={<FaCookieBite />}
//           >
//             <p>
//               Our website uses cookies to distinguish you from other users and
//               to enhance your browsing experience. Cookies help us analyse site
//               usage and improve functionality. For details, please refer to our
//               Cookie Policy.
//             </p>
//           </PolicySection>

//           <PolicySection
//             id="information-use"
//             number="05"
//             title="How We Use Your Information"
//             icon={<FaUserShield />}
//           >
//             <div className="privacy-numbered-clauses">
//               <div>
//                 <p>
//                   <strong>5.1.</strong> We may use your data to:
//                 </p>

//                 <ul>
//                   <li>
//                     Process orders, deliver goods, and manage your trading
//                     account
//                   </li>
//                   <li>
//                     Fulfil contractual obligations and maintain accurate
//                     customer records
//                   </li>
//                   <li>
//                     Communicate updates, offers, or information related to
//                     similar products or services
//                   </li>
//                   <li>
//                     Enhance customer experience through analytics and service
//                     improvements
//                   </li>
//                   <li>
//                     Ensure the safety and security of our premises and website
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h3>5.2. Fraud and Security:</h3>
//                 <p>
//                   If false or inaccurate information is provided and fraud is
//                   suspected, we may record this and share details with fraud
//                   prevention and law enforcement agencies. Information may also
//                   be used to prevent theft, fraud, or money laundering.
//                 </p>
//               </div>

//               <div>
//                 <h3>5.3. Marketing:</h3>
//                 <p>
//                   We operate a responsible marketing policy. We do not sell or
//                   share customer details with third parties without consent. We
//                   may anonymise and share non-identifiable data with suppliers
//                   for market analysis.
//                 </p>
//               </div>

//               <div>
//                 <h3>5.4. Automated Sales Analysis:</h3>
//                 <p>
//                   Where you place electronic orders (e.g., via EPOS), we may
//                   analyse anonymised sales data to assess product performance
//                   and improve service delivery.
//                 </p>
//               </div>

//               <p>
//                 <strong>5.5.</strong> If you do not wish to receive marketing
//                 communications, please contact our Data Protection Officer at{' '}
//                 <a href="mailto:info@navsainternational.com">
//                   info@navsainternational.com
//                 </a>{' '}
//                 or write to us at the address above.
//               </p>
//             </div>
//           </PolicySection>

//           <PolicySection
//             id="information-disclosure"
//             number="06"
//             title="Disclosure of Your Information"
//             icon={<FaUserShield />}
//           >
//             <p>We may share your information with:</p>

//             <ul>
//               <li>
//                 NAVSA group companies, subsidiaries, or holding companies (as
//                 defined in Section 1159 of the UK Companies Act 2006)
//               </li>
//               <li>
//                 Trusted third parties who assist in fulfilling orders,
//                 delivering goods, processing payments, or maintaining our IT
//                 systems
//               </li>
//               <li>
//                 Credit reference agencies, analytics providers, or fraud
//                 prevention organisations
//               </li>
//             </ul>

//             <p>
//               We may also disclose your data where required by law, or in the
//               event of a business sale, merger, or acquisition.
//             </p>
//           </PolicySection>

//           <PolicySection
//             id="data-storage"
//             number="07"
//             title="Where We Store Your Data"
//             icon={<FaLock />}
//           >
//             <div className="privacy-numbered-clauses">
//               <p>
//                 <strong>7.1.</strong> Your data may be transferred to and stored
//                 outside the UK or European Economic Area (EEA). When this occurs,
//                 we ensure that adequate protection measures are in place in
//                 compliance with UK data protection law.
//               </p>

//               <p>
//                 <strong>7.2.</strong> All data is stored securely. Payment
//                 transactions are encrypted using SSL technology.
//                 <br />
//                 You are responsible for maintaining the confidentiality of your
//                 login credentials and passwords.
//               </p>
//             </div>
//           </PolicySection>

//           <PolicySection
//             id="your-rights"
//             number="08"
//             title="Your Rights and Access to Information"
//             icon={<FaFileShield />}
//           >
//             <p>Under data protection law, you have the right to:</p>

//             <ul>
//               <li>Access the personal data we hold about you</li>
//               <li>
//                 Request correction of inaccurate or incomplete information
//               </li>
//               <li>
//                 Request deletion of your data where legally applicable
//               </li>
//               <li>
//                 Object to processing for direct marketing or legitimate
//                 interest purposes
//               </li>
//               <li>Request data portability where applicable</li>
//             </ul>

//             <p>
//               To exercise these rights, please contact our Data Protection
//               Officer at{' '}
//               <a href="mailto:info@navsainternational.com">
//                 info@navsainternational.com
//               </a>{' '}
//               or in writing at our registered address.
//             </p>
//           </PolicySection>

//           <PolicySection
//             id="policy-updates"
//             number="09"
//             title="Updates to This Policy"
//             icon={<FaFileShield />}
//           >
//             <p>
//               We may update this Privacy Policy from time to time to reflect
//               legal or business changes. The latest version will always be
//               available on our website. Continued use of our services following
//               an update constitutes acceptance of the revised policy.
//             </p>

//             <div className="privacy-company-card">
//               <strong>Navsa International Limited</strong>
//               <span>
//                 Registered in England and Wales (Company No. 13041212)
//               </span>
//               <span>
//                 Registered Office: 18 Regus House, Fairbourne Drive, Milton
//                 Keynes, MK10 9RG, United Kingdom
//               </span>
//             </div>
//           </PolicySection>
//         </article>
//       </div>
//     </main>
//   )
// }

// export default PrivacyCookies

import { useEffect, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaBuilding,
  FaCookieBite,
  FaDatabase,
  FaEnvelope,
  FaFileShield,
  FaLock,
  FaUserShield,
} from 'react-icons/fa6'
import './PrivacyCookies.css'

const pageLinks = [
  ['policy-contact', 'Policy & Contact'],
  ['information-collected', 'Information We Collect'],
  ['other-sources', 'Other Sources'],
  ['cookies', 'Cookies'],
  ['information-use', 'How We Use Information'],
  ['information-disclosure', 'Disclosure'],
  ['data-storage', 'Data Storage'],
  ['your-rights', 'Your Rights'],
  ['policy-updates', 'Policy Updates'],
]

function PolicySection({ id, number, title, icon, children }) {
  return (
    <section id={id} className="privacy-section">
      <div className="privacy-section__number">{number}</div>

      <div className="privacy-section__content">
        <div className="privacy-section__heading">
          <span className="privacy-section__icon" aria-hidden="true">
            {icon}
          </span>
          <h2>{title}</h2>
        </div>

        {children}
      </div>
    </section>
  )
}

function PrivacyCookies() {
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
    document.title = 'Privacy & Cookies | NAVSA International'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-hero__shape privacy-hero__shape--one" />
        <div className="privacy-hero__shape privacy-hero__shape--two" />

        <div className="privacy-container privacy-hero__inner">
          <nav className="privacy-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Privacy &amp; Cookies</span>
          </nav>

          <div className="privacy-hero__content">
            <div>
              <span className="privacy-eyebrow">
                <FaFileShield />
                Data Protection &amp; Cookies
              </span>

              <h1>Privacy Policy</h1>
            </div>

          </div>

          <div className="privacy-introduction">
            <p>
              Navsa International Limited (“NAVSA”, “we”, “us”, or “our”)
              collects and uses personal data about our past, present, and
              prospective customers to conduct business operations effectively
              and to meet customer requirements.
            </p>

            <p>
              We recognise that the lawful and responsible handling of personal
              information is essential to our success and to maintaining your
              trust. This Privacy Policy, together with our Terms of Use,
              explains how we collect, store, and use your personal information
              and outlines your rights in relation to it.
            </p>

            <p>
              By using our website or providing your personal data, you consent
              to the practices described in this policy.
            </p>
          </div>
        </div>
      </section>

      <section
        className="privacy-quick-access"
        aria-label="Privacy policy page navigation"
      >
        <div className="privacy-container privacy-quick-access__grid">
          <div className="privacy-nav-card">
            <span className="privacy-nav-card__label">On this page</span>

            <nav aria-label="Privacy policy contents">
              {pageLinks.map(([id, label], index) => (
                <a key={id} href={`#${id}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="privacy-help-card">
            <FaEnvelope />
            <div>
              <span>Privacy or data protection enquiries</span>
              <a href="mailto:info@navsainternational.com">
                info@navsainternational.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="privacy-container privacy-layout">
        <article className="privacy-document">
          <PolicySection
            id="policy-contact"
            number="01"
            title="Our Policy and Contact Information"
            icon={<FaUserShield />}
          >
            <div className="privacy-numbered-clauses">
              <p>
                <strong>1.1.</strong> Any personal data we collect, store, or
                process — whether electronically or in physical form — will be
                managed with appropriate safeguards to ensure compliance with
                applicable data protection laws, including the UK General Data
                Protection Regulation (UK GDPR), the Data Protection Act 2018,
                and the Privacy and Electronic Communications Regulations 2003.
              </p>

              <div>
                <p>
                  <strong>1.2.</strong> NAVSA fully endorses the principles of
                  data protection, which require that personal data must be:
                </p>

                <ul>
                  <li>Processed lawfully, fairly, and transparently</li>
                  <li>
                    Collected for specific and legitimate purposes and not
                    processed in ways incompatible with those purposes
                  </li>
                  <li>Adequate, relevant, and limited to what is necessary</li>
                  <li>Accurate and kept up to date</li>
                  <li>Retained only for as long as necessary</li>
                  <li>
                    Processed in a way that upholds individuals’ rights
                  </li>
                  <li>Kept secure</li>
                  <li>
                    Not transferred outside the UK or EEA without appropriate
                    safeguards
                  </li>
                </ul>
              </div>

              <p>
                <strong>1.3.</strong> We collect and process personal data
                solely to maintain and manage our business relationships with
                customers, suppliers, and partners.
              </p>

              <p>
                <strong>1.4.</strong> Navsa International Limited (company
                number 13041212) is the Data Controller responsible for your
                personal information. Our registered office is:
                <br />
                18 Regus House, Fairbourne Drive, Milton Keynes, MK10 9RG,
                United Kingdom.
              </p>

              <p>
                <strong>1.5.</strong> For privacy or data protection enquiries,
                please contact our Data Protection Officer by email at{' '}
                <a href="mailto:info@navsainternational.com">
                  info@navsainternational.com
                </a>
                , or by post at the above address.
              </p>

              <div>
                <p>
                  <strong>1.6.</strong> To meet our data protection obligations,
                  we will:
                </p>

                <ul>
                  <li>Collect and use personal data fairly and lawfully</li>
                  <li>Specify the purpose for which personal data is used</li>
                  <li>
                    Collect only the data required for operational or legal
                    purposes
                  </li>
                  <li>Keep data accurate and up to date</li>
                  <li>Review how long data is retained</li>
                  <li>
                    Ensure that individuals can exercise their legal rights
                    regarding their data
                  </li>
                  <li>
                    Maintain robust security to prevent unauthorised access or
                    loss
                  </li>
                  <li>
                    Prevent the transfer of data to any country without adequate
                    protection measures
                  </li>
                </ul>
              </div>
            </div>
          </PolicySection>

          <PolicySection
            id="information-collected"
            number="02"
            title="Information We May Collect from You"
            icon={<FaDatabase />}
          >
            <div className="privacy-numbered-clauses">
              <div>
                <h3>2.1. Information You Provide:</h3>
                <p>
                  When you register as a customer, submit an enquiry, complete
                  forms on our website (www.navsainternational.co.uk), or contact
                  us by phone or email, we may collect personal data such as:
                </p>

                <ul>
                  <li>
                    Name, age, and contact details (address, email, telephone
                    numbers)
                  </li>
                  <li>
                    Business information (company name, position, partners, or
                    directors)
                  </li>
                  <li>
                    Payment details, bank information, and credit card details
                  </li>
                  <li>
                    Login credentials, customer numbers, or passwords
                  </li>
                </ul>

                <p>
                  You must ensure you have permission to share the personal data
                  of any third party you provide to us.
                </p>
              </div>

              <div>
                <h3>2.2. Information We Collect Automatically:</h3>
                <p>
                  When you visit our website, we may collect technical
                  information, including:
                </p>

                <ul>
                  <li>
                    IP address, browser type, operating system, and device
                    details
                  </li>
                  <li>Login activity, products viewed, and site interactions</li>
                  <li>
                    Visit duration, page response times, and error information
                  </li>
                  <li>
                    Geo-location data identifying your location within the UK
                  </li>
                </ul>

                <p>
                  We may also collect CCTV footage at our premises for safety and
                  security purposes.
                </p>
              </div>

              <div>
                <h3>2.3. Sensitive Data:</h3>
                <p>
                  If we collect any special category data (e.g., health,
                  ethnicity, or criminal history), we will ensure we have your
                  explicit consent before collecting, using, or storing it.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection
            id="other-sources"
            number="03"
            title="Information from Other Sources"
            icon={<FaBuilding />}
          >
            <p>We may receive information about you from:</p>

            <ul>
              <li>Other NAVSA group companies</li>
              <li>
                Service providers such as payment processors, logistics
                partners, analytics providers, and credit reference agencies
              </li>
              <li>Publicly available or industry databases</li>
            </ul>
          </PolicySection>

          <PolicySection
            id="cookies"
            number="04"
            title="Cookies"
            icon={<FaCookieBite />}
          >
            <p>
              Our website uses cookies to distinguish you from other users and
              to enhance your browsing experience. Cookies help us analyse site
              usage and improve functionality. For details, please refer to our
              Cookie Policy.
            </p>
          </PolicySection>

          <PolicySection
            id="information-use"
            number="05"
            title="How We Use Your Information"
            icon={<FaUserShield />}
          >
            <div className="privacy-numbered-clauses">
              <div>
                <p>
                  <strong>5.1.</strong> We may use your data to:
                </p>

                <ul>
                  <li>
                    Process orders, deliver goods, and manage your trading
                    account
                  </li>
                  <li>
                    Fulfil contractual obligations and maintain accurate
                    customer records
                  </li>
                  <li>
                    Communicate updates, offers, or information related to
                    similar products or services
                  </li>
                  <li>
                    Enhance customer experience through analytics and service
                    improvements
                  </li>
                  <li>
                    Ensure the safety and security of our premises and website
                  </li>
                </ul>
              </div>

              <div>
                <h3>5.2. Fraud and Security:</h3>
                <p>
                  If false or inaccurate information is provided and fraud is
                  suspected, we may record this and share details with fraud
                  prevention and law enforcement agencies. Information may also
                  be used to prevent theft, fraud, or money laundering.
                </p>
              </div>

              <div>
                <h3>5.3. Marketing:</h3>
                <p>
                  We operate a responsible marketing policy. We do not sell or
                  share customer details with third parties without consent. We
                  may anonymise and share non-identifiable data with suppliers
                  for market analysis.
                </p>
              </div>

              <div>
                <h3>5.4. Automated Sales Analysis:</h3>
                <p>
                  Where you place electronic orders (e.g., via EPOS), we may
                  analyse anonymised sales data to assess product performance
                  and improve service delivery.
                </p>
              </div>

              <p>
                <strong>5.5.</strong> If you do not wish to receive marketing
                communications, please contact our Data Protection Officer at{' '}
                <a href="mailto:info@navsainternational.com">
                  info@navsainternational.com
                </a>{' '}
                or write to us at the address above.
              </p>
            </div>
          </PolicySection>

          <PolicySection
            id="information-disclosure"
            number="06"
            title="Disclosure of Your Information"
            icon={<FaUserShield />}
          >
            <p>We may share your information with:</p>

            <ul>
              <li>
                NAVSA group companies, subsidiaries, or holding companies (as
                defined in Section 1159 of the UK Companies Act 2006)
              </li>
              <li>
                Trusted third parties who assist in fulfilling orders,
                delivering goods, processing payments, or maintaining our IT
                systems
              </li>
              <li>
                Credit reference agencies, analytics providers, or fraud
                prevention organisations
              </li>
            </ul>

            <p>
              We may also disclose your data where required by law, or in the
              event of a business sale, merger, or acquisition.
            </p>
          </PolicySection>

          <PolicySection
            id="data-storage"
            number="07"
            title="Where We Store Your Data"
            icon={<FaLock />}
          >
            <div className="privacy-numbered-clauses">
              <p>
                <strong>7.1.</strong> Your data may be transferred to and stored
                outside the UK or European Economic Area (EEA). When this occurs,
                we ensure that adequate protection measures are in place in
                compliance with UK data protection law.
              </p>

              <p>
                <strong>7.2.</strong> All data is stored securely. Payment
                transactions are encrypted using SSL technology.
                <br />
                You are responsible for maintaining the confidentiality of your
                login credentials and passwords.
              </p>
            </div>
          </PolicySection>

          <PolicySection
            id="your-rights"
            number="08"
            title="Your Rights and Access to Information"
            icon={<FaFileShield />}
          >
            <p>Under data protection law, you have the right to:</p>

            <ul>
              <li>Access the personal data we hold about you</li>
              <li>
                Request correction of inaccurate or incomplete information
              </li>
              <li>
                Request deletion of your data where legally applicable
              </li>
              <li>
                Object to processing for direct marketing or legitimate
                interest purposes
              </li>
              <li>Request data portability where applicable</li>
            </ul>

            <p>
              To exercise these rights, please contact our Data Protection
              Officer at{' '}
              <a href="mailto:info@navsainternational.com">
                info@navsainternational.com
              </a>{' '}
              or in writing at our registered address.
            </p>
          </PolicySection>

          <PolicySection
            id="policy-updates"
            number="09"
            title="Updates to This Policy"
            icon={<FaFileShield />}
          >
            <p>
              We may update this Privacy Policy from time to time to reflect
              legal or business changes. The latest version will always be
              available on our website. Continued use of our services following
              an update constitutes acceptance of the revised policy.
            </p>
          </PolicySection>

          <section
            className="privacy-company-banner"
            aria-label="NAVSA company information"
          >
            <strong>Navsa International Limited</strong>
            <span>
              Registered in England and Wales (Company No. 13041212)
            </span>
            <span>
              Registered Office: 18 Regus House, Fairbourne Drive, Milton
              Keynes, MK10 9RG, United Kingdom
            </span>
          </section>
        </article>
      </div>
    </main>
  )
}

export default PrivacyCookies