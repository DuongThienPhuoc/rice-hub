'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import bellIcon from '@/components/icon/bell.svg';
import downArrow from '@/components/icon/downArrow.svg';
import upArrow from '@/components/icon/upArrow.svg';
import { useEffect, useRef, useState } from 'react';
import AvatarDropdownMenu from "@/components/navbar/avatar-dropdown-menu";
import UserProfileDialog from '@/components/navbar/user-profile-dialog';

export default function Navbar() {
    const router = useRouter();
    const [dropdown, setDropdown] = useState(false);
    const [dropdown2, setDropdown2] = useState(false);
    const [dropdown3, setDropdown3] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);
    const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState<boolean>(false);

    const handleDropdown = () => {
        setDropdown(!dropdown);
        if (dropdown2 == true || dropdown3 == true) {
            setDropdown2(false);
            setDropdown3(false);
        }
    };

    const handleDropdown2 = () => {
        setDropdown2(!dropdown2);
        if (dropdown == true || dropdown3 == true) {
            setDropdown(false);
            setDropdown3(false);
        }
    };

    const handleDropdown3 = () => {
        setDropdown3(!dropdown3);
        if (dropdown == true || dropdown2 == true) {
            setDropdown(false);
            setDropdown2(false);
        }
    };


    const handleClickOutside = (event: MouseEvent) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
            setDropdown(false);
            setDropdown2(false);
            setDropdown3(false);
        }
    };

    useEffect(() => {
        if (dropdown || dropdown2 || dropdown3) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdown, dropdown2, dropdown3]);

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
                        <div className={dropdown ? 'absolute w-32 bg-[#FFFFFF] shadow-lg z-50 top-12 left-0' : 'hidden'}>
                            <ul className='flex flex-col'>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/categories')}>Danh mục</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/products')}>Sản phẩm</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('#')}>Nguyên liệu</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/prices')}>Bảng giá</li>
                            </ul>
                        </div>
                    </div>
                    <div ref={navbarRef} className='relative' onClick={() => handleDropdown2()}>
                        <li className='flex gap-x-2'>
                            Đối tác
                            {
                                dropdown2 ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                    <Image src={upArrow} alt='down arrow' width={10} height={10} />
                            }
                        </li>
                        <div className={dropdown2 ? 'absolute w-32 z-50 bg-[#FFFFFF] shadow-lg top-12 left-0' : 'hidden'}>
                            <ul className='flex flex-col'>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/customers')}>Khách hàng</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/employees')}>Nhân viên</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/suppliers')}>Nhà cung cấp</li>
                            </ul>
                        </div>
                    </div>
                    <div ref={navbarRef} className='relative' onClick={() => handleDropdown3()}>
                        <li className='flex gap-x-2'>
                            Giao dịch
                            {
                                dropdown3 ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                    <Image src={upArrow} alt='down arrow' width={10} height={10} />
                            }
                        </li>
                        <div className={dropdown3 ? 'absolute w-32 z-50 bg-[#FFFFFF] shadow-lg top-12 left-0' : 'hidden'}>
                            <ul className='flex flex-col'>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/income')}>Thu</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/expenditures')}>Chi</li>
                                <li className='hover:bg-gray-200 p-2' onClick={() => router.push('/orders')}>Đơn hàng</li>
                            </ul>
                        </div>
                    </div>
                </ul>
            </div>

            <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12">
                    <Image
                        src={bellIcon}
                        alt="bell icon"
                        width={24}
                        height={24}
                    />
                </div>
                <div>
                    <AvatarDropdownMenu
                        setUserProfileDialog={setIsUserProfileDialogOpen}
                    />
                </div>
            </div>

            <UserProfileDialog
                open={isUserProfileDialogOpen}
                setOpen={setIsUserProfileDialogOpen}
            />
        </div>
    );
}
