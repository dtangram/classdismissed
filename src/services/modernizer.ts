export interface ModernizationResult {
  modernizedCode: string;
  unitTests: string;
  analysis: {
    score: number;
    improvements: string[];
    potentialIssues: string[];
    typescriptDefinitions: string[];
  };
}

export async function modernizeCode(code: string): Promise<ModernizationResult> {
  const response = await fetch("/api/modernize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate modernization result.");
  }

  return response.json() as Promise<ModernizationResult>;
}

export async function formatCode(code: string, language: string): Promise<string> {
  const response = await fetch("/api/format", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to format code.");
  }

  const data = await response.json();
  return data.formatted;
}
