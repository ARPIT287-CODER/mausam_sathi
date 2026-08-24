import React, { useState } from 'react';
import { 
  CloudSun, 
  Heart, 
  Footprints, 
  Bot, 
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function WelcomeScreen({ onGetStarted, onSkip }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      badge: "ENVIRONMENTAL INTELLIGENCE",
      title: "Don't Just Know the Weather.\nKnow What to Do.",
      subtitle: "Transform raw temperature and AQI into a personalized 0–100 Health Safety Score tailored to your profile.",
      icon: CloudSun,
      accentEmoji: "🌤️",
      highlights: [
        "❤️ Dynamic Health/Safety Score (0–100)",
        "🌫️ Layman AQI & Pollutant breakdown",
        "☀️ UV Index & Sun exposure precautions"
      ]
    },
    {
      id: 1,
      badge: "SMART FITNESS & MAUSAM PLAN",
      title: "Optimal Workout Windows &\nTrip Planning",
      subtitle: "Let the system analyze 6 meteorological factors to find the ideal running, cycling, and travel hours for your day.",
      icon: Footprints,
      accentEmoji: "🏃",
      highlights: [
        "⏰ Best Running Hours (e.g., 6:45 PM – 7:45 PM)",
        "🗓️ Mausam Plan: Go / No-Go activity verdicts",
        "🎯 Automatic alternative time slot suggestions"
      ]
    },
    {
      id: 2,
      badge: "COMMUNITY LAYER & AI ASSISTANT",
      title: "Real-Time Micro-Climate &\nConversational AI",
      subtitle: "Stay safe with crowd-sourced hazard reports (waterlogging, hailstorms) and chat with your AI Health Assistant via voice.",
      icon: Bot,
      accentEmoji: "🤖",
      highlights: [
        "🗺️ Live crowd hazard reporting with upvote verification",
        "🎙️ Speech-to-Text & voice audio readouts",
        "🚨 NDMA emergency siren & offline 2G mode"
      ]
    }
  ];

  const handleNext = () => {
    soundManager.playChime();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onGetStarted();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden select-none">
      
      {/* Top Header: Logo & Skip */}
      <div className="relative z-10 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 text-teal-400 flex items-center justify-center font-bold shadow-sm">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white">
              MAUSAM SATHI
            </span>
            <span className="text-[9px] block text-slate-400 font-semibold tracking-wider uppercase">
              Environmental Intelligence
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playChime();
            onSkip();
          }}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800/80 transition"
        >
          Skip
        </button>
      </div>

      {/* Center Carousel Slide */}
      <div className="relative z-10 my-auto py-8 max-w-md mx-auto w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-300" key={currentSlide}>
        
        {/* Animated Hero Graphic */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#131B2E] border border-slate-700/80 text-teal-400 flex items-center justify-center shadow-xl">
            <Icon className="w-12 h-12" />
            <span className="absolute -top-2 -right-2 text-2xl">
              {slide.accentEmoji}
            </span>
          </div>
        </div>

        {/* Badge */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700/80 uppercase">
            {slide.badge}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-pre-line leading-tight">
            {slide.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
            {slide.subtitle}
          </p>
        </div>

        {/* Highlight Bullets */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-4 text-left space-y-2 max-w-sm mx-auto shadow-inner">
          {slide.highlights.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Controls: Dots & Get Started Button */}
      <div className="relative z-10 max-w-md mx-auto w-full space-y-5">
        
        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-2">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundManager.playChime();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-6 bg-teal-400' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Next / Get Started CTA */}
        <div className="flex items-center gap-3">
          {currentSlide > 0 && (
            <button
              onClick={() => {
                soundManager.playChime();
                setCurrentSlide(currentSlide - 1);
              }}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition transform active:scale-[0.98]"
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
