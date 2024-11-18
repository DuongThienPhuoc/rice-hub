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
    setDialogOpen: (value: boolean) => void;
    setEmployeeId: (value: number) => void;
};
export default function PayrollTableDropdownProvider({
    children,
    employeeId,
    setDialogOpen,
    setEmployeeId
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
                <DropdownMenuItem
                    onClick={() => {
                        setDialogOpen(true);
                        setEmployeeId(employeeId);
                    }}
                >
                    Xuất phiếu chi
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
