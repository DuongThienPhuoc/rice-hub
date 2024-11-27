import axios from '@/config/axiosConfig';
import { AxiosResponse } from 'axios';

export type Category = {
    id: number;
    name: string;
    description: string;
    active: boolean;
}

async function getCategories<T>(): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get('/categories/all');
        return response.data;
    } catch (e) {
        throw e;
    }
}

export { getCategories };
