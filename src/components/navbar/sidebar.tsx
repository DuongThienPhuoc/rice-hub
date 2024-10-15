'use client';
import Image from "next/image";
import xMarkIcon from '@/components/icon/xmark.svg';
import MenuIcon from '@/components/icon/menu.svg';
import ChevronRightIcon from '@/components/icon/chevron_right_white.svg';
import ChevronDownIcon from '@/components/icon/upArrowWhite.svg';
import bellIcon from '@/components/icon/bell.svg';
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import AvatarDropdownMenu from "./avatar-dropdown-menu";
import UserProfileDialog from "./user-profile-dialog";

export default function Sidebar() {
    const [navbarExpanded, setNavbarExpanded] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [dropdown2, setDropdown2] = useState(false);
    const [dropdown3, setDropdown3] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleToggleNavbar = () => {
        setNavbarExpanded(!navbarExpanded);
    };

    const handleDropdown = () => {
        setDropdown(!dropdown);
    };

    const handleDropdown2 = () => {
        setDropdown2(!dropdown2);
    };

    const handleDropdown3 = () => {
        setDropdown3(!dropdown3);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setNavbarExpanded(false);
        }
    };

    useEffect(() => {
        if (navbarExpanded) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [navbarExpanded]);

    return (
        <div>
            <div className='flex bg-[#FFFFFF] h-[75px] w-full items-center justify-between px-2'>
                <div className="flex-1">
                    <button onClick={handleToggleNavbar}>
                        <Image
                            src={navbarExpanded ? xMarkIcon : MenuIcon}
                            alt={navbarExpanded ? 'close menu' : 'open menu'}
                            width={40}
                            height={40}
                        />
                    </button>
                </div>
                <h1 className='flex-1 font-extrabold text-[32px]'>Ricehub</h1>
                <div className='flex flex-1 justify-end items-center'>
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

            <div
                ref={sidebarRef}
                className={`fixed top-[75px] left-0 w-[250px] h-full bg-[#1f1f1d] text-white shadow-lg transition-transform duration-300 ease-in-out transform ${navbarExpanded ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className='flex items-start flex-col'>
                    <button onClick={() => router.push('/')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Trang chủ</button>
                    <button onClick={() => router.push('/dashboard')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Tài chính</button>

                    <button onClick={handleDropdown} className="flex px-5 py-3 border-b border-gray-700 hover:bg-gray-500 justify-between w-full pr-5 items-center">
                        <span>Hàng hóa</span>
                        <Image src={dropdown ? ChevronDownIcon : ChevronRightIcon} alt='toggle arrow' width={10} height={10} />
                    </button>

                    <div
                        className={`pl-3 overflow-hidden transition-[max-height] duration-500 ease-in-out ${dropdown ? 'max-h-96' : 'max-h-0'}`}
                    >
                        <button onClick={() => router.push('/categories')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Danh mục</button>
                        <button onClick={() => router.push('/products')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Sản phẩm</button>
                        <button className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Nguyên liệu</button>
                        <button onClick={() => router.push('/prices')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Bảng giá</button>
                    </div>

                    <button onClick={handleDropdown2} className="flex px-5 py-3 border-b border-gray-700 hover:bg-gray-500 justify-between w-full pr-5 items-center">
                        <span>Đối tác</span>
                        <Image src={dropdown2 ? ChevronDownIcon : ChevronRightIcon} alt='toggle arrow' width={10} height={10} />
                    </button>

                    <div
                        className={`pl-3 overflow-hidden transition-[max-height] duration-500 ease-in-out ${dropdown2 ? 'max-h-96' : 'max-h-0'}`}
                    >
                        <button onClick={() => router.push('/customers')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Khách hàng</button>
                        <button onClick={() => router.push('/employees')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Nhân viên</button>
                        <button onClick={() => router.push('/suppliers')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Nhà cung cấp</button>
                    </div>

                    <button onClick={handleDropdown3} className="flex px-5 py-3 border-b border-gray-700 hover:bg-gray-500 justify-between w-full pr-5 items-center">
                        <span>Giao dịch</span>
                        <Image src={dropdown3 ? ChevronDownIcon : ChevronRightIcon} alt='toggle arrow' width={10} height={10} />
                    </button>

                    <div
                        className={`pl-3 overflow-hidden transition-[max-height] duration-500 ease-in-out ${dropdown3 ? 'max-h-96' : 'max-h-0'}`}
                    >
                        <button onClick={() => router.push('/income')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Thu</button>
                        <button onClick={() => router.push('/expenditures')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Chi</button>
                        <button onClick={() => router.push('/orders')} className="w-full text-start px-5 py-3 hover:bg-gray-500 border-b border-gray-700">Đơn hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
