'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import Image from "next/image";
import returnIcon from '@/components/icon/chevron_left.svg';

const showAlert = () => {
    Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa mục này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, xóa!',
        cancelButtonText: 'Không, hủy!',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Đã xóa!', 'Mục đã được xóa.', 'success');
        } else {
            Swal.fire('Đã hủy', 'Mục không bị xóa.', 'info');
        }
    });
};

interface InputFieldProps {
    titles: string[];
    data?: Record<string, string | number>;
}

const InputField: React.FC<InputFieldProps> = ({ titles, data }) => {
    const displayData = data || {};

    return (
        <div className='py-10 px-10 h-full flex flex-col justify-between items-center lg:items-start'>
            <div className='w-full'>
                {titles.map((title, index) => (
                    <div className='w-full flex items-center py-2' key={index}>
                        <div className='flex-1 mr-3 lg:mr-0 font-bold'>{title}:</div>
                        <div className='flex-[2]'>
                            <input type='text' className='px-3 py-1 border border-gray-400' value={`${displayData[title] || ''}`}></input>
                        </div>
                    </div>
                ))}
            </div>
            <div className='w-full'>
                <div className='w-full flex justify-center align-bottom items-center mt-10'>
                    {data ? (
                        <Button className='ml-2 mt-4 lg:mt-0 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            Cập nhật
                        </Button>
                    ) : (
                        <Button className='ml-2 mt-4 lg:mt-0 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            Thêm
                        </Button>
                    )}
                    {data && (
                        <Button onClick={showAlert} className='ml-2 mt-4 lg:mt-0 px-5 py-3 text-[14px] hover:bg-[#1d1d1fca]'>
                            Xóa
                        </Button>
                    )}
                </div>
                <div className='w-full flex justify-center align-bottom items-center mt-5'>
                    <a href='/products' className='flex items-center'>
                        <Image src={returnIcon} alt='return icon' width={12} height={12} className='min-h-[12px] min-w-[12px] mr-2' />
                        Quay lại
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InputField;