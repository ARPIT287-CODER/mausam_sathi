import React, { useState, useEffect, useRef } from 'react';
import { useWeather, PROFILES } from '../../context/WeatherContext';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Settings, 
  ShieldAlert, 
  Trash2,
  RefreshCw,
  User,
  Heart,
  Key,
  ExternalLink,
  Check
} from 'lucide-react';
import { generateClientAiReply, speakAssistantText, stopSpeaking, createSpeechRecognizer } from '../../utils/aiReasoning';
import { soundManager } from '../../utils/soundEffects';

export default function AiHealthAssistant() {
  const { 
    weatherData, 
    safetyScoreData, 
    fitnessData, 
    profile, 
    selectedLocation,
    geminiApiKey,
    setGeminiApiKey 
  } = useWeather();

  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('mausam_ai_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: `👋 Namaste! I am **Mausam Sathi AI**, your personalized environmental health and safety companion.\n\nI continuously analyze real-time **Air Quality (AQI)**, **UV radiation**, **thermal comfort**, and **weather forecasts** for **${selectedLocation.name}** to give you actionable, safety-focused guidance.\n\nHow can I assist you with your day or outdoor plans?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Mausam AI'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(geminiApiKey);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const activeProfileData = PROFILES[profile] || PROFILES.general;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    sessionStorage.setItem('mausam_ai_chat_history', JSON.stringify(messages));
  }, [messages, isThinking]);

  // Check pending prompt from dashboard
  useEffect(() => {
    const pending = sessionStorage.getItem('mausam_pending_prompt');
    if (pending) {
      sessionStorage.removeItem('mausam_pending_prompt');
      handleSend(pending);
    }
  }, []);

  const toggleListening = () => {
    soundManager.playChime();
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsListening(false);
    } else {
      const recognizer = createSpeechRecognizer(
        (transcript) => {
          setInput(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        (err) => {
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );

      if (recognizer) {
        recognitionRef.current = recognizer;
        try {
          recognizer.start();
          setIsListening(true);
        } catch (e) {
          setIsListening(false);
        }
      } else {
        alert("Speech Recognition is not supported by your browser. Please type your question.");
      }
    }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakAssistantText(text, () => setIsSpeaking(false));
    }
  };

  const handleSend = async (userPrompt = input) => {
    const promptText = (userPrompt || "").trim();
    if (!promptText) return;

    soundManager.playChime();

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    const contextPayload = {
      locationName: selectedLocation.name,
      temp: weatherData?.current?.temp || 28,
      feelsLike: weatherData?.current?.feelsLike || 30,
      condition: weatherData?.current?.condition || "Partly Cloudy",
      aqi: weatherData?.aqi?.value || 128,
      aqiCategory: weatherData?.aqi?.category || "Moderate",
      uvIndex: weatherData?.current?.uvIndex || 5,
      humidity: weatherData?.current?.humidity || 62,
      pollenLevel: weatherData?.pollen?.level || "Low",
      safetyScore: safetyScoreData.score,
      safetyLevel: safetyScoreData.level,
      userProfile: profile,
      bestRunningTime: fitnessData.bestWindow
    };

    try {
      let replyText = "";
      let sourceUsed = "Mausam Context Engine";

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: promptText,
          conversationHistory: messages,
          context: contextPayload,
          apiKey: geminiApiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
        sourceUsed = data.source === 'gemini-llm' ? 'Google Gemini AI' : 'Mausam Context Engine';
      } else {
        throw new Error("Backend response error");
      }

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        source: sourceUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      soundManager.playSuccess();
    } catch (err) {
      console.warn("Using client-side contextual AI fallback:", err);
      const fallbackReply = generateClientAiReply({
        question: promptText,
        context: contextPayload
      });

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackReply,
        source: "Mausam Client Engine",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      soundManager.playSuccess();
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    soundManager.playChime();
    sessionStorage.removeItem('mausam_ai_chat_history');
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: `👋 Chat cleared! Ask me anything about weather, health risks, food, clothes, or outdoor timing in **${selectedLocation.name}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Mausam AI'
      }
    ]);
  };

  const handleSaveApiKey = () => {
    soundManager.playSuccess();
    setGeminiApiKey(tempApiKey.trim());
    setApiKeySaved(true);
    setTimeout(() => {
      setApiKeySaved(false);
      setSettingsOpen(false);
    }, 1200);
  };

  const samplePromptChips = [
    "Can I go running right now?",
    "What should I wear today?",
    "Why is my safety score low?",
    "What precautions should I take?",
    "Is it safe for kids to play outside?",
    "What fluids or food should I take?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto pb-16 sm:pb-4 animate-in fade-in">
      
      {/* Header & Context Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md shrink-0 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-500 text-white shadow-md">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  AI HEALTH ASSISTANT
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {geminiApiKey ? '✨ Gemini Powered' : '⚡ Context Engine Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live multi-sensor environmental reasoning & health guidance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2 rounded-xl border transition ${
                geminiApiKey 
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Assistant Settings (Optional Gemini API Key)"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Context Quick Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-2 text-[11px] text-slate-300">
          <span className="bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60 font-medium">
            📍 {selectedLocation.name}
          </span>
          <span className="bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60 font-medium">
            🌡️ {weatherData?.current?.temp || 28}°C ({weatherData?.current?.condition})
          </span>
          <span className="bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60 font-medium">
            🌫️ AQI {weatherData?.aqi?.value || 128} ({weatherData?.aqi?.category})
          </span>
          <span className="bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60 font-medium">
            ❤️ Score: {safetyScoreData.score}/100
          </span>
        </div>
      </div>

      {/* Optional Gemini API Key Settings Popover */}
      {settingsOpen && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 shadow-2xl mb-3 animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-bold flex items-center gap-1.5 text-teal-300">
              <Key className="w-4 h-4" />
              Optional Google Gemini API Key (100% Free)
            </span>
            <button onClick={() => setSettingsOpen(false)} className="text-xs text-slate-400 hover:text-white">✕</button>
          </div>
          
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Mausam Sathi works <strong>automatically with its built-in NLP engine</strong>. To enable full open-ended conversational AI powered by Google Gemini, grab a free API key from Google AI Studio:
          </p>

          <div className="flex items-center space-x-2 mb-3">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-400 hover:underline bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/30"
            >
              <span>Get Free Gemini Key on Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Paste Gemini API Key (AIzaSy...)"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md flex items-center space-x-1 shrink-0"
            >
              {apiKeySaved ? <Check className="w-4 h-4" /> : null}
              <span>{apiKeySaved ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 p-4 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                isAi
                  ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 shadow-sm'
                  : 'bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 text-white font-medium shadow-sm'
              }`}>
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[10px] text-slate-400">
                  <span>{msg.timestamp} • {msg.source || 'Mausam AI'}</span>
                  {isAi && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 hover:underline font-semibold"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center space-x-2 text-xs text-sky-400 p-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
            <span>Analyzing environmental context and computing advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0">
        {samplePromptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-medium transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="shrink-0 bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-md">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
            title={isListening ? "Listening... Click to stop" : "Speak via Voice Input"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about weather, clothes, food, exercise, asthma or trips..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs disabled:opacity-50 transition shadow-md flex items-center space-x-1"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-500 mt-1.5 font-normal">
          🛡️ AI-powered environmental health assistant. Provides general safety guidance, not medical diagnosis.
        </p>
      </div>

    </div>
  );
}
