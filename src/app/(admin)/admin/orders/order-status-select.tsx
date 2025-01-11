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
import { statusProvider } from '@/utils/status-provider';

function OrderStatusSelect({
    setOrderStatus,
    setCurrentPage,
}: {
    setOrderStatus: (status: string) => void;
    setCurrentPage: (page: number) => void;
}) {
    const ORDER_STATUS: string[] = [
        'IN_PROCESS',
        'COMPLETED',
        'FAILED',
        'CANCELED',
        'PENDING',
        'COMPLETE',
        'CONFIRMED',
    ];
    return (
        <Select onValueChange={(value) => {
            setOrderStatus(value)
            setCurrentPage(0)
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái đơn hàng" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Trạng thái đơn hàng</SelectLabel>
                    {ORDER_STATUS.map((status) => (
                        <SelectItem key={status} value={status}>
                            {statusProvider(status).text}
                        </SelectItem>
                    ))}
                    <SelectItem value="ALL">Tất cả</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default OrderStatusSelect;
