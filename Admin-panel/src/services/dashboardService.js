import API from "./api";

export const getDashboardStats = async () => {

  const response = await API.get(
    "/admin/stats"
  );

  return response.data.data;

};