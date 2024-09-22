'use client'

import Image from "next/image";
import bellIcon from '@/components/icon/bell.svg'
import userIcon from '@/components/icon/user.svg'
import downArrow from '@/components/icon/downArrow.svg'
import upArrow from '@/components/icon/upArrow.svg'
import {useState} from "react";

export default function Navbar() {

    const [dropdown, setDropdown] = useState(false)
    const handleDropdown = () => {
        setDropdown(!dropdown)
    }

    return (
        // Navbar
        <div className='flex bg-[#FFFFFF] h-[75px] w-full justify-between px-2'>
            <div className='logo flex items-center'>
                <h1 className='font-extrabold text-[32px]'>Ricehub</h1>
            </div>

            <div>
                <ul className='flex items-center gap-x-4 font-bold h-full'>
                    <li>Tài chính</li>
                    <div className='relative' onClick={() => handleDropdown()}>
                        <li className='flex gap-x-1'>
                            Kho
                            {
                                dropdown ? <Image src={downArrow} alt='up arrow' width={10} height={10}/> :
                                    <Image src={upArrow} alt='down arrow' width={10} height={10}/>
                            }
                        </li>
                        <div className={dropdown ? 'absolute w-32 bg-[#FFFFFF] top-12 left-0 p-2': 'hidden'}>
                            <ul className='flex flex-col gap-y-3'>
                                <li>Danh mục</li>
                                <li>Sản phẩm</li>
                                <li>Nguyên liệu</li>
                            </ul>
                        </div>
                    </div>
                    <li>Giao dịch</li>
                    <li>Khách hàng</li>
                    <li>Nhân viên</li>
                    <li>Nhà cung cấp</li>
                </ul>
            </div>

            <div className='flex items-center'>
                <div className='flex items-center justify-center w-12 h-12'>
                    <Image src={bellIcon} alt='bell icon' width={24} height={24}/>
                </div>
                <div className='flex items-center justify-center w-12 h-12 bg-[#F2F4F8] rounded-full'>
                    <Image src={userIcon} alt='bell icon' width={24} height={24}/>
                </div>
            </div>
        </div>
    )
}