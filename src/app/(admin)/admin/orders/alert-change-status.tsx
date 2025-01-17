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
    toastMessage: (message: string) => void;
}
export default function AlertChangeStatus({ setRefreshData,refreshData,orderUpdatePending,setOrderUpdatePending, isOpen, setIsOpen, toastMessage }: AlertDeleteProps) {
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
                if (response.status === 200) {
                    setIsOpen(false)
                    setOrderUpdatePending({} as Order)
                    setRefreshData(!refreshData)
                }else if (response.status === 400) {
                    toastMessage(response.data.message)
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
    if (orderUpdatePending?.orderDetails?.some((orderDetail) => orderDetail.inProgressOrder > 0)) {
        return (
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className='bg-white'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Đang có những đơn hàng có sản phẩm này đang được xử lý, bạn có chắc chắn muốn thay đổi trạng thái?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div>
                            {orderUpdatePending?.orderDetails?.filter((orderDetail) => orderDetail.inProgressOrder > 0).map((orderDetail) => (
                                <div key={orderDetail.id}>
                                    <p><span className='font-semibold'>{orderDetail.name}</span> - {orderDetail.inProgressOrder} đơn hàng đã được xác nhận!</p>
                                </div>
                            ))}
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateStatus}>Đã hiểu và muốn tiếp tục</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    } else {
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
}
