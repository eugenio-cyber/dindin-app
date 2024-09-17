import axios from "axios";

export default axios.create({
  baseURL: "https://dindin-app-backend.vercel.app/",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});
