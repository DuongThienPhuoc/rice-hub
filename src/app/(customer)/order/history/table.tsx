'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Calendar, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CustomerOrderHistoryResponse } from '@/type/customer-order';
import { getOrderHistory } from '@/data/order';
import { useEffect, useState } from 'react';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { statusProvider } from '@/utils/status-provider';
import PaginationComponent from '@/components/pagination/pagination';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import OrderHistoryPageBreadcrumb from '@/app/(customer)/order/history/breadcrumb';

export default function OrderTable({ userID }: { userID: string }) {
    const [customerOrderHistoryResponse, setCustomerOrderHistoryResponse] = useState<CustomerOrderHistoryResponse>({} as CustomerOrderHistoryResponse);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const { setBreadcrumb } = useBreadcrumbStore();

    useEffect(() => {
        setBreadcrumb(<OrderHistoryPageBreadcrumb />)
        return () => setBreadcrumb(null)
    }, [setBreadcrumb]);

    useEffect(() => {
        getOrderHistory({ customerId: userID, pageNumber: currentPage + 1, pageSize: 5 }).then((response) => {
            setCustomerOrderHistoryResponse(response.data);
            setTotalPage(response.data.page.totalPages);
        });
    }, [userID, currentPage]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã đơn hàng</TableHead>
                            <TableHead>Ngày</TableHead>
                            <TableHead>Tình trạng</TableHead>
                            <TableHead className="text-right">Tổng</TableHead>
                            <TableHead className="text-right">
                                Chi tiết
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customerOrderHistoryResponse?._embedded?.orderList?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    {order.orderCode}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                                        {new Date(
                                            order.orderDate,
                                        ).toLocaleDateString('vi-VN')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            statusProvider(order.status)
                                                ?.variant || 'default'
                                        }
                                    >
                                        {statusProvider(order.status)?.text}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {currencyHandleProvider(order.totalAmount)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" asChild>
                                        <Link
                                            href={`/order/detail/${order.id}/?orderCode=${order.orderCode}`}
                                        >
                                            <Search className="w-4 h-4" />
                                            Chi tiết
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} className="bg-white">
                                <PaginationComponent totalPages={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
}
