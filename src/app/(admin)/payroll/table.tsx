import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Ellipsis } from 'lucide-react';
import { DailyEmployeePayroll, MonthlyEmployeePayroll } from '@/type/employee';
import React, { useEffect } from 'react';
import { getDailyEmployeePayroll, getMonthlyPayroll } from '@/data/employee';
import PayrollTableDropdownProvider from '@/app/(admin)/payroll/dropdown';
import MonthlyEmployeeDialog from '@/app/(admin)/payroll/monthly-employee-dialog';

const moneyFormat = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

const roleProvider: Record<string, string> = {
    PORTER_EMPLOYEE: "Nhân viên bốc/dỡ hàng",
    DRIVER_EMPLOYEE: "Lái xe",
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
            <div className="border rounded">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Chức vụ</TableHead>
                            <TableHead>Số ngày đi làm trong tháng</TableHead>
                            <TableHead>Năng suất làm việc (Tấn)</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dailyEmployeePayroll.map((employee) => (
                            <TableRow key={employee.id}  className='hover:cursor-pointer'>
                                <TableCell className="text-md font-semibold">
                                    {employee.fullName}
                                </TableCell>
                                <TableCell>{roleProvider[employee.employeeRole]}</TableCell>
                                <TableCell>{employee.dayWorked}</TableCell>
                                <TableCell>{employee.totalMass}</TableCell>
                                <TableCell>
                                    <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                        <PayrollTableDropdownProvider
                                            employeeId={employee.id}
                                            setDialogOpen={setIsDialogOpen}
                                            setEmployeeId={setSelectedEmployeeId}
                                        >
                                            <Ellipsis className="w-4 h-4" />
                                        </PayrollTableDropdownProvider>
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
            </div>
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
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null);
    return (
        <>
            <div className="border rounded">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Chức vụ</TableHead>
                            <TableHead>Lương theo ngày</TableHead>
                            <TableHead>Số ngày đi làm trong tháng</TableHead>
                            <TableHead>Tạm tính</TableHead>
                        </TableRow>
                    </TableHeader>
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
                                <TableCell>
                                    <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                        <PayrollTableDropdownProvider
                                            employeeId={employee.id}
                                            setDialogOpen={setIsDialogOpen}
                                            setEmployeeId={setSelectedEmployeeId}
                                        >
                                            <Ellipsis className="w-4 h-4" />
                                        </PayrollTableDropdownProvider>
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
            </div>
        </>
    );
}
