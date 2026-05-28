import React from 'react';
import { Zap, RefreshCw, Play } from 'lucide-react';

interface HeaderProps {
  loading: boolean;
  onModernize: () => void;
}

const Header = ({ loading, onModernize }: HeaderProps) => {
  return (
    <header className="h-14 shrink-0 border-b border-line bg-white flex items-center justify-between px-6 z-10 shadow-sm">
      <section className="flex items-center gap-3">
        <span className="w-8 h-8 bg-black flex items-center justify-center rounded shadow-inner" aria-hidden="true">
          <Zap className="w-4 h-4 text-white fill-white" />
        </span>
        <section>
          <h1 className="text-sm font-bold tracking-tight text-gray-900">
            CODEREFINERY{' '}
            <span className="text-[10px] font-mono text-gray-400 ml-1 font-normal uppercase tracking-widest">
              v1.2.0
            </span>
          </h1>
        </section>
      </section>

      <section className="flex items-center gap-4">
        <span className="flex items-center gap-2 pr-4 border-r border-line">
          <span className="text-[10px] font-mono text-gray-400 invisible sm:visible">
            TARGET: REACT 19 / TS
          </span>
        </span>
        <button 
          onClick={onModernize}
          disabled={loading}
          aria-busy={loading}
          aria-live="polite"
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all
            ${loading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-accent text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer'}`}
        >
          {loading ? (
            <RefreshCw className="w-3 h-3 animate-spin" aria-hidden="true" />
          ) : (
            <Play className="w-3 h-3 fill-white" aria-hidden="true" />
          )}
          <span>{loading ? 'MODERNIZING...' : 'REBUILD COMPONENT'}</span>
        </button>
      </section>
    </header>
  );
};

export default Header;
