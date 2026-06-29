
import React, { useState } from 'react';
import { auditCaseMandate } from '../services/geminiService';
import { ResponsibilityJourney, ForensicAuditOutput, Language } from '../types';
import { COMPLAINT_JOURNEYS } from '../constants';

interface Props {
  language: Language;
}

const ForensicJourneyTrace: React.FC<Props> = ({ language }) => {
  const [selected, setSelected] = useState<ResponsibilityJourney | null>(null);
  const [audit, setAudit] = useState<ForensicAuditOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const t = {
    registry: language === 'ta' ? 'கொள்கை வழக்கு பதிவேடு' : 'Policy Case Registry',
    sub: language === 'ta' ? 'வரலாற்றுப் பாதை ஆவணங்கள்' : 'Historical Trajectory Archives',
    init: language === 'ta' ? 'தணிக்கை நுழைவு தேவை' : 'Audit Entry Required',
    initSub: language === 'ta' ? 'கட்டமைப்பு உரிமைத் தோல்வியைத் தணிக்கை செய்ய வரலாற்று புகார் பாதையைத் தேர்ந்தெடுக்கவும்.' : 'Select a historical complaint path to forensicly audit the structural ownership failure.',
    mapping: language === 'ta' ? 'பாதை வரைபடம்' : 'Trajectory Mapping',
    loading: language === 'ta' ? 'கொள்கை உராய்வைத் தணிக்கை செய்தல்...' : 'Auditing Policy Friction...',
    diag: language === 'ta' ? 'தடயவியல் ஆட்சிமுறை நோய் கண்டறிதல்' : 'Forensic Governance Diagnosis',
    root: language === 'ta' ? 'கட்டமைப்பு மூல காரணம்' : 'Structural Root Cause',
    rec: language === 'ta' ? 'ஆட்சிமுறை பரிந்துரை' : 'Policy Recommendation',
    from: language === 'ta' ? 'இருந்து' : 'From',
    to: language === 'ta' ? 'வரை' : 'To'
  };

  const handleAudit = async (j: ResponsibilityJourney) => {
    setSelected(j);
    setLoading(true);
    setAudit(null);
    try {
      const res = await auditCaseMandate(j, language);
      setAudit(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-[1440px] mx-auto animate-in fade-in duration-1000">
      <div className="lg:col-span-4 space-y-6">
        <div className="px-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">{t.registry}</h3>
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">{t.sub}</p>
        </div>
        
        {COMPLAINT_JOURNEYS.map((j) => (
          <button 
            key={j.ticketId}
            onClick={() => handleAudit(j)}
            className={`w-full text-left p-8 rounded-[2.5rem] border-2 transition-all flex flex-col gap-4 ${selected?.ticketId === j.ticketId ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'}`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase ${selected?.ticketId === j.ticketId ? 'bg-white/10' : 'bg-rose-50 text-rose-600'}`}>{j.status}</span>
              <span className="text-[9px] font-mono opacity-50">{j.ticketId}</span>
            </div>
            <h4 className="font-black text-sm uppercase tracking-tight">{j.category}</h4>
            <div className="text-[8px] font-bold opacity-40 uppercase tracking-widest">{j.ward}</div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-8">
        {!selected ? (
          <div className="bg-white border-2 border-dashed border-slate-200 h-[600px] rounded-[4rem] flex flex-col items-center justify-center text-center p-20 opacity-60">
             <i className="fas fa-file-shield text-5xl text-slate-200 mb-8"></i>
             <h4 className="text-xl font-black text-slate-400 uppercase tracking-tight italic">{t.init}</h4>
             <p className="text-[10px] font-bold text-slate-400 mt-4 max-w-xs uppercase tracking-[0.3em] leading-relaxed">
               {t.initSub}
             </p>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
             <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12 flex items-center gap-3">
                   <i className="fas fa-route text-indigo-500"></i> {t.mapping}
                </h4>
                
                <div className="relative pl-10 space-y-12">
                   <div className="absolute left-3 top-2 bottom-2 w-1 bg-slate-50 rounded-full"></div>
                   {selected.pathway.map((h, i) => (
                     <div key={i} className="relative group">
                        <div className={`absolute -left-[2.25rem] w-6 h-6 rounded-full border-4 border-white shadow-md ${i === selected.pathway.length - 1 ? 'bg-rose-500' : 'bg-slate-900'}`}></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div>
                              <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{h.timestamp}</div>
                              <div className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                 {h.fromEntity} <i className="fas fa-arrow-right mx-4 text-slate-200"></i> {h.toEntity}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 mt-2 italic px-4 py-1.5 bg-slate-50 rounded-full inline-block">“{h.actionTaken}”</div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
                <i className="fas fa-network-wired absolute -bottom-10 -right-10 text-slate-50 text-[15rem] pointer-events-none"></i>
             </div>

             <div className="bg-slate-900 text-white rounded-[4rem] p-14 shadow-2xl relative overflow-hidden border-l-[16px] border-indigo-500">
                <div className="relative z-10">
                   {loading ? (
                     <div className="py-20 flex flex-col items-center justify-center gap-8">
                        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-300">{t.loading}</p>
                     </div>
                   ) : audit ? (
                     <div className="space-y-12">
                        <div className="border-b border-white/10 pb-10">
                           <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">{t.diag}</h4>
                           <div className="text-3xl font-black tracking-tighter italic leading-none text-white/90">“{audit.identifiedMandateConflict}”</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <label className="text-[9px] font-black text-indigo-300 uppercase tracking-widest opacity-60">{t.root}</label>
                              <p className="text-sm font-bold text-slate-300 leading-relaxed italic">{audit.structuralRootCause}</p>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest opacity-60">{t.rec}</label>
                              <div className="bg-emerald-600/20 border border-emerald-400/30 p-8 rounded-[2.5rem]">
                                 <p className="text-sm font-black text-white uppercase tracking-tight leading-relaxed">{audit.policyRecommendation}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : null}
                </div>
                <i className="fas fa-file-invoice absolute -top-10 -right-10 text-white/5 text-[18rem] pointer-events-none"></i>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForensicJourneyTrace;
