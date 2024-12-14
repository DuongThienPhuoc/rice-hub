import axios from 'axios';

const LOCAL_URL = 'https://api.camgaothanhquang.com';

export default axios.create({
    baseURL: LOCAL_URL,
    headers: { "ngrok-ship-browser-warning": "true" },
    withCredentials: true
});