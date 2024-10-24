'use client';

import { ChevronDown, Search, ShoppingCart, CirclePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import OrderPageDialog from '@/app/(customer)/order/dialog';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { orderStore } from '@/stores/orderStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { getProductList } from '@/data/customer-product';
import { useProductStore } from '@/stores/productStore';
import PaginationComponent from '@/components/pagination/pagination';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import OrderPageBreadcrumb from '@/app/(customer)/order/breadcrumb';

export default function OrderPage() {
    const router = useRouter();

    interface ProductCategory {
        id: number;
        name: string;
    }

    const productCategories: Array<ProductCategory> = [
        { id: 1, name: 'Cám' },
        { id: 2, name: 'Cám cp' },
        { id: 3, name: 'Đỗ' },
        { id: 4, name: 'Gạo rượu' },
        { id: 5, name: 'Men rượu' },
    ];

    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(productCategories);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const product = orderStore((state) => state.product);
    // const updateProducts = orderStore((state) => state.updateProducts);
    const products = useProductStore((state) => state.products);
    const setProducts = useProductStore((state) => state.setProducts);

    function handleSearchCategory(e: ChangeEvent<HTMLInputElement>) {
        setCategory(
            productCategories.filter((category) =>
                category.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()),
            ),
        );
    }

    async function getProduct() {
        try {
            const response = await getProductList({
                pageSize: 5,
                pageNumber: currentPage + 1,
            });
            setProducts(response.data._embedded.productDtoList);
            setTotalPages(response.data.page.totalPages);
        }catch (e) {
            if(e instanceof Error){
                throw new Error(`An error occurred while fetching products: ${e.message}`)
            }
            throw new Error('An error occurred while fetching products')
        }
    }

    useEffect(() => {
        getProduct()
            .catch((e) => console.error(e));
    }, [currentPage]);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <OrderPageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <div className="grid grid-cols-5 gap-x-2">
                    <section>
                        <section className="bg-white p-3 rounded-lg flex flex-col gap-y-2">
                            <div className="flex justify-between text-[16px] font-bold">
                                <h1>Nhóm hàng</h1>
                                <span>
                                    <ChevronDown />
                                </span>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2  h-4 w-4 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm nhóm hàng"
                                    className="pl-9"
                                    onChange={handleSearchCategory}
                                />
                            </div>
                            <div>
                                <ul>
                                    {category.map((category) => (
                                        <li
                                            key={category.id}
                                            className="p-2 font-normal hover:bg-gray-100 cursor-pointer"
                                        >
                                            {category.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </section>
                    <section className="col-span-4">
                        <section className="mb-2 flex justify-between">
                            <div className="flex gap-x-1">
                                <Input
                                    type="text"
                                    className="bg-white"
                                    placeholder="Lọc tên hàng hoá"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="gap-1 bg-white border-dashed"
                                        >
                                            <CirclePlus className="h-3.5 w-3.5" />
                                            <span>Loại</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="start"
                                        className="p-0 w-50"
                                    >
                                        <div className="p-2 border-b">
                                            <div className="relative">
                                                <Search className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    className="pl-6 h-full rounded outline-0 focus:outline-0"
                                                    placeholder="Loại"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <ul>
                                                {productCategories.map(
                                                    (category) => (
                                                        <li
                                                            key={category.id}
                                                            className="flex items-center gap-x-1 hover:bg-gray-100 p-2 rounded-lg"
                                                        >
                                                            <Checkbox
                                                                id={category.id.toString()}
                                                            />
                                                            <label
                                                                className="text-sm font-medium w-full"
                                                                htmlFor={category.id.toString()}
                                                            >
                                                                {category.name}
                                                            </label>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <Button
                                    variant="outline"
                                    className="gap-1 bg-white"
                                    onClick={() => router.push('/cart')}
                                >
                                    <ShoppingCart className="h-3.5 w-3.5" />
                                    <span>Giỏ hàng</span>
                                </Button>
                            </div>
                        </section>
                        <section className="bg-white p-5 rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên hàng hoá</TableHead>
                                        <TableHead>Loại</TableHead>
                                        <TableHead>Đơn vị</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product, key) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium hover:cursor-pointer">
                                                {product.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {product.categoryId === '1'
                                                        ? 'Gạo'
                                                        : product.categoryId ===
                                                        '2'
                                                            ? 'Cám'
                                                            : product.categoryId ===
                                                            '3'
                                                                ? 'Thóc'
                                                                : product.categoryId ===
                                                                '4'
                                                                    ? 'Trấu'
                                                                    : 'Thức ăn chăn nuôi'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {product.unitOfMeasureId ===
                                                    1
                                                        ? 'Tấn'
                                                        : product.unitOfMeasureId ===
                                                        2
                                                            ? 'Kg'
                                                            : 'Yến'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {product.price}
                                            </TableCell>
                                            <TableCell>
                                                <span>
                                                    <ShoppingCart
                                                        onClick={() => {
                                                            setOpen(true);
                                                            // updateProducts({
                                                            //     id: product.id,
                                                            //     name: product.name,
                                                            //     category:
                                                            //         product.category,
                                                            //     price: product.price,
                                                            //     type: product.type,
                                                            // });
                                                        }}
                                                        className="h-4 w-4 hover:cursor-pointer"
                                                    />
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter className="bg-white">
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="hover:bg-white"
                                        >
                                            <PaginationComponent
                                                totalPages={totalPages}
                                                currentPage={currentPage}
                                                setCurrentPage={setCurrentPage}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </section>
                    </section>
                </div>
                <OrderPageDialog
                    open={open}
                    onOpenChange={setOpen}
                    product={product}
                />
            </section>
        </>
    );
}
