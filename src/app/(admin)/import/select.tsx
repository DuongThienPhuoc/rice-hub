import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

type SelectComponentProps = {
    isShowing: string;
    setStatusUpdate: (type: string) => void;
    setCurrentPage: (page: number) => void;
};
export default function SelectComponent({
    isShowing,
    setStatusUpdate,
    setCurrentPage,
}: SelectComponentProps) {
    const colorProvider: Record<string, string> = {
        NORMAL: 'text-green-500',
        MISSING: 'text-red-500',
    }

    const type = [
        {
            value: 'NORMAL',
            label: 'Danh sách sản phẩm và nguyên liệu',
        },
        {
            value: 'MISSING',
            label: 'Danh sách sản phẩm đang thiếu hàng',
        }
    ];
    const status = () => {
        return type;
    }
    function handleUpdateStatus(value: string) {
        setStatusUpdate(value)
        setCurrentPage(0)
    }

    return (
        <Select value={isShowing} onValueChange={(value) => handleUpdateStatus(value)}>
            <SelectTrigger className="w-fit">
                <SelectValue placeholder={`${isShowing}`} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {status().map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center font-semibold">
                                {item.label}
                                <Dot
                                    size={35}
                                    className={cn(colorProvider[item.value])}
                                />
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
