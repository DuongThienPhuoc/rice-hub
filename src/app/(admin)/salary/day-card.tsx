import React from 'react';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';
import { DayActive, Employee } from '@/type/employee';
import SalaryPopoverProvider from '@/app/(admin)/salary/salary-popover-provider';

export type Day = {
    day: number;
    weekday: string;
    localDate: string;
};

export function DayCard({
    day,
    currentDate,
    variant,
    employee,
    isPending,
    startTransition,
    activeDays,
    refreshActiveDays,
    setRefreshActiveDays,
    isPrevMonth,
}: {
    day: Day;
    currentDate: string;
    variant: 'active' | 'inactive' | 'default';
    employee: Employee;
    isPending: boolean;
    startTransition: React.TransitionStartFunction;
    activeDays: DayActive[];
    refreshActiveDays: boolean;
    setRefreshActiveDays: (value: boolean) => void;
    isPrevMonth?: boolean;
}) {
    return (
        <SalaryPopoverProvider
            day={day}
            employee={employee}
            variant={variant}
            startTransition={startTransition}
            activeDays={activeDays}
            refreshActiveDays={refreshActiveDays}
            setRefreshActiveDays={setRefreshActiveDays}
        >
            <div
                className={cn(
                    'bg-white p-2 border border-gray-200 rounded hover:cursor-pointer hover:bg-gray-100',
                    variant === 'active' && 'bg-green-100 hover:bg-green-200',
                    variant === 'inactive' && 'bg-red-100 hover:bg-red-200',
                    isPending && 'pointer-events-none opacity-50',
                    isPrevMonth && 'pointer-events-none opacity-50',
                )}
            >
                <div>
                    <div className="flex justify-between">
                        <div
                            className={cn(
                                new Date(day.localDate).toLocaleDateString() ===
                                    currentDate
                                    ? 'w-6 h-6 flex items-center justify-center rounded-full bg-[#2f2f31] text-white'
                                    : '',
                            )}
                        >
                            <p>{day.day}</p>
                        </div>
                        {variant === 'active' && (
                            <CircleCheck className="w-6 h-6 text-green-500" />
                        )}
                        {variant === 'inactive' && (
                            <CircleX className="w-6 h-6 text-red-500" />
                        )}
                    </div>
                    <p>{day.weekday}</p>
                </div>
            </div>
        </SalaryPopoverProvider>
    );
}
