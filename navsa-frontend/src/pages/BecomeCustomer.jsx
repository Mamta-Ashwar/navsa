// import React, { useState, useEffect, useRef } from 'react';
// import './BecomeCustomer.css';

// const PHONE_CODES = [
//   { country: "United Kingdom", code: "+44" },
//   { country: "Afghanistan", code: "+93" },
//   { country: "Albania", code: "+355" },
//   { country: "Algeria", code: "+213" },
//   { country: "American Samoa", code: "+1" },
//   { country: "Andorra", code: "+376" },
//   { country: "Angola", code: "+244" },
//   { country: "Anguilla", code: "+1" },
//   { country: "Antigua and Barbuda", code: "+1" },
//   { country: "Argentina", code: "+54" },
//   { country: "Armenia", code: "+374" },
//   { country: "Aruba", code: "+297" },
//   { country: "Australia", code: "+61" },
//   { country: "Austria", code: "+43" },
//   { country: "Azerbaijan", code: "+994" },
//   { country: "Bahamas", code: "+1" },
//   { country: "Bahrain", code: "+973" },
//   { country: "Bangladesh", code: "+880" },
//   { country: "Barbados", code: "+1" },
//   { country: "Belarus", code: "+375" },
//   { country: "Belgium", code: "+32" },
//   { country: "Belize", code: "+501" },
//   { country: "Benin", code: "+229" },
//   { country: "Bermuda", code: "+1" },
//   { country: "Bhutan", code: "+975" },
//   { country: "Bolivia", code: "+591" },
//   { country: "Bonaire, Sint Eustatius and Saba", code: "+599" },
//   { country: "Bosnia and Herzegovina", code: "+387" },
//   { country: "Botswana", code: "+267" },
//   { country: "Brazil", code: "+55" },
//   { country: "British Indian Ocean Territory", code: "+246" },
//   { country: "Brunei", code: "+673" },
//   { country: "Bulgaria", code: "+359" },
//   { country: "Burkina Faso", code: "+226" },
//   { country: "Burundi", code: "+257" },
//   { country: "Cabo Verde", code: "+238" },
//   { country: "Cambodia", code: "+855" },
//   { country: "Cameroon", code: "+237" },
//   { country: "Canada", code: "+1" },
//   { country: "Cayman Islands", code: "+1" },
//   { country: "Central African Republic", code: "+236" },
//   { country: "Chad", code: "+235" },
//   { country: "Chile", code: "+56" },
//   { country: "China", code: "+86" },
//   { country: "Christmas Island", code: "+61" },
//   { country: "Cocos (Keeling) Islands", code: "+61" },
//   { country: "Colombia", code: "+57" },
//   { country: "Comoros", code: "+269" },
//   { country: "Cook Islands", code: "+682" },
//   { country: "Costa Rica", code: "+506" },
//   { country: "Croatia", code: "+385" },
//   { country: "Cuba", code: "+53" },
//   { country: "Curaçao", code: "+599" },
//   { country: "Cyprus", code: "+357" },
//   { country: "Czech Republic", code: "+420" },
//   { country: "Côte d'Ivoire", code: "+225" },
//   { country: "Democratic Republic of the Congo", code: "+243" },
//   { country: "Denmark", code: "+45" },
//   { country: "Djibouti", code: "+253" },
//   { country: "Dominica", code: "+1" },
//   { country: "Dominican Republic", code: "+1" },
//   { country: "Ecuador", code: "+593" },
//   { country: "Egypt", code: "+20" },
//   { country: "El Salvador", code: "+503" },
//   { country: "Equatorial Guinea", code: "+240" },
//   { country: "Eritrea", code: "+291" },
//   { country: "Estonia", code: "+372" },
//   { country: "Eswatini", code: "+268" },
//   { country: "Ethiopia", code: "+251" },
//   { country: "Falkland Islands", code: "+500" },
//   { country: "Faroe Islands", code: "+298" },
//   { country: "Federated States of Micronesia", code: "+691" },
//   { country: "Fiji", code: "+679" },
//   { country: "Finland", code: "+358" },
//   { country: "France", code: "+33" },
//   { country: "French Guiana", code: "+594" },
//   { country: "French Polynesia", code: "+689" },
//   { country: "Gabon", code: "+241" },
//   { country: "Gambia", code: "+220" },
//   { country: "Georgia", code: "+995" },
//   { country: "Germany", code: "+49" },
//   { country: "Ghana", code: "+233" },
//   { country: "Gibraltar", code: "+350" },
//   { country: "Greece", code: "+30" },
//   { country: "Greenland", code: "+299" },
//   { country: "Grenada", code: "+1" },
//   { country: "Guadeloupe", code: "+590" },
//   { country: "Guam", code: "+1" },
//   { country: "Guatemala", code: "+502" },
//   { country: "Guernsey", code: "+44" },
//   { country: "Guinea", code: "+224" },
//   { country: "Guinea-Bissau", code: "+245" },
//   { country: "Guyana", code: "+592" },
//   { country: "Haiti", code: "+509" },
//   { country: "Honduras", code: "+504" },
//   { country: "Hong Kong", code: "+852" },
//   { country: "Hungary", code: "+36" },
//   { country: "Iceland", code: "+354" },
//   { country: "India", code: "+91" },
//   { country: "Indonesia", code: "+62" },
//   { country: "Iran", code: "+98" },
//   { country: "Iraq", code: "+964" },
//   { country: "Ireland", code: "+353" },
//   { country: "Isle of Man", code: "+44" },
//   { country: "Israel", code: "+972" },
//   { country: "Italy", code: "+39" },
//   { country: "Jamaica", code: "+1" },
//   { country: "Japan", code: "+81" },
//   { country: "Jersey", code: "+44" },
//   { country: "Jordan", code: "+962" },
//   { country: "Kazakhstan", code: "+7" },
//   { country: "Kenya", code: "+254" },
//   { country: "Kiribati", code: "+686" },
//   { country: "Kosovo", code: "+383" },
//   { country: "Kuwait", code: "+965" },
//   { country: "Kyrgyzstan", code: "+996" },
//   { country: "Laos", code: "+856" },
//   { country: "Latvia", code: "+371" },
//   { country: "Lebanon", code: "+961" },
//   { country: "Lesotho", code: "+266" },
//   { country: "Liberia", code: "+231" },
//   { country: "Libya", code: "+218" },
//   { country: "Liechtenstein", code: "+423" },
//   { country: "Lithuania", code: "+370" },
//   { country: "Luxembourg", code: "+352" },
//   { country: "Macau", code: "+853" },
//   { country: "Madagascar", code: "+261" },
//   { country: "Malawi", code: "+265" },
//   { country: "Malaysia", code: "+60" },
//   { country: "Maldives", code: "+960" },
//   { country: "Mali", code: "+223" },
//   { country: "Malta", code: "+356" },
//   { country: "Marshall Islands", code: "+692" },
//   { country: "Martinique", code: "+596" },
//   { country: "Mauritania", code: "+222" },
//   { country: "Mauritius", code: "+230" },
//   { country: "Mayotte", code: "+262" },
//   { country: "Mexico", code: "+52" },
//   { country: "Moldova", code: "+373" },
//   { country: "Monaco", code: "+377" },
//   { country: "Mongolia", code: "+976" },
//   { country: "Montenegro", code: "+382" },
//   { country: "Montserrat", code: "+1" },
//   { country: "Morocco", code: "+212" },
//   { country: "Mozambique", code: "+258" },
//   { country: "Myanmar", code: "+95" },
//   { country: "Namibia", code: "+264" },
//   { country: "Nauru", code: "+674" },
//   { country: "Nepal", code: "+977" },
//   { country: "Netherlands", code: "+31" },
//   { country: "New Caledonia", code: "+687" },
//   { country: "New Zealand", code: "+64" },
//   { country: "Nicaragua", code: "+505" },
//   { country: "Niger", code: "+227" },
//   { country: "Nigeria", code: "+234" },
//   { country: "Niue", code: "+683" },
//   { country: "Norfolk Island", code: "+672" },
//   { country: "North Korea", code: "+850" },
//   { country: "North Macedonia", code: "+389" },
//   { country: "Northern Mariana Islands", code: "+1" },
//   { country: "Norway", code: "+47" },
//   { country: "Oman", code: "+968" },
//   { country: "Pakistan", code: "+92" },
//   { country: "Palau", code: "+680" },
//   { country: "Palestine", code: "+970" },
//   { country: "Panama", code: "+507" },
//   { country: "Papua New Guinea", code: "+675" },
//   { country: "Paraguay", code: "+595" },
//   { country: "Peru", code: "+51" },
//   { country: "Philippines", code: "+63" },
//   { country: "Pitcairn Islands", code: "+64" },
//   { country: "Poland", code: "+48" },
//   { country: "Portugal", code: "+351" },
//   { country: "Puerto Rico", code: "+1" },
//   { country: "Qatar", code: "+974" },
//   { country: "Republic of the Congo", code: "+242" },
//   { country: "Romania", code: "+40" },
//   { country: "Russia", code: "+7" },
//   { country: "Rwanda", code: "+250" },
//   { country: "Réunion", code: "+262" },
//   { country: "Saint Helena", code: "+290" },
//   { country: "Saint Kitts and Nevis", code: "+1" },
//   { country: "Saint Lucia", code: "+1" },
//   { country: "Saint Pierre and Miquelon", code: "+508" },
//   { country: "Saint Vincent and the Grenadines", code: "+1" },
//   { country: "Samoa", code: "+685" },
//   { country: "San Marino", code: "+378" },
//   { country: "Saudi Arabia", code: "+966" },
//   { country: "Senegal", code: "+221" },
//   { country: "Serbia", code: "+381" },
//   { country: "Seychelles", code: "+248" },
//   { country: "Sierra Leone", code: "+232" },
//   { country: "Singapore", code: "+65" },
//   { country: "Sint Maarten", code: "+1" },
//   { country: "Slovakia", code: "+421" },
//   { country: "Slovenia", code: "+386" },
//   { country: "Solomon Islands", code: "+677" },
//   { country: "Somalia", code: "+252" },
//   { country: "South Africa", code: "+27" },
//   { country: "South Georgia", code: "+500" },
//   { country: "South Korea", code: "+82" },
//   { country: "South Sudan", code: "+211" },
//   { country: "Spain", code: "+34" },
//   { country: "Sri Lanka", code: "+94" },
//   { country: "Sudan", code: "+249" },
//   { country: "Suriname", code: "+597" },
//   { country: "Svalbard and Jan Mayen", code: "+47" },
//   { country: "Sweden", code: "+46" },
//   { country: "Switzerland", code: "+41" },
//   { country: "Syria", code: "+963" },
//   { country: "São Tomé and Príncipe", code: "+239" },
//   { country: "Taiwan", code: "+886" },
//   { country: "Tajikistan", code: "+992" },
//   { country: "Tanzania", code: "+255" },
//   { country: "Thailand", code: "+66" },
//   { country: "Timor-Leste", code: "+670" },
//   { country: "Togo", code: "+228" },
//   { country: "Tokelau", code: "+690" },
//   { country: "Tonga", code: "+676" },
//   { country: "Trinidad and Tobago", code: "+1" },
//   { country: "Tunisia", code: "+216" },
//   { country: "Turkey", code: "+90" },
//   { country: "Turkmenistan", code: "+993" },
//   { country: "Turks and Caicos Islands", code: "+1" },
//   { country: "Tuvalu", code: "+688" },
//   { country: "U.S. Virgin Islands", code: "+1" },
//   { country: "Uganda", code: "+256" },
//   { country: "Ukraine", code: "+380" },
//   { country: "United Arab Emirates", code: "+971" },
//   { country: "United States", code: "+1" },
//   { country: "Uruguay", code: "+598" },
//   { country: "Uzbekistan", code: "+998" },
//   { country: "Vanuatu", code: "+678" },
//   { country: "Vatican City", code: "+39" },
//   { country: "Venezuela", code: "+58" },
//   { country: "Vietnam", code: "+84" },
//   { country: "Wallis and Futuna", code: "+681" },
//   { country: "Western Sahara", code: "+212" },
//   { country: "Yemen", code: "+967" },
//   { country: "Zambia", code: "+260" },
//   { country: "Zimbabwe", code: "+263" },
// ];

// function combineDialCode(codeOption, number) {
//   const cleanNumber = String(number || '').trim();
//   const dialCode = String(codeOption || '').split('|').pop() || '';

//   if (!cleanNumber) return '';
//   if (cleanNumber.startsWith('+')) return cleanNumber;

//   return `${dialCode} ${cleanNumber}`.trim();
// }

// const PHONE_COUNTRY_ALIASES = {
//   'Congo (Congo-Brazzaville)': 'Republic of the Congo',
//   'Czechia (Czech Republic)': 'Czech Republic',
//   'Eswatini (fmr. Swaziland)': 'Eswatini',
//   'Holy See': 'Vatican City',
//   'Micronesia': 'Federated States of Micronesia',
//   'Myanmar (formerly Burma)': 'Myanmar',
//   'Palestine State': 'Palestine',
//   'Sao Tome and Principe': 'São Tomé and Príncipe',
//   'United States of America': 'United States',
// };

// function getPhoneCodeOptionForCountry(countryName) {
//   const phoneCountry = PHONE_COUNTRY_ALIASES[countryName] || countryName;
//   const match = PHONE_CODES.find(item => item.country === phoneCountry);
//   return match ? `${match.country}|${match.code}` : null;
// }

// const CURRENCY_SYMBOLS = {
//   GBP: '£',
//   EURO: '€',
//   DOLLAR: '$',
// };

// let recaptchaScriptPromise = null;

// function loadRecaptchaV2Script() {
//   if (window.grecaptcha?.render) {
//     return Promise.resolve(window.grecaptcha);
//   }

//   if (recaptchaScriptPromise) {
//     return recaptchaScriptPromise;
//   }

//   recaptchaScriptPromise = new Promise((resolve, reject) => {
//     const scriptId = 'navsa-google-recaptcha-v2';
//     let settled = false;
//     let pollTimer = null;
//     let timeoutTimer = null;

//     const cleanupTimers = () => {
//       if (pollTimer !== null) {
//         window.clearInterval(pollTimer);
//       }

//       if (timeoutTimer !== null) {
//         window.clearTimeout(timeoutTimer);
//       }
//     };

//     const resolveWhenReady = () => {
//       if (settled || !window.grecaptcha?.render) {
//         return;
//       }

//       settled = true;
//       cleanupTimers();
//       resolve(window.grecaptcha);
//     };

//     const rejectLoad = () => {
//       if (settled) {
//         return;
//       }

//       settled = true;
//       cleanupTimers();
//       reject(new Error('Google reCAPTCHA could not be loaded.'));
//     };

//     let script = document.getElementById(scriptId);

//     if (!script) {
//       script = document.createElement('script');
//       script.id = scriptId;
//       script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
//       script.async = true;
//       script.defer = true;
//       document.head.appendChild(script);
//     }

//     script.addEventListener('load', resolveWhenReady, { once: true });
//     script.addEventListener('error', rejectLoad, { once: true });

//     // Polling prevents a blank widget when the script finishes loading before
//     // React attaches its load listener, including React StrictMode development.
//     pollTimer = window.setInterval(resolveWhenReady, 100);
//     timeoutTimer = window.setTimeout(rejectLoad, 15000);

//     resolveWhenReady();
//   }).catch(error => {
//     // Allow a later retry after a temporary network or extension failure.
//     recaptchaScriptPromise = null;
//     throw error;
//   });

//   return recaptchaScriptPromise;
// }

// function RecaptchaCheckbox({ siteKey, onTokenChange, resetCounter }) {
//   const containerRef = useRef(null);
//   const widgetIdRef = useRef(null);
//   const callbackRef = useRef(onTokenChange);
//   const [loadError, setLoadError] = useState('');

//   useEffect(() => {
//     callbackRef.current = onTokenChange;
//   }, [onTokenChange]);

//   useEffect(() => {
//     if (!siteKey || !containerRef.current) {
//       return undefined;
//     }

//     let cancelled = false;
//     setLoadError('');

//     loadRecaptchaV2Script()
//       .then(grecaptcha => {
//         if (
//           cancelled ||
//           !containerRef.current ||
//           widgetIdRef.current !== null
//         ) {
//           return;
//         }

//         try {
//           widgetIdRef.current = grecaptcha.render(containerRef.current, {
//             sitekey: siteKey,
//             theme: 'light',
//             size: 'normal',
//             callback: token => callbackRef.current(token),
//             'expired-callback': () => callbackRef.current(''),
//             'error-callback': () => {
//               callbackRef.current('');
//               setLoadError(
//                 'Google reCAPTCHA had a connection problem. Please refresh the page and try again.'
//               );
//             },
//           });
//         } catch (error) {
//           console.error('Unable to render Google reCAPTCHA:', error);
//           setLoadError(
//             'Google reCAPTCHA could not be displayed. Please refresh the page and check the browser console.'
//           );
//         }
//       })
//       .catch(error => {
//         if (cancelled) {
//           return;
//         }

//         console.error('Unable to load Google reCAPTCHA:', error);
//         setLoadError(
//           'Google reCAPTCHA could not load. Disable any ad/privacy blocker for localhost and refresh the page.'
//         );
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [siteKey]);

//   useEffect(() => {
//     if (
//       widgetIdRef.current !== null &&
//       window.grecaptcha?.reset
//     ) {
//       try {
//         window.grecaptcha.reset(widgetIdRef.current);
//         callbackRef.current('');
//       } catch (error) {
//         console.error('Unable to reset Google reCAPTCHA:', error);
//       }
//     }
//   }, [resetCounter]);

//   return (
//     <>
//       <div ref={containerRef} className="recaptcha-widget" />
//       {loadError && (
//         <p className="recaptcha-config-error" role="alert">
//           {loadError}
//         </p>
//       )}
//     </>
//   );
// }

// function BecomeCustomer() {
//   const [isCriteriaConfirmed, setIsCriteriaConfirmed] = useState(false);
//   const [isSingleTickChecked, setIsSingleTickChecked] = useState(false);

//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     confirm_email: '',
//     password: '',
//     confirm_password: '',
//     region: '',
//     country: '',
//     position: '',
//     registered_company_name: '',
//     company_registration_number: '',
//     vat_number: '',
//     trading_years: '',
//     business_nature: '',
//     website: '',
//     director_name: '',
//     currency: '',
//     registered_phone_code: 'United Kingdom|+44',
//     registered_phone: '',
//     mobile_code: 'United Kingdom|+44',
//     mobile: '',
//     whatsapp_offers_opt_in: false,
//     address_line_1: '',
//     address_line_2: '',
//     city: '',
//     province: '',
//     zip_code: '',
//     account_name: '',
//     account_email: '',
//     other_wholesalers: '',
//     average_order_value: '',
//     turnover: '',
//     import_full_containers: '',
//     brands_interested: '',
//     categories_interested: [],
//     eori_number: '',
//     terms_accepted: false,
//     consent_emails: false,
//     same_as_billing: true,
//     shipping_address_line_1: '',
//     shipping_address_line_2: '',
//     shipping_city: '',
//     shipping_province: '',
//     shipping_zip_code: '',
//     shipping_country: '',
//     shipping_telephone_code: 'United Kingdom|+44',
//     shipping_telephone: '',
//   });

//   const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'
//   const [validationError, setValidationError] = useState('');
//   const [recaptchaToken, setRecaptchaToken] = useState('');
//   const [recaptchaResetCounter, setRecaptchaResetCounter] = useState(0);
//   const recaptchaSiteKey = String(
//     import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
//   ).trim();

//   useEffect(() => {
//     if (status !== 'success') return undefined;

//     const frame = window.requestAnimationFrame(() => {
//       window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
//     });

//     return () => window.cancelAnimationFrame(frame);
//   }, [status]);
//   const isUkCustomer = formData.region === 'UK' || formData.country === 'United Kingdom';
//   const currencySymbol = CURRENCY_SYMBOLS[formData.currency] || '';

//   const averageOrderOptions = currencySymbol
//     ? [
//         `${currencySymbol}5,000 - ${currencySymbol}10,000 (UK & Europe only)`,
//         `${currencySymbol}10,000 - ${currencySymbol}20,000`,
//         `${currencySymbol}20,000 - ${currencySymbol}40,000`,
//         `${currencySymbol}40,000+`,
//       ]
//     : [];

//   const turnoverOptions = currencySymbol
//     ? [
//         `${currencySymbol}0 - ${currencySymbol}500,000`,
//         `${currencySymbol}500,000 - ${currencySymbol}1,000,000`,
//         `${currencySymbol}1,000,000 - ${currencySymbol}5,000,000`,
//         `${currencySymbol}5,000,000 - ${currencySymbol}10,000,000`,
//         `${currencySymbol}20,000,000+`,
//       ]
//     : [];
//   const countriesList = [
//     "United Kingdom",
//     "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
//     "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
//     "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
//     "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China",
//     "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
//     "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
//     "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
//     "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
//     "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
//     "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
//     "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
//     "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
//     "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
//     "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
//     "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
//     "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
//     "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
//     "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
//     "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand",
//     "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
//     "Ukraine", "United Arab Emirates", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam",
//     "Yemen", "Zambia", "Zimbabwe"
//   ];

//   const [categories, setCategories] = useState([]);


//   useEffect(() => {
//     async function loadCategories() {
//       try {
//         const BASE = import.meta.env.VITE_API_URL || '/api';
//         const response = await fetch(`${BASE}/categories`);
//         if (response.ok) {
//           const data = await response.json();
//           const categoryList = Array.isArray(data)
//             ? data.map(item => (typeof item === 'string' ? item : item.category_name || item.name)).filter(Boolean)
//             : [];

//           if (categoryList.length > 0) {
//             setCategories(categoryList);
//             return;
//           }
//         }
//       } catch (err) {
//         console.error('Failed to fetch categories from DB:', err);
//       }

//       // Default categories fallback
//       setCategories([
//         'Chocolates', 'Groceries', 'Confectionery', 'Crisps & Snacks',
//         'Cold and Hot Beverages', 'Biscuits', 'Seasonal', 'Chilled Items',
//         'Frozen', 'Baby and Kids', 'Health and Personal Care', 'Pet Care and Food',
//         'Cleaning & Households'
//       ]);
//     }

//     loadCategories();
//   }, []);


//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (validationError) {
//       setValidationError('');
//     }

//     if (status === 'error') {
//       setStatus(null);
//     }
//     if (type === 'checkbox' && name === 'categories_interested') {
//       setFormData(prev => {
//         const newCategories = checked
//           ? [...prev.categories_interested, value]
//           : prev.categories_interested.filter(c => c !== value);
//         return { ...prev, categories_interested: newCategories };
//       });
//     } else if (type === 'checkbox') {
//       setFormData(prev => {
//         const next = { ...prev, [name]: checked };

//         if (name === 'same_as_billing' && checked) {
//           next.shipping_address_line_1 = '';
//           next.shipping_address_line_2 = '';
//           next.shipping_city = '';
//           next.shipping_province = '';
//           next.shipping_zip_code = '';
//           next.shipping_country = '';
//           next.shipping_telephone_code = 'United Kingdom|+44';
//           next.shipping_telephone = '';
//         }

//         return next;
//       });
//     } else {
//       setFormData(prev => {
//         const next = { ...prev, [name]: value };

//         if (name === 'region' && value === 'UK') {
//           const ukPhoneCodeOption = getPhoneCodeOptionForCountry('United Kingdom');
//           next.country = 'United Kingdom';

//           if (ukPhoneCodeOption) {
//             next.registered_phone_code = ukPhoneCodeOption;
//             next.mobile_code = ukPhoneCodeOption;
//           }
//         }

//         if (name === 'country') {
//           const phoneCodeOption = getPhoneCodeOptionForCountry(value);
//           if (phoneCodeOption) {
//             next.registered_phone_code = phoneCodeOption;
//             next.mobile_code = phoneCodeOption;
//           }
//         }

//         if (name === 'shipping_country') {
//           const shippingPhoneCodeOption = getPhoneCodeOptionForCountry(value);
//           if (shippingPhoneCodeOption) {
//             next.shipping_telephone_code = shippingPhoneCodeOption;
//           }
//         }

//         if (name === 'currency') {
//           next.average_order_value = '';
//           next.turnover = '';
//         }

//         const nextIsUkCustomer = next.region === 'UK' || next.country === 'United Kingdom';
//         if ((name === 'region' || name === 'country') && !nextIsUkCustomer) {
//           next.vat_number = '';
//         }

//         return next;
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setValidationError('');

//     if (formData.email.trim() !== formData.confirm_email.trim()) {
//       setValidationError('Email and Confirm Email must match.');
//       document.getElementById('confirm-email')?.focus();
//       return;
//     }

//     if (formData.password !== formData.confirm_password) {
//       setValidationError('Password and Confirm Password must match.');
//       document.getElementById('confirm-password')?.focus();
//       return;
//     }

//     if (formData.whatsapp_offers_opt_in && !formData.mobile.trim()) {
//       setValidationError('Mobile Number is required when WhatsApp offers are selected.');
//       document.querySelector('input[name="mobile"]')?.focus();
//       return;
//     }

//     if (isUkCustomer && !formData.vat_number.trim()) {
//       setValidationError('VAT Number is required for UK customers.');
//       document.getElementById('vat-number')?.focus();
//       return;
//     }

//     if (!formData.terms_accepted) {
//       setValidationError('Please accept the Terms & Conditions.');
//       return;
//     }

//     if (!recaptchaSiteKey) {
//       setValidationError('Google reCAPTCHA is not configured. Please contact NAVSA support.');
//       document.querySelector('.recaptcha-section')?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//       return;
//     }

//     if (!recaptchaToken) {
//       setValidationError('Please complete the Google reCAPTCHA verification.');
//       document.querySelector('.recaptcha-section')?.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//       return;
//     }

//     const {
//       confirm_password,
//       registered_phone_code,
//       mobile_code,
//       shipping_telephone_code,
//       ...submissionData
//     } = formData;

//     const payload = {
//       ...submissionData,
//       email: formData.email.trim(),
//       confirm_email: formData.confirm_email.trim(),
//       vat_number: isUkCustomer ? formData.vat_number.trim() : '',
//       registered_phone: combineDialCode(
//         registered_phone_code,
//         formData.registered_phone
//       ),
//       mobile: combineDialCode(mobile_code, formData.mobile),
//       whatsapp_offers_opt_in: Boolean(formData.whatsapp_offers_opt_in),
//       shipping_country: formData.same_as_billing ? '' : formData.shipping_country,
//       shipping_telephone: formData.same_as_billing
//         ? ''
//         : combineDialCode(shipping_telephone_code, formData.shipping_telephone),
//       recaptcha_token: recaptchaToken,
//     };

//     setStatus('submitting');

//     try {
//       const BASE = import.meta.env.VITE_API_URL || '/api';
//       const response = await fetch(`${BASE}/register-customer`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorPayload = await response.json().catch(() => ({}));
//         const validationMessages = Object.values(
//           errorPayload.errors || {}
//         ).flat();

//         throw new Error(
//           validationMessages.join(' ') ||
//           errorPayload.message ||
//           'Registration failed. Please check your inputs.'
//         );
//       }

//       setStatus('success');
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setValidationError(error.message);
//       setStatus('error');
//       setRecaptchaToken('');
//       setRecaptchaResetCounter(current => current + 1);
//     }
//   };

//   if (status === 'success') {
//     return (
//       <div className="become-customer-container success-state">
//         <div className="success-card">
//           <h2>Application Submitted!</h2>
//           <p>Thank you for registering with NAVSA. Your application has been sent to our team for review.</p>
//           <p>Once approved, your account will be activated, and you will be able to log in with the password you created.</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isCriteriaConfirmed) {
//     return (
//       <div className="become-customer-container">
//         <div className="customer-form-wrapper eligibility-wrapper">
//           <h1 className="form-title">Customer Registration Criteria</h1>
//           <p className="eligibility-intro">
//             Please Note: You need to meet the following criteria for us to be able to process your account.
//           </p>

//           <div className="form-instructions criteria-box">
//             <ul className="criteria-list">
//               <li>UK companies <strong>must be VAT registered</strong></li>
//               <li>Your business is <strong>registered at a commercial property</strong>, not a home address</li>
//               <li>Our minimum order is <strong>£5,000.00 for UK & Europe, £10,000.00 for ROW</strong></li>
//               <li>You need to be <strong>trading for over 12 months</strong> for UK Customers</li>
//             </ul>
//           </div>

//           <p className="application-accuracy-note">
//             Please fill in the form accurately so we can process your account and customise your experience. If details or documents are incorrect, we will not be able to continue with your application.
//           </p>

//           <div className="single-tick-box">
//             <label>
//               <input
//                 type="checkbox"
//                 checked={isSingleTickChecked}
//                 onChange={(e) => setIsSingleTickChecked(e.target.checked)}
//               />
//               <span><strong>I confirm that my business meets all of the above eligibility criteria</strong></span>
//             </label>
//           </div>

//           <button
//             type="button"
//             className="continue-btn"
//             disabled={!isSingleTickChecked}
//             onClick={() => setIsCriteriaConfirmed(true)}
//           >
//             Continue to Application Form →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="become-customer-container">
//       <div className="customer-form-wrapper">
//         <h1 className="form-title">Customer Application Form</h1>
//         <div className="form-instructions confirmed-instructions">
//           <div className="confirmed-badge">✓ Verified Eligibility Criteria</div>
//           <ul className="criteria-list">
//             <li>UK companies <strong>must be VAT registered</strong></li>
//             <li>Your business is <strong>registered at a commercial property</strong>, not a home address</li>
//             <li>Our minimum order is <strong>£5,000 for UK & Europe, £10,000 for ROW</strong></li>
//             <li>You need to be <strong>trading for over 12 months</strong> for UK Customers</li>
//           </ul>
//         </div>

//         {(validationError || status === 'error') && (
//           <div className="error-message" role="alert">
//             {validationError ||
//               'There was an error submitting your application. Please ensure all required fields are filled correctly.'}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="customer-form" autoComplete="off">
//           <div className="navsa-autofill-guard" aria-hidden="true">
//             <input
//               type="text"
//               name="navsa_autofill_username_guard"
//               autoComplete="username"
//               tabIndex={-1}
//             />
//             <input
//               type="password"
//               name="navsa_autofill_password_guard"
//               autoComplete="new-password"
//               tabIndex={-1}
//             />
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label>First Name *</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="first_name" required value={formData.first_name} onChange={handleChange} />
//             </div>
//             <div className="col">
//               <label>Last Name *</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="last_name" required value={formData.last_name} onChange={handleChange} />
//             </div>
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label htmlFor="customer-email">Email *</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                 id="customer-email"
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col">
//               <label htmlFor="confirm-email">Confirm Email *</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                 id="confirm-email"
//                 type="email"
//                 name="confirm_email"
//                 required
//                 value={formData.confirm_email}
//                 onChange={handleChange}
//                 aria-invalid={
//                   Boolean(formData.confirm_email) &&
//                   formData.email.trim() !== formData.confirm_email.trim()
//                 }
//               />
//               {formData.confirm_email &&
//                 formData.email.trim() !== formData.confirm_email.trim() && (
//                   <p className="field-error">Email addresses do not match.</p>
//                 )}
//             </div>
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label htmlFor="customer-password">Password *</label>
//               <input autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                 id="customer-password"
//                 type="password"
//                 name="password"
//                 required
//                 minLength="6"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="col">
//               <label htmlFor="confirm-password">Confirm Password *</label>
//               <input autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                 id="confirm-password"
//                 type="password"
//                 name="confirm_password"
//                 required
//                 minLength="6"
//                 value={formData.confirm_password}
//                 onChange={handleChange}
//                 aria-invalid={
//                   Boolean(formData.confirm_password) &&
//                   formData.password !== formData.confirm_password
//                 }
//               />
//               {formData.confirm_password &&
//                 formData.password !== formData.confirm_password && (
//                   <p className="field-error">Passwords do not match.</p>
//                 )}
//             </div>
//           </div>

//           <div className="form-group">
//             <label>What Region are you in? *</label>
//             <div className="radio-group">
//               <label><input type="radio" name="region" value="UK" onChange={handleChange} required/> UK</label>
//               <label><input type="radio" name="region" value="Europe" onChange={handleChange} /> Europe</label>
//               <label><input type="radio" name="region" value="International" onChange={handleChange} /> International</label>
//             </div>
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label>Country *</label>
//               <select name="country" required value={formData.country} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
//                 <option value="">- Select -</option>
//                 {countriesList.map(c => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col">
//               <label>Your Position at the Company</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="position" value={formData.position} onChange={handleChange} />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>What is your registered company name? *</label>
//             <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="registered_company_name" required value={formData.registered_company_name} onChange={handleChange} />
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label>Company Registration Number</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                 type="text"
//                 name="company_registration_number"
//                 value={formData.company_registration_number}
//                 onChange={handleChange}
//               />
//             </div>

//             {isUkCustomer && (
//               <div className="col">
//                 <label htmlFor="vat-number">VAT Number *</label>
//                 <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                   id="vat-number"
//                   type="text"
//                   name="vat_number"
//                   required={isUkCustomer}
//                   value={formData.vat_number}
//                   onChange={handleChange}
//                 />
//                 <p className="phone-helper-text">Required for UK customers.</p>
//               </div>
//             )}
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label>How many years have you been trading? *</label>
//               <select name="trading_years" required value={formData.trading_years} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
//                 <option value="">- Select -</option>
//                 <option value="0-1">0-1</option>
//                 <option value="1-2">1-2</option>
//                 <option value="2-5">2-5</option>
//                 <option value="5+">5+</option>
//               </select>
//             </div>
//             <div className="col">
//               <label>What is the nature of your business *</label>
//               <select name="business_nature" required value={formData.business_nature} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
//                 <option value="">Please Select</option>
//                 <option value="Multiples">Multiples</option>
//                 <option value="Discount">Discount</option>
//                 <option value="Pharmacy">Pharmacy</option>
//                 <option value="Retail">Retail</option>
//                 <option value="Traders">Traders</option>
//                 <option value="Wholesale">Wholesale</option>
//                 <option value="Online">Online</option>
//                 <option value="Amazon">Amazon</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Website address</label>
//             <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="website" placeholder="https://" value={formData.website} onChange={handleChange} />
//           </div>

//           <div className="form-group">
//             <label>Full name of the director of the business *</label>
//             <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="director_name" required value={formData.director_name} onChange={handleChange} />
//           </div>

//           <div className="form-group">
//             <label>If your account is successful what currency would you like to pay in? *</label>
//             <div className="radio-group">
//               <label><input type="radio" name="currency" value="GBP" onChange={handleChange} required/> GBP £</label>
//               <label><input type="radio" name="currency" value="EURO" onChange={handleChange} /> EURO €</label>
//               <label><input type="radio" name="currency" value="DOLLAR" onChange={handleChange} /> DOLLAR $</label>
//             </div>
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label>Registered company phone number *</label>
//               <div className="phone-input-group">
//                 <select
//                   name="registered_phone_code"
//                   value={formData.registered_phone_code}
//                   onChange={handleChange}
//                   aria-label="Registered company phone country code"
//                 >
//                   {PHONE_CODES.map(({ country, code }) => (
//                     <option
//                       key={`${country}-${code}`}
//                       value={`${country}|${code}`}
//                     >
//                       {country} ({code})
//                     </option>
//                   ))}
//                 </select>
//                 <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                   type="tel"
//                   name="registered_phone"
//                   required
//                   inputMode="tel"
//                   value={formData.registered_phone}
//                   onChange={handleChange}
//                   placeholder="Phone number"
//                 />
//               </div>
//             </div>
//             <div className="col">
//               <label>Mobile Number</label>
//               <div className="phone-input-group">
//                 <select
//                   name="mobile_code"
//                   value={formData.mobile_code}
//                   onChange={handleChange}
//                   aria-label="Mobile phone country code"
//                 >
//                   {PHONE_CODES.map(({ country, code }) => (
//                     <option
//                       key={`${country}-${code}`}
//                       value={`${country}|${code}`}
//                     >
//                       {country} ({code})
//                     </option>
//                   ))}
//                 </select>
//                 <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                   type="tel"
//                   name="mobile"
//                   required={formData.whatsapp_offers_opt_in}
//                   inputMode="tel"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   placeholder="Mobile number"
//                 />
//               </div>
//               <label className="whatsapp-opt-in-label">
//                 <input
//                   type="checkbox"
//                   name="whatsapp_offers_opt_in"
//                   checked={formData.whatsapp_offers_opt_in}
//                   onChange={handleChange}
//                 />
//                 <span>Check if you would like to receive offers via WhatsApp.</span>
//               </label>
//             </div>
//           </div>

//           <h3 className="section-title">Company Billing Address *</h3>
//           <div className="form-group">
//             <label>Address line 1</label>
//             <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="address_line_1" required value={formData.address_line_1} onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label>Address line 2</label>
//             <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} />
//           </div>
//           <div className="form-group row">
//             <div className="col">
//               <label>City/Town</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="city" required value={formData.city} onChange={handleChange} />
//             </div>
//             <div className="col">
//               <label>State/Province</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="province" required value={formData.province} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="form-group row">
//             <div className="col">
//               <label>Zip code</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="zip_code" required value={formData.zip_code} onChange={handleChange} />
//             </div>
//           </div>

//           <div className="form-group checkbox-full">
//             <label>
//               <input type="checkbox" name="same_as_billing" checked={formData.same_as_billing} onChange={handleChange} />
//               Shipping address is the same as Billing address
//             </label>
//           </div>

//           {!formData.same_as_billing && (
//             <div className="shipping-address-section">
//               <h3 className="section-title">Shipping Address *</h3>
//               <div className="form-group">
//                 <label>Shipping Address line 1</label>
//                 <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_address_line_1" required={!formData.same_as_billing} value={formData.shipping_address_line_1} onChange={handleChange} />
//               </div>
//               <div className="form-group">
//                 <label>Shipping Address line 2</label>
//                 <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_address_line_2" value={formData.shipping_address_line_2} onChange={handleChange} />
//               </div>
//               <div className="form-group row">
//                 <div className="col">
//                   <label>Shipping City/Town</label>
//                   <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_city" required={!formData.same_as_billing} value={formData.shipping_city} onChange={handleChange} />
//                 </div>
//                 <div className="col">
//                   <label>Shipping State/Province</label>
//                   <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_province" required={!formData.same_as_billing} value={formData.shipping_province} onChange={handleChange} />
//                 </div>
//               </div>
//               <div className="form-group row">
//                 <div className="col">
//                   <label>Shipping Zip code</label>
//                   <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_zip_code" required={!formData.same_as_billing} value={formData.shipping_zip_code} onChange={handleChange} />
//                 </div>
//                 <div className="col">
//                   <label>Shipping Country *</label>
//                   <select
//                     name="shipping_country"
//                     required={!formData.same_as_billing}
//                     value={formData.shipping_country}
//                     onChange={handleChange}
//                     style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}
//                   >
//                     <option value="">- Select -</option>
//                     {countriesList.map(c => (
//                       <option key={`shipping-${c}`} value={c}>{c}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Shipping Telephone *</label>
//                 <div className="phone-input-group shipping-phone-input-group">
//                   <select
//                     name="shipping_telephone_code"
//                     value={formData.shipping_telephone_code}
//                     onChange={handleChange}
//                     aria-label="Shipping telephone country code"
//                   >
//                     {PHONE_CODES.map(({ country, code }) => (
//                       <option
//                         key={`shipping-phone-${country}-${code}`}
//                         value={`${country}|${code}`}
//                       >
//                         {country} ({code})
//                       </option>
//                     ))}
//                   </select>
//                   <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
//                     type="tel"
//                     name="shipping_telephone"
//                     required={!formData.same_as_billing}
//                     inputMode="tel"
//                     value={formData.shipping_telephone}
//                     onChange={handleChange}
//                     placeholder="Shipping telephone number"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <h3 className="section-title">Accounts Information</h3>
//           <div className="form-group row">
//             <div className="col">
//               <label>Accounts Name *</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="account_name" required value={formData.account_name} onChange={handleChange} />
//             </div>
//             <div className="col">
//               <label>Accounts Email Address *</label>
//               <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="email" name="account_email" required value={formData.account_email} onChange={handleChange} />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Do you currently work with any other wholesalers?</label>
//             <div className="radio-group">
//               <label>
//                 <input
//                   type="radio"
//                   name="other_wholesalers"
//                   value="Yes"
//                   checked={formData.other_wholesalers === 'Yes'}
//                   onChange={handleChange}
//                 />
//                 Yes
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="other_wholesalers"
//                   value="No"
//                   checked={formData.other_wholesalers === 'No'}
//                   onChange={handleChange}
//                 />
//                 No
//               </label>
//             </div>
//           </div>

//           <div className="form-group row">
//             <div className="col">
//               <label>Average Order Value *</label>
//               <select
//                 name="average_order_value"
//                 required
//                 disabled={!formData.currency}
//                 value={formData.average_order_value}
//                 onChange={handleChange}
//               >
//                 <option value="">
//                   {formData.currency ? 'Please Select' : 'Select currency first'}
//                 </option>
//                 {averageOrderOptions.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="col">
//               <label>Company Turnover *</label>
//               <select
//                 name="turnover"
//                 required
//                 disabled={!formData.currency}
//                 value={formData.turnover}
//                 onChange={handleChange}
//               >
//                 <option value="">
//                   {formData.currency ? 'Please Select' : 'Select currency first'}
//                 </option>
//                 {turnoverOptions.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Do you import full containers or pallets from the UK? *</label>
//             <div className="radio-group">
//               <label><input type="radio" name="import_full_containers" value="Containers" onChange={handleChange} required/> Yes - Containers</label>
//               <label><input type="radio" name="import_full_containers" value="Pallets" onChange={handleChange} /> Yes - Pallets</label>
//               <label><input type="radio" name="import_full_containers" value="Cases" onChange={handleChange} /> No - I order by cases</label>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>What brands are you interested in?</label>
//             <input
//               autoComplete="off"
//               data-lpignore="true"
//               data-1p-ignore="true"
//               data-bwignore="true"
//               aria-autocomplete="none"
//               type="text"
//               name="brands_interested"
//               placeholder="Comma-separated"
//               value={formData.brands_interested}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="form-group">
//             <label>What categories are you interested in? * (Select all that apply)</label>
//             <div className="checkbox-grid">
//               {categories.map(cat => (
//                 <label key={cat}>
//                   <input type="checkbox" name="categories_interested" value={cat} onChange={handleChange} /> {cat}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="form-group">
//             <label>EORI Number (EU ONLY)</label>
//             <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="eori_number" value={formData.eori_number} onChange={handleChange} />
//           </div>

//           <div className="form-group checkbox-full">
//             <label>
//               <input type="checkbox" name="terms_accepted" required checked={formData.terms_accepted} onChange={handleChange} />
//               I have read the Terms & Conditions *
//             </label>
//             <p className="sub-text">Please tick the above to show you have read and accepted our terms and conditions</p>
//           </div>

//           <div className="form-group checkbox-full">
//             <label>
//               <input type="checkbox" name="consent_emails" checked={formData.consent_emails} onChange={handleChange} />
//               I consent to receive emails for offers and new product updates. *
//             </label>
//           </div>

//           <div className="recaptcha-section">
//             {recaptchaSiteKey ? (
//               <RecaptchaCheckbox
//                 siteKey={recaptchaSiteKey}
//                 onTokenChange={setRecaptchaToken}
//                 resetCounter={recaptchaResetCounter}
//               />
//             ) : (
//               <p className="recaptcha-config-error" role="alert">
//                 Google reCAPTCHA is not configured for this website.
//               </p>
//             )}
//           </div>

//           <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
//             {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
//           </button>

//           <p className="privacy-submit-note">
//             By clicking submit you are saving your details and you are agreeing to our Privacy Policy.
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default BecomeCustomer;


import React, { useState, useEffect, useRef } from 'react';
import './BecomeCustomer.css';

const PHONE_CODES = [
  { country: "United Kingdom", code: "+44" },
  { country: "Afghanistan", code: "+93" },
  { country: "Albania", code: "+355" },
  { country: "Algeria", code: "+213" },
  { country: "American Samoa", code: "+1" },
  { country: "Andorra", code: "+376" },
  { country: "Angola", code: "+244" },
  { country: "Anguilla", code: "+1" },
  { country: "Antigua and Barbuda", code: "+1" },
  { country: "Argentina", code: "+54" },
  { country: "Armenia", code: "+374" },
  { country: "Aruba", code: "+297" },
  { country: "Ascension Island", code: "+247" },
  { country: "Australia", code: "+61" },
  { country: "Austria", code: "+43" },
  { country: "Azerbaijan", code: "+994" },
  { country: "Bahamas", code: "+1" },
  { country: "Bahrain", code: "+973" },
  { country: "Bangladesh", code: "+880" },
  { country: "Barbados", code: "+1" },
  { country: "Belarus", code: "+375" },
  { country: "Belgium", code: "+32" },
  { country: "Belize", code: "+501" },
  { country: "Benin", code: "+229" },
  { country: "Bermuda", code: "+1" },
  { country: "Bhutan", code: "+975" },
  { country: "Bolivia", code: "+591" },
  { country: "Bonaire, Sint Eustatius and Saba", code: "+599" },
  { country: "Bosnia and Herzegovina", code: "+387" },
  { country: "Botswana", code: "+267" },
  { country: "Brazil", code: "+55" },
  { country: "British Indian Ocean Territory", code: "+246" },
  { country: "British Virgin Islands", code: "+1" },
  { country: "Brunei", code: "+673" },
  { country: "Bulgaria", code: "+359" },
  { country: "Burkina Faso", code: "+226" },
  { country: "Burundi", code: "+257" },
  { country: "Cabo Verde", code: "+238" },
  { country: "Cambodia", code: "+855" },
  { country: "Cameroon", code: "+237" },
  { country: "Canada", code: "+1" },
  { country: "Cayman Islands", code: "+1" },
  { country: "Central African Republic", code: "+236" },
  { country: "Chad", code: "+235" },
  { country: "Chile", code: "+56" },
  { country: "China", code: "+86" },
  { country: "Christmas Island", code: "+61" },
  { country: "Cocos (Keeling) Islands", code: "+61" },
  { country: "Colombia", code: "+57" },
  { country: "Comoros", code: "+269" },
  { country: "Cook Islands", code: "+682" },
  { country: "Costa Rica", code: "+506" },
  { country: "Croatia", code: "+385" },
  { country: "Cuba", code: "+53" },
  { country: "Curaçao", code: "+599" },
  { country: "Cyprus", code: "+357" },
  { country: "Czech Republic", code: "+420" },
  { country: "Côte d'Ivoire", code: "+225" },
  { country: "Democratic Republic of the Congo", code: "+243" },
  { country: "Denmark", code: "+45" },
  { country: "Djibouti", code: "+253" },
  { country: "Dominica", code: "+1" },
  { country: "Dominican Republic", code: "+1" },
  { country: "Ecuador", code: "+593" },
  { country: "Egypt", code: "+20" },
  { country: "El Salvador", code: "+503" },
  { country: "Equatorial Guinea", code: "+240" },
  { country: "Eritrea", code: "+291" },
  { country: "Estonia", code: "+372" },
  { country: "Eswatini", code: "+268" },
  { country: "Ethiopia", code: "+251" },
  { country: "Falkland Islands", code: "+500" },
  { country: "Faroe Islands", code: "+298" },
  { country: "Federated States of Micronesia", code: "+691" },
  { country: "Fiji", code: "+679" },
  { country: "Finland", code: "+358" },
  { country: "France", code: "+33" },
  { country: "French Guiana", code: "+594" },
  { country: "French Polynesia", code: "+689" },
  { country: "Gabon", code: "+241" },
  { country: "Gambia", code: "+220" },
  { country: "Georgia", code: "+995" },
  { country: "Germany", code: "+49" },
  { country: "Ghana", code: "+233" },
  { country: "Gibraltar", code: "+350" },
  { country: "Greece", code: "+30" },
  { country: "Greenland", code: "+299" },
  { country: "Grenada", code: "+1" },
  { country: "Guadeloupe", code: "+590" },
  { country: "Guam", code: "+1" },
  { country: "Guatemala", code: "+502" },
  { country: "Guernsey", code: "+44" },
  { country: "Guinea", code: "+224" },
  { country: "Guinea-Bissau", code: "+245" },
  { country: "Guyana", code: "+592" },
  { country: "Haiti", code: "+509" },
  { country: "Honduras", code: "+504" },
  { country: "Hong Kong", code: "+852" },
  { country: "Hungary", code: "+36" },
  { country: "Iceland", code: "+354" },
  { country: "India", code: "+91" },
  { country: "Indonesia", code: "+62" },
  { country: "Iran", code: "+98" },
  { country: "Iraq", code: "+964" },
  { country: "Ireland", code: "+353" },
  { country: "Isle of Man", code: "+44" },
  { country: "Israel", code: "+972" },
  { country: "Italy", code: "+39" },
  { country: "Jamaica", code: "+1" },
  { country: "Japan", code: "+81" },
  { country: "Jersey", code: "+44" },
  { country: "Jordan", code: "+962" },
  { country: "Kazakhstan", code: "+7" },
  { country: "Kenya", code: "+254" },
  { country: "Kiribati", code: "+686" },
  { country: "Kosovo", code: "+383" },
  { country: "Kuwait", code: "+965" },
  { country: "Kyrgyzstan", code: "+996" },
  { country: "Laos", code: "+856" },
  { country: "Latvia", code: "+371" },
  { country: "Lebanon", code: "+961" },
  { country: "Lesotho", code: "+266" },
  { country: "Liberia", code: "+231" },
  { country: "Libya", code: "+218" },
  { country: "Liechtenstein", code: "+423" },
  { country: "Lithuania", code: "+370" },
  { country: "Luxembourg", code: "+352" },
  { country: "Macau", code: "+853" },
  { country: "Madagascar", code: "+261" },
  { country: "Malawi", code: "+265" },
  { country: "Malaysia", code: "+60" },
  { country: "Maldives", code: "+960" },
  { country: "Mali", code: "+223" },
  { country: "Malta", code: "+356" },
  { country: "Marshall Islands", code: "+692" },
  { country: "Martinique", code: "+596" },
  { country: "Mauritania", code: "+222" },
  { country: "Mauritius", code: "+230" },
  { country: "Mayotte", code: "+262" },
  { country: "Mexico", code: "+52" },
  { country: "Moldova", code: "+373" },
  { country: "Monaco", code: "+377" },
  { country: "Mongolia", code: "+976" },
  { country: "Montenegro", code: "+382" },
  { country: "Montserrat", code: "+1" },
  { country: "Morocco", code: "+212" },
  { country: "Mozambique", code: "+258" },
  { country: "Myanmar", code: "+95" },
  { country: "Namibia", code: "+264" },
  { country: "Nauru", code: "+674" },
  { country: "Nepal", code: "+977" },
  { country: "Netherlands", code: "+31" },
  { country: "New Caledonia", code: "+687" },
  { country: "New Zealand", code: "+64" },
  { country: "Nicaragua", code: "+505" },
  { country: "Niger", code: "+227" },
  { country: "Nigeria", code: "+234" },
  { country: "Niue", code: "+683" },
  { country: "Norfolk Island", code: "+672" },
  { country: "North Korea", code: "+850" },
  { country: "North Macedonia", code: "+389" },
  { country: "Northern Mariana Islands", code: "+1" },
  { country: "Norway", code: "+47" },
  { country: "Oman", code: "+968" },
  { country: "Pakistan", code: "+92" },
  { country: "Palau", code: "+680" },
  { country: "Palestine", code: "+970" },
  { country: "Panama", code: "+507" },
  { country: "Papua New Guinea", code: "+675" },
  { country: "Paraguay", code: "+595" },
  { country: "Peru", code: "+51" },
  { country: "Philippines", code: "+63" },
  { country: "Pitcairn Islands", code: "+64" },
  { country: "Poland", code: "+48" },
  { country: "Portugal", code: "+351" },
  { country: "Puerto Rico", code: "+1" },
  { country: "Qatar", code: "+974" },
  { country: "Republic of the Congo", code: "+242" },
  { country: "Romania", code: "+40" },
  { country: "Russia", code: "+7" },
  { country: "Rwanda", code: "+250" },
  { country: "Réunion", code: "+262" },
  { country: "Saint Barthélemy", code: "+590" },
  { country: "Saint Helena", code: "+290" },
  { country: "Saint Kitts and Nevis", code: "+1" },
  { country: "Saint Lucia", code: "+1" },
  { country: "Saint Martin", code: "+590" },
  { country: "Saint Pierre and Miquelon", code: "+508" },
  { country: "Saint Vincent and the Grenadines", code: "+1" },
  { country: "Samoa", code: "+685" },
  { country: "San Marino", code: "+378" },
  { country: "Saudi Arabia", code: "+966" },
  { country: "Senegal", code: "+221" },
  { country: "Serbia", code: "+381" },
  { country: "Seychelles", code: "+248" },
  { country: "Sierra Leone", code: "+232" },
  { country: "Singapore", code: "+65" },
  { country: "Sint Maarten", code: "+1" },
  { country: "Slovakia", code: "+421" },
  { country: "Slovenia", code: "+386" },
  { country: "Solomon Islands", code: "+677" },
  { country: "Somalia", code: "+252" },
  { country: "South Africa", code: "+27" },
  { country: "South Georgia", code: "+500" },
  { country: "South Korea", code: "+82" },
  { country: "South Sudan", code: "+211" },
  { country: "Spain", code: "+34" },
  { country: "Sri Lanka", code: "+94" },
  { country: "Sudan", code: "+249" },
  { country: "Suriname", code: "+597" },
  { country: "Svalbard and Jan Mayen", code: "+47" },
  { country: "Sweden", code: "+46" },
  { country: "Switzerland", code: "+41" },
  { country: "Syria", code: "+963" },
  { country: "São Tomé and Príncipe", code: "+239" },
  { country: "Taiwan", code: "+886" },
  { country: "Tajikistan", code: "+992" },
  { country: "Tanzania", code: "+255" },
  { country: "Thailand", code: "+66" },
  { country: "Timor-Leste", code: "+670" },
  { country: "Togo", code: "+228" },
  { country: "Tokelau", code: "+690" },
  { country: "Tonga", code: "+676" },
  { country: "Trinidad and Tobago", code: "+1" },
  { country: "Tristan da Cunha", code: "+290" },
  { country: "Tunisia", code: "+216" },
  { country: "Turkey", code: "+90" },
  { country: "Turkmenistan", code: "+993" },
  { country: "Turks and Caicos Islands", code: "+1" },
  { country: "Tuvalu", code: "+688" },
  { country: "U.S. Virgin Islands", code: "+1" },
  { country: "Uganda", code: "+256" },
  { country: "Ukraine", code: "+380" },
  { country: "United Arab Emirates", code: "+971" },
  { country: "United States", code: "+1" },
  { country: "Uruguay", code: "+598" },
  { country: "Uzbekistan", code: "+998" },
  { country: "Vanuatu", code: "+678" },
  { country: "Vatican City", code: "+39" },
  { country: "Venezuela", code: "+58" },
  { country: "Vietnam", code: "+84" },
  { country: "Wallis and Futuna", code: "+681" },
  { country: "Western Sahara", code: "+212" },
  { country: "Yemen", code: "+967" },
  { country: "Zambia", code: "+260" },
  { country: "Zimbabwe", code: "+263" },
  { country: "Åland Islands", code: "+358" },
];

function combineDialCode(codeOption, number) {
  const cleanNumber = String(number || '').trim();
  const dialCode = String(codeOption || '').split('|').pop() || '';

  if (!cleanNumber) return '';
  if (cleanNumber.startsWith('+')) return cleanNumber;

  return `${dialCode} ${cleanNumber}`.trim();
}

const PHONE_COUNTRY_ALIASES = {
  'Congo (Congo-Brazzaville)': 'Republic of the Congo',
  'Czechia (Czech Republic)': 'Czech Republic',
  'Eswatini (fmr. Swaziland)': 'Eswatini',
  'Holy See': 'Vatican City',
  'Micronesia': 'Federated States of Micronesia',
  'Myanmar (formerly Burma)': 'Myanmar',
  'Palestine State': 'Palestine',
  'Sao Tome and Principe': 'São Tomé and Príncipe',
  'United States of America': 'United States',
};

function getPhoneCodeOptionForCountry(countryName) {
  const phoneCountry = PHONE_COUNTRY_ALIASES[countryName] || countryName;
  const match = PHONE_CODES.find(item => item.country === phoneCountry);
  return match ? `${match.country}|${match.code}` : null;
}

const CURRENCY_SYMBOLS = {
  GBP: '£',
  EURO: '€',
  DOLLAR: '$',
};

let recaptchaScriptPromise = null;

function loadRecaptchaV2Script() {
  if (window.grecaptcha?.render) {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    const scriptId = 'navsa-google-recaptcha-v2';
    let settled = false;
    let pollTimer = null;
    let timeoutTimer = null;

    const cleanupTimers = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
      }

      if (timeoutTimer !== null) {
        window.clearTimeout(timeoutTimer);
      }
    };

    const resolveWhenReady = () => {
      if (settled || !window.grecaptcha?.render) {
        return;
      }

      settled = true;
      cleanupTimers();
      resolve(window.grecaptcha);
    };

    const rejectLoad = () => {
      if (settled) {
        return;
      }

      settled = true;
      cleanupTimers();
      reject(new Error('Google reCAPTCHA could not be loaded.'));
    };

    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', resolveWhenReady, { once: true });
    script.addEventListener('error', rejectLoad, { once: true });

    // Polling prevents a blank widget when the script finishes loading before
    // React attaches its load listener, including React StrictMode development.
    pollTimer = window.setInterval(resolveWhenReady, 100);
    timeoutTimer = window.setTimeout(rejectLoad, 15000);

    resolveWhenReady();
  }).catch(error => {
    // Allow a later retry after a temporary network or extension failure.
    recaptchaScriptPromise = null;
    throw error;
  });

  return recaptchaScriptPromise;
}

function RecaptchaCheckbox({ siteKey, onTokenChange, resetCounter }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbackRef = useRef(onTokenChange);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    callbackRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return undefined;
    }

    let cancelled = false;
    setLoadError('');

    loadRecaptchaV2Script()
      .then(grecaptcha => {
        if (
          cancelled ||
          !containerRef.current ||
          widgetIdRef.current !== null
        ) {
          return;
        }

        try {
          widgetIdRef.current = grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            theme: 'light',
            size: 'normal',
            callback: token => callbackRef.current(token),
            'expired-callback': () => callbackRef.current(''),
            'error-callback': () => {
              callbackRef.current('');
              setLoadError(
                'Google reCAPTCHA had a connection problem. Please refresh the page and try again.'
              );
            },
          });
        } catch (error) {
          console.error('Unable to render Google reCAPTCHA:', error);
          setLoadError(
            'Google reCAPTCHA could not be displayed. Please refresh the page and check the browser console.'
          );
        }
      })
      .catch(error => {
        if (cancelled) {
          return;
        }

        console.error('Unable to load Google reCAPTCHA:', error);
        setLoadError(
          'Google reCAPTCHA could not load. Disable any ad/privacy blocker for localhost and refresh the page.'
        );
      });

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  useEffect(() => {
    if (
      widgetIdRef.current !== null &&
      window.grecaptcha?.reset
    ) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
        callbackRef.current('');
      } catch (error) {
        console.error('Unable to reset Google reCAPTCHA:', error);
      }
    }
  }, [resetCounter]);

  return (
    <>
      <div ref={containerRef} className="recaptcha-widget" />
      {loadError && (
        <p className="recaptcha-config-error" role="alert">
          {loadError}
        </p>
      )}
    </>
  );
}

function BecomeCustomer() {
  const [isCriteriaConfirmed, setIsCriteriaConfirmed] = useState(false);
  const [isSingleTickChecked, setIsSingleTickChecked] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    confirm_email: '',
    password: '',
    confirm_password: '',
    region: '',
    country: '',
    position: '',
    registered_company_name: '',
    company_registration_number: '',
    vat_number: '',
    trading_years: '',
    business_nature: '',
    website: '',
    director_name: '',
    currency: '',
    registered_phone_code: 'United Kingdom|+44',
    registered_phone: '',
    mobile_code: 'United Kingdom|+44',
    mobile: '',
    whatsapp_offers_opt_in: false,
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    zip_code: '',
    account_name: '',
    account_email: '',
    other_wholesalers: '',
    average_order_value: '',
    turnover: '',
    import_full_containers: '',
    brands_interested: '',
    categories_interested: [],
    eori_number: '',
    terms_accepted: false,
    consent_emails: false,
    same_as_billing: true,
    shipping_address_line_1: '',
    shipping_address_line_2: '',
    shipping_city: '',
    shipping_province: '',
    shipping_zip_code: '',
    shipping_country: '',
    shipping_telephone_code: 'United Kingdom|+44',
    shipping_telephone: '',
  });

  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'
  const [validationError, setValidationError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaResetCounter, setRecaptchaResetCounter] = useState(0);
  const recaptchaSiteKey = String(
    import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''
  ).trim();

  useEffect(() => {
    if (status !== 'success') return undefined;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [status]);
  const isUkCustomer = formData.region === 'UK' || formData.country === 'United Kingdom';
  const currencySymbol = CURRENCY_SYMBOLS[formData.currency] || '';

  const averageOrderOptions = currencySymbol
    ? [
        `${currencySymbol}5,000 - ${currencySymbol}10,000 (UK & Europe only)`,
        `${currencySymbol}10,000 - ${currencySymbol}20,000`,
        `${currencySymbol}20,000 - ${currencySymbol}40,000`,
        `${currencySymbol}40,000+`,
      ]
    : [];

  const turnoverOptions = currencySymbol
    ? [
        `${currencySymbol}0 - ${currencySymbol}500,000`,
        `${currencySymbol}500,000 - ${currencySymbol}1,000,000`,
        `${currencySymbol}1,000,000 - ${currencySymbol}5,000,000`,
        `${currencySymbol}5,000,000 - ${currencySymbol}10,000,000`,
        `${currencySymbol}20,000,000+`,
      ]
    : [];
  const countriesList = PHONE_CODES.map(({ country }) => country);

  const [categories, setCategories] = useState([]);


  useEffect(() => {
    async function loadCategories() {
      try {
        const BASE = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${BASE}/categories`);
        if (response.ok) {
          const data = await response.json();
          const categoryList = Array.isArray(data)
            ? data.map(item => (typeof item === 'string' ? item : item.category_name || item.name)).filter(Boolean)
            : [];

          if (categoryList.length > 0) {
            setCategories(categoryList);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories from DB:', err);
      }

      // Default categories fallback
      setCategories([
        'Chocolates', 'Groceries', 'Confectionery', 'Crisps & Snacks',
        'Cold and Hot Beverages', 'Biscuits', 'Seasonal', 'Chilled Items',
        'Frozen', 'Baby and Kids', 'Health and Personal Care', 'Pet Care and Food',
        'Cleaning & Households'
      ]);
    }

    loadCategories();
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (validationError) {
      setValidationError('');
    }

    if (status === 'error') {
      setStatus(null);
    }
    if (type === 'checkbox' && name === 'categories_interested') {
      setFormData(prev => {
        const newCategories = checked
          ? [...prev.categories_interested, value]
          : prev.categories_interested.filter(c => c !== value);
        return { ...prev, categories_interested: newCategories };
      });
    } else if (type === 'checkbox') {
      setFormData(prev => {
        const next = { ...prev, [name]: checked };

        if (name === 'same_as_billing' && checked) {
          next.shipping_address_line_1 = '';
          next.shipping_address_line_2 = '';
          next.shipping_city = '';
          next.shipping_province = '';
          next.shipping_zip_code = '';
          next.shipping_country = '';
          next.shipping_telephone_code = 'United Kingdom|+44';
          next.shipping_telephone = '';
        }

        return next;
      });
    } else {
      setFormData(prev => {
        const next = { ...prev, [name]: value };

        if (name === 'region' && value === 'UK') {
          const ukPhoneCodeOption = getPhoneCodeOptionForCountry('United Kingdom');
          next.country = 'United Kingdom';

          if (ukPhoneCodeOption) {
            next.registered_phone_code = ukPhoneCodeOption;
            next.mobile_code = ukPhoneCodeOption;
          }
        }

        if (name === 'country') {
          const phoneCodeOption = getPhoneCodeOptionForCountry(value);
          if (phoneCodeOption) {
            next.registered_phone_code = phoneCodeOption;
            next.mobile_code = phoneCodeOption;
          }
        }

        if (name === 'shipping_country') {
          const shippingPhoneCodeOption = getPhoneCodeOptionForCountry(value);
          if (shippingPhoneCodeOption) {
            next.shipping_telephone_code = shippingPhoneCodeOption;
          }
        }

        if (name === 'currency') {
          next.average_order_value = '';
          next.turnover = '';
        }

        const nextIsUkCustomer = next.region === 'UK' || next.country === 'United Kingdom';
        if ((name === 'region' || name === 'country') && !nextIsUkCustomer) {
          next.vat_number = '';
        }

        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.email.trim() !== formData.confirm_email.trim()) {
      setValidationError('Email and Confirm Email must match.');
      document.getElementById('confirm-email')?.focus();
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setValidationError('Password and Confirm Password must match.');
      document.getElementById('confirm-password')?.focus();
      return;
    }

    if (formData.whatsapp_offers_opt_in && !formData.mobile.trim()) {
      setValidationError('Mobile Number is required when WhatsApp offers are selected.');
      document.querySelector('input[name="mobile"]')?.focus();
      return;
    }

    if (isUkCustomer && !formData.vat_number.trim()) {
      setValidationError('VAT Number is required for UK customers.');
      document.getElementById('vat-number')?.focus();
      return;
    }

    if (!formData.terms_accepted) {
      setValidationError('Please accept the Terms & Conditions.');
      return;
    }

    if (!recaptchaSiteKey) {
      setValidationError('Google reCAPTCHA is not configured. Please contact NAVSA support.');
      document.querySelector('.recaptcha-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    if (!recaptchaToken) {
      setValidationError('Please complete the Google reCAPTCHA verification.');
      document.querySelector('.recaptcha-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    const {
      confirm_password,
      registered_phone_code,
      mobile_code,
      shipping_telephone_code,
      ...submissionData
    } = formData;

    const payload = {
      ...submissionData,
      email: formData.email.trim(),
      confirm_email: formData.confirm_email.trim(),
      vat_number: isUkCustomer ? formData.vat_number.trim() : '',
      registered_phone: combineDialCode(
        registered_phone_code,
        formData.registered_phone
      ),
      mobile: combineDialCode(mobile_code, formData.mobile),
      whatsapp_offers_opt_in: Boolean(formData.whatsapp_offers_opt_in),
      shipping_country: formData.same_as_billing ? '' : formData.shipping_country,
      shipping_telephone: formData.same_as_billing
        ? ''
        : combineDialCode(shipping_telephone_code, formData.shipping_telephone),
      recaptcha_token: recaptchaToken,
    };

    setStatus('submitting');

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${BASE}/register-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const validationMessages = Object.values(
          errorPayload.errors || {}
        ).flat();

        throw new Error(
          validationMessages.join(' ') ||
          errorPayload.message ||
          'Registration failed. Please check your inputs.'
        );
      }

      setStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setValidationError(error.message);
      setStatus('error');
      setRecaptchaToken('');
      setRecaptchaResetCounter(current => current + 1);
    }
  };

  if (status === 'success') {
    return (
      <div className="become-customer-container success-state">
        <div className="success-card">
          <h2>Application Submitted!</h2>
          <p>Thank you for registering with NAVSA. Your application has been sent to our team for review.</p>
          <p>Once approved, your account will be activated, and you will be able to log in with the password you created.</p>
        </div>
      </div>
    );
  }

  if (!isCriteriaConfirmed) {
    return (
      <div className="become-customer-container">
        <div className="customer-form-wrapper eligibility-wrapper">
          <h1 className="form-title">Customer Registration Criteria</h1>
          <p className="eligibility-intro">
            Please Note: You need to meet the following criteria for us to be able to process your account.
          </p>

          <div className="form-instructions criteria-box">
            <ul className="criteria-list">
              <li>UK companies <strong>must be VAT registered</strong></li>
              <li>Your business is <strong>registered at a commercial property</strong>, not a home address</li>
              <li>Our minimum order is <strong>£5,000.00 for UK & Europe, £10,000.00 for ROW</strong></li>
              <li>You need to be <strong>trading for over 12 months</strong> for UK Customers</li>
            </ul>
          </div>

          <p className="application-accuracy-note">
            Please fill in the form accurately so we can process your account and customise your experience. If details or documents are incorrect, we will not be able to continue with your application.
          </p>

          <div className="single-tick-box">
            <label>
              <input
                type="checkbox"
                checked={isSingleTickChecked}
                onChange={(e) => setIsSingleTickChecked(e.target.checked)}
              />
              <span><strong>I confirm that my business meets all of the above eligibility criteria</strong></span>
            </label>
          </div>

          <button
            type="button"
            className="continue-btn"
            disabled={!isSingleTickChecked}
            onClick={() => setIsCriteriaConfirmed(true)}
          >
            Continue to Application Form →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="become-customer-container">
      <div className="customer-form-wrapper">
        <h1 className="form-title">Customer Application Form</h1>
        <div className="form-instructions confirmed-instructions">
          <div className="confirmed-badge">✓ Verified Eligibility Criteria</div>
          <ul className="criteria-list">
            <li>UK companies <strong>must be VAT registered</strong></li>
            <li>Your business is <strong>registered at a commercial property</strong>, not a home address</li>
            <li>Our minimum order is <strong>£5,000 for UK & Europe, £10,000 for ROW</strong></li>
            <li>You need to be <strong>trading for over 12 months</strong> for UK Customers</li>
          </ul>
        </div>

        {(validationError || status === 'error') && (
          <div className="error-message" role="alert">
            {validationError ||
              'There was an error submitting your application. Please ensure all required fields are filled correctly.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="customer-form" autoComplete="off">
          <div className="navsa-autofill-guard" aria-hidden="true">
            <input
              type="text"
              name="navsa_autofill_username_guard"
              autoComplete="username"
              tabIndex={-1}
            />
            <input
              type="password"
              name="navsa_autofill_password_guard"
              autoComplete="new-password"
              tabIndex={-1}
            />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>First Name *</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="first_name" required value={formData.first_name} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Last Name *</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="last_name" required value={formData.last_name} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label htmlFor="customer-email">Email *</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                id="customer-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label htmlFor="confirm-email">Confirm Email *</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                id="confirm-email"
                type="email"
                name="confirm_email"
                required
                value={formData.confirm_email}
                onChange={handleChange}
                aria-invalid={
                  Boolean(formData.confirm_email) &&
                  formData.email.trim() !== formData.confirm_email.trim()
                }
              />
              {formData.confirm_email &&
                formData.email.trim() !== formData.confirm_email.trim() && (
                  <p className="field-error">Email addresses do not match.</p>
                )}
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label htmlFor="customer-password">Password *</label>
              <input autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                id="customer-password"
                type="password"
                name="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label htmlFor="confirm-password">Confirm Password *</label>
              <input autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                id="confirm-password"
                type="password"
                name="confirm_password"
                required
                minLength="6"
                value={formData.confirm_password}
                onChange={handleChange}
                aria-invalid={
                  Boolean(formData.confirm_password) &&
                  formData.password !== formData.confirm_password
                }
              />
              {formData.confirm_password &&
                formData.password !== formData.confirm_password && (
                  <p className="field-error">Passwords do not match.</p>
                )}
            </div>
          </div>

          <div className="form-group">
            <label>What Region are you in? *</label>
            <div className="radio-group">
              <label><input type="radio" name="region" value="UK" onChange={handleChange} required/> UK</label>
              <label><input type="radio" name="region" value="Europe" onChange={handleChange} /> Europe</label>
              <label><input type="radio" name="region" value="International" onChange={handleChange} /> International</label>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Country *</label>
              <select name="country" required value={formData.country} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">- Select -</option>
                {countriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Your Position at the Company</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="position" value={formData.position} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>What is your registered company name? *</label>
            <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="registered_company_name" required value={formData.registered_company_name} onChange={handleChange} />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Company Registration Number</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                type="text"
                name="company_registration_number"
                value={formData.company_registration_number}
                onChange={handleChange}
              />
            </div>

            {isUkCustomer && (
              <div className="col">
                <label htmlFor="vat-number">VAT Number *</label>
                <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                  id="vat-number"
                  type="text"
                  name="vat_number"
                  required={isUkCustomer}
                  value={formData.vat_number}
                  onChange={handleChange}
                />
                <p className="phone-helper-text">Required for UK customers.</p>
              </div>
            )}
          </div>

          <div className="form-group row">
            <div className="col">
              <label>How many years have you been trading? *</label>
              <select name="trading_years" required value={formData.trading_years} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">- Select -</option>
                <option value="0-1">0-1</option>
                <option value="1-2">1-2</option>
                <option value="2-5">2-5</option>
                <option value="5+">5+</option>
              </select>
            </div>
            <div className="col">
              <label>What is the nature of your business *</label>
              <select name="business_nature" required value={formData.business_nature} onChange={handleChange} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}>
                <option value="">Please Select</option>
                <option value="Multiples">Multiples</option>
                <option value="Discount">Discount</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Retail">Retail</option>
                <option value="Traders">Traders</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Online">Online</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Website address</label>
            <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="website" placeholder="https://" value={formData.website} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Full name of the director of the business *</label>
            <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="director_name" required value={formData.director_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>If your account is successful what currency would you like to pay in? *</label>
            <div className="radio-group">
              <label><input type="radio" name="currency" value="GBP" onChange={handleChange} required/> GBP £</label>
              <label><input type="radio" name="currency" value="EURO" onChange={handleChange} /> EURO €</label>
              <label><input type="radio" name="currency" value="DOLLAR" onChange={handleChange} /> DOLLAR $</label>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Registered company phone number *</label>
              <div className="phone-input-group">
                <select
                  name="registered_phone_code"
                  value={formData.registered_phone_code}
                  onChange={handleChange}
                  aria-label="Registered company phone country code"
                >
                  {PHONE_CODES.map(({ country, code }) => (
                    <option
                      key={`${country}-${code}`}
                      value={`${country}|${code}`}
                    >
                      {country} ({code})
                    </option>
                  ))}
                </select>
                <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                  type="tel"
                  name="registered_phone"
                  required
                  inputMode="tel"
                  value={formData.registered_phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="col">
              <label>Mobile Number</label>
              <div className="phone-input-group">
                <select
                  name="mobile_code"
                  value={formData.mobile_code}
                  onChange={handleChange}
                  aria-label="Mobile phone country code"
                >
                  {PHONE_CODES.map(({ country, code }) => (
                    <option
                      key={`${country}-${code}`}
                      value={`${country}|${code}`}
                    >
                      {country} ({code})
                    </option>
                  ))}
                </select>
                <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                  type="tel"
                  name="mobile"
                  required={formData.whatsapp_offers_opt_in}
                  inputMode="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile number"
                />
              </div>
              <label className="whatsapp-opt-in-label">
                <input
                  type="checkbox"
                  name="whatsapp_offers_opt_in"
                  checked={formData.whatsapp_offers_opt_in}
                  onChange={handleChange}
                />
                <span>Check if you would like to receive offers via WhatsApp.</span>
              </label>
            </div>
          </div>

          <h3 className="section-title">Company Billing Address *</h3>
          <div className="form-group">
            <label>Address line 1</label>
            <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="address_line_1" required value={formData.address_line_1} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address line 2</label>
            <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="address_line_2" value={formData.address_line_2} onChange={handleChange} />
          </div>
          <div className="form-group row">
            <div className="col">
              <label>City/Town</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="city" required value={formData.city} onChange={handleChange} />
            </div>
            <div className="col">
              <label>State/Province</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="province" required value={formData.province} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col">
              <label>Zip code</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="zip_code" required value={formData.zip_code} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group checkbox-full">
            <label>
              <input type="checkbox" name="same_as_billing" checked={formData.same_as_billing} onChange={handleChange} />
              Shipping address is the same as Billing address
            </label>
          </div>

          {!formData.same_as_billing && (
            <div className="shipping-address-section">
              <h3 className="section-title">Shipping Address *</h3>
              <div className="form-group">
                <label>Shipping Address line 1</label>
                <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_address_line_1" required={!formData.same_as_billing} value={formData.shipping_address_line_1} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Shipping Address line 2</label>
                <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_address_line_2" value={formData.shipping_address_line_2} onChange={handleChange} />
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>Shipping City/Town</label>
                  <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_city" required={!formData.same_as_billing} value={formData.shipping_city} onChange={handleChange} />
                </div>
                <div className="col">
                  <label>Shipping State/Province</label>
                  <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_province" required={!formData.same_as_billing} value={formData.shipping_province} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group row">
                <div className="col">
                  <label>Shipping Zip code</label>
                  <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="shipping_zip_code" required={!formData.same_as_billing} value={formData.shipping_zip_code} onChange={handleChange} />
                </div>
                <div className="col">
                  <label>Shipping Country *</label>
                  <select
                    name="shipping_country"
                    required={!formData.same_as_billing}
                    value={formData.shipping_country}
                    onChange={handleChange}
                    style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', fontSize: '1rem', boxSizing: 'border-box' }}
                  >
                    <option value="">- Select -</option>
                    {countriesList.map(c => (
                      <option key={`shipping-${c}`} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Shipping Telephone *</label>
                <div className="phone-input-group shipping-phone-input-group">
                  <select
                    name="shipping_telephone_code"
                    value={formData.shipping_telephone_code}
                    onChange={handleChange}
                    aria-label="Shipping telephone country code"
                  >
                    {PHONE_CODES.map(({ country, code }) => (
                      <option
                        key={`shipping-phone-${country}-${code}`}
                        value={`${country}|${code}`}
                      >
                        {country} ({code})
                      </option>
                    ))}
                  </select>
                  <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none"
                    type="tel"
                    name="shipping_telephone"
                    required={!formData.same_as_billing}
                    inputMode="tel"
                    value={formData.shipping_telephone}
                    onChange={handleChange}
                    placeholder="Shipping telephone number"
                  />
                </div>
              </div>
            </div>
          )}

          <h3 className="section-title">Accounts Information</h3>
          <div className="form-group row">
            <div className="col">
              <label>Accounts Name *</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="account_name" required value={formData.account_name} onChange={handleChange} />
            </div>
            <div className="col">
              <label>Accounts Email Address *</label>
              <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="email" name="account_email" required value={formData.account_email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Do you currently work with any other wholesalers?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="other_wholesalers"
                  value="Yes"
                  checked={formData.other_wholesalers === 'Yes'}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="other_wholesalers"
                  value="No"
                  checked={formData.other_wholesalers === 'No'}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Average Order Value *</label>
              <select
                name="average_order_value"
                required
                disabled={!formData.currency}
                value={formData.average_order_value}
                onChange={handleChange}
              >
                <option value="">
                  {formData.currency ? 'Please Select' : 'Select currency first'}
                </option>
                {averageOrderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="col">
              <label>Company Turnover *</label>
              <select
                name="turnover"
                required
                disabled={!formData.currency}
                value={formData.turnover}
                onChange={handleChange}
              >
                <option value="">
                  {formData.currency ? 'Please Select' : 'Select currency first'}
                </option>
                {turnoverOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Do you import full containers or pallets from the UK? *</label>
            <div className="radio-group">
              <label><input type="radio" name="import_full_containers" value="Containers" onChange={handleChange} required/> Yes - Containers</label>
              <label><input type="radio" name="import_full_containers" value="Pallets" onChange={handleChange} /> Yes - Pallets</label>
              <label><input type="radio" name="import_full_containers" value="Cases" onChange={handleChange} /> No - I order by cases</label>
            </div>
          </div>

          <div className="form-group">
            <label>What brands are you interested in?</label>
            <input
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              aria-autocomplete="none"
              type="text"
              name="brands_interested"
              placeholder="Comma-separated"
              value={formData.brands_interested}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>What categories are you interested in? * (Select all that apply)</label>
            <div className="checkbox-grid">
              {categories.map(cat => (
                <label key={cat}>
                  <input type="checkbox" name="categories_interested" value={cat} onChange={handleChange} /> {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>EORI Number (EU ONLY)</label>
            <input autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" aria-autocomplete="none" type="text" name="eori_number" value={formData.eori_number} onChange={handleChange} />
          </div>

          <div className="form-group checkbox-full">
            <label>
              <input type="checkbox" name="terms_accepted" required checked={formData.terms_accepted} onChange={handleChange} />
              I have read the Terms & Conditions *
            </label>
            <p className="sub-text">Please tick the above to show you have read and accepted our terms and conditions</p>
          </div>

          <div className="form-group checkbox-full">
            <label>
              <input type="checkbox" name="consent_emails" checked={formData.consent_emails} onChange={handleChange} />
              I consent to receive emails for offers and new product updates. *
            </label>
          </div>

          <div className="recaptcha-section">
            {recaptchaSiteKey ? (
              <RecaptchaCheckbox
                siteKey={recaptchaSiteKey}
                onTokenChange={setRecaptchaToken}
                resetCounter={recaptchaResetCounter}
              />
            ) : (
              <p className="recaptcha-config-error" role="alert">
                Google reCAPTCHA is not configured for this website.
              </p>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
          </button>

          <p className="privacy-submit-note">
            By clicking submit you are saving your details and you are agreeing to our Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}

export default BecomeCustomer;