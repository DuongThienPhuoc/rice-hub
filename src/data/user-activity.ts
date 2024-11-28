import { AxiosResponse } from 'axios';
import axios from '@/config/axiosConfig';

export interface GetUserActivityProps {
    username?: string;
    activity?: string;
    startDate?: string;
    endDate?: string;
    sortDirection: 'asc' | 'desc';
    sortBy: string;
    pageNumber: number;
    pageSize: number;
}

async function getUserActivity<T>({
    username,
    activity,
    startDate,
    endDate,
    sortDirection = 'desc',
    sortBy = 'timestamp',
    pageNumber = 1,
    pageSize = 10,
}: GetUserActivityProps): Promise<T> {
    try {
        const response: AxiosResponse<T> = await axios.get(
            '/user-activities/getAll',
            {
                params: {
                    username,
                    activity,
                    startDate,
                    endDate,
                    sortDirection,
                    sortBy,
                    pageNumber,
                    pageSize,
                },
            },
        );
        return response.data;
    } catch (e) {
        throw e;
    }
}

export { getUserActivity };
