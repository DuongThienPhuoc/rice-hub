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
    deleteItem: () => void;
};
export default function AlertDelete({
    isOpen,
    setIsOpen,
    deleteItem
}: AlertDeleteProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Bạn có chắc chắn muốn xoá sản phẩm này?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này sẽ xoá sản phẩm khỏi danh sách
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteItem}>
                        Tiếp tục
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
