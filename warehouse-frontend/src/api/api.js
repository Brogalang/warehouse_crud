import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`, // sesuaikan dengan URL Laravel kamu
  withCredentials: true,
});

export default api;
