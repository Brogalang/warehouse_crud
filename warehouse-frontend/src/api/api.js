import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1", // sesuaikan dengan URL Laravel kamu
});

export default api;
