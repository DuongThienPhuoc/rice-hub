import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { Printer, Trash } from 'lucide-react';
import { ExpenseVoucher } from '@/type/expenditures';
import { useToast } from '@/hooks/use-toast';
import Swal from 'sweetalert2'
import { ToastAction } from '@radix-ui/react-toast';
import api from "@/config/axiosConfig";

type PayrollTableDropdownProps = {
    children: React.ReactNode;
    expenseVoucher: ExpenseVoucher;
};
export default function ActionDropdownProvider({
    children,
    expenseVoucher
}: PayrollTableDropdownProps) {
    const { toast } = useToast();
    const handleDelete = async (id: any) => {
        if (!id) {
            toast({
                variant: 'destructive',
                title: 'Xóa thất bại',
                description: 'Không tìm thấy mã phiếu.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc muốn xóa phiếu chi này.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/ExpenseVoucher/delete/${id}`);
                    toast({
                        variant: 'default',
                        title: 'Xóa thành công',
                        description: `Phiếu chi đã được xóa thành công`,
                        style: {
                            backgroundColor: '#4caf50',
                            color: '#fff',
                        },
                        duration: 3000
                    })

                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Xóa thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            }
        })
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => handleDelete(expenseVoucher.id)}
                >
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
                    <Printer className="w-4 h-4 text-muted-foreground" />
                    In phiếu
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
