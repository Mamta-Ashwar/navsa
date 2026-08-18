import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  Package,
  DollarSign,
  Boxes,
  Calendar,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { getOrders } from '../../services/adminApi';

export default function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchCompletedOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders({ status: 'completed', per_page: 500 });
      let orderList = res.orders?.data || res.orders || (Array.isArray(res) ? res : []);

      if (!orderList || orderList.length === 0) {
        const allRes = await getOrders({ per_page: 500 });
        const allOrders = allRes.orders?.data || allRes.orders || (Array.isArray(allRes) ? allRes : []);
        orderList = allOrders.filter(
          (o) => (o.status || '').toLowerCase() === 'completed' || (o.status || '').toLowerCase() === 'delivered'
        );
      }

      setOrders(orderList);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading completed order reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const toggleAllExpand = (expand) => {
    const nextState = {};
    orders.forEach((o) => {
      nextState[o.id] = expand;
    });
    setExpandedOrders(nextState);
  };

  // Filter orders by search term
  const filteredOrders = orders.filter((order) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const customerName = (order.user?.name || order.user?.company_name || '').toLowerCase();
    const customerEmail = (order.user?.email || '').toLowerCase();
    const orderNum = (order.order_number || '').toLowerCase();
    const hasMatchingProduct = (order.items || []).some(
      (item) =>
        (item.product?.name || '').toLowerCase().includes(q) ||
        (item.product?.navsa_product_code || item.product?.reference || '').toLowerCase().includes(q)
    );

    return (
      customerName.includes(q) ||
      customerEmail.includes(q) ||
      orderNum.includes(q) ||
      hasMatchingProduct
    );
  });

  // Calculate stats & item metrics
  let totalRevenue = 0;
  let totalCasesSold = 0;
  const productAggMap = {};

  filteredOrders.forEach((order) => {
    let orderSub = 0;
    (order.items || []).forEach((item) => {
      const price = parseFloat(item.unit_price || item.product?.price || 0);
      let cases = parseInt(item.case_quantity || item.quantity || 0);
      let sub = parseFloat(item.subtotal || 0);

      if ((!cases || cases <= 1) && sub > price && price > 0) {
        cases = Math.round(sub / price);
      } else if (!cases || cases <= 0) {
        cases = 1;
      }

      if (!sub || sub <= 0) {
        sub = price * cases;
      }

      orderSub += sub;
      totalCasesSold += cases;

      // Product Aggregation
      const pId = item.product_id || item.product?.id || item.id;
      const pName = item.product?.name || item.name || 'Catalogue Product';
      const pCode =
        item.product?.navsa_product_code || item.product?.reference || 'N/A';

      if (!productAggMap[pId]) {
        productAggMap[pId] = {
          id: pId,
          code: pCode,
          name: pName,
          totalCases: 0,
          unitPrice: price,
          totalRevenue: 0,
        };
      }
      productAggMap[pId].totalCases += cases;
      productAggMap[pId].totalRevenue += sub;
    });

    const finalOrderAmt =
      parseFloat(order.total_amount || 0) > 0
        ? parseFloat(order.total_amount)
        : orderSub;
    totalRevenue += finalOrderAmt;
  });

  const productAggList = Object.values(productAggMap).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  const areAllExpanded =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => expandedOrders[o.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Order Number,Customer Name,Email,Date,Product Code,Product Name,Cases Qty,Unit Price (£),Subtotal (£)\n';

    filteredOrders.forEach((order) => {
      const dateStr = order.created_at
        ? new Date(order.created_at).toLocaleDateString('en-GB')
        : 'N/A';
      const custName = `"${(order.user?.name || order.user?.company_name || 'Guest').replace(/"/g, '""')}"`;
      const custEmail = `"${(order.user?.email || '').replace(/"/g, '""')}"`;

      (order.items || []).forEach((item) => {
        const pCode = `"${(item.product?.navsa_product_code || item.product?.reference || '').replace(/"/g, '""')}"`;
        const pName = `"${(item.product?.name || item.name || '').replace(/"/g, '""')}"`;
        const price = parseFloat(item.unit_price || 0).toFixed(2);
        let cases = parseInt(item.case_quantity || item.quantity || 1);
        let sub = parseFloat(item.subtotal || 0);
        if (!sub || sub <= 0) sub = price * cases;

        csvContent += `${order.order_number},${custName},${custEmail},${dateStr},${pCode},${pName},${cases},${price},${sub.toFixed(2)}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `completed_orders_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ color: '#e2e8f0', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#f8fafc',
              margin: '0 0 4px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle2 size={26} color="#10b981" />
            Completed Orders & Stock Report
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Comprehensive list of all fulfilled trade orders, product case quantities, and stock price breakdowns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchCompletedOrders}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#cbd5e1',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Printer size={15} />
            Print Report
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#a7f3d0', fontWeight: 600 }}>Completed Orders</span>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {filteredOrders.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6ee7b7', marginTop: '4px' }}>Fulfilled Trade Deliveries</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#93c5fd', fontWeight: 600 }}>Total Completed Revenue</span>
            <DollarSign size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            £{totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '4px' }}>Net Fulfilled Value</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#fde68a', fontWeight: 600 }}>Total Cases Sold</span>
            <Boxes size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {totalCasesSold.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '4px' }}>Units / Cases Dispatched</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(15, 23, 42, 0.6))',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#e9d5ff', fontWeight: 600 }}>Unique Line Items</span>
            <Package size={20} color="#a855f7" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
            {productAggList.length}
          </div>
          <div style={{ fontSize: '12px', color: '#c084fc', marginTop: '4px' }}>Catalogue Products Sold</div>
        </div>
      </div>

      {/* Controls & Tab Nav */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Left: Search & Expand/Collapse Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
            />
            <input
              type="text"
              placeholder="Search order #, customer, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {activeTab === 'orders' && (
            <button
              onClick={() => toggleAllExpand(!areAllExpanded)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#cbd5e1',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {areAllExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {areAllExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          )}
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px', padding: '3px' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'orders' ? '#3b82f6' : 'transparent',
              color: activeTab === 'orders' ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            List by Order ({filteredOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'products' ? '#3b82f6' : 'transparent',
              color: activeTab === 'products' ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            Product Stock Breakdown ({productAggList.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            color: '#94a3b8',
          }}
        >
          <RefreshCw className="animate-spin" size={28} style={{ marginBottom: '12px' }} />
          <div>Loading completed orders report...</div>
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            color: '#f87171',
          }}
        >
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            color: '#94a3b8',
          }}
        >
          <FileText size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#cbd5e1' }}>No completed orders found</div>
          <p style={{ fontSize: '13px', margin: '4px 0 0' }}>
            When an order status is marked as 'completed' or 'delivered', it will automatically appear in this report.
          </p>
        </div>
      ) : activeTab === 'orders' ? (
        /* LIST BY ORDER VIEW (COLLAPSIBLE ACCORDION) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredOrders.map((order, idx) => {
            const isExpanded = !!expandedOrders[order.id];
            const customerName = order.user?.name || order.user?.company_name || 'Trade Customer';
            const customerEmail = order.user?.email || 'N/A';
            const dateStr = order.created_at
              ? new Date(order.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'N/A';

            let orderSubtotal = 0;
            let orderTotalCases = 0;

            const items = (order.items || []).map((item) => {
              const price = parseFloat(item.unit_price || item.product?.price || 0);
              let cases = parseInt(item.case_quantity || item.quantity || 0);
              let sub = parseFloat(item.subtotal || 0);

              if ((!cases || cases <= 1) && sub > price && price > 0) {
                cases = Math.round(sub / price);
              } else if (!cases || cases <= 0) {
                cases = 1;
              }

              if (!sub || sub <= 0) {
                sub = price * cases;
              }

              orderSubtotal += sub;
              orderTotalCases += cases;

              return {
                ...item,
                computedCases: cases,
                computedUnitPrice: price,
                computedSubtotal: sub,
              };
            });

            // VAT calculation
            const countryStr = (
              order.shipping_country ||
              order.user?.customerDetail?.country ||
              order.user?.country ||
              ''
            ).toLowerCase();

            const isUK = /\b(uk|united kingdom|gb|gbr|england|scotland|wales|great britain)\b/i.test(countryStr);
            const vatAmount = isUK ? orderSubtotal * 0.2 : 0;
            const grandTotal = orderSubtotal + vatAmount;

            return (
              <div
                key={order.id || idx}
                className="report-order-card"
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: isExpanded ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Order Header Bar (Clickable Accordion Trigger) */}
                <div
                  onClick={() => toggleOrderExpand(order.id)}
                  style={{
                    background: isExpanded ? 'rgba(30, 41, 59, 0.95)' : 'rgba(30, 41, 59, 0.6)',
                    padding: '14px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    userSelect: 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  {/* Left Info: Order # & Customer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      {order.order_number}
                    </span>

                    <div>
                      <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '15px' }}>
                        {customerName}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '8px' }}>
                        ({customerEmail})
                      </span>
                    </div>
                  </div>

                  {/* Middle Summary Stats (Always visible in compact row) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
                      <strong style={{ color: '#fbbf24' }}>{items.length}</strong> Line Items
                    </span>
                    <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
                      <strong style={{ color: '#fbbf24' }}>{orderTotalCases.toLocaleString()}</strong> Cases
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#34d399' }}>
                      £{grandTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94a3b8' }}>
                      <Calendar size={13} />
                      {dateStr}
                    </span>

                    <span
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {order.status || 'COMPLETED'}
                    </span>

                    {/* Expand/Collapse Chevron Indicator */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: isExpanded ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: isExpanded ? '#60a5fa' : '#94a3b8',
                        marginLeft: '4px',
                      }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Details Body */}
                {isExpanded && (
                  <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
                    {/* Items Table */}
                    <div style={{ overflowX: 'auto', padding: '8px 12px 0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <th style={{ padding: '10px 12px', width: '50px' }}>#</th>
                            <th style={{ padding: '10px 12px' }}>Product Code</th>
                            <th style={{ padding: '10px 12px' }}>Product Description</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Stock / Cases Sold</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>Price per Case</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, iIndex) => (
                            <tr
                              key={item.id || iIndex}
                              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#cbd5e1' }}
                            >
                              <td style={{ padding: '10px 12px', color: '#64748b' }}>{iIndex + 1}</td>
                              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#38bdf8' }}>
                                {item.product?.navsa_product_code || item.product?.reference || 'N/A'}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#f8fafc', fontWeight: 500 }}>
                                {item.product?.name || item.name || 'Catalogue Product'}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#fbbf24' }}>
                                {item.computedCases} Cases
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#e2e8f0' }}>
                                £{item.computedUnitPrice.toFixed(2)}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#fff' }}>
                                £{item.computedSubtotal.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer Totals Bar */}
                    <div
                      style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        padding: '14px 20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '24px',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ color: '#94a3b8' }}>
                        Subtotal:{' '}
                        <strong style={{ color: '#e2e8f0' }}>
                          £{orderSubtotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <div style={{ color: '#94a3b8' }}>
                        VAT Tax ({isUK ? '20% UK' : '0% Non-UK'}):{' '}
                        <strong style={{ color: '#e2e8f0' }}>
                          £{vatAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <div style={{ fontSize: '15px', color: '#34d399', fontWeight: 800 }}>
                        Order Total:{' '}
                        <span>
                          £{grandTotal.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* PRODUCT STOCK BREAKDOWN VIEW */
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    color: '#94a3b8',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <th style={{ padding: '12px 16px' }}>#</th>
                  <th style={{ padding: '12px 16px' }}>Product Code</th>
                  <th style={{ padding: '12px 16px' }}>Product Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Total Cases Sold</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Case Unit Price (£)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Total Revenue Generated (£)</th>
                </tr>
              </thead>
              <tbody>
                {productAggList.map((prod, pIdx) => (
                  <tr
                    key={prod.id || pIdx}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{pIdx + 1}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#38bdf8' }}>{prod.code}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#f8fafc' }}>{prod.name}</td>
                    <td
                      style={{
                        padding: '14px 16px',
                        textAlign: 'center',
                        fontWeight: 800,
                        color: '#fbbf24',
                      }}
                    >
                      {prod.totalCases} Cases
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: '#cbd5e1' }}>
                      £{prod.unitPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#34d399' }}>
                      £{prod.totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Print Specific Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .admin-sidebar, .admin-header, button, input {
            display: none !important;
          }
          .report-order-card {
            background: #ffffff !important;
            border: 1px solid #cccccc !important;
            color: #000000 !important;
            page-break-inside: avoid;
            margin-bottom: 20px !important;
          }
          th, td {
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
}
