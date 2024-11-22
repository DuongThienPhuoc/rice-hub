/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import api from "@/config/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Autocomplete, TextField } from '@mui/material';
import Swal from 'sweetalert2'
import { X } from 'lucide-react';

interface PopupCreateProps {
    data: Record<string, any>;
    handleClose: (reload?: boolean) => void;
}

const PopupExtend: React.FC<PopupCreateProps> = ({ data, handleClose }) => {

    const { toast } = useToast();
    const [value, setValue] = useState(1);
    const [selectType, setSelectType] = useState('Ngày');

    const renderDate = (data: any) => {
        const date = new Date(data);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return day + '/' + month + '/' + year;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!data.id) {
            toast({
                variant: 'destructive',
                title: 'Gia hạn thất bại',
                description: 'Không tìm thấy mã phiếu.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        Swal.fire({
            title: 'Xác nhận gia hạn',
            text: `Bạn có chắc muốn gia hạn cho phiếu thu này.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có, lập!',
            cancelButtonText: 'Không, hủy!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.post(`/ReceiptVoucher/extend`, {
                        id: data.id,
                        number: value,
                        type: selectType
                    });
                    toast({
                        variant: 'default',
                        title: 'Gia hạn thành công',
                        description: `Hệ thống ghi nhận gia hạn phiếu thu thêm ${value + ' ' + selectType}`,
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
            } else {
                Swal.fire('Đã hủy', `Phiếu thu chưa được gia hạn.`, 'info');
            }
        })
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form onSubmit={handleSubmit} className='p-5 sm:w-[800px] w-full h-100 h-auto max-h-[90vh] overflow-y-auto bg-white sm:rounded-lg'>
                <div className='w-full flex justify-between items-center pb-5 px-5'>
                    <h1 className='font-bold'>Gia hạn phiếu thu</h1>
                    <button onClick={() => handleClose(false)}>
                        <X size={30} />
                    </button>
                </div>
                <div className='flex flex-col'>
                    <div className='flex-1 py-3'>
                        <div className='px-6 w-full space-y-5' >
                            <div>Mã phiếu: <strong><i>{data?.receiptCode}</i></strong></div>
                            <div>Hạn thu hiện tại: <strong><i>{renderDate(data?.dueDate?.toString())}</i></strong></div>
                        </div>
                    </div>
                    <div className='flex-1 py-3'>
                        <div className='px-6 w-full space-y-5' >
                            <div>Đơn hàng: <strong><i>{data?.orderDto?.orderCode}</i></strong></div>
                            <div className='flex space-x-2 items-center'>
                                <div className='w-[30%]'>Gia hạn thêm: </div>
                                <TextField
                                    type='number'
                                    onChange={(e) => {
                                        const holder = Number(e.target.value);
                                        if (holder > 0) {
                                            setValue(holder);
                                        } else {
                                            setValue(1);
                                        }
                                    }}
                                    value={value}
                                    className='w-[30%]'
                                    variant="standard"
                                    inputProps={{
                                        style: { textAlign: 'center' }
                                    }}
                                />
                                <Autocomplete
                                    className='w-[40%]'
                                    value={selectType}
                                    disableClearable
                                    onChange={(event, newValue) => setSelectType(newValue)}
                                    options={['Ngày', 'Tuần', 'Tháng']}
                                    renderInput={(params) => <TextField {...params}
                                        variant='standard' />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex justify-end items-center space-x-2 mt-10 px-5'>
                    <Button className='px-5 py-2 text-[14px] hover:bg-green-500' type="submit">
                        Gia hạn
                    </Button>
                    <Button onClick={() => handleClose(false)} className='px-5 py-2 text-[14px] bg-red-500 hover:bg-red-400' type="button">
                        Hủy bỏ
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PopupExtend;
