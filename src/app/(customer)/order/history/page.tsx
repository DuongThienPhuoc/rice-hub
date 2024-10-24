import OrderHistoryPageBreadcrumb from '@/app/(customer)/order/history/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Calendar, Search } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderHistoryPage() {
    const orders = [
        {
            id: 'ORD-12345',
            date: '2023-04-15',
            status: 'Đang vận chuyển',
            total: 239.97,
        },
        {
            id: 'ORD-12346',
            date: '2023-04-20',
            status: 'Đã thanh toán',
            total: 129.99,
        },
        {
            id: 'ORD-12347',
            date: '2023-04-25',
            status: 'Đang vận chuyển',
            total: 59.98,
        },
        { id: 'ORD-12348', date: '2023-04-30', status: 'Đã huỷ', total: 89.97 },
        {
            id: 'ORD-12349',
            date: '2023-05-05',
            status: 'Đang vận chuyển',
            total: 199.99,
        },
    ];
    return (
        <section className="container mx-auto space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                            Tổng Đơn hàng
                        </CardTitle>
                        <Package className="w-5 h-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                            Số tiền đã chi
                        </CardTitle>
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1000000</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Đơn hàng gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Tình trạng</TableHead>
                                <TableHead className="text-right">
                                    Tổng
                                </TableHead>
                                <TableHead className="text-right">
                                    Chi tiết
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 w-4 h-4 text-muted-foreground" />
                                            {order.date}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status ===
                                                'Đang vận chuyển'
                                                    ? 'default'
                                                    : order.status ===
                                                        'Đã thanh toán'
                                                      ? 'outline'
                                                      : 'destructive'
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {order.total}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" asChild>
                                            <Link
                                                href={`/order/detail/${order.id}`}
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
                                                <PaginationLink
                                                    href="#"
                                                    isActive
                                                >
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
        </section>
    );
}
