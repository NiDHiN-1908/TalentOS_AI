import React, { useState } from 'react';
import { useAppStore } from '../../application/stores/useAppStore';
import { authStore } from '../../infrastructure/store/authStore';

export const AICopilotDrawer: React.FC = () => {
  const { aiCopilotOpen, toggleAICopilot } = useAppStore();
  const persona = authStore.getCurrentPersona();
  const [messages, setMessages] = useState([
    { sender: 'AI', text: `Hello ${persona.name}! I am your TalentOS AI Copilot. Operating under ${persona.role} scope permissions.` }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');

  if (!aiCopilotOpen) return null;

  const handleSend = () => {
    if (!inputPrompt.trim()) return;
    const promptText = inputPrompt;
    const newMsgs = [...messages, { sender: 'User', text: promptText }];
    setMessages(newMsgs);
    setInputPrompt('');

    // AI Permission-Aware Scope Evaluator
    setTimeout(() => {
      let aiText = '';
      const lower = promptText.toLowerCase();

      if ((lower.includes('salary') || lower.includes('compensation') || lower.includes('ceo')) && persona.role === 'EMPLOYEE') {
        aiText = '⛔ Access Denied: You do not have authorization to query executive compensation or peer salary metrics.';
      } else if (lower.includes('payroll') && !['PAYROLL_MANAGER', 'HR_MANAGER', 'PLATFORM_ADMIN'].includes(persona.role)) {
        aiText = '⛔ Access Denied: Global payroll audits require PAYROLL_MANAGER or HR_MANAGER permissions.';
      } else {
        aiText = `Analyzing TalentOS Telemetry for query: "${promptText}". Authorized Scope: ${persona.role}. Organization Health is 95.8% EXCELLENT.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'AI', text: aiText }
      ]);
    }, 500);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#111827] border-l border-gray-800 z-50 flex flex-col shadow-2xl transition-all">
      {/* Header */}
      <div className="h-16 border-b border-gray-800 px-4 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h3 className="font-bold text-sm text-gray-100">TalentOS AI Copilot</h3>
            <div className="text-[10px] text-emerald-400 font-semibold">{persona.name} ({persona.role})</div>
          </div>
        </div>
        <button 
          onClick={toggleAICopilot} 
          className="text-gray-400 hover:text-white text-lg p-1"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${m.sender === 'User' ? 'items-end' : 'items-start'}`}
          >
            <div className={`text-[10px] text-gray-500 mb-1`}>{m.sender}</div>
            <div className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
              m.sender === 'User' 
                ? 'bg-emerald-500 text-black font-medium' 
                : m.text.includes('Access Denied')
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                  : 'bg-gray-800 text-gray-200 border border-gray-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-gray-800 bg-gray-900/60">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask Copilot (${persona.role} Scope)...`}
            className="flex-1 bg-gray-800 border border-gray-700 text-xs rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-emerald-500"
          />
          <button 
            onClick={handleSend}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3 py-2 rounded-lg text-xs"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
