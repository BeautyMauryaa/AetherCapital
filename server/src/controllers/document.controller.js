// import Onboarding from "../models/onboarding.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// export const getAllDocuments = asyncHandler(async (req, res) => {

//   const submissions = await Onboarding.find().lean();

//   const docs = [];

//   submissions.forEach((item) => {

//     const applicant =
//       `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
//       item.companyName ||
//       "Unknown";

//     // ID FRONT
//     if (item.idFront) {

//       docs.push({
//         submissionId: item._id,
//         documentType: "idFront",

//         type: "ID Front",

//         applicant,

//         status:
//           item.idFront?.status || "pending",

//         file:
//           item.idFront?.file || item.idFront,
//       });

//     }

//     // ID BACK
//     if (item.idBack) {

//       docs.push({
//         submissionId: item._id,
//         documentType: "idBack",

//         type: "ID Back",

//         applicant,

//         status:
//           item.idBack?.status || "pending",

//         file:
//           item.idBack?.file || item.idBack,
//       });

//     }

//     // PROFILE IMAGE
//     if (item.profileImage) {

//       docs.push({
//         submissionId: item._id,
//         documentType: "profileImage",

//         type: "Profile Image",

//         applicant,

//         status:
//           item.profileImage?.status || "pending",

//         file:
//           item.profileImage?.file || item.profileImage,
//       });

//     }

//     // EXTRA DOCUMENTS
//     if (item.documents?.length > 0) {

//       item.documents.forEach((doc, index) => {

//         docs.push({
//           submissionId: item._id,

//           documentType:
//             `documents.${index}`,

//           type:
//             doc.type || "Document",

//           applicant,

//           status:
//             doc.status || "pending",

//           file:
//             doc.file || doc,
//         });

//       });

//     }

//   });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       docs,
//       "Documents fetched"
//     )
//   );

// });
    
