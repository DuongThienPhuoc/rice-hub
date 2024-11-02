'use client';

import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
import { Package2, Calendar, DollarSign, User, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import OrderDetailTable from '@/app/(customer)/order/detail/[id]/table';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderDetail } from '@/data/order';
import { OrderDetail } from '@/type/order'

export default function OrderDetailPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('orderCode');
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    async function fetchOrderDetail() {
        try {
            const response = await getOrderDetail(params.id);
            if (response.status === 200) {
                setOrderDetails(response.data);
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
    }, []);

    return (
        <section className="container mx-auto">
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
                            <span>{orderCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Ngày tạo đơn:</span>
                            <span className="flex gap-1 items-center">
                                <Calendar className="w-4 h-4" />
                                2024-12-12
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Trạng thái</span>
                            <span>
                                <Badge variant="outline">Đã thanh toán</Badge>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Tổng tiền</span>
                            <span className="flex gap-1 items-center">
                                <DollarSign className="w-4 h-4" />
                                100,000
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
                            <span>Nguyễn Văn A</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">
                                Số điện thoại:
                            </span>
                            <span>08126387881</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Email:</span>
                            <span>vana@gmail.com</span>
                        </div>
                        <div>
                            <span className="font-semibold">Địa chỉ:</span>
                            <br />
                            <span className="text-sm">
                                123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="my-5">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <Truck className="w-5 h-5" />
                            Danh sách sản phẩm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderDetailTable orderDetail={orderDetails} />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                                Subtotal: $100.00
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Shipping: $0.00
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tax: $0.00
                            </p>
                            <p className="mt-2 font-bold">Total: $100.00</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
