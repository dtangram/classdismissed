import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Code2, Sparkles } from 'lucide-react';
import { ModernizationResult } from '../services/modernizer';

interface AnalysisPanelProps {
  result: ModernizationResult | null;
  loading: boolean;
}

export function AnalysisPanel({ result, loading }: AnalysisPanelProps) {
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8 text-center bg-white border-l border-line">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>
        <div>
          <h3 className="text-sm font-medium">Analysing Patterns...</h3>
          <p className="text-xs text-gray-500 mt-1">Refining class logic into functional modern structures.</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white border-l border-line opacity-50">
        <Code2 className="w-8 h-8 text-gray-300 mb-4" />
        <h3 className="text-sm font-medium">No Analysis Available</h3>
        <p className="text-xs text-gray-400 mt-1 italic">Modernize code to generate refactoring insights.</p>
      </div>
    );
  }

  const { score, improvements, potentialIssues, typescriptDefinitions } = result.analysis;

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-line overflow-hidden">
      <div className="p-4 border-b border-line bg-gray-50 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-medium">Refinery Report</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400">SCORE</span>
          <span className={`text-sm font-mono font-bold ${score > 80 ? 'text-green-600' : 'text-blue-600'}`}>
            {score}%
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <section>
          <h4 className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Modernization Steps</h4>
          <ul className="space-y-3">
            {improvements.map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 items-start"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-gray-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        {potentialIssues.length > 0 && (
          <section>
            <h4 className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Technical Debt</h4>
            <ul className="space-y-3">
              {potentialIssues.map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (improvements.length + i) * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </section>
        )}

        {typescriptDefinitions.length > 0 && (
          <section>
            <h4 className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-3 italic">Type Injected</h4>
            <div className="bg-gray-50 p-3 rounded border border-line">
              {typescriptDefinitions.map((def, i) => (
                <div key={i} className="text-[10px] font-mono text-accent mb-1 last:mb-0 break-all">
                  {def}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
