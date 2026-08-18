import React from 'react';
import { ShoppingCart, Package, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-muted">Welcome to আল্লাহর দান জন্টস পেয়ন্ট System.</p>
        </div>
      </div>

      <div className="grid responsive-grid" style={{ marginBottom: '2rem' }}>
        <div className="card glass flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Today's Sales</h3>
             <ShoppingCart className="text-primary" size={20} />
          </div>
          <p className="text-xl font-bold mt-2">৳24,500</p>
        </div>
        <div className="card glass flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Total Inventory</h3>
             <Package className="text-info" size={20} />
          </div>
          <p className="text-xl font-bold mt-2">4,210 Items</p>
        </div>
        <div className="card glass flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Total Due</h3>
             <DollarSign className="text-danger" size={20} />
          </div>
          <p className="text-xl font-bold mt-2 text-danger">৳5,700</p>
        </div>
        <div className="card glass flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Net Profit</h3>
             <TrendingUp className="text-secondary" size={20} />
          </div>
          <p className="text-xl font-bold mt-2 text-secondary">৳8,200</p>
        </div>
      </div>
      
      <div className="card glass">
        <h3>Recent Activity</h3>
        <p className="text-muted mt-2">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default Dashboard;
