import Axios from "axios";

const baseUrl = "https://taxi-service-diploma.herokuapp.com/api";
//const baseUrl = "https://localhost:5001/api";

export const axiosInstance = Axios.create({
    baseURL: baseUrl
});