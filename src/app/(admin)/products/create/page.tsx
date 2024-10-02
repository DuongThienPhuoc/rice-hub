/* eslint-disable @next/next/no-img-element */
'use client';
import InputField from '@/components/field/inputfield';
import Navbar from '@/components/navbar/navbar';
import ResponsiveNavbar from '@/components/navbar/responsiveNavbar';
import React, { DragEvent, useEffect, useState } from 'react';

const Page = () => {

    const [navbarVisible, setNavbarVisible] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        updateImagePreviews([files[0]]);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        updateImagePreviews(files);
    };

    const updateImagePreviews = (files: File[]) => {
        const newPreviews: string[] = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    newPreviews.push(e.target.result);
                    setImagePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
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
                    <div className='flex-1 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100'>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className='hidden'
                            id="file-input"
                        />
                        <label
                            htmlFor="file-input"
                            className='w-full h-full flex flex-col items-center justify-center'
                            onDragOver={(e) => handleDragOver(e as unknown as DragEvent<HTMLDivElement>)}
                            onDrop={(e) => handleDrop(e as unknown as DragEvent<HTMLDivElement>)}
                        >
                            <p className='text-gray-500'>Drag & drop your images here or click to upload</p>
                            <p className='text-sm text-gray-400'>Max file size: 2MB</p>
                        </label>
                        <div className='mt-4'>
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`preview-${index}`} className='w-full h-auto rounded-lg' />
                            ))}
                        </div>
                    </div>
                    <div className='flex-1'>
                        <InputField titles={titles} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;