import transactionService from "../services/transactionService";
import productService from "../services/productService";
import brandService from "../services/brandService";

const inquiryDataTransaction = () => {
  let data;
  let promise;
  let error;

  return {
    read() {
      if (data !== undefined) return data;
      if (!promise) {
        console.log("Fetching data...");
        promise = transactionService
          .inquiry({ data: "transaction" })
          .then((res) => {
            console.log("Data received:", res.data); // Check if this runs
            data = res.data;
          })
          .catch((err) => {
            console.error("Inquiry error:", err);
            if (err.response.data.data) {
              data = err.response.data.data;
            }
            error = error = { ...err, flag: "TRANSACTION" };
            throw err; // Ensure Suspense handles errors
          });
      }
      throw promise;
    },

    refresh() {
      data = undefined;
      promise = undefined;
      error = undefined;
    },
  };
};

const inquiryDataProduct = () => {
  let data;
  let promise;
  let error;

  return {
    read() {
      if (data !== undefined) return data;
      if (!promise) {
        console.log("Fetching data...");
        promise = productService
          .inquiry()
          .then((res) => {
            console.log("Data received:", res.listProduct); // Check if this runs
            data = res.listProduct;
          })
          .catch((err) => {
            console.error("Inquiry error:", err);
            if (err.response.data.listProduct) {
              data = err.response.data.listProduct;
            }
            error = { ...err, flag: "PRODUCT" };
            throw err; // Ensure Suspense handles errors
          });
      }
      throw promise;
    },

    refresh() {
      data = undefined;
      promise = undefined;
      error = undefined;
    },
  };
};

const inquiryDataBrand = () => {
  let data;
  let promise;
  let error;

  return {
    read() {
      if (error) throw error;
      if (data !== undefined) return data;
      if (!promise) {
        console.log("Fetching data...");
        promise = brandService
          .inquiry()
          .then((res) => {
            console.log("Data received:", res.listBrand); // Check if this runs
            data = res.listBrand;
          })
          .catch((err) => {
            console.error("Inquiry error:", err);
            if (err.response.data.listBrand) {
              data = err.response.data.listBrand;
            }
            error = { ...err, flag: "BRAND" };
            throw err; // Ensure Suspense handles errors
          });
      }
      throw promise;
    },

    refresh() {
      data = undefined;
      promise = undefined;
      error = undefined;
    },
  };
};
export const responseBrand = inquiryDataBrand();
export const responseProduct = inquiryDataProduct();
export const responseTransaction = inquiryDataTransaction();
