import express from "express";
import cors from "cors";
import "dotenv/config";

import onboardingRoutes from "./src/routes/onboarding.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import formRoutes from "./src/routes/form.routes.js";
import { errorMiddleware } from "./src/middleware/error.middleware.js";
import { getAuthUrl, getTokensFromCode } from "./src/config/googleDrive.config.js";

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "https://aethercapitall.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ─── Google OAuth2 — run once to get refresh token ───────────────────────────
// Step 1: Open http://localhost:5000/api/auth/google in browser
app.get("/api/auth/google", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// Step 2: Google redirects here → shows refresh token on screen
app.get("/api/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await getTokensFromCode(code);
    console.log("✅ REFRESH TOKEN:", tokens.refresh_token);
    res.send(`
      <h2>✅ Auth successful!</h2>
      <p>Copy this into your <code>.env</code> as <code>GOOGLE_REFRESH_TOKEN</code>:</p>
      <pre style="background:#1a1a2e;color:#a78bfa;padding:16px;border-radius:8px;font-size:14px">
${tokens.refresh_token}
      </pre>
      <p>Then restart the server — you won't need this page again.</p>
    `);
  } catch (err) {
    res.status(500).send("Auth failed: " + err.message);
  }
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/form", formRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;