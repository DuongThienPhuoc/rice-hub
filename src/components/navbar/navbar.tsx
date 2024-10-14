'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import bellIcon from '@/components/icon/bell.svg';
import userIcon from '@/components/icon/user.svg';
import downArrow from '@/components/icon/downArrow.svg';
import upArrow from '@/components/icon/upArrow.svg';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [dropdown, setDropdown] = useState(false);
    const [dropdown2, setDropdown2] = useState(false);
    const [dropdown3, setDropdown3] = useState(false);
    const [dropdown4, setDropdown4] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);

    const handleDropdown = () => {
        setDropdown(!dropdown);
        if (dropdown2 == true || dropdown3 == true || dropdown4 == true) {
            setDropdown2(false);
            setDropdown3(false);
            setDropdown4(false);
        }
    };

    const handleDropdown2 = () => {
        setDropdown2(!dropdown2);
        if (dropdown == true || dropdown3 == true || dropdown4 == true) {
            setDropdown(false);
            setDropdown3(false);
            setDropdown4(false);
        }
    };

    const handleDropdown3 = () => {
        setDropdown3(!dropdown3);
        if (dropdown == true || dropdown2 == true || dropdown4 == true) {
            setDropdown(false);
            setDropdown2(false);
            setDropdown4(false);
        }
    };

    const handleDropdown4 = () => {
        setDropdown4(!dropdown4);
        if (dropdown == true || dropdown2 == true || dropdown3 == true) {
            setDropdown(false);
            setDropdown2(false);
            setDropdown3(false);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
            setDropdown(false);
            setDropdown2(false);
            setDropdown3(false);
            setDropdown4(false);
        }
    };

    useEffect(() => {
        if (dropdown || dropdown2 || dropdown3 || dropdown4) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdown, dropdown2, dropdown3, dropdown4]);

    return (
        <div className='flex bg-[#FFFFFF] h-[75px] w-full justify-between px-4 font-arsenal'>
            <div className='logo flex items-center ms-3'>
                <h1 className='font-extrabold text-[32px]'>Ricehub</h1>
            </div>
            <div className='flex items-center gap-x-10 font-bold h-full'>
                <ul className='flex items-center gap-x-10'>
                    <li onClick={() => router.push('/dashboard')} className="cursor-pointer">Tài chính</li>
                    <div ref={navbarRef} className='relative' onClick={() => handleDropdown()}>
                        <li className='flex gap-x-2'>
                            Hàng hóa
                            {
                                dropdown ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                    <Image src={upArrow} alt='down arrow' width={10} height={10} />
                            }
                        </li>
                        <div className={dropdown ? 'absolute w-32 bg-[#FFFFFF] shadow-lg top-12 left-0' : 'hidden'}>
                            <ul className='flex flex-col'>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/categories')}>Danh mục</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/products')}>Sản phẩm</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('#')}>Nguyên liệu</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/prices')}>Bảng giá</li>
                            </ul>
                        </div>
                    </div>
                    <div ref={navbarRef} className='relative' onClick={() => handleDropdown3()}>
                        <li className='flex gap-x-2'>
                            Đối tác
                            {
                                dropdown3 ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                    <Image src={upArrow} alt='down arrow' width={10} height={10} />
                            }
                        </li>
                        <div className={dropdown3 ? 'absolute w-32 bg-[#FFFFFF] shadow-lg top-12 left-0' : 'hidden'}>
                            <ul className='flex flex-col'>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/customers')}>Khách hàng</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/employees')}>Nhân viên</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/suppliers')}>Nhà cung cấp</li>
                            </ul>
                        </div>
                    </div>
                    <div ref={navbarRef} className='relative' onClick={() => handleDropdown4()}>
                        <li className='flex gap-x-2'>
                            Giao dịch
                            {
                                dropdown4 ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                    <Image src={upArrow} alt='down arrow' width={10} height={10} />
                            }
                        </li>
                        <div className={dropdown4 ? 'absolute w-32 bg-[#FFFFFF] shadow-lg top-12 left-0' : 'hidden'}>
                            <ul className='flex flex-col'>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/income')}>Thu</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/expenditures')}>Chi</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/orders')}>Đơn hàng</li>
                            </ul>
                        </div>
                    </div>
                </ul>
            </div>


            <div className='flex items-center'>
                <div className='flex items-center justify-center w-12 h-12'>
                    <Image src={bellIcon} alt='bell icon' width={24} height={24} />
                </div>
                <div onClick={() => handleDropdown2()} className='flex cursor-pointer relative items-center justify-center w-12 h-12 bg-[#F2F4F8] rounded-full'>
                    <Image src={userIcon} alt='user icon' width={24} height={24} />
                </div>
                <div className={dropdown2 ? 'absolute w-fit bg-[#FFFFFF] shadow-lg top-[75px] right-4' : 'hidden'}>
                    <ul className='flex flex-col font-bold'>
                        <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/profile')}>Thông tin cá nhân</li>
                        <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/settings')}>Cài đặt</li>
                        <li className='hover:bg-gray-200 p-2' onClick={() => {
                            localStorage.clear();
                            router.push('/');
                        }}>Đăng xuất</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
