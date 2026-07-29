import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, XCircle, Plus, UserCheck } from 'lucide-react';
import { EnterpriseModulesService } from '../../application/services/EnterpriseModulesService';
import { AttendanceRecord, LeaveRequest } from '../../domain/types/enterpriseModules';

export const AttendanceLeaveView: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(EnterpriseModulesService.getAttendance());
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(EnterpriseModulesService.getLeaveRequests());
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');

  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('PTO');
  const [leaveDays, setLeaveDays] = useState(3);
  const [leaveReason, setLeaveReason] = useState('Personal time off');

  const handleClockIn = () => {
    EnterpriseModulesService.clockIn('EMP-101', 'Sarah Chen');
    setAttendance([...EnterpriseModulesService.getAttendance()]);
  };

  const handleRequestLeave = (e: React.FormEvent) => {
    e.preventDefault();
    EnterpriseModulesService.submitLeaveRequest({
      employeeId: 'EMP-101',
      employeeName: 'Sarah Chen',
      leaveType,
      startDate: '2026-08-15',
      endDate: '2026-08-18',
      daysCount: leaveDays,
      reason: leaveReason
    });
    setLeaveRequests([...EnterpriseModulesService.getLeaveRequests()]);
    setLeaveReason('');
  };

  const handleApproveLeave = (id: string) => {
    EnterpriseModulesService.approveLeave(id);
    setLeaveRequests([...EnterpriseModulesService.getLeaveRequests()]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Clock size={22} color="#6366f1" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Attendance & Leave Workstation</h2>
            <span className="badge badge-purple">Time Tracking & PTO Workflow</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Clock in/out, daily attendance logging, overtime tracking, and leave request approval workflows.
          </p>
        </div>

        <button onClick={handleClockIn} className="btn-primary">
          <Clock size={16} /> Instant Clock In (Sarah Chen)
        </button>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          Attendance Records ({attendance.length})
        </button>
        <button 
          onClick={() => setActiveTab('leave')}
          className={activeTab === 'leave' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          Leave Requests ({leaveRequests.length})
        </button>
      </div>

      {activeTab === 'attendance' && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Daily Attendance Log</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Employee</th>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>Clock In</th>
                <th style={{ padding: '10px' }}>Clock Out</th>
                <th style={{ padding: '10px' }}>Overtime</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((att) => (
                <tr key={att.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600, color: '#fff' }}>{att.employeeName}</td>
                  <td style={{ padding: '12px 10px', color: '#94a3b8' }}>{att.workDate}</td>
                  <td style={{ padding: '12px 10px', color: '#34d399' }}>{att.clockIn}</td>
                  <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{att.clockOut || 'Active Shift'}</td>
                  <td style={{ padding: '12px 10px', color: '#6366f1', fontWeight: 600 }}>{att.overtimeHours} hrs</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge badge-emerald">{att.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'leave' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          
          {/* Leave Requests Table */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Submitted Leave Requests</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {leaveRequests.map((l) => (
                <div key={l.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{l.employeeName} — {l.leaveType} ({l.daysCount} Days)</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0' }}>Dates: {l.startDate} to {l.endDate} • "{l.reason}"</div>
                  </div>

                  {l.status === 'Pending' ? (
                    <button onClick={() => handleApproveLeave(l.id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      <CheckCircle2 size={14} /> Approve Leave
                    </button>
                  ) : (
                    <span className="badge badge-emerald">{l.status}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leave Submission Form */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Request PTO / Sick Leave</h3>
            <form onSubmit={handleRequestLeave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Leave Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value as any)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }}>
                  <option value="PTO">PTO (Vacation)</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Parental Leave">Parental Leave</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Number of Days</label>
                <input type="number" value={leaveDays} onChange={(e) => setLeaveDays(Number(e.target.value))} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Reason</label>
                <input type="text" value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} placeholder="Reason for leave..." style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px', color: '#fff' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px' }}>Submit Request</button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
