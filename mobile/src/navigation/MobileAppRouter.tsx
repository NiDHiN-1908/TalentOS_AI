import React, { useState } from 'react';

export type MobileRoleTab = 'EMPLOYEE' | 'MANAGER' | 'RECRUITER' | 'EXECUTIVE';

export const MobileAppRouter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MobileRoleTab>('EMPLOYEE');

  return (
    <div className="flex flex-col h-screen bg-[#0b0f19] text-gray-100 font-sans">
      {/* Mobile Top Header */}
      <div className="h-14 border-b border-gray-800 bg-[#111827] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-emerald-400">TalentOS Mobile</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
            iOS/Android
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 font-semibold">{activeTab}</span>
        </div>
      </div>

      {/* Screen Content Viewport */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'EMPLOYEE' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-100">📱 Employee Portal</h2>
            <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="text-xs text-gray-400">Attendance Today</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">Checked In (09:02 AM)</div>
            </div>
            <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="text-xs text-gray-400">Leave Balance</div>
              <div className="text-lg font-bold text-gray-100 mt-1">18.5 Days Annual</div>
            </div>
          </div>
        )}

        {activeTab === 'MANAGER' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-100">👔 Manager Approvals</h2>
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
              <div className="text-xs font-semibold text-emerald-400">Pending Leave Request</div>
              <p className="text-xs text-gray-300 mt-1">Elena Rostova - 3 Days Annual Leave</p>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-emerald-500 text-black font-bold py-1 text-xs rounded">Approve</button>
                <button className="flex-1 bg-gray-800 text-gray-300 font-bold py-1 text-xs rounded">Reject</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'EXECUTIVE' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-100">📊 Executive Intelligence</h2>
            <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="text-xs text-gray-400">Organization Health Index</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">95.8%</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Role Tab Bar */}
      <div className="h-16 border-t border-gray-800 bg-[#111827] flex items-center justify-around">
        <button onClick={() => setActiveTab('EMPLOYEE')} className={`text-xs flex flex-col items-center ${activeTab === 'EMPLOYEE' ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
          <span>👤</span>
          <span>Employee</span>
        </button>
        <button onClick={() => setActiveTab('MANAGER')} className={`text-xs flex flex-col items-center ${activeTab === 'MANAGER' ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
          <span>📋</span>
          <span>Manager</span>
        </button>
        <button onClick={() => setActiveTab('RECRUITER')} className={`text-xs flex flex-col items-center ${activeTab === 'RECRUITER' ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
          <span>🎯</span>
          <span>Recruiter</span>
        </button>
        <button onClick={() => setActiveTab('EXECUTIVE')} className={`text-xs flex flex-col items-center ${activeTab === 'EXECUTIVE' ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
          <span>👑</span>
          <span>Executive</span>
        </button>
      </div>
    </div>
  );
};
