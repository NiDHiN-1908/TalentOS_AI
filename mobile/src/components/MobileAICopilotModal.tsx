import React, { useState } from 'react';

export const MobileAICopilotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [voiceActive, setVoiceActive] = useState(false);
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div className="bg-[#111827] border-t border-gray-800 rounded-t-2xl p-4 space-y-4 max-h-[80vh]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="font-bold text-sm text-gray-100">Mobile AI Copilot Voice</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>

        {/* Voice Animation Visualizer */}
        <div className="flex justify-center items-center h-24 bg-gray-900 border border-gray-800 rounded-xl">
          <button 
            onClick={() => setVoiceActive(!voiceActive)}
            className={`w-16 h-16 rounded-full flex items-center justify-center font-bold transition-all ${
              voiceActive ? 'bg-rose-500 animate-pulse text-white shadow-lg shadow-rose-500/30' : 'bg-emerald-500 text-black'
            }`}
          >
            {voiceActive ? '🎙️ Listening...' : '🎤 Tap to Speak'}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          {voiceActive ? 'Listening to voice command: "What is my remaining annual leave balance?"' : 'Speak or type your prompt below'}
        </p>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type mobile AI query..."
            className="flex-1 bg-gray-800 border border-gray-700 text-xs rounded-lg px-3 py-2 text-gray-100"
          />
          <button className="bg-emerald-500 text-black font-bold px-4 py-2 rounded-lg text-xs">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
