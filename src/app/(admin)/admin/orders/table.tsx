import React from 'react';
import { AdminOrderResponse } from '@/type/order';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Calendar, Search, CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import OrderDialogProvider from '@/app/(admin)/admin/orders/order-dialog';
import SelectComponent from '@/app/(admin)/admin/orders/select';
import AlertChangeStatus from '@/app/(admin)/admin/orders/alert-change-status';

type AdminOrdersTableProps = {
    adminOrderResponse: AdminOrderResponse;
    newOrder: boolean;
    setNewOrder: (newOrder: boolean) => void;
};

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
    adminOrderResponse,
    newOrder,
    setNewOrder
}) => {
    const router = useRouter();
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    return (
        <div className="bg-white p-4 rounded-md space-y-4">
            <div>
                <h1 className="text-xl font-bold tracking-tight">Đơn hàng</h1>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute w-4 h-4 left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm đơn hàng"
                        className="pl-9 md:max-w-sm"
                    />
                </div>
                <div>
                    <OrderDialogProvider newOrder={newOrder} setNewOrder={setNewOrder}>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between"
                        >
                            <CirclePlus className="w-4 h-4" />
                            <span>Tạo đơn hàng</span>
                        </Button>
                    </OrderDialogProvider>
                </div>
            </div>
            <div className="border rounded">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã đơn hàng</TableHead>
                            <TableHead>Ngày đặt</TableHead>
                            <TableHead>Người đặt</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-center">
                                Xem chi tiết
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {adminOrderResponse._embedded?.orderList?.map(
                            (order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-semibold">
                                        {order.orderCode}
                                    </TableCell>
                                    <TableCell className="flex items-center gap-1 font-semibold">
                                        <Calendar className="text-muted-foreground w-4 h-4" />
                                        {new Date(
                                            order.orderDate,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{order.customer.name}</TableCell>
                                    <TableCell>
                                        <SelectComponent value={order.status} setIsAlertOpen={setIsAlertOpen}/>
                                    </TableCell>
                                    <TableCell className="flex justify-center">
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
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>
            </div>
            <AlertChangeStatus isOpen={isAlertOpen} setIsOpen={setIsAlertOpen}/>
        </div>
    );
};

export default AdminOrdersTable;
