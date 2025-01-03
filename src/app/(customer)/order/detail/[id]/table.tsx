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
import { Input } from '@/components/ui/input';

export default function OrderDetailTable({
    order,
    editMode,
    setOrder,
}: {
    order: Order;
    editMode?: boolean;
    setOrder?: (order: Order) => void;
}) {
    const formater = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    })
    return (
        <Table>
            <TableHeader className="bg-[#0090d9]">
                <TableRow>
                    <TableHead>
                        <p className="font-semibold text-white">Sản Phẩm</p>
                    </TableHead>
                    <TableHead>
                        <p className="font-semibold text-white">Nhà Cung Cấp</p>
                    </TableHead>
                    <TableHead>
                        <p className="font-semibold text-white">Quy cách</p>
                    </TableHead>
                    <TableHead>
                        <p className="font-semibold text-white">Số lượng</p>
                    </TableHead>
                    <TableHead>
                        <p className="font-semibold text-white">Giá</p>
                    </TableHead>
                    <TableHead className="text-right">
                        <p className="font-semibold text-white">Thành tiền</p>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {order.orderDetails?.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-semibold">
                            {item.name}
                        </TableCell>
                        <TableCell>{item.supplierName}</TableCell>
                        <TableCell>{`${item.weightPerUnit} KG`}</TableCell>
                        {editMode && setOrder ? (
                            <TableCell>
                                <Input
                                    className="w-20"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const newOrder = { ...order };
                                        newOrder.orderDetails[index].quantity =
                                            parseInt(e.target.value);
                                        setOrder(newOrder);
                                    }}
                                    type="number"
                                />
                            </TableCell>
                        ) : (
                            <TableCell>{`${item.quantity} BAO`}</TableCell>
                        )}
                        <TableCell>
                            {currencyHandleProvider(item.unitPrice || 0)}
                        </TableCell>
                        <TableCell className="flex items-center justify-end">
                            {formater.format(item.totalPrice || 0)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
