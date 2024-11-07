import axios from '@/api/axiosConfig';
import { AxiosResponse } from 'axios';

export async function getCustomerList<T>(): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get('/customer/');
        return response.data;
    } catch (e) {
        console.error('Error fetching customer list', e);
        throw e;
    }
}
