
import React, { useState, useEffect } from 'react';
import { getGovernanceKpis } from '../services/geminiService';
import { GovernanceMetrics } from '../types';

const GovernanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getGovernanceKpis();
        setMetrics(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="py-40 text-center animate-pulse">Establishing Governance Link...</div>;
  if (!metrics) return null;

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { l: 'Handoff Efficiency', v: `${metrics.avgHandoffEfficiency}%`, s: 'Admin Cycle Speed', i: 'fa-shuttle-space', c: 'text-indigo-600' },
          { l: 'Responsibility Leakage', v: `${metrics.ownershipLeakageRate}%`, s: 'Ownership Fail Rate', i: 'fa-droplet-slash', c: 'text-rose-600' },
          { l: 'Active Audits', v: '142', s: 'Stalled Processes', i: 'fa-clipboard-check', c: 'text-emerald-600' },
          { l: 'Policy Coverage', v: '88%', s: 'Procedural Clarity', i: 'fa-shield-halved', c: 'text-slate-900' }
        ].map((m, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <i className={`fas ${m.i} ${m.c} text-2xl mb-6`}></i>
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.l}</h4>
             <div className="text-3xl font-black text-slate-900 mb-1">{m.v}</div>
             <p className="text-[8px] font-bold text-slate-400 uppercase">{m.s}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white border border-slate-200 rounded-[4rem] p-12 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10">Bouncing Hotspots</h3>
            <div className="space-y-8">
               {metrics.bouncingHotspots.map((h, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">{i+1}</div>
                       <div className="text-xs font-black text-slate-700 uppercase tracking-tight">{h.entity}</div>
                    </div>
                    <div className="text-xs font-black text-rose-600">{h.count} Handoff Rejections</div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[4rem] p-12 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10">Strategic Bottlenecks</h3>
            <div className="space-y-4">
               {metrics.resolutionBottlenecks.map((b, i) => (
                 <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6 group">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 group-hover:scale-150 transition-transform"></div>
                    <div className="text-xs font-black text-slate-700 uppercase tracking-widest">{b}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default GovernanceDashboard;
