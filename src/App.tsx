import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Copy, RefreshCw, Zap, LayoutGrid, Github, FileCode, TestTube, Download, AlignLeft } from 'lucide-react';
import { CodePanel } from './components/CodePanel';
import { AnalysisPanel } from './components/AnalysisPanel';
import { modernizeCode, ModernizationResult, formatCode } from './services/modernizer';

const DEFAULT_INPUT = `import React, { Component } from 'react';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    const response = await fetch(\`https://api.example.com/user/\${this.props.id}\`);
    const data = await response.json();
    this.setState({ user: data, loading: false });
  }

  render() {
    const { loading, user } = this.state;
    if (loading) return <div>Loading...</div>;
    return (
      <div className="profile">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
    );
  }
}

export default UserProfile;`;

export default function App() {
  const [inputCode, setInputCode] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState<ModernizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'component' | 'tests'>('component');

  const handleModernize = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await modernizeCode(inputCode);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFormatSource = async () => {
    if (!inputCode.trim()) return;
    try {
      const formatted = await formatCode(inputCode, 'jsx');
      setInputCode(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Formatting failed");
    }
  };

  const handleFormatRefined = async () => {
    if (!result) return;
    try {
      if (activeTab === 'component') {
        const formatted = await formatCode(result.modernizedCode, 'tsx');
        setResult({
          ...result,
          modernizedCode: formatted,
        });
      } else {
        const formatted = await formatCode(result.unitTests, 'tsx');
        setResult({
          ...result,
          unitTests: formatted,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Formatting failed");
    }
  };

  const copyToClipboard = () => {
    const textToCopy = activeTab === 'component' ? result?.modernizedCode : result?.unitTests;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <header className="h-14 shrink-0 border-b border-line bg-white flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center rounded shadow-inner">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">CLASSDISMISSED <span className="text-[10px] font-mono text-gray-400 ml-1 font-normal uppercase tracking-widest">v1.2.0</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-line">
            <span className="text-[10px] font-mono text-gray-400 invisible sm:visible">TARGET: REACT 19 / TS</span>
          </div>
          <button 
            onClick={handleModernize}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all
              ${loading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-accent text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer'}`}
          >
            {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-white" />}
            {loading ? 'MODERNIZING...' : 'REBUILD COMPONENT'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] bg-bg min-h-0">
        {/* Input Pane */}
        <div className="relative group flex flex-col h-[400px] lg:h-full min-h-0 min-w-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-line">
          <CodePanel 
            label="Source Fragment (JS/Class)"
            code={inputCode}
            onChange={setInputCode}
            language="jsx"
            headerAction={
              <button
                onClick={handleFormatSource}
                className="px-2 py-0.5 bg-white border border-line rounded hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-1 text-[9px] font-mono text-gray-600 font-medium cursor-pointer"
                title="Format source code"
              >
                <AlignLeft className="w-3 h-3" />
                FORMAT
              </button>
            }
          />
        </div>

        {/* Output Pane */}
        <div className="relative border-b lg:border-b-0 lg:border-r border-line group flex flex-col h-[450px] lg:h-full min-h-0 min-w-0 overflow-hidden">
          <div className="flex bg-gray-50 border-b border-line shrink-0 select-none">
            <button 
              onClick={() => setActiveTab('component')}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 border-r border-line transition-colors cursor-pointer
                ${activeTab === 'component' ? 'bg-white text-accent font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FileCode className="w-3 h-3" />
              Component
            </button>
            <button 
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 border-r border-line transition-colors cursor-pointer
                ${activeTab === 'tests' ? 'bg-white text-accent font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <TestTube className="w-3 h-3" />
              Unit Tests
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0 min-w-0">
            <CodePanel 
              label={activeTab === 'component' ? "Refined Module (TS/Functional)" : "Jest / RTL Tests"}
              code={(activeTab === 'component' ? result?.modernizedCode : result?.unitTests) || ''}
              language="tsx"
              readOnly
              headerAction={
                result && (
                  <button
                    onClick={handleFormatRefined}
                    className="px-2 py-0.5 bg-white border border-line rounded hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-1 text-[9px] font-mono text-gray-600 font-medium cursor-pointer"
                    title="Format refined code"
                  >
                    <AlignLeft className="w-3 h-3" />
                    FORMAT
                  </button>
                )
              }
            />
            {!result && !loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-[2px]">
                <div className="text-center p-8 max-w-xs">
                  <LayoutGrid className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                  <h2 className="text-sm font-medium">Refinery Engine Idle</h2>
                  <p className="text-xs text-gray-500 mt-2">
                    Paste your Class component or messy legacy logic on the left and click Rebuild.
                  </p>
                </div>
              </div>
            )}
            {result && (
              <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
                <button 
                  onClick={() => downloadFile(
                    activeTab === 'component' ? result.modernizedCode : result.unitTests,
                    activeTab === 'component' ? 'Component.tsx' : 'Component.test.tsx'
                  )}
                  className="p-3 bg-white border border-line rounded-full shadow-xl hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Download file"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-accent border border-accent rounded-full shadow-xl hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="h-[400px] lg:h-full min-h-0 min-w-0 overflow-hidden">
          <AnalysisPanel result={result} loading={loading} />
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 shrink-0 border-t border-line bg-gray-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">{loading ? 'Processing' : 'Ready'}</span>
          </div>
          {error && (
            <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider">ERROR: {error}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-gray-400">ENGINE: GEMINI-3.1-PRO</span>
          <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
            <Github className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
