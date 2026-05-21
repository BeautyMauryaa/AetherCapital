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

    // Track processed file URLs to prevent dashboard layout duplication
    const processedUrls = new Set();
    const getUrl = (val) => {
      if (!val) return null;
      return typeof val === "string" ? val : val.file || val.url;
    };

    // 1. ID FRONT
    if (item.idFront) {
      const u = getUrl(item.idFront);
      if (u) processedUrls.add(u.toLowerCase());

      docs.push({
        submissionId: item._id,
        documentType: "idFront",
        type: "ID Front",
        applicant,
        status: item.idFront?.status || "pending",
        file: item.idFront?.file || item.idFront,
      });
    }

    // 2. ID BACK
    if (item.idBack) {
      const u = getUrl(item.idBack);
      if (u) processedUrls.add(u.toLowerCase());

      docs.push({
        submissionId: item._id,
        documentType: "idBack",
        type: "ID Back",
        applicant,
        status: item.idBack?.status || "pending",
        file: item.idBack?.file || item.idBack,
      });
    }

    // 3. PROFILE IMAGE
    if (item.profileImage) {
      const u = getUrl(item.profileImage);
      if (u) processedUrls.add(u.toLowerCase());

      docs.push({
        submissionId: item._id,
        documentType: "profileImage",
        type: "Profile Image",
        applicant,
        status: item.profileImage?.status || "pending",
        file: item.profileImage?.file || item.profileImage,
      });
    }

    // 4. EXTRA DOCUMENTS (Deduplicated safely using Database ID tokens)
    if (item.documents?.length > 0) {
      item.documents.forEach((doc) => {
        const u = getUrl(doc);
        const titleLower = doc.type?.toLowerCase() || "";

        // Intercept duplicates caught inside general array fallbacks
        if (
          (u && processedUrls.has(u.toLowerCase())) ||
          titleLower.includes("front") ||
          titleLower.includes("back")
        ) {
          return;
        }

        docs.push({
          submissionId: item._id,
          // Bind directly to structural DB ID token to prevent index shifting bugs
          documentType: `documents.${doc._id || doc.id}`,
          type: doc.type || "Document",
          applicant,
          status: doc.status || "pending",
          file: doc.file || doc,
        });
      });
    }
  });

  return res.status(200).json(
    new ApiResponse(200, docs, "Documents fetched cleanly without duplication")
  );
});

// ─── PATCH /api/admin/submissions/:id/document-status ────────────────────────
export const updateDocumentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { documentType, status } = req.body;

  const allowedStatuses = ["pending", "verified", "rejected"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid document verification status value");
  }

  const submission = await Onboarding.findById(id);
  if (!submission) {
    throw new ApiError(404, "Target onboarding entry reference not found");
  }

  // Handle nested sub-document array routing via true DB strings (e.g. "documents.65ef49a...")
  if (documentType.includes(".")) {
    const [arrayField, subDocId] = documentType.split(".");
    
    if (!submission[arrayField] || typeof submission[arrayField].id !== "function") {
      throw new ApiError(400, `Target field '${arrayField}' is not a valid subdocument array`);
    }

    // Extract exact embedded schema row cleanly using Mongoose .id() method
    const targetSubDoc = submission[arrayField].id(subDocId);
    if (!targetSubDoc) {
      throw new ApiError(404, `Subdocument item with matching key ID [${subDocId}] not found`);
    }

    targetSubDoc.status = status;
    submission.markModified(arrayField);
  } else {
    // Handle root top-level fields ("idFront", "idBack", "profileImage")
    if (!submission[documentType]) {
      throw new ApiError(400, `Field property space '${documentType}' is uninitialized or empty`);
    }

    if (typeof submission[documentType] === "object") {
      submission[documentType].status = status;
    } else {
      submission[documentType] = { file: submission[documentType], status };
    }
    submission.markModified(documentType);
  }

  await submission.save();

  return res.status(200).json(
    new ApiResponse(200, submission, "Document status tracked and modified successfully")
  );
});
