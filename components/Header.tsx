
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-4 group">
          {/* Logo Icon - Programmatic Recreation to match B&W Brand */}
          <div className="h-12 w-auto aspect-[1.2/1] relative">
             <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-sm">
                {/* Center Building */}
                <path d="M45 15 L75 5 L75 95 H45 V15 Z" fill="#f5931f" />
                <path d="M45 25 L75 15" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 40 L75 30" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 55 L75 45" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 70 L75 60" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                <path d="M45 85 L75 75" stroke="white" strokeWidth="3" strokeOpacity="0.8" />
                
                {/* Left Building */}
                <path d="M15 35 L40 30 V95 H15 V35 Z" fill="#f5931f" />
                <path d="M22 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M33 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />

                {/* Right Building */}
                <path d="M80 30 L105 35 V95 H80 V30 Z" fill="#f5931f" />
                <path d="M88 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M97 35 V90" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                
                {/* Base Line */}
                <rect x="10" y="95" width="100" height="5" fill="#f5931f" />
             </svg>
          </div>
          
          <div className="flex flex-col justify-center">
            <span className="text-3xl font-serif font-bold text-[#034933] leading-none tracking-tight">B & W</span>
            <span className="text-[0.6rem] font-sans font-bold text-[#034933] tracking-[0.1em] uppercase mt-1">Immobilien Management UG (haftungsbeschränkt)</span>
          </div>
        </a>

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 items-center">
          <a href="#" className="hover:text-[#f5931f] transition-colors">Verwaltung</a>
          <a href="#" className="hover:text-[#f5931f] transition-colors">Verkauf</a>
          <a href="#" className="hover:text-[#f5931f] transition-colors">Über uns</a>
          <a 
            href="https://bundwimmobilien.de/kontaktformular/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-5 py-2.5 bg-[#034933] text-white rounded-lg hover:bg-[#f5931f] transition-colors font-semibold shadow-sm"
          >
            Kontakt
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
