import productApi from "../api/productApi";

const productService = {
  inquiry: async () => {
    try {
      const response = await productApi.inquiry();
      console.log(response.data)
      return response.data;
    } catch (err) {
      console.error("Login failed with error: ", err);
      throw err;
    }
  },
};

export default productService;
