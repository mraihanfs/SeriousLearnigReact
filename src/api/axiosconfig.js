import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;
console.log(BASE_API_URL);


const connInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000
});

export default connInstance