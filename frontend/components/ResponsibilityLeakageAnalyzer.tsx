
import React, { useState } from 'react';
import { getSIH_SFRAS_Analysis } from '../services/geminiService';
import { SFRAS_A_Analysis, SanitationAsset } from '../types';
import { SFRAS_ASSETS } from '../constants';

const SIHAttribution: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<SanitationAsset | null>(null);
  const [analysis, setAnalysis] = useState<SFRAS_A_Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async (asset: SanitationAsset) => {
    setSelectedAsset(asset);
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await getSIH_SFRAS_Analysis(asset);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      {/* SIH Header - Professional Governance Style */}
      <section className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-4 border-emerald-500">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-[0.4em] mb-6">
            <i className="fas fa-shield-halved"></i> Governance Intelligence MVP (SIH-A)
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter leading-none">SFRAS-A Engine</h2>
          <p className="text-sm font-bold opacity-70 leading-relaxed italic uppercase tracking-widest">
            “Cities already know what is dirty. This system explains why sanitation fails, who owns the failure, and what operational change will actually stop it.”
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Asset Registry */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.4em] px-4 flex items-center gap-3">
            <i className="fas fa-database text-slate-300"></i> Asset Diagnostic Registry
          </h3>
          <div className="space-y-4">
            {SFRAS_ASSETS.map((asset) => (
              <button 
                key={asset.id} 
                onClick={() => fetchAnalysis(asset)}
                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${selectedAsset?.id === asset.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-slate-300'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${selectedAsset?.id === asset.id ? 'bg-white/10' : 'bg-slate-50 text-slate-400'}`}>
                  <i className={`fas ${asset.type === 'Market' ? 'fa-store' : asset.type === 'School' ? 'fa-school' : 'fa-hospital'}`}></i>
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase opacity-40 mb-1">{asset.id}</div>
                  <div className="font-bold text-xs truncate max-w-[180px]">{asset.locationName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Output Area */}
        <div className="lg:col-span-8">
           {loading ? (
             <div className="bg-white border border-slate-200 h-[600px] rounded-[3rem] flex flex-col items-center justify-center gap-6">
                <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Processing Causal Attribution...</p>
             </div>
           ) : analysis ? (
             <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm space-y-12 animate-in slide-in-from-bottom-8">
                {analysis.insufficientData ? (
                  <div className="py-20 text-center">
                    <i className="fas fa-triangle-exclamation text-slate-200 text-5xl mb-6"></i>
                    <h4 className="text-xl font-black text-slate-900 uppercase">Insufficient recurring data to determine dominant sanitation failure cause.</h4>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-8 border-b border-slate-100">
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Diagnostic Evidence Strength</h4>
                        <div className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-tighter">{analysis.evidenceStrength}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Reference</div>
                        <div className="text-xs font-bold text-slate-900 uppercase">{analysis.assetId}</div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      {/* Section 1: Pattern */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">1. Observed Pattern</label>
                        <p className="text-xl font-black text-slate-900 italic leading-snug">“{analysis.observedPattern}”</p>
                      </div>

                      {/* Section 2: Root Cause */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2. Root Cause</label>
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <p className="text-sm font-bold text-slate-600 leading-relaxed">{analysis.rootCause}</p>
                        </div>
                      </div>

                      {/* Section 3: Accountability */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">3. Accountability Attribution</label>
                          <div className="space-y-4">
                            <div>
                              <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Failure Category</div>
                              <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{analysis.accountability.category}</div>
                            </div>
                            <div>
                              <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Decision Owner</div>
                              <div className="text-sm font-black text-emerald-600 uppercase tracking-tight">{analysis.accountability.owner}</div>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Recommendation */}
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">4. Operational Recommendation</label>
                          <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                            <p className="text-xs font-black text-emerald-900 leading-relaxed uppercase tracking-tight">
                              {analysis.operationalRecommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
             </div>
           ) : (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 h-[600px] rounded-[3rem] flex flex-col items-center justify-center text-center p-20">
                <i className="fas fa-microscope text-5xl text-slate-200 mb-6"></i>
                <h4 className="text-xl font-black text-slate-300 uppercase">Select Asset to Initiate Causal Attribution</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.3em] max-w-sm">
                  System analyzes cleaning logs and complaint spikes to infer responsibility.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SIHAttribution;
