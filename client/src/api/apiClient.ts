import axios from "axios";
console.log("API URL:", import.meta.env.VITE_API_URL);


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Add a request interceptor
apiClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log("Request:", config);
    return config;
  }
  // Add a response interceptor
  , function (error) {
    // Do something with request error
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);
// Add a response interceptor
apiClient.interceptors.response.use(
  function (response) {
    // Do something with response data
    console.log("Response:", response);
    return response;
  }
  , function (error) {
    // Do something with response error
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);
export default apiClient;