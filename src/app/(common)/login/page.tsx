'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Background from '@/components/assets/img/background.jpg'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import api from "@/config/axiosConfig";
import { useRouter } from 'next/navigation';
import LinearIndeterminate from '@/components/ui/LinearIndeterminate';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react';

const Toast = () => {
    const { toast } = useToast();
    const searchParams = useSearchParams()
    useEffect(() => {
        const message = searchParams.get('message');
        if (message) {
            toast({
                variant: 'destructive',
                title: message,
            })
        }
    }, [searchParams, toast]);
    return <></>
}

const Page = () => {
    const { toast } = useToast();
    const [onPageChange, setOnPageChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
    const router = useRouter();

    const handleFieldChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleLogin = async () => {
        setLoading(true);

        if (!formData.username || !formData.password) {
            toast({
                variant: 'destructive',
                title: 'Đăng nhập thất bại!',
                description: 'Vui lòng nhập đầy đủ thông tin.',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            });
            setLoading(false);
            return;
        }

        try {
            const response = await api.post("/login/loginRequest", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if(response.data.userType === 'ROLE_EMPLOYEE'){
                localStorage.setItem("employeeRole", response.data.employeeRole);
            }
            localStorage.setItem("role", response.data.userType);
            localStorage.setItem("username", response.data.username);
            document.cookie = `userID=${response.data.userId}; path=/; expires=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;
            setLoading(false);
            setOnPageChange(true);
            toast({
                variant: 'default',
                title: 'Đăng nhập thành công!',
                duration: 3000,
                style: {
                    backgroundColor: '#4caf50',
                    color: '#fff',
                },
            });
            if (response.data.userType && response.data.userType == 'ROLE_ADMIN') {
                window.location.href = '/dashboard'
            } else if (response.data.userType && response.data.userType == 'ROLE_EMPLOYEE') {
                window.location.href = '/'
            } else if (response.data.userType && response.data.userType == 'ROLE_CUSTOMER') {
                window.location.href = '/'
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Đăng nhập thất bại!',
                description: 'Sai tên đăng nhập hoặc mật khẩu, vui lòng thử lại.',
                duration: 3000,
                action: <ToastAction altText="Vui lòng thử lại">OK!</ToastAction>,
            })
            setLoading(false);
            setOnPageChange(false);
        }
    };

    return (
        <div className='relative w-full min-h-[100vh] h-auto flex flex-col items-center overflow-y-auto'>
            <Suspense fallback={<></>}>
                <Toast />
            </Suspense>
            <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                    backgroundImage: `url(${Background.src})`,
                    transform: 'scaleX(-1)',
                }}
            />
            <div className='relative py-[40px] bg-white border flex flex-col justify-between sm:rounded-xl my-auto min-w-full sm:min-w-[360px] lg:min-w-[380px] h-[100vh] sm:h-[500px] px-5 z-10'>
                <div className='absolute top-2'>
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

                <div>
                    <h1 className='text-center font-bold text-[30px] mt-5 mb-10'>Đăng nhập</h1>
                    <p className='font-semibold mt-[30px] mb-1 text-[18px]'>Tên tài khoản</p>
                    <div className='flex items-center border-b-2 px-2 py-1 text-[16px] border-gray-300'>
                        <FaUser className='text-gray-400 ' />
                        <input
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleLogin();
                                }
                            }}
                            className='placeholder:text-[16px] placeholder:font-medium font-semibold w-full px-2 focus:outline-none'
                            type='text' placeholder='Nhập tên tài khoản'
                            onChange={(e) => handleFieldChange('username', e.target.value)}
                        />
                    </div>
                    <p className='font-semibold mt-[20px] mb-1 text-[18px]'>Mật khẩu</p>
                    <div className='flex items-center border-b-2 px-2 py-1 border-gray-300'>
                        <FaLock className='text-gray-400 ' />
                        <input
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleLogin();
                                }
                            }}
                            className='placeholder:text-[16px] placeholder:font-medium font-semibold w-full px-2 mr-[15px] focus:outline-none'
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
                    <div className='flex justify-between text-[14px] font-semibold text-gray-400 mt-2'>
                        <p onClick={() => {
                            setOnPageChange(true);
                            router.push('/forgot-password')
                        }} className='hover:text-gray-600 hover:cursor-pointer'>Quên mật khẩu ?</p>
                        <p onClick={() => {
                            setOnPageChange(true);
                            router.push("/register")
                        }} className='hover:text-gray-600 hover:cursor-pointer'>Chưa có tài khoản ?</p>
                    </div>
                </div>
                <div>
                    <div className='flex justify-center text-[14px] font-semibold text-gray-400 mb-5'>
                        <p onClick={() => {
                            setOnPageChange(true);
                            router.push('/')
                        }} className='hover:text-gray-600 hover:cursor-pointer flex items-center space-x-4'><ArrowLeft size={20} />Quay lại trang chủ</p>
                    </div>
                    <Button
                        onClick={handleLogin}
                        className='rounded-full w-full text-[16px]'
                        style={{ boxShadow: '5px 5px 5px gray' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                    </Button>
                </div>
            </div>
            {onPageChange === true && (
                <div className='fixed z-[1000] bg-black bg-opacity-40 w-full'>
                    <div className='flex'>
                        <div className='w-full h-[100vh]'>
                            <LinearIndeterminate />
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Page;
