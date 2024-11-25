import {
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TableHeader,
} from '@/components/ui/table';
import { Order } from '@/type/order'
import { currencyHandleProvider } from '@/utils/currency-handle';

export default function OrderDetailTable({
    order,
}: {
    order: Order;
}) {
    const formater = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    })
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Quy cách</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {order.orderDetails?.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className='font-semibold'>{item.name}</TableCell>
                        <TableCell>{`${item.weightPerUnit} KG`}</TableCell>
                        <TableCell>{`${item.quantity} BAO`}</TableCell>
                        <TableCell>{currencyHandleProvider(item.unitPrice)}</TableCell>
                        <TableCell className="flex items-center justify-end">
                            {formater.format(item.totalPrice)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
