import productApi from "../api/productApi";

const productService = {
  inquiry: async () => {
    try {
      const response = await productApi.inquiry();
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Inquiry product failed with error: ", err);
      throw err;
    }
  },
  create: async (reqData) => {
    try {
      const response = await productApi.update(reqData);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Update product failed with error: ", err);
      throw err;
    }
  },
  update: async (reqData) => {
    try {
      const response = await productApi.update(reqData);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Update product failed with error: ", err);
      throw err;
    }
  },
};

export default productService;
