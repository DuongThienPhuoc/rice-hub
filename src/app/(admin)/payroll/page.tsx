'use client';

import {
    PorterPayrollTable,
    DriverPayrollTable,
} from '@/app/(admin)/payroll/table';
import React, { useEffect } from 'react';
import { Employee } from '@/type/employee';
import { getEmployee } from '@/data/employee';
import { isAxiosError } from 'axios';
import { cn } from '@/lib/utils';
import PayrollDatePicker from '@/app/(admin)/payroll/date-picker';
import { Separator } from '@/components/ui/separator';

export default function PayrollPage() {
    const [tab, setTab] = React.useState<number>(0);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee>();
    const [isPending, startTransition] = React.useTransition();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const [month, setMonth] = React.useState(currentMonth);
    const [year, setYear] = React.useState(currentYear);

    useEffect(() => {
        startTransition(async () => {
            try {
                const response = await getEmployee(
                    tab === 0 ? 'porter' : 'driver',
                );
                setEmployees(response.data || []);
            } catch (e) {
                if (isAxiosError(e)) {
                    console.error(`Error: ${e.message}`);
                } else {
                    console.error(`Error: ${e}`);
                }
            }
        });
    }, [tab]);

    useEffect(() => {
        setSelectedEmployee(employees[0]);
    }, [employees]);

    return (
        <section className="container mx-auto grid gap-2">
            <div className="bg-white p-4 rounded-lg border space-y-4 col-span-4">
                <div className="space-y-2">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Bảng lương
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Quản lý nhân viên của bạn
                    </p>
                </div>
                <Separator orientation="horizontal" />
                <div className='grid gap-2 md:flex md:justify-between'>
                    <div className="bg-[#f4f4f5] md:w-1/4 p-1 grid grid-cols-2 gap-2 rounded">
                        <div
                            className={cn(
                                'flex items-center justify-center rounded h-10 hover:cursor-pointer',
                                tab === 0 && 'bg-white',
                            )}
                            onClick={() => {
                                setTab(0);
                            }}
                        >
                            <h1 className="text-sm font-medium leading-none">
                                Bốc/Dỡ hàng
                            </h1>
                        </div>
                        <div
                            className={cn(
                                'flex items-center justify-center rounded h-10 hover:cursor-pointer',
                                tab === 1 && 'bg-white',
                            )}
                            onClick={() => {
                                setTab(1);
                            }}
                        >
                            <h1 className="text-sm font-medium leading-none">
                                Lái xe
                            </h1>
                        </div>
                    </div>
                    <PayrollDatePicker
                        month={month}
                        year={year}
                        setMonth={setMonth}
                        setYear={setYear}
                    />
                </div>
                <div className='space-y-4'>
                    {selectedEmployee && (
                        <>
                            {tab === 0 ? (
                                <PorterPayrollTable month={month} year={year} />
                            ) : (
                                <DriverPayrollTable month={month} year={year} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
