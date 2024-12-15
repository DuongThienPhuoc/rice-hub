import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default axios.create({
    baseURL: API_URL,
    headers: { "ngrok-ship-browser-warning": "true" },
    withCredentials: true
});