
import React, { useState } from 'react';
import { runAccountabilityAudit } from '../services/geminiService';
import { ResponsibilityJourney, LeakageDiagnostic } from '../types';
import { COMPLAINT_JOURNEYS } from '../constants';

const ResponsibilityLeakageAnalyzer: React.FC = () => {
  const [selectedJourney, setSelectedJourney] = useState<ResponsibilityJourney | null>(null);
  const [diagnostic, setDiagnostic] = useState<LeakageDiagnostic | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async (journey: ResponsibilityJourney) => {
    setSelectedJourney(journey);
    setLoading(true);
    setDiagnostic(null);
    try {
      const res = await runAccountabilityAudit(journey);
      setDiagnostic(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      {/* Sidebar: Chain Selection */}
      <div className="lg:col-span-4 space-y-6">
        <div className="px-4">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Audit Registry</h3>
           <p className="text-xs font-bold text-slate-600">Trace the administrative journey of stalled complaints</p>
        </div>
        
        <div className="space-y-4">
          {COMPLAINT_JOURNEYS.map((j) => (
            <button 
              key={j.ticketId}
              onClick={() => handleAudit(j)}
              className={`w-full text-left p-8 rounded-[2.5rem] border-2 transition-all flex flex-col gap-4 shadow-sm hover:shadow-md ${selectedJourney?.ticketId === j.ticketId ? 'bg-indigo-900 border-indigo-900 text-white scale-[1.02]' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${selectedJourney?.ticketId === j.ticketId ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'}`}>{j.status}</span>
                <span className="text-[10px] font-mono opacity-50">{j.ticketId}</span>
              </div>
              <div>
                <h4 className="font-black text-lg leading-tight">{j.category}</h4>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold opacity-60 uppercase tracking-widest">
                   {/* Corrected property access: j.metrics.handoffCount */}
                   <i className="fas fa-arrows-spin"></i> {j.metrics.handoffCount} Handoffs
                   <span className="w-1 h-1 bg-current rounded-full"></span>
                   {/* Corrected property access: j.metrics.totalDurationHours */}
                   <i className="fas fa-clock"></i> {j.metrics.totalDurationHours}h Idle
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="lg:col-span-8">
        {!selectedJourney ? (
          <div className="bg-white/50 border-2 border-dashed border-slate-200 h-full min-h-[600px] rounded-[4rem] flex flex-col items-center justify-center text-center p-20">
             <i className="fas fa-fingerprint text-6xl text-slate-200 mb-8"></i>
             <h4 className="text-2xl font-black text-slate-300 uppercase tracking-tight">Initiate Accountability Audit</h4>
             <p className="text-sm font-bold text-slate-400 mt-4 max-w-sm uppercase tracking-widest leading-relaxed">
               Select a journey to forensicly trace handoffs and identify where departmental responsibility was leaked.
             </p>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
             {/* Pathway Visualizer */}
             <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-sm relative overflow-hidden">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                   <i className="fas fa-route text-indigo-500"></i> Responsibility Pathway Trace
                </h4>
                
                <div className="relative pl-10 space-y-14">
                   <div className="absolute left-3 top-2 bottom-2 w-1 bg-slate-50 rounded-full"></div>
                   {selectedJourney.pathway.map((h, i) => (
                     <div key={i} className="relative group">
                        <div className={`absolute -left-[2.25rem] w-6 h-6 rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-125 ${i === selectedJourney.pathway.length - 1 ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600'}`}></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div>
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{h.timestamp}</div>
                              <div className="text-base font-black text-slate-900">
                                 <span className="text-slate-300 mr-2">From:</span> {h.fromEntity} 
                                 <i className="fas fa-arrow-right-long mx-4 text-indigo-300"></i>
                                 <span className="text-slate-300 mr-2">To:</span> {h.toEntity}
                              </div>
                              <div className="text-xs font-bold text-indigo-600 mt-2 italic px-4 py-1.5 bg-indigo-50 rounded-full inline-block">“{h.actionTaken}”</div>
                           </div>
                           {h.idleTimeHours > 0 && (
                             <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-3 rounded-[1.5rem] flex flex-col items-center shadow-sm">
                                <span className="text-xl font-black">{h.idleTimeHours}h</span>
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Delay</span>
                             </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
                <i className="fas fa-network-wired absolute -bottom-10 -right-10 text-slate-50 text-[15rem] pointer-events-none"></i>
             </div>

             {/* Audit Outcome */}
             <div className="bg-slate-900 text-white rounded-[4rem] p-14 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                   {loading ? (
                     <div className="py-20 flex flex-col items-center justify-center gap-8">
                        <div className="w-14 h-14 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-300">Analyzing Ownership Flow...</p>
                     </div>
                   ) : diagnostic ? (
                     <div className="space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/10 pb-10">
                           <div>
                              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">Forensic Diagnostic</h4>
                              {/* Accessing properties from LeakageDiagnostic returned by runAccountabilityAudit */}
                              <div className="text-4xl font-black tracking-tighter italic leading-none">“{diagnostic.observedPattern}”</div>
                           </div>
                           <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 text-center min-w-[180px]">
                              <div className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-2">Ownership Score</div>
                              <div className="text-5xl font-black text-white">{diagnostic.ownershipScore}%</div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest opacity-60">Accountability Breakdown</label>
                              <p className="text-base font-bold text-slate-300 leading-relaxed">{diagnostic.accountabilityBreakdown}</p>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest opacity-60">Operational Recommendation</label>
                              <div className="bg-indigo-600/30 border border-indigo-400/30 p-8 rounded-[2.5rem]">
                                 <p className="text-sm font-black text-white uppercase tracking-tight leading-relaxed">{diagnostic.operationalRecommendation}</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300 pt-6">
                           <i className="fas fa-shield-check"></i> Verified by Madurai SwachhVigil Governance Engine
                        </div>
                     </div>
                   ) : null}
                </div>
                <i className="fas fa-building-columns absolute -top-10 -right-10 text-white/5 text-[18rem] pointer-events-none"></i>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsibilityLeakageAnalyzer;
