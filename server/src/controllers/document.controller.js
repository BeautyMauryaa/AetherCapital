import Onboarding from "../models/onboarding.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllDocuments = asyncHandler(async (req, res) => {

  const submissions = await Onboarding.find().lean();

  const docs = [];

  submissions.forEach((item) => {

    const applicant =
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      item.companyName ||
      "Unknown";

    if (item.idFront) {
      docs.push({
        type: "ID Front",
        applicant,
        status: item.status,
        file: item.idFront,
      });
    }

    if (item.idBack) {
      docs.push({
        type: "ID Back",
        applicant,
        status: item.status,
        file: item.idBack,
      });
    }

    if (item.profileImage) {
      docs.push({
        type: "Profile Image",
        applicant,
        status: item.status,
        file: item.profileImage,
      });
    }

    if (item.documents?.length > 0) {
      item.documents.forEach((doc) => {
        docs.push({
          type: "Document",
          applicant,
          status: item.status,
          file: doc,
        });
      });
    }

  });

  return res.status(200).json(
    new ApiResponse(200, docs, "Documents fetched")
  );
});