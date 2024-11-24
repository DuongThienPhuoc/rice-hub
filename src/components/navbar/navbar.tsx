'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import style from '@/style/landing-page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [useName, setUserName] = useState<string>('');
    const category = [
        {
            name: 'Trang chủ',
            link: '/',
        },
        {
            name: 'Đặt hàng',
            link: '/order',
        },
        {
            name: 'Giới thiệu',
            link: '/about',
        },
        {
            name: 'Đăng nhập',
            link: '/login',
        },
    ];

    useEffect(() => {
        const localStorageUserName =
            typeof window !== 'undefined' ? localStorage.getItem('username') : null;
        const parsedProducts: string = localStorageUserName
            ? localStorageUserName
            : '';
        setUserName(parsedProducts);
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
                                    'relative flex h-[99%] items-center px-2.5 hover:cursor-pointer',
                                    item.name === 'Trang chủ' &&
                                        'border-b-4 border-[#3e603b]',
                                    item.name !== 'Trang chủ' &&
                                        style.category_container,
                                    useName &&
                                        item.name === 'Đăng nhập' &&
                                        'hidden',
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
            {useName && (
                <div>
                    <p className={cn('font-amatic font-bold text-[25px]')}>
                        Xin chào{' '}
                        <span className="font-bold">{`${useName}!`}</span>
                    </p>
                </div>
            )}
        </section>
    );
}
