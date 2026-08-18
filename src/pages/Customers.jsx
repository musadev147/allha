import React, { useState } from 'react';
import { Search, MessageSquare, Phone } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: 'C001', name: 'Karim Ahmed', phone: '01700000001', due: 1500, type: 'Customer' },
  { id: 'C002', name: 'Jamal Uddin', phone: '01800000002', due: 4200, type: 'Customer' },
  { id: 'S001', name: 'Rahim Traders', phone: '01900000003', due: 12500, type: 'Supplier' },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Customer'); // Customer or Supplier
  const [smsModal, setSmsModal] = useState({ show: false, target: null, message: '' });

  const filteredList = MOCK_CUSTOMERS.filter(
    (person) =>
      person.type === activeTab &&
      (person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.phone.includes(searchTerm))
  );

  const handleSendSMS = (e) => {
    e.preventDefault();
    alert(`SMS sent to ${smsModal.target.name} (${smsModal.target.phone}):\n"${smsModal.message}"`);
    setSmsModal({ show: false, target: null, message: '' });
  };

  return (
    <div className="customers-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Customers & Due Management</h1>
          <p className="text-muted">Manage Baki (Due) for both customers and suppliers. Send SMS reminders.</p>
        </div>
      </div>

      <div className="card glass">
        <div className="card-toolbar">
          <div className="return-type-selector" style={{ maxWidth: '400px' }}>
            <button 
              className={`type-btn ${activeTab === 'Customer' ? 'active' : ''}`}
              onClick={() => setActiveTab('Customer')}
            >
              Customers Due
            </button>
            <button 
              className={`type-btn ${activeTab === 'Supplier' ? 'active' : ''}`}
              onClick={() => setActiveTab('Supplier')}
            >
              Suppliers Due
            </button>
          </div>
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab.toLowerCase()}s...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Total Due (BDT)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">No records found.</td></tr>
              ) : (
                filteredList.map((person) => (
                  <tr key={person.id}>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
                    <td className="flex-align-gap"><Phone size={14} className="text-muted" /> {person.phone}</td>
                    <td><span className="text-danger font-bold">৳{person.due}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-outline">Settle Due</button>
                        {person.type === 'Customer' && (
                          <button 
                            className="btn-primary flex-align-gap" 
                            onClick={() => setSmsModal({ show: true, target: person, message: `Dear ${person.name}, your due amount is ৳${person.due}. Please settle your account.` })}
                          >
                            <MessageSquare size={16} /> SMS
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMS Modal */}
      {smsModal.show && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Send SMS</h2>
            <p className="mb-4 text-muted">To: {smsModal.target?.name} ({smsModal.target?.phone})</p>
            <form onSubmit={handleSendSMS}>
              <textarea
                className="w-full"
                rows="4"
                value={smsModal.message}
                onChange={(e) => setSmsModal({ ...smsModal, message: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setSmsModal({ show: false, target: null, message: '' })}>Cancel</button>
                <button type="submit" className="btn-primary flex-align-gap"><MessageSquare size={16} /> Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
