// const asyncHandler = require("../utils/asyncHandler");
// const ApiError = require("../utils/ApiError");
// const ApiResponse = require("../utils/ApiResponse");
// const OnboardingSubmission = require("../models/Onboarding.model");
// const { deleteFormDraft } = require("../services/form.service");

// // POST /api/onboarding/submit
// const submitOnboarding = asyncHandler(async (req, res) => {
//   const { accountType, personal, address, roles, compliance, review, files } =
//     req.body;

//   if (!accountType || !personal?.email) {
//     throw new ApiError(400, "accountType and personal.email are required");
//   }

//   // Prevent duplicate submissions
//   const existing = await OnboardingSubmission.findOne({
//     "personal.email": personal.email,
//     status: { $in: ["submitted", "under_review", "approved"] },
//   });
//   if (existing) {
//     throw new ApiError(409, "A submission already exists for this email");
//   }

//   const submission = await OnboardingSubmission.create({
//     accountType,
//     personal,
//     address,
//     roles,
//     compliance,
//     review: {
//       ...review,
//       termsAcceptedAt: review?.termsAccepted ? new Date() : undefined,
//     },
//     files,
//     ipAddress: req.ip,
//     userAgent: req.get("User-Agent"),
//   });

//   // Clean up the draft now that submission is complete
//   await deleteFormDraft(personal.email);

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(201, { submissionId: submission._id }, "Onboarding submitted successfully")
//     );
// });

// // GET /api/onboarding/status/:submissionId
// const getSubmissionStatus = asyncHandler(async (req, res) => {
//   const submission = await OnboardingSubmission.findById(
//     req.params.submissionId,
//     "status submittedAt accountType personal.firstName personal.lastName personal.email createdAt"
//   );

//   if (!submission) throw new ApiError(404, "Submission not found");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, { submission }, "Status fetched"));
// });

// module.exports = { submitOnboarding, getSubmissionStatus };


import Onboarding from "../models/onboarding.model.js";
import { uploadFileToDrive } from "../services/googledrive.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Create new onboarding session (Step 1) ───────────────────────────────────
// POST /api/onboarding/start
export const startOnboarding = asyncHandler(async (req, res) => {
  const { accountType, sessionId } = req.body;

  if (!accountType) {
    throw new ApiError(400, "Account type is required");
  }

  // Check if session already exists (user refreshed page)
  if (sessionId) {
    const existing = await Onboarding.findOne({ sessionId });
    if (existing) {
      return res.status(200).json(
        new ApiResponse(200, existing, "Existing session resumed")
      );
    }
  }

  const onboarding = await Onboarding.create({
    accountType,
    sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    currentStep: 1,
    status: "draft",
  });

  return res.status(201).json(
    new ApiResponse(201, onboarding, "Onboarding started")
  );
});

// ─── Save Step 2: Personal / Business Info ────────────────────────────────────
// PUT /api/onboarding/:id/step2
// Supports multipart/form-data for profile image / company logo
export const saveStep2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const onboarding = await findOnboarding(id);

  const updateData = { ...req.body, currentStep: Math.max(onboarding.currentStep, 2) };

  // Handle profile image upload if included
  if (req.files?.profileImage?.[0]) {
    const file = req.files.profileImage[0];
    const driveResult = await uploadFileToDrive(
      file.buffer,
      file.originalname,
      file.mimetype,
      "profile-images"
    );
    updateData.profileImage = { ...driveResult, mimeType: file.mimetype };
  }

  // Handle company logo upload if included
  if (req.files?.companyLogo?.[0]) {
    const file = req.files.companyLogo[0];
    const driveResult = await uploadFileToDrive(
      file.buffer,
      file.originalname,
      file.mimetype,
      "logos"
    );
    updateData.companyLogo = { ...driveResult, mimeType: file.mimetype };
  }

  const updated = await Onboarding.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: false,
  });

  return res.status(200).json(new ApiResponse(200, updated, "Step 2 saved"));
});

// ─── Save Step 3: Address ─────────────────────────────────────────────────────
// PUT /api/onboarding/:id/step3
export const saveStep3 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const onboarding = await findOnboarding(id);

  const { address, businessAddress, timezone } = req.body;

  const updated = await Onboarding.findByIdAndUpdate(
    id,
    {
      address: address ? JSON.parse(address) : undefined,
      businessAddress: businessAddress ? JSON.parse(businessAddress) : undefined,
      "address.timezone": timezone,
      currentStep: Math.max(onboarding.currentStep, 3),
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, updated, "Step 3 saved"));
});

// ─── Save Step 4: Roles & Departments ────────────────────────────────────────
// PUT /api/onboarding/:id/step4
export const saveStep4 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const onboarding = await findOnboarding(id);

  const { roles, departments, permissions } = req.body;

  const updated = await Onboarding.findByIdAndUpdate(
    id,
    {
      roles: roles ? JSON.parse(roles) : onboarding.roles,
      departments: departments ? JSON.parse(departments) : onboarding.departments,
      permissions: permissions ? JSON.parse(permissions) : onboarding.permissions,
      currentStep: Math.max(onboarding.currentStep, 4),
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, updated, "Step 4 saved"));
});

// ─── Save Step 5: Compliance + Document Uploads ───────────────────────────────
// PUT /api/onboarding/:id/step5
// Supports multipart/form-data for KYC documents
export const saveStep5 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const onboarding = await findOnboarding(id);

  const updateData = {
    currentStep: Math.max(onboarding.currentStep, 5),
  };

  // Parse non-file fields
  if (req.body.riskScore) updateData.riskScore = Number(req.body.riskScore);
  if (req.body.riskLevel) updateData.riskLevel = req.body.riskLevel;
  if (req.body.twoFactorEnabled !== undefined)
    updateData.twoFactorEnabled = req.body.twoFactorEnabled === "true";
  if (req.body.twoFactorMethod) updateData.twoFactorMethod = req.body.twoFactorMethod;
  if (req.body.questionnaire) updateData.questionnaire = JSON.parse(req.body.questionnaire);

  // Handle compliance documents (array of files)
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadFileToDrive(file.buffer, file.originalname, file.mimetype, "compliance-docs")
    );
    const uploadedDocs = await Promise.all(uploadPromises);
    const formattedDocs = uploadedDocs.map((doc, i) => ({
      ...doc,
      mimeType: req.files[i].mimetype,
    }));

    // Append to existing documents
    updateData.$push = { documents: { $each: formattedDocs } };
  }

  const updated = await Onboarding.findByIdAndUpdate(id, updateData, { new: true });

  return res.status(200).json(new ApiResponse(200, updated, "Step 5 saved"));
});

// ─── Save Step 6: Review + Signature + Final Submit ──────────────────────────
// PUT /api/onboarding/:id/step6
export const saveStep6AndSubmit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const onboarding = await findOnboarding(id);

  const { signatureDataUrl, termsAccepted } = req.body;

  if (!termsAccepted || termsAccepted === "false") {
    throw new ApiError(400, "Terms must be accepted to submit");
  }

  if (!signatureDataUrl) {
    throw new ApiError(400, "Signature is required");
  }

  const updated = await Onboarding.findByIdAndUpdate(
    id,
    {
      signature: {
        dataUrl: signatureDataUrl,
        signedAt: new Date(),
        ipAddress: req.ip,
      },
      termsAccepted: true,
      termsAcceptedAt: new Date(),
      status: "submitted",
      submittedAt: new Date(),
      currentStep: 6,
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updated, "Onboarding submitted successfully! 🎉")
  );
});

// ─── Get onboarding by ID (for resume / review) ───────────────────────────────
// GET /api/onboarding/:id
export const getOnboarding = asyncHandler(async (req, res) => {
  const onboarding = await findOnboarding(req.params.id);
  return res.status(200).json(new ApiResponse(200, onboarding, "Fetched successfully"));
});

// ─── Get all submissions (admin) ─────────────────────────────────────────────
// GET /api/onboarding
export const getAllOnboardings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = status ? { status } : {};

  const total = await Onboarding.countDocuments(filter);
  const data = await Onboarding.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(200, { data, total, page: Number(page), limit: Number(limit) })
  );
});

// ─── Helper: find or throw ────────────────────────────────────────────────────
const findOnboarding = async (id) => {
  const doc = await Onboarding.findById(id);
  if (!doc) throw new ApiError(404, "Onboarding record not found");
  return doc;
};