import connInstance from "./axiosconfig";

const authAPI = {
  login: (data) => connInstance.post("/merchant/v1/auth/login", data),
  logout: () => connInstance.post("/merchant/v1/auth/logout"),
  register: (data) => connInstance.post("/merchant/v1/auth/register", data),
  forgotPassword: (data) => connInstance.post("/merchant/v1/auth/forgotpassword", data)
};

export default authAPI;
