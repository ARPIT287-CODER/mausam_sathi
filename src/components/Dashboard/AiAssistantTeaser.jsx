import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Bot, Sparkles, Send, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function AiAssistantTeaser() {
  const { setActiveTab } = useWeather();
  const [quickInput, setQuickInput] = useState('');

  const samplePrompts = [
    "Can I go running right now?",
    "Why is my health score low today?",
    "What precautions should I take?",
    "Is it safe for kids to play outside?"
  ];

  const handleLaunchChat = (promptText) => {
    soundManager.playChime();
    sessionStorage.setItem('mausam_pending_prompt', promptText || quickInput);
    setActiveTab('ai');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-sky-900 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-indigo-700/40">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-sky-500/20 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-1.5">
                <span>AI HEALTH ASSISTANT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                  AI ASSISTANT
                </span>
              </h2>
              <p className="text-xs text-sky-200/80">
                “Ask me about today's weather, health risks, or outdoor plans.”
              </p>
            </div>
          </div>

          <button
            onClick={() => handleLaunchChat()}
            className="hidden sm:flex items-center space-x-1 text-xs font-semibold text-cyan-300 hover:text-white transition"
          >
            <span>Open Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleLaunchChat(prompt)}
              className="text-xs text-left px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sky-100 font-medium transition backdrop-blur-sm"
            >
              “{prompt}”
            </button>
          ))}
        </div>

        {/* Quick input bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); if (quickInput.trim()) handleLaunchChat(quickInput); }}
          className="mt-4 flex items-center gap-2"
        >
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Ask AI a question (e.g. Can I run at 6 PM?)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-sky-200/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold text-xs hover:opacity-90 shadow-md flex items-center space-x-1 shrink-0"
          >
            <span>Ask AI</span>
            <Send className="w-3 h-3" />
          </button>
        </form>

      </div>
    </div>
  );
}
