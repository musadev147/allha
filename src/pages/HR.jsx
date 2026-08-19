import React, { useState } from 'react';
import { Users, Calendar, DollarSign, Award, Plus, Check, X } from 'lucide-react';
import useStore from '../store/useStore';

const HR = () => {
  const [activeTab, setActiveTab] = useState('Staff');
  const { staff, attendance, leaves, payrolls, addStaff, markAttendance, addLeaveRequest, updateLeaveStatus, generatePayslip } = useStore();

  // Modals state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Salesman', baseSalary: '' });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ staffId: '', type: 'Casual', reason: '' });

  // Bonus state for payroll
  const [bonuses, setBonuses] = useState({});

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const [attDate, setAttDate] = useState(todayStr);
  const [payrollMonth, setPayrollMonth] = useState(todayStr.substring(0, 7)); // YYYY-MM

  // Handlers
  const handleAddStaff = (e) => {
    e.preventDefault();
    addStaff({
      ...newStaff,
      baseSalary: parseFloat(newStaff.baseSalary),
      joinDate: todayStr
    });
    setShowAddStaffModal(false);
    setNewStaff({ name: '', role: 'Salesman', baseSalary: '' });
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!newLeave.staffId) return alert('Please select a staff');
    addLeaveRequest({
      date: todayStr,
      ...newLeave
    });
    setShowLeaveModal(false);
    setNewLeave({ staffId: '', type: 'Casual', reason: '' });
  };

  const handleGeneratePayslip = (staffMember, presentDays, bonus) => {
    const dailyRate = staffMember.baseSalary / 30;
    const netPay = Math.round((dailyRate * presentDays) + bonus);
    
    // Check if already paid
    const alreadyPaid = payrolls.some(p => p.staffId === staffMember.id && p.month === payrollMonth);
    if (alreadyPaid) return alert('Payslip already generated for this month!');

    generatePayslip({
      month: payrollMonth,
      year: payrollMonth.split('-')[0],
      staffId: staffMember.id,
      staffName: staffMember.name,
      presentDays,
      baseSalary: staffMember.baseSalary,
      bonus,
      netPay
    });
    alert(`Payslip generated for ${staffMember.name}. Amount: ৳${netPay}`);
  };

  return (
    <div className="hr-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>HR & Payroll Management</h1>
          <p className="text-muted">Manage staff, attendance, leave, salary, and bonuses.</p>
        </div>
        {activeTab === 'Staff' && (
          <button className="btn-primary flex-align-gap" onClick={() => setShowAddStaffModal(true)}>
            <Plus size={18} /> Add Staff
          </button>
        )}
        {activeTab === 'Leave' && (
          <button className="btn-primary flex-align-gap" onClick={() => setShowLeaveModal(true)}>
            <Plus size={18} /> Apply Leave
          </button>
        )}
      </div>

      <div className="card glass">
        <div className="card-toolbar" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', overflowX: 'auto' }}>
          <div className="return-type-selector">
            <button className={`type-btn ${activeTab === 'Staff' ? 'active' : ''}`} onClick={() => setActiveTab('Staff')}>
              <Users size={18} className="inline-block mr-2" /> Staff List
            </button>
            <button className={`type-btn ${activeTab === 'Attendance' ? 'active' : ''}`} onClick={() => setActiveTab('Attendance')}>
              <Calendar size={18} className="inline-block mr-2" /> Attendance
            </button>
            <button className={`type-btn ${activeTab === 'Leave' ? 'active' : ''}`} onClick={() => setActiveTab('Leave')}>
              <Users size={18} className="inline-block mr-2" /> Leave Requests
            </button>
            <button className={`type-btn ${activeTab === 'Payroll' ? 'active' : ''}`} onClick={() => setActiveTab('Payroll')}>
              <DollarSign size={18} className="inline-block mr-2" /> Payroll & Bonus
            </button>
          </div>
        </div>

        <div className="tab-content mt-4">
          {activeTab === 'Staff' && (
            <div>
              <h3>All Staff</h3>
              {staff.length === 0 ? <p className="text-muted mt-4">No staff added yet.</p> : (
                <div className="table-responsive">
                  <table className="data-table mt-4">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Base Salary (BDT)</th>
                        <th>Join Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map(s => (
                        <tr key={s.id}>
                          <td>{s.id}</td>
                          <td>{s.name}</td>
                          <td>{s.role}</td>
                          <td>৳{s.baseSalary}</td>
                          <td>{s.joinDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Attendance' && (
            <div>
              <div className="flex-align-gap mb-4" style={{ justifyContent: 'space-between' }}>
                <h3>Daily Attendance</h3>
                <input 
                  type="date" 
                  className="p-2 bg-input border border-gray-700 rounded text-main"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                />
              </div>
              {staff.length === 0 ? <p className="text-muted">No staff found. Please add staff first.</p> : (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map(s => {
                        const existingAtt = attendance.find(a => a.staffId === s.id && a.date === attDate);
                        const status = existingAtt ? existingAtt.status : '';
                        return (
                          <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.role}</td>
                            <td>
                              <select 
                                className="p-2 bg-input border border-gray-700 rounded"
                                value={status}
                                onChange={(e) => markAttendance(s.id, attDate, e.target.value)}
                              >
                                <option value="" disabled>Mark Status</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                                <option value="Leave">On Leave</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Leave' && (
            <div>
              <h3>Leave Requests</h3>
              {leaves.length === 0 ? <div className="text-center text-muted py-8">No leave requests.</div> : (
                <div className="table-responsive">
                  <table className="data-table mt-4">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Staff Name</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map(l => {
                        const staffMember = staff.find(s => s.id === l.staffId);
                        return (
                          <tr key={l.id}>
                            <td>{l.date}</td>
                            <td>{staffMember ? staffMember.name : 'Unknown'}</td>
                            <td>{l.type}</td>
                            <td>{l.reason}</td>
                            <td>
                              <span className={`badge ${l.status === 'Approved' ? 'bg-success text-white px-2 py-1 rounded' : l.status === 'Rejected' ? 'bg-danger text-white px-2 py-1 rounded' : 'bg-warning text-black px-2 py-1 rounded'}`}>
                                {l.status}
                              </span>
                            </td>
                            <td>
                              {l.status === 'Pending' && (
                                <div className="flex-align-gap">
                                  <button className="btn-outline text-success" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateLeaveStatus(l.id, 'Approved')}><Check size={16}/></button>
                                  <button className="btn-outline text-danger" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateLeaveStatus(l.id, 'Rejected')}><X size={16}/></button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Payroll' && (
            <div>
              <div className="flex-align-gap mb-4" style={{ justifyContent: 'space-between' }}>
                <h3>Monthly Payroll Summary</h3>
                <input 
                  type="month" 
                  className="p-2 bg-input border border-gray-700 rounded text-main"
                  value={payrollMonth}
                  onChange={(e) => setPayrollMonth(e.target.value)}
                />
              </div>
              {staff.length === 0 ? <p className="text-muted">No staff to generate payroll.</p> : (
                <div className="table-responsive">
                  <table className="data-table mt-4">
                    <thead>
                      <tr>
                        <th>Staff Name</th>
                        <th>Days Present</th>
                        <th>Base Salary</th>
                        <th>Bonus</th>
                        <th>Net Pay</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map(s => {
                        const presentDays = attendance.filter(a => a.staffId === s.id && a.status === 'Present' && a.date.startsWith(payrollMonth)).length;
                        const dailyRate = s.baseSalary / 30;
                        const bonus = bonuses[s.id] || 0;
                        const netPay = Math.round((dailyRate * presentDays) + bonus);
                        
                        const isPaid = payrolls.some(p => p.staffId === s.id && p.month === payrollMonth);

                        return (
                          <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{presentDays} / 30</td>
                            <td>৳{s.baseSalary}</td>
                            <td>
                              {isPaid ? (
                                <span>৳{payrolls.find(p => p.staffId === s.id && p.month === payrollMonth).bonus}</span>
                              ) : (
                                <div className="flex-align-gap">
                                  <Award size={14} className="text-warning"/> 
                                  <input 
                                    type="number" 
                                    value={bonus} 
                                    onChange={(e) => setBonuses({...bonuses, [s.id]: parseFloat(e.target.value) || 0})}
                                    style={{ width: '80px', padding: '0.25rem', backgroundColor: 'var(--bg-input)' }}
                                  />
                                </div>
                              )}
                            </td>
                            <td className="text-primary font-bold">
                              ৳{isPaid ? payrolls.find(p => p.staffId === s.id && p.month === payrollMonth).netPay : netPay}
                            </td>
                            <td>
                              {isPaid ? <span className="text-success font-bold">Paid</span> : <span className="text-warning">Pending</span>}
                            </td>
                            <td>
                              {!isPaid && (
                                <button className="btn-primary" onClick={() => handleGeneratePayslip(s, presentDays, bonus)}>Pay</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Add New Staff</h2>
            <form onSubmit={handleAddStaff}>
              <div className="form-group mb-4 mt-4">
                <label>Name</label>
                <input required type="text" className="w-full" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
              </div>
              <div className="form-group mb-4">
                <label>Role</label>
                <select className="w-full" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                  <option value="Salesman">Salesman</option>
                  <option value="Manager">Manager</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label>Base Salary (BDT)</label>
                <input required type="number" min="0" className="w-full" value={newStaff.baseSalary} onChange={e => setNewStaff({...newStaff, baseSalary: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAddStaffModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>Apply Leave</h2>
            <form onSubmit={handleApplyLeave}>
              <div className="form-group mb-4 mt-4">
                <label>Staff</label>
                <select className="w-full" required value={newLeave.staffId} onChange={e => setNewLeave({...newLeave, staffId: e.target.value})}>
                  <option value="" disabled>Select Staff</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group mb-4">
                <label>Leave Type</label>
                <select className="w-full" value={newLeave.type} onChange={e => setNewLeave({...newLeave, type: e.target.value})}>
                  <option value="Casual">Casual</option>
                  <option value="Sick">Sick</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label>Reason</label>
                <input required type="text" className="w-full" value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowLeaveModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;
