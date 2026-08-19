import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Search, Plus, Minus, Trash2, Gift, Database, List, Printer, Eye, Download } from 'lucide-react';
import './POS.css';

const POS = () => {
  const { cart, inventory, staff, user, addToCart, removeFromCart, updateCartItem, clearCart, loadDummyData, processSale, sales } = useStore();
  const [activeTab, setActiveTab] = useState('New'); // 'New' or 'History'
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [paymentType, setPaymentType] = useState('Cash');
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [selectedSalesman, setSelectedSalesman] = useState(user?.id || 'Admin');
  const [completedSale, setCompletedSale] = useState(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleDownload = (invoice) => {
    let content = `======================================\n`;
    content += `      SALE RECEIPT\n`;
    content += `======================================\n`;
    content += `Receipt ID : ${invoice.id}\n`;
    content += `Date       : ${new Date(invoice.date).toLocaleString()}\n`;
    if (invoice.customerName) content += `Customer   : ${invoice.customerName}\n`;
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
    a.download = `Sale_${invoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSales = sales.filter(s => {
    if (!startDate && !endDate) return true;
    const sDate = s.date.split('T')[0];
    if (startDate && sDate < startDate) return false;
    if (endDate && sDate > endDate) return false;
    return true;
  });

  // Automatically focus barcode input on mount
  useEffect(() => {
    document.getElementById('barcode-input')?.focus();
  }, []);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    // Search by ID or exact Name match (case-insensitive)
    const product = inventory.find(p => 
      p.id === barcodeInput.trim() || 
      p.name.toLowerCase() === barcodeInput.trim().toLowerCase()
    );
    if (product) {
      addToCart({ ...product, isGift: false, itemDiscount: 0 });
      setBarcodeInput('');
    } else {
      alert('Product not found!');
    }
  };

  const toggleGift = (item) => {
    updateCartItem(item.id, { isGift: !item.isGift });
  };

  const subtotal = cart.reduce((acc, item) => {
    const effectivePrice = item.isGift ? 0 : (item.price - (item.itemDiscount || 0));
    return acc + (effectivePrice * item.quantity);
  }, 0);

  const total = Math.max(0, subtotal - invoiceDiscount);

  const handleCheckout = () => {
    if (paymentType === 'Baki' && !customerInfo.name) {
      alert('Customer Name is required for Baki sales!');
      return;
    }
    
    const salesmanObj = staff.find(s => s.id === selectedSalesman) || { id: 'Admin', name: 'Admin' };
    const saleData = {
      cartItems: cart,
      paymentType,
      customerInfo,
      invoiceDiscount,
      salesman: salesmanObj
    };
    
    processSale(saleData);
    setCompletedSale({ ...saleData, subtotal, total, date: new Date().toISOString(), invoiceId: 'INV' + Date.now() });
    
    clearCart();
    setCustomerInfo({ name: '', phone: '' });
    setInvoiceDiscount(0);
  };

  return (
    <div className="pos-page animate-fade-in">
      <div className="card" style={{ padding: '0.5rem', marginBottom: '1rem', maxWidth: '400px', margin: '0 auto 1rem auto' }}>
        <div className="segmented-control">
          <button 
            type="button"
            className={activeTab === 'New' ? 'active' : ''}
            onClick={() => setActiveTab('New')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Point of Sale
          </button>
          <button 
            type="button"
            className={activeTab === 'History' ? 'active' : ''}
            onClick={() => setActiveTab('History')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <List size={16} /> Sales History
          </button>
        </div>
      </div>

      {activeTab === 'New' && (
      <div className="pos-container animate-fade-in">
        <div className="pos-left glass">
          <div className="pos-header">
            <h2>Point of Sale</h2>
          <form onSubmit={handleBarcodeSubmit} className="barcode-form">
            <Search size={18} className="text-muted" />
            <input 
              id="barcode-input"
              type="text" 
              placeholder="Scan Barcode or Enter ID..." 
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn-primary">Add</button>
          </form>
        </div>

        {/* Quick Add Section */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0 1.5rem 1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          {inventory.length === 0 ? (
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={loadDummyData}>
              <Database size={16} /> Load Dummy Inventory
            </button>
          ) : (
            inventory.slice(0, 5).map(item => (
              <button 
                key={item.id} 
                className="btn-icon" 
                style={{ 
                  border: '1px solid var(--border-color)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--bg-input)'
                }}
                onClick={() => addToCart({ ...item, isGift: false, itemDiscount: 0 })}
              >
                {item.name} (৳{item.price})
              </button>
            ))
          )}
        </div>

        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-cart text-muted">Cart is empty. Scan an item to begin.</div>
          ) : (
            cart.map(item => (
              <div className="cart-item glass" key={item.id}>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <span className="text-muted">ID: {item.id} | ৳{item.price} x {item.quantity}</span>
                </div>
                <div className="item-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-input)', padding: '0.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                    <button 
                      className="btn-icon" 
                      style={{ padding: '0.2rem' }}
                      onClick={() => updateCartItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity}</span>
                    <button 
                      className="btn-icon" 
                      style={{ padding: '0.2rem' }}
                      onClick={() => updateCartItem(item.id, { quantity: item.quantity + 1 })}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="item-discount" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="text-muted" style={{fontSize: '0.8rem'}}>Disc:</span>
                    <input 
                      type="number" 
                      min="0"
                      style={{ width: '60px', padding: '0.2rem', fontSize: '0.85rem' }}
                      value={item.itemDiscount || ''}
                      onChange={(e) => updateCartItem(item.id, { itemDiscount: parseFloat(e.target.value) || 0 })}
                      disabled={item.isGift}
                      placeholder="0"
                    />
                  </div>
                  <button className={`btn-icon ${item.isGift ? 'text-secondary' : 'text-muted'}`} title="Mark as Gift" onClick={() => toggleGift(item)}>
                    <Gift size={18} />
                  </button>
                  <div className="item-price" style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                    ৳{item.isGift ? 0 : ((item.price - (item.itemDiscount || 0)) * item.quantity)}
                  </div>
                  <button className="btn-icon text-danger" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pos-right glass">
        <h3>Checkout Details</h3>
        
        <div className="checkout-section">
          <label>Customer Details (Required for Baki)</label>
          <input 
            type="text" 
            placeholder="Customer Name" 
            value={customerInfo.name}
            onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
            className="mb-2"
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={customerInfo.phone}
            onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
          />
        </div>

        <div className="checkout-section">
          <label>Salesman</label>
          <select 
            className="w-full mb-2" 
            value={selectedSalesman} 
            onChange={e => setSelectedSalesman(e.target.value)}
          >
            {user?.role === 'Admin' && <option value="Admin">Admin</option>}
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="checkout-section">
          <label>Payment Type</label>
            <div className="segmented-control">
              <button 
                type="button"
                className={paymentType === 'Cash' ? 'active' : ''}
                onClick={() => setPaymentType('Cash')}
              >
                Cash
              </button>
              <button 
                type="button"
                className={paymentType === 'Baki' ? 'active' : ''}
                onClick={() => setPaymentType('Baki')}
              >
                Baki (Due)
              </button>
            </div>
        </div>

        <div className="checkout-section summary-section">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Invoice Discount</span>
            <input 
              type="number" 
              className="discount-input"
              value={invoiceDiscount}
              onChange={e => setInvoiceDiscount(parseFloat(e.target.value) || 0)}
              min="0"
            />
          </div>
          <div className="summary-row total-row">
            <span>Total Payable</span>
            <span className="text-primary text-xl">৳{total}</span>
          </div>
        </div>

        <div className="checkout-actions">
          <button className="btn-primary checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>
            Complete Sale
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      {completedSale && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div id="printable-invoice" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000' }}>আল্লাহর দান জন্টস পেয়ন্ট</h2>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                 Receipt: {completedSale.invoiceId}<br/>
                 Date: {new Date(completedSale.date).toLocaleString()}
               </p>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               
               {completedSale.customerInfo.name && (
                 <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#333' }}>
                   <strong>Customer:</strong> {completedSale.customerInfo.name}<br/>
                   {completedSale.customerInfo.phone && <><strong>Phone:</strong> {completedSale.customerInfo.phone}</>}
                 </div>
               )}

               <table style={{ width: '100%', fontSize: '0.9rem', marginBottom: '1rem', color: '#000' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{textAlign: 'left', paddingBottom: '0.5rem'}}>Item</th>
                      <th style={{textAlign: 'right', paddingBottom: '0.5rem'}}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedSale.cartItems.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ paddingTop: '0.5rem' }}>
                          {item.name} {item.isGift && '(Gift)'} <br/> 
                          <small style={{ color: '#666' }}>{item.quantity} x ৳{item.price} {item.itemDiscount > 0 ? `(-৳${item.itemDiscount})` : ''}</small>
                        </td>
                        <td style={{textAlign: 'right', paddingTop: '0.5rem'}}>
                          ৳{item.isGift ? 0 : (item.price - (item.itemDiscount || 0)) * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#333', marginTop: '0.5rem' }}>
                  <span>Subtotal:</span>
                  <span>৳{completedSale.subtotal}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#333' }}>
                  <span>Discount:</span>
                  <span>৳{completedSale.invoiceDiscount}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: '#000' }}>
                  <span>Total Payable:</span>
                  <span>৳{completedSale.total}</span>
               </div>
               <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#555' }}>
                  <p style={{ marginBottom: '0.2rem' }}>Payment: {completedSale.paymentType}</p>
                  <p style={{ marginBottom: '0.5rem' }}>Salesman: {completedSale.salesman?.name}</p>
                  <p>Thank you for shopping with us!</p>
               </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-outline" onClick={() => setCompletedSale(null)}>Close</button>
              <button className="btn-primary flex-align-gap" onClick={() => {
                 const printContents = document.getElementById('printable-invoice').innerHTML;
                 const originalContents = document.body.innerHTML;
                 document.body.innerHTML = printContents;
                 window.print();
                 document.body.innerHTML = originalContents;
                 window.location.reload(); 
              }}>
                <Printer size={18} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      )}

      {activeTab === 'History' && (
      <div className="card glass animate-slide-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h2>Sales History</h2>
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
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th style={{textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(s => (
                <tr key={s.id}>
                  <td>{s.date.split('T')[0]}</td>
                  <td>{s.id}</td>
                  <td>{s.customerName || 'N/A'}</td>
                  <td>{s.items.length} items</td>
                  <td><span className={`badge ${s.paymentType === 'Cash' ? 'bg-success' : 'bg-warning'}`}>{s.paymentType}</span></td>
                  <td className="text-primary font-bold">৳{s.total.toLocaleString()}</td>
                  <td style={{textAlign:'center'}}>
                    <div className="flex-align-gap" style={{justifyContent:'center'}}>
                      <button className="btn-icon" title="View & Print" onClick={() => setSelectedInvoice(s)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(s)}>
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No sales history found for this date range.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* History Print Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div id="printable-single-invoice-pos" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000' }}>আল্লাহর দান জন্টস পেয়ন্ট</h2>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                 Sale Receipt: {selectedInvoice.id}<br/>
                 Date: {new Date(selectedInvoice.date).toLocaleString()}
               </p>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               
               <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#333' }}>
                 {selectedInvoice.customerName && <><strong>Customer:</strong> {selectedInvoice.customerName}<br/></>}
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
                 const printContents = document.getElementById('printable-single-invoice-pos').innerHTML;
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

export default POS;
