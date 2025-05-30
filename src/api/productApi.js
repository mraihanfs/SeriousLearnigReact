import connInstance from "./axiosconfig";

const productApi = {
  inquiry: () => connInstance.get("/product/v1/getAll"),
  create: (reqData) =>
    connInstance.post("/product/v1/create", reqData),
  update: (reqData) => connInstance.post("/product/v1/update", reqData)
};

export default productApi;
