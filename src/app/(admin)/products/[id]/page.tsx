/* eslint-disable @next/next/no-img-element */
'use client';
import TextField from '@/components/field/textfield';
import Navbar from '@/components/navbar/navbar';
import ResponsiveNavbar from '@/components/navbar/responsiveNavbar';
import React, { useEffect, useState } from 'react';

const Page = ({ params }: { params: { id: string } }) => {

    const [navbarVisible, setNavbarVisible] = useState(false);

    useEffect(() => {
        const updateNavbarVisibility = () => {
            const shouldShowNavbar = window.innerWidth >= 1100;
            setNavbarVisible(shouldShowNavbar);
        };

        updateNavbarVisibility();

        window.addEventListener('resize', updateNavbarVisibility);

        return () => {
            window.removeEventListener('resize', updateNavbarVisibility);
        };
    }, []);

    const titles = ['Mã sản phẩm', 'Tên sản phẩm', 'Số lượng (kg)', 'Ngày nhập kho', 'Lô hàng', 'Nhà cung cấp'];

    const productData = {
        'Mã sản phẩm': params.id,
        'Tên sản phẩm': 'ST25',
        'Số lượng (kg)': 50,
        'Ngày nhập kho': '18/09/2024',
        'Lô hàng': 'HE170268',
        'Nhà cung cấp': 'N/A'
    };
    return (
        <div>
            {navbarVisible ? (
                <Navbar />
            ) : (
                <ResponsiveNavbar />
            )}
            <div className='flex my-5 mt-16 justify-center px-5 w-full'>
                <div className='w-[95%] md:w-[70%] flex bg-white rounded-lg flex-col lg:flex-row' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                    <div className='flex-1'>
                        <img src="https://giagao.com/wp-content/uploads/2021/08/gao-ST25_AAN.jpg" alt="img" className="w-full h-auto" />
                    </div>
                    <div className='flex-1'>
                        <TextField titles={titles} data={productData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;