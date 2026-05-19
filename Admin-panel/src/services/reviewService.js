import API from "./api";

export const approveSubmission =
(id) =>
API.patch(
`/admin/submissions/${id}/approve`
);

export const rejectSubmission =
(id) =>
API.patch(
`/admin/submissions/${id}/reject`
);