import brandApi from "../api/brandApi";

const brandService = {
  inquiry: async () => {
    try {
      const response = await brandApi.inquiry();
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Inquiry Brand failed with error: ", err);
      throw err;
    }
  },

  create: async (data) => {
    try {
      const response = await brandApi.create(data);
      return response.data;
    } catch (err) {
      console.error("Create Brand failed with error: ", err);
      throw err;
    }
  },

  delete: async (data) => {
    try {
      const response = await brandApi.delete(data);
      return response.data;
    } catch (error) {
      console.error("Delete Brand failed with error: ", error);
      throw error;
    }
  },

  update: async (data) => {
    try {
      const response = await brandApi.update(data);
      return response.data;
    } catch (error) {
      console.error("Update Brand failed with error: ", error);
      throw error;
    }
  }
};

export default brandService;
