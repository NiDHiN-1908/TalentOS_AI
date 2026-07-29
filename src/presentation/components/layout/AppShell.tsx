import React from 'react';
import { useAppStore } from '../../application/stores/useAppStore';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { 
    sidebarOpen, 
    toggleSidebar, 
    themeMode, 
    toggleTheme, 
    userRole, 
    aiCopilotOpen, 
    toggleAICopilot,
    activeView,
    setActiveView 
  } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: '📊' },
    { id: 'recruitment', label: 'Recruitment & ATS', icon: '🎯' },
    { id: 'employee', label: 'Core Employee SSOT', icon: '👥' },
    { id: 'payroll', label: 'Global Payroll', icon: '💳' },
    { id: 'grc', label: 'Governance & Risk', icon: '🛡️' },
    { id: 'helpdesk', label: 'Employee Helpdesk', icon: '🎧' },
    { id: 'analytics', label: 'Workforce Analytics', icon: '📈' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      themeMode === 'dark' ? 'bg-[#0b0f19] text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Topbar */}
      <header className="h-16 border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              TalentOS AI
            </span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              Enterprise v1.0
            </span>
          </div>
        </div>

        {/* Global Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search candidates, policies, tickets (Ctrl+K)..." 
              className="w-80 bg-gray-900 border border-gray-750 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute left-3 top-2 text-gray-500 text-xs">🔍</span>
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"
            title="Toggle Light/Dark Theme"
          >
            {themeMode === 'dark' ? '🌙' : '☀️'}
          </button>

          <button 
            onClick={toggleAICopilot}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
              aiCopilotOpen 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <span>🤖 AI Copilot</span>
          </button>

          <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-black text-xs">
              {userRole.substring(0, 2)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold">Sarah Chen</div>
              <div className="text-[10px] text-gray-400">{userRole}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Collapsible Sidebar */}
      <div className="flex flex-1 relative">
        {/* Collapsible Sidebar */}
        <aside className={`border-r border-gray-800 bg-[#111827] transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        } flex flex-col justify-between`}>
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeView === item.id 
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border-l-4 border-emerald-500' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* View Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
