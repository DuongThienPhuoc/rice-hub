'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getMissingProductListByAdmin, getProductAndIngredientListByAdmin, MissingProductDtoList, ProductDtoList } from '@/data/customer-product';
import { Button } from '@/components/ui/button';
import { ProductOrderRequest } from '@/type/order';
import { Check, CirclePlus, Search, Trash2, X } from 'lucide-react';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { Input } from '@/components/ui/input';
import { adminCreateImport } from '@/data/order';
import { useToast } from '@/hooks/use-toast';
import AlertDelete from '@/app/(admin)/admin/orders/alert-delete';
import PaginationComponent from '@/components/pagination/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Category, getCategories } from '@/data/category';
import { getSuppliers, Supplier } from '@/data/supplier';
import OrderPopoverProvider from './order-popover';
import SelectComponent from './select';
import OrderPopoverProvider2 from './order-popover2';

type OrderDialogProps = {
    children: React.ReactNode;
    newOrder: boolean;
    setNewOrder: (newOrder: boolean) => void;
};

const OrderDialogProvider: React.FC<OrderDialogProps> = ({
    children,
    setNewOrder,
    newOrder,
}) => {
    const [products, setProducts] = React.useState<ProductDtoList[]>([]);
    const [missingProducts, setMissingProducts] = React.useState<MissingProductDtoList[]>([]);
    const [selectedProducts, setSelectedProducts] = React.useState<
        ProductOrderRequest[]
    >([]);
    const [selectedProduct, setSelectedProduct] =
        React.useState<ProductOrderRequest>();
    const [type, setType] = React.useState<string>('');
    const [productUnit, setProductUnit] = React.useState<string>('');
    const [quantity, setQuantity] = React.useState<number>(1);
    const [supplier, setSupplier] = React.useState<Supplier[]>([]);
    const [filterSuppliers, setFilterSuppliers] = React.useState<Supplier[]>(
        [],
    );
    const [defaultValue, setDefault] = React.useState<string>('NORMAL');
    const [selectedSupplier, setSelectedSupplier] = React.useState<string | null>('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');
    const [alertDelete, setAlertDelete] = React.useState<boolean>(false);
    const [indexItemDelete, setIndexItemDelete] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const { toast } = useToast();
    const [productCategories, setProductCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [search, setSearch] = useState<string>('');
    let updated = false;
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

    async function getProduct() {
        try {
            const response = await getProductAndIngredientListByAdmin({
                pageSize: 5,
                supplierName: selectedSupplier,
                pageNumber: currentPage + 1,
                categoryName: selectedCategory?.name,
                name: search,
            });
            setProducts(response.data._embedded?.productDtoList || []);
            setTotalPages(response.data.page.totalPages);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(
                    `An error occurred while fetching products: ${e.message}`,
                );
            }
            throw new Error('An error occurred while fetching products');
        }
    }

    async function getMissingProduct() {
        try {
            const response = await getMissingProductListByAdmin({
                pageSize: 5,
                supplierName: selectedSupplier || null,
                pageNumber: currentPage + 1,
                categoryName: selectedCategory?.name,
                name: search || null,
            });
            setMissingProducts(response.data._embedded?.missingProductDtoList || []);
            setTotalPages(response.data.page.totalPages);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(
                    `An error occurred while fetching products: ${e.message}`,
                );
            }
            throw new Error('An error occurred while fetching products');
        }
    }

    async function fetchSupplierList() {
        try {
            const response = await getSuppliers<Supplier[]>();
            setSupplier(response);
            setFilterSuppliers(response);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(
                    `An error occurred while fetching suppliers: ${e.message}`,
                );
            }
        }
    }

    function addProductToOrder() {
        const prevProduct = [...selectedProducts];
        setError("");
        prevProduct.forEach((product) => {
            if (!product.quantity) product.quantity = 0;
            if (product.productId === selectedProduct?.productId && product.productUnit === selectedProduct?.productUnit && product.weightPerUnit === selectedProduct?.weightPerUnit) {
                product.quantity += selectedProduct?.quantity || 0;
                updated = true;
            }
        })
        if (!updated) {
            setSelectedProducts((prev) => [...prev, selectedProduct as ProductOrderRequest]);
        } else {
            setSelectedProducts(prevProduct);
        }
    }

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    async function createImport() {
        if (selectedProducts.length === 0) {
            setError('Chưa chọn sản phẩm. Vui lòng thêm sản phẩm trước khi tiếp tục.');
            return;
        }

        if (!selectedSupplier) {
            setError('Chưa chọn nhà sản xuất. Vui lòng chọn nhà sản xuất.');
            return;
        }

        const orderRequest = {
            orderDetails: selectedProducts,
        };

        try {
            const response = await adminCreateImport(orderRequest);

            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                const contentDisposition = response.headers['content-disposition'];
                const filename = contentDisposition && contentDisposition.includes('filename=')
                    ? contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '').trim()
                    : `PhieuNhapHang_${getCurrentDateTime()}.xlsx`;

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                setError('');
                setSelectedProducts([]);
                setSelectedSupplier('');
                setIsOpen(false);
                setNewOrder(!newOrder);
                toast({
                    title: 'Tạo phiếu nhập hàng thành công',
                    description: 'Phiếu nhập hàng đã được tạo thành công.',
                    style: { backgroundColor: '#4caf50', color: '#fff' },
                    duration: 3000,
                });
            } else {
                setError(response.data.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (e) {
            console.error('Lỗi khi tạo phiếu nhập hàng:', e);
            setError('Đã có lỗi xảy ra khi tạo phiếu nhập hàng. Vui lòng thử lại.');
        }
    }

    function handleSupplierSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const searchValue = e.target.value;
        setFilterSuppliers(
            supplier.filter((supplier) =>
                supplier.name.toLowerCase().includes(searchValue.toLowerCase()),
            ),
        );
    }

    function deleteCartItem() {
        setSelectedProducts((prev) =>
            prev.filter((_item, i) => i !== indexItemDelete),
        );
    }

    useEffect(() => {
        if (defaultValue === 'NORMAL') {
            getProduct().catch((e) => console.error(e));
        } else {
            getMissingProduct().catch((e) => console.error(e));
        }
        fetchSupplierList().catch((e) => console.error(e));
    }, [selectedSupplier, defaultValue, currentPage, selectedCategory, search]);

    useEffect(() => {
        setSelectedProduct((prev) => ({
            ...prev,
            quantity: quantity,
            weightPerUnit: parseInt(type),
            productUnit: productUnit,
        }));
    }, [type, quantity]);

    useEffect(() => {
        fetchCategories().catch((e) => console.error(e))
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[60vw] w-[100vw]">
                <DialogHeader>
                    <DialogTitle className="scroll-m-20 font-roboto border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                        Tạo phiếu nhập hàng
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <section className="max-h-[650px] overflow-y-auto">
                    <>
                        <div>
                            <Label htmlFor="customer">Nhà sản xuất</Label>

                            <Select
                                value={selectedSupplier || ''}
                                onValueChange={(e) => {
                                    setError('');
                                    setSelectedSupplier(e);
                                    setSelectedProducts([]);
                                }}
                            >
                                <SelectTrigger
                                    id="customer"
                                    className="w-[280px] bg-[#4ba94d] text-white"
                                >
                                    <SelectValue placeholder="Chọn nhà sản xuất" />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="relative">
                                        <Search className="absolute w-4 h-4 left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm kiếm nhà sản xuất"
                                            className="pl-8 h-8"
                                            onChange={(e) =>
                                                handleSupplierSearch(e)
                                            }
                                        />
                                    </div>
                                    <SelectGroup>
                                        <SelectLabel>Chọn nhà sản xuất</SelectLabel>
                                        {filterSuppliers
                                            ?.filter((supplier) => supplier.id !== 1 && supplier.active === true)
                                            .map((supplier) => (
                                                <SelectItem key={supplier.id} value={supplier.name.toString()}>
                                                    <div className="text-md font-semibold">{supplier.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {`SĐT: ${supplier.phoneNumber}`}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {`Email: ${supplier.email}`}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {`Người liên hệ: ${supplier.contactPerson}`}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator orientation="horizontal" className="my-4" />
                    </>
                    <div className="space-y-2">
                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            <div className="flex justify-between">
                                <span>
                                    <SelectComponent
                                        isShowing={defaultValue}
                                        setStatusUpdate={
                                            setDefault
                                        }
                                        setCurrentPage={
                                            setCurrentPage
                                        }
                                    />
                                </span>
                            </div>
                        </h1>
                        <div className="flex gap-1">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                className="bg-white w-52"
                                placeholder="Lọc tên hàng hoá"
                            />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="h-[36px] px-5 bg-white rounded-md border border-dashed flex items-center gap-1 hover:cursor-pointer">
                                        <CirclePlus className="h-4 w-4" />
                                        <span className="text-sm font-semibold">
                                            Danh mục
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
                                                placeholder="Danh mục"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <ul>
                                            {productCategories?.map(
                                                (category, index) => (
                                                    <li
                                                        key={index}
                                                        className="relative flex items-center gap-x-1 hover:bg-gray-100 p-2 rounded-lg hover:cursor-pointer text-sm font-medium"
                                                        onClick={() => {
                                                            setSelectedCategory(
                                                                category,
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
                                    onClick={() => {
                                        setSelectedCategory(null)
                                    }}
                                >
                                    <span>Bỏ lọc</span>
                                    <X className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                        <div className="border rounded-md">
                            {defaultValue === 'NORMAL' ? (
                                <Table>
                                    <TableHeader className="bg-[#0090d9]">
                                        <TableRow>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Tên hàng hoá
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Danh mục
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Nhà sản xuất
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Giá nhập trước đó (kg)
                                                </p>
                                            </TableHead>
                                            <TableHead className="text-center">
                                                <p className="text-white font-semibold">
                                                    Thêm
                                                </p>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.length > 0 ? products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-semibold">
                                                    {product.name}
                                                </TableCell>
                                                <TableCell>
                                                    {product.categoryName}
                                                </TableCell>
                                                <TableCell>
                                                    {product.supplierName}
                                                </TableCell>
                                                <TableCell>
                                                    {currencyHandleProvider(product.importPrice || 0)}
                                                </TableCell>
                                                <TableCell className="flex justify-center">
                                                    <OrderPopoverProvider
                                                        unitWeightPairsList={
                                                            product.unitWeightPairsList
                                                        }
                                                        type={type}
                                                        setType={setType}
                                                        quantity={quantity}
                                                        setProductUnit={
                                                            setProductUnit
                                                        }
                                                        setQuantity={setQuantity}
                                                        addProductToOrder={
                                                            addProductToOrder
                                                        }
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="flex items-center justify-between"
                                                            onClick={() =>
                                                                setSelectedProduct({
                                                                    productId:
                                                                        product.id,
                                                                    quantity: 0,
                                                                    weightPerUnit: 0,
                                                                    name: product.name,
                                                                    categoryName: product.categoryName,
                                                                    supplierName: product.supplierName,
                                                                    unitPrice:
                                                                        product.customerPrice,
                                                                })
                                                            }
                                                        >
                                                            <CirclePlus className="w-4 h-4" />
                                                            Thêm
                                                        </Button>
                                                    </OrderPopoverProvider>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="font-semibold">
                                                    <div className='flex justify-center items-center w-full h-[200px]'>
                                                        Không có sản phẩm
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-[#0090d9]">
                                        <TableRow>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Tên hàng hoá
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Danh mục
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Nhà sản xuất
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Quy cách
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Số lượng thiếu
                                                </p>
                                            </TableHead>
                                            <TableHead>
                                                <p className="text-white font-semibold">
                                                    Giá nhập trước đó (kg)
                                                </p>
                                            </TableHead>
                                            <TableHead className="text-center">
                                                <p className="text-white font-semibold">
                                                    Thêm
                                                </p>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {missingProducts.length > 0 ? missingProducts.map((missingProduct) => (
                                            <TableRow key={missingProduct.id}>
                                                <TableCell className="font-semibold">
                                                    {missingProduct.name}
                                                </TableCell>
                                                <TableCell>
                                                    {missingProduct.categoryName}
                                                </TableCell>
                                                <TableCell>
                                                    {missingProduct.supplierName}
                                                </TableCell>
                                                <TableCell>
                                                    {missingProduct.unit} {missingProduct.weightPerUnit} kg
                                                </TableCell>
                                                <TableCell>
                                                    {missingProduct.missingQuantity} {missingProduct.unit}
                                                </TableCell>
                                                <TableCell>
                                                    {currencyHandleProvider(missingProduct.importPrice || 0)}
                                                </TableCell>
                                                <TableCell className="flex justify-center">
                                                    <OrderPopoverProvider2
                                                        type={missingProduct.weightPerUnit.toString()}
                                                        setType={setType}
                                                        quantity={quantity}
                                                        setQuantity={setQuantity}
                                                        addProductToOrder={
                                                            addProductToOrder
                                                        }
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="flex items-center justify-between"
                                                            onClick={() => {
                                                                setSelectedProduct({
                                                                    productId:
                                                                        missingProduct.id,
                                                                    productUnit: missingProduct.unit,
                                                                    quantity: quantity,
                                                                    weightPerUnit: missingProduct.weightPerUnit,
                                                                    name: missingProduct.name,
                                                                    categoryName: missingProduct.categoryName,
                                                                    supplierName: missingProduct.supplierName,
                                                                    unitPrice: missingProduct.importPrice,
                                                                })
                                                            }}
                                                        >
                                                            <CirclePlus className="w-4 h-4" />
                                                            Thêm
                                                        </Button>
                                                    </OrderPopoverProvider2>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="font-semibold">
                                                    <div className='flex justify-center items-center w-full h-[200px]'>
                                                        Không có sản phẩm
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div>
                                <PaginationComponent
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}
                    </div>
                    {selectedProducts.length > 0 && (
                        <>
                            <Separator
                                orientation="horizontal"
                                className="my-4"
                            />
                            <div className="space-y-2">
                                <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                    Danh sách hàng cần nhập
                                </h1>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader className="bg-[#0090d9]">
                                            <TableRow>
                                                <TableHead>
                                                    <p className="font-semibold text-white">
                                                        Tên hàng hoá
                                                    </p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className="font-semibold text-white">
                                                        Danh mục
                                                    </p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className="font-semibold text-white">
                                                        Nhà sản xuất
                                                    </p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className="font-semibold text-white">
                                                        Loại
                                                    </p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className="font-semibold text-white">
                                                        Số lượng
                                                    </p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className="font-semibold text-white">
                                                        Giá nhập trước đó (kg)
                                                    </p>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <p className="font-semibold text-white">
                                                        Xoá
                                                    </p>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedProducts.map(
                                                (product, _index) => (
                                                    <TableRow
                                                        key={product.productId}
                                                    >
                                                        <TableCell className="font-semibold h-12">
                                                            {product.name}
                                                        </TableCell>
                                                        <TableCell className="font-semibold h-12">
                                                            {product.categoryName}
                                                        </TableCell>
                                                        <TableCell className="font-semibold h-12">
                                                            {product.supplierName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {`${product.productUnit} ${product.weightPerUnit} kg`}
                                                        </TableCell>
                                                        <TableCell>
                                                            {product.quantity} {product.productUnit}
                                                        </TableCell>
                                                        <TableCell>
                                                            {currencyHandleProvider(
                                                                product.unitPrice ||
                                                                0,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="flex justify-center">
                                                            <Button
                                                                className="flex items-center"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setIndexItemDelete(
                                                                        _index,
                                                                    );
                                                                    setAlertDelete(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Xoá</span>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </>
                    )}
                </section>
                <section>
                    {error && (
                        <div className="p-1 bg-destructive text-white text-sm font-semibold text-center rounded">
                            <span>{error}</span>
                        </div>
                    )}
                </section>
                <section>
                    <div className="flex gap-2 justify-end">
                        <Button
                            className="bg-red-600 hover:bg-red-500"
                            onClick={() => {
                                setError('');
                                setSelectedProducts([]);
                                setSelectedSupplier('');
                                setIsOpen(false);
                            }}
                        >
                            Huỷ
                        </Button>
                        <Button onClick={() => {
                            if (selectedSupplier === '' || selectedSupplier === null) {
                                setError('Vui lòng chọn nhà sản xuất')
                                return
                            }
                            createImport();
                        }}>
                            Tạo phiếu nhập hàng
                        </Button>
                    </div>
                </section>
                <AlertDelete
                    isOpen={alertDelete}
                    setIsOpen={setAlertDelete}
                    deleteItem={deleteCartItem}
                />
            </DialogContent>
        </Dialog>
    );
};

export default OrderDialogProvider;
