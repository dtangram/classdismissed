import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Code2, Sparkles } from 'lucide-react';
import { ModernizationResult } from '../services/modernizer';

interface AnalysisPanelProps {
  result: ModernizationResult | null;
  loading: boolean;
}

const AnalysisPanel = ({ result, loading }: AnalysisPanelProps) => {
  if (loading) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8 text-center bg-white border-l border-line">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.span>
        <header>
          <h3 className="text-sm font-medium text-gray-900">Analysing Patterns...</h3>
          <p className="text-xs text-gray-500 mt-1">Refining class logic into functional modern structures.</p>
        </header>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white border-l border-line opacity-50">
        <Code2 className="w-8 h-8 text-gray-300 mb-4" />
        <h3 className="text-sm font-medium text-gray-900">No Analysis Available</h3>
        <p className="text-xs text-gray-400 mt-1 italic">Modernize code to generate refactoring insights.</p>
      </section>
    );
  }

  const { score, improvements, potentialIssues, typescriptDefinitions } = result.analysis;

  return (
    <aside className="w-full h-full flex flex-col bg-white border-l border-line overflow-hidden" aria-label="Analysis report panel">
      <header className="p-4 border-b border-line bg-gray-50 flex items-center justify-between shrink-0 select-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-medium">Refinery Report</span>
        <section className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400">SCORE</span>
          <span className={`text-sm font-mono font-bold ${score > 80 ? 'text-green-600' : 'text-blue-600'}`}>
            {score}%
          </span>
        </section>
      </header>
      
      <article className="flex-1 overflow-auto p-4 space-y-6">
        <section aria-labelledby="heading-steps">
          <h4 id="heading-steps" className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Modernization Steps</h4>
          <ul className="space-y-3">
            {improvements.map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 items-start"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-xs leading-relaxed text-gray-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        {potentialIssues.length > 0 && (
          <section aria-labelledby="heading-debt">
            <h4 id="heading-debt" className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Technical Debt</h4>
            <ul className="space-y-3">
              {potentialIssues.map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (improvements.length + i) * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs leading-relaxed text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </section>
        )}

        {typescriptDefinitions.length > 0 && (
          <section aria-labelledby="heading-types">
            <h4 id="heading-types" className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Type Injected</h4>
            <section className="bg-gray-50 p-3 rounded border border-line">
              {typescriptDefinitions.map((def, i) => (
                <p key={i} className="text-[10px] font-mono text-accent mb-1 last:mb-0 break-all home-types">
                  {def}
                </p>
              ))}
            </section>
          </section>
        )}
      </article>
    </aside>
  );
};

export default AnalysisPanel;
