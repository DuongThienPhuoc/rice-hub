'use client';
import React, { useState } from 'react';
import Background from '@/components/assets/img/background.jpg'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import api from "../../../api/axiosConfig";
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
    const [loading, setLoading] = useState(false);

    const handleFieldChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await api.post("/register", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log('Register success:', response.data);
        } catch (error) {
            console.error('Register error:', error);
        } finally {
            setLoading(false);
            router.push('/login');
        }
    };

    return (
        <div className='relative w-full min-h-[100vh] sm:h-auto h-[900px] flex flex-col items-center overflow-y-auto'>
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage: `url(${Background.src})`,
                    transform: 'scaleX(-1)',
                }}
            />
            <div className='flex fixed z-20 bg-[#FFFFFF] h-[75px] w-full justify-between px-4'>
                <div className='logo flex items-center ms-3'>
                    <h1 className='font-extrabold text-[32px]'>Ricehub</h1>
                </div>
            </div>
            <div className='py-[40px] bg-white border flex flex-col rounded-xl mt-auto mb-auto min-w-[300px] h-fit px-5 z-10'>
                <h1 className='text-center font-bold font-arsenal text-[22px]'>Đăng ký</h1>
                <div className='flex flex-col sm:flex-row'>
                    <div className='flex-1 mr-2'>
                        <p className='font-semibold font-arsenal mt-[30px] mb-1'>Tên đầy đủ</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='font-arsenal placeholder:text-[14px] placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập họ và tên'
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                            />
                        </div>
                        <p className='font-semibold font-arsenal mt-[20px] mb-1'>Số điện thoại</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='font-arsenal placeholder:text-[14px] placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập số điện thoại'
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                            />
                        </div>
                        <p className='font-semibold font-arsenal mt-[20px] mb-1'>Email</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='font-arsenal placeholder:text-[14px] placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập email'
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='flex-1 ml-2'>
                        <p className='font-semibold font-arsenal mt-[30px] mb-1'>Tên tài khoản</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaUser className='text-gray-400 ' />
                            <input
                                className='font-arsenal placeholder:text-[14px] placeholder:font-medium font-semibold px-2 focus:outline-none'
                                type='text' placeholder='Nhập tên tài khoản'
                                onChange={(e) => handleFieldChange('username', e.target.value)}
                            />
                        </div>
                        <p className='font-semibold font-arsenal mt-[20px] mb-1'>Mật khẩu</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaLock className='text-gray-400 ' />
                            <input
                                className='font-arsenal placeholder:text-[14px] placeholder:font-medium font-semibold px-2 mr-[15px] focus:outline-none'
                                type={showPassword ? 'password' : 'text'} placeholder='Nhập mật khẩu'
                                onChange={(e) => handleFieldChange('password', e.target.value)}
                            />
                            <FaEyeSlash
                                className={`text-gray-400 cursor-pointer ${showPassword ? 'hidden' : 'block'}`}
                                onClick={() => setShowPassword(true)}
                            />
                            <FaEye
                                className={`text-gray-400 cursor-pointer ${showPassword ? 'block' : 'hidden'}`}
                                onClick={() => setShowPassword(false)}
                            />
                        </div>
                        <p className='font-semibold font-arsenal mt-[20px] mb-1'>Xác nhận mật khẩu</p>
                        <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                            <FaLock className='text-gray-400 ' />
                            <input
                                className='font-arsenal placeholder:text-[14px] placeholder:font-medium font-semibold px-2 mr-[15px] focus:outline-none'
                                type={showPassword2 ? 'password' : 'text'} placeholder='Xác nhận mật khẩu'
                                onChange={(e) => handleFieldChange('passwordConfirmation', e.target.value)}
                            />
                            <FaEyeSlash
                                className={`text-gray-400 cursor-pointer ${showPassword2 ? 'hidden' : 'block'}`}
                                onClick={() => setShowPassword2(true)}
                            />
                            <FaEye
                                className={`text-gray-400 cursor-pointer ${showPassword2 ? 'block' : 'hidden'}`}
                                onClick={() => setShowPassword2(false)}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-end text-[12px] font-semibold font-arsenal text-gray-400 my-5'>
                    <p onClick={() => router.push("/login")} className='hover:text-gray-600 hover:cursor-pointer'>Đã có tài khoản ?</p>
                </div>
                <div>
                    <Button
                        onClick={handleLogin}
                        className='rounded-full w-full text-[12px]'
                        style={{ boxShadow: '5px 5px 5px gray' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                    </Button>
                </div>
            </div>
        </div>

    );
};

export default Page;