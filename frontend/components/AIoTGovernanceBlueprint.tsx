
import React, { useState, useEffect } from 'react';
import { getAIoTGovernanceBlueprint } from '../services/geminiService';
import { AIoTInsight } from '../types';

const STRATEGIC_SCENARIOS = [
  "Subterranean Mandate Audit (Drain Sensors)",
  "Zonal Boundary Verification (Mesh Nodes)",
  "Commercial Compliance Sentinel (Vision AI)",
  "Biomedical Disposal Accountability (RFID Trace)"
];

const AIoTGovernanceBlueprint: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(STRATEGIC_SCENARIOS[0]);
  const [insight, setInsight] = useState<AIoTInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlueprint(selectedScenario);
  }, [selectedScenario]);

  const fetchBlueprint = async (scenario: string) => {
    setLoading(true);
    try {
      const res = await getAIoTGovernanceBlueprint(scenario);
      setInsight(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1440px] mx-auto animate-in fade-in duration-1000">
      {/* Scenario Selector */}
      <div className="lg:col-span-4 space-y-6">
        <div className="px-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Policy Schematics</h3>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider italic">Infrastructure vs Mandate Mapping</p>
        </div>
        
        {STRATEGIC_SCENARIOS.map((s) => (
          <button 
            key={s}
            onClick={() => setSelectedScenario(s)}
            className={`w-full text-left p-8 rounded-[2.5rem] border-2 transition-all ${selectedScenario === s ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'}`}
          >
            <h4 className="font-black text-sm uppercase tracking-tight">{s}</h4>
            <div className="text-[8px] font-bold opacity-40 uppercase tracking-widest mt-4">Administrative Blueprint v1.2</div>
          </button>
        ))}
      </div>

      {/* Blueprint Detail */}
      <div className="lg:col-span-8">
        {!insight || loading ? (
          <div className="bg-slate-900 text-white rounded-[4rem] h-[600px] flex flex-col items-center justify-center p-12 text-center">
             <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Synthesizing Accountability Architecture...</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
             
             {/* 1. ARCHITECTURE SCHEMA */}
             <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm">
                <div className="flex items-center gap-4 mb-12 border-b border-slate-100 pb-6">
                   <i className="fas fa-microchip text-indigo-600 text-xl"></i>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Governance Hardware-Software Schematic</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                      <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-4">1. Perception (IoT)</div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase">{insight.architecture.perception}</p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                      <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-4">2. Transmission</div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase">{insight.architecture.transmission}</p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                      <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-4">3. Intelligence (AI Audit)</div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase">{insight.architecture.intelligence}</p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-indigo-600 text-white">
                      <div className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-4">4. Accountability Action</div>
                      <p className="text-xs font-black leading-relaxed uppercase">{insight.architecture.action}</p>
                   </div>
                </div>
             </div>

             {/* 2. MANAGEMENT PROTOCOL */}
             <div className="bg-slate-900 text-white rounded-[3rem] p-12 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                         <i className="fas fa-tasks text-indigo-400"></i>
                         <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em]">Administrative Management Points</h4>
                      </div>
                      <ul className="space-y-4">
                         {insight.management.map((item, i) => (
                           <li key={i} className="flex gap-4 items-start">
                              <span className="text-indigo-400 font-black text-xs">0{i+1}</span>
                              <span className="text-[10px] font-black uppercase tracking-tight leading-relaxed">{item}</span>
                           </li>
                         ))}
                      </ul>
                   </div>

                   <div className="space-y-8">
                      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                         <i className="fas fa-triangle-exclamation text-rose-400"></i>
                         <h4 className="text-[9px] font-black text-rose-400 uppercase tracking-[0.4em]">Structural Failure Risks</h4>
                      </div>
                      <ul className="space-y-4">
                         {insight.risks.map((item, i) => (
                           <li key={i} className="flex gap-4 items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1"></div>
                              <span className="text-[10px] font-black uppercase tracking-tight leading-relaxed opacity-60 italic">“{item}”</span>
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
                   <span className="text-[8px] font-black uppercase tracking-[0.3em]">AIoT Policy Blueprint • Commissioner Access Only</span>
                   <span className="text-[8px] font-black uppercase tracking-[0.3em]">Module: Mandate_Truth_V1</span>
                </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AIoTGovernanceBlueprint;
