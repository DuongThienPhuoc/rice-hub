'use client';
import {
    ChevronDown,
    Search,
    ShoppingCart,
    CirclePlus,
    Check,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import OrderPageDialog from '@/app/(customer)/order/dialog';
import { ChangeEvent, useState } from 'react';
import { orderStore } from '@/stores/orderStore';
import OrderPageBreadcrumb from '@/app/(customer)/order/breadcrumb';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

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

    interface Product {
        id: string;
        name: string;
        category: string;
        unit: 'kg' | 'ton';
        price: number;
        type: number[];
    }

    const products: Array<Product> = [
        {
            id: 'SP001',
            name: 'Cám con cò 1',
            category: 'Cám',
            unit: 'kg',
            price: 10000,
            type: [10, 25, 30],
        },
        {
            id: 'SP002',
            name: 'Cám con cò 2',
            category: 'Cám',
            unit: 'kg',
            price: 20000,
            type: [10, 25, 50],
        },
        {
            id: 'SP003',
            name: 'Cám con cò 3',
            category: 'Cám',
            unit: 'kg',
            price: 30000,
            type: [10, 25, 35],
        },
        {
            id: 'SP004',
            name: 'Cám cp 1',
            category: 'Cám',
            unit: 'kg',
            price: 10000,
            type: [10, 25, 50],
        },
        {
            id: 'SP005',
            name: 'Cám cp 2',
            category: 'Cám',
            unit: 'kg',
            price: 10000,
            type: [10, 25, 50],
        },
        {
            id: 'SP006',
            name: 'Cám cp 3',
            category: 'Cám',
            unit: 'kg',
            price: 10000,
            type: [10, 25, 50],
        },
        {
            id: 'SP007',
            name: 'Đỗ 1',
            category: 'Đỗ',
            unit: 'kg',
            price: 30000,
            type: [10, 25, 50],
        },
        {
            id: 'SP008',
            name: 'Đỗ 2',
            category: 'Đỗ',
            unit: 'kg',
            price: 30000,
            type: [10, 25, 50],
        },
        {
            id: 'SP009',
            name: 'Đỗ 3',
            category: 'Đỗ',
            unit: 'kg',
            price: 10000,
            type: [10, 25, 50],
        },
        {
            id: 'SP010',
            name: 'Gạo rượu 1',
            category: 'Gạo',
            unit: 'kg',
            price: 20000,
            type: [10, 25, 50],
        },
    ];

    const [open, setOpen] = useState(false);
    //const [price, setPrice] = useState(0)
    const [category, setCategory] = useState(productCategories);
    //const [productType, setProductType] = useState<number[]>([])
    const product = orderStore((state) => state.product);
    const updateProducts = orderStore((state) => state.updateProducts);

    function handleSearchCategory(e: ChangeEvent<HTMLInputElement>) {
        setCategory(
            productCategories.filter((category) =>
                category.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()),
            ),
        );
    }

    return (
        <section className="container mx-auto">
            <OrderPageBreadcrumb />
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
                                <PopoverTrigger>
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
                                    <TableHead>Mã hàng hoá</TableHead>
                                    <TableHead>Tên hàng hoá</TableHead>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Đơn vị</TableHead>
                                    <TableHead>Đơn giá</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium h-[50px]">
                                            {product.id}
                                        </TableCell>
                                        <TableCell className="font-medium hover:cursor-pointer">
                                            {product.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {product.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {product.unit}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>
                                            <span>
                                                <ShoppingCart
                                                    onClick={() => {
                                                        setOpen(true);
                                                        updateProducts({
                                                            id: product.id,
                                                            name: product.name,
                                                            category:
                                                                product.category,
                                                            price: product.price,
                                                            type: product.type,
                                                        });
                                                    }}
                                                    className="h-4 w-4 hover:cursor-pointer"
                                                />
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
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
    );
}
