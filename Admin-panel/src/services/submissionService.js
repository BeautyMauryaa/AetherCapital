import API from "./api";

export const getSubmissions = async () => {
  const response = await API.get("/admin/submissions");

  console.log("FULL RESPONSE:", response.data);

  return response?.data?.data?.submissions || response?.data?.submissions || [];
};

export const updateSubmissionStatus = async (id, status) => {
  const response = await API.patch(`/admin/submissions/${id}/status`, {
    status,
  });

  return response.data;
};
