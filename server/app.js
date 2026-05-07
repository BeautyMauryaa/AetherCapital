// import express from "express";
// import cors from "cors";
// import "dotenv/config";

// // Routes
// import onboardingRoutes from "./src/routes/onboarding.routes.js";
// import uploadRoutes from "./src/routes/upload.routes.js";
// import formRoutes from "./src/routes/form.routes.js";

// // Error handler
// import { errorMiddleware } from "./src/middleware/error.middleware.js";

// const app = express();

// // ─── CORS ─────────────────────────────────────────────────────────────────────
// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_URL || "https://aethercapitall.netlify.app",
//       "http://localhost:5173",
//       "http://localhost:3000",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   }),
// );

// // ─── Body Parsers ─────────────────────────────────────────────────────────────
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // ─── Health Check ─────────────────────────────────────────────────────────────
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//   });
// });

// // ─── API Routes ───────────────────────────────────────────────────────────────
// app.use("/api/onboarding", onboardingRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/form", formRoutes);

// // ─── 404 Handler ─────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.method} ${req.url}`,
//   });
// });

// // ─── Global Error Handler ─────────────────────────────────────────────────────
// app.use(errorMiddleware);

// export default app;


import express from "express";
import cors from "cors";
import "dotenv/config";

import onboardingRoutes from "./src/routes/onboarding.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import formRoutes from "./src/routes/form.routes.js";

import { errorMiddleware } from "./src/middleware/error.middleware.js";

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://aethercapitall.netlify.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/form", formRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorMiddleware);

export default app;