import Axios from "axios";

//const baseUrl = "https://taxi-service-diploma.herokuapp.com/";
const baseUrl = "https://localhost:5001/";

export const axiosInstance = Axios.create({
    baseURL: baseUrl
});