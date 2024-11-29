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
import { Order } from '@/type/order';

type SelectComponentProps = {
    setIsAlertOpen: (isOpen: boolean) => void;
    order: Order;
    setOrderUpdatePending: (order: Order) => void;
};
export default function SelectComponent({
    setIsAlertOpen,
    order,
    setOrderUpdatePending,
}: SelectComponentProps) {
    const colorProvider: Record<string, string> = {
        PENDING: 'text-yellow-500',
        COMPLETED: 'text-green-500',
        CANCELED: 'text-red-500',
        IN_PROCESS: 'text-blue-500',
        FAILED: 'text-red-500',
        CONFIRMED: 'text-blue-500',
        COMPLETE: 'text-blue-500',
    }

    const pendingStatus = [
        {
            value: 'PENDING',
            label: 'Chờ xác nhận',
        },
        {
            value: 'CANCELED',
            label: 'Đã Huỷ',
        },
        {
            value: 'CONFIRMED',
            label: 'Đã xác nhận',
        }
    ];
    const inProcessStatus = [
        {
            value: 'IN_PROCESS',
            label: 'Đang xử lý',
        },
        {
            value: 'FAILED',
            label: 'Thất bại',
        },
        {
            value: 'COMPLETE',
            label: 'Đã nhận hàng',
        }
    ]
    const confirmedStatus = [
        {
            value: 'CONFIRMED',
            label: 'Đã xác nhận',
        },
        {
            value: 'IN_PROCESS',
            label: 'Đang xử lý',
        }
    ]
    const completedStatus = [
        {
            value: 'COMPLETED',
            label: 'Hoàn thành',
        }
    ]
    const canceledStatus = [
        {
            value: 'CANCELED',
            label: 'Đã Huỷ',
        }
    ]
    const completeStatus = [
        {
            value: 'COMPLETE',
            label: 'Đã nhận hàng',
        }
    ]
    const status = (orderStatus: string) => {
        if (orderStatus === 'PENDING') {
            return pendingStatus;
        } else if (orderStatus === 'IN_PROCESS') {
            return inProcessStatus;
        } else if (orderStatus === 'CONFIRMED') {
            return confirmedStatus;
        } else if (orderStatus === 'COMPLETE') {
            return completeStatus;
        }
        else {
            return orderStatus === 'COMPLETED' ? completedStatus : canceledStatus;
        }
    }
    function handleUpdateStatus(value: string) {
        setOrderUpdatePending({ ...order, status: value })
        setIsAlertOpen(true)
    }

    return (
        <Select value={order.status} onValueChange={(value) => handleUpdateStatus(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn trạng thái"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Trạng thái</SelectLabel>

                    {status(order.status).map((item) => (
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
