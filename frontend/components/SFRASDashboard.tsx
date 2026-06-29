
import React from 'react';
import { Language } from '../types';

interface LanguageGateProps {
  onSelect: (lang: Language) => void;
}

const LanguageGate: React.FC<LanguageGateProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-50 p-6 animate-in fade-in duration-1000">
      <div className="relative bg-white border border-slate-200 p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center space-y-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-indigo-900/20">
            <i className="fas fa-fingerprint text-white text-3xl"></i>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Mandate Vacuum</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Governance Accountability Portal</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xl font-bold text-slate-700 uppercase tracking-tight">Choose your preferred language to continue</p>
          <p className="text-lg font-bold text-indigo-600">தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => onSelect('en')}
            className="group relative overflow-hidden bg-slate-900 text-white p-8 rounded-3xl transition-all duration-500 shadow-xl active:scale-95"
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="text-2xl font-black uppercase tracking-widest">English</span>
            </div>
          </button>

          <button 
            onClick={() => onSelect('ta')}
            className="group relative overflow-hidden bg-white border-2 border-slate-900 text-slate-900 p-8 rounded-3xl transition-all duration-500 shadow-xl active:scale-95"
          >
            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="text-2xl font-black">தமிழ்</span>
            </div>
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
          Official Digital Infrastructure of Madurai Municipal Corporation
        </p>
      </div>
    </div>
  );
};

export default LanguageGate;
