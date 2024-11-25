/* eslint-disable @typescript-eslint/no-unused-vars */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Ellipsis } from 'lucide-react';
import { DailyEmployeePayroll, MonthlyEmployeePayroll } from '@/type/employee';
import React, { useEffect } from 'react';
import { getDailyEmployeePayroll, getMonthlyPayroll } from '@/data/employee';
import PayrollTableDropdownProvider from '@/app/(admin)/payroll/dropdown';
import MonthlyEmployeeDialog from '@/app/(admin)/payroll/monthly-employee-dialog';
import { Paper, TableFooter } from '@mui/material';
import Swal from 'sweetalert2';
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import PayrollTableDropdownProvider2 from './dropdown2';

const moneyFormat = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

const roleProvider: Record<string, string> = {
    PORTER_EMPLOYEE: "Nhân viên bốc/dỡ hàng",
    DRIVER_EMPLOYEE: "Nhân viên giao hàng",
    STOCK_EMPLOYEE: "Nhân viên quản kho",
}

type PayrollTableProps = {
    month: number;
    year: number;
};

export function PorterPayrollTable({ month, year }: PayrollTableProps) {
    const [dailyEmployeePayroll, setDailyEmployeePayroll] = React.useState<DailyEmployeePayroll[]>(
        [],
    );

    useEffect(() => {
        getDailyEmployeePayroll(month + 1, year)
            .then((res) => setDailyEmployeePayroll(res))
            .catch((e) => console.error(`Error: ${e}`));
    }, [month, year]);

    const totalMass = dailyEmployeePayroll.reduce(
        (acc, porter) => acc + porter.totalMass,
        0,
    );
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null);
    return (
        <>
            <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                    <TableHead className='bg-[#0090d9]'>
                        <TableRow>
                            <TableCell><p className='text-white font-semibold'>Tên</p></TableCell>
                            <TableCell><p className='text-white font-semibold'>Chức vụ</p></TableCell>
                            <TableCell><p className='text-white font-semibold'>Số ngày đi làm trong tháng</p></TableCell>
                            <TableCell><p className='text-white font-semibold'>Năng suất làm việc (Tấn)</p></TableCell>
                            <TableCell align='center'><p className='text-white font-semibold'>Hành động</p></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dailyEmployeePayroll.map((employee) => (
                            <TableRow key={employee.id} className='hover:cursor-pointer'>
                                <TableCell className="text-md font-semibold">
                                    {employee.fullName}
                                </TableCell>
                                <TableCell>{roleProvider[employee.employeeRole]}</TableCell>
                                <TableCell>{employee.dayWorked}</TableCell>
                                <TableCell>{employee.totalMass}</TableCell>
                                <TableCell align='center'>
                                    <div className='flex justify-center'>
                                        <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                            <PayrollTableDropdownProvider
                                                employeeId={employee.id}
                                                setDialogOpen={setIsDialogOpen}
                                                setEmployeeId={setSelectedEmployeeId}
                                            >
                                                <Ellipsis className="w-4 h-4" />
                                            </PayrollTableDropdownProvider>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Tổng</TableCell>
                            <TableCell className="text-left">{`${totalMass} Tấn`}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            {selectedEmployeeId && (
                <MonthlyEmployeeDialog
                    isOpen={isDialogOpen}
                    onClose={setIsDialogOpen}
                    employeeId={selectedEmployeeId}
                    month={month}
                    year={year}
                />
            )}
        </>
    );
}

export function DriverPayrollTable({ month, year }: PayrollTableProps) {
    const [monthlyEmployeePayroll, setMonthltEmployeePayroll] = React.useState<MonthlyEmployeePayroll[]>(
        [],
    );

    useEffect(() => {
        getMonthlyPayroll(month + 1, year)
            .then((res) => setMonthltEmployeePayroll(res))
            .catch((e) => console.error(`Error: ${e}`));
    }, [month, year]);

    const total = monthlyEmployeePayroll.reduce(
        (acc, driver) => acc + driver.totalSalary,
        0,
    );

    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null);
    const handleSubmit = async (id: number) => {
        Swal.fire({
            title: 'Xác nhận xuất',
            text: `Bạn có chắc chắn muốn xuất phiếu chi cho nhân viên này không, một khi đã xuất sẽ không thể sửa được nữa.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xuất!',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed && id) {
                try {
                    const response = await api.post(`/ExpenseVoucher/payEmployeeSalaryByMonth`, {
                        employeeId: id
                    });
                    if (response.status >= 200 && response.status < 300) {
                        alert(`Xuất phiếu chi thành công`);
                        router.push("/expenditures");
                    } else {
                        throw new Error('Đã xảy ra lỗi, vui lòng thử lại.');
                    }
                } catch (error) {
                    alert('Đã xảy ra lỗi, vui lòng thử lại.');
                }
            }
        })
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                    <TableHead className='bg-[#0090d9]'>
                        <TableRow>
                            <TableCell><p className='text-white font-semibold'>Tên</p></TableCell>
                            <TableCell><p className='text-white font-semibold'>Chức vụ</p></TableCell>
                            <TableCell><p className='text-white font-semibold'>Lương theo ngày</p></TableCell>
                            <TableCell><p className='text-white font-semibold'>Số ngày đi làm trong tháng</p> </TableCell>
                            <TableCell><p className='text-white font-semibold'>Tạm tính</p></TableCell>
                            <TableCell align='center'><p className='text-white font-semibold'>Hành động</p></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {monthlyEmployeePayroll.map((employee) => (
                            <TableRow key={employee.id} className='hover:cursor-pointer'>
                                <TableCell className="text-md font-semibold">
                                    {employee.fullName}
                                </TableCell>
                                <TableCell>{roleProvider[employee.employeeRole]}</TableCell>
                                <TableCell>
                                    {moneyFormat.format(employee.dailyWage)}
                                </TableCell>
                                <TableCell>{employee.dayWorked}</TableCell>
                                <TableCell className="text-[#22c55e]">
                                    {moneyFormat.format(employee.totalSalary)}
                                </TableCell>
                                <TableCell align='center'>
                                    <div className='flex justify-center'>
                                        <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                            <PayrollTableDropdownProvider2
                                                employeeId={employee.id}
                                                handleSubmit={handleSubmit}
                                            >
                                                <Ellipsis className="w-4 h-4" />
                                            </PayrollTableDropdownProvider2>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>Tổng</TableCell>
                            <TableCell className="text-left">
                                {moneyFormat.format(total)}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}
