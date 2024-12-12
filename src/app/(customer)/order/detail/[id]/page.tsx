'use client'

import { generateChecksum, generateOrderCode } from "@/utils/checkSum";
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
import {
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TableHeader,
} from '@/components/ui/table';
import { Package2, Calendar, User, Truck, History, ArrowLeft, QrCode, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import OrderDetailTable from '@/app/(customer)/order/detail/[id]/table';
import React, { useEffect, useState } from 'react';
import { customerUpdateOrder, getOrderDetail } from '@/data/order';
import { Order } from '@/type/order'
import { statusProvider } from '@/utils/status-provider';
import { currencyHandleProvider } from '@/utils/currency-handle';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { usePayOS } from "@payos/payos-checkout";
import { Box, Drawer, TextField } from "@mui/material";
import api from "@/config/axiosConfig";
import { ToastAction } from "@/components/ui/toast";
import { AxiosError } from 'axios';
import { CustomerUpdateOrderRequest } from '@/type/customer-order';
import { useBreadcrumbStore } from '@/stores/breadcrumb';
import OrderDetailPageBreadcrumb from '@/app/(customer)/order/detail/[id]/breadcrumb';

type PaymentPayload = {
    amount: number;
    orderCode: number;
    description: string;
    cancelUrl: string;
    returnUrl: string;
};

export default function OrderDetailPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const API_KEY = process.env.NEXT_PUBLIC_PAYOS_API_KEY;
    const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
    const CHECKSUM_KEY = process.env.NEXT_PUBLIC_CHECKSUM_KEY;
    const router = useRouter();
    const [order, setOrder] = useState<Order>();
    const [isOpen, setIsOpen] = useState(false);
    const [validateAmount, setValidateAmount] = useState(true);
    const [isCreatingLink, setIsCreatingLink] = useState(false);
    const { setBreadcrumb } = useBreadcrumbStore()
    const { toast } = useToast();

    useEffect(() => {
        setBreadcrumb(<OrderDetailPageBreadcrumb orderID={params.id} />);
        return () => setBreadcrumb(null);
    }, [setBreadcrumb]);

    async function confirmReceived() {
        if (!order) return;
        const requestBody: CustomerUpdateOrderRequest = {
            customerId: order.customer.id,
            status: 'COMPLETE',
            totalAmount: order.totalAmount,
            deposit: order.deposit,
            remainingAmount: order.remainingAmount,
            orderPhone: order.orderPhone,
            orderAddress: order.orderAddress,
            orderDetails: order.orderDetails.map((orderDetail) => ({
                productId: orderDetail.productId,
                name: orderDetail.name,
                description: orderDetail.description,
                quantity: orderDetail.quantity,
                productUnit: orderDetail.productUnit,
                unitPrice: orderDetail.unitPrice,
                discount: orderDetail.discount,
                totalPrice: orderDetail.totalPrice,
                weightPerUnit: orderDetail.weightPerUnit,
            })),
        }
        const response = await customerUpdateOrder(order.id, requestBody);
        const status = response.status;
        if (status >= 200 && status < 300) {
            fetchOrderDetail().catch((e) => console.error(e));
        }
    }

    const handleSubmit = async (totalAmount: number) => {
        try {
            const response = await api.post(`/transaction/createTransaction`, {
                orderId: Number(params.id),
                amount: totalAmount,
                paymentMethod: 'Chuyển khoản',
            });

            if (response.status >= 200 || response.status < 300) {
                toast({
                    variant: 'default',
                    title: 'Thanh toán thành công',
                    description: `Hệ thống ghi nhận đơn hàng ${order?.orderCode} đã được thanh toán số tiền ${formatCurrency(amount)} (${capitalizeFirstLetter(numberToWords(amount))} đồng)`,
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    },
                    duration: 3000
                })
                fetchOrderDetail().catch((e) => console.error(e));
                setAmount(0);
                setDescription('');
                setIsOpen(false);
                setOpenDrawer(false);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    variant: 'destructive',
                    title: 'Thanh toán thất bại',
                    description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                    action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                    duration: 3000
                })
            }
        }
    }

    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: `http://localhost:3000/order/detail/${params.id}`,
        ELEMENT_ID: "payosEmbedded",
        CHECKOUT_URL: '',
        embedded: true,
        onSuccess: () => {
            setIsOpen(false);
            setOpenDrawer(false);
        },
        onCancel: () => {
            setIsOpen(false);
            setOpenDrawer(false);
        },
    });

    const { open, exit } = usePayOS(payOSConfig);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL && payOSConfig.CHECKOUT_URL !== '') {
            open();
        }
    }, [payOSConfig]);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpenDrawer(newOpen);
        if (isOpen === true && newOpen === false) {
            setIsOpen(false);
        }
    };

    const handleGetPaymentLink = async (paymentData: PaymentPayload) => {
        setIsCreatingLink(true);
        try {
            exit();
        } catch (err) {
            console.warn('Error exiting iframe:', err);
        }
        const checksum = generateChecksum(paymentData, CHECKSUM_KEY ? CHECKSUM_KEY : '');
        const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': CLIENT_ID ? CLIENT_ID : '',
                'x-api-key': API_KEY ? API_KEY : ''
            },
            body: JSON.stringify({
                orderCode: paymentData.orderCode,
                amount: paymentData.amount,
                description: paymentData.description,
                cancelUrl: 'https://example.com/cancel',
                returnUrl: `http://localhost:3000/order/detail/${params.id}`,
                signature: checksum,
            }),
        });
        if (response.status < 200 || response.status >= 300) {
            toast({
                variant: 'destructive',
                title: 'Hệ thống thanh toán đang gặp sự cố!',
                description: 'Xin vui lòng thử lại sau',
                duration: 3000,
            })
        }

        const result = await response.json();
        setPayOSConfig((prevConfig) => ({
            ...prevConfig,
            CHECKOUT_URL: result.data.checkoutUrl,
            onSuccess: () => {
                handleSubmit(result.data.amount);
            },
        }));

        setIsOpen(true);
        setIsCreatingLink(false);
    };

    const formatCurrency = (value: number | string | boolean) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };

    const numberToWords = (num: number): string => {
        if (num === 0) return 'không';

        const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        const tens = ['', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
        const scales = ['', 'nghìn', 'triệu', 'tỷ'];

        const readBlock = (n: number): string => {
            let str = '';
            const hundred = Math.floor(n / 100);
            const ten = Math.floor((n % 100) / 10);
            const unit = n % 10;

            if (hundred) str += units[hundred] + ' trăm ';
            if (ten > 1) {
                str += tens[ten] + ' ';
                if (unit) str += units[unit];
            } else if (ten === 1) {
                str += 'mười ';
                if (unit) str += (unit === 5 ? 'lăm' : units[unit]);
            } else if (unit) {
                str += units[unit];
            }

            return str.trim();
        };

        const splitNumber = (n: number): number[] => {
            const parts = [];
            while (n > 0) {
                parts.push(n % 1000);
                n = Math.floor(n / 1000);
            }
            return parts.reverse();
        };

        const parts = splitNumber(num);
        let result = '';

        for (let i = 0; i < parts.length; i++) {
            const block = parts[i];
            if (block > 0) {
                result += readBlock(block) + ' ' + scales[parts.length - 1 - i] + ' ';
            }
        }

        return result.trim();
    };

    const capitalizeFirstLetter = (str: string): string => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    async function fetchOrderDetail() {
        try {
            const response = await getOrderDetail(params.id);
            if (response.status === 200) {
                setOrder(response.data);
            } else {
                console.error({ data: response.data, status: response.status });
            }
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message || 'Unexpected error occurred');
            }
        }
    }

    useEffect(() => {
        fetchOrderDetail().catch((e) => console.error(e));
    }, []);

    if (!order) {
        //Todo: Add skeleton loader
        return <></>
    }

    return (
        <section className="container mx-auto space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <Package2 className="w-5 h-5" />
                            Chi tiết đơn hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Mã đơn hàng:</span>
                            <span>{order?.orderCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Ngày tạo đơn:</span>
                            <span className="flex gap-1 items-center">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(order?.orderDate || '').toLocaleDateString()}</span>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Trạng thái:</span>
                            <span>
                                <Badge variant={statusProvider(order.status).variant}>
                                    {statusProvider(order?.status).text}
                                </Badge>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Tổng tiền:</span>
                            <span className="flex gap-1 items-center">
                                <span className='font-semibold'>{currencyHandleProvider(order.totalAmount)}</span>
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <User className="w-5 h-5" />
                            Thông tin khách hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Tên:</span>
                            <span>{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">
                                Số điện thoại:
                            </span>
                            <span>{order.customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Email:</span>
                            <span>{order.customer.email}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Địa chỉ:</span>
                            <br />
                            <span className="text-sm">
                                {order.customer.address}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-1 text-lg">
                            <Truck className="w-5 h-5" />
                            Danh sách sản phẩm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='rounded border'>
                            <OrderDetailTable order={order} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <div className="text-right space-y-2">
                            <p className="font-bold">
                                Tổng cộng: {currencyHandleProvider(order?.totalAmount || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Đã thanh toán: {currencyHandleProvider(order?.receiptVoucher?.paidAmount || 0)}
                            </p>
                            <p className="mt-2 font-bold">{`Số tiền còn lại phải trả: ${currencyHandleProvider(order?.receiptVoucher?.remainAmount || 0)}`}</p>
                            <p className="mt-2 font-bold flex justify-end items-center">
                                Hạn thanh toán:
                                <Calendar className="w-4 h-4 mx-2" />
                                {order?.receiptVoucher?.dueDate ? new Date(order?.receiptVoucher?.dueDate || '').toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <div className='flex justify-between'>
                            <CardTitle className="flex items-center gap-1 text-lg">
                                <History className="w-5 h-5" />
                                <p>Lịch sử thanh toán</p>
                            </CardTitle>
                            {order?.receiptVoucher?.remainAmount > 0 && (order?.status === 'COMPLETED' || order?.status === 'COMPLETE') && (
                                <Button onClick={toggleDrawer(true)}>Thanh toán</Button>
                            )}
                            <Drawer
                                anchor={'right'}
                                open={openDrawer}
                                onClose={toggleDrawer(false)}
                            >
                                <Box sx={{ width: 400 }} role="presentation">
                                    <div className="h-[50px] w-full text-center mt-5 bg-[#0090d9]">
                                        <p className="text-white font-semibold text-[20px] pt-2">Thanh toán đơn hàng</p>
                                    </div>
                                    <div className="p-5">
                                        <div className='flex items-center space-x-2 mt-10'>
                                            <div className={`flex-1 ${!validateAmount && 'pb-10'}`}>
                                                Nhập số tiền thanh toán:
                                            </div>
                                            <TextField
                                                disabled={isOpen}
                                                type='text'
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const numericValue = Number(value);
                                                    if (!isNaN(numericValue) && Number(value) >= 0 && Number(value) <= order?.receiptVoucher?.remainAmount) {
                                                        setAmount(Number(value));
                                                    } else if (!isNaN(numericValue) && Number(value) > order?.receiptVoucher?.remainAmount) {
                                                        setAmount(order?.receiptVoucher?.remainAmount);
                                                    }
                                                    setValidateAmount(true);
                                                }}
                                                error={!validateAmount}
                                                className='flex-1'
                                                value={amount}
                                                helperText={!validateAmount && "Hệ thống chỉ ghi nhận giá trị nhỏ nhất là 2.000 VNĐ"}
                                                variant="standard"
                                                inputProps={{
                                                    style: {
                                                        textAlign: 'center',
                                                        color: !validateAmount ? 'red' : 'inherit'
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex space-x-2 mt-5">
                                            <div>Số tiền bằng chữ:</div>
                                            <strong><i>{amount > 0 ? capitalizeFirstLetter(numberToWords(amount)) : 'Không'} đồng</i></strong>
                                        </div>
                                        <div className="flex space-x-2 mt-5">
                                            <div>Số tiền còn lại:</div>
                                            <strong><i>{currencyHandleProvider(order?.receiptVoucher?.remainAmount - amount)}</i></strong>
                                        </div>
                                        <div className="flex space-x-2 mt-5">
                                            <div>Số tiền còn lại bằng chữ:</div>
                                            <strong><i>{order?.receiptVoucher?.remainAmount - amount > 0 ? capitalizeFirstLetter(numberToWords(order?.receiptVoucher?.remainAmount - amount)) : 'Không'} đồng</i></strong>
                                        </div>
                                        <div className='space-y-5 mt-5'>
                                            <div>
                                                Nhập nội dung thanh toán:
                                            </div>
                                            <TextField
                                                type='text'
                                                disabled={isOpen}
                                                onChange={(e) => { setDescription(e.target.value) }}
                                                className='w-full'
                                                value={description}
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                            />
                                        </div>
                                        <div className="flex justify-end mt-5">
                                            {!isOpen ? (
                                                isCreatingLink ? (
                                                    <Button
                                                        disabled
                                                    >
                                                        Đang tạo mã QR
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => {
                                                            const paymentData: PaymentPayload = {
                                                                amount: amount,
                                                                orderCode: generateOrderCode(),
                                                                description: 'RiceHubQR',
                                                                cancelUrl: 'https://example.com/cancel',
                                                                returnUrl: `http://localhost:3000/order/detail/${params.id}`,
                                                            };
                                                            if (amount > 2000) {
                                                                handleGetPaymentLink(paymentData)
                                                            } else {
                                                                setValidateAmount(false);
                                                            }
                                                        }}
                                                    >
                                                        Tạo mã QR
                                                        <QrCode />
                                                    </Button>
                                                )
                                            ) : (
                                                <Button
                                                    className="bg-red-600 hover:bg-red-500"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setIsOpen(false);
                                                        exit();
                                                    }}
                                                >
                                                    Hủy thanh toán
                                                </Button>
                                            )}
                                        </div>
                                        {isOpen && (
                                            <div className="w-full mt-5">
                                                Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để
                                                hệ thống tự động cập nhật.
                                            </div>
                                        )}
                                        <div
                                            id="payosEmbedded"
                                            className="h-[350px] mt-5"
                                        ></div>
                                    </div>
                                </Box>
                            </Drawer>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='border rounded'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Số tiền</TableHead>
                                        <TableHead>Ngày thanh toán</TableHead>
                                        <TableHead>Phương thức thanh toán</TableHead>
                                        <TableHead className='text-right'>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.receiptVoucher?.transactions?.length > 0 ? (
                                        <>
                                            {order.receiptVoucher?.transactions?.map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell>{currencyHandleProvider(transaction.amount || 0)}</TableCell>
                                                    <TableCell>{new Date(transaction.transactionDate || '').toLocaleDateString()}</TableCell>
                                                    <TableCell>{transaction.paymentMethod}</TableCell>
                                                    <TableCell align='right'>
                                                        <Badge variant={statusProvider(transaction.status).variant}>
                                                            {statusProvider(transaction.status).text}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align='center'>Chưa có lịch sử thanh toán</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card >
            </div >
            <div className="pb-5 flex justify-between">
                <Button variant='default' onClick={
                    () => router.back()
                }>
                    <ArrowLeft className='w-4 h-4' />
                    Quay lại
                </Button>
                {order?.status === 'IN_PROCESS' && (
                    <Button onClick={confirmReceived}>
                        <Check className='w-4 h-4' />
                        Xác nhận đã nhận hàng
                    </Button>
                )}
            </div>
        </section >
    );
}
