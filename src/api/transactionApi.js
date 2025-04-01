import connInstance from "./axiosconfig";

const transactionApi = {
    
    inquiry: (data) => connInstance.post("/inquiry", data),
}

export default transactionApi;