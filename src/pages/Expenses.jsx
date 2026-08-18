import React, { useState } from 'react';
import { Plus, DollarSign, PieChart } from 'lucide-react';

const EXPENSE_CATEGORIES = ['Shop Rent', 'Electricity Bill', 'Transport', 'Staff Cost', 'Others'];

const MOCK_EXPENSES = [
  { id: 1, date: '2026-08-18', category: 'Transport', amount: 350, description: 'Van rent for rice delivery' },
  { id: 2, date: '2026-08-18', category: 'Staff Cost', amount: 200, description: 'Lunch for staff' },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: EXPENSE_CATEGORIES[0], amount: '', description: '' });

  const totalDailyExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses([
      ...expenses, 
      { id: Date.now(), date: new Date().toISOString().split('T')[0], ...newExpense, amount: parseFloat(newExpense.amount) }
    ]);
    setShowModal(false);
    setNewExpense({ category: EXPENSE_CATEGORIES[0], amount: '', description: '' });
  };

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

      <div className="grid responsive-grid-2">
        <div className="card glass text-center">
          <DollarSign size={40} className="text-info mx-auto mb-2" />
          <h3 className="text-muted">Today's Expense</h3>
          <p className="text-xl text-primary font-bold">৳{totalDailyExpense}</p>
        </div>
        
        <div className="card glass">
          <div className="card-toolbar">
            <h3>Recent Expenses</h3>
            <button className="btn-outline flex-align-gap"><PieChart size={16} /> Monthly Report</button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.date}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td className="text-danger font-bold">৳{exp.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Expenses;
