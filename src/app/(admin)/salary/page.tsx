'use client'

import {getDaysAndWeekdaysInMonth,monthNames,getYears} from '@/hooks/useDate';
import { cn } from '@/lib/utils';
import React from 'react';
import { CircleCheck } from 'lucide-react';
import { Employee, Employees as employees } from '@/sample-data/salary';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import SalaryPageBreadcrumb from '@/app/(admin)/salary/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Page() {
    const [employee, setEmployee] = React.useState<Employee>(employees[0]);
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <SalaryPageBreadcrumb />
            </header>
            <section className="container mx-auto grid grid-cols-5 gap-1">
                <div>
                    <div className="p-4 border rounded h-[320px] overflow-y-auto space-y-4 bg-white">
                        {employees.map((empl) => (
                            <UserCard
                                key={empl.name}
                                employee={empl}
                                selectedEmpl={employee}
                                setEmployee={setEmployee}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-span-3 space-y-2">
                    <div className='flex items-center justify-center gap-2'>
                        <Select>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Tháng"/>
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
                                <SelectValue placeholder="Năm"/>
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
                    <Calendar employee={employee} />
                </div>
            </section>
        </>
    );
}

function Calendar({ employee }: { employee: Employee }) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toLocaleDateString();
    const calendar = getDaysAndWeekdaysInMonth(currentYear, currentMonth);

    function isActiveDate(date: string) {
        return employee.jobs.some((activeDate) => activeDate.date === date);
    }

    return (
        <div className="grid grid-cols-8 gap-1">
            {calendar.map((day, index) =>
                isActiveDate(day.localDate) ? (
                    <DayCardActive
                        key={index}
                        day={day}
                        currentDate={currentDate}
                        employee={employee}
                    />
                ) : (
                    <DayCard key={index} day={day} currentDate={currentDate} />
                ),
            )}
        </div>
    );
}

function UserCard({
    employee,
    setEmployee,
    selectedEmpl,
}: {
    employee: Employee;
    setEmployee: React.Dispatch<React.SetStateAction<Employee>>;
    selectedEmpl: Employee;
}) {
    return (
        <div
            className={cn("p-2 border rounded hover:cursor-pointer", employee.id === selectedEmpl.id && 'bg-green-100')}
            onClick={() => setEmployee(employee)}
        >
            <div>
                <h1 className="text-[16px] font-bold">{employee.name}</h1>
                <p className="text-sm text-gray-400">{employee.role}</p>
            </div>
        </div>
    );
}

function DayCard({
    day,
    currentDate,
}: {
    day: { day: number; weekday: string; localDate: string };
    currentDate: string;
}) {
    return (
        <div className="bg-white p-2 border border-gray-200 rounded hover:cursor-pointer hover:bg-gray-100">
            <div className="">
                <div
                    className={cn(
                        day.localDate === currentDate
                            ? 'w-6 h-6 flex items-center justify-center rounded-full bg-[#2f2f31] text-white'
                            : '',
                    )}
                >
                    <p>{day.day}</p>
                </div>
                <p>{day.weekday}</p>
            </div>
        </div>
    );
}

function DayCardActive({
    day,
    currentDate,
    employee,
}: {
    day: { day: number; weekday: string; localDate: string };
    currentDate: string;
    employee: Employee;
}) {
    const [show, setShow] = React.useState(false);

    function getJob() {
        return employee.jobs.find((job) => job.date === day.localDate);
    }

    const job = getJob() || { mass: '' };
    if (show) {
        return (
            <div
                className="bg-green-100 p-2 flex items-center justify-center border border-gray-200 rounded hover:cursor-pointer hover:bg-green-200"
                onClick={() => {
                    setShow(!show);
                }}
            >
                <span>{job.mass}</span>
            </div>
        );
    } else {
        return (
            <div
                className="bg-green-100 p-2 border border-gray-200 rounded hover:cursor-pointer hover:bg-green-200"
                onClick={() => {
                    setShow(!show);
                }}
            >
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            day.localDate === currentDate
                                ? 'w-6 h-6 flex items-center justify-center rounded-full bg-green-300'
                                : '',
                        )}
                    >
                        <p>{day.day}</p>
                    </div>
                    <CircleCheck className="w-4 h-4 text-green-500" />
                </div>
                <div>
                    <p>{day.weekday}</p>
                </div>
            </div>
        );
    }
}
