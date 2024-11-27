import axios from '@/config/axiosConfig';
import { AxiosResponse } from 'axios';

async function getCategories<T>(): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get('/categories/allcs');
        return response.data;
    } catch (e) {
        throw e;
    }
}

export { getCategories };
