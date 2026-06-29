
import React, { useState, useEffect, useRef } from 'react';
import { WardRanking, Ward } from '../types';
import { MADURAI_WARDS } from '../constants';
import { validateSanitationImage, getWardFromCoordinates } from '../services/geminiService';

const MOCK_RANKINGS: WardRanking[] = [
  { id: 1, name: 'Ward 45 (Karisalkulam)', score: 98, trend: 'up', gvpsDetected: 2 },
  { id: 2, name: 'Ward 12 (Ellis Nagar North)', score: 92, trend: 'stable', gvpsDetected: 5 },
  { id: 3, name: 'Ward 1 (Simmakkal)', score: 85, trend: 'down', gvpsDetected: 14 },
  { id: 4, name: 'Ward 33 (Town Hall Road)', score: 79, trend: 'up', gvpsDetected: 9 },
  { id: 5, name: 'Ward 84 (Airport Area)', score: 72, trend: 'down', gvpsDetected: 22 },
];

/**
 * HIGH-PRECISION SPATIAL MATRIX - Optimized for new area names
 */
const WARD_GEO_LOOKUP = [
  { id: '1', lat: 9.9250, lng: 78.1180, name: 'Simmakkal' },
  { id: '3', lat: 9.9540, lng: 78.0700, name: 'Anaiyur' },
  { id: '8', lat: 9.9360, lng: 78.1150, name: 'Sellur' },
  { id: '12', lat: 9.9180, lng: 78.1400, name: 'Ellis Nagar North' },
  { id: '15', lat: 9.9300, lng: 78.1310, name: 'Goripalayam' },
  { id: '23', lat: 9.9380, lng: 78.1450, name: 'KK Nagar' },
  { id: '45', lat: 9.9210, lng: 78.1220, name: 'Karisalkulam' },
  { id: '74', lat: 9.8900, lng: 78.1150, name: 'Villapuram' },
  { id: '84', lat: 9.8895, lng: 78.1215, name: 'Airport Area' },
  { id: '90', lat: 9.8800, lng: 78.0700, name: 'Vilangudi' },
  { id: '100', lat: 9.8700, lng: 78.0400, name: 'Kulamangalam' }
];

const CitizenPortal: React.FC = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'uploading' | 'verifying' | 'success'>('idle');
  const [isLocating, setIsLocating] = useState(false);
  const [isValidatingPhoto, setIsValidatingPhoto] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({ 
    zone: '',
    ward: '', 
    description: '', 
    location: '', 
    lat: null as number | null, 
    lng: null as number | null,
    isAutoAssigned: false 
  });

  const resetModal = () => {
    setIsReportModalOpen(false);
    setReportStatus('idle');
    setSelectedPhoto(null);
    setImageError(null);
    setFormData({ 
      zone: '',
      ward: '', 
      description: '', 
      location: '', 
      lat: null, 
      lng: null,
      isAutoAssigned: false 
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocateUser = async () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let closestWardId = '1';
        let minDistance = Infinity;

        WARD_GEO_LOOKUP.forEach(ward => {
          const distance = calculateDistance(latitude, longitude, ward.lat, ward.lng);
          if (distance < minDistance) {
            minDistance = distance;
            closestWardId = ward.id;
          }
        });

        // Use Grounding fallback if distance is uncertain
        if (minDistance > 1.0) {
          const aiResolvedWardId = await getWardFromCoordinates(latitude, longitude);
          if (aiResolvedWardId) closestWardId = aiResolvedWardId;
        }

        const wardObj = MADURAI_WARDS.find(w => w.id === closestWardId);
        
        if (wardObj) {
          setFormData(prev => ({ 
            ...prev, 
            lat: latitude, 
            lng: longitude,
            ward: wardObj.id,
            zone: wardObj.zone,
            isAutoAssigned: true
          }));
        }
        setIsLocating(false);
      },
      (error) => { 
        setIsLocating(false); 
        setImageError("GPS Lock Failed: Please grant location permissions.");
        setShowErrorPopup(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => { if (isReportModalOpen) handleLocateUser(); }, [isReportModalOpen]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsValidatingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const isValid = await validateSanitationImage(base64);
        if (isValid) {
          setSelectedPhoto(base64);
        } else {
          setImageError("AI Validation Error: Photo must show sanitation issues.");
          setShowErrorPopup(true);
          setSelectedPhoto(null);
        }
        setIsValidatingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredWards = MADURAI_WARDS.filter(w => w.zone === formData.zone);

  const isFormValid = 
    formData.lat !== null && 
    formData.zone !== '' && 
    formData.ward !== '' && 
    selectedPhoto !== null && 
    formData.location.trim().length > 3;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
      <div className="lg:col-span-2 space-y-10">
        <div className="bg-white border border-[#9E9E9E]/20 p-10 rounded-[4rem] relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-[#1B5E20] mb-3 tracking-tighter">My Ward, My Pride</h2>
            <p className="text-[#333333] font-bold opacity-70 mb-8 uppercase text-xs tracking-widest">Live Ward Analytics for Madurai Municipal Corporation</p>
            <div className="grid grid-cols-3 gap-6">
               <div className="bg-[#E8F5E9]/50 p-6 rounded-3xl border border-[#1B5E20]/5 text-center">
                 <div className="text-[10px] text-[#1B5E20] font-black uppercase mb-2 tracking-widest">Efficiency</div>
                 <div className="text-3xl font-black text-[#1B5E20]">82%</div>
               </div>
               <div className="bg-[#E8F5E9]/50 p-6 rounded-3xl border border-[#1B5E20]/5 text-center">
                 <div className="text-[10px] text-[#1B5E20] font-black uppercase mb-2 tracking-widest">Top Clean</div>
                 <div className="text-3xl font-black text-[#1B5E20]">45</div>
               </div>
               <div className="bg-[#E8F5E9]/50 p-6 rounded-3xl border border-[#1B5E20]/5 text-center">
                 <div className="text-[10px] text-[#1B5E20] font-black uppercase mb-2 tracking-widest">Resolved</div>
                 <div className="text-3xl font-black text-[#1B5E20]">1.2k</div>
               </div>
            </div>
          </div>
          <i className="fas fa-medal text-[12rem] text-[#1B5E20] absolute -bottom-10 -right-10 opacity-5"></i>
        </div>

        <div className="bg-white border border-[#9E9E9E]/20 rounded-[4rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-[#9E9E9E]/10 flex justify-between items-center bg-[#F5F8F6]">
            <h3 className="font-black text-[#1B5E20] uppercase text-xs tracking-widest">Ward Performance Leaderboard</h3>
            <span className="text-[9px] text-[#9E9E9E] font-black uppercase tracking-widest">Updated Real-time</span>
          </div>
          <div className="divide-y divide-[#9E9E9E]/5">
            {MOCK_RANKINGS.map((ward, index) => (
              <div key={ward.id} className="p-8 flex items-center gap-8 hover:bg-[#E8F5E9]/10 transition-colors group">
                <div className="w-10 text-3xl font-black text-[#9E9E9E] group-hover:text-[#1B5E20] transition-colors">#{index + 1}</div>
                <div className="flex-1">
                  <h4 className="font-black text-[#333333] text-lg leading-tight">{ward.name}</h4>
                  <p className="text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest mt-1">{ward.gvpsDetected} Active Violations</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-[#1B5E20]">{ward.score}</div>
                  <div className="text-[9px] text-[#9E9E9E] font-black uppercase tracking-widest">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="bg-[#1B5E20] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="relative z-10">
             <h4 className="font-black mb-3 text-2xl tracking-tighter uppercase">Submit Evidence</h4>
             <p className="text-xs font-bold opacity-80 mb-8 leading-relaxed uppercase tracking-widest">Direct Command Link to Municipal Ward Officers.</p>
             <button 
               onClick={() => setIsReportModalOpen(true)}
               className="w-full bg-white text-[#1B5E20] font-black py-5 rounded-[2.5rem] text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
             >
               Launch Report Portal
             </button>
           </div>
           <i className="fas fa-camera-retro absolute -bottom-8 -left-8 text-white/5 text-9xl"></i>
        </div>
        
        <div className="bg-white border border-[#9E9E9E]/20 p-10 rounded-[4rem] shadow-sm">
          <h4 className="font-black text-[#1B5E20] mb-6 text-[10px] uppercase tracking-[0.4em]">Validation Protocol</h4>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[11px] font-bold text-[#333333] uppercase">GPS Lock Security</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <p className="text-[11px] font-bold text-[#333333] uppercase">Gemini Vision Verify</p>
            </div>
          </div>
        </div>
      </div>

      {showErrorPopup && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-[4rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-8">
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-500 text-4xl border border-rose-100 animate-bounce">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3 className="text-2xl font-black text-rose-600 uppercase tracking-tighter">Portal Error</h3>
              <p className="text-[#333333] text-sm font-bold opacity-70 leading-relaxed">{imageError}</p>
              <button onClick={() => setShowErrorPopup(false)} className="w-full bg-rose-600 text-white font-black py-5 rounded-3xl shadow-xl active:scale-95 uppercase text-xs tracking-[0.3em]">Acknowledge</button>
           </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-white/95 backdrop-blur-2xl" onClick={resetModal}></div>
          <div className="relative bg-white border border-[#9E9E9E]/20 w-full max-w-lg rounded-[4.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-500">
            {reportStatus === 'success' ? (
              <div className="p-16 text-center space-y-8">
                <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#1B5E20] text-5xl shadow-xl border-8 border-white"><i className="fas fa-check"></i></div>
                <h3 className="text-4xl font-black text-[#1B5E20] uppercase tracking-tighter">Report Uplinked</h3>
                <p className="text-[#333333] text-sm font-bold opacity-60 leading-relaxed uppercase">Submission for Ward {formData.ward} has been verified and dispatched to Zone {formData.zone}.</p>
                <button onClick={resetModal} className="w-full bg-[#1B5E20] text-white font-black py-5 rounded-3xl shadow-xl uppercase tracking-[0.4em] text-xs">Acknowledge</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if(isFormValid) { setReportStatus('uploading'); setTimeout(() => { setReportStatus('verifying'); setTimeout(() => { setReportStatus('success'); }, 2000); }, 1500); } }}>
                <div className="p-10 border-b border-[#9E9E9E]/10 flex justify-between items-center bg-[#F5F8F6]">
                   <div className="flex items-center gap-4">
                     <i className="fas fa-shield-halved text-[#1B5E20] text-xl"></i>
                     <h3 className="font-black text-[#1B5E20] uppercase tracking-[0.4em] text-[10px]">Madurai Security Protocol</h3>
                   </div>
                   <button type="button" onClick={resetModal} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transition-all"><i className="fas fa-times"></i></button>
                </div>

                <div className="p-10 space-y-8">
                   {reportStatus !== 'idle' ? (
                     <div className="py-24 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-16 h-16 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#1B5E20] font-black uppercase text-[11px] tracking-[0.5em] animate-pulse">Encrypting & Verifying Uplink...</p>
                     </div>
                   ) : (
                     <>
                        <div className={`p-8 rounded-[3.5rem] border-2 transition-all duration-700 ${formData.lat ? 'bg-[#E8F5E9] border-[#1B5E20]' : 'bg-[#F5F8F6] border-transparent'}`}>
                          {formData.lat ? (
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 rounded-2xl bg-[#1B5E20] flex items-center justify-center text-white text-xl"><i className="fas fa-satellite animate-bounce"></i></div>
                                 <div>
                                   <div className="text-[10px] font-black text-[#1B5E20] uppercase tracking-[0.3em] mb-1">Spatial Lock: Zone {formData.zone}</div>
                                   <div className="text-sm font-black text-[#333333]">{MADURAI_WARDS.find(w => w.id === formData.ward)?.area}</div>
                                 </div>
                               </div>
                               <button type="button" onClick={handleLocateUser} className="text-[10px] font-black text-[#1B5E20] uppercase tracking-widest underline underline-offset-8 decoration-[#1B5E20]/20">Refresh GPS</button>
                            </div>
                          ) : (
                            <button type="button" onClick={handleLocateUser} disabled={isLocating} className="w-full py-8 text-[#1B5E20] font-black text-xs uppercase tracking-[0.5em] flex flex-col items-center justify-center gap-4 group">
                              <i className={`fas fa-location-crosshairs text-3xl group-hover:scale-125 transition-transform ${isLocating ? 'animate-ping' : ''}`}></i>
                              {isLocating ? 'Acquiring Signal...' : '1. Secure GPS Signature'}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] text-[#9E9E9E] font-black uppercase tracking-[0.4em] ml-2">Zone</label>
                            <select required className="w-full bg-[#F5F8F6] border-none rounded-3xl px-6 py-5 text-xs font-black focus:ring-2 focus:ring-[#1B5E20]/20 outline-none appearance-none" value={formData.zone} onChange={(e) => { setFormData({...formData, zone: e.target.value, ward: ''}); }}>
                              <option value="">Select Zone</option>
                              <option value="1">Zone 1 (North)</option>
                              <option value="2">Zone 2 (Central)</option>
                              <option value="3">Zone 3 (East)</option>
                              <option value="4">Zone 4 (West)</option>
                              <option value="5">Zone 5 (South)</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] text-[#9E9E9E] font-black uppercase tracking-[0.4em] ml-2">Ward</label>
                            <select required className="w-full bg-[#F5F8F6] border-none rounded-3xl px-6 py-5 text-xs font-black focus:ring-2 focus:ring-[#1B5E20]/20 outline-none appearance-none" value={formData.ward} onChange={(e) => setFormData({...formData, ward: e.target.value})}>
                              <option value="">Select Ward</option>
                              {filteredWards.map(ward => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
                            </select>
                          </div>
                        </div>

                        <div onClick={() => fileInputRef.current?.click()} className={`relative bg-[#F5F8F6] border-2 border-dashed rounded-[3.5rem] min-h-[200px] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden group ${selectedPhoto ? 'border-[#1B5E20]' : 'border-gray-200'}`}>
                          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} disabled={isValidatingPhoto} />
                          {isValidatingPhoto ? (
                             <div className="flex flex-col items-center gap-5">
                               <div className="w-12 h-12 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
                               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1B5E20]">Vision Verifying...</span>
                             </div>
                          ) : selectedPhoto ? (
                            <><img src={selectedPhoto} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview" /><div className="absolute top-6 right-6 bg-[#1B5E20] text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl">Evidence Validated</div></>
                          ) : (
                            <div className="text-center text-[#9E9E9E] group-hover:text-[#1B5E20] p-10">
                              <i className="fas fa-camera text-3xl mb-4 group-hover:scale-110 transition-transform"></i>
                              <p className="text-[11px] font-black uppercase tracking-[0.5em]">2. Capture Proof</p>
                              <p className="text-[8px] font-bold mt-2 opacity-50 uppercase">Mandatory AI Scan</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] text-[#9E9E9E] font-black uppercase tracking-[0.4em] ml-2">Landmark Details</label>
                            <input type="text" required placeholder="Example: Near Teppakulam Entrance" className="w-full bg-[#F5F8F6] border-none rounded-3xl px-8 py-5 text-xs font-black focus:ring-2 focus:ring-[#1B5E20]/20 outline-none" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                        </div>
                     </>
                   )}
                </div>

                {reportStatus === 'idle' && (
                  <div className="p-10 bg-[#F5F8F6]">
                    <button type="submit" disabled={!isFormValid} className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black py-6 rounded-[2.5rem] shadow-2xl transition-all disabled:opacity-30 uppercase text-[12px] tracking-[0.4em] active:scale-95">
                      Confirm Dispatch
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenPortal;
