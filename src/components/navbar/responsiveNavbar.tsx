'use client';
import Image from "next/image";
import xMarkIcon from '@/components/icon/xmark.svg';
import MenuIcon from '@/components/icon/menu.svg';
import ChevronRightIcon from '@/components/icon/chevron_right_white.svg';
import ChevronDownIcon from '@/components/icon/upArrowWhite.svg';
import bellIcon from '@/components/icon/bell.svg';
import userIcon from '@/components/icon/user.svg';
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function ResponsiveNavbar() {
    const [navbarExpanded, setNavbarExpanded] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const router = useRouter();

    const handleToggleNavbar = () => {
        setNavbarExpanded(!navbarExpanded);
    };

    const handleDropdown = () => {
        setDropdown(!dropdown);
    };

    const navigateToDashboard = () => {
        router.push('/dashboard');
    };

    const navigateToProduct = () => {
        router.push('/products');
    };

    return (
        <div>
            <div className='flex bg-[#FFFFFF] h-[75px] w-full items-center justify-between px-2'>
                <div>
                    <button onClick={handleToggleNavbar}>
                        <Image
                            src={navbarExpanded ? xMarkIcon : MenuIcon}
                            alt={navbarExpanded ? 'close menu' : 'open menu'}
                            width={40}
                            height={40}
                        />
                    </button>
                </div>
                <h1 className='font-extrabold text-[32px]'>Ricehub</h1>
                <div className='flex items-center'>
                    <div className='flex items-center justify-center w-12 h-12'>
                        <Image src={bellIcon} alt='bell icon' width={24} height={24} />
                    </div>
                    <div className='flex items-center justify-center w-12 h-12 bg-[#F2F4F8] rounded-full'>
                        <Image src={userIcon} alt='user icon' width={24} height={24} />
                    </div>
                </div>
            </div>

            <div
                className={`fixed top-[75px] left-0 w-[250px] h-full bg-[#1f1f1d] text-white shadow-lg transition-transform duration-300 ease-in-out transform ${navbarExpanded ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='flex items-start flex-col'>
                    <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Trang chủ</button>
                    <button onClick={navigateToDashboard} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Tài chính</button>

                    <button onClick={handleDropdown} className="flex px-5 py-3 border-b border-gray-700 hover:bg-gray-500 justify-between w-full pr-5 items-center">
                        <span>Hàng hóa</span>
                        <Image src={dropdown ? ChevronDownIcon : ChevronRightIcon} alt='toggle arrow' width={10} height={10} />
                    </button>

                    <div
                        className={`pl-3 overflow-hidden transition-[max-height] duration-500 ease-in-out ${dropdown ? 'max-h-96' : 'max-h-0'}`}>
                        <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Danh mục</button>
                        <button onClick={navigateToProduct} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Sản phẩm</button>
                        <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Nguyên liệu</button>
                    </div>

                    <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Giao dịch</button>
                    <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Khách hàng</button>
                    <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Nhân viên</button>
                    <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Nhà cung cấp</button>
                </div>
            </div>
        </div>
    );
}
