import React, { useState } from 'react';
import { BarChart, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('Sales');
  const [dateRange, setDateRange] = useState('Daily'); // Daily, Weekly, Monthly

  return (
    <div className="reports-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted">View Sales, Stock, and Profit/Loss data.</p>
        </div>
      </div>

      <div className="card glass mb-4">
        <div className="card-toolbar">
          <div className="return-type-selector">
            <button className={`type-btn ${reportType === 'Sales' ? 'active' : ''}`} onClick={() => setReportType('Sales')}>
              <BarChart size={18} className="inline-block mr-2" /> Sales Report
            </button>
            <button className={`type-btn ${reportType === 'Stock' ? 'active' : ''}`} onClick={() => setReportType('Stock')}>
              <PieChart size={18} className="inline-block mr-2" /> Stock Report
            </button>
            <button className={`type-btn ${reportType === 'ProfitLoss' ? 'active' : ''}`} onClick={() => setReportType('ProfitLoss')}>
              <TrendingUp size={18} className="inline-block mr-2" /> Profit & Loss
            </button>
          </div>

          <div className="date-filter flex-align-gap">
            <label className="text-muted text-sm">Filter:</label>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="p-2 bg-input border border-gray-700 rounded">
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid responsive-grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card glass text-center">
          <h3 className="text-muted mb-2">Total Revenue</h3>
          <p className="text-xl text-primary font-bold">৳45,000</p>
          <span className="text-sm text-secondary flex-align-gap center-content mt-2"><TrendingUp size={14}/> +12% from yesterday</span>
        </div>
        <div className="card glass text-center">
          <h3 className="text-muted mb-2">Total Cost (Purchases + Expense)</h3>
          <p className="text-xl text-danger font-bold">৳32,000</p>
        </div>
        <div className="card glass text-center">
          <h3 className="text-muted mb-2">Net Profit</h3>
          <p className="text-xl text-secondary font-bold">৳13,000</p>
        </div>
      </div>

      <div className="card glass">
        <h3>{dateRange} {reportType} Data</h3>
        <div className="placeholder-chart flex-align-gap center-content" style={{ height: '300px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginTop: '1.5rem', flexDirection: 'column' }}>
           <BarChart size={48} className="text-muted mb-4" />
           <p className="text-muted">Chart visualization will be rendered here based on {reportType} and {dateRange} filters.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
