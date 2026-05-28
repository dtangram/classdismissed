import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as prettier from "prettier";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_PROMPT = `You are a Senior Frontend Architect specializing in codebase modernization.
Your task is to take legacy JavaScript (ES5/ES6) or React Class Components and transform them into modern, production-ready React Functional Components.

GUIDELINES:
1. Use React 19+ features (Functional Components, Hooks, Context).
2. Fully convert to TypeScript with strict interfaces.
3. Replace class state (this.state) with useState/useReducer.
4. Replace lifecycle methods (componentDidMount, etc.) with useEffect.
5. Extract business logic into custom hooks where appropriate.
6. Use Tailwind CSS for styling if the input code has styles.
7. Provide a "Refactoring Score" (0-100) and actionable insights.
8. ALWAYS generate a complete unit test file using Jest and React Testing Library that tests the key functionality of the refactored component.

OUTPUT FORMAT:
Return a valid JSON object matching the requested schema.`;

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Modernization API
  app.post("/api/modernize", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "No code provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in the environment.");
      }

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Modernize the following code and generate tests:\n\n${code}`,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              modernizedCode: { type: Type.STRING },
              unitTests: { type: Type.STRING },
              analysis: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  potentialIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                  typescriptDefinitions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["score", "improvements", "potentialIssues", "typescriptDefinitions"]
              }
            },
            required: ["modernizedCode", "unitTests", "analysis"]
          }
        }
      });

      if (!result.text) {
        throw new Error("Failed to generate modernization result.");
      }

      let parsed;
      try {
        parsed = JSON.parse(result.text);
      } catch (e) {
        console.error("Raw Gemini response:", result.text); // shows the actual error
        throw new Error("Gemini returned invalid JSON: " + result.text.slice(0, 200));
      }

      // Properly format the component and unit test files using Prettier
      const prettierConfig: prettier.Options = {
        parser: "typescript",
        semi: true,
        singleQuote: true,
        trailingComma: "all",
        printWidth: 80,
        tabWidth: 2,
        bracketSpacing: true,
      };

      try {
        parsed.modernizedCode = await prettier.format(parsed.modernizedCode, prettierConfig);
        parsed.unitTests = await prettier.format(parsed.unitTests, prettierConfig);
      } catch (formatError) {
        console.error("Formatting failed:", formatError);
      }

      res.json(parsed);
    } catch (error: any) {
      console.error("Modernization failed:", error);
      const isQuota = error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("429");
      res.status(isQuota ? 429 : 500).json({ 
        error: isQuota 
          ? "API quota exceeded. Please try again later or upgrade your Gemini plan."
          : error.message || "Internal server error"
      });
    }
  });

  // Client-side formatting helper
  app.post("/api/format", async (req, res) => {
    try {
      const { code, language } = req.body;
      const formatted = await prettier.format(code, {
        parser: language === "jsx" || language === "javascript" ? "babel" : "typescript",
        semi: true,
        singleQuote: true,
        trailingComma: "all",
        printWidth: 80,
      });
      res.json({ formatted });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
