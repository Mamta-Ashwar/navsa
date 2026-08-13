import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CheckCircle, Eye, UserCheck, XCircle } from 'lucide-react';
import NoticeModal from '../../components/NoticeModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  approveRegistration,
  getRegistrations,
  rejectRegistration,
} from '../../services/adminApi';

const REGISTRATION_TABS = [
  { key: 'customer', label: 'Customer Registrations' },
  { key: 'supplier', label: 'Supplier Registrations' },
];

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
};

const displayList = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'N/A';

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.length ? parsed.join(', ') : 'N/A';
    } catch {
      // The database may already return a normal string.
    }
  }

  return displayValue(value);
};

const whatsappOptInText = (detail) => {
  const optedIn = detail?.whatsapp_offers_opt_in === true
    || detail?.whatsapp_offers_opt_in === 1
    || detail?.whatsapp_offers_opt_in === '1';

  if (optedIn) return 'Yes';
  if (detail?.whatsapp_offers_phone) return 'Yes (legacy WhatsApp number saved)';
  return 'No';
};

const registrationType = (registration) => {
  if (registration?.registration_type === 'supplier') return 'supplier';
  if (registration?.registration_type === 'customer') return 'customer';
  if (registration?.supplier_detail) return 'supplier';
  if (String(registration?.role || '').toLowerCase() === 'supplier') return 'supplier';
  return 'customer';
};

function DetailSection({ title, children, fullWidth = false }) {
  return (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : undefined}>
      <h3 style={{ marginBottom: '10px' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function AdminRegistrations() {
  const [activeTab, setActiveTab] = useState('customer');
  const [registrations, setRegistrations] = useState({ customer: [], supplier: [] });
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, action: null, type: 'customer' });
  const [notice, setNotice] = useState({ open: false, title: '', message: '', type: 'success' });

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');

    try {
      const [customers, suppliers] = await Promise.all([
        getRegistrations('customer'),
        getRegistrations('supplier'),
      ]);

      setRegistrations({
        customer: Array.isArray(customers) ? customers : [],
        supplier: Array.isArray(suppliers) ? suppliers : [],
      });
    } catch (fetchError) {
      console.error('Failed to fetch registrations', fetchError);
      setError(fetchError.message || 'Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const visibleRegistrations = useMemo(
    () => registrations[activeTab] || [],
    [activeTab, registrations],
  );

  const activeTypeLabel = activeTab === 'supplier' ? 'Supplier' : 'Customer';
  const activeTypeLabelLower = activeTypeLabel.toLowerCase();
  const ActiveHeadingIcon = activeTab === 'supplier' ? Building2 : UserCheck;

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedReg(null);
    setConfirmDialog({ open: false, id: null, action: null, type: tab });
  };

  const requestRegistrationAction = (registration, action) => {
    setConfirmDialog({
      open: true,
      id: registration.id,
      action,
      type: registrationType(registration),
    });
  };

  const closeConfirmation = () => {
    if (processing) return;
    setConfirmDialog({ open: false, id: null, action: null, type: activeTab });
  };

  const processRegistration = async () => {
    const { id, action, type } = confirmDialog;
    if (!id || !action) return;

    const verb = action === 'approve' ? 'approve' : 'reject';
    const typeLabel = type === 'supplier' ? 'supplier' : 'customer';
    setProcessing(true);

    try {
      if (action === 'approve') {
        await approveRegistration(id);
      } else {
        await rejectRegistration(id);
      }

      setConfirmDialog({ open: false, id: null, action: null, type });
      setSelectedReg(null);
      await fetchRegistrations();
      setNotice({
        open: true,
        title: action === 'approve' ? 'Registration Approved' : 'Registration Rejected',
        message: action === 'approve'
          ? `The ${typeLabel} registration has been approved successfully.`
          : `The ${typeLabel} registration has been rejected successfully.`,
        type: 'success',
      });
    } catch (actionError) {
      console.error(`${action} error`, actionError);
      setConfirmDialog({ open: false, id: null, action: null, type });
      setNotice({
        open: true,
        title: 'Unable to Update Registration',
        message: actionError.message || `Failed to ${verb} registration.`,
        type: 'error',
      });
    } finally {
      setProcessing(false);
    }
  };

  const detail = selectedReg?.customer_detail;
  const supplierDetail = selectedReg?.supplier_detail;
  const selectedType = registrationType(selectedReg);
  const confirmationType = confirmDialog.type === 'supplier' ? 'supplier' : 'customer';
  const confirmationTypeLabel = confirmationType === 'supplier' ? 'Supplier' : 'Customer';

  return (
    <div className="admin-registrations registration-page">
      <div className="registration-page__header">
        <div>
          <h1>Registrations</h1>
          <p>Review and process pending customer and supplier applications.</p>
        </div>
      </div>

      <div className="registration-tabs" role="tablist" aria-label="Registration type">
        {REGISTRATION_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => switchTab(tab.key)}
            className={`admin-btn ${activeTab === tab.key ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          >
            {tab.label}
            <span className="registration-tab-count">{registrations[tab.key]?.length || 0}</span>
          </button>
        ))}
      </div>

      <div className="glass-panel registration-summary">
        <div className="registration-summary__title">
          <ActiveHeadingIcon size={20} />
          Pending {activeTypeLabel} Registrations: {visibleRegistrations.length}
        </div>
        <p>
          {activeTab === 'supplier'
            ? 'Supplier applications submitted through the Become a Supplier form appear in this tab.'
            : 'Customer applications submitted through the Become a Customer form appear in this tab.'}
        </p>
      </div>

      {error && (
        <div className="registration-error" role="alert">
          {error}
          <button type="button" className="admin-btn admin-btn-ghost" onClick={fetchRegistrations}>
            Try Again
          </button>
        </div>
      )}

      <div className="glass-panel registration-table-panel">
        <div className="admin-table-container">
          <table className="admin-table registration-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Type</th>
                <th>Date</th>
                <th className="registration-actions-heading">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="registration-empty-cell">Loading {activeTypeLabelLower} registrations…</td>
                </tr>
              ) : visibleRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="registration-empty-cell">No pending {activeTypeLabelLower} registrations</td>
                </tr>
              ) : (
                visibleRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{displayValue(reg.name)}</td>
                    <td>{displayValue(reg.company_name)}</td>
                    <td>{displayValue(reg.email)}</td>
                    <td style={{ textTransform: 'capitalize' }}>{registrationType(reg)}</td>
                    <td>{reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-GB') : 'N/A'}</td>
                    <td>
                      <div className="registration-row-actions">
                        <button
                          type="button"
                          onClick={() => setSelectedReg(reg)}
                          className="admin-btn admin-btn-ghost registration-action-button"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => requestRegistrationAction(reg, 'approve')}
                          disabled={processing}
                          className="admin-btn registration-action-button registration-action-button--approve"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => requestRegistrationAction(reg, 'reject')}
                          disabled={processing}
                          className="admin-btn registration-action-button registration-action-button--reject"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReg && (
        <div className="registration-modal-backdrop" onClick={() => setSelectedReg(null)}>
          <div
            onClick={(event) => event.stopPropagation()}
            className="glass-panel registration-detail-modal"
          >
            <div className="registration-detail-modal__header">
              <div>
                <span className="registration-detail-modal__eyebrow">
                  {selectedType === 'supplier' ? 'SUPPLIER APPLICATION' : 'CUSTOMER APPLICATION'}
                </span>
                <h2>{displayValue(selectedReg.name)}</h2>
              </div>
              <button type="button" onClick={() => setSelectedReg(null)} className="admin-btn admin-btn-ghost">
                Close
              </button>
            </div>

            <div className="registration-detail-grid">
              <DetailSection title="Basic Info">
                <p><strong>Email:</strong> {displayValue(selectedReg.email)}</p>
                <p><strong>Company:</strong> {displayValue(selectedReg.company_name)}</p>
                <p><strong>Primary Phone:</strong> {displayValue(selectedReg.phone)}</p>
                <p><strong>Application Type:</strong> {selectedType === 'supplier' ? 'Supplier' : 'Customer'}</p>
              </DetailSection>

              {detail && selectedType === 'customer' && (
                <>
                  <DetailSection title="Business Details">
                    <p><strong>Position:</strong> {displayValue(detail.position)}</p>
                    <p><strong>Nature:</strong> {displayValue(detail.business_nature)}</p>
                    <p><strong>Trading Years:</strong> {displayValue(detail.trading_years)}</p>
                    <p><strong>Turnover:</strong> {displayValue(detail.turnover)}</p>
                    <p><strong>Director:</strong> {displayValue(detail.director_name)}</p>
                    <p><strong>Company Registration Number:</strong> {displayValue(detail.company_registration_number)}</p>
                    <p><strong>VAT Number:</strong> {displayValue(detail.vat_number)}</p>
                    <p><strong>Website:</strong> {displayValue(detail.website)}</p>
                  </DetailSection>

                  <DetailSection title="Contact Numbers">
                    <p><strong>Registered Company Phone:</strong> {displayValue(detail.registered_phone)}</p>
                    <p><strong>Mobile Number:</strong> {displayValue(detail.mobile)}</p>
                    <p><strong>WhatsApp Offers Opt-in:</strong> {whatsappOptInText(detail)}</p>
                  </DetailSection>

                  <DetailSection title="Billing Address">
                    <p>{displayValue(detail.address_line_1)}</p>
                    {detail.address_line_2 && <p>{detail.address_line_2}</p>}
                    <p><strong>City/Town:</strong> {displayValue(detail.city)}</p>
                    <p><strong>State/Province:</strong> {displayValue(detail.province)}</p>
                    <p>{displayValue(detail.country)} - {displayValue(detail.zip_code)}</p>
                  </DetailSection>

                  <DetailSection title="Shipping Details">
                    {detail.same_as_billing ? (
                      <p>Same as billing address</p>
                    ) : (
                      <>
                        <p>{displayValue(detail.shipping_address_line_1)}</p>
                        {detail.shipping_address_line_2 && <p>{detail.shipping_address_line_2}</p>}
                        <p><strong>City/Town:</strong> {displayValue(detail.shipping_city)}</p>
                        <p><strong>State/Province:</strong> {displayValue(detail.shipping_province)}</p>
                        <p>{displayValue(detail.shipping_country)} - {displayValue(detail.shipping_zip_code)}</p>
                        <p><strong>Shipping Telephone:</strong> {displayValue(detail.shipping_telephone)}</p>
                      </>
                    )}
                  </DetailSection>

                  <DetailSection title="Accounts Information">
                    <p><strong>Accounts Name:</strong> {displayValue(detail.account_name)}</p>
                    <p><strong>Accounts Email:</strong> {displayValue(detail.account_email)}</p>
                    <p><strong>Other Wholesalers:</strong> {displayValue(detail.other_wholesalers)}</p>
                    <p><strong>Average Order Value:</strong> {displayValue(detail.average_order_value)}</p>
                  </DetailSection>

                  <DetailSection title="Preferences" fullWidth>
                    <p><strong>Region:</strong> {displayValue(detail.region)}</p>
                    <p><strong>Currency:</strong> {displayValue(detail.currency)}</p>
                    <p><strong>Import Preference:</strong> {displayValue(detail.import_full_containers)}</p>
                    <p><strong>Brands:</strong> {displayValue(detail.brands_interested)}</p>
                    <p><strong>Categories:</strong> {displayList(detail.categories_interested)}</p>
                    <p><strong>EORI Number:</strong> {displayValue(detail.eori_number)}</p>
                  </DetailSection>
                </>
              )}

              {supplierDetail && selectedType === 'supplier' && (
                <>
                  <DetailSection title="Supplier Details">
                    <p><strong>Company Type:</strong> {displayValue(supplierDetail.company_type)}</p>
                    <p><strong>Registration No:</strong> {displayValue(supplierDetail.company_registration_number)}</p>
                    <p><strong>Website:</strong> {displayValue(supplierDetail.website_url)}</p>
                    <p><strong>Mobile Phone:</strong> {displayValue(supplierDetail.mobile_phone)}</p>
                    <p><strong>Business Phone:</strong> {displayValue(supplierDetail.business_phone)}</p>
                  </DetailSection>

                  <DetailSection title="Supplier Address">
                    <p>{displayValue(supplierDetail.address_line_1)}</p>
                    {supplierDetail.address_line_2 && <p>{supplierDetail.address_line_2}</p>}
                    <p>{displayValue(supplierDetail.city)}, {displayValue(supplierDetail.county)}</p>
                    <p>{displayValue(supplierDetail.country)} - {displayValue(supplierDetail.postcode)}</p>
                  </DetailSection>

                  <DetailSection title="Supplier Preferences" fullWidth>
                    <p><strong>Categories Supplied:</strong> {displayList(supplierDetail.categories_supplied)}</p>
                    <p><strong>Preferred Contact Times:</strong> {displayList(supplierDetail.contact_time)}</p>
                    <p><strong>News & Updates:</strong> {supplierDetail.consent_news ? 'Yes' : 'No'}</p>
                    <p><strong>Marketing Mailers:</strong> {supplierDetail.consent_marketing ? 'Yes' : 'No'}</p>
                    <p><strong>Additional Comments:</strong> {displayValue(supplierDetail.additional_comments)}</p>
                  </DetailSection>
                </>
              )}
            </div>

            <div className="registration-detail-modal__actions">
              <button type="button" onClick={() => setSelectedReg(null)} className="admin-btn admin-btn-ghost">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => requestRegistrationAction(selectedReg, 'reject')}
                disabled={processing}
                className="admin-btn registration-action-button--reject"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => requestRegistrationAction(selectedReg, 'approve')}
                disabled={processing}
                className="admin-btn registration-action-button--approve"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDialog.open}
        title={confirmDialog.action === 'approve' ? `Approve ${confirmationTypeLabel} Registration?` : `Reject ${confirmationTypeLabel} Registration?`}
        message={
          confirmDialog.action === 'approve'
            ? `Are you sure you want to approve this ${confirmationType} registration?`
            : `Are you sure you want to reject this ${confirmationType} registration?`
        }
        description={
          confirmDialog.action === 'approve'
            ? `The ${confirmationType} application will be approved after this action.`
            : 'The application will be marked as rejected.'
        }
        confirmText={confirmDialog.action === 'approve' ? 'Approve Registration' : 'Reject Registration'}
        cancelText="Cancel"
        eyebrow={confirmDialog.action === 'approve' ? `${confirmationTypeLabel.toUpperCase()} APPROVAL` : `${confirmationTypeLabel.toUpperCase()} REJECTION`}
        icon={confirmDialog.action === 'approve' ? '✓' : '!'}
        variant={confirmDialog.action === 'approve' ? 'success' : 'danger'}
        loading={processing}
        closeOnBackdrop={!processing}
        onConfirm={processRegistration}
        onClose={closeConfirmation}
      />

      <NoticeModal
        open={notice.open}
        title={notice.title}
        message={notice.message}
        type={notice.type}
        buttonText="OK"
        onClose={() => setNotice((current) => ({ ...current, open: false }))}
      />
    </div>
  );
}