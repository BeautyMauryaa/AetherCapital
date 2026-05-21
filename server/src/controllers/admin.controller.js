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
export const getAllSubmissions = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 50 } = req.query;

  const query = {};

  if (status && status !== "all") {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { firstName:   { $regex: search, $options: "i" } },
      { lastName:    { $regex: search, $options: "i" } },
      { email:       { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { legalName:   { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [submissions, total] = await Promise.all([
    Onboarding.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Onboarding.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      submissions: submissions.map(formatSubmission),
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    }, "Submissions fetched")
  );
});

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

// ─── PATCH /api/admin/submissions/:id/document-status ────────────────────────
export const updateDocumentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { documentType, status } = req.body;

  const allowedStatuses = ["pending", "verified", "rejected"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid document status string value sent");
  }

  const submission = await Onboarding.findById(id);
  if (!submission) {
    throw new ApiError(404, "Parent onboarding submission reference not found");
  }

  // Route updates dynamically by structural type tokens
  if (documentType.includes(".")) {
    // Array nested handling block (e.g. "documents.65ef49a...")
    const [arrayField, subDocId] = documentType.split(".");
    
    if (!submission[arrayField] || typeof submission[arrayField].id !== "function") {
      throw new ApiError(400, `Target field '${arrayField}' is not a valid subdocument array`);
    }

    // Locate matching embedded entry safely inside MongoDB array
    const targetSubDoc = submission[arrayField].id(subDocId);
    if (!targetSubDoc) {
      throw new ApiError(404, `Subdocument with database key ID [${subDocId}] not found`);
    }

    targetSubDoc.status = status;
    submission.markModified(arrayField);
  } else {
    // Direct root property update logic ("idFront", "idBack", "profileImage")
    if (!submission[documentType]) {
      throw new ApiError(400, `Field property schema space '${documentType}' is completely uninitialized`);
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
    new ApiResponse(200, submission, "Document validation status updated successfully")
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

// ─── GET /api/admin/documents ─────────────────────────────────────────────────
export const getAllDocuments = asyncHandler(async (req, res) => {
  const submissions = await Onboarding.find().lean();
  const docs = [];

  submissions.forEach((item) => {
    const applicant =
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      item.companyName ||
      "Unknown";

    // Instantiated tracking logic to clear dashboard duplicate components
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

        // Intercept duplicates caught inside array fallbacks
        if (
          (u && processedUrls.has(u.toLowerCase())) ||
          titleLower.includes("front") ||
          titleLower.includes("back")
        ) {
          return;
        }

        docs.push({
          submissionId: item._id,
          // Bind directly to database _id token to eliminate mutation array position lag
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
    new ApiResponse(200, docs, "Documents fetched without errors or duplicates")
  );
});
