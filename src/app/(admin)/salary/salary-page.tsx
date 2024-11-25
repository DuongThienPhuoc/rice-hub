'use client';

import { getDaysAndWeekdaysInMonth } from '@/hooks/use-date';
import React, { useEffect } from 'react';
import { getEmployee } from '@/data/employee';
import { DayActive, Employee } from '@/type/employee';
import { isAxiosError } from 'axios';
import PorterCalendar from '@/app/(admin)/salary/porter-calendar';
import DriverCalendar from '@/app/(admin)/salary/driver-calendar';
import UserCardContainer from '@/app/(admin)/salary/user-card';
import DatePicker from '@/app/(admin)/salary/date-picker';

export default function SalaryPage() {
    const [tab, setTab] = React.useState(0);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee>();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toLocaleDateString('en-US');
    const [calendar, setCalendar] = React.useState(getDaysAndWeekdaysInMonth(currentYear, currentMonth))
    const [isPending, startTransition] = React.useTransition();
    const [month, setMonth] = React.useState(currentMonth);
    const [year, setYear] = React.useState(currentYear);
    const [activeDays, setActiveDays] = React.useState<DayActive[]>();

    async function fetchEmployee(role: 'daily' | 'monthly') {
        startTransition(async () => {
            try {
                const response = await getEmployee(
                    role,
                );
                setEmployees(response.data || []);
            } catch (e) {
                if (isAxiosError(e)) {
                    throw e;
                } else {
                    throw e;
                }
            }
        });
    }

    useEffect(() => {
        fetchEmployee(tab === 0 ? 'daily' : 'monthly').catch((e) => {
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

    useEffect(() => {
        setCalendar(getDaysAndWeekdaysInMonth(year, month));
    }, [month, year]);

    if (!selectedEmployee) {
        return <></>;
    }

    return (
        <section className="container mx-auto">
            <div className="grid md:grid-cols-5 gap-1">
                <div>
                    <UserCardContainer
                        employees={employees}
                        selectedEmployee={selectedEmployee}
                        setSelectedEmployee={setSelectedEmployee}
                        tab={tab}
                        setTab={setTab}
                    />
                </div>
                <div className="md:col-span-4 space-y-2">
                    <DatePicker month={month} year={year} setMonth={setMonth} setYear={setYear} />
                    {tab === 0 ? (
                        <PorterCalendar
                            employee={selectedEmployee}
                            currentDate={currentDate}
                            month={month}
                            year={year}
                            calendar={calendar}
                            isPending={isPending}
                            startTransition={startTransition}
                            activeDays={activeDays || []}
                            setActiveDays={setActiveDays}
                        />
                    ) : (
                        <DriverCalendar
                            employee={selectedEmployee}
                            currentDate={currentDate}
                            month={month}
                            year={year}
                            calendar={calendar}
                            isPending={isPending}
                            activeDays={activeDays || []}
                            setActiveDays={setActiveDays}
                            startTransition={startTransition}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
