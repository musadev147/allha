import React, { useState } from 'react';
import { RefreshCcw, Search, PackageMinus, PackagePlus, List, Plus, Printer, Eye, Download } from 'lucide-react';
import useStore from '../store/useStore';
import './Returns.css';

const Returns = () => {
  const { inventory, processReturn, returns } = useStore();
  const [activeTab, setActiveTab] = useState('New'); // 'New' or 'History'
  
  // New Return State
  const [returnType, setReturnType] = useState('Customer');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  // History State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product) {
      alert('Please select a product');
      return;
    }
    
    processReturn({
      returnType,
      productId: product,
      quantity,
      reason
    });
    
    alert(`${returnType} Return/Reject processed successfully! Stock has been adjusted.`);
    setProduct('');
    setQuantity(1);
    setReason('');
  };

  const filteredReturns = returns.filter(r => {
    if (!startDate && !endDate) return true;
    const rDate = r.date.split('T')[0];
    if (startDate && rDate < startDate) return false;
    if (endDate && rDate > endDate) return false;
    return true;
  });

  const getProductName = (id) => {
    const item = inventory.find(i => i.id === id);
    return item ? item.name : 'Unknown Product';
  };

  const handleDownload = (data) => {
    let content = `======================================\n`;
    content += `      RETURN/REJECT RECEIPT\n`;
    content += `======================================\n`;
    content += `Receipt ID : ${data.id}\n`;
    content += `Date       : ${new Date(data.date).toLocaleString()}\n`;
    content += `Type       : ${data.returnType} ${data.returnType === 'Customer' ? 'Return' : 'Reject'}\n`;
    content += `Product    : ${getProductName(data.productId)}\n`;
    content += `Quantity   : ${data.quantity}\n`;
    content += `Reason     : ${data.reason}\n`;
    content += `======================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Return_${data.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="returns-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Returns & Rejects</h1>
          <p className="text-muted">Handle customer returns or supplier rejects to adjust inventory.</p>
        </div>
      </div>

      <div className="card glass mb-4" style={{ padding: '0.5rem' }}>
        <div className="return-type-selector" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <button className={`type-btn ${activeTab === 'New' ? 'active' : ''}`} onClick={() => setActiveTab('New')} style={{ padding: '0.5rem 1rem', flex: '1 1 auto', minWidth: '120px' }}>
            <Plus size={16} className="inline-block mr-2" /> New Entry
          </button>
          <button className={`type-btn ${activeTab === 'History' ? 'active' : ''}`} onClick={() => setActiveTab('History')} style={{ padding: '0.5rem 1rem', flex: '1 1 auto', minWidth: '120px' }}>
            <List size={16} className="inline-block mr-2" /> Returns History
          </button>
        </div>
      </div>

      {activeTab === 'New' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="segmented-control" style={{ marginBottom: '2rem' }}>
            <button 
              type="button"
              className={returnType === 'Customer' ? 'active' : ''}
              onClick={() => setReturnType('Customer')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <PackagePlus size={16} /> Customer Return (Add to Stock)
            </button>
            <button 
              type="button"
              className={returnType === 'Supplier' ? 'active' : ''}
              onClick={() => setReturnType('Supplier')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <PackageMinus size={16} /> Supplier Reject (Remove Stock)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="return-form">
            <div className="form-group mb-4">
              <label>Product</label>
              <select value={product} onChange={(e) => setProduct(e.target.value)} required>
                <option value="">Select a product...</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>{item.name} (Stock: {item.stock})</option>
                ))}
              </select>
            </div>

            <div className="form-group mb-4">
              <label>Quantity</label>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label>Reason</label>
              <textarea 
                rows="3" 
                placeholder="Explain reason for return/reject..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full flex-align-gap center-content">
              <RefreshCcw size={18} />
              Process {returnType}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'History' && (
        <div className="card glass animate-slide-up">
          <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
             <h3>Returns & Rejects History</h3>
             <div className="flex-align-gap">
               <label className="text-muted text-sm">Filter by Date:</label>
               <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 bg-input border border-gray-700 rounded text-main" />
               <span className="text-muted">to</span>
               <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 bg-input border border-gray-700 rounded text-main" />
               <button className="btn-primary flex-align-gap" onClick={() => window.print()}>
                  <Printer size={18} /> Print List
               </button>
             </div>
          </div>
          <div className="table-responsive">
             <table className="data-table">
               <thead>
                 <tr>
                   <th>ID</th>
                   <th>Date</th>
                   <th>Type</th>
                   <th>Product</th>
                   <th>Qty</th>
                   <th>Reason</th>
                   <th style={{textAlign: 'center'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredReturns.map(r => (
                   <tr key={r.id}>
                     <td>{r.id}</td>
                     <td>{r.date.split('T')[0]}</td>
                     <td>
                        <span className={`badge ${r.returnType === 'Customer' ? 'bg-success text-success' : 'bg-danger text-danger'}`} style={{padding: '0.2rem 0.5rem', borderRadius: '4px', background: r.returnType === 'Customer' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)'}}>
                          {r.returnType} {r.returnType === 'Customer' ? 'Return' : 'Reject'}
                        </span>
                     </td>
                     <td>{getProductName(r.productId)}</td>
                     <td className="font-bold">{r.quantity}</td>
                     <td>{r.reason}</td>
                     <td style={{textAlign: 'center'}}>
                        <div className="flex-align-gap" style={{justifyContent:'center'}}>
                          <button className="btn-icon" title="View & Print" onClick={() => setSelectedInvoice(r)}>
                            <Eye size={16} />
                          </button>
                          <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(r)}>
                            <Download size={16} />
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
                 {filteredReturns.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No returns found.</td></tr>}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Single Return Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div id="printable-single-return" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000' }}>আল্লাহর দান জন্টস পেয়ন্ট</h2>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                 {selectedInvoice.returnType} {selectedInvoice.returnType === 'Customer' ? 'Return' : 'Reject'} Receipt<br/>
                 ID: {selectedInvoice.id}<br/>
                 Date: {new Date(selectedInvoice.date).toLocaleString()}
               </p>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               
               <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                 <p><strong>Product Name:</strong> {getProductName(selectedInvoice.productId)}</p>
                 <p><strong>Quantity:</strong> <span className="font-bold text-lg">{selectedInvoice.quantity}</span></p>
                 <p><strong>Reason:</strong> {selectedInvoice.reason}</p>
                 <p><strong>Effect:</strong> {selectedInvoice.returnType === 'Customer' ? 'Added to Stock (+)' : 'Removed from Stock (-)'}</p>
               </div>
               
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                 Thank you!
               </p>
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-outline" onClick={() => setSelectedInvoice(null)}>Close</button>
              <button className="btn-primary flex-align-gap" onClick={() => {
                 const printContents = document.getElementById('printable-single-return').innerHTML;
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

export default Returns;
