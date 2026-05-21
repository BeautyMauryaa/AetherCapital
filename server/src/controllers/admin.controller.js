import Onboarding from "../models/onboarding.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Helper: format submission for admin panel ────────────────────────────────
const formatSubmission = (item) => ({
  _id: item._id,
  firstName: item.firstName || item.companyName || item.legalName || "Unknown",
  middleName: item.middleName || "",
  lastName: item.lastName || "",
  email: item.email || "No Email",
  accountType: item.accountType || "individual",
  status: item.status || "submitted",
  riskScore: item.riskScore || 0,
  riskLevel: item.riskLevel || "low",
  submittedAt: item.submittedAt || item.createdAt,
  createdAt: item.createdAt,
  reviewedAt: item.reviewedAt || null,
  gender: item.gender || "",
  nationality: item.nationality || "",
  dateOfBirth: item.dateOfBirth || null,
  address: item.address || {},
  mailingAddress: item.mailingAddress || {},
  sameAsPrimary: item.sameAsPrimary,
  roles: item.roles || [],
  departments: item.departments || [],
  permissions: item.permissions || {},
  twoFactorEnabled: item.twoFactorEnabled || false,
  twoFactorMethod: item.twoFactorMethod || "",
  questionnaire: item.questionnaire || [],
  profileImage: item.profileImage || null,
  idFront: item.idFront || null,
  idBack: item.idBack || null,
  documents: item.documents || [],
  signature: item.signature || null,
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
    new ApiResponse(200, { submission: doc }, "Submission fetched")
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
