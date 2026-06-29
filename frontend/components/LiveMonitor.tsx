
import React from 'react';
import { AIoTInsight } from '../types';

interface InsightCardProps {
  insight: AIoTInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#9E9E9E]/30 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-8 bg-gradient-to-br from-[#E8F5E9] to-white">
        <h3 className="text-3xl font-bold text-[#1B5E20] mb-2">{insight.scenario}</h3>
        <p className="text-[#333333] text-sm font-medium">Detailed architectural blueprint powered by Gemini AI</p>
      </div>
      
      <div className="p-8 space-y-10">
        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#E8F5E9]/40 border border-[#9E9E9E]/20">
            <div className="text-[#1B5E20] mb-3 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
              <i className="fas fa-eye text-[#9E9E9E]"></i> Perception
            </div>
            <p className="text-sm text-[#333333] leading-relaxed">{insight.architecture.perception}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#E8F5E9]/40 border border-[#9E9E9E]/20">
            <div className="text-[#1B5E20] mb-3 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
              <i className="fas fa-wifi text-[#9E9E9E]"></i> Transmission
            </div>
            <p className="text-sm text-[#333333] leading-relaxed">{insight.architecture.transmission}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#E8F5E9]/40 border border-[#9E9E9E]/20">
            <div className="text-[#1B5E20] mb-3 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
              <i className="fas fa-brain text-[#9E9E9E]"></i> Intelligence
            </div>
            <p className="text-sm text-[#333333] leading-relaxed">{insight.architecture.intelligence}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#E8F5E9]/40 border border-[#9E9E9E]/20">
            <div className="text-[#1B5E20] mb-3 font-bold uppercase text-xs tracking-wider flex items-center gap-2">
              <i className="fas fa-bolt text-[#9E9E9E]"></i> Action
            </div>
            <p className="text-sm text-[#333333] leading-relaxed">{insight.architecture.action}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Management Section */}
          <div>
            <h4 className="text-xl font-bold text-[#1B5E20] mb-5 flex items-center gap-3">
              <i className="fas fa-tasks text-[#9E9E9E]"></i> What to Manage
            </h4>
            <ul className="space-y-4">
              {insight.management.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[#333333] text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#1B5E20] mt-1.5 shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks Section */}
          <div>
            <h4 className="text-xl font-bold text-[#1B5E20] mb-5 flex items-center gap-3">
              <i className="fas fa-triangle-exclamation text-[#9E9E9E]"></i> Potential Challenges
            </h4>
            <ul className="space-y-4">
              {insight.risks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[#333333] text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#9E9E9E] mt-1.5 shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
