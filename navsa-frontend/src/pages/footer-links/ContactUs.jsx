// // import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
// // import { Link, useLocation } from 'react-router-dom'
// // import {
// //   FaArrowRight,
// //   FaBuilding,
// //   FaCheckCircle,
// //   FaEnvelope,
// //   FaMapMarkerAlt,
// //   FaPhoneAlt,
// //   FaRegClock,
// //   FaWhatsapp,
// // } from 'react-icons/fa'
// // import { FaComments, FaPaperPlane } from 'react-icons/fa6'
// // import './ContactUs.css'

// // const initialForm = {
// //   name: '',
// //   email: '',
// //   message: '',
// // }

// // function ContactUs() {
// //   const location = useLocation()
// //   const [form, setForm] = useState(initialForm)
// //   const [errors, setErrors] = useState({})
// //   const [notice, setNotice] = useState('')

// //   useLayoutEffect(() => {
// //     const root = document.documentElement
// //     const body = document.body
// //     const previousRootBehaviour = root.style.scrollBehavior
// //     const previousBodyBehaviour = body.style.scrollBehavior

// //     root.style.scrollBehavior = 'auto'
// //     body.style.scrollBehavior = 'auto'
// //     window.scrollTo(0, 0)

// //     root.style.scrollBehavior = previousRootBehaviour
// //     body.style.scrollBehavior = previousBodyBehaviour
// //   }, [location.key])

// //   useEffect(() => {
// //     const previousTitle = document.title
// //     document.title = 'Contact Us | NAVSA International'

// //     return () => {
// //       document.title = previousTitle
// //     }
// //   }, [])

// //   const mailtoHref = useMemo(() => {
// //     const subject = encodeURIComponent(
// //       form.name.trim()
// //         ? `Website enquiry from ${form.name.trim()}`
// //         : 'Website enquiry'
// //     )

// //     const body = encodeURIComponent(
// //       [
// //         `Name: ${form.name.trim()}`,
// //         `Email: ${form.email.trim()}`,
// //         '',
// //         'Message:',
// //         form.message.trim(),
// //       ].join('\n')
// //     )

// //     return `mailto:sales@navsainternational.com?subject=${subject}&body=${body}`
// //   }, [form])

// //   const updateField = event => {
// //     const { name, value } = event.target

// //     setForm(previous => ({
// //       ...previous,
// //       [name]: value,
// //     }))

// //     setErrors(previous => ({
// //       ...previous,
// //       [name]: '',
// //     }))

// //     setNotice('')
// //   }

// //   const validate = () => {
// //     const nextErrors = {}
// //     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// //     if (!form.name.trim()) {
// //       nextErrors.name = 'Please enter your name.'
// //     }

// //     if (!form.email.trim()) {
// //       nextErrors.email = 'Please enter your email address.'
// //     } else if (!emailPattern.test(form.email.trim())) {
// //       nextErrors.email = 'Please enter a valid email address.'
// //     }

// //     if (!form.message.trim()) {
// //       nextErrors.message = 'Please enter your message.'
// //     }

// //     return nextErrors
// //   }

// //   const handleSubmit = event => {
// //     event.preventDefault()

// //     const nextErrors = validate()

// //     if (Object.keys(nextErrors).length > 0) {
// //       setErrors(nextErrors)
// //       setNotice('')
// //       return
// //     }

// //     setNotice(
// //       'Your email application is opening with the message prepared for NAVSA.'
// //     )

// //     window.location.assign(mailtoHref)
// //   }

// //   return (
// //     <main className="contact-page">
// //       <section className="contact-hero">
// //         <div className="contact-hero__shape contact-hero__shape--one" />
// //         <div className="contact-hero__shape contact-hero__shape--two" />

// //         <div className="contact-container contact-hero__inner">
// //           <nav className="contact-breadcrumb" aria-label="Breadcrumb">
// //             <Link to="/">Home</Link>
// //             <span>/</span>
// //             <span>Contact Us</span>
// //           </nav>

// //           <div className="contact-hero__grid">
// //             <div className="contact-hero__content">
// //               <span className="contact-eyebrow">
// //                 <FaComments />
// //                 Contact NAVSA
// //               </span>

// //               <h1>
// //                 Let&apos;s talk
// //                 <span>trade and supply.</span>
// //               </h1>

// //               <p>
// //                 Contact the NAVSA team for customer accounts, products,
// //                 quotations, logistics, export supply and general trade
// //                 enquiries.
// //               </p>

// //               <div className="contact-hero__actions">
// //                 <a
// //                   href="tel:+441908909160"
// //                   className="contact-button contact-button--primary"
// //                 >
// //                   <FaPhoneAlt />
// //                   Call NAVSA
// //                 </a>

// //                 <a
// //                   href="https://wa.me/447544359587"
// //                   target="_blank"
// //                   rel="noreferrer"
// //                   className="contact-button contact-button--secondary"
// //                 >
// //                   <FaWhatsapp />
// //                   WhatsApp Us
// //                 </a>
// //               </div>
// //             </div>

// //             <div className="contact-hero__visual" aria-hidden="true">
// //               <div className="contact-orbit contact-orbit--outer" />
// //               <div className="contact-orbit contact-orbit--inner" />

// //               <div className="contact-hero__logo-card">
// //                 <img src="/logos/navsa-logo.png" alt="" />
// //               </div>

// //               <div className="contact-hero__mini-card contact-hero__mini-card--email">
// //                 <FaEnvelope />
// //                 <span>sales@navsainternational.com</span>
// //               </div>

// //               <div className="contact-hero__mini-card contact-hero__mini-card--location">
// //                 <FaMapMarkerAlt />
// //                 <span>Milton Keynes, UK</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="contact-details">
// //         <div className="contact-container">
// //           <div className="contact-details__grid">
// //             <a href="tel:+441908909160" className="contact-detail-card">
// //               <span className="contact-detail-card__icon">
// //                 <FaPhoneAlt />
// //               </span>

// //               <span className="contact-detail-card__label">Phone</span>
// //               <strong>+44 (0) 1908 909160</strong>
// //               <small>Speak with the NAVSA team</small>
// //             </a>

// //             <a
// //               href="mailto:sales@navsainternational.com"
// //               className="contact-detail-card"
// //             >
// //               <span className="contact-detail-card__icon">
// //                 <FaEnvelope />
// //               </span>

// //               <span className="contact-detail-card__label">Email</span>
// //               <strong>sales@navsainternational.com</strong>
// //               <small>Sales and general enquiries</small>
// //             </a>

// //             <a href="sms:+447985781627" className="contact-detail-card">
// //               <span className="contact-detail-card__icon">
// //                 <FaComments />
// //               </span>

// //               <span className="contact-detail-card__label">Text Us</span>
// //               <strong>+44 7985 781627</strong>
// //               <small>Send the team a text message</small>
// //             </a>

// //             <a
// //               href="https://wa.me/447544359587"
// //               target="_blank"
// //               rel="noreferrer"
// //               className="contact-detail-card"
// //             >
// //               <span className="contact-detail-card__icon">
// //                 <FaWhatsapp />
// //               </span>

// //               <span className="contact-detail-card__label">WhatsApp</span>
// //               <strong>+44 7544 359587</strong>
// //               <small>Message NAVSA on WhatsApp</small>
// //             </a>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="contact-main">
// //         <div className="contact-container contact-main__grid">
// //           <div className="contact-information">
// //             <div className="contact-section-heading">
// //               <span>Visit or Contact Us</span>
// //               <h2>NAVSA International Limited</h2>
// //               <p>
// //                 Use the details below to contact the NAVSA team about your
// //                 business enquiry.
// //               </p>
// //             </div>

// //             <address className="contact-address-card">
// //               <span className="contact-address-card__icon">
// //                 <FaBuilding />
// //               </span>

// //               <div>
// //                 <strong>Registered Office</strong>
// //                 <p>
// //                   Unit 18, Regus House,
// //                   <br />
// //                   Fairbourne Drive,
// //                   <br />
// //                   Milton Keynes,
// //                   <br />
// //                   MK10 9RG,
// //                   <br />
// //                   United Kingdom
// //                 </p>
// //               </div>
// //             </address>

// //             <div className="contact-information__note">
// //               <FaRegClock />
// //               <div>
// //                 <strong>Send your enquiry at any time</strong>
// //                 <p>
// //                   Email or submit the form and the NAVSA team can respond using
// //                   the contact details you provide.
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="contact-information__actions">
// //               <Link to="/account/create">
// //                 Apply for a Customer Account
// //                 <FaArrowRight />
// //               </Link>

// //               <Link to="/account/supplier">
// //                 Apply to Become a Supplier
// //                 <FaArrowRight />
// //               </Link>
// //             </div>
// //           </div>

// //           <div className="contact-form-card">
// //             <div className="contact-form-card__heading">
// //               <span>Send a Message</span>
// //               <h2>How can we help?</h2>
// //               <p>
// //                 Complete the form below. Your email application will open with
// //                 the message prepared for NAVSA.
// //               </p>
// //             </div>

// //             {notice && (
// //               <div className="contact-form__notice" role="status">
// //                 <FaCheckCircle />
// //                 {notice}
// //               </div>
// //             )}

// //             <form onSubmit={handleSubmit} noValidate>
// //               <div className="contact-form__field">
// //                 <label htmlFor="contact-name">Your name</label>

// //                 <input
// //                   id="contact-name"
// //                   name="name"
// //                   type="text"
// //                   value={form.name}
// //                   onChange={updateField}
// //                   placeholder="Enter your full name"
// //                   autoComplete="name"
// //                   aria-invalid={Boolean(errors.name)}
// //                 />

// //                 {errors.name && (
// //                   <span className="contact-form__error">{errors.name}</span>
// //                 )}
// //               </div>

// //               <div className="contact-form__field">
// //                 <label htmlFor="contact-email">Your email</label>

// //                 <input
// //                   id="contact-email"
// //                   name="email"
// //                   type="email"
// //                   value={form.email}
// //                   onChange={updateField}
// //                   placeholder="name@company.com"
// //                   autoComplete="email"
// //                   aria-invalid={Boolean(errors.email)}
// //                 />

// //                 {errors.email && (
// //                   <span className="contact-form__error">{errors.email}</span>
// //                 )}
// //               </div>

// //               <div className="contact-form__field">
// //                 <label htmlFor="contact-message">Message</label>

// //                 <textarea
// //                   id="contact-message"
// //                   name="message"
// //                   value={form.message}
// //                   onChange={updateField}
// //                   placeholder="Tell us how we can help..."
// //                   rows="7"
// //                   aria-invalid={Boolean(errors.message)}
// //                 />

// //                 {errors.message && (
// //                   <span className="contact-form__error">{errors.message}</span>
// //                 )}
// //               </div>

// //               <button type="submit" className="contact-form__submit">
// //                 Send Message
// //                 <FaPaperPlane />
// //               </button>

// //               <p className="contact-form__privacy">
// //                 Your details are used only to respond to this enquiry. Read our{' '}
// //                 <a href="/privacy-and-cookies">Privacy &amp; Cookies</a> page.
// //               </p>
// //             </form>
// //           </div>
// //         </div>
// //       </section>

// //       <section className="contact-location">
// //         <div className="contact-container">
// //           <div className="contact-location__card">
// //             <div className="contact-location__visual" aria-hidden="true">
// //               <div className="contact-location__pin">
// //                 <FaMapMarkerAlt />
// //               </div>

// //               <div className="contact-location__route contact-location__route--one" />
// //               <div className="contact-location__route contact-location__route--two" />
// //             </div>

// //             <div className="contact-location__content">
// //               <span>Milton Keynes, United Kingdom</span>
// //               <h2>Connected to customers across the UK and worldwide</h2>
// //               <p>
// //                 NAVSA supplies British and international FMCG products and
// //                 supports trade enquiries from domestic and international
// //                 customers.
// //               </p>

// //               <a
// //                 href="https://www.google.com/maps/search/?api=1&query=Unit+18+Regus+House+Fairbourne+Drive+Milton+Keynes+MK10+9RG"
// //                 target="_blank"
// //                 rel="noreferrer"
// //               >
// //                 View Address on Google Maps
// //                 <FaArrowRight />
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </main>
// //   )
// // }

// // export default ContactUs

// import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import {
//   FaArrowRight,
//   FaBuilding,
//   FaCheckCircle,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaPhoneAlt,
//   FaRegClock,
//   FaWhatsapp,
// } from 'react-icons/fa'
// import { FaComments, FaPaperPlane } from 'react-icons/fa6'
// import './ContactUs.css'

// const initialForm = {
//   name: '',
//   email: '',
//   message: '',
// }

// function ContactUs() {
//   const location = useLocation()
//   const [form, setForm] = useState(initialForm)
//   const [errors, setErrors] = useState({})
//   const [notice, setNotice] = useState('')

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
//     document.title = 'Contact Us | NAVSA International'

//     return () => {
//       document.title = previousTitle
//     }
//   }, [])

//   const mailtoHref = useMemo(() => {
//     const subject = encodeURIComponent(
//       form.name.trim()
//         ? `Website enquiry from ${form.name.trim()}`
//         : 'Website enquiry'
//     )

//     const body = encodeURIComponent(
//       [
//         `Name: ${form.name.trim()}`,
//         `Email: ${form.email.trim()}`,
//         '',
//         'Message:',
//         form.message.trim(),
//       ].join('\n')
//     )

//     return `mailto:sales@navsainternational.com?subject=${subject}&body=${body}`
//   }, [form])

//   const updateField = event => {
//     const { name, value } = event.target

//     setForm(previous => ({
//       ...previous,
//       [name]: value,
//     }))

//     setErrors(previous => ({
//       ...previous,
//       [name]: '',
//     }))

//     setNotice('')
//   }

//   const validate = () => {
//     const nextErrors = {}
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//     if (!form.name.trim()) {
//       nextErrors.name = 'Please enter your name.'
//     }

//     if (!form.email.trim()) {
//       nextErrors.email = 'Please enter your email address.'
//     } else if (!emailPattern.test(form.email.trim())) {
//       nextErrors.email = 'Please enter a valid email address.'
//     }

//     if (!form.message.trim()) {
//       nextErrors.message = 'Please enter your message.'
//     }

//     return nextErrors
//   }

//   const handleSubmit = event => {
//     event.preventDefault()

//     const nextErrors = validate()

//     if (Object.keys(nextErrors).length > 0) {
//       setErrors(nextErrors)
//       setNotice('')
//       return
//     }

//     setNotice(
//       'Your email application is opening with the message prepared for NAVSA.'
//     )

//     window.location.assign(mailtoHref)
//   }

//   return (
//     <main className="contact-page">
//       <section className="contact-hero">
//         <div className="contact-hero__shape contact-hero__shape--one" />
//         <div className="contact-hero__shape contact-hero__shape--two" />

//         <div className="contact-container contact-hero__inner">
//           <nav className="contact-breadcrumb" aria-label="Breadcrumb">
//             <Link to="/">Home</Link>
//             <span>/</span>
//             <span>Contact Us</span>
//           </nav>

//           <div className="contact-hero__grid">
//             <div className="contact-hero__content">
//               <span className="contact-eyebrow">
//                 <FaComments />
//                 Contact NAVSA
//               </span>

//               <h1>
//                 Let&apos;s talk
//                 <span>trade and supply.</span>
//               </h1>

//               <p>
//                 Contact the NAVSA team for customer accounts, products,
//                 quotations, logistics, export supply and general trade
//                 enquiries.
//               </p>

//               <div className="contact-hero__actions">
//                 <a
//                   href="tel:+441908909160"
//                   className="contact-button contact-button--primary"
//                 >
//                   <FaPhoneAlt />
//                   Call NAVSA
//                 </a>

//                 <a
//                   href="https://wa.me/447544359507"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="contact-button contact-button--secondary"
//                 >
//                   <FaWhatsapp />
//                   WhatsApp Us
//                 </a>
//               </div>
//             </div>

//             <div className="contact-hero__visual" aria-hidden="true">
//               <div className="contact-orbit contact-orbit--outer" />
//               <div className="contact-orbit contact-orbit--inner" />

//               <div className="contact-hero__logo-card">
//                 <img src="/logos/navsa-logo.png" alt="" />
//               </div>

//               <div className="contact-hero__mini-card contact-hero__mini-card--email">
//                 <FaEnvelope />
//                 <span>sales@navsainternational.com</span>
//               </div>

//               <div className="contact-hero__mini-card contact-hero__mini-card--location">
//                 <FaMapMarkerAlt />
//                 <span>Milton Keynes, UK</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="contact-details">
//         <div className="contact-container">
//           <div className="contact-details__grid">
//             <a href="tel:+441908909160" className="contact-detail-card">
//               <span className="contact-detail-card__icon">
//                 <FaPhoneAlt />
//               </span>

//               <span className="contact-detail-card__label">Phone</span>
//               <strong>+44 (0) 1908 909160</strong>
//               <small>Speak with the NAVSA team</small>
//             </a>

//             <a
//               href="mailto:sales@navsainternational.com"
//               className="contact-detail-card"
//             >
//               <span className="contact-detail-card__icon">
//                 <FaEnvelope />
//               </span>

//               <span className="contact-detail-card__label">Email</span>
//               <strong>sales@navsainternational.com</strong>
//               <small>Sales and general enquiries</small>
//             </a>

//             <a href="sms:+447985781627" className="contact-detail-card">
//               <span className="contact-detail-card__icon">
//                 <FaComments />
//               </span>

//               <span className="contact-detail-card__label">Text Us</span>
//               <strong>+44 7985 781627</strong>
//               <small>Send the team a text message</small>
//             </a>

//             <a
//               href="https://wa.me/447544359507"
//               target="_blank"
//               rel="noreferrer"
//               className="contact-detail-card"
//             >
//               <span className="contact-detail-card__icon">
//                 <FaWhatsapp />
//               </span>

//               <span className="contact-detail-card__label">WhatsApp</span>
//               <strong>+44 7544 359507</strong>
//               <small>Message NAVSA on WhatsApp</small>
//             </a>
//           </div>
//         </div>
//       </section>

//       <section className="contact-main">
//         <div className="contact-container contact-main__grid">
//           <div className="contact-information">
//             <div className="contact-section-heading">
//               <span>Visit or Contact Us</span>
//               <h2>NAVSA International Limited</h2>
//               <p>
//                 Use the details below to contact the NAVSA team about your
//                 business enquiry.
//               </p>
//             </div>

//             <address className="contact-address-card">
//               <span className="contact-address-card__icon">
//                 <FaBuilding />
//               </span>

//               <div>
//                 <strong>Registered Office</strong>
//                 <p>
//                   Unit 18, Regus House,
//                   <br />
//                   Fairbourne Drive,
//                   <br />
//                   Milton Keynes,
//                   <br />
//                   MK10 9RG,
//                   <br />
//                   United Kingdom
//                 </p>
//               </div>
//             </address>

//             <div className="contact-information__note">
//               <FaRegClock />
//               <div>
//                 <strong>Send your enquiry at any time</strong>
//                 <p>
//                   Email or submit the form and the NAVSA team can respond using
//                   the contact details you provide.
//                 </p>
//               </div>
//             </div>

//             <div className="contact-information__actions">
//               <Link to="/account/create">
//                 Apply for a Customer Account
//                 <FaArrowRight />
//               </Link>

//               <Link to="/account/supplier">
//                 Apply to Become a Supplier
//                 <FaArrowRight />
//               </Link>
//             </div>
//           </div>

//           <div className="contact-form-card">
//             <div className="contact-form-card__heading">
//               <span>Send a Message</span>
//               <h2>How can we help?</h2>
//               <p>
//                 Complete the form below. Your email application will open with
//                 the message prepared for NAVSA.
//               </p>
//             </div>

//             {notice && (
//               <div className="contact-form__notice" role="status">
//                 <FaCheckCircle />
//                 {notice}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} noValidate>
//               <div className="contact-form__field">
//                 <label htmlFor="contact-name">Your name</label>

//                 <input
//                   id="contact-name"
//                   name="name"
//                   type="text"
//                   value={form.name}
//                   onChange={updateField}
//                   placeholder="Enter your full name"
//                   autoComplete="name"
//                   aria-invalid={Boolean(errors.name)}
//                 />

//                 {errors.name && (
//                   <span className="contact-form__error">{errors.name}</span>
//                 )}
//               </div>

//               <div className="contact-form__field">
//                 <label htmlFor="contact-email">Your email</label>

//                 <input
//                   id="contact-email"
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={updateField}
//                   placeholder="name@company.com"
//                   autoComplete="email"
//                   aria-invalid={Boolean(errors.email)}
//                 />

//                 {errors.email && (
//                   <span className="contact-form__error">{errors.email}</span>
//                 )}
//               </div>

//               <div className="contact-form__field">
//                 <label htmlFor="contact-message">Message</label>

//                 <textarea
//                   id="contact-message"
//                   name="message"
//                   value={form.message}
//                   onChange={updateField}
//                   placeholder="Tell us how we can help..."
//                   rows="7"
//                   aria-invalid={Boolean(errors.message)}
//                 />

//                 {errors.message && (
//                   <span className="contact-form__error">{errors.message}</span>
//                 )}
//               </div>

//               <button type="submit" className="contact-form__submit">
//                 Send Message
//                 <FaPaperPlane />
//               </button>

//               <p className="contact-form__privacy">
//                 Your details are used only to respond to this enquiry. Read our{' '}
//                 <a href="/privacy-and-cookies">Privacy &amp; Cookies</a> page.
//               </p>
//             </form>
//           </div>
//         </div>
//       </section>

//       <section className="contact-location">
//         <div className="contact-container">
//           <div className="contact-location__card">
//             <div className="contact-location__visual" aria-hidden="true">
//               <div className="contact-location__pin">
//                 <FaMapMarkerAlt />
//               </div>

//               <div className="contact-location__route contact-location__route--one" />
//               <div className="contact-location__route contact-location__route--two" />
//             </div>

//             <div className="contact-location__content">
//               <span>Milton Keynes, United Kingdom</span>
//               <h2>Connected to customers across the UK and worldwide</h2>
//               <p>
//                 NAVSA supplies British and international FMCG products and
//                 supports trade enquiries from domestic and international
//                 customers.
//               </p>

//               <a
//                 href="https://www.google.com/maps/search/?api=1&query=Unit+18+Regus+House+Fairbourne+Drive+Milton+Keynes+MK10+9RG"
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 View Address on Google Maps
//                 <FaArrowRight />
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }

// export default ContactUs

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaArrowRight,
  FaBuilding,
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaWhatsapp,
} from 'react-icons/fa'
import { FaComments, FaPaperPlane } from 'react-icons/fa6'
import './ContactUs.css'

const initialForm = {
  name: '',
  email: '',
  message: '',
}

function ContactUs() {
  const location = useLocation()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

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
    document.title = 'Contact Us | NAVSA International'

    return () => {
      document.title = previousTitle
    }
  }, [])

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(
      form.name.trim()
        ? `Website enquiry from ${form.name.trim()}`
        : 'Website enquiry'
    )

    const body = encodeURIComponent(
      [
        `Name: ${form.name.trim()}`,
        `Email: ${form.email.trim()}`,
        '',
        'Message:',
        form.message.trim(),
      ].join('\n')
    )

    return `mailto:sales@navsainternational.com?subject=${subject}&body=${body}`
  }, [form])

  const updateField = event => {
    const { name, value } = event.target

    setForm(previous => ({
      ...previous,
      [name]: value,
    }))

    setErrors(previous => ({
      ...previous,
      [name]: '',
    }))

    setNotice('')
  }

  const validate = () => {
    const nextErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.name.trim()) {
      nextErrors.name = 'Please enter your name.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!form.message.trim()) {
      nextErrors.message = 'Please enter your message.'
    }

    return nextErrors
  }

  const handleSubmit = event => {
    event.preventDefault()

    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setNotice('')
      return
    }

    setNotice(
      'Your email application is opening with the message prepared for NAVSA.'
    )

    window.location.assign(mailtoHref)
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__shape contact-hero__shape--one" />
        <div className="contact-hero__shape contact-hero__shape--two" />

        <div className="contact-container contact-hero__inner">
          <nav className="contact-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact Us</span>
          </nav>

          <div className="contact-hero__grid">
            <div className="contact-hero__content">
              <span className="contact-eyebrow">
                <FaComments />
                Contact NAVSA
              </span>

              <h1>
                Let&apos;s talk
                <span>trade and supply.</span>
              </h1>

              <p>
                Contact the NAVSA team for customer accounts, products,
                quotations, logistics, export supply and general trade
                enquiries.
              </p>

              <div className="contact-hero__actions">
                <a
                  href="tel:+441908909160"
                  className="contact-button contact-button--primary"
                >
                  <FaPhoneAlt />
                  Call NAVSA
                </a>

                <a
                  href="https://wa.me/447544359507"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-button contact-button--secondary"
                >
                  <FaWhatsapp />
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="contact-hero__visual" aria-hidden="true">
              <div className="contact-orbit contact-orbit--outer" />
              <div className="contact-orbit contact-orbit--inner" />

              <div className="contact-hero__logo-card">
                <img src="/logos/navsa-logo.png" alt="" />
              </div>

              <div className="contact-hero__mini-card contact-hero__mini-card--email">
                <FaEnvelope />
                <span>sales@navsainternational.com</span>
              </div>

              <div className="contact-hero__mini-card contact-hero__mini-card--location">
                <FaMapMarkerAlt />
                <span>Milton Keynes, UK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-details">
        <div className="contact-container">
          <div className="contact-details__grid">
            <a href="tel:+441908909160" className="contact-detail-card">
              <span className="contact-detail-card__icon">
                <FaPhoneAlt />
              </span>

              <span className="contact-detail-card__label">Phone</span>
              <strong>+44 (0) 1908 909160</strong>
              <small>Speak with the NAVSA team</small>
            </a>

            <a
              href="mailto:sales@navsainternational.com"
              className="contact-detail-card"
            >
              <span className="contact-detail-card__icon">
                <FaEnvelope />
              </span>

              <span className="contact-detail-card__label">Email</span>
              <strong>sales@navsainternational.com</strong>
              <small>Sales and general enquiries</small>
            </a>

            <a href="sms:+447985781627" className="contact-detail-card">
              <span className="contact-detail-card__icon">
                <FaComments />
              </span>

              <span className="contact-detail-card__label">Text Us</span>
              <strong>+44 7985 781627</strong>
              <small>Send the team a text message</small>
            </a>

            <a
              href="https://wa.me/447544359507"
              target="_blank"
              rel="noreferrer"
              className="contact-detail-card"
            >
              <span className="contact-detail-card__icon">
                <FaWhatsapp />
              </span>

              <span className="contact-detail-card__label">WhatsApp</span>
              <strong>+44 7544 359507</strong>
              <small>Message NAVSA on WhatsApp</small>
            </a>
          </div>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-container contact-main__grid">
          <div className="contact-information">
            <div className="contact-section-heading">
              <span>Visit or Contact Us</span>
              <h2>NAVSA International Limited</h2>
              <p>
                Use the details below to contact the NAVSA team about your
                business enquiry.
              </p>
            </div>

            <address className="contact-address-card">
              <span className="contact-address-card__icon">
                <FaBuilding />
              </span>

              <div>
                <strong>Registered Office</strong>
                <p>
                  Unit 18, Regus House,
                  <br />
                  Fairbourne Drive,
                  <br />
                  Milton Keynes,
                  <br />
                  MK10 9RG,
                  <br />
                  United Kingdom
                </p>
              </div>
            </address>

            <div className="contact-information__note">
              <FaRegClock />
              <div>
                <strong>Send your enquiry at any time</strong>
                <p>
                  Email or submit the form and the NAVSA team can respond using
                  the contact details you provide.
                </p>
              </div>
            </div>

            <div className="contact-information__actions">
              <Link to="/account/create">
                Apply for a Customer Account
                <FaArrowRight />
              </Link>

              <Link to="/account/supplier">
                Apply to Become a Supplier
                <FaArrowRight />
              </Link>
            </div>
          </div>

          <div className="contact-form-card">
            <div className="contact-form-card__heading">
              <span>Send a Message</span>
              <h2>How can we help?</h2>
              <p>
                Complete the form below. Your email application will open with
                the message prepared for NAVSA.
              </p>
            </div>

            {notice && (
              <div className="contact-form__notice" role="status">
                <FaCheckCircle />
                {notice}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="contact-form__field">
                <label htmlFor="contact-name">Your name</label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />

                {errors.name && (
                  <span className="contact-form__error">{errors.name}</span>
                )}
              </div>

              <div className="contact-form__field">
                <label htmlFor="contact-email">Your email</label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="name@company.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && (
                  <span className="contact-form__error">{errors.email}</span>
                )}
              </div>

              <div className="contact-form__field">
                <label htmlFor="contact-message">Message</label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  placeholder="Tell us how we can help..."
                  rows="7"
                  aria-invalid={Boolean(errors.message)}
                />

                {errors.message && (
                  <span className="contact-form__error">{errors.message}</span>
                )}
              </div>

              <button type="submit" className="contact-form__submit">
                Send Message
                <FaPaperPlane />
              </button>

              <p className="contact-form__privacy">
                Your details are used only to respond to this enquiry. Read our{' '}
                <a href="/privacy-and-cookies">Privacy &amp; Cookies</a> page.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="contact-location">
        <div className="contact-container">
          <div className="contact-location__card">
            <div className="contact-location__visual" aria-hidden="true">
              <div className="contact-location__pin">
                <FaMapMarkerAlt />
              </div>

              <div className="contact-location__route contact-location__route--one" />
              <div className="contact-location__route contact-location__route--two" />
            </div>

            <div className="contact-location__content">
              <span>Milton Keynes, United Kingdom</span>
              <h2>Connected to customers across the UK and worldwide</h2>
              <p>
                NAVSA supplies British and international FMCG products and
                supports trade enquiries from domestic and international
                customers.
              </p>

              <a
                href="https://maps.app.goo.gl/5vS6Xw8THd9Muo7S8?g_st=iw"
                target="_blank"
                rel="noreferrer"
              >
                View Address on Google Maps
                <FaArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactUs