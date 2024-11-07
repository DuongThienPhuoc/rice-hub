import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type AlertDeleteProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
export default function AlertChangeStatus({ isOpen, setIsOpen }: AlertDeleteProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='bg-white'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn thay đổi trạng thái</AlertDialogTitle>
                    <AlertDialogDescription>
                       Hành động này sẽ thay đổi trạng thái của đơn hàng
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                    <AlertDialogAction>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
