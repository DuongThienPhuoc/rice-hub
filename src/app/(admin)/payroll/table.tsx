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
import { PorterPayroll, DriverPayroll } from '@/type/employee';
import React, { useEffect } from 'react';
import { getPorterPayroll, getDriverPayroll } from '@/data/employee';
import PayrollTableDropdownProvider from '@/app/(admin)/payroll/dropdown';
import { DriverChart, PorterChart } from '@/app/(admin)/payroll/chart';

const moneyFormat = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

type PayrollTableProps = {
    month: number;
    year: number;
};

export function PorterPayrollTable({ month, year }: PayrollTableProps) {
    const [porterPayroll, setPorterPayroll] = React.useState<PorterPayroll[]>(
        [],
    );

    useEffect(() => {
        getPorterPayroll(month + 1, year)
            .then((res) => setPorterPayroll(res))
            .catch((e) => console.error(`Error: ${e}`));
    }, [month, year]);

    const totalMass = porterPayroll.reduce(
        (acc, porter) => acc + porter.totalMass,
        0,
    );

    return (
        <>
            <div className="grid grid-cols-4">
                <PorterChart />
            </div>
            <div className="border rounded">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Số ngày đi làm trong tháng</TableHead>
                            <TableHead>Năng suất làm việc (Tấn)</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {porterPayroll.map((porter) => (
                            <TableRow key={porter.id}>
                                <TableCell className="text-md font-semibold">
                                    {porter.fullName}
                                </TableCell>
                                <TableCell>{porter.dayWorked}</TableCell>
                                <TableCell>{porter.totalMass}</TableCell>
                                <TableCell>
                                    <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                        <PayrollTableDropdownProvider
                                            employeeId={porter.id}
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
                            <TableCell colSpan={2}>Tổng</TableCell>
                            <TableCell className="text-left">{`${totalMass} Tấn`}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </>
    );
}

export function DriverPayrollTable({ month, year }: PayrollTableProps) {
    const [driverPayroll, setDriverPayroll] = React.useState<DriverPayroll[]>(
        [],
    );

    useEffect(() => {
        getDriverPayroll(month + 1, year)
            .then((res) => setDriverPayroll(res))
            .catch((e) => console.error(`Error: ${e}`));
    }, [month, year]);

    const total = driverPayroll.reduce(
        (acc, driver) => acc + driver.totalSalary,
        0,
    );

    return (
        <>
            <div className="grid grid-cols-4">
                <DriverChart />
            </div>
            <div className="border rounded">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Lương theo ngày</TableHead>
                            <TableHead>Số ngày đi làm trong tháng</TableHead>
                            <TableHead>Tạm tính</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {driverPayroll.map((driver) => (
                            <TableRow key={driver.id}>
                                <TableCell className="text-md font-semibold">
                                    {driver.fullName}
                                </TableCell>
                                <TableCell>
                                    {moneyFormat.format(driver.dailyWage)}
                                </TableCell>
                                <TableCell>{driver.dayWorked}</TableCell>
                                <TableCell className="text-[#22c55e]">
                                    {moneyFormat.format(driver.totalSalary)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                        <PayrollTableDropdownProvider
                                            employeeId={driver.id}
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
