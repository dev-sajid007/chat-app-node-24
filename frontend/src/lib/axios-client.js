import axios from "axios";
import { HOST } from "@/utils/constants.js";

const axiosClient = axios.create({
    baseURL: HOST
});

export default axiosClient;
