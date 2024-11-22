/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import Background from '@/components/assets/img/background.jpg'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { ToastAction } from '@/components/ui/toast';

const Page = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [onPageChange, setOnPageChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});

    const handleFieldChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleLogin = async () => {
        setLoading(true);
        if (!formData.username || !formData.password || !formData.email || !formData.phone || !formData.name) {
            toast({
                variant: 'destructive',
                title: 'Đăng ký thất bại!',
                description: 'Vui lòng nhập đầy đủ thông tin.',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.passwordConfirmation) {
            toast({
                variant: 'destructive',
                title: 'Đăng ký thất bại!',
                description: 'Mật khẩu không trùng khớp, vui lòng thử lại.',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            });
            setLoading(false);
            return;
        }

        try {
            await api.post("/register", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setLoading(false);
            setOnPageChange(true);
            toast({
                variant: 'default',
                title: 'Đăng ký thành công!',
                description: 'Xin vui lòng đăng nhập lại',
                duration: 3000,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
            });
            router.push('/login');
        } catch (error: any) {
            setOnPageChange(false);
            setLoading(false);
            toast({
                variant: 'destructive',
                title: 'Đăng ký thất bại',
                description: error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
        }
    };

    return (
        <div className='relative w-full min-h-[100vh] h-auto flex flex-col items-center overflow-y-auto'>
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage: `url(${Background.src})`,
                    transform: 'scaleX(-1)',
                }}
            />
            <div className='relative py-[40px] bg-white border flex flex-col sm:rounded-xl lg:items-center sm:my-auto min-w-full sm:min-w-[360px] lg:min-w-[380px] h-[100vh] sm:h-fit px-5 z-10'>
                <div className='absolute top-2 left-4'>
                    <h1
                        className='font-extrabold text-[20px]'
                        style={{
                            background: 'linear-gradient(90deg, #ffbf00, #22c55e, #0090d9)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Ricehub
                    </h1>
                </div>
                <h1 className='text-center font-bold text-[30px] my-5'>Đăng ký</h1>
                <div className='flex flex-col sm:flex-row'>
                    <div className='flex-1 mr-3'>
                        <p className='font-semibold mt-[30px] text-[18px] mb-1'>Tên đầy đủ</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='placeholder:text-[16px] w-full placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập họ và tên'
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                            />
                        </div>
                        <p className='font-semibold mt-[20px] text-[18px] mb-1'>Số điện thoại</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='placeholder:text-[16px] w-full placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập số điện thoại'
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                            />
                        </div>
                        <p className='font-semibold mt-[20px] text-[18px] mb-1'>Email</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='placeholder:text-[16px] w-full placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập email'
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='flex-1 sm:ml-3'>
                        <p className='font-semibold mt-[30px] text-[18px] mb-1'>Tên tài khoản</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='placeholder:text-[16px] w-full placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập tên tài khoản'
                                onChange={(e) => handleFieldChange('username', e.target.value)}
                            />
                        </div>
                        <p className='font-semibold mt-[20px] text-[18px] mb-1'>Mật khẩu</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaLock className='text-gray-400 ' />
                            <input
                                className='placeholder:text-[16px] w-full placeholder:font-medium font-semibold px-2 mr-[15px] focus:outline-none'
                                type={showPassword ? 'password' : 'text'} placeholder='Nhập mật khẩu'
                                onChange={(e) => handleFieldChange('password', e.target.value)}
                            />
                            <FaEyeSlash
                                size={20}
                                className={`text-gray-400 cursor-pointer ${showPassword ? 'hidden' : 'block'}`}
                                onClick={() => setShowPassword(true)}
                            />
                            <FaEye
                                size={20}
                                className={`text-gray-400 cursor-pointer ${showPassword ? 'block' : 'hidden'}`}
                                onClick={() => setShowPassword(false)}
                            />
                        </div>
                        <p className='font-semibold mt-[20px] text-[18px] mb-1'>Xác nhận mật khẩu</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaLock
                                className='text-gray-400 ' />
                            <input
                                className='placeholder:text-[16px] w-full placeholder:font-medium font-semibold px-2 mr-[15px] focus:outline-none'
                                type={showPassword2 ? 'password' : 'text'} placeholder='Xác nhận mật khẩu'
                                onChange={(e) => handleFieldChange('passwordConfirmation', e.target.value)}
                            />
                            <FaEyeSlash
                                size={20}
                                className={`text-gray-400 cursor-pointer ${showPassword2 ? 'hidden' : 'block'}`}
                                onClick={() => setShowPassword2(true)}
                            />
                            <FaEye
                                size={20}
                                className={`text-gray-400 cursor-pointer ${showPassword2 ? 'block' : 'hidden'}`}
                                onClick={() => setShowPassword2(false)}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-end text-[14px] w-full font-semibold text-gray-400 my-5'>
                    <p onClick={() => {
                        setOnPageChange(true);
                        router.push("/login")
                    }} className='hover:text-gray-600 hover:cursor-pointer'>Đã có tài khoản ?</p>
                </div>
                <div className='mt-10 w-full'>
                    <Button
                        onClick={handleLogin}
                        className='rounded-full w-full text-[16px]'
                        style={{ boxShadow: '5px 5px 5px gray' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                    </Button>
                </div>
            </div>

            {onPageChange === true && (
                <div className='fixed z-50 bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Page;