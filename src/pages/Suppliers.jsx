import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Printer, Eye, Download, Plus, Phone } from 'lucide-react';
import useStore from '../store/useStore';
import { downloadAsPDF } from '../utils/pdfGenerator';

const Suppliers = () => {
  const { suppliers, addSupplier } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  
  // Add Supplier Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', company: '', phone: '', email: '', location: '', due: '', notes: '' });

  const filteredList = suppliers.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.phone && person.phone.includes(searchTerm))
  );
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name) {
      alert("Name is required");
      return;
    }
    const supplierToSave = { ...newSupplier };
    if (supplierToSave.due) {
      supplierToSave.due = parseFloat(supplierToSave.due) || 0;
    } else {
      supplierToSave.due = 0;
    }
    addSupplier(supplierToSave);
    setNewSupplier({ name: '', company: '', phone: '', email: '', location: '', due: '', notes: '' });
    setShowAddModal(false);
  };

  return (
    <div className="customers-page animate-fade-in" id="printable-suppliers-list">
      <div className="page-header">
        <div>
          <h1>Suppliers Management</h1>
          <p className="text-muted">Manage your suppliers, add new ones, and track dues.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-toolbar" style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search suppliers by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-actions" style={{ marginLeft: 'auto' }}>
            <button className="btn-primary flex-align-gap" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> New Supplier
            </button>
            <button className="btn-outline flex-align-gap" onClick={() => window.print()}>
              <Printer size={16} /> Print List
            </button>
            <button className="btn-outline flex-align-gap text-info" onClick={() => downloadAsPDF('printable-suppliers-list', 'Suppliers_List.pdf')}>
              <Download size={16} /> Download PDF
            </button>
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
                <tr><td colSpan="5" className="text-center text-muted">No suppliers found.</td></tr>
              ) : (
                filteredList.map((person) => (
                  <tr key={person.id}>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
                    <td className="flex-align-gap"><Phone size={14} className="text-muted" /> {person.phone || 'N/A'}</td>
                    <td><span className={person.due > 0 ? "text-danger font-bold" : "text-success font-bold"}>৳{person.due.toLocaleString()}</span></td>
                    <td>
                      <div className="action-buttons flex-align-gap" style={{flexWrap:'nowrap'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => setSelectedPerson(person)}>
                          <Eye size={16} />
                        </button>
</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Drawer */}
      {showAddModal && createPortal(
        <div className="drawer-overlay">
          <div className="drawer-container">
            <div className="drawer-header">
              <h2>Add New Supplier</h2>
              <button type="button" className="drawer-close-btn" onClick={() => setShowAddModal(false)}>
                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div className="drawer-body">
              <form id="add-supplier-form" onSubmit={handleAddSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Supplier Name *</label>
                  <input 
                    type="text" 
                    value={newSupplier.name} 
                    onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} 
                    placeholder="e.g. Rahim Traders" 
                    required 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Company / Brand Name</label>
                  <input 
                    type="text" 
                    value={newSupplier.company} 
                    onChange={e => setNewSupplier({...newSupplier, company: e.target.value})} 
                    placeholder="e.g. Rahim Group of Industries" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                  <input 
                    type="text" 
                    value={newSupplier.phone} 
                    onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} 
                    placeholder="e.g. 01712345678" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={newSupplier.email} 
                    onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} 
                    placeholder="e.g. rahim@example.com" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Location / Address</label>
                  <input 
                    type="text" 
                    value={newSupplier.location} 
                    onChange={e => setNewSupplier({...newSupplier, location: e.target.value})} 
                    placeholder="e.g. Dhaka" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Opening Balance (Due)</label>
                  <input 
                    type="number" 
                    value={newSupplier.due} 
                    onChange={e => setNewSupplier({...newSupplier, due: e.target.value})} 
                    placeholder="e.g. 5000" 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Notes / Remarks</label>
                  <textarea 
                    value={newSupplier.notes} 
                    onChange={e => setNewSupplier({...newSupplier, notes: e.target.value})} 
                    placeholder="Any additional information..." 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    rows={2}
                  />
                </div>
              </form>
            </div>
            <div className="drawer-footer">
              <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" form="add-supplier-form" className="btn-primary">Add Supplier</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Print Single Person Drawer */}
      {selectedPerson && createPortal(
        <div className="drawer-overlay">
          <div className="drawer-container">
            <div className="drawer-header" style={{ backgroundColor: '#f1f5f9' }}>
              <h3 style={{ margin: 0 }}>Supplier Statement</h3>
              <button className="drawer-close-btn" onClick={() => setSelectedPerson(null)}>
                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            
            <div className="drawer-body" style={{ padding: '0', backgroundColor: '#fff' }}>
              <div id="printable-single-person" style={{ padding: '1.5rem', background: '#fff', color: '#000' }}>
                 <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000', fontSize: '1.5rem', fontWeight: 'bold' }}>আল্লাহর দান জেন্টস পয়েন্ট</h2>
                 <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                   Supplier Statement<br/>
                   Date: {new Date().toLocaleDateString()}
                 </p>
                 <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
                 
                 <div style={{ fontSize: '0.9rem', color: '#333', lineHeight: '2' }}>
                   <p><strong>Name:</strong> {selectedPerson.name}</p>
                   <p><strong>Phone:</strong> {selectedPerson.phone || 'N/A'}</p>
                   <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
                   <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginTop: '1rem', color: selectedPerson.due > 0 ? 'red' : 'green' }}><strong>Total Due:</strong> ৳{selectedPerson.due.toLocaleString()}</p>
                 </div>
              </div>
            </div>

            <div className="drawer-footer" style={{ justifyContent: 'center', gap: '1rem' }}>
              <button className="btn-primary flex-align-gap" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '99px' }} onClick={() => {
                 const printContents = document.getElementById('printable-single-person').innerHTML;
                 const originalContents = document.body.innerHTML;
                 document.body.innerHTML = '<div id="print-wrapper">' + printContents + '</div>';
                 window.print();
                 document.body.innerHTML = originalContents;
                 window.location.reload(); 
              }}>
                <Printer size={20} /> Print Document
              </button>
              <button className="btn-outline flex-align-gap text-info" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '99px' }} onClick={() => downloadAsPDF('printable-single-person', `Supplier_${selectedPerson.name}.pdf`)}>
                <Download size={20} /> Download PDF
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Suppliers;
