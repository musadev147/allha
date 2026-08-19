import React, { useState } from 'react';
import { Plus, X, PieChart, DollarSign, Printer, Eye, Download } from 'lucide-react';

import useStore from '../store/useStore';

const EXPENSE_CATEGORIES = ['Shop Rent', 'Electricity Bill', 'Transport', 'Staff Cost', 'Others'];

const Expenses = () => {
  const { expenses, addExpense } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: EXPENSE_CATEGORIES[0], amount: '', description: '' });
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [showReport, setShowReport] = useState(false);
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().substring(0, 7));

  const handleDownload = (exp) => {
    let content = `======================================\n`;
    content += `      EXPENSE VOUCHER\n`;
    content += `======================================\n`;
    content += `ID         : ${exp.id}\n`;
    content += `Date       : ${exp.date}\n`;
    content += `Category   : ${exp.category}\n`;
    content += `Description: ${exp.description}\n`;
    content += `--------------------------------------\n`;
    content += `Amount     : ৳${exp.amount}\n`;
    content += `======================================\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Expense_${exp.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const totalDailyExpense = expenses.filter(e => e.date === todayStr).reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    addExpense({
      date: todayStr,
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    });
    setShowModal(false);
    setNewExpense({ category: EXPENSE_CATEGORIES[0], amount: '', description: '' });
  };

  // Monthly Report Calculations
  const monthlyExpenses = expenses.filter(e => e.date && e.date.startsWith(reportMonth));
  const totalMonthlyExpense = monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    category: cat,
    amount: monthlyExpenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
  })).filter(c => c.amount > 0);

  // Add dynamically added categories like 'Staff Cost' if they exist in data but not in EXPENSE_CATEGORIES constant
  const otherCategories = [...new Set(monthlyExpenses.map(e => e.category))].filter(cat => !EXPENSE_CATEGORIES.includes(cat));
  otherCategories.forEach(cat => {
    categoryTotals.push({
      category: cat,
      amount: monthlyExpenses.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
    });
  });

  return (
    <div className="expenses-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Expense Management</h1>
          <p className="text-muted">Track daily and monthly shop expenses.</p>
        </div>
        <button className="btn-primary flex-align-gap" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      <div className="grid responsive-grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Today's Expense</h3>
             <DollarSign className="text-danger" size={20} />
          </div>
          <p className="text-xl font-bold mt-2 text-danger" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>৳{totalDailyExpense.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="grid">
        <div className="card">
          <div className="card-toolbar" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3>Recent Expenses</h3>
            <div className="flex-align-gap">
              <button className="btn-outline flex-align-gap" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setShowReport(true)}>
                <PieChart size={16} /> Monthly Report
              </button>
              <button className="btn-primary flex-align-gap" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => window.print()}>
                <Printer size={16} /> Print List
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount (BDT)</th>
                  <th style={{textAlign:'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 50).map(exp => ( // show only recent 50
                  <tr key={exp.id}>
                    <td>{exp.date}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td className="text-danger font-bold">৳{exp.amount.toLocaleString()}</td>
                    <td style={{textAlign:'center'}}>
                      <div className="flex-align-gap" style={{justifyContent:'center'}}>
                        <button className="btn-icon" title="View & Print" onClick={() => setSelectedExpense(exp)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn-icon text-info" title="Download" onClick={() => handleDownload(exp)}>
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr><td colSpan="5" className="text-center text-muted">No expenses recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Add New Expense</h2>
            <form onSubmit={handleAddExpense}>
              <div className="form-group mb-4 mt-4">
                <label>Category</label>
                <select 
                  className="w-full"
                  value={newExpense.category} 
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group mb-4">
                <label>Amount (BDT)</label>
                <input 
                  type="number" 
                  className="w-full"
                  required 
                  min="1"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>
              <div className="form-group mb-4">
                <label>Description</label>
                <input 
                  type="text" 
                  className="w-full"
                  required
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monthly Report Modal */}
      {showReport && (
        <div className="modal-overlay">
          <div className="modal-content glass" style={{ maxWidth: '600px' }}>
            <div className="flex-align-gap" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>Monthly Expense Report</h2>
              <button className="btn-outline text-danger" style={{ padding: '0.2rem 0.5rem' }} onClick={() => setShowReport(false)}><X size={20}/></button>
            </div>
            
            <div className="form-group mb-4">
              <label>Select Month</label>
              <input 
                type="month" 
                className="w-full p-2 bg-input border border-gray-700 rounded text-main"
                value={reportMonth}
                onChange={e => setReportMonth(e.target.value)}
              />
            </div>

            <div id="printable-monthly-expense">
              <div className="card bg-input" style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-muted text-sm text-center">Total Monthly Expense ({reportMonth})</h3>
                <p className="text-2xl font-bold mt-2 text-danger text-center">৳{totalMonthlyExpense.toLocaleString()}</p>
              </div>

              <h4>Breakdown by Category</h4>
              <div className="table-responsive mt-4">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th className="text-right">Total Amount (BDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryTotals.length === 0 ? (
                      <tr><td colSpan="2" className="text-center text-muted">No expenses found for this month.</td></tr>
                    ) : (
                      categoryTotals.map((cat, idx) => (
                        <tr key={idx}>
                          <td>{cat.category}</td>
                          <td className="text-right font-bold text-danger">৳{cat.amount.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-primary flex-align-gap w-full center-content" onClick={() => {
                 const printContents = document.getElementById('printable-monthly-expense').innerHTML;
                 const originalContents = document.body.innerHTML;
                 document.body.innerHTML = `<div style="padding:2rem;color:#000;"><h2>Expense Report: ${reportMonth}</h2>${printContents}</div>`;
                 window.print();
                 document.body.innerHTML = originalContents;
                 window.location.reload(); 
              }}>
                <Printer size={18} /> Print Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Expense Modal */}
      {selectedExpense && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content glass" style={{ maxWidth: '400px' }}>
            <div id="printable-single-expense" style={{ padding: '1.5rem', background: '#fff', color: '#000', borderRadius: '8px' }}>
               <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#000' }}>আল্লাহর দান জন্টস পেয়ন্ট</h2>
               <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', color: '#555' }}>
                 Expense Voucher<br/>
                 ID: {selectedExpense.id}<br/>
                 Date: {selectedExpense.date}
               </p>
               <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
               
               <div style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.8' }}>
                 <p><strong>Category:</strong> {selectedExpense.category}</p>
                 <p><strong>Description:</strong> {selectedExpense.description}</p>
                 <hr style={{ margin: '0.5rem 0', borderColor: '#eee' }} />
                 <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem', color: 'red' }}><strong>Amount:</strong> ৳{selectedExpense.amount.toLocaleString()}</p>
               </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn-outline" onClick={() => setSelectedExpense(null)}>Close</button>
              <button className="btn-primary flex-align-gap" onClick={() => {
                 const printContents = document.getElementById('printable-single-expense').innerHTML;
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

export default Expenses;
