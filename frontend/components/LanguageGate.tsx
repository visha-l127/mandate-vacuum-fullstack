import React from 'react';
import { Language } from '../types';

interface Props {
  onSelect: (lang: Language) => void;
}

const LanguageGate: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-[#F4F3EE] flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center space-y-16">

        <div className="space-y-6">
          <h1 className="text-5xl font-black tracking-tighter text-[#9C7A3C] uppercase">
            Mandate Vacuum
          </h1>
          <p className="text-[11px] font-black text-[#6A6A6A] uppercase tracking-[0.5em]">
            Governance Intelligence System
          </p>
          <div className="w-16 h-0.5 bg-[#9C7A3C]/30 mx-auto"></div>
          <p className="text-[10px] font-bold text-[#6A6A6A] uppercase tracking-[0.3em] italic">
            Bureau of Municipal Accountability — Internal Access
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[9px] font-black text-[#6A6A6A] uppercase tracking-[0.4em] mb-8">
            Select Interface Language
          </p>

          <button
            onClick={() => onSelect('en')}
            className="w-full bg-[#1E1E1E] text-white font-black py-6 rounded-[2.5rem] text-sm uppercase tracking-[0.3em] hover:bg-[#9C7A3C] transition-all duration-300 shadow-xl"
          >
            English
          </button>

          <button
            onClick={() => onSelect('ta')}
            className="w-full bg-white border-2 border-[#9C7A3C]/20 text-[#9C7A3C] font-black py-6 rounded-[2.5rem] text-sm uppercase tracking-[0.3em] hover:bg-[#9C7A3C] hover:text-white transition-all duration-300 shadow-sm"
          >
            தமிழ் — Tamil
          </button>
        </div>

        <p className="text-[8px] font-bold text-[#6A6A6A]/40 uppercase tracking-widest">
          Mandate Vacuum v2.0 • Structural Governance Analytics
        </p>

      </div>
    </div>
  );
};

export default LanguageGate;
