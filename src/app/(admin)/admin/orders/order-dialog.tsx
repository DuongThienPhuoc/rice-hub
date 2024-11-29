'use client';

import React, { useEffect } from 'react';
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
import { getProductListByAdmin, ProductDtoList } from '@/data/customer-product';
import { Button } from '@/components/ui/button';
import { ProductOrderRequest } from '@/type/order';
import { CirclePlus, Search, Trash2 } from 'lucide-react';
import OrderPopoverProvider from '@/app/(admin)/admin/orders/order-popover';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { CustomerResponse, Customer } from '@/type/customer';
import { getCustomerList } from '@/data/customer';
import { Input } from '@/components/ui/input';
import { AdminCreateOrderRequest } from '@/type/order';
import { adminCreateOrder } from '@/data/order';
import { useToast } from '@/hooks/use-toast';
import AlertDelete from '@/app/(admin)/admin/orders/alert-delete';
import AlertSubmitOrder from '@/app/(admin)/admin/orders/alert-submit-order';

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
    const [selectedProducts, setSelectedProducts] = React.useState<
        ProductOrderRequest[]
    >([]);
    const [selectedProduct, setSelectedProduct] =
        React.useState<ProductOrderRequest>();
    const [type, setType] = React.useState<string>('');
    const [productUnit, setProductUnit] = React.useState<string>('');
    const [quantity, setQuantity] = React.useState<number>(1);
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [filterCustomers, setFilterCustomers] = React.useState<Customer[]>(
        [],
    );
    const [selectedCustomer, setSelectedCustomer] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');
    const [alertDelete, setAlertDelete] = React.useState<boolean>(false);
    const [alertSubmitOrder, setAlertSubmitOrder] =
        React.useState<boolean>(false);
    const [indexItemDelete, setIndexItemDelete] = React.useState<number>(0);
    const { toast } = useToast();

    async function getProduct() {
        try {
            const response = await getProductListByAdmin({
                pageSize: 5,
                // pageNumber: currentPage + 1,
                // categoryName: selectedCategory,
            });
            setProducts(response.data._embedded.productDtoList);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(
                    `An error occurred while fetching products: ${e.message}`,
                );
            }
            throw new Error('An error occurred while fetching products');
        }
    }

    async function fetchCustomerList() {
        try {
            const response = await getCustomerList<CustomerResponse>();
            setCustomers(response._embedded?.customerList);
            setFilterCustomers(response._embedded?.customerList);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(
                    `An error occurred while fetching customers: ${e.message}`,
                );
            }
        }
    }

    function addProductToOrder() {
        setSelectedProducts((prev) => [...prev, selectedProduct || {}]);
    }

    async function createOrder() {
        if (selectedProducts.length === 0) {
            setError('Vui lòng chọn sản phẩm');
            return;
        } else if (selectedCustomer === '') {
            setError('Vui lòng chọn khách hàng');
            return;
        } else {
            const orderRequest: AdminCreateOrderRequest = {
                customerId: parseInt(selectedCustomer),
                orderDetails: selectedProducts,
            };
            try {
                const response = await adminCreateOrder(orderRequest);
                if (response.status === 200) {
                    setError('');
                    setSelectedProducts([]);
                    setSelectedCustomer('');
                    toast({
                        title: 'Tạo đơn hàng thành công',
                        description: 'Đơn hàng đã được tạo thành công',
                    });
                    setIsOpen(false);
                    setNewOrder(!newOrder);
                } else {
                    setError('Đã có lỗi xảy ra, vui lòng thử lại');
                }
            } catch (e) {
                if (e instanceof Error) {
                    throw new Error(
                        `An error occurred while creating order: ${e.message}`,
                    );
                }
            }
        }
    }

    function handleCustomerSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const searchValue = e.target.value;
        setFilterCustomers(
            customers.filter((customer) =>
                customer.name.toLowerCase().includes(searchValue.toLowerCase()),
            ),
        );
    }

    function deleteCartItem() {
        setSelectedProducts((prev) =>
            prev.filter((_item, i) => i !== indexItemDelete),
        );
    }

    useEffect(() => {
        getProduct().catch((e) => console.error(e));
        fetchCustomerList().catch((e) => console.error(e));
    }, []);

    useEffect(() => {
        setSelectedProduct((prev) => ({
            ...prev,
            quantity: quantity,
            weightPerUnit: parseInt(type),
            productUnit: productUnit,
        }));
    }, [type, quantity]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[60vw] w-[100vw]">
                <DialogHeader>
                    <DialogTitle className="scroll-m-20 font-roboto border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
                        Tạo đơn hàng
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <section className="max-h-[650px] overflow-y-auto">
                    <div>
                        <Label htmlFor="customer">Khách hàng</Label>

                        <Select
                            value={selectedCustomer}
                            onValueChange={(e) => setSelectedCustomer(e)}
                        >
                            <SelectTrigger id="customer" className="w-[280px] bg-[#4ba94d] text-white">
                                <SelectValue placeholder="Chọn khách hàng" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="relative">
                                    <Search className="absolute w-4 h-4 left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm khách hàng"
                                        className="pl-8 h-8"
                                        onChange={(e) =>
                                            handleCustomerSearch(e)
                                        }
                                    />
                                </div>
                                <SelectGroup>
                                    <SelectLabel>Chọn khách hàng</SelectLabel>
                                    {filterCustomers?.map((customer) => (
                                        <SelectItem
                                            key={customer.id}
                                            value={customer.id.toString()}
                                        >
                                            <div className="text-md font-semibold">
                                                {customer.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{`SDT: ${customer.phone}`}</div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator orientation="horizontal" className="my-4" />
                    <div className="space-y-2">
                        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            Sản phẩm
                        </h1>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader className='bg-[#0090d9]'>
                                    <TableRow>
                                        <TableHead><p className='text-white font-semibold'>Tên hàng hoá</p></TableHead>
                                        <TableHead><p className='text-white font-semibold'>Danh mục</p></TableHead>
                                        <TableHead><p className='text-white font-semibold'>Đơn giá (kg)</p></TableHead>
                                        <TableHead className="text-center">
                                            <p className='text-white font-semibold'>Thêm</p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-semibold">
                                                {product.name}
                                            </TableCell>
                                            <TableCell>
                                                {product.categoryName}
                                            </TableCell>
                                            <TableCell>
                                                {product.customerPrice}
                                            </TableCell>
                                            <TableCell className="flex justify-center">
                                                <OrderPopoverProvider
                                                    unitWeightPairsList={
                                                        product.unitWeightPairsList
                                                    }
                                                    type={type}
                                                    setType={setType}
                                                    quantity={quantity}
                                                    setProductUnit={setProductUnit}
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {selectedProducts.length > 0 && (
                        <>
                            <Separator
                                orientation="horizontal"
                                className="my-4"
                            />
                            <div className="space-y-2">
                                <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                    Giỏ hàng
                                </h1>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader className='bg-[#0090d9]'>
                                            <TableRow>
                                                <TableHead>
                                                    <p className='font-semibold text-white'>Tên hàng hoá</p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className='font-semibold text-white'>Loại</p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className='font-semibold text-white'>Số lượng (Bao)</p>
                                                </TableHead>
                                                <TableHead>
                                                    <p className='font-semibold text-white'>Đơn giá</p>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <p className='font-semibold text-white'>Xoá</p>
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
                                                        <TableCell>
                                                            {`${product.weightPerUnit} KG`}
                                                        </TableCell>
                                                        <TableCell>
                                                            {product.quantity}
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
                            onClick={() => {
                                setError('');
                                setSelectedProducts([]);
                                setSelectedCustomer('');
                                setIsOpen(false);
                            }}
                        >
                            Huỷ
                        </Button>
                        <Button onClick={() => setAlertSubmitOrder(true)}>
                            Tạo đơn hàng
                        </Button>
                    </div>
                </section>
                <AlertDelete
                    isOpen={alertDelete}
                    setIsOpen={setAlertDelete}
                    deleteItem={deleteCartItem}
                />
                <AlertSubmitOrder
                    isOpen={alertSubmitOrder}
                    setIsOpen={setAlertSubmitOrder}
                    createOrder={createOrder}
                />
            </DialogContent>
        </Dialog>
    );
};

export default OrderDialogProvider;
