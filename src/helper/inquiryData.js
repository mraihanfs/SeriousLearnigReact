import transactionService from "../services/transactionService";
import productService from "../services/productService";

const inquiryDataTransaction = () => {
  let data;
  let promise;

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
            throw err; // Ensure Suspense handles errors
          });
      }
      throw promise;
    },
  };
};

const inquiryDataProduct = () => {
  let data;
  let promise;

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
            throw err; // Ensure Suspense handles errors
          });
      }
      throw promise;
    },
  };
};

export const responseProduct = inquiryDataProduct();
export const responseTransaction = inquiryDataTransaction();
