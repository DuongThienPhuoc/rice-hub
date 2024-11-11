import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { useRouter } from 'next/navigation';

type PayrollTableDropdownProps = {
    children: React.ReactNode;
    employeeId: number;
};
export default function PayrollTableDropdownProvider({
    children,
    employeeId,
}: PayrollTableDropdownProps) {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push(`/employees/${employeeId}`)}
                >
                    Xem thông tin nhân viên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/expenditures`)}>
                    Xuất phiếu chi
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
