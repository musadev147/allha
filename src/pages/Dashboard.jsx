import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, DollarSign, TrendingUp, Truck, RefreshCcw, Users, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Mon', sales: 12000, profit: 4000 },
  { name: 'Tue', sales: 19000, profit: 6000 },
  { name: 'Wed', sales: 15000, profit: 5500 },
  { name: 'Thu', sales: 22000, profit: 7800 },
  { name: 'Fri', sales: 28000, profit: 9000 },
  { name: 'Sat', sales: 35000, profit: 12000 },
  { name: 'Sun', sales: 24500, profit: 8200 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, sales, expenses, inventory, customers, suppliers } = useStore();
  const isAdmin = user?.role === 'Admin';

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate dynamic stats
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalSales - totalExpenses; // Simplified: Revenue - Expense
  const totalInventoryValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);
  const totalCustomerDue = customers.reduce((acc, cust) => acc + cust.due, 0);

  const stats = [
    { label: "Today's Sales", value: `৳${totalSales.toLocaleString()}`, icon: DollarSign, color: "var(--primary)" },
    { label: "Inventory Value", value: `৳${totalInventoryValue.toLocaleString()}`, icon: Package, color: "var(--info)" },
    { label: "Total Due (Customers)", value: `৳${totalCustomerDue.toLocaleString()}`, icon: TrendingUp, color: "var(--warning)" },
    { label: "Net Profit", value: `৳${netProfit.toLocaleString()}`, icon: RefreshCcw, color: "var(--success)" }
  ];

  const allQuickActions = [
    { name: 'Point of Sale', path: '/pos', icon: ShoppingCart, color: 'var(--primary)' },
    { name: 'Inventory', path: '/inventory', icon: Package, color: 'var(--info)' },
    { name: 'Purchases', path: '/purchases', icon: Truck, color: 'var(--warning)' },
    { name: 'Returns', path: '/returns', icon: RefreshCcw, color: 'var(--danger)' },
    { name: 'Customers & Due', path: '/customers', icon: Users, color: 'var(--secondary)' },
    { name: 'Expenses', path: '/expenses', icon: DollarSign, color: 'var(--text-muted)' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p className="text-muted">Welcome to আল্লাহর দান জেন্টস পয়েন্ট System.</p>
        </div>
        
        <div className="card glass animate-fade-in" style={{ 
          padding: '0.8rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center',
          gap: '1rem',
          minWidth: 'fit-content'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            padding: '10px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <Clock size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontSize: '1.8rem', 
              fontWeight: '800', 
              fontFamily: '"Orbitron", monospace, sans-serif',
              lineHeight: '1.2',
              background: 'linear-gradient(to right, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px'
            }}>
              {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-muted" style={{ 
              fontSize: '0.85rem', 
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid responsive-grid" style={{ marginBottom: '2rem' }}>
        <div className="card flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Today's Sales</h3>
             <ShoppingCart className="text-primary" size={20} />
          </div>
          <p className="text-xl font-bold mt-2" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>৳24,500</p>
        </div>
        <div className="card flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Total Inventory</h3>
             <Package className="text-info" size={20} />
          </div>
          <p className="text-xl font-bold mt-2" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>4,210 Items</p>
        </div>
        
        <div className="card flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Total Due</h3>
             <DollarSign className="text-danger" size={20} />
          </div>
          <p className="text-xl font-bold mt-2 text-danger" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>৳5,700</p>
        </div>
        <div className="card flex-align-gap" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="flex-align-gap w-full" style={{ justifyContent: 'space-between', width: '100%' }}>
             <h3 className="text-muted text-sm">Net Profit</h3>
             <TrendingUp className="text-secondary" size={20} />
          </div>
          <p className="text-xl font-bold mt-2 text-secondary" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>৳8,200</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Quick Actions</h2>
      <div className="grid responsive-grid-3" style={{ marginBottom: '2rem' }}>
        {allQuickActions.map((action, index) => (
          <div 
            key={index} 
            className="card flex-align-gap quick-action-card" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '1.5rem'
            }}
            onClick={() => navigate(action.path)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className="flex-align-gap">
              <div style={{ 
                padding: '0.75rem', 
                borderRadius: '0.75rem', 
                backgroundColor: 'var(--bg-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: action.color
              }}>
                <action.icon size={24} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: '500', marginLeft: '0.75rem' }}>{action.name}</span>
            </div>
            <ArrowRight size={20} className="text-muted" style={{ opacity: 0.5 }} />
          </div>
        ))}
      </div>
      
      <div className="grid responsive-grid-2" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="flex-align-gap" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Sales Analytics</h3>
              <p className="text-muted text-sm mt-1">Revenue and Profit over the last 7 days</p>
            </div>
            <div className="segmented-control">
              <button className="active">Weekly</button>
              <button>Monthly</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-lg)' }}
                  itemStyle={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="profit" stroke="var(--success)" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid responsive-grid-2">
        <div className="card">
          <h3>Recent Activity</h3>
          <p className="text-muted mt-2">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
