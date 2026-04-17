import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/campus_maintenance/backend/', 
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

export default instance;
