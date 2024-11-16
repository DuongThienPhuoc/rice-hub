/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import InputField from '@/components/field/inputfield';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import api from "@/config/axiosConfig";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface PopupEditProps {
    tableName: string;
    url: string;
    data: Record<string, string | number | boolean>;
    titles: {
        name: string;
        displayName: string;
        type: string;
    }[];
    handleClose: (reload?: boolean) => void;
}

const PopupEdit: React.FC<PopupEditProps> = ({ tableName, url, data, titles, handleClose }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});

    useEffect(() => {
        const initialFormData = titles.reduce((acc, title) => {
            acc[title.name] = data[title.name];
            return acc;
        }, {} as Record<string, string | number | boolean>);

        setFormData(initialFormData);
    }, [data, titles]);

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.id || formData.id == 0) {
            toast({
                variant: 'destructive',
                title: 'Cập nhật thất bại',
                description: `Không tìm thấy mã ${tableName.toLocaleLowerCase()}.`,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
            return;
        }

        try {
            const response = await api.post(`${url}`, formData);
            toast({
                variant: 'default',
                title: 'Cập nhật thành công',
                description: `${tableName} đã được cập nhật thành công`,
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
                title: 'Cập nhật thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
                duration: 3000
            })
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className='w-fit flex min-w-[300px] lg:min-w-[500px] bg-white rounded-lg flex-col lg:flex-row'>
                <div className='w-full py-3 h-full flex flex-col justify-between items-center lg:items-start'>
                    <div className='w-full flex justify-between items-center pb-5 px-5'>
                        <h1 className='font-bold'>Sửa {tableName.toLocaleLowerCase()}</h1>
                        <button onClick={() => handleClose(false)}>
                            <span className="text-black text-xl hover:text-gray-500">✖</span>
                        </button>
                    </div>
                    <form className='px-6 w-full' onSubmit={handleSubmit}>
                        <InputField titles={titles} data={formData} onFieldChange={handleFieldChange} />
                        <div className='w-full flex justify-center items-center pt-5 px-5'>
                            <Button className='px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]' type="submit">
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PopupEdit;



