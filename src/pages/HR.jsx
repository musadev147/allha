import React, { useState } from 'react';
import { Users, Calendar, DollarSign, Award } from 'lucide-react';

const MOCK_STAFF = [
  { id: 'ST001', name: 'Rahim', role: 'Salesman', present: 15, leave: 1, salary: 12000, bonus: 0 },
  { id: 'ST002', name: 'Karim', role: 'Salesman', present: 16, leave: 0, salary: 12000, bonus: 500 },
];

const HR = () => {
  const [activeTab, setActiveTab] = useState('Attendance');

  return (
    <div className="hr-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>HR & Payroll Management</h1>
          <p className="text-muted">Manage staff attendance, leave, salary, and bonuses.</p>
        </div>
      </div>

      <div className="card glass">
        <div className="card-toolbar" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div className="return-type-selector">
            <button className={`type-btn ${activeTab === 'Attendance' ? 'active' : ''}`} onClick={() => setActiveTab('Attendance')}>
              <Calendar size={18} className="inline-block mr-2" /> Attendance
            </button>
            <button className={`type-btn ${activeTab === 'Payroll' ? 'active' : ''}`} onClick={() => setActiveTab('Payroll')}>
              <DollarSign size={18} className="inline-block mr-2" /> Payroll & Bonus
            </button>
            <button className={`type-btn ${activeTab === 'Leave' ? 'active' : ''}`} onClick={() => setActiveTab('Leave')}>
              <Users size={18} className="inline-block mr-2" /> Leave Requests
            </button>
          </div>
        </div>

        <div className="tab-content mt-4">
          {activeTab === 'Attendance' && (
            <div>
              <h3>Today's Attendance</h3>
              <table className="data-table mt-4">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STAFF.map(staff => (
                    <tr key={staff.id}>
                      <td>{staff.id}</td>
                      <td>{staff.name}</td>
                      <td>{staff.role}</td>
                      <td>
                        <select className="p-2 bg-input border border-gray-700 rounded">
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Leave">On Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Payroll' && (
            <div>
              <h3>Monthly Payroll Summary</h3>
              <table className="data-table mt-4">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Days Present</th>
                    <th>Base Salary</th>
                    <th>Bonus</th>
                    <th>Net Pay</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STAFF.map(staff => {
                    const dailyRate = staff.salary / 30;
                    const netPay = Math.round((dailyRate * staff.present) + staff.bonus);
                    return (
                      <tr key={staff.id}>
                        <td>{staff.id}</td>
                        <td>{staff.name}</td>
                        <td>{staff.present} / 30</td>
                        <td>৳{staff.salary}</td>
                        <td>
                          <div className="flex-align-gap">
                            <Award size={14} className="text-warning"/> 
                            <input type="number" defaultValue={staff.bonus} style={{ width: '80px', padding: '0.25rem' }}/>
                          </div>
                        </td>
                        <td className="text-primary font-bold">৳{netPay}</td>
                        <td><button className="btn-primary">Generate Payslip</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'Leave' && (
            <div className="text-center text-muted py-8">
              No pending leave requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HR;
