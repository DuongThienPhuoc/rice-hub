import {
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TableHeader,
} from '@/components/ui/table';
import { OrderDetail } from '@/type/order'

export default function OrderDetailTable({
    orderDetail,
}: {
    orderDetail: OrderDetail[];
}) {
    const formater = new Intl.NumberFormat('vi-VN',{
        style: 'currency',
        currency: 'VND'
    })
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Sản Phẩm</TableHead>
                    <TableHead>Quy cách</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orderDetail.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{`${item.weightPerUnit} KG`}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice}</TableCell>
                        <TableCell className="flex items-center justify-end">
                            {formater.format(item.totalPrice)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
