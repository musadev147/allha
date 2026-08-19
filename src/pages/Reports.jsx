import React, { useState } from 'react';
import { BarChart, PieChart, TrendingUp, DollarSign, Users, Package, Calendar, Printer, Database, ShoppingCart, Download, Eye } from 'lucide-react';
import useStore from '../store/useStore';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Sales');
  const [dateFilter, setDateFilter] = useState('Daily'); // Daily, Weekly, Monthly, Custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceType, setInvoiceType] = useState(''); // 'Sale' or 'Purchase'

  const handleDownload = (data, type) => {
    let content = `======================================\n`;
    content += `      ${type.toUpperCase()} DOCUMENT\n`;
    content += `======================================\n`;
    
    if (type === 'Sale' || type === 'Purchase') {
      content += `Invoice ID : ${data.id}\n`;
      content += `Date       : ${new Date(data.date).toLocaleString()}\n`;
      if (data.customerName) content += `Customer   : ${data.customerName}\n`;
      if (data.supplierName) content += `Supplier   : ${data.supplierName}\n`;
      content += `Payment    : ${data.paymentType}\n`;
      content += `--------------------------------------\n`;
      content += `Items:\n`;
      data.items.forEach(item => {
        content += `- ${item.name} | Qty: ${item.quantity} | Price: ৳${item.price}\n`;
      });
      content += `--------------------------------------\n`;
      content += `Total      : ৳${data.total}\n`;
    } else if (type === 'Payroll') {
       content += `Staff Name : ${data.staffName}\n`;
       content += `Month      : ${data.month}\n`;
       content += `Net Pay    : ৳${data.netPay}\n`;
       content += `Bonus      : ৳${data.bonus}\n`;
       content += `Date       : ${data.paymentDate.split('T')[0]}\n`;
       content += `--------------------------------------\n`;
       content += `Total Paid : ৳${data.netPay + data.bonus}\n`;
    } else if (type === 'Customer Due' || type === 'Supplier Due') {
       content += `Name       : ${data.name}\n`;
       content += `Phone      : ${data.phone}\n`;
       content += `Total Due  : ৳${data.due}\n`;
    } else if (type === 'Stock') {
       content += `Item Name  : ${data.name}\n`;
       content += `Category   : ${data.category}\n`;
       content += `All Time In: +${data.totalIn}\n`;
       content += `All Time Out: -${data.totalOut}\n`;
       content += `Stock      : ${data.stock} ${data.unit}\n`;
    } else if (type === 'Salesman') {
       content += `Salesman   : ${data.name}\n`;
       content += `Invoices   : ${data.count}\n`;
       content += `Total Sales: ৳${data.total}\n`;
    } else if (type === 'Expense') {
       content += `Category   : ${data.category}\n`;
       content += `Amount     : ৳${data.amount}\n`;
    }
    
    content += `======================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.replace(/\s+/g, '_')}_${data.id || data.name || data.category || 'report'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { sales, inventory, purchases, expenses, customers, suppliers, staff, payrolls, returns, attendance, leaves, loadDummyData } = useStore();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentMonthStr = today.toISOString().substring(0, 7);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  // Helper to check if a date string falls within the selected filter
  const isWithinFilter = (dateStr) => {
    if (!dateStr) return false;
    const itemDateStr = dateStr.split('T')[0];
    
    if (dateFilter === 'Daily') {
      return itemDateStr === todayStr;
    } else if (dateFilter === 'Weekly') {
      const itemDate = new Date(itemDateStr);
      return itemDate >= lastWeek && itemDate <= today;
    } else if (dateFilter === 'Monthly') {
      return itemDateStr.startsWith(currentMonthStr);
    } else if (dateFilter === 'Custom') {
      if (!startDate && !endDate) return true;
      if (startDate && itemDateStr < startDate) return false;
      if (endDate && itemDateStr > endDate) return false;
      return true;
    }
    return true;
  };

  // 1. Sales Report Data
  const filteredSales = sales.filter(s => isWithinFilter(s.date));
  const totalSalesAmount = filteredSales.reduce((acc, s) => acc + s.total, 0);
  const totalInvoices = filteredSales.length;

  // 1.5 Purchase Report Data
  const filteredPurchases = purchases.filter(p => isWithinFilter(p.date));
  const totalPurchasesCost = filteredPurchases.reduce((acc, p) => acc + p.total, 0);
  const totalPurchaseInvoices = filteredPurchases.length;

  // 2. Stock Report Data
  const stockData = inventory.map(item => {
    const stockInPurchases = purchases.reduce((acc, p) => {
      const pItem = p.items.find(i => i.name.toLowerCase() === item.name.toLowerCase());
      return acc + (pItem ? pItem.quantity : 0);
    }, 0);
    const stockInReturns = returns.filter(r => r.returnType === 'Customer' && r.productId === item.id).reduce((acc, r) => acc + r.quantity, 0);
    const totalIn = stockInPurchases + stockInReturns;

    const stockOutSales = sales.reduce((acc, s) => {
      const sItem = s.items.find(i => i.id === item.id);
      return acc + (sItem ? sItem.quantity : 0);
    }, 0);
    const stockOutReturns = returns.filter(r => r.returnType === 'Supplier' && r.productId === item.id).reduce((acc, r) => acc + r.quantity, 0);
    const totalOut = stockOutSales + stockOutReturns;

    return { ...item, totalIn, totalOut };
  });

  // 3. Profit & Loss Data
  const filteredExpenses = expenses.filter(e => isWithinFilter(e.date));
  const totalExpenseCost = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalCost = totalPurchasesCost + totalExpenseCost;
  const netProfit = totalSalesAmount - totalCost;

  // 4. Due Report Data
  const dueCustomers = customers.filter(c => c.due > 0);
  const dueSuppliers = suppliers.filter(s => s.due > 0);
  const totalCustomerDue = dueCustomers.reduce((acc, c) => acc + c.due, 0);
  const totalSupplierDue = dueSuppliers.reduce((acc, s) => acc + s.due, 0);

  // 5. Salesman-wise Report
  const salesmanData = {};
  filteredSales.forEach(s => {
    const sm = s.salesmanName || 'Unknown';
    if (!salesmanData[sm]) salesmanData[sm] = { count: 0, total: 0 };
    salesmanData[sm].count += 1;
    salesmanData[sm].total += s.total;
  });

  // 6. Expense Report Data
  const expenseByCategory = {};
  filteredExpenses.forEach(e => {
    if (!expenseByCategory[e.category]) expenseByCategory[e.category] = 0;
    expenseByCategory[e.category] += e.amount;
  });

  // 7. HR & Payroll Report Data
  const filteredPayrolls = payrolls.filter(p => isWithinFilter(p.paymentDate || p.month));
  const totalSalaryPaid = filteredPayrolls.reduce((acc, p) => acc + p.netPay, 0);
  const totalBonusPaid = filteredPayrolls.reduce((acc, p) => acc + p.bonus, 0);

  const TABS = [
    { id: 'Sales', label: 'Sales', icon: BarChart },
    { id: 'Purchases', label: 'Purchases', icon: ShoppingCart },
    { id: 'Stock', label: 'Stock', icon: Package },
    { id: 'ProfitLoss', label: 'Profit & Loss', icon: TrendingUp },
    { id: 'Due', label: 'Due Report', icon: DollarSign },
    { id: 'Salesman', label: 'Salesman', icon: Users },
    { id: 'Expense', label: 'Expense', icon: PieChart },
    { id: 'HR', label: 'HR & Payroll', icon: Calendar },
  ];

  return (
    <div className="reports-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted">Comprehensive business intelligence and reporting.</p>
        </div>
        <div className="flex-align-gap">
          <label className="text-muted text-sm">Timeframe:</label>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="p-2 bg-input border border-gray-700 rounded text-main">
            <option value="Daily">Daily (Today)</option>
            <option value="Weekly">Weekly (Last 7 Days)</option>
            <option value="Monthly">Monthly (Current Month)</option>
            <option value="Custom">Custom Range</option>
          </select>
          {dateFilter === 'Custom' && (
            <div className="flex-align-gap">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 bg-input border border-gray-700 rounded text-main" />
              <span className="text-muted">to</span>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 bg-input border border-gray-700 rounded text-main" />
            </div>
          )}
          {sales.length === 0 && (
            <button className="btn-secondary flex-align-gap" onClick={loadDummyData}>
              <Database size={18} /> Load Dummy Data
            </button>
          )}
          <button className="btn-primary flex-align-gap" onClick={() => window.print()}>
            <Printer size={18} /> Print Report
          </button>
        </div>
      </div>

      <div className="card glass mb-4" style={{ padding: '0.5rem' }}>
        <div className="return-type-selector" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          {TABS.map(tab => (
            <button key={tab.id} className={`type-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.5rem 1rem', flex: '1 1 auto', minWidth: '120px' }}>
              <tab.icon size={16} className="inline-block mr-2" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Sales Report */}
      {activeTab === 'Sales' && (
        <div className="card glass">
          <h3>Sales Report ({dateFilter})</h3>
          <div className="grid responsive-grid-2 mt-4 mb-4">
             <div className="card bg-input text-center">
               <h4 className="text-muted">Total Revenue</h4>
               <p className="text-2xl text-primary font-bold">৳{totalSalesAmount.toLocaleString()}</p>
             </div>
             <div className="card bg-input text-center">
               <h4 className="text-muted">Invoices Generated</h4>
               <p className="text-2xl font-bold">{totalInvoices}</p>
             </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Invoice ID</th><th>Date</th><th>Customer</th><th>Items</th><th>Total Amount</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
              <tbody>
                {filteredSales.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td><td>{s.date.split('T')[0]}</td><td>{s.customerName}</td><td>{s.items.length}</td><td className="text-primary font-bold">৳{s.total.toLocaleString()}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice(s); setInvoiceType('Sale'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(s, 'Sale')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSales.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No sales found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1.5 Purchase Report */}
      {activeTab === 'Purchases' && (
        <div className="card glass">
          <h3>Purchases Report ({dateFilter})</h3>
          <div className="grid responsive-grid-2 mt-4 mb-4">
             <div className="card bg-input text-center">
               <h4 className="text-muted">Total Purchase Cost</h4>
               <p className="text-2xl text-danger font-bold">৳{totalPurchasesCost.toLocaleString()}</p>
             </div>
             <div className="card bg-input text-center">
               <h4 className="text-muted">Invoices Generated</h4>
               <p className="text-2xl font-bold">{totalPurchaseInvoices}</p>
             </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Invoice ID</th><th>Date</th><th>Supplier</th><th>Items Qty</th><th>Total Amount</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
              <tbody>
                {filteredPurchases.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td><td>{p.date.split('T')[0]}</td><td>{p.supplierName}</td><td>{p.items.reduce((acc, i) => acc + i.quantity, 0)}</td><td className="text-danger font-bold">৳{p.total.toLocaleString()}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice(p); setInvoiceType('Purchase'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(p, 'Purchase')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPurchases.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No purchases found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Stock Report */}
      {activeTab === 'Stock' && (
        <div className="card glass">
          <h3>Stock Report (Current Balance & History)</h3>
          <p className="text-muted text-sm mb-4">Stock In/Out is calculated from all-time Purchases, Sales, and Returns.</p>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Item Name</th><th>Category</th><th>All Time IN</th><th>All Time OUT</th><th>Current Stock</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
              <tbody>
                {stockData.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td className="text-success">+{item.totalIn}</td>
                    <td className="text-danger">-{item.totalOut}</td>
                    <td className="font-bold">{item.stock} {item.unit}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice(item); setInvoiceType('Stock'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(item, 'Stock')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Profit & Loss Report */}
      {activeTab === 'ProfitLoss' && (
        <div className="card glass">
          <h3>Profit & Loss Report ({dateFilter})</h3>
          <div className="grid responsive-grid-3 mt-4 mb-4">
             <div className="card bg-input text-center">
               <h4 className="text-muted">Total Revenue</h4>
               <p className="text-2xl text-primary font-bold">৳{totalSalesAmount.toLocaleString()}</p>
             </div>
             <div className="card bg-input text-center">
               <h4 className="text-muted">Total Cost (Purchases + Expense)</h4>
               <p className="text-2xl text-danger font-bold">৳{totalCost.toLocaleString()}</p>
             </div>
             <div className="card bg-input text-center" style={{ border: `1px solid ${netProfit >= 0 ? 'var(--success)' : 'var(--danger)'}` }}>
               <h4 className="text-muted">Net Profit</h4>
               <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>৳{netProfit.toLocaleString()}</p>
             </div>
          </div>
        </div>
      )}

      {/* 4. Due Report */}
      {activeTab === 'Due' && (
        <div className="grid responsive-grid-2" style={{ gap: '1.5rem' }}>
          <div className="card glass">
            <h3 className="text-success mb-2">To Receive (Customer Due)</h3>
            <p className="text-2xl font-bold mb-4">৳{totalCustomerDue.toLocaleString()}</p>
            <div className="table-responsive">
              <table className="data-table">
                <thead><tr><th>Customer Name</th><th>Phone</th><th>Due Amount</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
                <tbody>
                  {dueCustomers.map(c => <tr key={c.id}><td>{c.name}</td><td>{c.phone}</td><td className="text-warning font-bold">৳{c.due.toLocaleString()}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice(c); setInvoiceType('Customer Due'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(c, 'Customer Due')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>)}
                  {dueCustomers.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No customer dues.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card glass">
            <h3 className="text-danger mb-2">To Pay (Supplier Due)</h3>
            <p className="text-2xl font-bold mb-4">৳{totalSupplierDue.toLocaleString()}</p>
            <div className="table-responsive">
              <table className="data-table">
                <thead><tr><th>Supplier Name</th><th>Phone</th><th>Due Amount</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
                <tbody>
                  {dueSuppliers.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.phone}</td><td className="text-danger font-bold">৳{s.due.toLocaleString()}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice(s); setInvoiceType('Supplier Due'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(s, 'Supplier Due')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>)}
                  {dueSuppliers.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No supplier dues.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Salesman-wise Report */}
      {activeTab === 'Salesman' && (
        <div className="card glass">
          <h3>Salesman-wise Report ({dateFilter})</h3>
          <div className="table-responsive mt-4">
            <table className="data-table">
              <thead><tr><th>Salesman Name</th><th>Invoices Handled</th><th>Total Sales Amount</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
              <tbody>
                {Object.keys(salesmanData).map(sm => (
                  <tr key={sm}>
                    <td>{sm}</td>
                    <td>{salesmanData[sm].count}</td>
                    <td className="text-primary font-bold">৳{salesmanData[sm].total.toLocaleString()}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice({ name: sm, ...salesmanData[sm] }); setInvoiceType('Salesman'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload({ name: sm, ...salesmanData[sm] }, 'Salesman')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {Object.keys(salesmanData).length === 0 && <tr><td colSpan="4" className="text-center text-muted">No sales data found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Expense Report */}
      {activeTab === 'Expense' && (
        <div className="card glass">
          <h3>Expense Report ({dateFilter})</h3>
          <p className="text-2xl text-danger font-bold mb-4 mt-2">Total: ৳{totalExpenseCost.toLocaleString()}</p>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Category</th><th>Total Amount</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
              <tbody>
                {Object.keys(expenseByCategory).map(cat => (
                  <tr key={cat}>
                    <td>{cat}</td>
                    <td className="text-danger font-bold">৳{expenseByCategory[cat].toLocaleString()}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice({ category: cat, amount: expenseByCategory[cat] }); setInvoiceType('Expense'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload({ category: cat, amount: expenseByCategory[cat] }, 'Expense')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {Object.keys(expenseByCategory).length === 0 && <tr><td colSpan="3" className="text-center text-muted">No expenses found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. HR & Payroll Report */}
      {activeTab === 'HR' && (
        <div className="card glass">
          <h3>HR & Payroll Report ({dateFilter})</h3>
          <div className="grid responsive-grid-2 mt-4 mb-4">
             <div className="card bg-input text-center">
               <h4 className="text-muted">Total Salary Paid</h4>
               <p className="text-2xl text-warning font-bold">৳{totalSalaryPaid.toLocaleString()}</p>
             </div>
             <div className="card bg-input text-center">
               <h4 className="text-muted">Total Bonus Paid</h4>
               <p className="text-2xl text-success font-bold">৳{totalBonusPaid.toLocaleString()}</p>
             </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Staff ID</th><th>Month</th><th>Net Pay</th><th>Bonus</th><th>Payment Date</th><th style={{textAlign:'center'}}>Actions</th></tr></thead>
              <tbody>
                {filteredPayrolls.map(p => (
                  <tr key={p.id}>
                    <td>{p.staffName}</td>
                    <td>{p.month}</td>
                    <td className="font-bold">৳{p.netPay.toLocaleString()}</td>
                    <td>৳{p.bonus.toLocaleString()}</td>
                    <td>{p.paymentDate.split('T')[0]}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => { setSelectedInvoice(p); setInvoiceType('Payroll'); }}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(p, 'Payroll')}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPayrolls.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No payroll data found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal for Print */}
      {selectedInvoice && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div id="printable-single-invoice" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000' }}>আল্লাহর দান জন্টস পেয়ন্ট</h2>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                 {invoiceType} Document<br/>
                 {selectedInvoice.date && `Date: ${new Date(selectedInvoice.date).toLocaleString()}`}
                 {selectedInvoice.paymentDate && `Date: ${selectedInvoice.paymentDate.split('T')[0]}`}
               </p>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               
               {(invoiceType === 'Sale' || invoiceType === 'Purchase') && (
                 <>
                   <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#333' }}>
                     {selectedInvoice.customerName && <><strong>Customer:</strong> {selectedInvoice.customerName}<br/></>}
                     {selectedInvoice.supplierName && <><strong>Supplier:</strong> {selectedInvoice.supplierName}<br/></>}
                     <strong>Payment:</strong> {selectedInvoice.paymentType}
                   </div>
                   <table style={{ width: '100%', fontSize: '0.9rem', marginBottom: '1rem', color: '#000' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}><th style={{textAlign: 'left', paddingBottom: '0.5rem'}}>Item</th><th style={{textAlign: 'right', paddingBottom: '0.5rem'}}>Total</th></tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ paddingTop: '0.5rem' }}>{item.name} <br/> <small style={{ color: '#666' }}>{item.quantity} x ৳{item.price}</small></td>
                            <td style={{textAlign: 'right', paddingTop: '0.5rem'}}>৳{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                   <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: '#000' }}>
                      <span>Total {invoiceType}:</span><span>৳{selectedInvoice.total}</span>
                   </div>
                 </>
               )}

               {invoiceType === 'Payroll' && (
                 <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                   <p><strong>Staff Name:</strong> {selectedInvoice.staffName}</p>
                   <p><strong>Month:</strong> {selectedInvoice.month}</p>
                   <p><strong>Net Salary:</strong> ৳{selectedInvoice.netPay.toLocaleString()}</p>
                   <p><strong>Bonus:</strong> ৳{selectedInvoice.bonus.toLocaleString()}</p>
                   <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                   <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: '#000' }}><strong>Total Paid:</strong> ৳{(selectedInvoice.netPay + selectedInvoice.bonus).toLocaleString()}</p>
                 </div>
               )}

               {(invoiceType === 'Customer Due' || invoiceType === 'Supplier Due') && (
                 <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                   <p><strong>Name:</strong> {selectedInvoice.name}</p>
                   <p><strong>Phone:</strong> {selectedInvoice.phone}</p>
                   <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                   <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: 'red' }}><strong>Total Due:</strong> ৳{selectedInvoice.due.toLocaleString()}</p>
                 </div>
               )}

               {invoiceType === 'Stock' && (
                 <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                   <p><strong>Item Name:</strong> {selectedInvoice.name}</p>
                   <p><strong>Category:</strong> {selectedInvoice.category}</p>
                   <p><strong>Total In:</strong> <span style={{color:'green'}}>+{selectedInvoice.totalIn}</span></p>
                   <p><strong>Total Out:</strong> <span style={{color:'red'}}>-{selectedInvoice.totalOut}</span></p>
                   <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                   <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: '#000' }}><strong>Current Stock:</strong> {selectedInvoice.stock} {selectedInvoice.unit}</p>
                 </div>
               )}

               {invoiceType === 'Salesman' && (
                 <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                   <p><strong>Salesman:</strong> {selectedInvoice.name}</p>
                   <p><strong>Invoices Handled:</strong> {selectedInvoice.count}</p>
                   <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                   <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: '#000' }}><strong>Total Sales:</strong> ৳{selectedInvoice.total.toLocaleString()}</p>
                 </div>
               )}

               {invoiceType === 'Expense' && (
                 <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                   <p><strong>Category:</strong> {selectedInvoice.category}</p>
                   <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                   <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: 'red' }}><strong>Total Expense:</strong> ৳{selectedInvoice.amount.toLocaleString()}</p>
                 </div>
               )}
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-outline" onClick={() => setSelectedInvoice(null)}>Close</button>
              <button className="btn-primary flex-align-gap" onClick={() => {
                 const printContents = document.getElementById('printable-single-invoice').innerHTML;
                 const originalContents = document.body.innerHTML;
                 document.body.innerHTML = printContents;
                 window.print();
                 document.body.innerHTML = originalContents;
                 window.location.reload(); 
              }}>
                <Printer size={18} /> Print
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
