'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CartDialog from '@/app/(customer)/cart/dialog';
import { useProductSelectedStore } from '@/stores/cartTableStore';
import { Trash2 } from 'lucide-react';
import { createOrder, OrderRequest } from '@/data/order';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { currencyHandleProvider } from '@/utils/currency-handle';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';

export interface CartProduct {
    cartId: number;
    productID: number;
    productCode: string;
    name: string;
    quantity: number;
    price: number;
    type: number;
}

export default function CartTable({ customerID }: { customerID: string }) {
    const { toast } = useToast();
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        const localStorageProducts =
            typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
        const parsedProducts: CartProduct[] = localStorageProducts
            ? JSON.parse(localStorageProducts)
            : [];
        setProducts(parsedProducts);
    }, [refresh]);
    const selectedProduct = useProductSelectedStore((state) => state.selected);
    const updateSelectedProduct = useProductSelectedStore(
        (state) => state.handleSelected,
    );
    const updateSelectedAllProduct = useProductSelectedStore(
        (state) => state.handleSelectedAll,
    );
    const clearSelectedProduct = useProductSelectedStore(
        (state) => state.clearSelected
    )
    const totalMoney = useProductSelectedStore((state) => state.total);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    function handleDeleteProduct(cartId: number) {
        const newProducts = products.filter(
            (product) => product.cartId != cartId,
        );
        localStorage.setItem('cart', JSON.stringify(newProducts));
        setProducts(newProducts);
    }

    async function handleOrder() {
        const orderDetails: OrderRequest = {
            customerId: parseInt(customerID),
            orderDetails: selectedProduct.map((product) => {
                return {
                    productId: product.productID,
                    quantity: product.quantity,
                    unitPrice: product.price,
                    weightPerUnit: product.type
                };
            }),
        };
        try {
            if (orderDetails.orderDetails.length > 0) {
                const response = await createOrder(orderDetails);
                if (response.status === 200) {
                    localStorage.setItem('cart', JSON.stringify([]));
                    clearSelectedProduct();
                    setRefresh(!refresh);
                    setDialogOpen(true);
                }
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Xin hãy chọn sản phẩm',
                    description: 'Vui lòng chọn sản phẩm trước khi đặt hàng',
                    action: <ToastAction altText="Try again">OK!</ToastAction>,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error?.message || 'Unexpected error occurred');
            }
        }
    }

    function handleChangeProductQuantity(e: React.ChangeEvent<HTMLInputElement>, changeCartProductId: number) {
        const newProduct = products.map((product) => {
            if (product.cartId === changeCartProductId) {
                return {
                    ...product,
                    quantity: parseInt(e.target.value)
                }
            }
            return product;
        })
        localStorage.setItem('cart', JSON.stringify(newProduct));
        setRefresh(!refresh);
    }

    return (
        <section className="grid gap-5">
            <div className="bg-white p-3 rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    checked={
                                        selectedProduct.length === products.length && products.length !== 0
                                    }
                                    onCheckedChange={() => {
                                        updateSelectedAllProduct(products);
                                    }}
                                />
                            </TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Tổng trọng lượng</TableHead>
                            <TableHead>Đơn giá (kg)</TableHead>
                            <TableHead>Thành tiền</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Không có sản phẩm nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.cartId}>
                                    <TableCell>
                                        <Checkbox
                                            checked={
                                                !!selectedProduct.find(
                                                    (selectedProduct) =>
                                                        selectedProduct.cartId ===
                                                        product.cartId,
                                                )
                                            }
                                            onCheckedChange={() =>
                                                updateSelectedProduct(product)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{`${product.type}kg`}</TableCell>
                                    <TableCell>
                                        <Input
                                            defaultValue={product.quantity}
                                            onChange={(e) => handleChangeProductQuantity(e,product.cartId)}
                                            className='w-fit'
                                            type='number'/>
                                    </TableCell>
                                    <TableCell>{`${product.quantity * product.type}kg`}</TableCell>
                                    <TableCell>{currencyHandleProvider(product.price)}</TableCell>
                                    <TableCell>{currencyHandleProvider(product.price * product.quantity * product.type)}</TableCell>
                                    <TableCell>
                                        <Trash2
                                            className="w-4 h-4 hover:cursor-pointer"
                                            onClick={() =>
                                                handleDeleteProduct(
                                                    product.cartId,
                                                )
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <section className="flex justify-end">
                <div className="grid gap-5">
                    <div className="flex justify-between gap-28 border-b border-[#E5E7EB]">
                        <p className="font-semibold">Tạm tính:</p>
                        <p>{currencyHandleProvider(totalMoney)}</p>
                    </div>
                    <div className="flex justify-between gap-28 border-b border-[#E5E7EB]">
                        <p className="font-semibold">Giảm giá:</p>
                        <p>0</p>
                    </div>
                    <div className="flex justify-between gap-28 border-b border-[#E5E7EB]">
                        <p className="font-semibold">Thành tiền:</p>
                        <p className="font-semibold">{currencyHandleProvider(totalMoney)}</p>
                    </div>
                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full">
                                    Đặt hàng
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='bg-white'>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Thông báo!</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bạn có chắc chắn muốn đặt hàng ?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            handleOrder().catch((error) => {
                                                toast({
                                                    variant: 'destructive',
                                                    title: 'Có lỗi xảy ra khi đặt hàng',
                                                    description:
                                                        'Có lỗi xảy ra khi đặt hàng vui lòng thử lại sau',
                                                    action: (
                                                        <ToastAction altText="Try again">
                                                            Xác nhận!
                                                        </ToastAction>
                                                    ),
                                                });
                                                console.error(
                                                    `Error occurred in CartPage: ${error.message}`,
                                                );
                                            });
                                        }}
                                    >Đặt hàng</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </section>
            <CartDialog open={dialogOpen} setOpen={setDialogOpen} />

        </section>
    );
}
