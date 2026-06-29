import React from 'react';
import { Language } from '../types';

interface Props { language: Language; }

const ForensicJourneyTrace: React.FC<Props> = ({ language }) => {
  return (
    <div className="max-w-[1200px] mx-auto py-20 text-center">
      <h3 className="text-2xl font-black text-[#5A4628] uppercase mb-4">
        {language === 'ta' ? 'ফরেনসিক যাত্রা ট্রেস' : 'Forensic Journey Trace'}
      </h3>
      <p className="text-sm text-[#6A6A6A]">
        {language === 'ta' ? 'বিস্তারিত অভিযোগ স্থানান্তর বিশ্লেষণ শীঘ্রই আসছে।' : 'Detailed complaint transfer analysis coming soon.'}
      </p>
    </div>
  );
};

export default ForensicJourneyTrace;
