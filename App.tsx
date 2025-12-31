
import React, { useState, useRef, useEffect } from 'react';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import { UserInput, AnalysisResult } from './types';
import { analyzePotential } from './services/geminiService';
import { AlertCircle, Key, ExternalLink, RefreshCcw, Sparkles, Scale, Info } from 'lucide-react';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } catch (e) {
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    try {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } catch (e) {
      console.error("Fehler beim Öffnen der Key-Auswahl:", e);
    }
  };

  const handleAnalysis = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data);
    setResult(null);

    try {
      const analysis = await analyzePotential(data);
      setResult(analysis);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err: any) {
      console.error("App Error:", err);
      let msg = "Die Analyse konnte nicht abgeschlossen werden.";
      if (err.message?.includes("500") || err.message?.includes("Internal Server Error")) {
        msg = "Der Analyse-Server ist momentan überlastet. Bitte versuchen Sie es in wenigen Sekunden erneut.";
      } else if (err.message?.includes("not found") || err.message?.includes("key")) {
        setHasKey(false);
        msg = "Ihr API-Key scheint ungültig zu sein oder wurde nicht gefunden.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="w-full bg-slate-50 flex items-center justify-center p-4 min-h-[400px]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center space-y-4 border border-slate-200">
          <div className="w-12 h-12 bg-[#f5931f]/10 rounded-xl flex items-center justify-center mx-auto">
            <Key className="text-[#f5931f]" size={24} />
          </div>
          <h2 className="text-lg font-black text-slate-800">Projekt-Key erforderlich</h2>
          <p className="text-slate-600 text-xs leading-relaxed">
            Für die Echtzeit-Recherche via Google Search benötigen Sie einen API-Key aus einem kostenpflichtigen Google Cloud Projekt.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-left">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-[9px] font-black text-[#034933] uppercase flex items-center gap-1 hover:underline"
            >
              Billing Dokumentation <ExternalLink size={10} />
            </a>
          </div>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full py-3 bg-[#f5931f] text-white font-black rounded-lg hover:bg-[#d9821a] transition-all shadow-md flex items-center justify-center gap-2 text-sm"
          >
            Key auswählen <Sparkles size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent text-slate-900 font-sans selection:bg-[#f5931f]/30">
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        
        {/* Widget Branding Header - More Compact */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8">
               <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                  <path d="M45 15 L75 5 L75 95 H45 V15 Z" fill="#f5931f" />
                  <path d="M15 35 L40 30 V95 H15 V35 Z" fill="#f5931f" />
                  <path d="M80 30 L105 35 V95 H80 V30 Z" fill="#f5931f" />
                  <rect x="10" y="95" width="100" height="5" fill="#f5931f" />
               </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-[#034933] leading-none uppercase tracking-tight">B & W</h1>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Immobilien Management UG (haftungsbeschränkt)</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-wider border border-slate-200">
              Miet-Potential-Check
            </span>
          </div>
        </div>

        {/* Main Form Section */}
        <section className="animate-in fade-in slide-in-from-top-2 duration-500">
          <InputForm isLoading={isLoading} onSubmit={handleAnalysis} />
        </section>
        
        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-in fade-in shadow-sm">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <h3 className="font-bold text-red-800 text-[10px] uppercase tracking-wider">Fehler</h3>
              <p className="text-red-600 text-xs mt-0.5">{error}</p>
              <button 
                onClick={() => userInput && handleAnalysis(userInput)} 
                className="mt-2 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-700 hover:text-red-900 underline"
              >
                <RefreshCcw size={12} /> Neu laden
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div ref={resultsRef} className="scroll-mt-4">
          {result && userInput && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <AnalysisResults result={result} input={userInput} />
            </div>
          )}
        </div>

        {/* Legal Disclaimer - More Integrated */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 opacity-80">
          <div className="flex items-start gap-2 text-slate-400">
            <Scale size={14} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Haftungsausschluss</h4>
              <p className="text-[10px] leading-relaxed">
                Diese KI-basierte Analyse dient der ersten Orientierung und ersetzt kein Gutachten. 
                Die <strong>B&W Immobilien Management UG (haftungsbeschränkt)</strong> übernimmt keine Gewähr für die Richtigkeit der Prognosen. 
                Rechtliche Rahmenbedingungen wie die Mietpreisbremse sind im Einzelfall zu prüfen.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
