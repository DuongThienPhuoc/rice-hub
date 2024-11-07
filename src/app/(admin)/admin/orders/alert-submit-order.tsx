import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AlertDeleteProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    createOrder: () => void;
};
export default function AlertSubmitOrder({
    isOpen,
    setIsOpen,
    createOrder,
}: AlertDeleteProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Bạn có muốn tạo đơn hàng này?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này sẽ tạo đơn hàng mới
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>
                        Huỷ bỏ
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={createOrder}>
                        Tiếp tục
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
