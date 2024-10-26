'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import CartDialog from "@/app/(customer)/cart/dialog";
import { useProductSelectedStore } from '@/stores/cartTableStore'
import { Trash2 } from 'lucide-react';

export default function CartTable() {

    interface Product {
        id: number;
        productId: string;
        name: string;
        type: string;
        quantity: number;
        price: number;
    }

    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const localStorageProducts =
            typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
        const parsedProducts: Product[] = localStorageProducts
            ? JSON.parse(localStorageProducts)
            : [];
        setProducts(parsedProducts);
    }, []);

    const selectedProduct = useProductSelectedStore(state => state.selected)
    const updateSelectedProduct = useProductSelectedStore(state => state.handleSelected)
    const updateSelectedAllProduct = useProductSelectedStore(state => state.handleSelectedAll)
    const totalMoney = useProductSelectedStore(state => state.total)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    function handleDeleteProduct(id: number) {
        const newProducts = products.filter(product => product.id != id)
        localStorage.setItem('cart', JSON.stringify(newProducts))
        setProducts(newProducts)
    }

    return (
        <section className="grid gap-5">
            <div className="bg-white p-3 rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Checkbox
                                    onCheckedChange={() => {
                                        updateSelectedAllProduct(products);
                                    }}
                                />
                            </TableHead>
                            <TableHead>Mã sản phẩm</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Số lượng</TableHead>
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
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={
                                                !!selectedProduct.find(
                                                    (selectedProduct) =>
                                                        selectedProduct.id ===
                                                        product.id,
                                                )
                                            }
                                            onCheckedChange={() =>
                                                updateSelectedProduct(product)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{product.productId}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.type}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>
                                        <Trash2
                                            className="w-4 h-4 hover:cursor-pointer"
                                            onClick={() =>
                                                handleDeleteProduct(product.id)
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
                        <p>{totalMoney}</p>
                    </div>
                    <div className="flex justify-between gap-28 border-b border-[#E5E7EB]">
                        <p className="font-semibold">Giảm giá:</p>
                        <p>0</p>
                    </div>
                    <div className="flex justify-between gap-28 border-b border-[#E5E7EB]">
                        <p className="font-semibold">Thành tiền:</p>
                        <p className="font-semibold">{totalMoney}</p>
                    </div>
                    <div>
                        <Button
                            className="w-full"
                            onClick={() => {
                                setDialogOpen(true);
                                console.log(selectedProduct);
                            }}
                        >
                            Đặt hàng
                        </Button>
                    </div>
                </div>
            </section>
            <CartDialog open={dialogOpen} setOpen={setDialogOpen} />
        </section>
    );
}