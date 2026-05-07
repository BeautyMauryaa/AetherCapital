// const mongoose = require("mongoose");

// const AddressSchema = new mongoose.Schema(
//   {
//     street:   String,
//     city:     String,
//     state:    String,
//     zip:      String,
//     country:  String,
//     timezone: String,
//   },
//   { _id: false }
// );

// const DriveFileSchema = new mongoose.Schema(
//   {
//     fileId:       String,
//     viewLink:     String,
//     directLink:   String,
//     originalName: String,
//     mimeType:     String,
//     size:         Number,
//     uploadedAt:   { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const OnboardingSchema = new mongoose.Schema(
//   {
//     // Step 1
//     accountType: {
//       type: String,
//       enum: ["individual", "corporate", "enterprise"],
//       required: true,
//     },

//     // Step 2 — personal / org info
//     personal: {
//       firstName:          String,
//       lastName:           String,
//       email:              { type: String, required: true },
//       phone:              String,
//       dateOfBirth:        String,
//       nationality:        String,
//       // Corporate / enterprise
//       companyName:        String,
//       registrationNumber: String,
//       taxId:              String,
//       industry:           String,
//       employeeCount:      Number,
//     },

//     // Step 3
//     address: AddressSchema,

//     // Step 4
//     roles: {
//       selectedRole: String,
//       departments:  [String],
//       permissions:  mongoose.Schema.Types.Mixed,
//     },

//     // Step 5
//     compliance: {
//       answers:          mongoose.Schema.Types.Mixed,
//       riskScore:        Number,
//       twoFactorEnabled: Boolean,
//       operatingHours:   mongoose.Schema.Types.Mixed,
//     },

//     // Step 6
//     review: {
//       termsAccepted:   { type: Boolean, default: false },
//       termsAcceptedAt: Date,
//     },

//     // Google Drive file references
//     files: {
//       profileImage: DriveFileSchema,
//       signature:    DriveFileSchema,
//       documents:    [DriveFileSchema],
//     },

//     // Meta
//     status: {
//       type: String,
//       enum: ["draft", "submitted", "under_review", "approved", "rejected"],
//       default: "submitted",
//     },
//     submittedAt: { type: Date, default: Date.now },
//     ipAddress:   String,
//     userAgent:   String,
//   },
//   { timestamps: true }
// );

// OnboardingSchema.index({ "personal.email": 1 });

// module.exports = mongoose.model("OnboardingSubmission", OnboardingSchema);

import mongoose from "mongoose";

// ─── Reusable sub-schemas ─────────────────────────────────────────────────────

const DriveFileSchema = new mongoose.Schema(
  {
    fileId: String,         // Google Drive file ID
    fileName: String,
    webViewLink: String,    // Drive preview URL
    directUrl: String,      // Thumbnail URL for <img src>
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: false }
);

const OperatingHoursSchema = new mongoose.Schema(
  {
    day: String,
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Main Onboarding Schema ───────────────────────────────────────────────────
const OnboardingSchema = new mongoose.Schema(
  {
    // ── Step 1: Account Type ────────────────────────────────────────────────
    accountType: {
      type: String,
      enum: ["individual", "corporate", "enterprise"],
      required: true,
    },

    // ── Step 2: Personal / Business Info ───────────────────────────────────
    // Individual
    firstName: String,
    lastName: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: String,
    dateOfBirth: Date,
    nationality: String,
    profileImage: DriveFileSchema, // uploaded to Google Drive

    // Corporate / Enterprise
    companyName: String,
    registrationNumber: String,
    taxId: String,
    industry: String,
    companySize: String,
    website: String,
    companyLogo: DriveFileSchema,

    // ── Step 3: Address ─────────────────────────────────────────────────────
    address: AddressSchema,
    businessAddress: AddressSchema, // for corporate

    // ── Step 4: Roles & Departments ─────────────────────────────────────────
    roles: [String],
    departments: [String],
    permissions: mongoose.Schema.Types.Mixed, // flexible permission matrix object

    // ── Step 5: Compliance ──────────────────────────────────────────────────
    documents: [DriveFileSchema], // all KYC/compliance documents
    riskScore: Number,
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorMethod: String,

    // Questionnaire answers
    questionnaire: mongoose.Schema.Types.Mixed,

    // ── Step 6: Review & Signature ──────────────────────────────────────────
    signature: {
      dataUrl: String,     // base64 signature image
      signedAt: Date,
      ipAddress: String,
    },
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedAt: Date,

    // ── Operating Hours (if applicable) ─────────────────────────────────────
    operatingHours: [OperatingHoursSchema],

    // ── Meta ─────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
    submittedAt: Date,
    sessionId: String, // to track anonymous sessions before account creation
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Index for quick lookup
OnboardingSchema.index({ email: 1 });
OnboardingSchema.index({ sessionId: 1 });
OnboardingSchema.index({ status: 1 });

const Onboarding = mongoose.model("Onboarding", OnboardingSchema);

export default Onboarding;