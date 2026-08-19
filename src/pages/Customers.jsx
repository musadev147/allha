import React, { useState } from 'react';
import { Search, MessageSquare, Phone, Printer, Eye, Download } from 'lucide-react';
import useStore from '../store/useStore';

const Customers = () => {
  const { customers, suppliers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Customer'); // Customer or Supplier
  const [smsModal, setSmsModal] = useState({ show: false, target: null, message: '' });
  const [selectedPerson, setSelectedPerson] = useState(null);

  const currentList = activeTab === 'Customer' ? customers : suppliers;

  const filteredList = currentList.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm)
  );

  const handleDownload = (person) => {
    let content = `======================================\n`;
    content += `      DUE STATEMENT\n`;
    content += `======================================\n`;
    content += `ID         : ${person.id}\n`;
    content += `Name       : ${person.name}\n`;
    content += `Phone      : ${person.phone}\n`;
    content += `Type       : ${activeTab}\n`;
    content += `--------------------------------------\n`;
    content += `Total Due  : ৳${person.due}\n`;
    content += `======================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Due_${activeTab}_${person.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

      <div className="card">
        <div className="card-toolbar" style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="segmented-control" style={{ maxWidth: '400px' }}>
            <button 
              className={activeTab === 'Customer' ? 'active' : ''}
              onClick={() => setActiveTab('Customer')}
            >
              Customers Due
            </button>
            <button 
              className={activeTab === 'Supplier' ? 'active' : ''}
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
          <button className="btn-primary flex-align-gap" onClick={() => window.print()} style={{marginLeft: 'auto'}}>
            <Printer size={16} /> Print List
          </button>
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
                      <div className="action-buttons flex-align-gap" style={{flexWrap:'nowrap'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => setSelectedPerson(person)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(person)}>
                          <Download size={16} />
                        </button>
                        <button className="btn-outline" style={{padding:'0.2rem 0.5rem', fontSize:'0.8rem'}}>Settle</button>
                        {activeTab === 'Customer' && (
                          <button 
                            className="btn-primary flex-align-gap" style={{padding:'0.2rem 0.5rem', fontSize:'0.8rem'}}
                            onClick={() => setSmsModal({ show: true, target: person, message: `Dear ${person.name}, your due amount is ৳${person.due}. Please settle your account.` })}
                          >
                            <MessageSquare size={14} /> SMS
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

      {/* Print Single Person Modal */}
      {selectedPerson && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div id="printable-single-person" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000' }}>আল্লাহর দান জন্টস পেয়ন্ট</h2>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                 Due Statement<br/>
                 Date: {new Date().toLocaleDateString()}
               </p>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               
               <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                 <p><strong>Name:</strong> {selectedPerson.name}</p>
                 <p><strong>Phone:</strong> {selectedPerson.phone}</p>
                 <p><strong>Type:</strong> {activeTab}</p>
                 <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                 <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: 'red' }}><strong>Total Due:</strong> ৳{selectedPerson.due.toLocaleString()}</p>
               </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-outline" onClick={() => setSelectedPerson(null)}>Close</button>
              <button className="btn-primary flex-align-gap" onClick={() => {
                 const printContents = document.getElementById('printable-single-person').innerHTML;
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

export default Customers;
