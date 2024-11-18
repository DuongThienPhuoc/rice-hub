/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import api from "../../api/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { TextField } from '@mui/material';
import Swal from 'sweetalert2'

interface PopupCreateProps {
    data: Record<string, any>;
    handleClose: (reload?: boolean) => void;
}

const PopupPay: React.FC<PopupCreateProps> = ({ data, handleClose }) => {
    const [amount, setAmount] = useState<number>(0);
    const { toast } = useToast();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        Swal.fire({
            title: 'Xác nhận giao dịch',
            text: `Hệ thống ghi nhận số tiền vừa nhập bằng là: ${formatCurrency(amount)} (${capitalizeFirstLetter(numberToWords(amount))} đồng). Bạn có chắc chắn muốn tạo giao dịch với số tiền này.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, tạo!',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.post(`/transaction/createTransaction`, {
                        receiptVoucherId: data.id,
                        amount: amount,
                        paymentMethod: 'Tiền mặt',
                    });
                    toast({
                        variant: 'default',
                        title: 'Giao dịch thành công',
                        description: `Hệ thống ghi nhận phiếu thu ${data?.receiptCode} đã được thanh toán số tiền ${formatCurrency(amount)} (${capitalizeFirstLetter(numberToWords(amount))} đồng)`,
                        style: {
                            backgroundColor: '#4caf50',
                            color: '#fff',
                        },
                        duration: 3000
                    })
                    handleClose(true);
                } catch (error: any) {
                    toast({
                        variant: 'destructive',
                        title: 'Thanh toán thất bại',
                        description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                        action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                        duration: 3000
                    })
                }
            } else {
                Swal.fire('Đã hủy', `Phiếu thu chưa được thanh toán.`, 'info');
            }
        })
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

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form onSubmit={handleSubmit} className='p-5 lg:w-[800px] w-[360px] h-auto max-h-[90vh] overflow-y-auto bg-white rounded-lg'>
                <div className='w-full flex justify-between items-center pb-5 px-5'>
                    <h1 className='font-bold'>Lập phiếu thu tiền mặt</h1>
                    <button onClick={() => handleClose(false)}>
                        <span className="text-black text-xl hover:text-gray-500">✖</span>
                    </button>
                </div>
                <div className='flex flex-col lg:flex-row'>
                    <div className='flex-1 py-3'>
                        <div className='px-6 w-full space-y-5' >
                            <div>Mã phiếu: <strong><i>{data?.receiptCode}</i></strong></div>
                            <div className='flex items-center space-x-2'>
                                <div className='flex-1'>
                                    Giá trị bằng số:
                                </div>
                                <TextField
                                    type='number'
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= data?.remainAmount) {
                                            setAmount(value);
                                        } else if (value > data?.remainAmount) {
                                            setAmount(data?.remainAmount);
                                        } else {
                                            setAmount(0);
                                        }
                                    }}
                                    className='flex-[2]'
                                    value={amount}
                                    variant="standard"
                                    inputProps={{
                                        style: { textAlign: 'center' }
                                    }}
                                />
                            </div>
                            <div>
                                <div>Giá trị bằng chữ:</div>
                                <strong><i>{amount > 0 ? capitalizeFirstLetter(numberToWords(amount)) : 'Không'} đồng</i></strong>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 py-3'>
                        <div className='px-6 w-full space-y-5' >
                            <div>Đơn hàng: <strong><i>{data?.orderDto?.orderCode}</i></strong></div>
                            <div>Số tiền còn lại bằng số: <strong><i>{formatCurrency(data?.remainAmount - amount)}</i></strong></div>
                            <div>
                                <div>Số tiền còn lại bằng chữ:</div>
                                <strong><i>{data?.remainAmount - amount > 0 ? capitalizeFirstLetter(numberToWords(data?.remainAmount - amount)) : 'Không'} đồng</i></strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex justify-end items-center space-x-2 mt-10 px-5'>
                    <Button className='px-5 py-2 text-[14px] hover:bg-[#1d1d1fca]' type="submit">
                        Thanh toán
                    </Button>
                    <Button onClick={() => handleClose(false)} className='px-5 py-2 text-[14px] bg-red-500 hover:bg-red-400' type="button">
                        Hủy bỏ
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PopupPay;
