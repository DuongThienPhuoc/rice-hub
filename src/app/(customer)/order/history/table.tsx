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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { CustomerOrderHistoryResponse } from '@/type/customer-order';
import { getOrderHistory } from '@/data/order';
import { useEffect, useState } from 'react';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { statusProvider } from '@/utils/status-provider';

export default function OrderTable({ userID }: { userID: string }) {

    const [customerOrderHistoryResponse, setCustomerOrderHistoryResponse] = useState<CustomerOrderHistoryResponse>({} as CustomerOrderHistoryResponse);

    useEffect(() => {
        getOrderHistory({ customerID: userID }).then((response) => {
            setCustomerOrderHistoryResponse(response.data);
        });
    }, [userID]);

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
                                        ).toLocaleDateString()}
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
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">
                                                2
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext href="#" />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
}
