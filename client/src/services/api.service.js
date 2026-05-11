// src/services/api.service.js
// ─────────────────────────────────────────────────────────────────────────────
// Drop this file into your frontend src/services/ folder.
// All backend calls go through here — change BASE_URL once, everything updates.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Generic fetch wrapper ────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    
    headers: {
      // Don't set Content-Type for FormData — browser sets it with boundary
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING API
// ─────────────────────────────────────────────────────────────────────────────

// Step 1: Start onboarding → returns { _id, sessionId, ... }
export const startOnboarding = async (accountType) => {
  // Reuse existing session if available
  const sessionId = localStorage.getItem("onboarding_session_id");
  return request("/onboarding/start", {
    method: "POST",
    body: JSON.stringify({ accountType, sessionId }),
  });
};

// Step 2: Personal/Business info + optional image
// personalData = { firstName, lastName, email, ... }
// imageFile = File | null (from <input type="file">)
export const saveStep2 = async (onboardingId, personalData, imageFile = null) => {
  const formData = new FormData();

  // Append all text fields
  Object.entries(personalData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  // Append image if provided
  if (imageFile) {
    formData.append("profileImage", imageFile); // or "companyLogo" for corporate
  }

  return request(`/onboarding/${onboardingId}/step2`, {
    method: "PUT",
    body: formData,
  });
};

// Step 3: Address
export const saveStep3 = async (onboardingId, addressData) => {
  return request(`/onboarding/${onboardingId}/step3`, {
    method: "PUT",
    body: JSON.stringify({
      address: addressData.address,
      businessAddress: addressData.businessAddress,
    }),
  });
};

// Step 4: Roles & Departments
export const saveStep4 = async (onboardingId, rolesData) => {
  return request(`/onboarding/${onboardingId}/step4`, {
    method: "PUT",
    body: JSON.stringify(rolesData),
  });
};

// Step 5: Compliance + document uploads
// complianceData = { riskScore, twoFactorEnabled, questionnaire, ... }
// documentFiles = File[] (from <input type="file" multiple>)
export const saveStep5 = async (onboardingId, complianceData, documentFiles = []) => {
  const formData = new FormData();

  // Append compliance text fields
  Object.entries(complianceData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    }
  });

  // Append each document file
  documentFiles.forEach((file) => {
    formData.append("files", file); // must match multer field name "files"
  });

  return request(`/onboarding/${onboardingId}/step5`, {
    method: "PUT",
    body: formData,
  });
};

// Step 6: Signature + submit
export const submitOnboarding = async (onboardingId, signatureDataUrl) => {
  return request(`/onboarding/${onboardingId}/step6`, {
    method: "PUT",
    body: JSON.stringify({
      signatureDataUrl,
      termsAccepted: true,
    }),
  });
};

// Get saved onboarding by ID (to pre-fill form on refresh)
export const getOnboarding = async (onboardingId) => {
  return request(`/onboarding/${onboardingId}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// STANDALONE UPLOAD API (for FileUpload.jsx / DocumentChecklist.jsx)
// Use these if you want to upload independently of the onboarding flow
// ─────────────────────────────────────────────────────────────────────────────

// Upload a single image → returns { fileId, directUrl, webViewLink }
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // must match multer field "image"
  return request("/upload/image", { method: "POST", body: formData });
};

// Upload a single document → returns { fileId, directUrl, webViewLink }
export const uploadDocument = async (documentFile) => {
  const formData = new FormData();
  formData.append("document", documentFile);
  return request("/upload/document", { method: "POST", body: formData });
};

// Upload multiple documents at once
export const uploadMultipleDocuments = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return request("/upload/documents", { method: "POST", body: formData });
};

// Delete a file from Drive
export const deleteFile = async (fileId) => {
  return request(`/upload/${fileId}`, { method: "DELETE" });
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM API (contact / inquiry forms)
// ─────────────────────────────────────────────────────────────────────────────

export const submitContactForm = async (formData, attachmentFiles = []) => {
  const data = new FormData();
  Object.entries(formData).forEach(([k, v]) => data.append(k, v));
  attachmentFiles.forEach((f) => data.append("files", f));
  return request("/form/submit", { method: "POST", body: data });
};
