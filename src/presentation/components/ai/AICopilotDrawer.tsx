import React, { useState } from 'react';
import { useAppStore } from '../../application/stores/useAppStore';

export const AICopilotDrawer: React.FC = () => {
  const { aiCopilotOpen, toggleAICopilot } = useAppStore();
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Hello! I am your TalentOS Executive Copilot. How can I assist with your workforce intelligence today?' }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');

  if (!aiCopilotOpen) return null;

  const handleSend = () => {
    if (!inputPrompt.trim()) return;
    const newMsgs = [...messages, { sender: 'User', text: inputPrompt }];
    setMessages(newMsgs);
    setInputPrompt('');

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'AI', 
          text: `Analyzing TalentOS Telemetry for query: "${inputPrompt}". Organization Health is 95.8% EXCELLENT. SOC 2 Readiness is 98.2%.` 
        }
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#111827] border-l border-gray-800 z-50 flex flex-col shadow-2xl transition-all">
      {/* Header */}
      <div className="h-16 border-b border-gray-800 px-4 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-bold text-sm text-gray-100">TalentOS AI Copilot</h3>
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
                : 'bg-gray-800 text-gray-200 border border-gray-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* One-Click Approval Card Placeholder */}
      <div className="p-3 bg-emerald-950/40 border-t border-emerald-800/40 m-3 rounded-lg text-xs">
        <div className="font-semibold text-emerald-400 mb-1">⚡ Action Required: Offer Approval</div>
        <p className="text-gray-300 text-[11px] mb-2">Lead AI Architect offer ($210k base + 15% bonus). Internal equity variance &lt; 2.5%.</p>
        <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-1.5 rounded text-xs transition">
          Approve Offer &amp; Trigger Onboarding
        </button>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-gray-800 bg-gray-900/60">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Executive Copilot..."
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
