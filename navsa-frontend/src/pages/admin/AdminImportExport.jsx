import React, { useState } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  Loader2,
  Info,
  Sparkles,
  RefreshCw,
  CheckSquare,
  Square,
  Sliders,
  Plus,
  Layers,
  Images,
  FolderOpen,
  ImagePlus,
  X
} from 'lucide-react';
import * as XLSXModule from 'xlsx';
import {
  uploadErpExcel,
  uploadBulkProductImages,
  auditBulkProductImages,
  getProducts
} from '../../services/adminApi';
import './AdminImportExport.css';

const getXLSX = () => {
  if (typeof window !== 'undefined' && window.XLSX) return window.XLSX;
  return XLSXModule;
};

const slugifyFolderName = (value = '') => String(value)
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const escapeCsv = (value) => {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadCsv = (filename, headers, rows) => {
  const csv = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ].join('\r\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

// Exact 34 ERP Columns as per Datafeed from ERP system.xlsx
const ERP_34_COLUMNS = [
  'PrimarySupplierIndex',
  'Reference',
  'Description',
  'UnitsOf',
  'InnerCaseQuantity',
  'OuterCaseQuantity',
  'QtyDesc',
  'BarcodeEAN',
  'BarcodeCase',
  'GroupDesc',
  'VatCode',
  'LayerQuantity',
  'PalletQuantity',
  'PrimarySupplierReference',
  'Cost',
  'CostFromDate',
  'CostToDate',
  'Weight',
  'Volume',
  'ShelfLife',
  'BBD',
  'PriceList',
  'Price',
  'FromDate',
  'ToDate',
  'CommCode',
  'IntraCountry',
  'IntraType',
  'WebShortDescription',
  'WebLongDescription',
  'WebImage',
  'LiveForWeb',
  'EncoreImage',
  'Obsolete'
];

export default function AdminImportExport() {
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportMode, setExportMode] = useState('standard'); // 'standard' | 'selective' | 'standard_order_qty'
  const [importMode, setImportMode] = useState('erp'); // 'erp' (Bulk ERP Import) | 'step1' (Step 1 Converted Import)
  const [selectedColumns, setSelectedColumns] = useState([...ERP_34_COLUMNS]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRowsCount, setParsedRowsCount] = useState(null);
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [importReport, setImportReport] = useState(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFolderName, setImageFolderName] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState({ done: 0, total: 0 });
  const [imageUploadResult, setImageUploadResult] = useState(null);
  const [imageAudit, setImageAudit] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const resetState = () => {
    setSelectedFile(null);
    setParsedRowsCount(null);
    setResultMsg(null);
    setErrorMsg(null);
  };

  // Clicking either import mode should feel like an import action immediately:
  // switch mode and open the native file browser in the same click.
  const chooseImportFile = (mode) => {
    setImportMode(mode);
    setSelectedFile(null);
    setParsedRowsCount(null);
    setResultMsg(null);
    setErrorMsg(null);
    setImportReport(null);

    const fileInput = document.getElementById('import-file-input');
    if (fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResultMsg(null);
      setErrorMsg(null);
      setImportReport(null);

      const ext = file.name.split('.').pop().toLowerCase();
      if (['xlsx', 'xls', 'csv'].includes(ext)) {
        try {
          const XLSX = getXLSX();
          const buffer = await file.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet);
          setParsedRowsCount(rows.length);
        } catch (err) {
          console.warn('Preview parse warning:', err);
          setParsedRowsCount(null);
        }
      } else {
        setParsedRowsCount(null);
      }
    }
  };

  // Toggle individual column selection for Selective mode
  const toggleColumnSelection = (col) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const selectAllColumns = () => setSelectedColumns([...ERP_34_COLUMNS]);
  const deselectAllColumns = () => setSelectedColumns(['Reference', 'Description']);

  const fetchAllProductsForExport = async () => {
    const allProducts = [];
    let page = 1;
    let lastPage = 1;

    do {
      const response = await getProducts({
        page,
        per_page: 1000,
        sort_by: 'id',
        order: 'asc',
      });

      const pageRows = Array.isArray(response)
        ? response
        : (Array.isArray(response?.data) ? response.data : []);

      allProducts.push(...pageRows);
      lastPage = Number(response?.last_page || 1);
      page += 1;
    } while (page <= lastPage);

    return allProducts;
  };

  // Export Website Data (.xlsx) with 3 Download Modes
  const handleFullExportExcel = async () => {
    if (exportMode === 'selective' && selectedColumns.length === 0) {
      setErrorMsg('Please select at least 1 column for Selective export mode.');
      return;
    }

    setExporting(true);
    setResultMsg(null);
    setErrorMsg(null);

    const XLSX = getXLSX();

    try {
      const rawProducts = await fetchAllProductsForExport();

      // Determine active headers based on export mode
      let activeHeaders = [...ERP_34_COLUMNS];
      if (exportMode === 'selective') {
        activeHeaders = ERP_34_COLUMNS.filter((col) => selectedColumns.includes(col));
      } else if (exportMode === 'standard_order_qty') {
        activeHeaders = [...ERP_34_COLUMNS, 'OrderQtyAllowed'];
      }

      // Map product objects to selected columns
      const formattedProducts = rawProducts.map((p) => {
        const fullRow = {
          'PrimarySupplierIndex': p.primary_supplier_index || '',
          'Reference': p.navsa_product_code || p.reference || p.code || '',
          'Description': p.description || '',
          'UnitsOf': p.units_of ?? p.unit_size ?? '',
          'InnerCaseQuantity': p.inner_case_quantity ?? p.case_quantity ?? '',
          'OuterCaseQuantity': p.outer_case_quantity ?? p.case_quantity ?? '',
          'QtyDesc': p.qty_desc || '',
          'BarcodeEAN': p.barcode_ean || p.ean || '',
          'BarcodeCase': p.barcode_case || '',
          'GroupDesc': p.group_desc || '',
          'VatCode': p.vat_code || '',
          'LayerQuantity': p.layer_quantity ?? '',
          'PalletQuantity': p.pallet_quantity ?? '',
          'PrimarySupplierReference': p.supplier_reference || p.primary_supplier_reference || '',
          'Cost': p.cost ?? '',
          'CostFromDate': p.cost_from_date || '',
          'CostToDate': p.cost_to_date || '',
          'Weight': p.weight ?? '',
          'Volume': p.volume ?? '',
          'ShelfLife': p.shelf_life ?? '',
          'BBD': p.bbd || '',
          'PriceList': p.price_list || '',
          'Price': p.price ?? p.price_per_case ?? p.price_per_unit ?? '',
          'FromDate': p.from_date || '',
          'ToDate': p.to_date || '',
          'CommCode': p.comm_code || '',
          'IntraCountry': p.intra_country || '',
          'IntraType': p.intra_type || '',
          'WebShortDescription': p.web_short_description || '',
          'WebLongDescription': p.web_long_description || '',
          'WebImage': p.erp_web_image || p.web_image || '',
          'LiveForWeb': p.live_for_web ? 1 : 0,
          'EncoreImage': p.encore_image || '',
          'Obsolete': p.obsolete || ''
        };

        if (exportMode === 'standard_order_qty') {
          fullRow['OrderQtyAllowed'] = p.order_qty_allowed !== undefined ? p.order_qty_allowed : (p.max_order_qty || p.order_qty || '');
        }

        // Filter keys for Selective mode
        if (exportMode === 'selective') {
          const filteredRow = {};
          activeHeaders.forEach((col) => {
            filteredRow[col] = fullRow[col] !== undefined ? fullRow[col] : '';
          });
          return filteredRow;
        }

        return fullRow;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(formattedProducts, { header: activeHeaders });
      XLSX.utils.book_append_sheet(wb, ws, 'ERP Datafeed');

      let filename = `navsa_erp_standard_${new Date().toISOString().slice(0, 10)}.xlsx`;
      if (exportMode === 'selective') {
        filename = `navsa_erp_selective_${activeHeaders.length}cols_${new Date().toISOString().slice(0, 10)}.xlsx`;
      } else if (exportMode === 'standard_order_qty') {
        filename = `navsa_erp_with_order_qty_35cols_${new Date().toISOString().slice(0, 10)}.xlsx`;
      }

      XLSX.writeFile(wb, filename);

      setResultMsg(`Exported ${formattedProducts.length} products to Excel (.xlsx) using [${exportMode.toUpperCase()}] mode (${activeHeaders.length} Columns)!`);
    } catch (err) {
      console.error('Export error:', err);
      setErrorMsg(err.message || 'Failed to export ERP Excel Backup.');
    } finally {
      setExporting(false);
    }
  };

  // Download Sample 34-Column ERP Template (.xlsx)
  const downloadSampleTemplateExcel = () => {
    const XLSX = getXLSX();
    const wb = XLSX.utils.book_new();

    const sampleRow1 = {
      'PrimarySupplierIndex': 'MCI101',
      'Reference': '467357',
      'Description': "Young's Cooked & Peeled Prawns £4.50",
      'UnitsOf': 12,
      'InnerCaseQuantity': 12,
      'OuterCaseQuantity': 12,
      'QtyDesc': 'Case',
      'BarcodeEAN': 5000205049793,
      'BarcodeCase': 5000205557205,
      'GroupDesc': "FRO11YOU107 YOUNG'S",
      'VatCode': 'Z',
      'LayerQuantity': 15,
      'PalletQuantity': 165,
      'PrimarySupplierReference': 3799,
      'Cost': 9.99,
      'CostFromDate': '2024-07-02 00:00:00',
      'CostToDate': '9999-12-31 00:00:00',
      'Weight': 0.2,
      'Volume': 0.003,
      'ShelfLife': 210,
      'BBD': '2026-01-29 00:00:00',
      'PriceList': 'STD',
      'Price': 10.99,
      'FromDate': '2024-07-01 00:00:00',
      'ToDate': '9999-12-31 00:00:00',
      'CommCode': 2089030,
      'IntraCountry': 'United Kingdom',
      'IntraType': 'G',
      'WebShortDescription': "Young's Cooked & Peeled Prawns £4.50",
      'WebLongDescription': "Young's Cooked & Peeled Prawns £4.50",
      'WebImage': '5000205049793.png',
      'LiveForWeb': 1,
      'EncoreImage': '5000205049793.jpg',
      'Obsolete': ''
    };

    if (exportMode === 'standard_order_qty') {
      sampleRow1['OrderQtyAllowed'] = 'DEFAULT';
    }

    const headers = exportMode === 'standard_order_qty' ? [...ERP_34_COLUMNS, 'OrderQtyAllowed'] : ERP_34_COLUMNS;
    const ws = XLSX.utils.json_to_sheet([sampleRow1], { header: headers });
    XLSX.utils.book_append_sheet(wb, ws, 'ERP Template');

    XLSX.writeFile(wb, 'navsa_erp_template.xlsx');
  };

  // Import / Restore ERP Excel (.xlsx) - Supports both Bulk ERP and Step 1 Converted modes.
  // Important: there is intentionally NO browser-side fallback importer. The Laravel
  // ERP importer is the single source of truth for field mapping, category/brand
  // resolution, VAT validation, Obsolete lifecycle and database writes.
  const handleFullRestoreSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMsg('Please select an ERP Excel file (.xlsx, .xls, .csv) to import.');
      return;
    }

    setUploading(true);
    setResultMsg(null);
    setErrorMsg(null);
    setImportReport(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('mode', importMode);

      const res = await uploadErpExcel(formData);
      setImportReport(res);

      const modeLabel = importMode === 'step1'
        ? 'Step 1 Converted Import'
        : 'Bulk ERP Import';

      const summary = [
        `${res?.created || 0} Created`,
        `${res?.updated || 0} Updated`,
        `${res?.skipped || 0} Skipped`,
        `${res?.errors || 0} Errors`,
        `${res?.total || 0} Total`,
      ].join(' • ');

      if ((res?.errors || 0) > 0) {
        setErrorMsg(`${res?.message || `${modeLabel} completed with errors.`} ${summary}`);
      } else {
        setResultMsg(`${res?.message || `${modeLabel} completed successfully.`} ${summary}`);
      }

      setSelectedFile(null);
      setParsedRowsCount(null);

      const fileInput = document.getElementById('import-file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Import error:', err);

      const report = err?.data && typeof err.data === 'object'
        ? err.data
        : null;

      if (report) {
        setImportReport(report);
      }

      setErrorMsg(
        report?.message
        || report?.error
        || err.message
        || 'Failed to process ERP Excel file.'
      );
    } finally {
      setUploading(false);
    }
  };

  const addSelectedImages = (fileList) => {
    const incoming = Array.from(fileList || []);

    if (incoming.length > 0 && !imageFolderName.trim()) {
      const relativePath = String(incoming[0]?.webkitRelativePath || '');
      const selectedFolder = relativePath.includes('/') ? relativePath.split('/')[0] : '';
      if (selectedFolder) {
        setImageFolderName(selectedFolder);
      }
    }

    const supportedExtensions = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
    const accepted = [];
    const rejected = [];

    incoming.forEach((file) => {
      const extension = String(file.name || '').split('.').pop().toLowerCase();
      if (!supportedExtensions.has(extension)) {
        rejected.push(`${file.name}: unsupported image type`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        rejected.push(`${file.name}: larger than 10 MB`);
        return;
      }

      accepted.push(file);
    });

    setSelectedImages((current) => {
      const seen = new Set(
        current.map((file) => `${file.name}|${file.size}|${file.lastModified}`)
      );

      const merged = [...current];
      accepted.forEach((file) => {
        const key = `${file.name}|${file.size}|${file.lastModified}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(file);
        }
      });
      return merged;
    });

    setImageUploadResult(null);
    setImageAudit(null);
    setImageUploadProgress({ done: 0, total: 0 });

    if (rejected.length > 0) {
      const preview = rejected.slice(0, 5).join(' • ');
      const extra = rejected.length > 5 ? ` • +${rejected.length - 5} more` : '';
      setImageUploadError(`${rejected.length} file(s) were not selected. ${preview}${extra}`);
    } else {
      setImageUploadError(null);
    }
  };

  const handleImageInputChange = (e) => {
    addSelectedImages(e.target.files);
    e.target.value = '';
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addSelectedImages(e.dataTransfer.files);
  };

  const clearSelectedImages = () => {
    setSelectedImages([]);
    setImageUploadResult(null);
    setImageAudit(null);
    setImageUploadError(null);
    setImageUploadProgress({ done: 0, total: 0 });
  };

  const handleBulkImageUpload = async () => {
    if (!imageFolderName.trim()) {
      setImageUploadError('Please enter a supplier image folder name, for example mars.');
      return;
    }

    const folderSlug = slugifyFolderName(imageFolderName);
    if (!folderSlug) {
      setImageUploadError('Please enter a valid supplier image folder name.');
      return;
    }

    if (selectedImages.length === 0) {
      setImageUploadError('Please choose a product image folder or select image files first.');
      return;
    }

    const BATCH_SIZE = 5;
    const numericKeys = [
      'received',
      'uploaded_files',
      'replaced_files',
      'matched_files',
      'matched_products',
      'primary_links_set',
      'unmatched_file_count',
      'failed_file_count',
    ];

    const aggregate = {
      folder_name: imageFolderName.trim(),
      folder_slug: folderSlug,
      public_folder: `/products/${folderSlug}/`,
      received: 0,
      uploaded_files: 0,
      replaced_files: 0,
      matched_files: 0,
      matched_products: 0,
      primary_links_set: 0,
      unmatched_file_count: 0,
      failed_file_count: 0,
      unmatched_files: [],
      failed_files: [],
      matched_supplier_indexes: [],
    };

    const supplierIndexSet = new Set();

    setImageUploading(true);
    setImageUploadError(null);
    setImageUploadResult(null);
    setImageAudit(null);
    setImageUploadProgress({ done: 0, total: selectedImages.length });

    try {
      for (let startIndex = 0; startIndex < selectedImages.length; startIndex += BATCH_SIZE) {
        const batch = selectedImages.slice(startIndex, startIndex + BATCH_SIZE);
        const formData = new FormData();
        formData.append('folder_name', imageFolderName.trim());

        batch.forEach((file) => {
          formData.append('images[]', file, file.name);
        });

        try {
          const res = await uploadBulkProductImages(formData);

          numericKeys.forEach((key) => {
            aggregate[key] += Number(res?.[key] || 0);
          });

          if (Array.isArray(res?.unmatched_files)) {
            aggregate.unmatched_files.push(...res.unmatched_files);
          }

          if (Array.isArray(res?.failed_files)) {
            aggregate.failed_files.push(...res.failed_files);
          }

          if (Array.isArray(res?.matched_supplier_indexes)) {
            res.matched_supplier_indexes.forEach((value) => {
              const clean = String(value || '').trim();
              if (clean) supplierIndexSet.add(clean);
            });
          }

          if (res?.folder_slug) {
            aggregate.folder_slug = res.folder_slug;
            aggregate.public_folder = res.public_folder || `/products/${res.folder_slug}/`;
          }
        } catch (err) {
          const message = err?.data?.message || err?.message || 'Batch upload failed.';
          aggregate.failed_file_count += batch.length;
          batch.forEach((file) => {
            aggregate.failed_files.push({
              file: file.name,
              message,
            });
          });
        }

        setImageUploadProgress({
          done: Math.min(startIndex + batch.length, selectedImages.length),
          total: selectedImages.length,
        });
      }

      aggregate.matched_supplier_indexes = Array.from(supplierIndexSet).sort();
      setImageUploadResult(aggregate);

      // Prefer the supplier indexes from the Excel import performed in this
      // session. If the page was reloaded, the backend can infer the supplier
      // scope from products already linked to this supplier image folder.
      const importedSupplierIndexes = Array.isArray(importReport?.supplier_indexes)
        ? importReport.supplier_indexes.map((value) => String(value || '').trim()).filter(Boolean)
        : [];
      const matchedSupplierIndexes = aggregate.matched_supplier_indexes || [];
      const importMatchesCurrentUpload = importedSupplierIndexes.some((value) => (
        matchedSupplierIndexes.includes(value)
      ));

      const auditSupplierIndexes = matchedSupplierIndexes.length === 0
        ? importedSupplierIndexes
        : (importMatchesCurrentUpload
          ? Array.from(new Set([...matchedSupplierIndexes, ...importedSupplierIndexes]))
          : matchedSupplierIndexes);

      try {
        const audit = await auditBulkProductImages(
          imageFolderName.trim(),
          auditSupplierIndexes
        );
        setImageAudit(audit);
      } catch (auditError) {
        const auditMessage = auditError?.data?.message || auditError?.message;
        setImageUploadError((current) => (
          current || `Images uploaded, but the missing-image audit could not run: ${auditMessage || 'unknown error'}`
        ));
      }

      if (aggregate.failed_file_count > 0) {
        setImageUploadError(
          `Upload finished with ${aggregate.failed_file_count} failed file(s). `
          + `${aggregate.uploaded_files} file(s) were uploaded successfully.`
        );
      } else {
        setImageUploadError(null);
        setSelectedImages([]);
      }
    } finally {
      setImageUploading(false);
    }
  };

  const downloadMissingImageList = () => {
    const rows = Array.isArray(imageAudit?.missing_products) ? imageAudit.missing_products : [];
    if (rows.length === 0) return;

    downloadCsv(
      `${imageAudit?.folder_slug || slugifyFolderName(imageFolderName) || 'supplier'}-missing-product-images.csv`,
      ['Supplier Index', 'NAVSA Product Code', 'Product Description', 'Expected WebImage', 'Target Folder'],
      rows.map((item) => [
        item.supplier_index || '',
        item.navsa_product_code || '',
        item.description || '',
        item.web_image || '',
        imageAudit?.public_folder || '',
      ])
    );
  };

  const downloadUnmatchedUploadList = () => {
    const files = Array.isArray(imageUploadResult?.unmatched_files)
      ? Array.from(new Set(imageUploadResult.unmatched_files))
      : [];
    if (files.length === 0) return;

    downloadCsv(
      `${imageUploadResult?.folder_slug || slugifyFolderName(imageFolderName) || 'supplier'}-unmatched-uploaded-images.csv`,
      ['Uploaded Filename', 'Reason'],
      files.map((filename) => [filename, 'No current product has an exact matching ERP WebImage filename'])
    );
  };

  return (
    <div className="admin-import-export-container">
      {/* Hero Banner Header */}
      <div className="ie-hero-card">
        <div className="ie-hero-content">
          <div className="ie-hero-icon">
            <Database size={28} />
          </div>
          <div>
            <h2>NAVSA ERP System Excel Import & Export</h2>
            <p>
              Export and import the NAVSA ERP catalogue, then upload supplier product images in bulk using the exact WebImage filenames from the ERP Excel file.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="ie-btn ie-btn-secondary"
          onClick={downloadSampleTemplateExcel}
        >
          <FileSpreadsheet size={16} />
          Download Sample Template (.xlsx)
        </button>
      </div>

      {/* Feedback Alerts */}
      {resultMsg && (
        <div className="ie-alert ie-alert-success">
          <CheckCircle2 size={18} />
          <span>{resultMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="ie-alert ie-alert-error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {importReport && (
        <div className={`ie-import-report ${(importReport.errors || 0) > 0 ? 'has-errors' : 'is-success'}`}>
          <div className="ie-import-report-head">
            <div>
              <strong>Last import result</strong>
              <span>{importReport.message || 'ERP import finished.'}</span>
            </div>
            <span className="ie-report-status">
              {(importReport.errors || 0) > 0 ? 'Needs attention' : 'Completed'}
            </span>
          </div>

          <div className="ie-report-metrics">
            <div><span>Total processed</span><strong>{importReport.total ?? 0}</strong></div>
            <div><span>Imported</span><strong>{importReport.imported ?? 0}</strong></div>
            <div><span>New created</span><strong>{importReport.created ?? 0}</strong></div>
            <div><span>Existing updated</span><strong>{importReport.updated ?? 0}</strong></div>
            <div><span>Restored</span><strong>{importReport.restored ?? 0}</strong></div>
            <div><span>Errors</span><strong>{importReport.errors ?? 0}</strong></div>
          </div>

          {Array.isArray(importReport.row_errors) && importReport.row_errors.length > 0 && (
            <div className="ie-report-details">
              <strong>Row errors</strong>
              <div className="ie-report-list">
                {importReport.row_errors.slice(0, 10).map((item, index) => (
                  <div key={`${item.row}-${item.code || ''}-${index}`}>
                    <span>Row {item.row}{item.code ? ` • ${item.code}` : ''}</span>
                    <p>{item.message}</p>
                  </div>
                ))}
              </div>
              {importReport.row_errors.length > 10 && (
                <small>Showing first 10 of {importReport.row_errors.length} returned row errors.</small>
              )}
            </div>
          )}

          {(
            Object.keys(importReport.unknown_supplier_indexes || {}).length > 0
            || Object.keys(importReport.unknown_group_codes || {}).length > 0
            || Object.keys(importReport.unknown_brands || {}).length > 0
          ) && (
            <div className="ie-mapping-warnings">
              <strong>Mapping warnings (products are still imported)</strong>

              {Object.keys(importReport.unknown_supplier_indexes || {}).length > 0 && (
                <p>
                  <span>Supplier indexes not found in Suppliers:</span>{' '}
                  {Object.entries(importReport.unknown_supplier_indexes).map(([key, count]) => `${key} (${count})`).join(', ')}
                </p>
              )}

              {Object.keys(importReport.unknown_group_codes || {}).length > 0 && (
                <p>
                  <span>Group codes not mapped:</span>{' '}
                  {Object.entries(importReport.unknown_group_codes).map(([key, count]) => `${key} (${count})`).join(', ')}
                </p>
              )}

              {Object.keys(importReport.unknown_brands || {}).length > 0 && (
                <p>
                  <span>Brand names not matched:</span>{' '}
                  {Object.entries(importReport.unknown_brands).slice(0, 20).map(([key, count]) => `${key} (${count})`).join(', ')}
                  {Object.keys(importReport.unknown_brands).length > 20 ? ' …' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Export Options vs Import Dropzone */}
      <div className="ie-sections-grid">
        {/* Card 1: Export Website Data with 3 Modes */}
        <div className="ie-box ie-export-box">
          <div className="ie-box-header">
            <Download size={22} className="ie-box-icon export" />
            <div>
              <h3>Export Website Data (.xlsx)</h3>
              <p>Select your desired download format mode below:</p>
            </div>
          </div>

          {/* 3-Mode Dropdown Selector */}
          <div className="ie-mode-selector-wrapper">
            <label className="ie-field-label">
              <Sliders size={15} />
              <span>Select Download Mode:</span>
            </label>

            <select
              value={exportMode}
              onChange={(e) => setExportMode(e.target.value)}
              className="ie-select-dropdown"
            >
              <option value="standard">1. STANDARD (All 34 ERP Columns)</option>
              <option value="selective">2. SELECTIVE (Choose Custom Columns)</option>
              <option value="standard_order_qty">3. STANDARD + ORDER QTY ALLOWED (35 Columns)</option>
            </select>
          </div>

          {/* Selective Columns Customizer UI */}
          {exportMode === 'selective' && (
            <div className="ie-selective-panel">
              <div className="ie-selective-header">
                <div>
                  <strong>Select Columns to Export:</strong>
                  <span>({selectedColumns.length} / {ERP_34_COLUMNS.length} Columns Selected)</span>
                </div>

                <div className="ie-selective-actions">
                  <button type="button" onClick={selectAllColumns} className="ie-mini-btn">
                    <CheckSquare size={13} /> Select All
                  </button>
                  <button type="button" onClick={deselectAllColumns} className="ie-mini-btn">
                    <Square size={13} /> Clear
                  </button>
                </div>
              </div>

              <div className="ie-columns-grid">
                {ERP_34_COLUMNS.map((col) => {
                  const isChecked = selectedColumns.includes(col);
                  return (
                    <label
                      key={col}
                      className={`ie-col-chip ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleColumnSelection(col)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by label click
                      />
                      <span>{col}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 3 Notice */}
          {exportMode === 'standard_order_qty' && (
            <div className="ie-mode-notice">
              <Plus size={16} className="ie-accent-icon" />
              <span>
                Includes all 34 standard ERP columns plus an extra column <strong>OrderQtyAllowed</strong> (35 columns total).
              </span>
            </div>
          )}

          <div className="ie-export-options" style={{ marginTop: '8px' }}>
            <button
              type="button"
              disabled={exporting}
              className="ie-btn ie-btn-export-excel ie-btn-large"
              onClick={handleFullExportExcel}
            >
              {exporting ? (
                <>
                  <Loader2 size={18} className="ie-spinner" /> Generating Website Export...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Download Excel Spreadsheet (.xlsx)
                </>
              )}
            </button>
          </div>

          <div className="ie-info-banner">
            <Info size={16} />
            <span>
              {exportMode === 'standard' && 'Standard Mode exports all 34 standard ERP columns.'}
              {exportMode === 'selective' && `Selective Mode will export only your ${selectedColumns.length} selected columns.`}
              {exportMode === 'standard_order_qty' && 'Standard + Order Qty Mode exports 35 total columns including OrderQtyAllowed.'}
            </span>
          </div>
        </div>

        {/* Card 2: Upload & Import ERP Excel with Both Functions (Bulk ERP & Step 1 Converted) */}
        <div className="ie-box ie-import-box">
          <div className="ie-box-header">
            <Upload size={22} className="ie-box-icon import" />
            <div>
              <h3>Upload & Import ERP Excel File</h3>
              <p>Click an import type to browse for the Excel file immediately, or drag a file into the upload area below.</p>
            </div>
          </div>

          {/* Import Function Mode Buttons */}
          <div className="ie-import-mode-tabs">
            <button
              type="button"
              className={`ie-import-tab-btn erp ${importMode === 'erp' ? 'active' : ''}`}
              onClick={() => chooseImportFile('erp')}
            >
              <Upload size={16} /> Bulk ERP Import (.xlsx)
            </button>

            <button
              type="button"
              className={`ie-import-tab-btn step1 ${importMode === 'step1' ? 'active' : ''}`}
              onClick={() => chooseImportFile('step1')}
            >
              <Layers size={16} /> Step 1 Converted Import (.xlsx)
            </button>
          </div>

          <div className="ie-import-description-banner">
            {importMode === 'erp' ? (
              <span>
                🟢 <strong>Bulk ERP Import Mode:</strong> Syncs full ERP Datafeed (Primary Supplier Index, Reference, Barcode, Prices, LiveForWeb & Obsolete date).
              </span>
            ) : (
              <span>
                🔵 <strong>Step 1 Converted Import Mode:</strong> Syncs Step 1 file (NAVSA Product Code, Description & ORDER QTY ALLOWED column).
              </span>
            )}
          </div>

          <form onSubmit={handleFullRestoreSubmit} className="ie-import-form">
            <div className="ie-file-dropzone">
              <input
                type="file"
                id="import-file-input"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
              />
              <div className="ie-dropzone-content">
                <Upload size={32} className="ie-drop-icon" />
                {selectedFile ? (
                  <div className="ie-file-selected">
                    <FileSpreadsheet size={24} className="ie-excel-icon" />
                    <div>
                      <strong>{selectedFile.name}</strong>
                      <span>
                        {(selectedFile.size / 1024).toFixed(1)} KB
                        {parsedRowsCount !== null && ` • ${parsedRowsCount} Data Rows Detected`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>Click or drag {importMode === 'step1' ? 'Step 1 Converted' : 'ERP'} Excel (.xlsx) file here</strong>
                    <span>Supports {importMode === 'step1' ? 'Step 1 Converted' : 'Datafeed from ERP system.xlsx'} and standard .xlsx / .csv</span>
                  </>
                )}
              </div>
            </div>

            <div className="ie-import-actions">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className={`ie-btn ie-btn-large ${importMode === 'step1' ? 'ie-btn-primary' : 'ie-btn-success'}`}
                style={{
                  background: importMode === 'step1' 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="ie-spinner" /> Processing {importMode === 'step1' ? 'Step 1 Converted' : 'Bulk ERP'} Import...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} /> Start {importMode === 'step1' ? 'Step 1 Converted' : 'Bulk ERP'} Excel Import
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bulk supplier / ERP product images */}
      <div className="ie-box ie-bulk-images-box">
        <div className="ie-box-header ie-image-box-header">
          <Images size={24} className="ie-box-icon images" />
          <div>
            <h3>Bulk Product Image Upload</h3>
            <p>
              Upload supplier images whose filenames exactly match the product <code>WebImage</code> values imported from ERP, for example <code>5000159470315.png</code>. You can choose an entire folder or multiple files.
            </p>
          </div>
        </div>

        <div className="ie-image-guidance">
          <Info size={17} />
          <span>
            Recommended order: <strong>1. Import the ERP Excel</strong>, then <strong>2. Upload the image folder</strong>.
            Every valid selected image is <strong>saved into the supplier folder first</strong>. Matching then runs <strong>only by WebImage</strong>: the complete uploaded filename, including extension, must exactly match the product <code>WebImage</code> value imported from Excel. Files with no match are still kept in the supplier folder and are reported in a downloadable unmatched list. One image can match multiple products when they share the same WebImage filename. BarcodeEAN, EncoreImage, Reference and description are not used as fallbacks.
          </span>
        </div>

        <div className="ie-supplier-folder-card">
          <label htmlFor="supplier-image-folder-name">Supplier image folder name *</label>
          <div className="ie-supplier-folder-input-row">
            <FolderOpen size={18} />
            <input
              id="supplier-image-folder-name"
              type="text"
              value={imageFolderName}
              onChange={(e) => {
                setImageFolderName(e.target.value);
                setImageUploadResult(null);
                setImageAudit(null);
                setImageUploadError(null);
              }}
              placeholder="e.g. mars"
              maxLength={80}
              disabled={imageUploading}
            />
          </div>
          <small>
            Images will be saved under <code>/products/{slugifyFolderName(imageFolderName) || 'supplier-folder'}/</code>.
            If you choose a whole folder first, its folder name is suggested automatically and you can still change it before upload.
          </small>
        </div>

        <div
          className={`ie-image-dropzone ${selectedImages.length > 0 ? 'has-files' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleImageDrop}
        >
          <input
            id="bulk-image-folder-input"
            className="ie-hidden-file-input"
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp"
            multiple
            webkitdirectory=""
            directory=""
            onChange={handleImageInputChange}
          />

          <input
            id="bulk-image-files-input"
            className="ie-hidden-file-input"
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp"
            multiple
            onChange={handleImageInputChange}
          />

          <ImagePlus size={34} className="ie-image-drop-icon" />
          <strong>Drop supplier product images here</strong>
          <span>PNG, JPG, GIF or WEBP • maximum 10 MB per image</span>

          <div className="ie-image-picker-actions">
            <label htmlFor="bulk-image-folder-input" className="ie-image-picker-btn">
              <FolderOpen size={17} />
              Select Image Folder
            </label>
            <label htmlFor="bulk-image-files-input" className="ie-image-picker-btn secondary">
              <Images size={17} />
              Select Multiple Images
            </label>
          </div>
        </div>

        {selectedImages.length > 0 && (
          <div className="ie-selected-images-panel">
            <div className="ie-selected-images-head">
              <div>
                <strong>{selectedImages.length} image file(s) selected</strong>
                <span>
                  {(selectedImages.reduce((total, file) => total + file.size, 0) / (1024 * 1024)).toFixed(1)} MB total
                </span>
              </div>
              <button
                type="button"
                className="ie-clear-images-btn"
                onClick={clearSelectedImages}
                disabled={imageUploading}
              >
                <X size={15} /> Clear
              </button>
            </div>

            <div className="ie-image-file-preview">
              {selectedImages.slice(0, 8).map((file) => (
                <span key={`${file.name}-${file.size}-${file.lastModified}`}>{file.name}</span>
              ))}
              {selectedImages.length > 8 && (
                <span className="more">+{selectedImages.length - 8} more</span>
              )}
            </div>
          </div>
        )}

        {imageUploadError && (
          <div className="ie-inline-image-message error">
            <AlertCircle size={17} />
            <span>{imageUploadError}</span>
          </div>
        )}

        {imageUploading && imageUploadProgress.total > 0 && (
          <div className="ie-image-progress">
            <div className="ie-image-progress-head">
              <span>Uploading product images in safe batches…</span>
              <strong>{imageUploadProgress.done} / {imageUploadProgress.total}</strong>
            </div>
            <div className="ie-image-progress-track">
              <div
                className="ie-image-progress-value"
                style={{
                  width: `${Math.round((imageUploadProgress.done / imageUploadProgress.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          className="ie-btn ie-btn-large ie-bulk-image-upload-btn"
          disabled={imageUploading || selectedImages.length === 0 || !slugifyFolderName(imageFolderName)}
          onClick={handleBulkImageUpload}
        >
          {imageUploading ? (
            <>
              <Loader2 size={18} className="ie-spinner" />
              Uploading Images…
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload {selectedImages.length > 0 ? `${selectedImages.length} ` : ''}Product Image{selectedImages.length === 1 ? '' : 's'}
            </>
          )}
        </button>

        {imageUploadResult && (
          <div className="ie-image-result-panel">
            <div className="ie-image-result-head">
              <CheckCircle2 size={20} />
              <div>
                <strong>Bulk image upload result</strong>
                <span>
                  Every valid file is saved first. Exact ERP WebImage matches are then linked to products; unmatched files stay in this supplier folder for review.
                </span>
              </div>
            </div>

            <div className="ie-image-storage-path">
              <FolderOpen size={17} />
              <span>Saved in <code>{imageUploadResult.public_folder || `/products/${imageUploadResult.folder_slug || ''}/`}</code></span>
            </div>

            <div className="ie-report-metrics image-metrics">
              <div><span>Files saved in folder</span><strong>{imageUploadResult.uploaded_files || 0}</strong></div>
              <div><span>WebImage-matched files</span><strong>{imageUploadResult.matched_files || 0}</strong></div>
              <div><span>Matched products</span><strong>{imageUploadResult.matched_products || 0}</strong></div>
              <div><span>Primary images set</span><strong>{imageUploadResult.primary_links_set || 0}</strong></div>
              <div><span>Replaced image files</span><strong>{imageUploadResult.replaced_files || 0}</strong></div>
              <div><span>Unmatched filenames</span><strong>{imageUploadResult.unmatched_file_count || 0}</strong></div>
            </div>

            {(imageUploadResult.unmatched_file_count || 0) > 0 && (
              <div className="ie-image-result-list warning">
                <strong>
                  Uploaded but not matched to a current product ({imageUploadResult.unmatched_file_count})
                </strong>
                <p>{imageUploadResult.unmatched_files.slice(0, 20).join(', ')}</p>
                {(imageUploadResult.unmatched_file_count || 0) > 20 && (
                  <small>+{(imageUploadResult.unmatched_file_count || 0) - 20} more unmatched files</small>
                )}
                <button type="button" className="ie-download-report-btn secondary" onClick={downloadUnmatchedUploadList}>
                  <Download size={16} /> Download unmatched upload list (.csv)
                </button>
              </div>
            )}

            {(imageUploadResult.failed_file_count || 0) > 0 && (
              <div className="ie-image-result-list error">
                <strong>Failed files ({imageUploadResult.failed_file_count})</strong>
                {imageUploadResult.failed_files.slice(0, 12).map((item, index) => (
                  <p key={`${item.file}-${index}`}>
                    <span>{item.file}</span> — {item.message}
                  </p>
                ))}
              </div>
            )}

            {imageAudit && (
              <div className={`ie-missing-image-audit ${(imageAudit.missing_product_count || 0) > 0 ? 'has-missing' : 'complete'}`}>
                <div className="ie-missing-image-audit-head">
                  <div>
                    <strong>Missing product image check</strong>
                    <span>{imageAudit.message}</span>
                  </div>
                  {(imageAudit.missing_product_count || 0) > 0 && (
                    <button type="button" className="ie-download-report-btn" onClick={downloadMissingImageList}>
                      <Download size={16} /> Download Missing Image List (.csv)
                    </button>
                  )}
                </div>

                <div className="ie-report-metrics missing-image-metrics">
                  <div><span>Supplier indexes</span><strong>{(imageAudit.supplier_indexes || []).join(', ') || '—'}</strong></div>
                  <div><span>Expected products</span><strong>{imageAudit.expected_product_count || 0}</strong></div>
                  <div><span>Unique expected images</span><strong>{imageAudit.expected_unique_image_count || 0}</strong></div>
                  <div><span>Files in supplier folder</span><strong>{imageAudit.folder_file_count || 0}</strong></div>
                  <div><span>Products missing images</span><strong>{imageAudit.missing_product_count || 0}</strong></div>
                  <div><span>Unique missing files</span><strong>{imageAudit.missing_unique_image_count || 0}</strong></div>
                </div>

                {(imageAudit.missing_product_count || 0) > 0 && (
                  <div className="ie-missing-preview">
                    {(imageAudit.missing_products || []).slice(0, 8).map((item, index) => (
                      <div key={`${item.navsa_product_code}-${item.web_image}-${index}`}>
                        <code>{item.web_image}</code>
                        <span>{item.navsa_product_code} — {item.description}</span>
                      </div>
                    ))}
                    {(imageAudit.missing_product_count || 0) > 8 && (
                      <small>+{(imageAudit.missing_product_count || 0) - 8} more product rows in the downloadable CSV.</small>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
