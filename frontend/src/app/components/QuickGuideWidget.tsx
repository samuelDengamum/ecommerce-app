'use client';

import React, { useState, useEffect } from 'react';

const steps = [
  {
    id: 1,
    title: 'Welcome! Explore',
    description: 'Discover our vast catalog of top-tier items and find exactly what you need with our powerful search.',
    icon: '🛍️'
  },
  {
    id: 2,
    title: 'Add to Your Cart',
    description: 'Easily add items to your cart, review your choices, and manage quantities in a single click.',
    icon: '🛒'
  },
  {
    id: 3,
    title: 'Fast Checkout',
    description: 'Seamlessly place your order safely and securely with our intuitive, lightning-fast checkout.',
    icon: '💳'
  }
];

export default function QuickGuideWidget() {
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const checkNewUser = () => {
      const isNewUser = localStorage.getItem('isNewUser');
      if (isNewUser === 'true') {
        setShow(true);
        setCurrentStep(0);
        localStorage.removeItem('isNewUser');
      }
    };

    checkNewUser();
    window.addEventListener('authchange', checkNewUser);
    
    return () => {
      window.removeEventListener('authchange', checkNewUser);
    };
  }, []);

  if (!show) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setShow(false);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Decorative dynamic glows around the modal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full mix-blend-screen filter blur-3xl pointer-events-none"></div>

      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] relative overflow-hidden animate-[slideInUp_0.5s_ease-out_forwards]">
        
        <style>{`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        
        {/* Progress indicators */}
        <div className="flex gap-2 mb-8 justify-center">
          {steps.map((s, i) => (
            <div 
              key={s.id} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'w-3 bg-slate-800'}`}
            />
          ))}
        </div>

        {/* Content Box */}
        <div className={`transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/50 flex items-center justify-center text-5xl shadow-inner relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full transition-all duration-500 group-hover:scale-110"></div>
                <span className="relative z-10 transition-transform duration-300 hover:scale-110">{step.icon}</span>
            </div>
          </div>
          
          <div className="text-center mb-10 h-32">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
              {step.title}
            </h2>
            <p className="text-slate-300 text-base leading-relaxed px-2">
              {step.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-3">
            <button 
                onClick={() => setShow(false)}
                className="text-slate-400 hover:text-white px-4 py-3 font-medium transition-colors rounded-xl hover:bg-slate-800/50"
                disabled={isAnimating}
            >
                Skip
            </button>
            <button 
            onClick={handleNext}
            disabled={isAnimating}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 flex justify-center items-center gap-2"
            >
            {currentStep === steps.length - 1 ? "Let's Shop!" : "Next"}
            {currentStep < steps.length - 1 && (
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            )}
            </button>
        </div>

      </div>
    </div>
  );
}