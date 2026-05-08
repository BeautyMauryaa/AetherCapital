import Onboarding from "../models/onboarding.model.js";
import { uploadFileToDrive } from "../services/googledrive.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Helper: upload base64 string to Drive ────────────────────────────────────
const uploadBase64ToDrive = async (base64String, fileName, mimeType, folder) => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  return uploadFileToDrive(buffer, fileName, mimeType, folder);
};

export const submitOnboarding = asyncHandler(async (req, res) => {

  // Parse text form data
  const raw = req.body.formData ? JSON.parse(req.body.formData) : req.body;

  const {
    // Step 1
    accountType,
    // Step 2
    firstName, middleName, lastName,
    dobDay, dobMonth, dobYear,
    gender, nationality,
    // Step 3
    country, address1, address2, city, state, zip,
    sameAsPrimary, mailAddress1, mailCity, mailState, mailPostal, timezone,
    // Step 4
    roles, departments, permissions, twoFA, tfaMethod,
    // Step 5 (questionnaire answers saved as-is)
    questionnaire, riskScore, riskLevel,
    // Step 6
    signatureData, agreedToTerms,
  } = raw;

  // ── Upload files to Google Drive ──────────────────────────────────────────
  const driveUploads = {};

  // Profile image
  if (req.files?.profileImage?.[0]) {
    const f = req.files.profileImage[0];
    driveUploads.profileImage = await uploadFileToDrive(
      f.buffer, f.originalname, f.mimetype, "profile-images"
    );
  }

  // ID Front
  if (req.files?.idFront?.[0]) {
    const f = req.files.idFront[0];
    driveUploads.idFront = await uploadFileToDrive(
      f.buffer, f.originalname, f.mimetype, "identity-docs"
    );
  }

  // ID Back
  if (req.files?.idBack?.[0]) {
    const f = req.files.idBack[0];
    driveUploads.idBack = await uploadFileToDrive(
      f.buffer, f.originalname, f.mimetype, "identity-docs"
    );
  }

  // Compliance documents
  if (req.files?.documents?.length > 0) {
    const docUploads = await Promise.all(
      req.files.documents.map((f) =>
        uploadFileToDrive(f.buffer, f.originalname, f.mimetype, "compliance-docs")
      )
    );
    driveUploads.documents = docUploads;
  }

  // Signature — comes as base64 string, convert to PNG and upload to Drive
  if (signatureData) {
    driveUploads.signature = await uploadBase64ToDrive(
      signatureData,
      `signature_${Date.now()}.png`,
      "image/png",
      "signatures"
    );
  }

  // ── Save everything to MongoDB ────────────────────────────────────────────
  const onboarding = await Onboarding.create({
    // Step 1
    accountType,

    // Step 2
    firstName, middleName, lastName,
    dateOfBirth: dobDay && dobMonth && dobYear
      ? new Date(`${dobYear}-${dobMonth}-${dobDay}`)
      : undefined,
    gender, nationality,

    // Step 3
    address: { street: address1, street2: address2, city, state, postalCode: zip, country, timezone },
    sameAsPrimary,
    mailingAddress: !sameAsPrimary
      ? { street: mailAddress1, city: mailCity, state: mailState, postalCode: mailPostal }
      : undefined,

    // Step 4
    roles: typeof roles === "string" ? JSON.parse(roles) : roles,
    departments: typeof departments === "string" ? JSON.parse(departments) : departments,
    permissions: typeof permissions === "string" ? JSON.parse(permissions) : permissions,
    twoFactorEnabled: twoFA === "true" || twoFA === true,
    twoFactorMethod: tfaMethod,

    // Step 5
    questionnaire: typeof questionnaire === "string" ? JSON.parse(questionnaire) : questionnaire,
    riskScore: riskScore ? Number(riskScore) : undefined,
    riskLevel,

    // Step 6
    termsAccepted: agreedToTerms === "true" || agreedToTerms === true,
    termsAcceptedAt: new Date(),
    submittedAt: new Date(),
    status: "submitted",

    // Drive file references
    profileImage: driveUploads.profileImage,
    idFront: driveUploads.idFront,
    idBack: driveUploads.idBack,
    documents: driveUploads.documents || [],
    signature: driveUploads.signature
      ? { driveFile: driveUploads.signature, signedAt: new Date() }
      : undefined,
  });

  return res.status(201).json(
    new ApiResponse(201, { id: onboarding._id }, "Application submitted successfully! 🎉")
  );
});

// ─── Get single onboarding (admin) ───────────────────────────────────────────
// GET /api/onboarding/:id
export const getOnboarding = asyncHandler(async (req, res) => {
  const doc = await Onboarding.findById(req.params.id);
  if (!doc) throw new ApiError(404, "Not found");
  return res.status(200).json(new ApiResponse(200, doc));
});

// ─── Get all onboardings (admin) ─────────────────────────────────────────────
// GET /api/onboarding
export const getAllOnboardings = asyncHandler(async (req, res) => {
  const docs = await Onboarding.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, docs));
});