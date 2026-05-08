import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/campus_maintenance/backend/', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// Request interceptor for debugging
instance.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for debugging
instance.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default instance;
