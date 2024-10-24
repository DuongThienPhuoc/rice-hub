import {
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TableHeader,
} from '@/components/ui/table';
import { DollarSign } from 'lucide-react';

type OrderDetail = {
    productID: string;
    productName: string;
    productType: string;
    quantity: number;
    price: number;
};

export default function OrderDetailTable({
    orderDetail,
}: {
    orderDetail: OrderDetail[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Sản Phẩm</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orderDetail.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.productType}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell className="flex items-center justify-end">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            {item.quantity * item.price}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
