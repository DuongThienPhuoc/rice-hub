import axios from '@/config/axiosConfig';
import { AxiosResponse } from 'axios';

export async function getUserInformation<T>(userName: string): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get(
            `/user/get/${userName}`,
        );
        return response.data;
    } catch (e) {
        throw e;
    }
}
