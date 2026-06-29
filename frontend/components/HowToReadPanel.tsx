import React, { useState } from 'react';
import { Language } from '../types';

interface Props { language: Language; }

const HowToReadPanel: React.FC<Props> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 bg-[#F4F3EE]/50 border border-slate-200 rounded-[2rem] p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-black text-[#5A4628] uppercase tracking-tight"
      >
        <span>{language === 'ta' ? 'இதை எப்படி படிப்பது' : 'How to Read This'}</span>
        <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200 text-[10px] font-bold text-[#6A6A6A] space-y-2">
          <p>{language === 'ta' ? '• என்ட்ரோபி மதிப்பெண் 0-1 என்ற அளவில் உள்ளது' : '• Entropy Score ranges from 0-1'}</p>
          <p>{language === 'ta' ? '• உচ்சமான மதிப்பெண் = சிக்கல் வெற்றிடம்' : '• Higher scores = structural vacancy'}</p>
          <p>{language === 'ta' ? '• ஆணை ஸ்পষ್টতা = உரிமை தெளிவு' : '• Mandate Clarity = ownership clarity'}</p>
        </div>
      )}
    </div>
  );
};

export default HowToReadPanel;
