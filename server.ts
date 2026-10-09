import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  // Direct file download route for the resume with explicit attachment headers
  app.get(["/resume.pdf", "/api/download-resume", "/api/resume.pdf"], (_req, res) => {
    const filePath = path.join(process.cwd(), "public", "resume.pdf");
    res.download(filePath, "vedant_sattegiri_patil_cv.pdf", (err) => {
      if (err && !res.headersSent) {
        res.status(404).send("Resume file not found");
      }
    });
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
    console.log(`Portfolio server listening on port ${PORT}`);
  });
}

startServer();
