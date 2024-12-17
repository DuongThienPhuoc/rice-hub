import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { Printer } from 'lucide-react';
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
                <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => {
                        window.open(
                            `/document/expenditures?totalAmount=${expenseVoucher.totalAmount}&type=${expenseVoucher.type}&date=${expenseVoucher.expenseDate}`,
                            '_blank',
                            'noopener,noreferrer',
                        );
                    }}
                >
                    <Printer className="w-4 h-4 text-muted-foreground" />
                    In phiếu
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
