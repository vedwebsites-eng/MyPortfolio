import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialization of GoogleGenAI SDK to avoid startup crashes if key is pending
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Role-specific System Instructions
const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  vex_assistant: `You are VEX AI, the intelligent portfolio assistant for Vedant Sattegiri Patil (known as VEX).
Vedant is a 15-year-old student-builder, cybersecurity researcher, and software craftsman based in Pune, India.
His portfolio highlights:
- AETHOS: A gamified cyberpunk productivity OS with AI coach "Ace", XP curves, streak mechanics, and offline-first zero-telemetry architecture.
- INKWELL: A minimalist, typography-first markdown authoring engine designed with an optimal 65ch line measure, live highlighter swatches, and local-first persistence.
- ROOTCOUNT: A faceless tech and cybersecurity YouTube shorts channel currently "IN THE GRIND" (launching 2026), deconstructing complex CVEs (like XZ Utils CVE-2024-3094, Operation Triangulation iOS zero-click) into 60s kinetic assembly breakdowns.
- Prime Nation: His educational and collaborative venture.
- Skills: Reverse Engineering, Vulnerability Research, Assembly & C, TypeScript, React 19, Tailwind CSS, Python, Burp Suite, Ghidra, Linux security.
- Contact: Official communications via personal (vedantsattegiripatil@gmail.com) and work (team.primenationhq@gmail.com) email with verified GPG fingerprint.

Answer questions conversationally, concisely, and with technical authority. Reflect Vedant's passion for deep craftsmanship, clean typography, and zero-compromise security.`,

  exploit_analyst: `You are the RootCount Senior Exploit Analyst.
Your mission is to deconstruct real-world CVEs, memory corruption vulnerabilities, supply chain attacks (e.g. XZ Utils backdoor), and zero-days into clear, step-by-step technical narratives.
Provide assembly snippets, attack timelines, packet flows, and concrete defensive engineering takeaways.
Keep your analysis rigorous, concise, and focused on root causes rather than hype.`,

  product_architect: `You are the Product & Systems Architect for AETHOS and Inkwell.
You specialize in:
- AETHOS: Habit formation loops, cognitive coaching algorithms, XP mechanics, and offline-first encrypted state.
- INKWELL: Editorial typography, optical balance, 65ch reading measures, serif vs sans readability, and distraction-free document models.
Explain design decisions, UX friction removal, and frontend engineering principles with clarity and elegance.`,
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Multi-turn Gemini Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const {
        messages,
        model = "gemini-3.5-flash",
        role = "vex_assistant",
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Missing or invalid 'messages' array." });
      }

      // Check if GEMINI_API_KEY is available
      if (!process.env.GEMINI_API_KEY) {
        // Provide graceful high-quality fallback response so preview remains interactive
        const lastUserMsg = messages[messages.length - 1]?.text || "";
        return res.json({
          text: `[VEX AI Offline Mode] I received your question: "${lastUserMsg}". To enable live real-time Gemini generation across models (${model}), ensure GEMINI_API_KEY is set in Settings > Secrets. In the meantime: Vedant (VEX) specializes in cybersecurity research, AETHOS OS, Inkwell, and RootCount faceless CVE breakdowns.`,
          model,
          role,
          offlineFallback: true,
        });
      }

      const ai = getAi();
      const systemInstruction =
        ROLE_SYSTEM_INSTRUCTIONS[role] || ROLE_SYSTEM_INSTRUCTIONS.vex_assistant;

      // Transform messages into @google/genai format
      const contents = messages.map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      // Validate allowed models per guidelines
      let targetModel = model;
      const allowedModels = [
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.1-pro-preview",
        "gemini-3.8-flash",
      ];
      if (!allowedModels.includes(targetModel)) {
        targetModel = "gemini-3.5-flash";
      }

      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config: {
          systemInstruction,
        },
      });

      const responseText = response.text || "No response received from model.";

      return res.json({
        text: responseText,
        model: targetModel,
        role,
      });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: error?.message || "Failed to generate AI response.",
      });
    }
  });

  // Vite middleware for dev / static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server with Gemini API listening on port ${PORT}`);
  });
}

startServer();
