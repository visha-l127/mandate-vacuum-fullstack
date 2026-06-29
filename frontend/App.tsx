import React, { useState } from 'react';
import { analyzeCitizenComplaint } from './services/citizenAnalysisAPI';

import ForensicJourneyTrace from './components/ForensicJourneyTrace';
import MandateVacuumIdentifier from './components/MandateVacuumIdentifier';
import AccountabilityAuditTerminal from './components/AccountabilityAuditTerminal';
import CounterfactualSimulator from './components/CounterfactualSimulator';
import GovernanceInsights from './components/GovernanceInsights';
import CitizenComplaintForm from './components/CitizenComplaintForm';
import LanguageGate from './components/LanguageGate';

import { Language } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'audit' | 'vacuum' | 'decay' | 'simulator' | 'insights' | 'citizen'
  >('vacuum');

  const [language, setLanguage] = useState<Language | null>(null);


  if (!language) {
    return <LanguageGate onSelect={setLanguage} />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-[#9C7A3C]/20 selection:text-[#5A4628]">
      
      {/* Top Banner */}
      <div className="bg-[#1E1E1E] text-[#9C7A3C] text-center py-4 px-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] border-b border-white/5 sticky top-0 z-[60] shadow-xl">
        {language === 'ta'
          ? 'உள் பயன்பாட்டிற்கு மட்டும்: கட்டமைப்பு ஆணை தர்க்கம் மற்றும் பொறுப்புக்கூறல் அரை ஆயுள் அளவீடுகள்'
          : 'INTERNAL USE ONLY: Structural Mandate Logic & Accountability Half-Life Metrics'}
      </div>

      {/* Header */}
      <header className="bg-white/90 border-b border-[#9C7A3C]/10 py-8 px-16 flex flex-col lg:flex-row justify-between items-center sticky top-[44px] md:top-[48px] z-50 backdrop-blur-3xl gap-8">
        
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter leading-none uppercase text-[#9C7A3C]">
              Mandate <span className="opacity-80">Vacuum</span>
            </h1>

            <span className="text-[10px] text-[#6A6A6A] font-black uppercase tracking-[0.4em] mt-2 block italic">
              {language === 'ta'
                ? 'முடிவு-ஆதரவு நுண்ணறிவு'
                : 'Decision-Support Intelligence'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-2 bg-[#F4F3EE] p-1.5 rounded-full border border-[#9C7A3C]/10">

          {/* Vacuums */}
          <button
            onClick={() => setActiveTab('vacuum')}
            className={`px-6 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === 'vacuum'
                ? 'bg-[#9C7A3C] text-white shadow-lg'
                : 'text-[#6A6A6A] hover:text-[#9C7A3C]'
            }`}
          >
            {language === 'ta' ? 'வெற்றிடங்கள்' : 'Vacuums'}
          </button>

          {/* Decay */}
          <button
            onClick={() => setActiveTab('decay')}
            className={`px-6 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === 'decay'
                ? 'bg-[#9C7A3C] text-white shadow-lg'
                : 'text-[#6A6A6A] hover:text-[#9C7A3C]'
            }`}
          >
            {language === 'ta' ? 'சிதைவு' : 'Decay'}
          </button>

          {/* Simulator */}
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-6 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === 'simulator'
                ? 'bg-[#9C7A3C] text-white shadow-lg'
                : 'text-[#6A6A6A] hover:text-[#9C7A3C]'
            }`}
          >
            {language === 'ta' ? 'தூண்டுதல்' : 'Simulator'}
          </button>

          {/* Insights */}
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-6 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === 'insights'
                ? 'bg-[#7B2D2D] text-white shadow-lg'
                : 'text-[#6A6A6A] hover:text-[#7B2D2D]'
            }`}
          >
            {language === 'ta'
              ? 'ஆட்சிமுறை நுண்ணறிவு'
              : 'Governance Insights'}
          </button>

          {/* Citizen Portal */}
          <button
            onClick={() => setActiveTab('citizen')}
            className={`px-6 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              activeTab === 'citizen'
                ? 'bg-[#9C7A3C] text-white shadow-lg'
                : 'text-[#6A6A6A] hover:text-[#9C7A3C]'
            }`}
          >
            {language === 'ta'
              ? 'குடிமக வாயில்'
              : 'Citizen Portal'}
          </button>
        </nav>

        {/* Secure Badge */}
        <div className="hidden lg:flex bg-[#1E1E1E] px-8 py-3.5 rounded-full items-center gap-5 text-white shadow-xl border border-[#9C7A3C]/20">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9C7A3C] animate-pulse"></div>

          <div className="flex flex-col">
            <span className="text-[8px] font-black text-[#6A6A6A] uppercase tracking-widest leading-none mb-1">
              Terminal Secure
            </span>

            <span className="text-[9px] font-black text-[#9C7A3C] uppercase tracking-widest">
              Level 07 Access
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-8 md:px-16 pb-32 max-w-[1400px] mx-auto">
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">

          {activeTab === 'vacuum' && (
            <MandateVacuumIdentifier language={language} />
          )}

          {activeTab === 'decay' && (
            <AccountabilityAuditTerminal language={language} />
          )}

          {activeTab === 'simulator' && (
            <CounterfactualSimulator language={language} />
          )}

          {activeTab === 'insights' && (
            <GovernanceInsights language={language} />
          )}

          {activeTab === 'audit' && (
            <ForensicJourneyTrace language={language} />
          )}

          {activeTab === 'citizen' && (
            <CitizenComplaintForm language={language} />
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-[#9C7A3C]/10 bg-white/50">
        <div className="max-w-[1200px] mx-auto text-center px-10 space-y-8">

          <p className="text-[11px] font-bold text-[#6A6A6A] uppercase tracking-[0.5em] max-w-2xl mx-auto leading-relaxed italic opacity-60">
            {language === 'ta'
              ? 'Mandate Vacuum: கட்டமைப்பு கொள்கை உராய்வு மற்றும் பொறுப்புக்கூறல் சிதைவை வரைபடமாக்குவதற்கான நிர்வாக பகுப்பாய்வு கருவி.'
              : 'Mandate Vacuum: An administrative analysis tool for mapping structural policy friction and accountability decay.'}
          </p>

          <div className="text-[9px] font-black text-[#9C7A3C] uppercase tracking-[0.4em]">
            Bureau of Municipal Accountability • 2025
          </div>

        </div>
      </footer>
    </div>
  );
};

export default App;