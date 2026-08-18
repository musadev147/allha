import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Search, Plus, Trash2, Gift, Printer } from 'lucide-react';
import './POS.css';

// Mock DB for POS lookup
const INVENTORY = [
  { id: '10001', name: 'Premium Rice 50kg', price: 3500 },
  { id: '10002', name: 'Refined Oil 5L', price: 850 },
  { id: '10003', name: 'Dal 1kg', price: 120 },
];

const POS = () => {
  const { cart, addToCart, removeFromCart, updateCartItem, clearCart } = useStore();
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [paymentType, setPaymentType] = useState('Cash');
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);

  // Automatically focus barcode input on mount
  useEffect(() => {
    document.getElementById('barcode-input')?.focus();
  }, []);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const product = INVENTORY.find(p => p.id === barcodeInput);
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
    // Simulate checkout
    alert('Sale Completed Successfully! Printing Invoice...');
    clearCart();
    setCustomerInfo({ name: '', phone: '' });
    setInvoiceDiscount(0);
  };

  return (
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
                <div className="item-actions">
                  <button className={`btn-icon ${item.isGift ? 'text-secondary' : 'text-muted'}`} title="Mark as Gift" onClick={() => toggleGift(item)}>
                    <Gift size={18} />
                  </button>
                  <div className="item-price">
                    ৳{item.isGift ? 0 : (item.price * item.quantity)}
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
          <label>Payment Type</label>
          <div className="payment-toggle">
            <button 
              className={`toggle-btn ${paymentType === 'Cash' ? 'active' : ''}`}
              onClick={() => setPaymentType('Cash')}
            >Cash</button>
            <button 
              className={`toggle-btn ${paymentType === 'Baki' ? 'active' : ''}`}
              onClick={() => setPaymentType('Baki')}
            >Baki (Due)</button>
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
    </div>
  );
};

export default POS;
