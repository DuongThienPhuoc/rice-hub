import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

type SelectComponentProps = {
    value: string;
    setIsAlertOpen: (isOpen: boolean) => void;
};
export default function SelectComponent({ value, setIsAlertOpen }: SelectComponentProps) {
    function colorProvider(status: string) {
        switch (status) {
            case 'PENDING':
                return 'text-[#fbef8c]';
            case 'CANCELED':
                return 'text-destructive';
            case 'IN_PROCESS':
                return 'text-[#3b83f6]';
            case 'COMPLETED':
                return 'text-[#23c560]';
            default:
                return '';
        }
    }

    const status = [
        {
            value: 'PENDING',
            label: 'Chờ xác nhận',
        },
        {
            value: 'COMPLETED',
            label: 'Hoàn thành',
        },
        {
            value: 'CANCELED',
            label: 'Đã Huỷ',
        },
        {
            value: 'IN_PROCESS',
            label: 'Đang xử lý',
        },
    ];
    return (
        <Select value={value} onValueChange={() => setIsAlertOpen(true)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Trạng thái</SelectLabel>
                    {status.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center font-semibold">
                                {item.label}
                                <Dot
                                    size={35}
                                    className={cn(colorProvider(item.value),)}
                                />
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
