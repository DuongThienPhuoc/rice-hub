import axios from '@/api/axiosConfig';
import {
    EmployeeDayActiveBodyRequest,
    DeleteActiveDayBodyRequest,
    UpdateEmployeeDayActiveBodyRequest,
} from '@/type/employee';
import { isAxiosError } from 'axios';

export function getEmployee(role: 'driver' | 'porter') {
    try {
        return axios.get(`/employees/role`, { params: { role } });
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

export async function getPorterPayroll(month: number, year: number) {
    try {
        const response = await axios.get('/employees/porter-payroll', {
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

export async function getDriverPayroll(month: number, year: number) {
    try {
        const response = await axios.get('/employees/driver-payroll', {
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


