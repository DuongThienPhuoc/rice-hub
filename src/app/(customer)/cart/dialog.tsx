import { Dispatch, SetStateAction } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CartDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white">
                <DialogTitle>Thông báo</DialogTitle>
                <DialogDescription>
                    Đơn hàng của bạn đã được ghi nhận thành công lên hệ thống,
                    nhân viên chúng tôi sẽ liên hệ bạn sớm nhất
                </DialogDescription>
                <DialogFooter className="flex justify-between">
                    <Button
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Đóng
                    </Button>
                    <Button asChild>
                        <Link href="/order/history">Xem lịch sử đơn hàng</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
