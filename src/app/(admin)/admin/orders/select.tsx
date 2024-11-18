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
import {useToast} from '@/hooks/use-toast';

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
    const {toast} = useToast();
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

    function handleUpdateStatus(value: string) {
        if(order.status !== 'IN_PROCESS'){
            setOrderUpdatePending({ ...order, status: value })
            setIsAlertOpen(true)
        }else {
            toast({
                variant: 'destructive',
                title: 'Không thể thay đổi trạng thái',
                description: 'Đơn hàng đang ở trạng thái "Đang xử lý" không thể thay đổi trạng thái'
            })
        }
    }

    return (
        <Select value={order.status} onValueChange={(value) => handleUpdateStatus(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn trạng thái"/>
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
                                    className={cn(colorProvider(item.value))}
                                />
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
