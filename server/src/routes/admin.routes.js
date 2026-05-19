import express from "express";
import {
  getAllSubmissions,
  getSubmission,
  updateStatus,
  getStats,
  getAllDocuments,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Stats dashboard
router.get("/stats", getStats);

// All submissions (with optional ?status=&search=&page=&limit=)
router.get("/submissions", getAllSubmissions);

// Single submission detail
router.get("/submissions/:id", getSubmission);
router.get("/documents", getAllDocuments);


// Update status (approve / reject / under_review)
router.patch("/submissions/:id/status", updateStatus);


export default router;
