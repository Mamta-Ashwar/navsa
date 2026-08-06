// import { useEffect, useLayoutEffect } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import {
//   FaArrowRight,
//   FaBoxOpen,
//   FaGlobe,
//   FaHandshake,
//   FaMobileAlt,
//   FaTags,
//   FaTruck,
//   FaUsers,
// } from 'react-icons/fa'
// import './AboutUs.css'

// const brandPartners = [
//   'Cadbury',
//   'Coca-Cola',
//   'Nestlé',
//   'Heinz',
//   'Ferrero',
//   'Unilever',
//   'P&G',
// ]

// const highlights = [
//   {
//     icon: <FaBoxOpen />,
//     title: 'Extensive FMCG Range',
//     text: 'Confectionery, beverages, toiletries, household goods, baby products, cosmetics, and more.',
//   },
//   {
//     icon: <FaTruck />,
//     title: 'Reliable Delivery',
//     text: 'A modern logistics fleet and strong courier partnerships support fast delivery across the UK and worldwide.',
//   },
//   {
//     icon: <FaUsers />,
//     title: 'Professional Service',
//     text: 'A multilingual team provides responsive and professional support throughout the ordering journey.',
//   },
//   {
//     icon: <FaTags />,
//     title: 'Competitive Pricing',
//     text: 'Pricing is continually updated to reflect market trends and support competitive trade purchasing.',
//   },
//   {
//     icon: <FaMobileAlt />,
//     title: 'Simple Online Ordering',
//     text: 'NAVSA’s mobile-friendly platform makes ordering simple and efficient wherever customers are.',
//   },
//   {
//     icon: <FaGlobe />,
//     title: 'UK & Worldwide Supply',
//     text: 'British and international FMCG products are supplied to customers across the UK and global markets.',
//   },
// ]

// function AboutUs() {
//   const location = useLocation()

//   useLayoutEffect(() => {
//     const root = document.documentElement
//     const body = document.body
//     const previousRootBehaviour = root.style.scrollBehavior
//     const previousBodyBehaviour = body.style.scrollBehavior

//     root.style.scrollBehavior = 'auto'
//     body.style.scrollBehavior = 'auto'
//     window.scrollTo(0, 0)

//     root.style.scrollBehavior = previousRootBehaviour
//     body.style.scrollBehavior = previousBodyBehaviour
//   }, [location.key])

//   useEffect(() => {
//     const previousTitle = document.title
//     document.title = 'About Us | NAVSA International'

//     return () => {
//       document.title = previousTitle
//     }
//   }, [])

//   return (
//     <main className="about-page">
//       <section className="about-hero">
//         <div className="about-hero__shape about-hero__shape--one" />
//         <div className="about-hero__shape about-hero__shape--two" />

//         <div className="about-container about-hero__inner">
//           <nav className="about-breadcrumb" aria-label="Breadcrumb">
//             <Link to="/">Home</Link>
//             <span>/</span>
//             <span>About Us</span>
//           </nav>

//           <div className="about-hero__grid">
//             <div className="about-hero__content">
//               <span className="about-eyebrow">
//                 <FaHandshake />
//                 About NAVSA
//               </span>

//               <h1>
//                 Trusted global supply.
//                 <span>British and international brands.</span>
//               </h1>

//               <p>
//                 High-quality FMCG products, dependable logistics and
//                 professional service for trade customers in the UK and
//                 worldwide.
//               </p>

//               <div className="about-hero__actions">
//                 <Link to="/account/create" className="about-button about-button--primary">
//                   Become a Customer
//                   <FaArrowRight />
//                 </Link>

//                 <Link to="/contact" className="about-button about-button--secondary">
//                   Contact NAVSA
//                 </Link>
//               </div>
//             </div>

//             <div className="about-hero__visual" aria-hidden="true">
//               <div className="about-orbit about-orbit--outer" />
//               <div className="about-orbit about-orbit--inner" />

//               <div className="about-hero__logo-card">
//                 <img src="/logos/navsa-logo.png" alt="" />
//               </div>

//               <div className="about-hero__mini-card about-hero__mini-card--uk">
//                 <strong>UK</strong>
//                 <span>British FMCG supply</span>
//               </div>

//               <div className="about-hero__mini-card about-hero__mini-card--global">
//                 <FaGlobe />
//                 <span>Worldwide delivery</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="about-story">
//         <div className="about-container">
//           <div className="about-story__card">
//             <div className="about-story__heading">
//               <span>Who We Are</span>
//               <h2>A trusted global FMCG supplier</h2>
//             </div>

//             <div className="about-story__content">
//               <p>
//                 Navsa is a trusted global supplier of high-quality British and
//                 international FMCG products, offering a wide range of
//                 confectionery, beverages, toiletries, household goods, baby
//                 products, cosmetics, and more. We partner with leading brands
//                 such as Cadbury, Coca-Cola, Nestlé, Heinz, Ferrero, Unilever,
//                 and P&amp;G, ensuring premium quality and consistency. With a
//                 modern logistics fleet and strong courier partnerships, we
//                 guarantee fast, reliable delivery across the UK and worldwide.
//               </p>

//               <p>
//                 Our multilingual team provides responsive, professional
//                 service, and our competitive pricing is constantly updated to
//                 reflect market trends. Navsa’s mobile-friendly platform makes
//                 ordering simple and efficient—wherever you are.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="about-brands" aria-labelledby="about-brands-title">
//         <div className="about-container">
//           <div className="about-section-heading about-section-heading--centered">
//             <span>Leading Brand Partnerships</span>
//             <h2 id="about-brands-title">Quality names customers recognise</h2>
//             <p>
//               NAVSA works with established FMCG brands to support consistent
//               quality across its product range.
//             </p>
//           </div>

//           <div className="about-brand-strip">
//             {brandPartners.map(brand => (
//               <div key={brand} className="about-brand-chip">
//                 {brand}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="about-highlights">
//         <div className="about-container">
//           <div className="about-section-heading">
//             <span>What NAVSA Delivers</span>
//             <h2>Built around reliable international trade</h2>
//           </div>

//           <div className="about-highlights__grid">
//             {highlights.map(item => (
//               <article key={item.title} className="about-highlight-card">
//                 <div className="about-highlight-card__icon">{item.icon}</div>
//                 <h3>{item.title}</h3>
//                 <p>{item.text}</p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="about-logistics">
//         <div className="about-container about-logistics__grid">
//           <div className="about-logistics__visual">
//             <div className="about-logistics__globe">
//               <FaGlobe />
//             </div>

//             <div className="about-logistics__route about-logistics__route--one" />
//             <div className="about-logistics__route about-logistics__route--two" />

//             <div className="about-logistics__badge">
//               <FaTruck />
//               <span>Fast, reliable delivery</span>
//             </div>
//           </div>

//           <div className="about-logistics__content">
//             <span>Logistics &amp; Service</span>
//             <h2>Reliable supply from enquiry to delivery</h2>

//             <p>
//               NAVSA combines a broad FMCG range with modern logistics,
//               established courier relationships and a multilingual team to
//               support customers across domestic and international markets.
//             </p>

//             <ul>
//               <li>British and international FMCG products</li>
//               <li>Strong courier and logistics partnerships</li>
//               <li>Responsive multilingual customer service</li>
//               <li>Simple mobile-friendly ordering</li>
//             </ul>
//           </div>
//         </div>
//       </section>

//       <section className="about-cta">
//         <div className="about-container">
//           <div className="about-cta__card">
//             <div>
//               <span>Start Trading with NAVSA</span>
//               <h2>Apply for a NAVSA trade account</h2>
//               <p>
//                 Submit your business details and let the NAVSA team review your
//                 customer application.
//               </p>
//             </div>

//             <div className="about-cta__actions">
//               <Link to="/account/create" className="about-button about-button--light">
//                 Create a Customer Account
//                 <FaArrowRight />
//               </Link>

//               <Link to="/account/supplier" className="about-cta__supplier-link">
//                 Become a Supplier
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }

// export default AboutUs

import { useEffect, useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaArrowRight,
  FaBoxOpen,
  FaGlobe,
  FaHandshake,
  FaMobileAlt,
  FaTags,
  FaTruck,
  FaUsers,
} from 'react-icons/fa'
import './AboutUs.css'

const brandPartners = [
  'Cadbury',
  'Coca-Cola',
  'Nestlé',
  'Heinz',
  'Ferrero',
  'Unilever',
  'P&G',
]

const highlights = [
  {
    icon: <FaBoxOpen />,
    title: 'Extensive FMCG Range',
    text: 'Confectionery, beverages, toiletries, household goods, baby products, cosmetics, and more.',
  },
  {
    icon: <FaTruck />,
    title: 'Reliable Delivery',
    text: 'A modern logistics fleet and strong courier partnerships support fast delivery across the UK and worldwide.',
  },
  {
    icon: <FaUsers />,
    title: 'Professional Service',
    text: 'A multilingual team provides responsive and professional support throughout the ordering journey.',
  },
  {
    icon: <FaTags />,
    title: 'Competitive Pricing',
    text: 'Pricing is continually updated to reflect market trends and support competitive trade purchasing.',
  },
  {
    icon: <FaMobileAlt />,
    title: 'Simple Online Ordering',
    text: 'NAVSA’s mobile-friendly platform makes ordering simple and efficient wherever customers are.',
  },
  {
    icon: <FaGlobe />,
    title: 'UK & Worldwide Supply',
    text: 'British and international FMCG products are supplied to customers across the UK and global markets.',
  },
]

function AboutUs() {
  const location = useLocation()

  useLayoutEffect(() => {
    const root = document.documentElement
    const body = document.body
    const previousRootBehaviour = root.style.scrollBehavior
    const previousBodyBehaviour = body.style.scrollBehavior

    root.style.scrollBehavior = 'auto'
    body.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)

    root.style.scrollBehavior = previousRootBehaviour
    body.style.scrollBehavior = previousBodyBehaviour
  }, [location.key])

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'About Us | NAVSA International'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero__shape about-hero__shape--one" />
        <div className="about-hero__shape about-hero__shape--two" />

        <div className="about-container about-hero__inner">
          <nav className="about-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About Us</span>
          </nav>

          <div className="about-hero__grid">
            <div className="about-hero__content">
              <span className="about-eyebrow">
                <FaHandshake />
                About NAVSA
              </span>

              <h1>
                Trusted global supply.
                <span>British and international brands.</span>
              </h1>

              <p>
                High-quality FMCG products, dependable logistics and
                professional service for trade customers in the UK and
                worldwide.
              </p>

              <div className="about-hero__actions">
                <Link to="/account/create" className="about-button about-button--primary">
                  Become a Customer
                  <FaArrowRight />
                </Link>

                <Link to="/contact-us" className="about-button about-button--secondary">
                  Contact NAVSA
                </Link>
              </div>
            </div>

            <div className="about-hero__visual" aria-hidden="true">
              <div className="about-orbit about-orbit--outer" />
              <div className="about-orbit about-orbit--inner" />

              <div className="about-hero__logo-card">
                <img src="/logos/navsa-logo.png" alt="" />
              </div>

              <div className="about-hero__mini-card about-hero__mini-card--uk">
                <strong>UK</strong>
                <span>British FMCG supply</span>
              </div>

              <div className="about-hero__mini-card about-hero__mini-card--global">
                <FaGlobe />
                <span>Worldwide delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="about-container">
          <div className="about-story__card">
            <div className="about-story__heading">
              <span>Who We Are</span>
              <h2>A trusted global FMCG supplier</h2>
            </div>

            <div className="about-story__content">
              <p>
                Navsa is a trusted global supplier of high-quality British and
                international FMCG products, offering a wide range of
                confectionery, beverages, toiletries, household goods, baby
                products, cosmetics, and more. We partner with leading brands
                such as Cadbury, Coca-Cola, Nestlé, Heinz, Ferrero, Unilever,
                and P&amp;G, ensuring premium quality and consistency. With a
                modern logistics fleet and strong courier partnerships, we
                guarantee fast, reliable delivery across the UK and worldwide.
              </p>

              <p>
                Our multilingual team provides responsive, professional
                service, and our competitive pricing is constantly updated to
                reflect market trends. Navsa’s mobile-friendly platform makes
                ordering simple and efficient—wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-brands" aria-labelledby="about-brands-title">
        <div className="about-container">
          <div className="about-section-heading about-section-heading--centered">
            <span>Leading Brand Partnerships</span>
            <h2 id="about-brands-title">Quality names customers recognise</h2>
            <p>
              NAVSA works with established FMCG brands to support consistent
              quality across its product range.
            </p>
          </div>

          <div className="about-brand-strip">
            {brandPartners.map(brand => (
              <div key={brand} className="about-brand-chip">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-highlights">
        <div className="about-container">
          <div className="about-section-heading">
            <span>What NAVSA Delivers</span>
            <h2>Built around reliable international trade</h2>
          </div>

          <div className="about-highlights__grid">
            {highlights.map(item => (
              <article key={item.title} className="about-highlight-card">
                <div className="about-highlight-card__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-logistics">
        <div className="about-container about-logistics__grid">
          <div className="about-logistics__visual">
            <div className="about-logistics__globe">
              <FaGlobe />
            </div>

            <div className="about-logistics__route about-logistics__route--one" />
            <div className="about-logistics__route about-logistics__route--two" />

            <div className="about-logistics__badge">
              <FaTruck />
              <span>Fast, reliable delivery</span>
            </div>
          </div>

          <div className="about-logistics__content">
            <span>Logistics &amp; Service</span>
            <h2>Reliable supply from enquiry to delivery</h2>

            <p>
              NAVSA combines a broad FMCG range with modern logistics,
              established courier relationships and a multilingual team to
              support customers across domestic and international markets.
            </p>

            <ul>
              <li>British and international FMCG products</li>
              <li>Strong courier and logistics partnerships</li>
              <li>Responsive multilingual customer service</li>
              <li>Simple mobile-friendly ordering</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta__card">
            <div>
              <span>Start Trading with NAVSA</span>
              <h2>Apply for a NAVSA trade account</h2>
              <p>
                Submit your business details and let the NAVSA team review your
                customer application.
              </p>
            </div>

            <div className="about-cta__actions">
              <Link to="/account/create" className="about-button about-button--light">
                Create a Customer Account
                <FaArrowRight />
              </Link>

              <Link to="/account/supplier" className="about-cta__supplier-link">
                Become a Supplier
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutUs