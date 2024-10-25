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
            console.log(formData);
            const response = await api.post("/login/loginRequest", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log('Login success');
            localStorage.setItem("role", response.data.userType);
            setLoading(false);
            if (response.data.userType && response.data.userType == 'ROLE_ADMIN') {
                router.push('/dashboard');
            } else if (response.data.userType && response.data.userType == 'ROLE_EMPLOYEE') {
                router.push('/');
            } else if (response.data.userType && response.data.userType == 'ROLE_CUSTOMER') {
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
        }
    };

    return (
        <div className='relative w-full h-[100vh] min-h-[600px] flex flex-col items-center'>
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
            <div className='py-[40px] bg-white border flex flex-col justify-between rounded-xl mt-auto mb-auto min-w-[300px] h-[420px] px-5 z-10'>
                <div>
                    <h1 className='text-center font-bold font-arsenal text-[22px]'>Đăng nhập</h1>
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
                    <div className='flex justify-between text-[12px] font-semibold font-arsenal text-gray-400 mt-2'>
                        <p className='hover:text-gray-600 hover:cursor-pointer'>Quên mật khẩu ?</p>
                        <p onClick={() => router.push("/register")} className='hover:text-gray-600 hover:cursor-pointer'>Chưa có tài khoản ?</p>
                    </div>
                </div>
                <div>
                    <Button
                        onClick={handleLogin}
                        className='rounded-full w-full text-[12px]'
                        style={{ boxShadow: '5px 5px 5px gray' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                    </Button>
                </div>
            </div>
        </div>

    );
};

export default Page;