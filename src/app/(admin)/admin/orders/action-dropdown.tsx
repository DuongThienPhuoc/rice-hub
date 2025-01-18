import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Printer, Search } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/type/order';

export default function ActionDropdownProvider({
    children,
    order,
}: {
    order: Order;
    children: React.ReactNode;
}) {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2"
                                  onClick={() => {
                                      router.push(
                                          `/admin/orders/${order.id}`,
                                      );
                                  }}
                >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    Xem chi Tiết
                </DropdownMenuItem>
                {order.status === 'COMPLETE' && (
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => {
                            window.open(
                                `/document/invoice?orderId=${order.id}`,
                                '_blank',
                                'noopener,noreferrer',
                            );
                        }}
                    >
                        <Printer className="w-4 h-4 text-muted-foreground" />
                        In hoá đơn
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
