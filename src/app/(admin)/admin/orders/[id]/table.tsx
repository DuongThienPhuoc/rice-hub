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
import { useRouter } from 'next/navigation';
import { EllipsisVertical, Info } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import React from 'react';

export default function OrderDetailTable({
                                             order,
                                             editMode,
                                             setOrder,
                                         }: {
    order: Order;
    editMode?: boolean;
    setOrder?: (order: Order) => void;
}) {
    const router = useRouter();
    return (
        <>
            <Table>
                <TableHeader className="bg-[#0090d9]">
                    <TableRow>
                        <TableHead>
                            <p className="font-semibold text-white">Sản Phẩm</p>
                        </TableHead>
                        <TableHead>
                            <p className="font-semibold text-white">Nhà cung cấp</p>
                        </TableHead>
                        <TableHead>
                            <p className="font-semibold text-white">Quy cách</p>
                        </TableHead>
                        <TableHead>
                            <p className="font-semibold text-white">Số lượng mua</p>
                        </TableHead>
                        <TableHead>
                            <p className="font-semibold text-white">Số lượng còn trong kho</p>
                        </TableHead>
                        <TableHead>
                            <p className="font-semibold text-white">Giá(kg)</p>
                        </TableHead>
                        <TableHead className="text-right">
                            <p className="font-semibold text-white">
                                Thành tiền
                            </p>
                        </TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.orderDetails?.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell
                                className="font-bold hover:cursor-pointer"
                                onClick={() =>
                                    router.push(`/products/${item.productId}`)
                                }
                            >
                                {item.name}
                            </TableCell>
                            <TableCell>
                                {item.supplierName}
                            </TableCell>
                            <TableCell className="font-semibold">{`${item.weightPerUnit} KG`}</TableCell>
                            {editMode && setOrder ? (
                                <TableCell>
                                    <Input
                                        className="w-20"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const newOrder = { ...order };
                                            newOrder.orderDetails[
                                                index
                                            ].quantity = parseInt(
                                                e.target.value,
                                            );
                                            setOrder(newOrder);
                                        }}
                                        type="number"
                                    />
                                </TableCell>
                            ) : (
                                <TableCell className="font-semibold">{`${item.quantity} BAO`}</TableCell>
                            )}
                            <TableCell className='font-semibold'>
                                {`${item.remainQuantity} BAO`}
                            </TableCell>
                            <TableCell className="font-semibold">
                                {currencyHandleProvider(item.unitPrice || 0)}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {currencyHandleProvider(item.totalPrice || 0)}
                            </TableCell>
                            <TableCell className="flex items-center justify-end">
                                {/*Dropdown menu*/}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300 hover:cursor-pointer">
                                            <EllipsisVertical className="w-5 h-5" />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <Link
                                            href={`/products/${item.productId}`}
                                        >
                                            <DropdownMenuItem className="hover:cursor-pointer">
                                                <div className="flex items-center">
                                                    <Info className="w-5 h-5 mr-2" />
                                                    <span className="font-semibold">
                                                        Chi tiết sản phẩm
                                                    </span>
                                                </div>
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
