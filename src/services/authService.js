import authAPI from "../api/authApi";

const authServices = {
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("authToken", response.data.token);
      return response;
    } catch (err) {
      console.error("Login failed with error: ", err);
      throw err;
    }
  },

  logout: async () => {
    try {
      const response = await authAPI.logout();
      localStorage.removeItem("authToken");
      return response;
    } catch (err) {
      console.error("Logout failed with error: ", err);
      throw err;
    }
  },
};

export default authServices;
