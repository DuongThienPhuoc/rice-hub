import axios from '@/config/axiosConfig';
import { AxiosResponse } from 'axios';
import { User } from '@/type/user';

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

export async function updateUserInformation(user: User) {
    try {
        return await axios.put('/user/editByUsername', user);
    } catch (e) {
        throw e;
    }
}
