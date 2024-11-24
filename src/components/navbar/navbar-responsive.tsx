'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import style from '@/style/landing-page.module.css';
import { useState } from 'react';

export default function NavbarResponsive() {
    const category = [
        {
            name: 'Home',
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
    const [menu, setMenu] = useState<boolean>(false);
    return (
        <section className="bg-[#ffffff] w-full h-[74px] fixed z-20 flex items-center sm:hidden">
            <div className="h-full w-full flex justify-between items-center px-5">
                <div className="h-full flex items-center">
                    <Image
                        src="/images/ricehub-logo.png"
                        alt="ricehub-logo"
                        width={100}
                        height={100}
                        className="h-[80%] w-auto"
                    />
                </div>
                <div onClick={() => setMenu(!menu)}>
                    <Menu className="w-10 h-10" />
                </div>
            </div>
            <div
                className={cn(
                    'w-full bg-white top-full absolute',
                    !menu && 'hidden',
                )}
            >
                {category.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            'h-[50px] w-full flex items-center border-b',
                            style.navbar,
                        )}
                    >
                        <p className="pl-2 font-amatic text-[20px] font-bold">
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
