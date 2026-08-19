import React, { useState } from 'react';
import Barcode from 'react-barcode';
import { Plus, Search, Printer, Edit, Trash2 } from 'lucide-react';
import './Inventory.css';

const MOCK_INVENTORY = [
  { id: '10001', name: 'Premium Rice 50kg', category: 'Grocery', stock: 150, unit: 'Bag', price: 3500 },
  { id: '10002', name: 'Refined Oil 5L', category: 'Grocery', stock: 45, unit: 'Bottle', price: 850 },
  { id: '10003', name: 'Dal 1kg', category: 'Grocery', stock: 200, unit: 'Packet', price: 120 },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    id: '', name: '', category: 'Grocery', unit: 'Bag', stock: 0, price: 0
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.id || !newProduct.name) {
      alert('ID and Name are required!');
      return;
    }
    setInventory([newProduct, ...inventory]);
    setShowAddModal(false);
    setNewProduct({ id: '', name: '', category: 'Grocery', unit: 'Bag', stock: 0, price: 0 });
  };

  const handlePrintBarcode = (product) => {
    setSelectedProduct(product);
    setShowBarcodeModal(true);
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.id.includes(searchTerm)
  );

  return (
    <div className="inventory-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted">Manage your stock, categories, and generate barcodes.</p>
        </div>
        <div className="flex-align-gap">
          <button className="btn-outline flex-align-gap" onClick={() => window.print()}>
            <Printer size={18} /> Print List
          </button>
          <button className="btn-primary flex-align-gap" style={{ width: 'fit-content', whiteSpace: 'nowrap' }} onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="search-bar">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <button className="btn-outline">Categories</button>
            <button className="btn-outline">Units</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID/Barcode</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Stock</th>
                <th>Price (BDT)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.unit}</td>
                  <td>
                    <span className={`stock-badge ${item.stock < 50 ? 'warning' : 'success'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td>৳{item.price}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Print Barcode" onClick={() => handlePrintBarcode(item)}>
                        <Printer size={16} />
                      </button>
                      <button className="btn-icon text-info" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon text-danger" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Generate Barcode</h2>
            <div className="barcode-container">
              <Barcode value={selectedProduct.id} width={2} height={60} />
              <p>{selectedProduct.name}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowBarcodeModal(false)}>Close</button>
              <button className="btn-primary flex-align-gap" onClick={() => window.print()}>
                <Printer size={18} /> Print Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct} style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="text-muted text-sm block mb-1">Product ID / Barcode</label>
                  <input type="text" className="w-full" value={newProduct.id} onChange={e => setNewProduct({...newProduct, id: e.target.value})} required placeholder="e.g. 10004" />
                </div>
                <div>
                  <label className="text-muted text-sm block mb-1">Product Name</label>
                  <input type="text" className="w-full" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required placeholder="e.g. Sugar 1kg" />
                </div>
                <div>
                  <label className="text-muted text-sm block mb-1">Category</label>
                  <select className="w-full" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    <option value="Grocery">Grocery</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted text-sm block mb-1">Unit</label>
                  <select className="w-full" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})}>
                    <option value="Bag">Bag</option>
                    <option value="Bottle">Bottle</option>
                    <option value="Packet">Packet</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted text-sm block mb-1">Initial Stock</label>
                  <input type="number" className="w-full" min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="text-muted text-sm block mb-1">Price (BDT)</label>
                  <input type="number" className="w-full" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary flex-align-gap"><Plus size={18} /> Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
