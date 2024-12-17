import axios from '@/config/axiosConfig';
import { AxiosResponse } from 'axios';

export type Supplier = {
    id: number;
    name: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
    address: string;
    active: boolean;
}

async function getSuppliers<T>(): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get('/suppliers/all');
        return response.data;
    } catch (e) {
        throw e;
    }
}

export { getSuppliers };
