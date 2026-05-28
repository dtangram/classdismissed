import { useState } from 'react';
import { modernizeCode, ModernizationResult, formatCode } from '../services/modernizer';

interface UseModernizerParams {
  defaultInput: string;
}

const useModernizer = ({ defaultInput }: UseModernizerParams) => {
  const [inputCode, setInputCode] = useState<string>(defaultInput);
  const [result, setResult] = useState<ModernizationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

  return {
    inputCode,
    setInputCode,
    result,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleModernize,
    handleFormatSource,
    handleFormatRefined,
    copyToClipboard,
    downloadFile,
  };
};

export default useModernizer;
