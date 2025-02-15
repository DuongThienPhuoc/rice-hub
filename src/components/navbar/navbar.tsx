'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import style from '@/style/landing-page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/config/axiosConfig';

export default function Navbar() {
    const [userName, setUserName] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [isShow, setIsShow] = useState<boolean>(false);
    const category = [
        {
            name: 'Trang chủ',
            role: ['ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_EMPLOYEE', 'ROLE_ANONYMOUS'],
            link: '/',
        },
        {
            name: 'Đặt hàng',
            role: ['ROLE_CUSTOMER'],
            link: '/order',
        },
        {
            name: 'Quản lý đơn hàng',
            role: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'],
            link: '/admin/orders',
        },
        {
            name: 'Giới thiệu',
            role: ['ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_EMPLOYEE', 'ROLE_ANONYMOUS'],
            link: '/about',
        },
        {
            name: 'Đăng nhập',
            role: ['ROLE_ANONYMOUS'],
            link: '/login',
        },
    ];

    const handleLogout = async () => {
        try {
            const url = `/logout/logoutRequest`;
            await api.post(url);
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            document.cookie = `userID=; path=/; max-age=0`;
            window.location.href = '/'
        } catch (error) {
            console.error('Đăng xuất thất bại:', error);
        }
    };


    useEffect(() => {
        if(typeof window === 'undefined') return;
        const rawUserName = localStorage.getItem('username');
        const rawRole = localStorage.getItem('role');
        if (rawUserName && rawRole) {
            setUserName(rawUserName);
            setRole(rawRole);
        }else {
            setRole('ROLE_ANONYMOUS');
        }
    }, []);

    const router = useRouter();

    return (
        <section className="bg-[#ffffff] w-full h-[74px] fixed z-20 sm:flex items-center hidden">
            <div className="w-[60vw] mx-auto h-full flex justify-between">
                <div className="h-full flex items-center hover:cursor-pointer">
                    <Image
                        src="/images/ricehub-logo.png"
                        alt="ricehub-logo"
                        width={100}
                        height={100}
                        className="h-[80%] w-auto"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex justify-between h-full">
                        {category.map((item, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'relative  h-[99%] items-center px-2.5 hover:cursor-pointer hidden',
                                    item.name === 'Trang chủ' &&
                                        'border-b-4 border-[#3e603b]',
                                    item.name !== 'Trang chủ' &&
                                        style.category_container,
                                    item.role.includes(role) && 'flex',
                                )}
                                onClick={() => router.push(item.link)}
                            >
                                <p
                                    className={cn(
                                        'text-[#000000] font-amatic text-[22px] font-bold tracking-wide hover:text-[#3e603b]',
                                        item.name === 'Home' &&
                                            'text-[#3e603b]',
                                    )}
                                >
                                    {item.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {userName && (
                <div className="pr-5 relative">
                    <p
                        className="font-amatic font-bold text-[25px] hover:cursor-pointer"
                        onClick={() => setIsShow(!isShow)}
                    >
                        Xin chào{' '}
                        <span className="font-bold">{`${userName}!`}</span>
                    </p>
                    <div
                        className={cn(
                            'absolute bg-white w-44 top-12 text-center rounded border space-y-2',
                            !isShow && 'hidden',
                        )}
                    >
                        <p
                            className="font-amatic font-bold text-[25px] hover:cursor-pointer"
                            onClick={() => handleLogout()}
                        >
                            Đăng xuất
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
