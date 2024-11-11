/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import api from "../../api/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Autocomplete, TextField } from '@mui/material';

interface PopupExpenseProps {
    handleClose: (reload?: boolean) => void;
}

const PopupExpense: React.FC<PopupExpenseProps> = ({ handleClose }) => {

    const [formData, setFormData] = useState({
        type: '',
        totalAmount: '',
        note: ''
    });
    const { toast } = useToast();

    const handleFieldChange = (field: string, value: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.type === '') {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: 'Vui lòng chọn loại phiếu chi.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        if (formData.totalAmount === '') {
            toast({
                variant: 'destructive',
                title: 'Tạo thất bại',
                description: 'Vui lòng nhập giá trị.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        try {
            const response = await api.post(`/ExpenseVoucher/create`, formData);
            console.log(response);
            toast({
                variant: 'default',
                title: 'Tạo thành công',
                description: `Phiếu chi đã được thêm thành công`,
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
                title: 'Tạo thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className='w-fit min-w-[400px] h-auto max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row bg-white rounded-lg'>
                <div className='w-full py-3 flex flex-col justify-between items-center lg:items-start'>
                    <div className='w-full flex justify-between items-center pb-5 px-5'>
                        <h1 className='font-bold'>Thêm phiếu chi mới</h1>
                        <button onClick={() => handleClose(false)}>
                            <span className="text-black text-xl hover:text-gray-500">✖</span>
                        </button>
                    </div>
                    <form className='px-10 w-full' onSubmit={handleSubmit}>
                        <Autocomplete
                            disablePortal
                            className='mb-5'
                            options={['Thanh toán lương nhân viên', 'Thanh toán tiền nhập hàng', 'Các khoản chi khác']}
                            onChange={(event, newValue) => handleFieldChange('type', newValue || '')}
                            renderInput={(params) => <TextField {...params} variant='standard' label="Loại chi" />}
                        />
                        <TextField
                            type='number'
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0) {
                                    handleFieldChange('totalAmount', value);
                                } else {
                                    handleFieldChange('totalAmount', 0);
                                }
                            }}
                            className='w-full mb-5'
                            value={formData.totalAmount}
                            label={'Nhập tổng giá trị'}
                            variant="standard"
                        />
                        <TextField
                            type='text'
                            onChange={(e) => handleFieldChange('note', e.target.value)}
                            className='w-full'
                            value={formData.note}
                            label='Nội dung'
                            rows={4}
                            multiline
                        />
                        <div className='w-full flex justify-center items-center py-5 px-5'>
                            <Button className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]' type="submit">
                                Thêm
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PopupExpense;
