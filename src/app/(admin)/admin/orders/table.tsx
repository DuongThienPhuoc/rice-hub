import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { AdminOrderResponse, Order } from '@/type/order';
import { Calendar, Plus, Ellipsis } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderDialogProvider from '@/app/(admin)/admin/orders/order-dialog';
import AlertChangeStatus from '@/app/(admin)/admin/orders/alert-change-status';
import { Separator } from '@/components/ui/separator';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PaginationComponent from '@/components/pagination/pagination';
import ActionDropdownProvider from '@/app/(admin)/admin/orders/action-dropdown';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import OrderPageBreadcrumb from '@/app/(admin)/admin/orders/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import OrderStatusSelect from '@/app/(admin)/admin/orders/order-status-select';
import { statusProvider } from '@/utils/status-provider';

type AdminOrdersTableProps = {
    adminOrderResponse: AdminOrderResponse;
    newOrder: boolean;
    setNewOrder: (newOrder: boolean) => void;
    refreshData: boolean;
    setRefreshData: (refreshData: boolean) => void;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    totalPage: number;
    setOrderStatus: (status: string) => void;
};

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
    adminOrderResponse,
    newOrder,
    setNewOrder,
    refreshData,
    setRefreshData,
    currentPage,
    setCurrentPage,
    totalPage,
    setOrderStatus
}) => {
    const { toast } = useToast();
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [orderUpdatePending, setOrderUpdatePending] = React.useState<Order | undefined>();
    const { setBreadcrumb } = useBreadcrumbStore()
    const router = useRouter();

    useEffect(() => {
        setBreadcrumb(<OrderPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);

    function toastMessage(message: string) {
        toast({
            variant: 'destructive',
            title: message,
            duration: 3000,
        })
    }
    return (
        <div className="bg-white p-5 mx-5 rounded-md space-y-4">
            <div className="space-y-2">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Đơn hàng
                </h3>
                <p className="text-sm text-muted-foreground">
                    Quản lý đơn hàng của bạn
                </p>
            </div>
            <Separator orientation="horizontal" />
            <div className="flex items-center justify-between">
                {/*<div className="relative">*/}
                {/*    <Search className="absolute w-4 h-4 left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />*/}
                {/*    <Input*/}
                {/*        placeholder="Tìm kiếm đơn hàng"*/}
                {/*        className="pl-9 md:max-w-sm"*/}
                {/*    />*/}
                {/*</div>*/}
                <div>
                    <OrderStatusSelect
                        setOrderStatus={setOrderStatus}
                        setCurrentPage={setCurrentPage}/>
                </div>
                <div>
                    <OrderDialogProvider
                        newOrder={newOrder}
                        setNewOrder={setNewOrder}
                    >
                        <Button className="ml-0 lg:ml-4 mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500">
                            <span>Tạo đơn hàng</span>
                            <Plus />
                        </Button>
                    </OrderDialogProvider>
                </div>
            </div>
            <TableContainer
                component={Paper}
                sx={{
                    border: '1px solid #0090d9',
                    borderRadius: 2,
                    overflowX: 'auto',
                }}
            >
                <Table
                    sx={{ minWidth: 700, borderCollapse: 'collapse' }}
                    aria-label="simple table"
                >
                    <TableHead className="bg-[#0090d9]">
                        <TableRow>
                            <TableCell>
                                <p className="font-semibold text-white">
                                    Mã đơn hàng
                                </p>
                            </TableCell>
                            <TableCell>
                                <p className="font-semibold text-white">
                                    Ngày đặt
                                </p>
                            </TableCell>
                            <TableCell>
                                <p className="font-semibold text-white">
                                    Người đặt
                                </p>
                            </TableCell>
                            <TableCell>
                                <p className="font-semibold text-white">
                                    Trạng thái
                                </p>
                            </TableCell>
                            <TableCell align="center">
                                <p className="font-semibold text-white">
                                    Xem chi tiết
                                </p>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminOrderResponse._embedded?.orderList?.map(
                            (order) => (
                                <TableRow key={order.id}>
                                    <TableCell className='font-semibold'>
                                        <span className='hover:cursor-pointer' style={{
                                            fontWeight: 600,
                                        }}
                                              onClick={() => {
                                                  router.push(
                                                      `/admin/orders/${order.id}`,
                                                  );
                                              }}
                                        >
                                            {order.orderCode}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="text-muted-foreground w-4 h-4" />
                                            {new Date(
                                                order.orderDate,
                                            ).toLocaleDateString('vi-VN')}
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.customer.name}</TableCell>
                                    <TableCell>
                                        <span className='p-2 rounded bg-gray-400 text-[12px] font-medium leading-none'
                                                style={{
                                                    color: statusProvider(order.status).textColor,
                                                    backgroundColor: statusProvider(order.status).bgColor,
                                                }}
                                        >
                                            {statusProvider(order.status).text}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex justify-center'>
                                            <ActionDropdownProvider order={order}>
                                                <div className="flex w-6 h-6 items-center justify-center rounded hover:bg-[#cbd5e1]">
                                                    <Ellipsis className="w-4 h-4" />
                                                </div>
                                            </ActionDropdownProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {totalPage > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPage}
                />
            )}
            <AlertChangeStatus
                isOpen={isAlertOpen}
                setIsOpen={setIsAlertOpen}
                orderUpdatePending={orderUpdatePending}
                setOrderUpdatePending={setOrderUpdatePending}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
                toastMessage={toastMessage}
            />
        </div>
    );
};

export default AdminOrdersTable;
