'use client';

import {
    getDaysAndWeekdaysInMonth,
    getYears,
    monthNames,
} from '@/hooks/use-date';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DayCard } from '@/app/(admin)/salary/day-card';
import { getEmployee } from '@/data/employee';
import { Employee } from '@/type/employee';
import { isAxiosError } from 'axios';

export default function SalaryPage() {
    const [tab, setTab] = React.useState(0);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee>();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toLocaleDateString();
    const calendar = getDaysAndWeekdaysInMonth(currentYear, currentMonth);

    async function fetchEmployee(role: 'driver' | 'porter') {
        try {
            const response = await getEmployee(
                currentMonth + 1,
                currentYear,
                role
            );
            setEmployees(response.data);
        } catch (e) {
            if (isAxiosError(e)) {
                throw e;
            } else {
                throw e;
            }
        }
    }

    useEffect(() => {
        fetchEmployee(tab === 0 ? 'porter': 'driver').catch((e) => {
            if (e.status === 400) {
                console.error('Employees not found');
            } else {
                console.error(`An error occurred: ${e}`);
            }
        });
    }, [tab]);

    useEffect(() => {
        setSelectedEmployee(employees[0]);
    }, [employees]);

    if(!selectedEmployee){
        return <></>
    }

    return (
        <section className="container mx-auto">
            <div className="grid grid-cols-5 gap-1">
                <div className="col-span-1">
                        <UserCardContainer
                            employees={employees}
                            selectedEmployee={selectedEmployee}
                            setSelectedEmployee={setSelectedEmployee}
                            tab={tab}
                            setTab={setTab}
                        />
                </div>
                <div className="col-span-4 space-y-2">
                    {tab === 0 ? (
                        <PorterCalendar
                            employee={selectedEmployee}
                            currentDate={currentDate}
                            calendar={calendar}
                        />
                    ) : (
                    <DriverCalendar
                        employee={selectedEmployee}
                        currentDate={currentDate}
                        calendar={calendar}
                    />
                    )}
                </div>
            </div>
        </section>
    );
}

function PorterCalendar({
    employee,
    currentDate,
    calendar,
}: {
    employee: Employee;
    currentDate: string;
    calendar: { day: number; weekday: string; localDate: string }[];
}) {
    function isActiveDate(date: string) {
        return employee.dayActive?.some(
            (activeDate) =>
                new Date(activeDate.dayActive).toLocaleDateString() === date,
        );
    }

    return (
        <>
            <DatePicker />
            <div className="grid grid-cols-8 gap-1">
                {calendar.map((day, index) => (
                    <DayCard
                        key={index}
                        day={day}
                        currentDate={currentDate}
                        variant={
                            isActiveDate(day.localDate) ? 'active' : 'default'
                        }
                        employee={employee}
                    />
                ))}
            </div>
        </>
    );
}

function DriverCalendar({
    employee,
    currentDate,
    calendar,
}: {
    employee: Employee;
    currentDate: string;
    calendar: { day: number; weekday: string; localDate: string }[];
}) {
    function isActiveDate(date: string) {
        return employee?.dayActive?.some(
            (activeDate) =>
                new Date(activeDate.dayActive).toLocaleDateString() === date,
        );
    }

    function isFutureDate(date: string) {
        return new Date(date) >= new Date();
    }

    function handleDayCard({
        day,
        currentDate,
        localDate,
        key,
    }: {
        day: { day: number; weekday: string; localDate: string };
        currentDate: string;
        localDate: string;
        key: number;
    }) {
        return (
            <DayCard
                key={key}
                day={day}
                currentDate={currentDate}
                variant={
                    isFutureDate(localDate)
                        ? 'default'
                        : isActiveDate(localDate)
                          ? 'active'
                          : 'inactive'
                }
                employee={employee}
            />
        );
    }

    return (
        <>
            <DatePicker />
            <div className="grid grid-cols-8 gap-1">
                {calendar.map((day, index) =>
                    handleDayCard({
                        day,
                        currentDate,
                        localDate: day.localDate,
                        key: index,
                    }),
                )}
            </div>
        </>
    );
}

function DatePicker() {
    return (
        <div className="flex items-center justify-center gap-2">
            <Select>
                <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                    {monthNames.map((month, index) => (
                        <SelectItem key={index} value={month}>
                            {month}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                    {getYears().map((year, index) => (
                        <SelectItem key={index} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function UserCardContainer({
    employees,
    selectedEmployee,
    setSelectedEmployee,
    tab,
    setTab,
}: {
    employees: Employee[];
    selectedEmployee: Employee;
    setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | undefined>>;
    tab: number;
    setTab: React.Dispatch<React.SetStateAction<number>>;
}) {
    return (
        <div className="p-2 pb-0 border rounded h-[320px] bg-white flex flex-col gap-2">
            <div className="bg-[#f4f4f5] p-1 grid grid-cols-2 gap-2 rounded">
                <div
                    className={cn(
                        'flex items-center justify-center rounded h-10 hover:cursor-pointer',
                        tab === 0 && 'bg-white',
                    )}
                    onClick={() => {
                        setTab(0);
                    }}
                >
                    <h1 className="text-sm font-semibold">Bốc/Dỡ hàng</h1>
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
                    <h1 className="text-sm font-semibold">Lái xe</h1>
                </div>
            </div>
            <div className="overflow-y-auto space-y-3">
                {employees.map((empl) => (
                    <UserCard
                        key={empl.fullName}
                        employee={empl}
                        selectedEmpl={selectedEmployee}
                        setEmployee={setSelectedEmployee}
                    />
                ))}
            </div>
        </div>
    );
}

function UserCard({
    employee,
    setEmployee,
    selectedEmpl,
}: {
    employee: Employee;
    setEmployee: React.Dispatch<React.SetStateAction<Employee | undefined>>;
    selectedEmpl: Employee;
}) {
    return (
        <div
            className={cn(
                'p-2 border rounded hover:cursor-pointer',
                employee.id === selectedEmpl.id && 'bg-green-100',
            )}
            onClick={() => setEmployee(employee)}
        >
            <div>
                <h1 className="text-[16px] font-bold">{employee.fullName}</h1>
                <p className="text-sm text-gray-400">
                    {employee.employeeRole === 'PORTER'
                        ? 'Nhân viên bốc/dỡ hàng'
                        : 'Lái xe'}
                </p>
            </div>
        </div>
    );
}
