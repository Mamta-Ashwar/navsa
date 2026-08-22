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
  FileCheck,
  CheckSquare,
  Square,
  Sliders,
  Plus,
  Layers
} from 'lucide-react';
import * as XLSXModule from 'xlsx';
import {
  importProductsJSON,
  importFullRestoreFile,
  uploadErpExcel,
  getProducts
} from '../../services/adminApi';
import './AdminImportExport.css';

const getXLSX = () => {
  if (typeof window !== 'undefined' && window.XLSX) return window.XLSX;
  return XLSXModule;
};

// Exact 34 ERP Columns as per Datafeed from ERP system.xlsx
const ERP_34_COLUMNS = [
  'NAVSA PRODUCT CODE',
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

  const resetState = () => {
    setSelectedFile(null);
    setParsedRowsCount(null);
    setResultMsg(null);
    setErrorMsg(null);
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResultMsg(null);
      setErrorMsg(null);

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
  const deselectAllColumns = () => setSelectedColumns(['NAVSA PRODUCT CODE', 'Description']);

  // Download ERP Excel Backup (.xlsx) with 3 Download Modes
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
      const products = await getProducts();
      const rawProducts = Array.isArray(products) ? products : products.data || [];

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
          'NAVSA PRODUCT CODE': p.primary_supplier_index || p.navsa_product_code || p.supplier_index || '',
          'Reference': p.navsa_product_code || p.reference || p.code || '',
          'Description': p.description || '',
          'UnitsOf': p.unit_size || p.units_of || '',
          'InnerCaseQuantity': p.inner_case_quantity || p.case_quantity || 1,
          'OuterCaseQuantity': p.outer_case_quantity || p.case_quantity || 1,
          'QtyDesc': p.qty_desc || 'Case',
          'BarcodeEAN': p.barcode_ean || p.ean || '',
          'BarcodeCase': p.barcode_case || '',
          'GroupDesc': p.group_desc || (p.brand ? p.brand.brand_name : ''),
          'VatCode': p.vat_code || 'Z',
          'LayerQuantity': p.layer_quantity || '',
          'PalletQuantity': p.pallet_quantity || '',
          'PrimarySupplierReference': p.primary_supplier_reference || '',
          'Cost': p.cost || 0,
          'CostFromDate': p.cost_from_date || '',
          'CostToDate': p.cost_to_date || '',
          'Weight': p.weight || '',
          'Volume': p.volume || '',
          'ShelfLife': p.shelf_life || '',
          'BBD': p.bbd || '',
          'PriceList': p.price_list || 'STD',
          'Price': p.price_per_case || p.price || p.price_per_unit || 0,
          'FromDate': p.from_date || '',
          'ToDate': p.to_date || '',
          'CommCode': p.comm_code || '',
          'IntraCountry': p.intra_country || 'United Kingdom',
          'IntraType': p.intra_type || 'G',
          'WebShortDescription': p.web_short_description || p.description || '',
          'WebLongDescription': p.web_long_description || p.description || '',
          'WebImage': p.web_image || p.image || '',
          'LiveForWeb': p.live_for_web !== undefined ? p.live_for_web : (p.status ? 1 : 0),
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
      'NAVSA PRODUCT CODE': 'EFL100',
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
      sampleRow1['OrderQtyAllowed'] = 100;
    }

    const headers = exportMode === 'standard_order_qty' ? [...ERP_34_COLUMNS, 'OrderQtyAllowed'] : ERP_34_COLUMNS;
    const ws = XLSX.utils.json_to_sheet([sampleRow1], { header: headers });
    XLSX.utils.book_append_sheet(wb, ws, 'ERP Template');

    XLSX.writeFile(wb, 'navsa_erp_template.xlsx');
  };

  // Import / Restore ERP Excel (.xlsx) - Supports both Bulk ERP and Step 1 Converted modes!
  const handleFullRestoreSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select an ERP Excel file (.xlsx, .xls, .csv) to import.');
      return;
    }

    setUploading(true);
    setResultMsg(null);
    setErrorMsg(null);

    try {
      let res;
      // Send directly via FormData to uploadErpExcel backend handler
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('mode', importMode); // 'erp' or 'step1'

      res = await uploadErpExcel(formData);

      if (!res || res.error) {
        // Fallback to browser parsing if needed
        const XLSX = getXLSX();
        const buffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

        if (rows.length === 0) {
          throw new Error('The uploaded Excel file contains no data rows.');
        }

        const mappedProducts = rows.map((r) => ({
          primary_supplier_index: r['NAVSA PRODUCT CODE'] || r['PrimarySupplierIndex'] || r['primary_supplier_index'] || '',
          navsa_product_code: r['NAVSA PRODUCT CODE'] || r['Reference'] || r['reference'] || r['NAVSA Product Code'] || r['Product Code'] || r[Object.keys(r)[0]],
          description: r['Description'] || r['description'] || r['WebShortDescription'] || r[Object.keys(r)[2]],
          unit_size: r['UnitsOf'] || r['unit_size'] || '',
          inner_case_quantity: r['InnerCaseQuantity'] || 1,
          outer_case_quantity: r['OuterCaseQuantity'] || 1,
          case_quantity: r['OuterCaseQuantity'] || r['InnerCaseQuantity'] || r['UnitsOf'] || 1,
          qty_desc: r['QtyDesc'] || 'Case',
          barcode_ean: r['BarcodeEAN'] || '',
          barcode_case: r['BarcodeCase'] || '',
          group_desc: r['GroupDesc'] || '',
          brand_name: r['GroupDesc'] ? String(r['GroupDesc']).trim() : '',
          vat_code: r['VatCode'] || 'Z',
          layer_quantity: r['LayerQuantity'] || null,
          pallet_quantity: r['PalletQuantity'] || null,
          primary_supplier_reference: r['PrimarySupplierReference'] || null,
          cost: r['Cost'] || 0,
          cost_from_date: r['CostFromDate'] || null,
          cost_to_date: r['CostToDate'] || null,
          weight: r['Weight'] || null,
          volume: r['Volume'] || null,
          shelf_life: r['ShelfLife'] || null,
          bbd: r['BBD'] || null,
          price_list: r['PriceList'] || 'STD',
          price_per_case: r['Price'] || r['price_per_case'] || 0,
          price_per_unit: r['Price'] || r['price_per_unit'] || 0,
          from_date: r['FromDate'] || null,
          to_date: r['ToDate'] || null,
          comm_code: r['CommCode'] || null,
          intra_country: r['IntraCountry'] || 'United Kingdom',
          intra_type: r['IntraType'] || 'G',
          web_short_description: r['WebShortDescription'] || r['Description'] || '',
          web_long_description: r['WebLongDescription'] || r['Description'] || '',
          web_image: r['WebImage'] || '',
          live_for_web: r['LiveForWeb'] !== undefined ? (r['LiveForWeb'] == 1 || r['LiveForWeb'] === '1' || r['LiveForWeb'] === 'Active' ? 1 : 0) : 1,
          status: r['LiveForWeb'] !== undefined ? (r['LiveForWeb'] == 1 || r['LiveForWeb'] === '1' || r['LiveForWeb'] === 'Active' ? 1 : 0) : 1,
          encore_image: r['EncoreImage'] || '',
          obsolete: r['Obsolete'] || null,
          order_qty_allowed: r['OrderQtyAllowed'] || r['ORDER QTY ALLOWED'] || r['order_qty_allowed'] || r['MaxOrderQty'] || null
        }));

        res = await importProductsJSON(mappedProducts);
      }

      if (res) {
        const modeLabel = importMode === 'step1' ? 'Step 1 Converted Import' : 'Bulk ERP Import';
        let details = res.message || `${modeLabel} completed successfully.`;
        if (res.created !== undefined || res.updated !== undefined) {
          details += ` (${res.created || 0} Created, ${res.updated || 0} Updated, Total ${res.total || 0})`;
        }
        setResultMsg(details);
        setSelectedFile(null);
        setParsedRowsCount(null);
        const fileInput = document.getElementById('import-file-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      console.error('Import error:', err);
      setErrorMsg(err.message || 'Failed to process ERP Excel file.');
    } finally {
      setUploading(false);
    }
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
              Export and import product catalogue data matching your <code>Datafeed from ERP system.xlsx</code> structure with custom export modes and column selection.
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

      {/* Main Grid: Export Options vs Import Dropzone */}
      <div className="ie-sections-grid">
        {/* Card 1: Download ERP Excel Backup with 3 Modes */}
        <div className="ie-box ie-export-box">
          <div className="ie-box-header">
            <Download size={22} className="ie-box-icon export" />
            <div>
              <h3>Download ERP Excel Backup (.xlsx)</h3>
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
                  <Loader2 size={18} className="ie-spinner" /> Generating Excel Backup...
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
              <p>Choose your import type below and upload your Excel file to sync catalog items.</p>
            </div>
          </div>

          {/* Import Function Mode Buttons */}
          <div className="ie-import-mode-tabs">
            <button
              type="button"
              className={`ie-import-tab-btn erp ${importMode === 'erp' ? 'active' : ''}`}
              onClick={() => setImportMode('erp')}
            >
              <Upload size={16} /> Bulk ERP Import (.xlsx)
            </button>

            <button
              type="button"
              className={`ie-import-tab-btn step1 ${importMode === 'step1' ? 'active' : ''}`}
              onClick={() => setImportMode('step1')}
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

      {/* Column Reference Table */}
      <div className="ie-box" style={{ marginTop: '10px' }}>
        <div className="ie-box-header">
          <FileCheck size={20} className="ie-accent-icon" />
          <div>
            <h3>34 ERP Column Schema Reference</h3>
            <p>List of all 34 supported columns matching your ERP System format:</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {ERP_34_COLUMNS.map((col, idx) => (
            <span
              key={col}
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                padding: '4px 10px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#60a5fa',
                borderRadius: '6px'
              }}
            >
              {idx + 1}. {col}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
