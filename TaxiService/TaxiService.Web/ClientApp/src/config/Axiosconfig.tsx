import Axios from "axios";

const baseUrl = "https://taxi-service-diploma.herokuapp.com/";

export const axiosInstance = Axios.create({
    baseURL: baseUrl
});