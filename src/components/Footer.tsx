import React from 'react';
import { Github } from 'lucide-react';

interface FooterProps {
  loading: boolean;
  error: string | null;
}

const Footer = ({ loading, error }: FooterProps) => {
  return (
    <footer className="h-8 shrink-0 border-t border-line bg-gray-50 flex items-center justify-between px-6 select-none">
      <section className="flex items-center gap-4">
        <span className="flex items-center gap-1.5" aria-live="polite">
          <span 
            className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} 
            aria-hidden="true"
          />
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
            {loading ? 'Processing' : 'Ready'}
          </span>
        </span>
        {error && (
          <span 
            role="alert" 
            className="text-[9px] font-mono text-red-500 uppercase tracking-wider"
          >
            ERROR: {error}
          </span>
        )}
      </section>
      <section className="flex items-center gap-3">
        <span className="text-[9px] font-mono text-gray-400">ENGINE: GEMINI-3.5-FLASH</span>
        <a 
          href="#" 
          className="text-gray-400 hover:text-gray-600 transition-colors focus:ring-1 focus:ring-accent rounded-sm"
          aria-label="GitHub Repository"
        >
          <Github className="w-3 h-3" aria-hidden="true" />
        </a>
      </section>
    </footer>
  );
};

export default Footer;
