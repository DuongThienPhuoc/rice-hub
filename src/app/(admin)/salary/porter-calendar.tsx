import { DayActive, Employee } from '@/type/employee';
import React, { useEffect } from 'react';
import { getActiveDay } from '@/data/employee';
import { isAxiosError } from 'axios';
import { DayCard } from '@/app/(admin)/salary/day-card';

type PorterCalendarProps = {
    employee: Employee;
    currentDate: string;
    month: number;
    year: number;
    calendar: { day: number; weekday: string; localDate: string }[];
    isPending: boolean;
    startTransition: React.TransitionStartFunction;
    activeDays: DayActive[];
    setActiveDays: (value: DayActive[]) => void;
};
const PorterCalendar: React.FC<PorterCalendarProps> = ({
    employee,
    currentDate,
    month,
    year,
    calendar,
    isPending,
    startTransition,
    activeDays,
    setActiveDays,
}) => {
    const [refreshActiveDays, setRefreshActiveDays] = React.useState(false);

    async function fetchActiveDay(
        employeeId: number,
        month: number,
        year: number,
    ) {
        startTransition(async () => {
            try {
                const response = await getActiveDay(employeeId, month, year);
                setActiveDays(response.data);
            } catch (e) {
                if (isAxiosError(e)) {
                    throw e;
                } else {
                    throw e;
                }
            }
        });
    }

    function isActiveDate(date: string) {
        return activeDays?.some(
            (activeDay) =>
                new Date(activeDay.dayActive).toLocaleDateString('en-US') === date,
        );
    }

    useEffect(() => {
        fetchActiveDay(employee.id, month + 1, year).catch((e) => {
            if (e.status === 400) {
                console.error('Active days not found');
            } else {
                console.error(`An error occurred: ${e}`);
            }
        });
    }, [employee, refreshActiveDays, month, year]);

    return (
        <>
            <div className="grid md:grid-cols-8 grid-cols-4 gap-1">
                {calendar.map((day, index) => (
                            <DayCard
                                key={index}
                                day={day}
                                currentDate={currentDate}
                                variant={
                                    isActiveDate(
                                        new Date(
                                            day.localDate,
                                        ).toLocaleDateString('en-US'),
                                    )
                                        ? 'active'
                                        : 'default'
                                }
                                employee={employee}
                                isPending={isPending}
                                startTransition={startTransition}
                                activeDays={activeDays || []}
                                refreshActiveDays={refreshActiveDays}
                                setRefreshActiveDays={setRefreshActiveDays}
                            />
                ))}
            </div>
        </>
    );
};

export default PorterCalendar;
