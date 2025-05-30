import { PREFIX_PRODUCTS } from "../constants/DataConstant";
import connInstance from "./axiosconfig";

const brandApi = {
  inquiry: () => connInstance.get(`${PREFIX_PRODUCTS}getAllBrand`),
  create: (data) => connInstance.post(`${PREFIX_PRODUCTS}createBrand`, data),
  delete: (data) =>
    connInstance.delete(`${PREFIX_PRODUCTS}deleteBrand`, { data }),
  update: (data) => connInstance.patch(`${PREFIX_PRODUCTS}updateBrand`, {data})
};

export default brandApi;
