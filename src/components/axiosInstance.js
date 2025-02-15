import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // Ensures cookies are sent
});

export const setupInterceptors = (navigate) => {
    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                navigate("/");
            }
            return Promise.reject(error);
        }
    );
};

export default axiosInstance;
