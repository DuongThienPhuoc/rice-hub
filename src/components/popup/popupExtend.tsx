/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import api from "../../api/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { TextField } from '@mui/material';
import Flatpickr from 'react-flatpickr';

interface PopupCreateProps {
    data: Record<string, any>;
    handleClose: (reload?: boolean) => void;
}

const PopupExtend: React.FC<PopupCreateProps> = ({ data, handleClose }) => {

    const [formData, setFormData] = useState({
        id: data?.id,
        dueDate: '',
    });
    const { toast } = useToast();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const renderDate = (data: any) => {
        const date = new Date(data);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return day + '/' + month + '/' + year;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!formData.id) {
            toast({
                variant: 'destructive',
                title: 'Gia hạn thất bại',
                description: 'Không tìm thấy mã phiếu.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        if (formData.dueDate === '') {
            toast({
                variant: 'destructive',
                title: 'Gia hạn thất bại',
                description: 'Vui lòng chọn ngày gia hạn.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        const formattedDueDate = new Date(formData.dueDate).toISOString().split('T')[0];

        try {
            await api.post(`/ReceiptVoucher/extend`, {
                ...formData,
                dueDate: formattedDueDate
            });
            toast({
                variant: 'default',
                title: 'Gia hạn thành công',
                description: `Hệ thống ghi nhận gia hạn phiếu thu đến ngày ${renderDate(formData.dueDate)}`,
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
                title: 'Gia hạn thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    };

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className='w-fit p-5 min-w-[400px] h-auto max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row bg-white rounded-lg'>
                <div className='w-full py-3 flex flex-col justify-between items-center lg:items-start'>
                    <div className='w-full flex justify-between items-center pb-5 px-5'>
                        <h1 className='font-bold text-[24px]'>Gia hạn phiếu thu</h1>
                        <button onClick={() => handleClose(false)}>
                            <span className="text-black text-xl hover:text-gray-500">✖</span>
                        </button>
                    </div>
                    <form className='px-6 w-full space-y-5' onSubmit={handleSubmit}>
                        <div>Mã phiếu: <strong><i>{data?.receiptCode}</i></strong></div>
                        <div>Đơn hàng: <strong><i>{data?.orderDto?.orderCode}</i></strong></div>
                        <div>Hạn thu hiện tại: <strong><i>{renderDate(data?.dueDate?.toString())}</i></strong></div>
                        <TextField
                            type='date'
                            className='w-full'
                            value={formData.dueDate}
                            onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                            variant="standard"
                            inputProps={{ min: minDate }}
                        />
                        <div className='w-full flex justify-center items-center py-5 px-5'>
                            <Button className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]' type="submit">
                                Gia hạn
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PopupExtend;
