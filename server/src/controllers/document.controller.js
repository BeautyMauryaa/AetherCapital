import Onboarding from "../models/onboarding.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── GET /api/admin/documents ─────────────────────────────────────────────────
export const getAllDocuments = asyncHandler(async (req, res) => {
  const submissions = await Onboarding.find().lean();
  const docs = [];

  submissions.forEach((item) => {
    const applicant =
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      item.companyName ||
      "Unknown";

    // Track processed files by their Google Drive directUrl / webViewLink to prevent duplications
    const processedUrls = new Set();
    const trackUrl = (driveFileObj) => {
      if (!driveFileObj) return;
      const url = driveFileObj.directUrl || driveFileObj.webViewLink;
      if (url) processedUrls.add(url.toLowerCase());
    };

    // Populate tracking set with known explicitly defined root-level assets
    if (item.idFront?.file)   trackUrl(item.idFront.file);
    if (item.idBack?.file)    trackUrl(item.idBack.file);
    if (item.profileImage?.file) trackUrl(item.profileImage.file);

    // 1. ID FRONT
    if (item.idFront && item.idFront.file) {
      docs.push({
        submissionId: item._id,
        documentType: "idFront",
        type: "ID Front",
        applicant,
        status: item.idFront.status || "pending",
        file: item.idFront.file, 
      });
    }

    // 2. ID BACK
    if (item.idBack && item.idBack.file) {
      docs.push({
        submissionId: item._id,
        documentType: "idBack",
        type: "ID Back",
        applicant,
        status: item.idBack.status || "pending",
        file: item.idBack.file, 
      });
    }

    // 3. PROFILE IMAGE (Reflects your clean updated schema structure)
    if (item.profileImage && item.profileImage.file) {
      docs.push({
        submissionId: item._id,
        documentType: "profileImage",
        type: "Profile Image",
        applicant,
        status: item.profileImage.status || "pending", 
        file: item.profileImage.file, 
      });
    }

    // 4. EXTRA DOCUMENTS (Deduplicated cleanly by structural URL verification)
    if (item.documents?.length > 0) {
      item.documents.forEach((doc, index) => {
        if (!doc.file) return;

        const docUrl = doc.file.directUrl || doc.file.webViewLink;

        // Strict URL deduplication boundary check
        if (docUrl && processedUrls.has(docUrl.toLowerCase())) {
          return;
        }

        docs.push({
          submissionId: item._id,
          // Binds explicitly to the array index layout position for zero dependency on _id fields
          documentType: `documents.${index}`,
          type: doc.type || "Supporting Document",
          applicant,
          status: doc.status || "pending",
          file: doc.file,
        });

        // Add to tracking pool so downstream elements can't repeat it
        if (docUrl) {
          processedUrls.add(docUrl.toLowerCase());
        }
      });
    }
  });

  return res.status(200).json(
    new ApiResponse(200, docs, "Documents matrix fetched successfully")
  );
});

// ─── PATCH /api/admin/submissions/:id/document-status ────────────────────────
export const updateDocumentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { documentType, status } = req.body;

  const allowedStatuses = ["pending", "verified", "rejected"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status. Use: pending, verified, or rejected");
  }

  const submission = await Onboarding.findById(id);
  if (!submission) {
    throw new ApiError(404, "Target onboarding entry reference not found");
  }

  // Handle embedded nested document selection arrays ("documents.0")
  if (documentType.includes(".")) {
    const [arrayField, arrayIndexStr] = documentType.split(".");
    const index = parseInt(arrayIndexStr, 10);

    if (!Array.isArray(submission[arrayField])) {
      throw new ApiError(400, `Schema property '${arrayField}' is not an accessible subdocument array`);
    }

    // Safe retrieval using the array index instead of the missing database _id lookup function
    const targetSubDoc = submission[arrayField][index];
    if (!targetSubDoc) {
      throw new ApiError(404, `Document item at index position [${index}] was not found`);
    }

    targetSubDoc.status = status;
    submission.markModified(arrayField);
  } else {
    // Handle root structural assets ("idFront", "idBack", "profileImage")
    if (!submission[documentType] || !submission[documentType].file) {
      throw new ApiError(400, `The target asset field '${documentType}' is uninitialized or missing structure`);
    }

    // Safely sets status fields universally across your root documents
    submission[documentType].status = status;
    submission.markModified(documentType);
  }

  await submission.save();

  return res.status(200).json(
    new ApiResponse(200, submission, "Document validation status updated successfully")
  );
});
