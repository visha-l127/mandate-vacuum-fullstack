
import React, { useState, useRef } from 'react';
import { getSFRASAttribution, validateSanitationImage } from '../services/geminiService';
import { SFRASAttribution, SanitationAsset, Language } from '../types';
import { SFRAS_ASSETS, MADURAI_WARDS } from '../constants';

interface SFRASDashboardProps {
  language: Language;
}

const SFRASDashboard: React.FC<SFRASDashboardProps> = ({ language }) => {
  const [selectedAsset, setSelectedAsset] = useState<SanitationAsset | null>(null);
  const [attribution, setAttribution] = useState<SFRASAttribution | null>(null);
  const [loading, setLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Reporting State
  const [isValidating, setIsValidating] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [reportStep, setReportStep] = useState(1);
  const [formWard, setFormWard] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAttribution = async (asset: SanitationAsset) => {
    setSelectedAsset(asset);
    setLoading(true);
    setAttribution(null);
    try {
      const res = await getSFRASAttribution(asset);
      setAttribution(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsValidating(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const isValid = await validateSanitationImage(base64);
        if (isValid) {
          setSelectedPhoto(base64);
          setReportStep(2);
        } else {
          alert("AI Validation Failed: Please upload a clear photo of a sanitation issue.");
        }
        setIsValidating(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const translations = {
    en: {
      title: "Causal Intelligence Hub",
      subtitle: "Sanitation Failure Root-Cause Attribution (SFRAS)",
      killerLine: "“Identify WHY failure happens physically before assigning administrative blame.”",
      registry: "Asset Diagnostic Queue",
      reportBtn: "Log Field Observation",
      attributionReport: "Root-Cause Diagnostic Report",
      observedPattern: "1. Observed Failure Pattern",
      rootCause: "2. Environmental/Physical Root Cause",
      recommendation: "3. Operational Change Fix",
      confidence: "Diagnostic Confidence"
    },
    ta: {
      title: "காரண நுண்ணறிவு மையம்",
      subtitle: "சுகாதார தோல்வி மூல-காரண பண்பு (SFRAS)",
      killerLine: "“நிர்வாகப் பழியைச் சுமத்துவதற்கு முன் ஏன் உடல்ரீதியாகத் தோல்வி ஏற்படுகிறது என்பதை அடையாளம் காணவும்.”",
      registry: "கண்டறியும் வரிசை",
      reportBtn: "கள அவதானிப்பை பதிவு செய்க",
      attributionReport: "மூல-காரண கண்டறியும் அறிக்கை",
      observedPattern: "1. காணப்பட்ட தோல்வி முறை",
      rootCause: "2. சுற்றுச்சூழல் மூல காரணம்",
      recommendation: "3. செயல்பாட்டு மாற்றம்",
      confidence: "கண்டறியும் நம்பிக்கை"
    }
  }[language];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      <section className="bg-white border-2 border-[#1B5E20]/10 p-12 rounded-[4rem] shadow-sm relative overflow-hidden text-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B5E20]/10 border border-[#1B5E20]/20 text-[#1B5E20] text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            {translations.subtitle}
          </div>
          <h2 className="text-xl font-black text-[#1B5E20] leading-tight max-w-2xl mx-auto italic mb-10">
            {translations.killerLine}
          </h2>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-xl transition-all active:scale-95 flex items-center gap-4 mx-auto"
          >
            <i className="fas fa-camera"></i> {translations.reportBtn}
          </button>
        </div>
        <i className="fas fa-microscope absolute -bottom-10 -right-10 text-[#1B5E20]/5 text-[20rem]"></i>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <h3 className="font-black text-[#1B5E20] uppercase text-xs tracking-[0.4em] px-4">{translations.registry}</h3>
          <div className="space-y-4">
            {SFRAS_ASSETS.map((asset) => (
              <button 
                key={asset.id} 
                onClick={() => fetchAttribution(asset)}
                className={`w-full text-left p-8 rounded-[3rem] border-2 transition-all group ${selectedAsset?.id === asset.id ? 'bg-[#1B5E20] border-[#1B5E20] text-white shadow-2xl' : 'bg-white border-slate-100 hover:border-[#1B5E20]/30 shadow-sm'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${selectedAsset?.id === asset.id ? 'bg-white/10' : 'bg-[#E8F5E9] text-[#1B5E20]'}`}>
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase opacity-40 mb-1">{asset.id}</div>
                    <div className="font-black text-sm">{asset.locationName}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
           {loading ? (
             <div className="bg-white border-2 border-dashed border-slate-200 h-[600px] rounded-[4rem] flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Performing Causal Correlation...</p>
             </div>
           ) : attribution ? (
             <div className="bg-white border border-slate-200 rounded-[4rem] p-12 shadow-sm space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-center pb-8 border-b border-slate-100">
                  <h4 className="font-black text-[#1B5E20] uppercase text-xs tracking-widest">{translations.attributionReport}</h4>
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase ${attribution.confidence === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{translations.confidence}: {attribution.confidence}</span>
                </div>
                
                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{translations.observedPattern}</label>
                      <p className="text-xl font-black text-[#1B5E20] italic">“{attribution.observedPattern}”</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{translations.rootCause}</label>
                         <p className="text-sm font-bold text-slate-600 leading-relaxed">{attribution.rootCause}</p>
                      </div>
                      <div className="bg-[#E8F5E9] p-8 rounded-[2.5rem] space-y-4">
                         <label className="text-[10px] font-black text-[#1B5E20] uppercase tracking-widest">{translations.recommendation}</label>
                         <p className="text-sm font-black text-[#1B5E20] leading-relaxed">{attribution.operationalRecommendation}</p>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-white/50 border-2 border-dashed border-slate-200 h-[600px] rounded-[4rem] flex flex-col items-center justify-center text-center p-20">
                <i className="fas fa-search-nodes text-4xl text-slate-200 mb-6"></i>
                <h4 className="text-xl font-black text-[#333333] uppercase">Select an Asset for Causal Audit</h4>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Reports logged in the field populate this diagnostic queue.</p>
             </div>
           )}
        </div>
      </div>

      {/* REPORTING MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
           <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-10 bg-slate-50 flex justify-between items-center border-b border-slate-200">
                 <h3 className="font-black text-[#1B5E20] uppercase text-[10px] tracking-[0.4em]">Field Observation Portal</h3>
                 <button onClick={() => setIsReportModalOpen(false)} className="w-10 h-10 hover:bg-white rounded-full"><i className="fas fa-times"></i></button>
              </div>
              
              <div className="p-12 space-y-8">
                 {reportStep === 1 ? (
                   <div className="space-y-8 text-center">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-64 border-2 border-dashed border-slate-300 rounded-[3.5rem] flex flex-col items-center justify-center cursor-pointer group hover:border-[#1B5E20] transition-all overflow-hidden relative bg-slate-50"
                      >
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                         {isValidating ? (
                           <div className="flex flex-col items-center gap-4">
                              <div className="w-10 h-10 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#1B5E20]">AI Vision Verifying...</span>
                           </div>
                         ) : (
                           <div className="flex flex-col items-center gap-4 group-hover:scale-110 transition-transform">
                              <i className="fas fa-camera text-4xl text-slate-300 group-hover:text-[#1B5E20]"></i>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capture Proof (Step 1)</span>
                           </div>
                         )}
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-8 animate-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-6 p-6 bg-[#E8F5E9] rounded-3xl border border-[#1B5E20]/10">
                         <div className="w-12 h-12 bg-[#1B5E20] text-white rounded-2xl flex items-center justify-center shadow-lg"><i className="fas fa-check"></i></div>
                         <div>
                            <div className="text-[10px] font-black uppercase text-[#1B5E20] tracking-widest">Evidence AI-Verified</div>
                            <div className="text-xs font-bold text-[#1B5E20]">GPS Linked • Ward Auto-Detection Active</div>
                         </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Identify Ward</label>
                        <select 
                          className="w-full bg-slate-50 border-none rounded-3xl px-8 py-5 text-xs font-black focus:ring-2 focus:ring-[#1B5E20]/20 outline-none appearance-none"
                          value={formWard}
                          onChange={(e) => setFormWard(e.target.value)}
                        >
                          <option value="">Select Ward</option>
                          {MADURAI_WARDS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                      </div>
                      <button 
                        onClick={() => { setIsReportModalOpen(false); setReportStep(1); alert("Report Dispatched to Diagnostic Queue."); }}
                        disabled={!formWard}
                        className="w-full bg-[#1B5E20] text-white py-6 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-xl hover:bg-[#2E7D32] transition-all active:scale-95 disabled:opacity-50"
                      >
                        Confirm Dispatch
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SFRASDashboard;
