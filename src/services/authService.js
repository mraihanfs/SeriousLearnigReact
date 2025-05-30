import authAPI from "../api/authApi";

const authServices = {
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      console.log(response.data)
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("merchantCode", response.data.merchantCode);
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

  register: async (data) => {
    try {
      const response = await authAPI.register(data);
      return response;
    } catch (err) {
      console.error("Regist failed with error: ", err);
      throw err;
    }
  },

  forgetPassword: async (data) => {
    try {
      const response = await authAPI.forgotPassword(data);
      return response;
    } catch (err) {
      console.error("Forgot Password failed with error: ", err);
      throw err;
    }
  },
};

export default authServices;
