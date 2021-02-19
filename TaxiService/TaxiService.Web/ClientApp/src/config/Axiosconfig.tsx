import Axios from "axios";

export const axiosInstance = Axios.create({
    //baseURL: 'https://localhost:5001/'
    baseUrl: 'https://taxi-service-diploma.herokuapp.com/'
});