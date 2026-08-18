import React, { useState } from 'react';
import { RefreshCcw, Search } from 'lucide-react';
import './Returns.css';

const MOCK_INVENTORY = [
  { id: '10001', name: 'Premium Rice 50kg' },
  { id: '10002', name: 'Refined Oil 5L' }
];

const Returns = () => {
  const [returnType, setReturnType] = useState('Customer Return');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product) {
      alert('Please select a product');
      return;
    }
    alert(`${returnType} processed. Stock will be adjusted.`);
    setProduct('');
    setQuantity(1);
    setReason('');
  };

  return (
    <div className="returns-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Returns & Rejects</h1>
          <p className="text-muted">Handle customer returns or supplier rejects to adjust inventory.</p>
        </div>
      </div>

      <div className="card glass form-card">
        <div className="return-type-selector mb-4">
          <button 
            className={`type-btn ${returnType === 'Customer Return' ? 'active' : ''}`}
            onClick={() => setReturnType('Customer Return')}
          >
            Customer Return (Add to Stock)
          </button>
          <button 
            className={`type-btn ${returnType === 'Supplier Reject' ? 'active' : ''}`}
            onClick={() => setReturnType('Supplier Reject')}
          >
            Supplier Reject (Remove from Stock)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="return-form">
          <div className="form-group mb-4">
            <label>Product</label>
            <select value={product} onChange={(e) => setProduct(e.target.value)} required>
              <option value="">Select a product...</option>
              {MOCK_INVENTORY.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
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
    </div>
  );
};

export default Returns;
