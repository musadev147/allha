import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import './Purchase.css';

const MOCK_SUPPLIERS = [
  { id: 'S001', name: 'Rahim Traders' },
  { id: 'S002', name: 'Global Impex' }
];

const Purchase = () => {
  const [supplier, setSupplier] = useState('');
  const [paymentType, setPaymentType] = useState('Cash');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [total, setTotal] = useState(0);

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    // Calc total
    let newTotal = 0;
    newItems.forEach(item => {
      newTotal += (item.quantity * item.price);
    });
    setTotal(newTotal);
  };

  return (
    <div className="purchase-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Purchase & Supplier Management</h1>
          <p className="text-muted">Enter new purchases from suppliers (Cash or Baki).</p>
        </div>
      </div>

      <div className="card glass purchase-form-container">
        <h2>New Purchase Entry</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Supplier</label>
            <select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <option value="">Select Supplier...</option>
              {MOCK_SUPPLIERS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Payment Type</label>
            <div className="radio-group">
              <label>
                <input type="radio" value="Cash" checked={paymentType === 'Cash'} onChange={() => setPaymentType('Cash')} />
                Cash
              </label>
              <label>
                <input type="radio" value="Baki" checked={paymentType === 'Baki'} onChange={() => setPaymentType('Baki')} />
                Baki (Due)
              </label>
            </div>
          </div>
        </div>

        <div className="purchase-items">
          <h3>Items</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input 
                      type="text" 
                      placeholder="Product name..." 
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td>৳{item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="purchase-footer">
            <button className="btn-outline flex-align-gap" onClick={handleAddItem}>
              <Plus size={16} /> Add Another Item
            </button>
            <div className="purchase-total">
              <strong>Total: </strong>
              <span className="text-info">৳{total}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary">Submit Purchase</button>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
