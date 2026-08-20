import React, { useState } from 'react';
import { Plus, Minus, Search, Trash2, Database, List, Printer, FilePlus, Eye, Download } from 'lucide-react';
import useStore from '../store/useStore';
import './Purchase.css';

const Purchase = () => {
  const { suppliers, inventory, purchases, processPurchase } = useStore();
  const [activeTab, setActiveTab] = useState('New'); // 'New' or 'History'
  
  const [supplier, setSupplier] = useState('');
  const [paymentType, setPaymentType] = useState('Cash');
  const [items, setItems] = useState([{ productId: '', name: '', quantity: 1, price: 0 }]);
  
  // Quick Entry State
  const [tempProductId, setTempProductId] = useState('');
  const [tempQty, setTempQty] = useState(1);
  const [tempPrice, setTempPrice] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleDownload = (invoice) => {
    let content = `======================================\n`;
    content += `      PURCHASE RECEIPT\n`;
    content += `======================================\n`;
    content += `Receipt ID : ${invoice.id}\n`;
    content += `Date       : ${new Date(invoice.date).toLocaleString()}\n`;
    if (invoice.supplierName) content += `Supplier   : ${invoice.supplierName}\n`;
    content += `Payment    : ${invoice.paymentType}\n`;
    content += `--------------------------------------\n`;
    content += `Items:\n`;
    invoice.items.forEach(item => {
      content += `- ${item.name} | Qty: ${item.quantity} | Price: ৳${item.price}\n`;
    });
    content += `--------------------------------------\n`;
    content += `Total      : ৳${invoice.total}\n`;
    content += `======================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Purchase_${invoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPurchases = purchases.filter(p => {
    if (!startDate && !endDate) return true;
    const pDate = p.date.split('T')[0];
    if (startDate && pDate < startDate) return false;
    if (endDate && pDate > endDate) return false;
    return true;
  });

  return (
    <div className="purchase-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Purchase & Supplier Management</h1>
          <p className="text-muted">Enter new purchases from suppliers (Cash or Baki).</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0.5rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
        <div className="segmented-control">
          <button 
            type="button"
            className={activeTab === 'New' ? 'active' : ''}
            onClick={() => setActiveTab('New')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <FilePlus size={16} /> New Entry
          </button>
          <button 
            type="button"
            className={activeTab === 'History' ? 'active' : ''}
            onClick={() => setActiveTab('History')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <List size={16} /> Purchase History
          </button>
        </div>
      </div>

      {activeTab === 'New' && (
      <div className="quick-entry-container animate-slide-up">
        
        {/* TOP COMPACT HEADER */}
        <div className="qe-header">
          <div>
            <h2 className="text-xl font-bold mb-1">New Purchase</h2>
            <p className="text-muted text-sm">Add items quickly via the input row below.</p>
          </div>
          <div className="flex-align-gap">
            <div className="qe-field">
              <label>Date</label>
              <input type="date" value={new Date().toISOString().split('T')[0]} readOnly style={{ width: '140px', background: 'transparent' }} />
            </div>
            <div className="qe-field">
              <label>Supplier</label>
              <input 
                list="suppliers-list"
                placeholder="Search or Type Custom..."
                value={supplier} 
                onChange={(e) => setSupplier(e.target.value)} 
                style={{ width: '180px' }} 
              />
              <datalist id="suppliers-list">
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </datalist>
            </div>
            <div className="qe-field">
              <label>Payment</label>
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} style={{ width: '120px' }}>
                <option value="Cash">Cash</option>
                <option value="Baki">Baki</option>
              </select>
            </div>
          </div>
        </div>

        {/* SINGLE INPUT ROW (Quick Entry) */}
        <div className="qe-input-row">
          <div className="qe-field">
            <label>Product</label>
            <input 
              list="inventory-products"
              placeholder="Search or Type Custom Product..."
              value={tempProductId}
              onChange={(e) => {
                const val = e.target.value;
                setTempProductId(val);
                const prod = inventory.find(p => p.name === val || p.id === val);
                if (prod) setTempPrice(prod.price);
              }}
            />
            <datalist id="inventory-products">
              {inventory.map(p => <option key={p.id} value={p.name}>{p.name} (Stock: {p.stock})</option>)}
            </datalist>
          </div>
          <div className="qe-field">
            <label>Quantity</label>
            <input 
              type="number" 
              min="1" 
              value={tempQty}
              onChange={(e) => setTempQty(parseFloat(e.target.value) || 1)}
            />
          </div>
          <div className="qe-field">
            <label>Unit Price (৳)</label>
            <input 
              type="number" 
              min="0" 
              value={tempPrice}
              onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          <button 
            className="btn-primary" 
            style={{ height: '42px', padding: '0 1.5rem' }}
            onClick={() => {
              if (!tempProductId || tempQty <= 0) return;
              
              const prod = inventory.find(p => p.name === tempProductId || p.id === tempProductId);
              const finalId = prod ? prod.id : `CUSTOM_${Date.now()}`;
              const finalName = prod ? prod.name : tempProductId;
              
              const newItems = [...items.filter(i => i.productId)];
              const existingIndex = newItems.findIndex(i => i.productId === finalId);
              
              if (existingIndex >= 0) {
                newItems[existingIndex].quantity += tempQty;
                newItems[existingIndex].price = tempPrice; 
              } else {
                newItems.push({ productId: finalId, name: finalName, quantity: tempQty, price: tempPrice });
              }
              
              setItems(newItems);
              setTempProductId('');
              setTempQty(1);
              setTempPrice(0);
            }}
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {/* PREVIEW GRID (Read-Only) */}
        <div className="qe-table-container">
          <table className="qe-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th style={{ width: '50px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(i => i.productId).length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>
                    No items added yet. Use the row above to add products.
                  </td>
                </tr>
              ) : (
                items.filter(i => i.productId).map((item, index) => (
                  <tr key={index}>
                    <td className="font-bold text-main">{item.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>৳{item.price.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }} className="text-primary">
                      ৳{(item.quantity * item.price).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-icon text-danger" 
                        onClick={() => {
                          const newItems = items.filter(i => i.productId).filter((_, i) => i !== index);
                          setItems(newItems);
                        }}
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FLOATING FOOTER */}
        <div className="qe-footer">
          <div className="text-muted">
            {items.filter(i => i.productId).length} products added
          </div>
          <div className="flex-align-gap" style={{ gap: '2rem' }}>
            <div className="text-right">
              <div className="text-muted text-sm uppercase font-bold">Total Amount</div>
              <div className="qe-total">৳{items.reduce((acc, item) => acc + (item.quantity * item.price), 0).toLocaleString()}</div>
            </div>
            <button 
              className="btn-primary" 
              style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: 'var(--radius-lg)' }}
              onClick={() => {
                const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
                if (!supplier) {
                  alert('Please select a supplier');
                  return;
                }
                const validItems = items.filter(i => i.productId && i.quantity > 0);
                if (validItems.length === 0) {
                  alert('Please add at least one valid item');
                  return;
                }
                
                const supplierObj = suppliers.find(s => s.name === supplier || s.id === supplier);
                const finalSupplierId = supplierObj ? supplierObj.id : `SUP_CUSTOM_${Date.now()}`;
                const finalSupplierName = supplierObj ? supplierObj.name : supplier;
                
                processPurchase({
                  supplierId: finalSupplierId,
                  supplierName: finalSupplierName,
                  paymentType,
                  items: validItems,
                  total,
                  date: new Date().toISOString(),
                  id: 'PUR' + Date.now()
                });
                
                alert('Purchase successfully recorded!');
                setSupplier('');
                setItems([]);
                setActiveTab('History');
              }}
              disabled={items.filter(i => i.productId).length === 0 || !supplier}
            >
              <FilePlus size={20} className="mr-2 inline" />
              Save Purchase
            </button>
          </div>
        </div>

      </div>
      )}

      {activeTab === 'History' && (
      <div className="card glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h2>Purchase History</h2>
          <div className="flex-align-gap">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              title="Start Date"
            />
            <span>to</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              title="End Date"
            />
            <button className="btn-primary flex-align-gap" onClick={() => window.print()}>
              <Printer size={16} /> Print
            </button>
          </div>
        </div>
        <div className="table-responsive mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Purchase ID</th>
                <th>Supplier</th>
                <th>Items Qty</th>
                <th>Payment Type</th>
                <th>Total Cost</th>
                <th style={{textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map(p => (
                <tr key={p.id}>
                  <td>{p.date.split('T')[0]}</td>
                  <td>{p.id}</td>
                  <td>{p.supplierName}</td>
                  <td>{p.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
                  <td><span className={`badge ${p.paymentType === 'Cash' ? 'bg-success' : 'bg-warning'}`}>{p.paymentType}</span></td>
                  <td className="text-danger font-bold">৳{p.total.toLocaleString()}</td>
                  <td style={{textAlign:'center'}}>
                    <div className="flex-align-gap" style={{justifyContent:'center'}}>
                      <button className="btn-icon" title="View & Print" onClick={() => setSelectedInvoice(p)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(p)}>
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No purchase history found for this date range.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* History Print Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div id="printable-single-invoice-pur" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000', fontSize: '2rem', fontWeight: 'bold' }}>আল্লাহর দান জেন্টস পয়েন্ট</h2>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                 Purchase Receipt: {selectedInvoice.id}<br/>
                 Date: {new Date(selectedInvoice.date).toLocaleString()}
               </p>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               
               <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#333' }}>
                 {selectedInvoice.supplierName && <><strong>Supplier:</strong> {selectedInvoice.supplierName}<br/></>}
                 <strong>Payment:</strong> {selectedInvoice.paymentType}
               </div>

               <table style={{ width: '100%', fontSize: '0.9rem', marginBottom: '1rem', color: '#000' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{textAlign: 'left', paddingBottom: '0.5rem'}}>Item</th>
                      <th style={{textAlign: 'right', paddingBottom: '0.5rem'}}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ paddingTop: '0.5rem' }}>
                          {item.name} <br/> 
                          <small style={{ color: '#666' }}>{item.quantity} x ৳{item.price}</small>
                        </td>
                        <td style={{textAlign: 'right', paddingTop: '0.5rem'}}>
                          ৳{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: '#000' }}>
                  <span>Total:</span>
                  <span>৳{selectedInvoice.total}</span>
               </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-outline" onClick={() => setSelectedInvoice(null)}>Close</button>
              <button className="btn-primary flex-align-gap" onClick={() => {
                 const printContents = document.getElementById('printable-single-invoice-pur').innerHTML;
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

export default Purchase;
