import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getYears, monthNames } from '@/hooks/use-date';
import React from 'react';

type DatePickerProps = {
    month: number;
    year: number;
    setMonth: (month: number) => void;
    setYear: (year: number) => void;
};
const PayrollDatePicker: React.FC<DatePickerProps> = ({
    month,
    year,
    setMonth,
    setYear,
}) => {
    return (
        <div className='flex items-center gap-1 md:w-1/4'>
            <Select
                defaultValue={month.toString()}
                onValueChange={(e) => setMonth(parseInt(e))}
            >
                <SelectTrigger className="h-[48px] bg-white font-semibold">
                    <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                    {monthNames.map((month, index) => (
                        <SelectItem key={index} value={month.value.toString()}>
                            {month.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                defaultValue={year.toString()}
                onValueChange={(e) => setYear(parseInt(e))}
            >
                <SelectTrigger className="h-[48px] bg-white font-semibold">
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
};

export default PayrollDatePicker;
