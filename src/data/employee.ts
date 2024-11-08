import axios from '@/api/axiosConfig';

export function getEmployee(
    month: number,
    year: number,
    role: 'driver'|'porter',
) {
    try {
        return axios.get(
            `/employees/active-days?month=${month}&year=${year}&role=${role}`,
        );
    } catch (e) {
        throw e;
    }
}