import axios from '@/api/axiosConfig';
import {
    EmployeeDayActiveBodyRequest,
    DeleteActiveDayBodyRequest,
    UpdateEmployeeDayActiveBodyRequest,
} from '@/type/employee';

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
