import React from 'react';
import { AdminOrderResponse, Order } from '@/type/order';
import { Calendar, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import OrderDialogProvider from '@/app/(admin)/admin/orders/order-dialog';
import SelectComponent from '@/app/(admin)/admin/orders/select';
import AlertChangeStatus from '@/app/(admin)/admin/orders/alert-change-status';
import { Separator } from '@/components/ui/separator';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

type AdminOrdersTableProps = {
    adminOrderResponse: AdminOrderResponse;
    newOrder: boolean;
    setNewOrder: (newOrder: boolean) => void;
    refreshData: boolean;
    setRefreshData: (refreshData: boolean) => void;
};

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
    adminOrderResponse,
    newOrder,
    setNewOrder,
    refreshData,
    setRefreshData,
}) => {
    const router = useRouter();
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    const [orderUpdatePending, setOrderUpdatePending] = React.useState<Order | undefined>();
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
                <div className="relative">
                    <Search className="absolute w-4 h-4 left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm đơn hàng"
                        className="pl-9 md:max-w-sm"
                    />
                </div>
                <div>
                    <OrderDialogProvider
                        newOrder={newOrder}
                        setNewOrder={setNewOrder}
                    >
                        <Button className='ml-0 mt-4 lg:ml-4 lg:mt-0 px-3 py-3 text-[14px] bg-[#4ba94d] font-semibold hover:bg-green-500'>
                            <span>Tạo đơn hàng</span>
                            <Plus />
                        </Button>
                    </OrderDialogProvider>
                </div>
            </div>
            <TableContainer component={Paper} sx={{ border: '1px solid #0090d9', borderRadius: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 700, borderCollapse: 'collapse' }} aria-label="simple table">
                    <TableHead className='bg-[#0090d9]'>
                        <TableRow>
                            <TableCell className='font-semibold text-white'>Mã đơn hàng</TableCell>
                            <TableCell className='font-semibold text-white'>Ngày đặt</TableCell>
                            <TableCell className='font-semibold text-white'>Người đặt</TableCell>
                            <TableCell className='font-semibold text-white'>Trạng thái</TableCell>
                            <TableCell align='center' className='font-semibold text-white'>
                                Xem chi tiết
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminOrderResponse._embedded?.orderList?.map(
                            (order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.orderCode}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="text-muted-foreground w-4 h-4" />
                                            {new Date(
                                                order.orderDate,
                                            ).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.customer.name}</TableCell>
                                    <TableCell>
                                        <SelectComponent
                                            order={order}
                                            setOrderUpdatePending={setOrderUpdatePending}
                                            setIsAlertOpen={setIsAlertOpen}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Button
                                                className="flex items-center gap-1 border-dashed"
                                                variant="outline"
                                                onClick={() => {
                                                    router.push(
                                                        `/admin/orders/${order.id}`,
                                                    );
                                                }}
                                            >
                                                <Search className="w-4 h-4" />
                                                Xem chi tiết
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <AlertChangeStatus
                isOpen={isAlertOpen}
                setIsOpen={setIsAlertOpen}
                orderUpdatePending={orderUpdatePending}
                setOrderUpdatePending={setOrderUpdatePending}
                refreshData={refreshData}
                setRefreshData={setRefreshData}
            />
        </div>
    );
};

export default AdminOrdersTable;
