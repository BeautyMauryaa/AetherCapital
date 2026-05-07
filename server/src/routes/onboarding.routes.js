// const express = require("express");
// const OnboardingSubmission = require("../models/onboarding.model");

// const router = express.Router();

// // ─── POST /api/onboarding/submit ─────────────────────────
// // Called at the final step (Step 6 Review) when user clicks Submit.
// // By this point, files have already been uploaded via /api/upload/*
// // so this endpoint only saves form data + Drive file references.
// router.post("/submit", async (req, res, next) => {
//   try {
//     const {
//       accountType,
//       personal,
//       address,
//       roles,
//       compliance,
//       review,
//       files, // { profileImage, signature, documents[] } — all with Drive URLs
//     } = req.body;

//     // Basic validation
//     if (!accountType || !personal?.email) {
//       return res.status(400).json({
//         error: "accountType and personal.email are required",
//       });
//     }

//     // Check for duplicate submission from same email
//     const existing = await OnboardingSubmission.findOne({
//       "personal.email": personal.email,
//       status: { $in: ["submitted", "under_review", "approved"] },
//     });
//     if (existing) {
//       return res.status(409).json({
//         error: "An onboarding submission already exists for this email",
//         submissionId: existing._id,
//       });
//     }

//     const submission = new OnboardingSubmission({
//       accountType,
//       personal,
//       address,
//       roles,
//       compliance,
//       review: {
//         ...review,
//         termsAcceptedAt: review?.termsAccepted ? new Date() : undefined,
//       },
//       files,
//       ipAddress: req.ip,
//       userAgent: req.get("User-Agent"),
//     });

//     await submission.save();

//     res.status(201).json({
//       success: true,
//       submissionId: submission._id,
//       message: "Onboarding submitted successfully",
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// // ─── GET /api/onboarding/status/:submissionId ─────────────
// // Optional: let the frontend poll submission status
// router.get("/status/:submissionId", async (req, res, next) => {
//   try {
//     const submission = await OnboardingSubmission.findById(
//       req.params.submissionId,
//       "status submittedAt accountType personal.firstName personal.lastName personal.email"
//     );
//     if (!submission) {
//       return res.status(404).json({ error: "Submission not found" });
//     }
//     res.json({ success: true, submission });
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;


import { Router } from "express";
import {
  startOnboarding,
  saveStep2,
  saveStep3,
  saveStep4,
  saveStep5,
  saveStep6AndSubmit,
  getOnboarding,
  getAllOnboardings,
} from "../controllers/onboarding.controller.js";
import { uploadMixed, uploadMultipleFiles } from "../middleware/multer.middleware.js";

const router = Router();

// POST   /api/onboarding/start       → create new session (Step 1)
router.post("/start", startOnboarding);

// GET    /api/onboarding             → all submissions (admin)
router.get("/", getAllOnboardings);

// GET    /api/onboarding/:id         → get single onboarding
router.get("/:id", getOnboarding);

// PUT    /api/onboarding/:id/step2   → personal/business info + image
router.put("/:id/step2", uploadMixed, saveStep2);

// PUT    /api/onboarding/:id/step3   → address
router.put("/:id/step3", saveStep3);

// PUT    /api/onboarding/:id/step4   → roles + permissions
router.put("/:id/step4", saveStep4);

// PUT    /api/onboarding/:id/step5   → compliance + document uploads
router.put("/:id/step5", uploadMultipleFiles, saveStep5);

// PUT    /api/onboarding/:id/step6   → signature + submit
router.put("/:id/step6", saveStep6AndSubmit);

export default router;