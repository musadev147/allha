import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Send, MessageSquare, Users, Search, ShoppingCart } from 'lucide-react';
import { t } from '../utils/i18n';

const SMS = () => {
  const { customers, user, smsBalance, purchaseSms, language } = useStore();
  const [activeTab, setActiveTab] = useState('Send');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.phone && c.phone.includes(searchTerm))
  );

  // Only Admin can send SMS based on the requirement
  if (user?.role !== 'Admin') {
    return (
      <div className="card text-center" style={{ marginTop: '2rem' }}>
        <h2 className="text-danger">{t(language, 'Access Denied')}</h2>
        <p className="text-muted">{language === 'bn' ? 'শুধুমাত্র এডমিন এসএমএস সিস্টেম অ্যাক্সেস করতে পারেন।' : 'Only Admins can access the SMS system.'}</p>
      </div>
    );
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(cId => cId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleSendSMS = (e) => {
    e.preventDefault();
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer.');
      return;
    }
    if (!message.trim()) {
      alert('Message cannot be empty.');
      return;
    }

    // Mock sending SMS
    setStatus('Sending SMS to ' + selectedCustomers.length + ' customers...');
    
    setTimeout(() => {
      setStatus('');
      alert(`SMS sent successfully to ${selectedCustomers.length} customers!`);
      setMessage('');
      setSelectedCustomers([]);
    }, 1500);
  };

  return (
    <div className="sms-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>{t(language, 'Customer SMS System' || 'SMS System')}</h1>
          <p className="text-muted">{language === 'bn' ? 'কাস্টমারদের প্রোমোশনাল বা বকেয়া রিমাইন্ডার এসএমএস পাঠান।' : 'Send promotional or due reminder SMS to customers.'}</p>
        </div>
      </div>

      <div className="card glass mb-4" style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="return-type-selector" style={{ gap: '0.5rem' }}>
          <button className={`type-btn ${activeTab === 'Send' ? 'active' : ''}`} onClick={() => setActiveTab('Send')}>
            <Send size={16} className="inline mr-2" /> {t(language, 'Send SMS' || 'Send SMS')}
          </button>
          <button className={`type-btn ${activeTab === 'Buy' ? 'active' : ''}`} onClick={() => setActiveTab('Buy')}>
            <ShoppingCart size={16} className="inline mr-2" /> {t(language, 'Buy SMS Package' || 'Buy SMS Package')}
          </button>
        </div>
        <div style={{ paddingRight: '1rem', fontWeight: 'bold' }}>
          {t(language, 'Current SMS Balance' || 'Current SMS Balance')}: <span className="text-primary">{smsBalance} {t(language, 'SMS')}</span>
        </div>
      </div>

      {activeTab === 'Send' && (
      <div className="grid responsive-grid-2">
        <div className="card">
          <div className="card-toolbar" style={{ marginBottom: '1rem' }}>
            <h3><Users size={18} className="inline mr-2" /> {t(language, 'Select Customers' || 'Select Customers')}</h3>
            <label className="flex-align-gap" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                onChange={handleSelectAll}
              />
              {t(language, 'Select All')}
            </label>
          </div>
          
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
             <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted, #9ca3af)' }} />
             <input 
               type="text"
               placeholder="Search customers by name or phone..."
               className="w-full"
               style={{ paddingLeft: '35px' }}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>{t(language, 'Name')}</th>
                  <th>{t(language, 'Phone')}</th>
                  <th>{t(language, 'Due')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted">No customers found.</td></tr>
                ) : (
                  filteredCustomers.map(c => (
                    <tr key={c.id}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedCustomers.includes(c.id)}
                          onChange={() => handleSelect(c.id)}
                        />
                      </td>
                      <td>{c.name}</td>
                      <td>{c.phone || 'N/A'}</td>
                      <td className={c.due > 0 ? 'text-danger font-bold' : 'text-success'}>৳{c.due}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3><MessageSquare size={18} className="inline mr-2" /> {t(language, 'Compose Message' || 'Compose Message')}</h3>
          <form onSubmit={handleSendSMS} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>{t(language, 'Message Content' || 'Message Content')}</label>
              <textarea 
                className="w-full"
                rows="6"
                placeholder={t(language, 'Search')}
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ resize: 'vertical' }}
              ></textarea>
              <p className="text-sm text-muted mt-2 text-right">
                {t(language, 'Characters' || 'Characters')}: {message.length} ({(message.length / 160).toFixed(1)} {t(language, 'SMS')})
              </p>
            </div>

            {status && (
              <div className="mt-4 p-3 rounded" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', textAlign: 'center', fontWeight: 'bold' }}>
                {status}
              </div>
            )}

            <div className="mt-4 text-right">
              <button 
                type="submit" 
                className="btn-primary flex-align-gap" 
                style={{ marginLeft: 'auto' }}
                disabled={!!status}
              >
                <Send size={18} /> {t(language, 'Send SMS')} ({selectedCustomers.length} {t(language, 'selected' || 'selected')})
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {activeTab === 'Buy' && (
        <div className="card glass" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="mb-4">{t(language, 'Purchase SMS Balance' || 'Purchase SMS Balance')}</h2>
          <p className="text-muted mb-6">{language === 'bn' ? 'এসএমএস ব্যালেন্স রিচার্জ করার জন্য একটি প্যাকেজ বেছে নিন। ক্যাশ ব্যালেন্স থেকে টাকা কাটা হবে।' : 'Choose a package to instantly recharge your SMS balance. Amount will be deducted from your Cash Balance.'}</p>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {[
              { amount: 500, cost: 100 },
              { amount: 1000, cost: 200 },
              { amount: 5000, cost: 800 },
            ].map((pkg, idx) => (
              <div key={idx} className="card bg-input" style={{ border: '2px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s' }} 
                   onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                   onClick={() => {
                     if(window.confirm(`Are you sure you want to purchase ${pkg.amount} SMS for ৳${pkg.cost}?`)) {
                       purchaseSms(pkg.amount, pkg.cost);
                       alert('SMS Package Purchased Successfully!');
                     }
                   }}>
                <MessageSquare size={32} className="mx-auto mb-2 text-primary" />
                <h3 className="font-bold">{pkg.amount} {t(language, 'SMS')}</h3>
                <p className="text-muted mt-2">৳{pkg.cost}</p>
                <button className="btn-primary w-full mt-4">{t(language, 'Buy Now' || 'Buy Now')}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SMS;
