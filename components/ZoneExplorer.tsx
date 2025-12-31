import React, { useState } from 'react';
import { LocationZone } from '../types';
import { Map as MapIcon, Info, Navigation, ExternalLink, MapPin } from 'lucide-react';

interface ZoneExplorerProps {
  zones: LocationZone[];
  mapLink?: string;
  cityName: string;
}

const ZoneExplorer: React.FC<ZoneExplorerProps> = ({ zones, mapLink, cityName }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(zones[1]?.id || null);

  const activeZone = zones.find(z => z.id === selectedZone);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MapIcon className="text-[#f5931f]" size={20} />
            Mietspiegel-Zonen & Lageklassen: {cityName}
          </h3>
          <p className="text-sm text-slate-500">Klicken Sie auf eine Zone, um die Details der Wohnlage zu sehen.</p>
        </div>
        
        {mapLink && (
          <a 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#034933] text-white rounded-lg text-sm font-bold hover:bg-[#f5931f] transition-all shadow-sm"
          >
            <Navigation size={16} />
            Offizielle Zonenkarte öffnen
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="p-6">
        {/* Interactive Zone Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
                selectedZone === zone.id 
                  ? 'border-[#f5931f] bg-[#f5931f]/5 ring-4 ring-[#f5931f]/10' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#f5931f] transition-colors">
                  Lageklasse
                </span>
                <div className={`w-3 h-3 rounded-full shadow-sm`} style={{ backgroundColor: zone.color || '#cbd5e1' }}></div>
              </div>
              <h4 className="font-bold text-slate-800 text-lg">{zone.name}</h4>
              <p className="text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                Einfluss: {zone.impactPercent}
              </p>
            </button>
          ))}
        </div>

        {/* Detailed Zone Content */}
        {activeZone && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Info size={18} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">Definition & Merkmale</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeZone.description}
                  </p>
                </div>
              </div>

              {activeZone.examples && activeZone.examples.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-slate-100 rounded-lg text-slate-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1">Beispielhafte Bereiche / Straßen</h5>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activeZone.examples.map((ex, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Representation (Abstract City Map) */}
            <div className="relative h-48 md:h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <div className="relative w-full h-full border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center">
                    <div className={`absolute transition-all duration-700 blur-3xl opacity-30 ${
                      activeZone.id.includes('gut') ? 'bg-blue-500 w-full h-full' : 
                      activeZone.id.includes('mittel') ? 'bg-slate-400 w-3/4 h-3/4' : 'bg-orange-500 w-1/2 h-1/2'
                    }`}></div>
                    <MapIcon size={48} className="text-white/20 group-hover:text-[#f5931f]/40 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-lg">
                      <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Visueller Indikator</p>
                      <p className="text-sm text-white font-medium">{activeZone.name}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneExplorer;