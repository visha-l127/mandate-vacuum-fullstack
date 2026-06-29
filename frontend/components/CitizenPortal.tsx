
import React, { useState, useRef, useEffect } from 'react';
import { createExpertChat } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";
import { Language } from '../types';

interface Message { role: 'user' | 'model'; text: string; }

interface ExpertDrawerProps { 
  isOpen: boolean; 
  onClose: () => void; 
  initialLanguage: Language;
}

const STARTER_PROMPTS = [
  { label: 'Reporting Guide', icon: 'fa-book-open', prompt: 'How do I correctly report a sanitation issue in my ward?' },
  { label: 'புகார் அளிப்பது எப்படி?', icon: 'fa-language', prompt: 'எனது வார்டில் சுகாதாரப் பிரச்சினையை எப்படி சரியாகப் புகார் செய்வது?' },
  { label: 'Verification Protocol', icon: 'fa-shield-check', prompt: 'Why is a photo and GPS location mandatory for reporting?' },
  { label: 'அபராத விதிகள்', icon: 'fa-gavel', prompt: 'What are the illegal dumping fine amounts for residents?' }
];

const ExpertDrawer: React.FC<ExpertDrawerProps> = ({ isOpen, onClose, initialLanguage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcome = initialLanguage === 'ta' 
      ? 'வணக்கம்! நான் உங்கள் Mandate Vacuum உதவி (Help) மையம். உங்களுக்கு இன்று எப்படி உதவ முடியும்?' 
      : 'Hello! Welcome to the Mandate Vacuum Help portal. How can I assist you with your ward reports or our AIoT system today?';
    setMessages([{ role: 'model', text: welcome }]);
  }, [initialLanguage]);

  useEffect(() => { if (isOpen && !chatRef.current) chatRef.current = createExpertChat(); }, [isOpen]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);
    try {
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      const streamResponse = await chatRef.current.sendMessageStream({ message: textToSend });
      let fullText = '';
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        fullText += (c.text || "");
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) updated[updated.length - 1] = { ...updated[updated.length - 1], text: fullText };
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => { 
        const updated = [...prev]; 
        updated[updated.length - 1] = { 
          role: 'model', 
          text: initialLanguage === 'ta' ? 'மன்னிக்கவும், தகவல் தொடர்பில் பிழை ஏற்பட்டது.' : 'Sorry, a connection error occurred. Please try again.' 
        }; 
        return updated; 
      });
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-white/60 backdrop-blur-sm z-[60] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-[#9E9E9E]/30 z-[70] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-8 border-b border-[#9E9E9E]/20 flex justify-between items-center bg-[#E8F5E9]/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1B5E20] rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
                <i className="fas fa-question-circle"></i>
              </div>
              <div>
                <h3 className="font-black text-[#1B5E20] uppercase text-sm tracking-widest">{initialLanguage === 'ta' ? 'உதவி' : 'Help'}</h3>
                <p className="text-[10px] text-[#9E9E9E] font-bold uppercase tracking-widest">{initialLanguage === 'ta' ? 'தூய்மை கண்காணிப்பு' : 'Bilingual Support'}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white transition-colors flex items-center justify-center text-[#9E9E9E]"><i className="fas fa-times"></i></button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#E8F5E9]/5">
            {messages.map((msg, i) => {
              const isError = msg.text.includes('[SYSTEM ERROR]') || msg.text.includes('[அமைப்பு பிழை]');
              return (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-5 rounded-3xl text-xs font-bold whitespace-pre-wrap leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#1B5E20] text-white rounded-br-none' 
                      : isError 
                        ? 'bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-bl-none' 
                        : 'bg-white border border-[#9E9E9E]/20 text-[#333333] rounded-bl-none'
                  }`}>
                    {msg.text || (loading && i === messages.length - 1 ? (initialLanguage === 'ta' ? "பதிலைத் தயாரித்தல்..." : "Validating...") : "...")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar bg-white/50 border-t border-[#9E9E9E]/10">
            {STARTER_PROMPTS.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleSend(item.prompt)}
                disabled={loading}
                className="shrink-0 bg-white border border-[#9E9E9E]/30 hover:border-[#1B5E20] hover:text-[#1B5E20] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <i className={`fas ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-[#9E9E9E]/20 bg-white">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput(''); }} className="relative">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={initialLanguage === 'ta' ? "உதவி தேவைப்படுகிறதா?..." : "Need assistance? Ask about wards or reports..."} 
                className="w-full bg-[#E8F5E9]/20 border-2 border-transparent focus:border-[#1B5E20]/30 rounded-[1.5rem] px-6 py-4 text-xs text-[#333333] font-bold outline-none transition-all pr-24" 
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 bottom-2 px-6 bg-[#1B5E20] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all hover:bg-[#2E7D32]"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : (initialLanguage === 'ta' ? 'அனுப்பு' : 'Send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertDrawer;
