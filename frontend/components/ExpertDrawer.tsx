
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GVPIncident, PredictiveMetrics, SensorStatus, Cluster } from '../types';
import { generateMockIncident, generateSOP, getPredictiveAnalytics, getUpdatedSensorStatuses } from '../services/geminiService';

const INITIAL_SENSORS: SensorStatus[] = [
  { id: 'HUB-SELLUR-01', tier: 'Gateway', device: 'Jetson Nano', status: 'Online', battery: 100 },
  { id: 'NODE-MEEN-45', tier: 'Edge', device: 'ESP32-CAM', status: 'Online', battery: 88 },
  { id: 'NODE-ANNA-12', tier: 'Edge', device: 'ESP32-CAM', status: 'Sleeping', battery: 42 },
  { id: 'NODE-SIMM-78', tier: 'Edge', device: 'ESP32-CAM', status: 'Online', battery: 95 },
];

const BOUNDS = { lat: [9.85, 9.98], lng: [78.05, 78.18] };

const SEVERITY_CONFIG = {
  Critical: { color: 'bg-rose-600', ring: 'ring-rose-500/30', text: 'text-rose-600', glow: 'shadow-[0_0_25px_rgba(225,29,72,0.5)]' },
  High: { color: 'bg-orange-500', ring: 'ring-orange-500/30', text: 'text-orange-500', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]' },
  Medium: { color: 'bg-amber-400', ring: 'ring-amber-400/30', text: 'text-amber-500', glow: '' },
  Low: { color: 'bg-emerald-500', ring: 'ring-emerald-500/30', text: 'text-emerald-500', glow: '' }
};

const LiveMonitor: React.FC = () => {
  const [incidents, setIncidents] = useState<GVPIncident[]>([]);
  const [sensors, setSensors] = useState<SensorStatus[]>(INITIAL_SENSORS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRefreshingSensors, setIsRefreshingSensors] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'heatmap' | 'fleet'>('standard');
  const [selectedIncident, setSelectedIncident] = useState<GVPIncident | null>(null);
  const [prediction, setPrediction] = useState<PredictiveMetrics | null>(null);
  const [loadingSOP, setLoadingSOP] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRadarSweeping, setIsRadarSweeping] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isStreetViewLoading, setIsStreetViewLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ top: 50, left: 50 });
  const [activeLiveSensorId, setActiveLiveSensorId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction();
    const init = async () => {
      const initialBatch = await Promise.all([
        generateMockIncident(), generateMockIncident(), generateMockIncident()
      ]);
      setIncidents(initialBatch);
    };
    init();
  }, []);

  const fetchPrediction = async () => {
    try {
      const res = await getPredictiveAnalytics();
      setPrediction(res);
    } catch (e) { console.error(e); }
  };

  const refreshSensors = async () => {
    setIsRefreshingSensors(true);
    setSyncError(null);
    try {
      const updated = await getUpdatedSensorStatuses(sensors);
      if (Math.random() > 0.95) throw new Error("Handshake timeout");
      setSensors(updated);
    } catch (e: any) { 
      console.error(e);
      setSyncError("Network Sync Failed: Node Handshake Timeout.");
      setTimeout(() => setSyncError(null), 6000);
    } finally { setIsRefreshingSensors(false); }
  };

  const triggerIncident = async () => {
    setIsSimulating(true);
    setIsRadarSweeping(true);
    setTimeout(() => setIsRadarSweeping(false), 2000);
    try {
      const newIncident = await generateMockIncident();
      setIncidents(prev => [newIncident, ...prev].slice(0, 30));
      if (newIncident.severity === 'Critical') {
        const pos = getMapPos(newIncident.lat, newIncident.lng);
        setMapCenter(pos);
        if (zoomLevel < 3) setZoomLevel(3);
        handleIncidentClick(newIncident);
      }
    } catch (e) { console.error(e); } finally { setIsSimulating(false); }
  };

  const getMapPos = (lat: number, lng: number) => {
    const top = ((lat - BOUNDS.lat[0]) / (BOUNDS.lat[1] - BOUNDS.lat[0])) * 100;
    const left = ((lng - BOUNDS.lng[0]) / (BOUNDS.lng[1] - BOUNDS.lng[0])) * 100;
    return { top: 100 - top, left }; 
  };

  const handleIncidentClick = async (incident: GVPIncident) => {
    setSelectedIncident(incident);
    setIsStreetViewLoading(true);
    const pos = getMapPos(incident.lat, incident.lng);
    setMapCenter(pos);
    if (zoomLevel < 4) setZoomLevel(4);
    if (incident.sop) return;
    setLoadingSOP(true);
    try {
      const sop = await generateSOP(incident);
      const updatedIncident = { ...incident, sop };
      setIncidents(prev => prev.map(i => i.id === incident.id ? updatedIncident : i));
      setSelectedIncident(updatedIncident);
    } catch (e) { console.error(e); } finally { setLoadingSOP(false); }
  };

  const clusters = useMemo(() => {
    if (zoomLevel >= 4) return null;
    const gridSize = zoomLevel === 1 ? 25 : zoomLevel === 2 ? 15 : 8;
    const groups: Record<string, GVPIncident[]> = {};
    incidents.forEach(inc => {
      const gridX = Math.floor(inc.lng * gridSize) / gridSize;
      const gridY = Math.floor(inc.lat * gridSize) / gridSize;
      const key = `${gridX}-${gridY}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(inc);
    });
    return Object.entries(groups).map(([id, items]) => {
      const avgLat = items.reduce((sum, i) => sum + i.lat, 0) / items.length;
      const avgLng = items.reduce((sum, i) => sum + i.lng, 0) / items.length;
      const { top, left } = getMapPos(avgLat, avgLng);
      const maxSeverity = items.reduce((max, curr) => {
        const levels = { 'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3 };
        return levels[curr.severity] > levels[max] ? curr.severity : max;
      }, items[0].severity);
      return { id, ward: items[0].ward, count: items.length, incidents: items, top, left, maxSeverity } as Cluster;
    });
  }, [incidents, zoomLevel]);

  const handleClusterClick = (c: Cluster) => {
    setMapCenter({ top: c.top, left: c.left });
    setZoomLevel(prev => Math.min(5, prev + 1));
    const representativeIncident = c.incidents.reduce((max, curr) => {
      const levels = { 'Low': 0, 'Medium': 1, 'High': 2, 'Critical': 3 };
      return levels[curr.severity] > levels[max.severity] ? curr : max;
    }, c.incidents[0]);
    handleIncidentClick(representativeIncident);
  };

  const mapScale = 1 + (zoomLevel - 1) * 0.9;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-700 relative max-w-[1600px] mx-auto">
      {/* Topology Status Sidebar (Left - 3 Cols) */}
      <div className="lg:col-span-3 space-y-8">
        <div className="relative">
          {syncError && (
            <div className="absolute -top-16 left-0 right-0 z-[60] animate-in slide-in-from-top-4 duration-500">
               <div className="bg-rose-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-rose-400/30">
                  <i className="fas fa-triangle-exclamation"></i>
                  <p className="text-[10px] font-bold leading-tight uppercase tracking-tight">{syncError}</p>
               </div>
            </div>
          )}

          <div className="bg-white border border-[#9E9E9E]/20 p-8 rounded-[3.5rem] shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-center mb-8">
               <h4 className="text-[10px] text-[#1B5E20] font-black uppercase tracking-[0.4em]">Mesh Grid Status</h4>
               <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-50"></div>
             </div>
             
             <div className="space-y-3 mb-8">
                {sensors.map(sensor => (
                  <div key={sensor.id} className="bg-[#E8F5E9]/30 p-4 rounded-3xl border border-transparent hover:border-[#1B5E20]/10 hover:bg-white transition-all flex justify-between items-center group/sensor">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${sensor.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : sensor.status === 'Sleeping' ? 'bg-amber-400 opacity-60' : 'bg-rose-500 animate-pulse'}`}></div>
                      <div>
                        <div className="text-[10px] font-black text-[#1B5E20] tracking-tight">{sensor.id}</div>
                        <div className="text-[7px] text-[#9E9E9E] uppercase font-bold tracking-[0.1em]">{sensor.device}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {sensor.device === 'ESP32-CAM' && sensor.status !== 'Offline' && (
                        <button 
                          onClick={() => setActiveLiveSensorId(activeLiveSensorId === sensor.id ? null : sensor.id)}
                          title={activeLiveSensorId === sensor.id ? "Disable Feed" : "View Live Feed"}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeLiveSensorId === sensor.id ? 'bg-[#1B5E20] text-white shadow-lg scale-110' : 'bg-white text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white border border-[#1B5E20]/10'}`}
                        >
                          <i className={`fas ${activeLiveSensorId === sensor.id ? 'fa-video' : 'fa-video-slash'} text-[10px]`}></i>
                        </button>
                      )}
                      <div className={`text-[9px] font-black ${sensor.battery < 25 ? 'text-rose-500 animate-pulse' : 'text-[#1B5E20]'}`}>{sensor.battery}%</div>
                    </div>
                  </div>
                ))}
             </div>
             
             <button 
               onClick={refreshSensors} 
               disabled={isRefreshingSensors} 
               className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black py-4 rounded-[1.5rem] text-[8px] uppercase tracking-[0.4em] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
             >
               <i className={`fas ${isRefreshingSensors ? 'fa-spinner fa-spin' : 'fa-rotate group-hover/btn:rotate-180'} text-xs`}></i> 
               {isRefreshingSensors ? 'Polling...' : 'Sync Network'}
             </button>
          </div>
        </div>

        {/* REMOTE NODE UPLINK (LIVE FEED SECTION) */}
        {activeLiveSensorId ? (
          <div className="bg-black rounded-[3.5rem] overflow-hidden shadow-2xl relative aspect-[4/3] border-4 border-white animate-in zoom-in-95 duration-500 group/live">
             <div className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-screen overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-pulse"></div>
               <div className="absolute h-[2px] w-full bg-white/20 top-0 animate-[scan_3s_linear_infinite]"></div>
             </div>
             
             {/* SIMULATED CAMERA FEED */}
             <div className="absolute inset-0 bg-[#050505] flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3`} 
                  className="w-full h-full object-cover opacity-60 grayscale brightness-75 animate-[pulse_8s_infinite]" 
                  alt="Live Remote Sensor Feed"
                />
                
                {/* AI HUD OVERLAY */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 bg-[#1B5E20] px-3 py-1 rounded-full border border-white/10 shadow-lg">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                         <span className="text-[8px] font-black text-white uppercase tracking-widest">LIVE Uplink</span>
                      </div>
                      <div className="text-right text-emerald-400 font-mono text-[8px] uppercase tracking-tighter bg-black/60 p-2 rounded-lg backdrop-blur-md border border-white/5">
                        FPS: 14.2<br/>LAT: 42ms<br/>ID: {activeLiveSensorId}<br/>V_SIG: 88%
                      </div>
                   </div>
                   
                   <div className="relative flex-1 flex items-center justify-center">
                      <div className="w-24 h-24 border border-emerald-500/30 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute w-32 h-32 border-2 border-emerald-500/20 border-dashed rounded-lg animate-[spin_10s_linear_infinite]"></div>
                      
                      {/* Detection Marker (Simulated AI) */}
                      <div className="absolute top-[20%] left-[30%] w-24 h-20 border-2 border-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                         <span className="absolute -top-6 left-0 bg-amber-500 text-black text-[7px] font-black px-1.5 py-0.5 uppercase tracking-tighter">HUMAN_DET: 82%</span>
                         <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
                         <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
                      </div>
                   </div>
                   
                   <div className="flex justify-between items-end">
                      <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-1">
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                           <span className="text-[7px] font-black text-white uppercase tracking-widest">GVP Prediction: Clean</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                           <span className="text-[7px] font-black text-white uppercase tracking-widest">Motion: Static_Node</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => setActiveLiveSensorId(null)}
                        className="bg-rose-600/90 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border border-rose-400/20 hover:bg-rose-700 transition-all active:scale-90"
                      >
                        <i className="fas fa-power-off text-xs"></i>
                      </button>
                   </div>
                </div>
             </div>
             
             <style>{`
               @keyframes scan {
                 from { transform: translateY(-50px); }
                 to { transform: translateY(350px); }
               }
             `}</style>
          </div>
        ) : prediction && (
           <div className="bg-[#1B5E20] p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl group">
             <div className="relative z-10">
               <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.4em] mb-8 opacity-60">
                  <i className="fas fa-brain-circuit text-lg"></i> AI Command Forecast
               </div>
               <h5 className="text-xl font-black leading-tight mb-6">{prediction.predictedSurge}</h5>
               <div className="flex items-center gap-4 mb-8">
                  <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full bg-white transition-all duration-1000" style={{ width: `${prediction.confidence}%` }} />
                  </div>
                  <span className="text-[10px] font-black">{Math.round(prediction.confidence)}%</span>
               </div>
               <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-bold leading-relaxed opacity-90 italic">“{prediction.recommendedAction}”</p>
               </div>
             </div>
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
           </div>
        )}
      </div>

      {/* Main Command Map View (Center - 6 Cols) */}
      <div className="lg:col-span-6 space-y-12">
        <div className="bg-[#f0f4f1] border border-[#9E9E9E]/20 rounded-[4rem] overflow-hidden relative h-[720px] shadow-2xl ring-1 ring-black/5">
          {isRadarSweeping && (
            <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
               <div className="absolute w-[800px] h-[800px] border-2 border-[#1B5E20]/10 rounded-full animate-[ping_2s_infinite]"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/5 to-transparent animate-pulse"></div>
            </div>
          )}

          {/* Map View Controls */}
          <div className="absolute top-8 left-8 z-40 flex bg-white/95 backdrop-blur-xl p-2.5 rounded-[2.2rem] border border-white/50 shadow-2xl">
             {['standard', 'heatmap', 'fleet'].map((m) => (
               <button 
                key={m} 
                onClick={() => setViewMode(m as any)} 
                className={`px-6 py-3.5 rounded-[1.8rem] text-[9px] font-black uppercase transition-all tracking-[0.3em] ${viewMode === m ? 'bg-[#1B5E20] text-white shadow-lg' : 'text-[#9E9E9E] hover:text-[#1B5E20]'}`}
               >
                 {m}
               </button>
             ))}
          </div>

          <div className="absolute top-8 right-8 z-40 flex flex-col gap-4">
            <div className="bg-white/95 px-6 py-4 rounded-[2rem] border border-white/50 shadow-2xl flex flex-col items-center">
               <span className="text-[9px] font-black text-[#1B5E20] uppercase tracking-[0.4em] opacity-40 mb-1">Scale</span>
               <span className="text-xs font-mono font-black text-[#333333]">G-{zoomLevel}00</span>
            </div>
            <div className="bg-white/95 p-2 rounded-[2rem] border border-white/50 shadow-2xl flex flex-col gap-2">
                <button onClick={() => setZoomLevel(Math.min(5, zoomLevel + 1))} className="w-12 h-12 flex items-center justify-center bg-white text-[#1B5E20] hover:bg-[#E8F5E9] rounded-2xl transition-all border border-[#1B5E20]/5"><i className="fas fa-plus"></i></button>
                <button onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))} className="w-12 h-12 flex items-center justify-center bg-white text-[#1B5E20] hover:bg-[#E8F5E9] rounded-2xl transition-all border border-[#1B5E20]/5"><i className="fas fa-minus"></i></button>
            </div>
          </div>

          {/* Interactive Map Core */}
          <div 
            className="absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.23, 1, 0.32, 1)" 
            style={{ 
              transform: `scale(${mapScale}) translate(${50 - mapCenter.left}%, ${50 - mapCenter.top}%)`, 
              transformOrigin: '50% 50%',
              willChange: 'transform'
            }}
          >
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1B5E20 1.5px, transparent 1.5px), linear-gradient(90deg, #1B5E20 1.5px, transparent 1.5px)', backgroundSize: '100px 100px' }}></div>
            
            {clusters ? clusters.map((c) => (
              <div key={c.id} className="absolute cursor-pointer transition-all hover:scale-110 group z-20" style={{ top: `${c.top}%`, left: `${c.left}%`, transform: `translate(-50%, -50%) scale(${1/mapScale})` }} onClick={() => handleClusterClick(c)}>
                <div className={`w-20 h-20 rounded-[3rem] ${SEVERITY_CONFIG[c.maxSeverity].color} border-8 border-white shadow-2xl flex flex-col items-center justify-center text-white ring-1 ring-black/10`}>
                  <span className="text-2xl font-black leading-none">{c.count}</span>
                  <span className="text-[7px] uppercase font-black tracking-widest opacity-80">NODES</span>
                </div>
              </div>
            )) : incidents.map((inc) => {
              const { top, left } = getMapPos(inc.lat, inc.lng);
              const active = selectedIncident?.id === inc.id;
              const config = SEVERITY_CONFIG[inc.severity];
              return (
                <div key={inc.id} className={`absolute cursor-pointer group transition-all z-20 ${active ? 'z-50' : ''}`} style={{ top: `${top}%`, left: `${left}%`, transform: `translate(-50%, -50%) scale(${1/mapScale})` }} onClick={() => handleIncidentClick(inc)}>
                  <div className="relative flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-[2rem] border-[6px] border-white ${config.color} ${config.glow} flex items-center justify-center shadow-2xl transition-all ${active ? 'scale-125 ring-[12px] ring-[#1B5E20]/5' : ''}`}>
                      <i className={`fas ${active ? 'fa-crosshairs text-lg' : 'fa-satellite text-base'} text-white`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-10 right-10 z-40">
            <button onClick={triggerIncident} disabled={isSimulating} className="px-12 py-5 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl flex items-center gap-4 transition-all active:scale-95">
              <i className={`fas fa-broadcast-tower text-base ${isSimulating ? 'animate-spin' : ''}`}></i>
              {isSimulating ? 'Scanning Urban Mesh...' : 'Urban Pulse Scan'}
            </button>
          </div>
        </div>

        {selectedIncident && (
           <div className="bg-white border border-[#9E9E9E]/10 p-10 rounded-[4rem] animate-in slide-in-from-bottom-12 duration-[800ms] shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-8">
                   <div className={`w-20 h-20 rounded-[3rem] flex items-center justify-center text-white text-3xl shadow-xl ${SEVERITY_CONFIG[selectedIncident.severity].color}`}>
                      <i className="fas fa-street-view" />
                   </div>
                   <div>
                     <div className="flex items-center gap-4 mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${SEVERITY_CONFIG[selectedIncident.severity].color}`}>{selectedIncident.severity}</span>
                        <h4 className="font-black text-[#1B5E20] text-3xl tracking-tighter">{selectedIncident.id}</h4>
                     </div>
                     <p className="text-[10px] text-[#9E9E9E] font-black uppercase tracking-[0.5em]">{selectedIncident.ward} • {selectedIncident.lat.toFixed(4)}°N, {selectedIncident.lng.toFixed(4)}°E</p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedIncident(null)} className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all">
                   <i className="fas fa-times text-lg text-[#1B5E20]" />
                 </button>
              </div>

              {/* STREET VIEW PORTAL */}
              <div className="mb-10 rounded-[3.5rem] overflow-hidden border-4 border-gray-50 bg-slate-100 relative aspect-video shadow-lg group">
                 {isStreetViewLoading && (
                   <div className="absolute inset-0 z-20 bg-slate-50/90 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin mb-6"></div>
                      <span className="text-[10px] font-black text-[#1B5E20] uppercase tracking-[0.4em]">Establishing Ground Link...</span>
                   </div>
                 )}
                 
                 <iframe 
                   onLoad={() => setIsStreetViewLoading(false)} 
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   loading="lazy" 
                   allowFullScreen 
                   referrerPolicy="no-referrer-when-downgrade" 
                   src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.API_KEY}&location=${selectedIncident.lat},${selectedIncident.lng}&heading=180&pitch=0&fov=85`}
                 ></iframe>
              </div>

              {/* DATA STRIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {[
                  {l: 'Cognitive Tag', v: selectedIncident.type, i: 'fa-microchip', c: 'text-indigo-600', bg: 'bg-indigo-50/40'}, 
                  {l: 'Spatial Volume', v: selectedIncident.volume, i: 'fa-boxes-stacked', c: 'text-[#1B5E20]', bg: 'bg-[#E8F5E9]/40'}, 
                  {l: 'Penalty Rating', v: `₹${selectedIncident.predictedFine.toLocaleString()}`, i: 'fa-gavel', c: 'text-rose-600', bg: 'bg-rose-50/40'}
                ].map((s,i) => (
                  <div key={i} className={`${s.bg} p-8 rounded-[3rem] flex flex-col items-center text-center gap-4`}>
                    <i className={`fas ${s.i} text-2xl ${s.c}`}></i>
                    <div>
                      <div className="text-[9px] text-[#9E9E9E] font-black uppercase tracking-widest mb-1">{s.l}</div>
                      <div className={`text-lg font-black uppercase ${s.c}`}>{s.v}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                 <div className="flex items-center gap-6">
                    <span className="text-[11px] font-black text-[#1B5E20] uppercase tracking-[0.5em] bg-[#E8F5E9] px-8 py-3.5 rounded-2xl border border-[#1B5E20]/10">Autonomous Response Protocol</span>
                    <div className="h-[1px] flex-1 bg-[#1B5E20]/10"></div>
                 </div>
                 {loadingSOP ? (
                   <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] animate-pulse">
                      <div className="w-8 h-8 border-2 border-[#1B5E20] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-[10px] font-black uppercase text-[#1B5E20] tracking-[0.4em]">Drafting SOP...</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedIncident.sop?.map((step, i) => (
                        <div key={i} className="p-6 bg-[#F5F8F6] rounded-3xl border border-[#1B5E20]/5 text-xs font-bold text-[#333333] flex gap-5">
                          <span className="w-10 h-10 bg-[#1B5E20] text-white rounded-xl flex items-center justify-center shrink-0 text-sm font-black">{i+1}</span>
                          <span className="leading-relaxed opacity-80">{step}</span>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
        )}
      </div>

      {/* Real-time Telemetry Feed List (Right - 3 Cols) */}
      <div className="lg:col-span-3 bg-white border border-[#9E9E9E]/20 rounded-[3.5rem] p-10 flex flex-col h-[850px] shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-[#1B5E20] uppercase tracking-tighter">Command Log</h3>
            <p className="text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest mt-1">Live Feed Uplink</p>
          </div>
          <div className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-2xl flex items-center gap-3">
             <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
             <span className="text-[10px] font-black uppercase">{incidents.length}</span>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto flex-1 custom-scrollbar pr-4 relative z-10">
          {incidents.length === 0 && (
            <div className="text-center py-40 opacity-10">
              <i className="fas fa-satellite-dish text-[100px] mb-10 text-[#1B5E20]" />
              <p className="text-[12px] font-black uppercase tracking-[0.6em]">Scanning...</p>
            </div>
          )}
          {incidents.map((inc) => (
            <div 
              key={inc.id} 
              onClick={() => handleIncidentClick(inc)} 
              className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${selectedIncident?.id === inc.id ? 'bg-[#E8F5E9] border-[#1B5E20]' : 'bg-[#F5F8F6] border-transparent hover:border-[#1B5E20]/20'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase text-white ${SEVERITY_CONFIG[inc.severity].color}`}>
                  {inc.severity}
                </span>
                <span className="text-[10px] font-mono text-[#9E9E9E]">{inc.timestamp}</span>
              </div>
              <h4 className="text-sm font-black text-[#1B5E20] uppercase truncate mb-2">{inc.ward}</h4>
              <p className="text-[10px] text-[#333333] opacity-60 truncate font-bold uppercase">{inc.location}</p>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-20"></div>
      </div>
    </div>
  );
};

export default LiveMonitor;
