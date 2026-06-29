
import React from 'react';

interface HeaderProps {
  onContactClick: () => void;
  onTabChange: (tab: 'overview' | 'monitor' | 'citizen' | 'analytics') => void;
}

const Header: React.FC<HeaderProps> = ({ onContactClick, onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#E8F5E9]/90 backdrop-blur-md border-b border-[#9E9E9E]/30 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('overview')}>
        <div className="w-10 h-10 bg-[#1B5E20] rounded-lg flex items-center justify-center shadow-lg shadow-[#1B5E20]/20">
          <i className="fas fa-eye text-white text-xl"></i>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-[#1B5E20] leading-none">
            Mandate Vacuum
          </h1>
          <span className="text-[9px] text-[#9E9E9E] font-bold uppercase tracking-[0.2em]">Sanitation Root-Cause Hub</span>
        </div>
      </div>
      <nav className="hidden lg:flex gap-6 text-sm font-bold text-[#333333]">
        <button onClick={() => onTabChange('overview')} className="hover:text-[#1B5E20] transition-colors">Root-Cause Analysis</button>
        <button onClick={() => onTabChange('monitor')} className="hover:text-[#1B5E20] transition-colors">Field Nodes</button>
        <button onClick={() => onTabChange('citizen')} className="hover:text-[#1B5E20] transition-colors">Citizens</button>
        <button onClick={() => onTabChange('analytics')} className="hover:text-[#1B5E20] transition-colors">Analytics</button>
      </nav>
      <button 
        onClick={onContactClick}
        className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-8 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-[#1B5E20]/20 active:scale-95 flex items-center gap-2"
      >
        <i className="fas fa-question-circle"></i>
        Help
      </button>
    </header>
  );
};

export default Header;
