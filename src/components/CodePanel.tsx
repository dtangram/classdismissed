import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism.css';

interface CodePanelProps {
  code: string;
  onChange?: (code: string) => void;
  language: 'javascript' | 'typescript' | 'jsx' | 'tsx';
  readOnly?: boolean;
  label: string;
  headerAction?: React.ReactNode;
}

const CodePanel = ({
  code,
  onChange,
  language,
  readOnly = false,
  label,
  headerAction,
}: CodePanelProps) => {
  return (
    <section className="flex flex-col h-full border-line border-r last:border-r-0 overflow-hidden bg-white">
      <header className="flex items-center justify-between px-4 py-2 border-b border-line bg-gray-50 shrink-0 select-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-medium">
          {label}
        </span>
        <section className="flex items-center gap-3">
          {headerAction}
          <span className="text-[10px] font-mono text-gray-400">
            {language.toUpperCase()}
          </span>
        </section>
      </header>
      <article className="flex-1 overflow-auto relative font-mono text-sm leading-relaxed p-4 bg-white">
        <Editor
          value={code}
          onValueChange={onChange || (() => {})}
          highlight={(input) => Prism.highlight(input, Prism.languages[language] || Prism.languages.javascript, language)}
          padding={10}
          readOnly={readOnly}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            minHeight: '100%',
          }}
          className="min-h-full outline-none focus-within:ring-1 focus-within:ring-accent/20 rounded"
          aria-label={`${label} editor`}
        />
      </article>
    </section>
  );
};

export default CodePanel;
