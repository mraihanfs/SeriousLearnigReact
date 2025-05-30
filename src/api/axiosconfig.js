import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;
// console.log(BASE_API_URL);


const connInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000
});


connInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    // console.log("Auth token from localStorage:", token);
    // console.log("Request config before sending:", config);
    config.headers["ngrok-skip-browser-warning"] = true
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default connInstance