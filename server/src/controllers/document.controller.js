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

    // Populate tracking set with known explicitly defined assets
    if (item.idFront?.file) trackUrl(item.idFront.file);
    if (item.idBack?.file)  trackUrl(item.idBack.file);
    if (item.profileImage)  trackUrl(item.profileImage);

    // 1. ID FRONT
    if (item.idFront && item.idFront.file) {
      docs.push({
        submissionId: item._id,
        documentType: "idFront",
        type: "ID Front",
        applicant,
        status: item.idFront.status || "pending",
        file: item.idFront.file, // Passes the deep DriveFileSchema object
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
        file: item.idBack.file, // Passes the deep DriveFileSchema object
      });
    }

    // 3. PROFILE IMAGE (Note: Has no status property in your schema definition)
    if (item.profileImage && item.profileImage.webViewLink) {
      docs.push({
        submissionId: item._id,
        documentType: "profileImage",
        type: "Profile Image",
        applicant,
        status: "verified", // Hardcoded fallback since profile images don't hold verification states in schema
        file: item.profileImage, // Passes the raw DriveFileSchema object
      });
    }

    // 4. EXTRA DOCUMENTS (Deduplicated using internal MongoDB array _id)
    if (item.documents?.length > 0) {
      item.documents.forEach((doc) => {
        if (!doc.file) return;

        const docUrl = doc.file.directUrl || doc.file.webViewLink;
        const titleLower = doc.type?.toLowerCase() || "";

        // Deduplication boundary check: block duplicate step-file uploads
       if (
  titleLower.includes("front") ||
  titleLower.includes("back") ||
  titleLower.includes("profile")
) {
  return;
}

        docs.push({
          submissionId: item._id,
          // Binds to the actual nested item _id created inside your documents schema array
          documentType: `documents.${doc._id}`,
          type: doc.type || "Supporting Document",
          applicant,
          status: doc.status || "pending",
          file: doc.file,
        });
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

  // Handle embedded nested document selection arrays ("documents.65ef49a...")
  if (documentType.includes(".")) {
    const [arrayField, subDocId] = documentType.split(".");

    if (!submission[arrayField] || typeof submission[arrayField].id !== "function") {
      throw new ApiError(400, `Schema property '${arrayField}' is not an accessible subdocument array`);
    }

    const targetSubDoc = submission[arrayField].id(subDocId);
    if (!targetSubDoc) {
      throw new ApiError(404, `Document item with database ID [${subDocId}] was not found`);
    }

    targetSubDoc.status = status;
    submission.markModified(arrayField);
  } else {
    // Handle root schema structural positions directly ("idFront", "idBack", "profileImage")
    if (documentType === "profileImage") {
      throw new ApiError(400, "Profile Image does not contain a status property inside your database schema");
    }

    if (!submission[documentType]) {
      throw new ApiError(400, `The target asset field '${documentType}' is uninitialized or missing structure`);
    }

    // Safely sets status on idFront or idBack directly alongside their file object
    submission[documentType].status = status;
    submission.markModified(documentType);
  }

  await submission.save();

  return res.status(200).json(
    new ApiResponse(200, submission, "Document validation status updated successfully")
  );
});
