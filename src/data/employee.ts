import axios from '@/config/axiosConfig';
import {
    EmployeeDayActiveBodyRequest,
    DeleteActiveDayBodyRequest,
    UpdateEmployeeDayActiveBodyRequest,
} from '@/type/employee';
import { isAxiosError } from 'axios';

export function getEmployee(role: 'daily' | 'monthly') {
    try {
        return axios.get(`/employees/salary`, { params: { role } });
    } catch (e) {
        throw e;
    }
}

export function createEmployeeActiveDay(
    bodyRequest: EmployeeDayActiveBodyRequest,
) {
    try {
        return axios.post('/employees/salary', bodyRequest);
    } catch (e) {
        throw e;
    }
}

export function updateEmployeeActiveDay(
    bodyRequest: UpdateEmployeeDayActiveBodyRequest,
) {
    try {
        return axios.put('/employees/salary', bodyRequest);
    } catch (e) {
        throw e;
    }
}

export function getActiveDay(employeeId: number, month: number, year: number) {
    try {
        return axios.get(`/employees/day-active/${employeeId}`, {
            params: {
                month,
                year,
            },
        });
    } catch (e) {
        throw e;
    }
}

export function deleteActiveDay(bodyRequest: DeleteActiveDayBodyRequest) {
    try {
        return axios.delete('/employees/salary', { params: bodyRequest });
    } catch (e) {
        throw e;
    }
}

export async function getDailyEmployeePayroll(month: number, year: number) {
    try {
        const response = await axios.get('/employees/daily-payroll', {
            params: {
                month,
                year,
            },
        });
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw e.message;
        } else {
            throw e;
        }
    }
}

export async function getMonthlyPayroll(month: number, year: number) {
    try {
        const response = await axios.get('/employees/monthly-payroll', {
            params: {
                month,
                year,
            },
        });
        return response.data;
    } catch (e) {
        if (isAxiosError(e)) {
            throw e.message;
        } else {
            throw e;
        }
    }
}


