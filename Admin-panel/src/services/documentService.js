import API from "./api";

export const getDocuments = async () => {

  const response = await API.get(
    "/admin/documents"
  );

  return response.data.data;

};

export const updateDocumentStatus = async (
  id,
  status
) => {

  const response = await API.patch(
    `/admin/submissions/${id}/status`,
    { status }
  );

  return response.data;

};