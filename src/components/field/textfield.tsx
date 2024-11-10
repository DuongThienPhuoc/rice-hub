'use client';
import React from 'react';

interface TextFieldProps {
    titles: { name: string, displayName: string }[];
    data: Record<string, string | number | boolean>;
}

const formatDate = (isoDate: any) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatCurrency = (amount: any) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const TextField: React.FC<TextFieldProps> = ({ titles, data }) => {

    return (
        <div className='w-full'>
            {titles.map(({ name, displayName }, index) => (
                <div className='w-full flex flex-col sm:flex-row lg:flex-col xl:flex-row py-2' key={index}>
                    <div className='flex-[3] mr-3 font-bold pt1'>{displayName}:</div>
                    <div className='flex-[4]'>
                        <h1 className='px-3 py-1 w-[260px]'>
                            {name.toLocaleLowerCase().includes('date') ? (
                                formatDate(data[name])
                            ) : (
                                name.toLocaleLowerCase().includes('amount') || name.toLocaleLowerCase().includes('price') ? (
                                    formatCurrency(data[name])
                                ) : (
                                    typeof data[name] === 'boolean'
                                        ? (data[name] ? 'Hoạt động' : 'Không hoạt động')
                                        : data[name]
                                ))
                            }
                        </h1>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TextField