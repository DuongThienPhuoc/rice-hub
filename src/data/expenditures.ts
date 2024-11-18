import axios from '@/config/axiosConfig';
import { AxiosResponse } from 'axios';
import { CreateExpenseVoucherRequest, ExpenseVoucherResponse } from '@/type/expenditures';

type GetExpendituresParams = {
    startDate?: string;
    endDate?: string;
    pageSize?: number;
    pageNumber: number;
}
export async function getExpenditures({
    startDate,
    endDate,
    pageSize = 10,
    pageNumber,
}: GetExpendituresParams) {
    try {
        const response: AxiosResponse<ExpenseVoucherResponse> = await axios.get(
            '/ExpenseVoucher/all',
            {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                    pageSize: pageSize,
                    pageNumber: pageNumber,
                },
            },
        );
        return response.data;
    } catch (e) {
        throw e;
    }
}

export async function createExpenditure(data: CreateExpenseVoucherRequest) {
    try {
        const response = await axios.post('/ExpenseVoucher/create', data);
        return response.data;
    } catch (e) {
        throw e;
    }
}
