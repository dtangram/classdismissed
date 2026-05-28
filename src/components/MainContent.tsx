import React from 'react';
import { AlignLeft, FileCode, TestTube, LayoutGrid, Download, Copy } from 'lucide-react';
import CodePanel from './CodePanel';
import AnalysisPanel from './AnalysisPanel';
import { ModernizationResult } from '../services/modernizer';

interface MainContentProps {
  inputCode: string;
  setInputCode: (code: string) => void;
  result: ModernizationResult | null;
  loading: boolean;
  activeTab: 'component' | 'tests';
  setActiveTab: (tab: 'component' | 'tests') => void;
  handleFormatSource: () => void;
  handleFormatRefined: () => void;
  copyToClipboard: () => void;
  downloadFile: (content: string, filename: string) => void;
}

const MainContent = ({
  inputCode,
  setInputCode,
  result,
  loading,
  activeTab,
  setActiveTab,
  handleFormatSource,
  handleFormatRefined,
  copyToClipboard,
  downloadFile,
}: MainContentProps) => {
  return (
    <main className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] bg-bg min-h-0">
      {/* Input Pane */}
      <section className="relative group flex flex-col h-[400px] lg:h-full min-h-0 min-w-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-line">
        <CodePanel 
          label="Source Fragment (JS/Class)"
          code={inputCode}
          onChange={setInputCode}
          language="jsx"
          headerAction={
            <button
              onClick={handleFormatSource}
              className="px-2 py-0.5 bg-white border border-line rounded hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-1 text-[9px] font-mono text-gray-600 font-medium cursor-pointer focus:ring-1 focus:ring-accent"
              title="Format source code"
              aria-label="Format original source code"
            >
              <AlignLeft className="w-3 h-3" aria-hidden="true" />
              <span>FORMAT</span>
            </button>
          }
        />
      </section>

      {/* Output Pane */}
      <section className="relative border-b lg:border-b-0 lg:border-r border-line group flex flex-col h-[450px] lg:h-full min-h-0 min-w-0 overflow-hidden">
        <nav className="flex bg-gray-50 border-b border-line shrink-0 select-none" aria-label="Workspace tabs">
          <button 
            onClick={() => setActiveTab('component')}
            aria-selected={activeTab === 'component'}
            role="tab"
            className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 border-r border-line transition-colors cursor-pointer focus:outline-none focus:bg-white
              ${activeTab === 'component' ? 'bg-white text-accent font-bold' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <FileCode className="w-3 h-3" aria-hidden="true" />
            <span>Component</span>
          </button>
          <button 
            onClick={() => setActiveTab('tests')}
            aria-selected={activeTab === 'tests'}
            role="tab"
            className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 border-r border-line transition-colors cursor-pointer focus:outline-none focus:bg-white
              ${activeTab === 'tests' ? 'bg-white text-accent font-bold' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <TestTube className="w-3 h-3" aria-hidden="true" />
            <span>Unit Tests</span>
          </button>
        </nav>

        <article className="flex-1 relative overflow-hidden flex flex-col min-h-0 min-w-0">
          <CodePanel 
            label={activeTab === 'component' ? "Refined Module (TS/Functional)" : "Jest / RTL Tests"}
            code={(activeTab === 'component' ? result?.modernizedCode : result?.unitTests) || ''}
            language="tsx"
            readOnly
            headerAction={
              result && (
                <button
                  onClick={handleFormatRefined}
                  className="px-2 py-0.5 bg-white border border-line rounded hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-1 text-[9px] font-mono text-gray-600 font-medium cursor-pointer focus:ring-1 focus:ring-accent"
                  title="Format refined code"
                  aria-label="Format generated modernized code"
                >
                  <AlignLeft className="w-3 h-3" aria-hidden="true" />
                  <span>FORMAT</span>
                </button>
              )
            }
          />
          {!result && !loading && (
            <section className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-[2px]">
              <section className="text-center p-8 max-w-xs">
                <LayoutGrid className="w-10 h-10 text-gray-500 mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-sm font-medium text-gray-900">Refinery Engine Idle</h2>
                <p className="text-xs text-gray-500 mt-2">
                  Paste your Class component or messy legacy logic on the left and click Rebuild.
                </p>
              </section>
            </section>
          )}
          {result && (
            <menu className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
              <li>
                <button 
                  onClick={() => downloadFile(
                    activeTab === 'component' ? result.modernizedCode : result.unitTests,
                    activeTab === 'component' ? 'Component.tsx' : 'Component.test.tsx'
                  )}
                  className="p-3 bg-white border border-line rounded-full shadow-xl hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
                  title="Download file"
                  aria-label="Download modern source code file"
                >
                  <Download className="w-4 h-4 text-gray-600" aria-hidden="true" />
                </button>
              </li>
              <li>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-accent border border-accent rounded-full shadow-xl hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
                  title="Copy to clipboard"
                  aria-label="Copy code to your clipboard"
                >
                  <Copy className="w-4 h-4 text-white" aria-hidden="true" />
                </button>
              </li>
            </menu>
          )}
        </article>
      </section>

      {/* Sidebar */}
      <aside className="h-[400px] lg:h-full min-h-0 min-w-0 overflow-hidden" aria-label="Refined insights and scorecard">
        <AnalysisPanel result={result} loading={loading} />
      </aside>
    </main>
  );
};

export default MainContent;
