
import React, { useState, useEffect, useRef } from 'react';
import { PropertyType, Condition, UserInput } from '../types';
import { 
  Calculator, MapPin, Ruler, Home, Coins, ChevronDown, ChevronUp, 
  Sparkles, Wind, ShieldCheck, Thermometer, Loader2, Hammer, Search,
  Globe, FileSearch, BarChart3, CheckCircle2, Building2, Navigation
} from 'lucide-react';

interface InputFormProps {
  isLoading: boolean;
  onSubmit: (data: UserInput) => void;
}

interface AddressSuggestion {
  label: string;
  city?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
}

const ANALYSIS_STEPS = [
  { id: 0, label: "Stadt & Region...", icon: Globe },
  { id: 1, label: "Mietspiegel-Daten...", icon: FileSearch },
  { id: 2, label: "Bodenrichtwerte...", icon: MapPin },
  { id: 3, label: "BGB-Faktoren...", icon: Hammer },
  { id: 4, label: "Marktspannbreite...", icon: BarChart3 },
  { id: 5, label: "KI-Gutachten...", icon: CheckCircle2 }
];

const InputForm: React.FC<InputFormProps> = ({ isLoading, onSubmit }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<any>({
    address: '',
    propertyType: PropertyType.APARTMENT,
    sizeSqm: 70,
    rooms: 3,
    yearBuilt: 1985,
    condition: Condition.WELL_KEPT,
    currentColdRent: 600,
    hasTripleGlazing: false,
    hasBalcony: false,
    hasFloorHeating: false,
    isBarrierFree: false,
    hasModernBathroom: true,
    sanitaryModernizationYear: '',
    heatingModernizationYear: '',
    wallInsulationYear: '',
    isQuietLocation: true
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (formData.address.length < 4) {
        setSuggestions([]);
        return;
      }

      setIsSearchingAddress(true);
      try {
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(formData.address)}&limit=5&lang=de`);
        const data = await response.json();
        
        const formatted: AddressSuggestion[] = data.features.map((f: any) => {
          const p = f.properties;
          const parts = [p.street, p.housenumber, p.postcode, p.city].filter(Boolean);
          return {
            label: parts.join(', '),
            city: p.city,
            street: p.street,
            housenumber: p.housenumber,
            postcode: p.postcode
          };
        });
        
        setSuggestions(formatted);
        setShowSuggestions(formatted.length > 0);
      } catch (error) {
        console.error("Adress-Suche fehlgeschlagen", error);
      } finally {
        setIsSearchingAddress(false);
      }
    };

    const timeoutId = setTimeout(fetchAddresses, 400);
    return () => clearTimeout(timeoutId);
  }, [formData.address]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      setProgress(0);
      
      interval = setInterval(() => {
        setLoadingStep(prev => {
          const next = prev + 1;
          if (next < ANALYSIS_STEPS.length) {
            setProgress((next / (ANALYSIS_STEPS.length - 1)) * 100);
            return next;
          }
          return prev;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSelectSuggestion = (s: AddressSuggestion) => {
    setFormData(prev => ({ ...prev, address: s.label }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sizeSqm: Number(formData.sizeSqm),
      rooms: Number(formData.rooms),
      yearBuilt: Number(formData.yearBuilt),
      currentColdRent: Number(formData.currentColdRent)
    });
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-xl border border-slate-800 overflow-hidden">
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Search className="text-[#f5931f]" size={16} />
            Objekt-Analyse
          </h2>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 px-2 py-0.5 bg-[#f5931f]/