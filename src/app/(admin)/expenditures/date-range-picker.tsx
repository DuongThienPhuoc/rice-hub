'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerWithRangeProps = {
    className?: React.HTMLAttributes<HTMLDivElement>;
    date: DateRange | undefined;
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export function DatePickerWithRange({
    className,
    date,
    setDate,
}: DatePickerWithRangeProps) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[300px] justify-start text-left bg-[#4ba94d] h-[40px] font-semibold hover:bg-green-500',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon color='white' />
                        <div className="font-semibold text-white">
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'MM/dd/yyyy')} -{' '}
                                        {format(date.to, 'MM/dd/yyyy')}
                                    </>
                                ) : (
                                    format(date.from, 'MM/dd/yyyy')
                                )
                            ) : (
                                <>Chọn khoảng ngày</>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        locale={vi}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
