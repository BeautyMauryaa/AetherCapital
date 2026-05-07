// const mongoose = require("mongoose");

// /**
//  * FormDraft — stores partial form progress per session/email.
//  * This lets users resume the onboarding form if they close the browser.
//  */
// const FormDraftSchema = new mongoose.Schema(
//   {
//     // Identify the draft by email or a session token
//     email:       { type: String, required: true, unique: true },
//     currentStep: { type: Number, default: 1 },

//     // Store each step's data as flexible mixed objects
//     stepData: {
//       step1: mongoose.Schema.Types.Mixed,
//       step2: mongoose.Schema.Types.Mixed,
//       step3: mongoose.Schema.Types.Mixed,
//       step4: mongoose.Schema.Types.Mixed,
//       step5: mongoose.Schema.Types.Mixed,
//       step6: mongoose.Schema.Types.Mixed,
//     },

//     // Uploaded file references collected during the form
//     uploadedFiles: {
//       profileImage: {
//         fileId:     String,
//         url:        String,
//         viewLink:   String,
//         uploadedAt: Date,
//       },
//       signature: {
//         fileId:     String,
//         url:        String,
//         viewLink:   String,
//         uploadedAt: Date,
//       },
//       documents: [
//         {
//           fileId:       String,
//           url:          String,
//           viewLink:     String,
//           originalName: String,
//           mimeType:     String,
//           size:         Number,
//           uploadedAt:   Date,
//         },
//       ],
//     },

//     expiresAt: {
//       type: Date,
//       // Auto-delete draft after 7 days of inactivity
//       default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     },
//   },
//   { timestamps: true }
// );

// // TTL index — MongoDB auto-removes expired drafts
// FormDraftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// module.exports = mongoose.model("FormDraft", FormDraftSchema);


import mongoose from "mongoose";

// General contact or inquiry form submissions
const FormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    formType: {
      type: String,
      enum: ["contact", "inquiry", "support", "other"],
      default: "contact",
    },
    attachments: [
      {
        fileId: String,
        fileName: String,
        webViewLink: String,
        directUrl: String,
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
    ipAddress: String,
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", FormSchema);
export default Form;