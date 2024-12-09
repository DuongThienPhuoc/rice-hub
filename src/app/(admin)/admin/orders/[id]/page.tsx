'use client';

import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
import { Package2, Calendar, User, Truck, ArrowLeft, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import OrderDetailTable from '@/app/(customer)/order/detail/[id]/table';
import { useEffect, useState } from 'react';
import { adminUpdateOrderQuantity, getOrderDetail } from '@/data/order';
import { AdminUpdateOrderRequest, Order } from '@/type/order';
import { statusProvider } from '@/utils/status-provider';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import OrderDetailPageBreadcrumb from '@/app/(admin)/admin/orders/[id]/breadcrumb';
import { useToast } from '@/hooks/use-toast';

export default function OrderDetailPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const router = useRouter();
    const [order, setOrder] = useState<Order>();
    const [isEditMode, setIsEditMode] = useState(false);
    const { toast } = useToast();
    const { setBreadcrumb } = useBreadcrumbStore()

    async function updateOrderQuantity() {
        if (!order) return;
        try {
            const orderBody: AdminUpdateOrderRequest = {
                customerId: order.customer.id,
                status: order.status,
                deposit: order.deposit,
                totalAmount: order.totalAmount,
                remainingAmount: order.remainingAmount,
                orderAddress: order.orderAddress,
                orderPhone: order.orderPhone,
                orderDetails: order.orderDetails,
            };
            const response = await adminUpdateOrderQuantity(
                orderBody,
                parseInt(params.id),
            );
            if (response.status === 200) {
                fetchOrderDetail().catch((e) => console.error(e));
                toast({
                    variant: 'success',
                    title: 'Cập nhật thành công',
                    description: 'Đơn hàng đã được cập nhật thành công',
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                });
            }
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message || 'Unexpected error occurred');
            }
        }
    }

    async function fetchOrderDetail() {
        try {
            const response = await getOrderDetail(params.id);
            if (response.status === 200) {
                setOrder(response.data);
            } else {
                console.error({ data: response.data, status: response.status });
            }
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message || 'Unexpected error occurred');
            }
        }
    }

    useEffect(() => {
        fetchOrderDetail().catch((e) => console.error(e));
        setBreadcrumb(<OrderDetailPageBreadcrumb orderID={params.id} />);
        return () => setBreadcrumb(null);
    }, []);

    if (!order) {
        //Todo: Add skeleton loader
        return <></>
    }

    return (
        <section className="container mx-auto space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <Package2 className="w-5 h-5" />
                            Chi tiết đơn hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Mã đơn hàng:</span>
                            <span>{order?.orderCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Ngày tạo đơn:</span>
                            <span className="flex gap-1 items-center">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(
                                        order?.orderDate || '',
                                    ).toLocaleDateString()}
                                </span>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Trạng thái:</span>
                            <span>
                                <Badge
                                    className="bg-[#4ba94d] hover:bg-green-500 text-white"
                                    variant={
                                        statusProvider(order.status).variant
                                    }
                                >
                                    {statusProvider(order?.status).text}
                                </Badge>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Tổng tiền:</span>
                            <span className="flex gap-1 items-center">
                                <span className="font-semibold">
                                    {currencyHandleProvider(order.totalAmount)}
                                </span>
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <User className="w-5 h-5" />
                            Thông tin khách hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Tên:</span>
                            <span>{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">
                                Số điện thoại:
                            </span>
                            <span>{order.customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Email:</span>
                            <span>{order.customer.email}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Địa chỉ:</span>
                            <br />
                            <span className="text-sm">
                                {order.customer.address}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-1 text-lg">
                            <div className="flex items-center gap-1">
                                <Truck className="w-5 h-5" />
                                Danh sách sản phẩm
                            </div>
                            <div>
                                {order.status === 'PENDING' && (
                                    <>
                                        {isEditMode ? (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    onClick={() =>
                                                        setIsEditMode(false)
                                                    }
                                                >
                                                    <ArrowLeft className="w-4 h-4" />
                                                    <span>Hủy</span>
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setIsEditMode(false);
                                                        updateOrderQuantity().catch((e) => {
                                                            toast({
                                                                variant: 'destructive',
                                                                title: 'Cập nhật thất bại',
                                                                description: 'Có lỗi xảy ra khi cập nhật số lượng đơn hàng',
                                                                duration: 3000
                                                            })
                                                            console.error('Error updating order quantity: ', e);
                                                        });
                                                    }}
                                                >
                                                    <span>Xác Nhận</span>
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    setIsEditMode(true)
                                                }
                                            >
                                                <Pencil className="w-4 h-4" />
                                                <span>Chỉnh sửa</span>
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderDetailTable
                            order={order}
                            editMode={isEditMode}
                            setOrder={setOrder}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <div className="text-right space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Tổng cộng:{' '}
                                {currencyHandleProvider(order?.totalAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Phụ phí: $0.00
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Thuế: $0.00
                            </p>
                            <p className="mt-2 font-bold">{`Tổng tiền: ${currencyHandleProvider(order?.totalAmount)}`}</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div>
                <Button
                    className="flex items-center"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                </Button>
            </div>
        </section>
    );
}
