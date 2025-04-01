import connInstance from "./axiosconfig";

const transactionApi = {
  inquiry: () =>
    connInstance.get("/product/v1/getAll", {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    }),
};

export default transactionApi;
