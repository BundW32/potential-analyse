
import React from 'react';
import { AnalysisResult, UserInput } from '../types';
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, ArrowRight, BarChart3, PlusCircle, MinusCircle } from 'lucide-react';
import ZoneExplorer from './ZoneExplorer';

interface AnalysisResultsProps {
  result: AnalysisResult;
  input: UserInput;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, input }) => {
  const currentPerSqm = input.currentColdRent / input.sizeSqm;
  const targetPerSqm = result.estimatedMarketRentPerSqm;

  const chartData = [
    { name: 'AKTUELL', price: currentPerSqm, color: '#1e293b' },
    { name: 'ZIEL-MARKT', price: targetPerSqm, color: '#f5931f' }
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const formatSqm = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(val) + '/m²';

  return (
    <div className="space-y-12 animate-fade-in pb-24">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status Quo</p>
          <p className="text-3xl font-black text-slate-800">{formatCurrency(input.currentColdRent)}</p>
          <p className="text-[11px] text-slate-500 font-bold mt-1">{formatSqm(currentPerSqm)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Marktwert-Ziel</p>
          <p className="text-3xl font-black text-slate-900">{formatCurrency(result.estimatedTotalMarketRent)}</p>
          <p className="text-[11px] text-[#f5931f] font-black mt-1">{formatSqm(targetPerSqm)}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
          <p className="text-[10px] text-[#f5931f] font-black uppercase tracking-widest mb-1">Mehrertrag p.a.</p>
          <p className="text-3xl font-black">+{formatCurrency(result.potentialYearlyGain)}</p>
          <div className="flex items-center gap-1.5 mt-1">
             <TrendingUp size={14} className="text-green-400" />
             <span className="text-[11px] text-green-400 font-black">+{result.rentGapPercentage.toFixed(1)}% Potential</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Präzision</p>
          <p className="text-3xl font-black text-slate-800">{result.confidenceScore}%</p>
          <p className="text-[11px] text-slate-500 font-bold mt-1">KI-Konfidenz</p>
        </div>
      </div>

      {/* Zone Explorer Integration */}
      {result.locationZones && (
        <ZoneExplorer 
          zones={result.locationZones} 
          cityName={input.address.split(',').pop()?.trim() || 'Ihre Stadt'} 
        />
      )}

      {/* Main Analysis Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                 <BarChart3 size={18} className="text-[#f5931f]" /> Marktvergleich
               </h3>
             </div>
             <div className="p-8 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 40, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#64748b'}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} width={40} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="price" barSize={60} radius={[10, 10, 0, 0]}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
               Wertermittlungs-Faktoren
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.featureImpacts.map((feat, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      feat.direction === 'positive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {feat.direction === 'positive' ? <PlusCircle size={16} /> : <MinusCircle size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{feat.feature} ({feat.impactPercent}%)</p>
                      <p className="text-xs text-slate-500">{feat.description}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden h-full">
              <p className="text-[10px] text-[#f5931f] font-black uppercase tracking-widest mb-4">Experten-Fazit</p>
              <p className="text-lg font-serif italic mb-8">"{result.locationAnalysis}"</p>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-[#f5931f] hover:text-white transition-all">
                Kontakt aufnehmen <ArrowRight size={18} className="inline ml-2" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
