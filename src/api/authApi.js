import connInstance from "./axiosconfig";

const authAPI = {
  login: (data) => connInstance.post("/merchant/v1/auth/login", data),
  logout: () => connInstance.post("/merchant/v1/auth/logout"),
};

export default authAPI;
