import API from "./api";

export const loginAdmin = async (
  email,
  password
) => {
  const response = await API.post(
    "/admin/login",
    {
      email,
      password,
    }
  );

  return response.data;
};