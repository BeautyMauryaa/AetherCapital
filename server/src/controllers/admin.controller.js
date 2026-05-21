import Onboarding from "../models/onboarding.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Helper: format submission for admin panel ────────────────────────────────
const formatSubmission = (item) => ({
  _id: item._id,

  // Basic
  firstName: item.firstName || item.companyName || item.legalName || "Unknown",
  middleName: item.middleName || "",
  lastName: item.lastName || "",
  email: item.email || "No Email",

  // Account
  accountType: item.accountType || "individual",
  status: item.status || "submitted",

  // Risk
  riskScore: item.riskScore || 0,
  riskLevel: item.riskLevel || "low",

  // Dates
  submittedAt: item.submittedAt || item.createdAt,
  createdAt: item.createdAt,
  reviewedAt: item.reviewedAt || null,

  // Personal
  gender: item.gender || "",
  nationality: item.nationality || "",
  dateOfBirth: item.dateOfBirth || null,

  // Address
  address: item.address || {},
  mailingAddress: item.mailingAddress || {},
  sameAsPrimary: item.sameAsPrimary,

  // Security
  roles: item.roles || [],
  departments: item.departments || [],
  permissions: item.permissions || {},
  twoFactorEnabled: item.twoFactorEnabled || false,
  twoFactorMethod: item.twoFactorMethod || "",

  // Compliance
  questionnaire: item.questionnaire || [],

  // Files
  profileImage: item.profileImage || null,
  idFront: item.idFront || null,
  idBack: item.idBack || null,
  documents: item.documents || [],
  signature: item.signature || null,

  // Notes
  reviewNote: item.reviewNote || "",
});

// ─── GET /api/admin/submissions ───────────────────────────────────────────────

// export const updateDocumentStatus = asyncHandler(async (req, res) => {
//   const { documentType, status } = req.body;

//   const allowedStatuses = ["pending", "verified", "rejected"];
//   if (!allowedStatuses.includes(status)) {
//     throw new ApiError(400, "Invalid document status");
//   }

//   const submission = await Onboarding.findById(req.params.id);
//   if (!submission) {
//     throw new ApiError(404, "Submission not found");
//   }

//   // 1. Map frontend UI string labels back to actual database schema properties
//   let schemaKey = null;
//   const normalizedType = documentType?.toLowerCase() || "";

//   if (normalizedType.includes("front")) {
//     schemaKey = "idFront";
//   } else if (normalizedType.includes("back")) {
//     schemaKey = "idBack";
//   }

//   // 2. Handle sub-documents if it lives inside an array (e.g., item.documents)
//   if (!schemaKey) {
//     // If it's a supporting document inside your array, update it there
//     const docIndex = submission.documents?.findIndex(
//       (d) => d.type?.toLowerCase() === normalizedType || d.name?.toLowerCase() === normalizedType
//     );

//     if (docIndex !== -1 && docIndex !== undefined) {
//       submission.documents[docIndex].status = status;
//     } else {
//       throw new ApiError(400, `Document structure match not found for: ${documentType}`);
//     }
//   } else {
//     // 3. Ensure the root document field object actually exists before setting status
//     if (!submission[schemaKey]) {
//       throw new ApiError(400, `Schema property '${schemaKey}' is uninitialized or missing data`);
//     }
    
//     submission[schemaKey].status = status;
//   }

//   // Mark modified explicitly if updating deeply nested mixed properties
//   submission.markModified("idFront");
//   submission.markModified("idBack");
//   submission.markModified("documents");

//   await submission.save();

//   return res.status(200).json(
//     new ApiResponse(200, submission, "Document status updated successfully")
//   );
// });

// ─── GET /api/admin/submissions/:id ──────────────────────────────────────────
export const getSubmission = asyncHandler(async (req, res) => {
  const doc = await Onboarding.findById(req.params.id).lean();

  if (!doc) {
    throw new ApiError(404, "Submission not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { submission: doc },
      "Submission fetched"
    )
  );
});

export const updateDocumentStatus = asyncHandler(async (req, res) => {

  const { documentType, status } = req.body;

  const allowedStatuses = [
    "pending",
    "verified",
    "rejected",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid document status"
    );
  }

  const submission = await Onboarding.findById(req.params.id);

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  if (!submission[documentType]) {
    throw new ApiError(400, "Document not found");
  }

  submission[documentType].status = status;

  await submission.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      submission,
      "Document status updated"
    )
  );

});

// ─── PATCH /api/admin/submissions/:id/status ─────────────────────────────────
export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const allowed = ["submitted", "under_review", "approved", "rejected"];
  if (!allowed.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${allowed.join(", ")}`);
  }

  const doc = await Onboarding.findByIdAndUpdate(
    id,
    {
      status,
      reviewNote:  note  || "",
      reviewedAt:  new Date(),
    },
    { new: true, runValidators: true }
  ).lean();

  if (!doc) throw new ApiError(404, "Submission not found");

  return res.status(200).json(
    new ApiResponse(200, { submission: formatSubmission(doc) }, `Status updated to ${status}`)
  );
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const [
    total,
    pending,
    underReview,
    approved,
    rejected,
    highRisk,
    // Recent 7 days
    recentDocs,
  ] = await Promise.all([
    Onboarding.countDocuments({}),
    Onboarding.countDocuments({ status: "submitted" }),
    Onboarding.countDocuments({ status: "under_review" }),
    Onboarding.countDocuments({ status: "approved" }),
    Onboarding.countDocuments({ status: "rejected" }),
    Onboarding.countDocuments({ riskScore: { $gte: 60 } }),
    Onboarding.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
      .select("createdAt status riskScore accountType")
      .lean(),
  ]);


  
  // Daily breakdown for chart (last 7 days)
  const dailyMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = 0;
  }
  recentDocs.forEach((doc) => {
    const key = new Date(doc.createdAt).toISOString().slice(0, 10);
    if (dailyMap[key] !== undefined) dailyMap[key]++;
  });

  const chartData = Object.entries(dailyMap).map(([day, submissions]) => ({
    day,
    submissions,
  }));

  // Account type breakdown
  const typeCounts = await Onboarding.aggregate([
    { $group: { _id: "$accountType", count: { $sum: 1 } } },
  ]);
  const byType = { individual: 0, business: 0, enterprise: 0 };
  typeCounts.forEach(({ _id, count }) => {
    if (_id && byType[_id] !== undefined) byType[_id] = count;
  });

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      pending,
      underReview,
      approved,
      rejected,
      highRisk,
      chartData,
      byType,
    }, "Stats fetched")
  );
});

export const getAllDocuments = asyncHandler(async (req, res) => {
  const onboardings = await Onboarding.find().lean();
  const documents = [];

  onboardings.forEach((item) => {
    if (item.idFront) {
      documents.push({
        submissionId: item._id,
        type: "Government ID Front",
        applicant: `${item.firstName || ""} ${item.lastName || ""}`,
        status: item.idFront.status || "pending", // <--- Fixed: Individual doc status
        file: item.idFront,
      });
    }

    if (item.idBack) {
      documents.push({
        submissionId: item._id,
        type: "Government ID Back",
        applicant: `${item.firstName || ""} ${item.lastName || ""}`,
        status: item.idBack.status || "pending", // <--- Fixed: Individual doc status
        file: item.idBack,
      });
    }

    if (item.documents?.length > 0) {
      item.documents.forEach((doc) => {
        documents.push({
          submissionId: item._id,
          type: doc.type || "Supporting Document",
          applicant: `${item.firstName || ""} ${item.lastName || ""}`,
          status: doc.status || "pending", // <--- Fixed: Nested item status
          file: doc,
        });
      });
    }
  });

  return res.status(200).json(
    new ApiResponse(200, documents, "Documents fetched")
  );
});


