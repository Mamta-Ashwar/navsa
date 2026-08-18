import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BecomeSupplier.css';

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

function getPhoneCodeOptionForCountry(countryName) {
  const match = PHONE_CODES.find(item => item.country === countryName);
  return match ? `${match.country}|${match.code}` : null;
}


function BecomeSupplier() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_code: 'United Kingdom|+44',
    mobile_phone: '',
    business_phone_code: 'United Kingdom|+44',
    business_phone: '',
    company_name: '',
    company_type: '',
    company_registration_number: '',
    website_url: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: '',
    country: 'United Kingdom',
    postcode: '',
    additional_comments: '',
    categories_supplied: [],
    consent_news: false,
    consent_marketing: false,
    contact_time: [],
    terms_accepted: false,
  });

  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'

  useEffect(() => {
    if (status !== 'success') return undefined;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [status]);

  const categories = [
    'Chocolates',
    'Groceries',
    'Confectionery',
    'Crisps & Snacks',
    'Cold and Hot Beverages',
    'Biscuits',
    'Seasonal',
    'Chilled Items',
    'Frozen',
    'Baby and Kids',
    'Health and Personal Care',
    'Pet Care and Food',
    'Cleaning & Households'
  ];

  const contactTimes = [
    'Before 9am',
    'Between 9am-12pm',
    'Between 12pm-5pm',
    'After 5pm',
    'No Preference'
  ];

  const companyTypes = [
    'Limited Company',
    'Sole Trader',
    'Partnership',
    'Public Limited Company (PLC)',
    'Other'
  ];

  const countriesList = PHONE_CODES.map(({ country }) => country);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'categories_supplied') {
      setFormData(prev => {
        const newCats = checked 
          ? [...prev.categories_supplied, value]
          : prev.categories_supplied.filter(c => c !== value);
        return { ...prev, categories_supplied: newCats };
      });
    } else if (type === 'checkbox' && name === 'contact_time') {
      setFormData(prev => {
        const newTimes = checked 
          ? [...prev.contact_time, value]
          : prev.contact_time.filter(t => t !== value);
        return { ...prev, contact_time: newTimes };
      });
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => {
        const next = { ...prev, [name]: value };

        if (name === 'country') {
          const phoneCodeOption = getPhoneCodeOptionForCountry(value);
          if (phoneCodeOption) {
            next.phone_code = phoneCodeOption;
            next.business_phone_code = phoneCodeOption;
          }
        }

        return next;
      });
    }
  };

  const triggerFieldBlinkAndScroll = (targetElement) => {
    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });

    targetElement.classList.remove('invalid-blink');
    void targetElement.offsetWidth;
    targetElement.classList.add('invalid-blink');

    const inputToFocus =
      targetElement.tagName === 'INPUT' ||
      targetElement.tagName === 'SELECT' ||
      targetElement.tagName === 'TEXTAREA'
        ? targetElement
        : targetElement.querySelector('input, select, textarea');

    if (inputToFocus) {
      try {
        inputToFocus.focus({ preventScroll: true });
      } catch (err) {
        // ignore
      }
    }

    setTimeout(() => {
      targetElement.classList.remove('invalid-blink');
    }, 2800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="first_name"]'));
      return;
    }
    if (!formData.last_name.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="last_name"]'));
      return;
    }
    if (!formData.email.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="email"]'));
      return;
    }
    if (!formData.company_name.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="company_name"]'));
      return;
    }
    if (!formData.address_line_1.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="address_line_1"]'));
      return;
    }
    if (!formData.city.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="city"]'));
      return;
    }
    if (!formData.county.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="county"]'));
      return;
    }
    if (!formData.country) {
      triggerFieldBlinkAndScroll(document.querySelector('select[name="country"]'));
      return;
    }
    if (!formData.postcode.trim()) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="postcode"]'));
      return;
    }
    if (!formData.terms_accepted) {
      triggerFieldBlinkAndScroll(document.querySelector('input[name="terms_accepted"]')?.closest('.checkbox-full'));
      return;
    }

    setStatus('submitting');
    
    const {
      phone_code,
      business_phone_code,
      ...supplierData
    } = formData;

    const submissionData = {
      ...supplierData,
      mobile_phone: combineDialCode(phone_code, formData.mobile_phone),
      business_phone: combineDialCode(
        business_phone_code,
        formData.business_phone
      ),
      password: formData.password || 'NavsaSupplier123!',
    };

    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${BASE}/register-supplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Supplier registration failed.');
      }
      setStatus('success');
    } catch (error) {
      console.error('Error submitting supplier form:', error);
      alert(error.message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="become-supplier-container success-state">
        <div className="success-card supplier-success-card">

          <span className="supplier-success-eyebrow">Application received</span>
          <h2>Application Submitted Successfully!</h2>
          <p>Thank you for submitting your details. We have received your supplier application.</p>
          <p>Please wait for approval of your account. You will be notified when able to login.</p>
          <p>You can return to the <Link to="/">Home Page</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="become-supplier-container">
      <div className="supplier-form-wrapper">
        <div className="supplier-form-header">
          <span className="supplier-form-eyebrow">Partner with NAVSA</span>
          <h1 className="form-title">Supplier Application Form</h1>
          <p className="supplier-intro">
            Please enter your contact and business information below to register as a NAVSA supplier.
          </p>
        </div>

        {status === 'error' && (
          <div className="error-message">
            There was an error submitting your supplier registration. Please ensure all required fields are filled correctly.
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="supplier-form" autoComplete="off">
          <div className="supplier-autofill-guard" aria-hidden="true">
            <input type="text" name="supplier_autofill_username_guard" autoComplete="username" tabIndex={-1} />
            <input type="password" name="supplier_autofill_password_guard" autoComplete="new-password" tabIndex={-1} />
          </div>
          
          <h3 className="section-title">Personal Information</h3>
          
          <div className="form-group row">
            <div className="col">
              <label>First Name *</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="first_name" 
                required 
                value={formData.first_name} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Last Name *</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="last_name" 
                required 
                value={formData.last_name} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <h3 className="section-title">Contact Information</h3>

          <div className="form-group row">
            <div className="col">
              <label>Email Address *</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Mobile Phone Number</label>
              <div className="phone-input-group">
                <select 
                  name="phone_code" 
                  value={formData.phone_code} 
                  onChange={handleChange}
                  className="phone-code-select"
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
                <input
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  aria-autocomplete="none"
                  type="text" 
                  name="mobile_phone" 
                  placeholder="7123 456789" 
                  value={formData.mobile_phone} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Business Phone Number</label>
            <div className="phone-input-group">
              <select
                name="business_phone_code"
                value={formData.business_phone_code}
                onChange={handleChange}
                className="phone-code-select"
                aria-label="Business phone country code"
              >
                {PHONE_CODES.map(({ country, code }) => (
                  <option
                    key={`business-phone-${country}-${code}`}
                    value={`${country}|${code}`}
                  >
                    {country} ({code})
                  </option>
                ))}
              </select>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text"
                name="business_phone"
                placeholder="114 244 0887"
                value={formData.business_phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 className="section-title">Company Information</h3>

          <div className="form-group row">
            <div className="col">
              <label>Company Name *</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="company_name" 
                required 
                value={formData.company_name} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Select Company Type</label>
              <select 
                name="company_type" 
                value={formData.company_type} 
                onChange={handleChange}
              >
                <option value="">-- Select Type --</option>
                {companyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Company Registration Number</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="company_registration_number" 
                value={formData.company_registration_number} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>Website URL</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="website_url" 
                placeholder="www." 
                value={formData.website_url} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <h3 className="section-title">Address Information</h3>

          <div className="form-group">
            <label>Address Line 1 *</label>
            <input
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              aria-autocomplete="none"
              type="text" 
              name="address_line_1" 
              required 
              value={formData.address_line_1} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Address Line 2</label>
            <input
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              aria-autocomplete="none"
              type="text" 
              name="address_line_2" 
              value={formData.address_line_2} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>City *</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="city" 
                required 
                value={formData.city} 
                onChange={handleChange} 
              />
            </div>
            <div className="col">
              <label>County *</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="county" 
                required 
                value={formData.county} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Country *</label>
              <select 
                name="country" 
                required 
                value={formData.country} 
                onChange={handleChange}
              >
                {countriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <label>Postcode *</label>
              <input
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                aria-autocomplete="none"
                type="text" 
                name="postcode" 
                required 
                value={formData.postcode} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Additional Comments</label>
            <input
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              aria-autocomplete="none"
              type="text" 
              name="additional_comments" 
              value={formData.additional_comments} 
              onChange={handleChange} 
            />
          </div>

          <h3 className="section-title">What You Supply</h3>
          <p className="sub-text" style={{ marginLeft: 0, marginBottom: 12 }}>
            Please tick the areas your company deals with (select all that apply):
          </p>
          <div className="checkbox-grid">
            {categories.map(cat => (
              <label key={cat}>
                <input 
                  type="checkbox" 
                  name="categories_supplied" 
                  value={cat} 
                  checked={formData.categories_supplied.includes(cat)}
                  onChange={handleChange} 
                />
                {cat}
              </label>
            ))}
          </div>

          <h3 className="section-title">Contact Preferences</h3>
          <div className="form-group checkbox-full">
            <label>
              <input 
                type="checkbox" 
                name="consent_news" 
                checked={formData.consent_news}
                onChange={handleChange} 
              />
              News & Updates (Important company information such as seasonal opening times and attendance at trade shows)
            </label>
          </div>
          <div className="form-group checkbox-full">
            <label>
              <input 
                type="checkbox" 
                name="consent_marketing" 
                checked={formData.consent_marketing}
                onChange={handleChange} 
              />
              Marketing Mailers (Promotional information about our categories and brands, website campaigns and discount codes)
            </label>
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label style={{ fontWeight: 600 }}>Preferred Time to Contact You</label>
            <div className="checkbox-grid" style={{ marginTop: 8 }}>
              {contactTimes.map(time => (
                <label key={time}>
                  <input 
                    type="checkbox" 
                    name="contact_time" 
                    value={time} 
                    checked={formData.contact_time.includes(time)}
                    onChange={handleChange} 
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>

          <h3 className="section-title">Terms & Conditions</h3>
          <div className="terms-container">
            <p className="terms-paragraph">
              We want you to know exactly how our service works and why we need your registration details. Please state that you have read and agreed to these terms before you continue. You must accept these <Link to="/terms" target="_blank" rel="noreferrer">Terms and Conditions</Link> by ticking the box below.
            </p>
            <p className="terms-paragraph" style={{ marginTop: 8 }}>
              We use email and targeted online advertising to send you product and service updates, promotional offers, and other marketing communications based on the information we collect about you, such as your email address, general location, and purchase and website browsing history.
            </p>
            <p className="terms-paragraph" style={{ marginTop: 8 }}>
              We process your personal data as stated in our <Link to="/privacy" target="_blank" rel="noreferrer">Privacy Policy</Link>. You may withdraw your consent or manage your preferences at any time by clicking the unsubscribe link at the bottom of any of our marketing emails, or by emailing us at <a href="mailto:sales@navsainternational.com">sales@navsainternational.com</a>.
            </p>
          </div>

          <div className="form-group checkbox-full">
            <label>
              <input 
                type="checkbox" 
                name="terms_accepted" 
                required
                checked={formData.terms_accepted}
                onChange={handleChange} 
              />
              I agree to the Terms & Conditions *
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Submitting Application...' : 'Submit Application'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default BecomeSupplier;