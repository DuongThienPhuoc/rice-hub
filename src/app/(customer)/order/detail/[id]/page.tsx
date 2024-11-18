'use client'

import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
import {
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TableHeader,
} from '@/components/ui/table';
import { Package2, Calendar, User, Truck, History, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import OrderDetailTable from '@/app/(customer)/order/detail/[id]/table';
import React, { useEffect, useState } from 'react';
import { getOrderDetail } from '@/data/order';
import { Order } from '@/type/order'
import { statusProvider } from '@/utils/status-provider';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OrderDetailPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const router = useRouter();
    const [order, setOrder] = useState<Order>();
    const statusConverter: Record<string, string> = {
            BANK_TRANSFER: 'Chuyển khoản ngân hàng',
            CASH: 'Tiền mặt'
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
    }, []);

    if(!order) {
        //Todo: Add skeleton loader
        return <></>
    }

    return (
        <section className="container mx-auto space-y-4">
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
                                <span>{new Date(order?.orderDate || '').toLocaleDateString()}</span>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Trạng thái</span>
                            <span>
                                <Badge variant={statusProvider(order.status).variant}>
                                    {statusProvider(order?.status).text}
                                </Badge>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Tổng tiền</span>
                            <span className="flex gap-1 items-center">
                                <span className='font-semibold'>{currencyHandleProvider(order.totalAmount)}</span>
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
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <Truck className="w-5 h-5" />
                            Danh sách sản phẩm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='rounded border'>
                            <OrderDetailTable order={order} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <div className="text-right space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Tổng cộng: {currencyHandleProvider(order?.totalAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Phụ phí: $0.00
                            </p>
                            <p className="mt-2 font-bold">{`Tổng tiền: ${currencyHandleProvider(order?.totalAmount)}`}</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <History className="w-5 h-5" />
                            Lịch sử thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='border rounded'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Số tiền</TableHead>
                                        <TableHead>Ngày thanh toán</TableHead>
                                        <TableHead>Phương thức thanh toán</TableHead>
                                        <TableHead className='text-right'>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.receiptVoucher?.transactions?.length > 0 ? (
                                        <>
                                            {order.receiptVoucher?.transactions?.map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell>{currencyHandleProvider(transaction.amount)}</TableCell>
                                                    <TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell>
                                                    <TableCell>{statusConverter[transaction.paymentMethod]}</TableCell>
                                                    <TableCell align='right'>
                                                        <Badge variant={statusProvider(transaction.status).variant}>
                                                            {statusProvider(transaction.status).text}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                        ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align='center'>Chưa có lịch sử thanh toán</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Button variant='default' onClick={
                    () => router.back()
                }>
                    <ArrowLeft className='w-4 h-4' />
                    Quay lại
                </Button>
            </div>
        </section>
    );
}
