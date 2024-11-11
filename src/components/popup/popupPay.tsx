/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import api from "../../api/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { TextField } from '@mui/material';

interface PopupCreateProps {
    data: Record<string, any>;
    handleClose: (reload?: boolean) => void;
}

interface FormData {
    amount: number;
}

const PopupPay: React.FC<PopupCreateProps> = ({ data, handleClose }) => {

    const [formData, setFormData] = useState<FormData>({
        amount: 0,
    });
    const [amount, setAmount] = useState<number>(0);
    const { toast } = useToast();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (amount < 100000) {
            toast({
                variant: 'destructive',
                title: 'Thanh toán thất bại',
                description: 'Số tiền không hợp lệ, hệ thống chỉ ghi nhận số tiền thấp nhất là 100.000 VNĐ!',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }

        setFormData({
            amount: amount
        })
        try {
            await api.post(`/transaction/create`, formData);
            toast({
                variant: 'default',
                title: 'Thanh toán thành công',
                description: `Hệ thống ghi nhận phiếu thu ${data?.receiptCode} đã được thanh toán số tiền ${amount}`,
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
    };

    const formatCurrency = (value: number | string | boolean) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className='w-fit p-5 min-w-[400px] h-auto max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row bg-white rounded-lg'>
                <div className='w-full py-3 flex flex-col justify-between items-center lg:items-start'>
                    <div className='w-full flex justify-between items-center pb-5 px-5'>
                        <h1 className='font-bold'>Thanh toán phiếu thu</h1>
                        <button onClick={() => handleClose(false)}>
                            <span className="text-black text-xl hover:text-gray-500">✖</span>
                        </button>
                    </div>
                    <form className='px-6 w-full space-y-5' onSubmit={handleSubmit}>
                        <div>Mã phiếu: <strong><i>{data?.receiptCode}</i></strong></div>
                        <div>Đơn hàng: <strong><i>{data?.orderDto?.orderCode}</i></strong></div>
                        <div>Số tiền còn lại phải thanh toán: <strong><i>{formatCurrency(data?.remainAmount)}</i></strong></div>
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
                            className='w-full'
                            value={amount}
                            label={'Nhập số tiền'}
                            variant="standard"
                        />
                        <div className='w-full flex justify-center items-center py-5 px-5'>
                            <Button className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]' type="submit">
                                Thanh toán
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PopupPay;
