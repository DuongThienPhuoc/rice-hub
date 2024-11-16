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
import { AdminUpdateOrderRequest, Order } from '@/type/order';
import { adminUpdateOrder } from '@/data/order';

type AlertDeleteProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    orderUpdatePending: Order | undefined;
    setOrderUpdatePending: (order: Order) => void;
    refreshData: boolean;
    setRefreshData: (refreshData: boolean) => void;
}
export default function AlertChangeStatus({ setRefreshData,refreshData,orderUpdatePending,setOrderUpdatePending, isOpen, setIsOpen }: AlertDeleteProps) {
    async function handleUpdateStatus() {
        if(orderUpdatePending){
            const body: AdminUpdateOrderRequest = {
                customerId: orderUpdatePending.customer.id,
                status: orderUpdatePending.status,
                deposit: orderUpdatePending.deposit,
                totalAmount: orderUpdatePending.totalAmount,
                remainingAmount: orderUpdatePending.remainingAmount,
                orderDetails: orderUpdatePending.orderDetails,
            }
            try {
                const response = await adminUpdateOrder(body, orderUpdatePending.id)
                if (response) {
                    setIsOpen(false)
                    setOrderUpdatePending({} as Order)
                    setRefreshData(!refreshData)
                }
            }catch (e) {
                console.error(e)
            }
        }
        else {
            setIsOpen(false)
            return
        }
    }
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
                    <AlertDialogAction onClick={handleUpdateStatus}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
