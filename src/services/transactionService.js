import transactionApi from "../api/transactionApi";

const transactionService = {
  inquiry: async (data) => {
    try {
      const response = await transactionApi.inquiry(data);
      return response.data;
    } catch (err) {
      console.error("Login failed with error: ", err);
      throw err;
    }
  },
};

export default transactionService;
