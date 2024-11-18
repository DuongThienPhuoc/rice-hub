import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { Search, Trash } from 'lucide-react';
import { ExpenseVoucher } from '@/type/expenditures';

type PayrollTableDropdownProps = {
    children: React.ReactNode;
    expenseVoucher: ExpenseVoucher;
};
export default function ActionDropdownProvider({
    children,
    expenseVoucher
}: PayrollTableDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                    <Trash className="w-4 h-4 text-muted-foreground" />
                    Xoá phiếu chi
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => {
                        window.open(
                            `/document?totalAmount=${expenseVoucher.totalAmount}&type=${expenseVoucher.type}&date=${expenseVoucher.expenseDate}`,
                            '_blank',
                            'noopener,noreferrer',
                        );
                    }}
                >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    Xem chi tiết
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
