'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import bellIcon from '@/components/icon/bell.svg';
import downArrow from '@/components/icon/downArrow.svg';
import upArrow from '@/components/icon/upArrow.svg';
import { useState } from 'react';
import AvatarDropdownMenu from "@/components/navbar/avatar-dropdown-menu";

export default function Navbar() {
    const router = useRouter();
    const [dropdown, setDropdown] = useState(false);

    const handleDropdown = () => {
        setDropdown(!dropdown);
    };

    const navigateToDashboard = () => {
        router.push('/dashboard');
    };

    const navigateToProduct = () => {
        router.push('/products');
    };

    const navigateToCustomer = () => {
        router.push('/customers');
    };

    const navigateToEmployee = () => {
        router.push('/employees');
    };

    const navigateToCategory = () => {
        router.push('/categories');
    };

    const navigateToSupplier = () => {
        router.push('/suppliers');
    };

    return (
        // Navbar
        <div className='flex bg-[#FFFFFF] h-[75px] w-full justify-between px-4'>
            <div className='logo flex items-center ms-3'>
                <h1 className='font-extrabold text-[32px]'>Ricehub</h1>
            </div>
            <div className='flex items-center gap-x-10 font-bold h-full'>
                <ul className='flex items-center gap-x-10'>
                    <li onClick={navigateToDashboard} className="cursor-pointer">Tài chính</li>
                    <div className='relative' onClick={() => handleDropdown()}>
                        <li className='flex gap-x-2'>
                            Hàng hóa
                            {
                                dropdown ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                    <Image src={upArrow} alt='down arrow' width={10} height={10} />
                            }
                        </li>
                        <div className={dropdown ? 'absolute w-32 bg-[#FFFFFF] shadow-lg top-12 left-0' : 'hidden'}>
                            <ul className='flex flex-col'>
                                <li className='hover:bg-gray-200 p-2' onClick={navigateToCategory}>Danh mục</li>
                                <li className='hover:bg-gray-200 p-2' onClick={navigateToProduct}>Sản phẩm</li>
                                <li className='hover:bg-gray-200 p-2'>Nguyên liệu</li>
                            </ul>
                        </div>
                    </div>
                    <li>Giao dịch</li>
                    <li onClick={navigateToCustomer}>Khách hàng</li>
                    <li onClick={navigateToEmployee}>Nhân viên</li>
                    <li onClick={navigateToSupplier}>Nhà cung cấp</li>
                </ul>
            </div>


            <div className='flex items-center'>
                <div className='flex items-center justify-center w-12 h-12'>
                    <Image src={bellIcon} alt='bell icon' width={24} height={24} />
                </div>
                <div>
                    <AvatarDropdownMenu/>
                </div>
            </div>

        </div>
    );
}
