'use client';

import { Search, ShoppingCart, CirclePlus, X } from 'lucide-react';
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
import React, { useEffect, useState } from 'react';
import { orderStore } from '@/stores/orderStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { getProductList } from '@/data/customer-product';
import { useProductStore } from '@/stores/productStore';
import PaginationComponent from '@/components/pagination/pagination';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { SidebarTriggerCommon } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import OrderPageBreadcrumb from '@/app/(customer)/order/breadcrumb';
import { getCategories, Category } from '@/data/category';

export default function OrderPage() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const product = orderStore((state) => state.product);
    const updateProducts = orderStore((state) => state.updateProducts);
    const products = useProductStore((state) => state.products);
    const setProducts = useProductStore((state) => state.setProducts);
    const [productCategories,setProductCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    async function getProduct() {
        try {
            const response = await getProductList({
                pageSize: 5,
                pageNumber: currentPage + 1,
                categoryName: selectedCategory?.name,
            });
            setProducts(response.data._embedded?.productDtoList);
            setTotalPages(response.data.page.totalPages);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`An error occurred while fetching products: ${e.message}`)
            }
            throw new Error('An error occurred while fetching products')
        }
    }

    async function fetchCategories() {
        try {
            const response = await getCategories<Category[]>();
            setProductCategories(response);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(`An error occurred while fetching categories: ${e.message}`)
            }
            throw new Error('An error occurred while fetching categories')
        }
    }

    useEffect(() => {
        fetchCategories()
            .catch((e) => console.error(e));
    }, []);

    useEffect(() => {
        getProduct()
            .catch((e) => console.error(e));
    }, [currentPage, selectedCategory]);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
                <SidebarTriggerCommon />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <OrderPageBreadcrumb />
            </header>
            <section className="container mx-auto">
                <div>
                    <section className="col-span-4">
                        <section className="mb-2 flex justify-between">
                            <div className="flex gap-1">
                                <Input
                                    type="text"
                                    className="bg-white"
                                    placeholder="Lọc tên hàng hoá"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="h-[36px] px-5 bg-white rounded-md border border-dashed flex items-center gap-1 hover:cursor-pointer">
                                            <CirclePlus className="h-4 w-4" />
                                            <span className="text-sm font-semibold">
                                                Loại
                                            </span>
                                            {selectedCategory !== null && (
                                                <>
                                                    <Separator
                                                        orientation="vertical"
                                                        className="h-4 mx-2"
                                                    />
                                                    <div className="h-auto text-sm font-medium leading-none bg-[#f4f4f5] px-[4px] py-[5px] rounded-md  items-center inline-flex whitespace-nowrap">
                                                        {selectedCategory?.name}
                                                    </div>
                                                </>
                                            )}
                                        </div>
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
                                                    (category, index) => (
                                                        <li
                                                            key={index}
                                                            className="relative flex items-center gap-x-1 hover:bg-gray-100 p-2 rounded-lg hover:cursor-pointer text-sm font-medium"
                                                            onClick={() => {
                                                                setSelectedCategory(
                                                                    category
                                                                );
                                                            }}
                                                        >
                                                            {selectedCategory ===
                                                                category && (
                                                                <Check className="h-4 w-4 absolute left-2" />
                                                            )}
                                                            <span className="pl-5">
                                                                {category.name}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                {selectedCategory !== null && (
                                    <div
                                        className="whitespace-nowrap text-sm font-medium leading-none flex items-center gap-1 hover:cursor-pointer hover:bg-white px-4 rounded-md"
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        <span>Bỏ lọc</span>
                                        <X className="h-4 w-4" />
                                    </div>
                                )}
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
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead className="text-center w-36">
                                            Thêm vào giỏ hàng
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products?.map((product, key) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium hover:cursor-pointer">
                                                {product.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {product.categoryName}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {currencyHandleProvider(
                                                    Number(
                                                        product.customerPrice,
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell className="flex justify-center">
                                                <span>
                                                    <ShoppingCart
                                                        onClick={() => {
                                                            setOpen(true);
                                                            updateProducts({
                                                                id: product.id,
                                                                productCode:
                                                                    product.productCode,
                                                                name: product.name,
                                                                description:
                                                                    product.description,
                                                                categoryName:
                                                                    product.categoryName,
                                                                customerPrice:
                                                                    product.customerPrice,
                                                                image: product.image,
                                                                categoryId:
                                                                    product.categoryId,
                                                                supplierId:
                                                                    product.supplierId,
                                                                unitOfMeasureId:
                                                                    product.unitOfMeasureId,
                                                                unitWeightPairsList:
                                                                    product.unitWeightPairsList,
                                                                warehouseId:
                                                                    product.warehouseId,
                                                            });
                                                        }}
                                                        className="h-5 w-5 hover:cursor-pointer"
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
