import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { paymentVoucherSchema } from '@/schema/payment-voucher';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExpenditure } from '@/data/expenditures';
import { CreateExpenseVoucherRequest } from '@/type/expenditures';
import { useToast } from "@/hooks/use-toast"
import docso from '@/utils/docso';

type AddPaymentVoucherDialogProps = {
    children: React.ReactNode;
    refresh: boolean;
    setRefresh: (value: boolean) => void;
};
export default function AddPaymentVoucherDialogProvider({
    children,
    setRefresh,
    refresh,
}: AddPaymentVoucherDialogProps) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<z.infer<typeof paymentVoucherSchema>>({
        resolver: zodResolver(paymentVoucherSchema),
        defaultValues: {
            type: '',
            totalAmount: '',
            note: '',
        },
    });

    async function onSubmit(data: z.infer<typeof paymentVoucherSchema>) {
        const requestBody: CreateExpenseVoucherRequest = {
            type: data.type,
            totalAmount: parseInt(data.totalAmount),
            note: data.note,
        };
        try {
            const response = await createExpenditure(requestBody);
            if (response) {
                setIsOpen(false);
                form.reset();
                setRefresh(!refresh);
                toast({
                    variant: 'success',
                    title: 'Tạo phiếu chi thành công',
                    description: 'Phiếu chi đã được tạo thành công',
                });
            }
        } catch (e) {
            setIsOpen(false);
            form.reset();
            setRefresh(!refresh);
            console.error(e);
            toast({
                variant: 'destructive',
                title: 'Tạo phiếu chi thất bại',
                description: 'Có lỗi xảy ra khi tạo phiếu chi',
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-[#f8fafc]">
                <DialogHeader>
                    <DialogTitle>Thêm phiếu chi</DialogTitle>
                    <DialogDescription>
                        Vui lòng điền thông tin phiếu chi
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại phiếu chi</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại phiếu chi" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Thanh toán lương nhân viên">
                                                Thanh toán lương nhân viên
                                            </SelectItem>
                                            <SelectItem value="Thanh toán tiền nhập hàng">
                                                Thanh toán tiền nhập hàng
                                            </SelectItem>
                                            <SelectItem value="Các khoản chi khác">
                                                Các khoản chi khác
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số tiền</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập số tiền"
                                            type="number"
                                            min={1}
                                            {...field}
                                        />
                                    </FormControl>
                                    {field.value && (
                                        <div>
                                            <span className="text-sm text-muted-foreground">{`Số tiền bằng chữ: ${docso(field.value)}`}</span>
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập số tiền"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    form.reset();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button type="submit">Lưu</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
