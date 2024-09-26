'use client';
import Navbar from '@/components/navbar/navbar';
import ResponsiveNavbar from '@/components/navbar/responsiveNavbar';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DollarIcon from '@/components/icon/dollar_circle.svg';
import ArrowUp from '@/components/icon/circle_arrow_up.svg';
import ArrowDown from '@/components/icon/circle_arrow_down.svg';
import BarChart from '@/components/chart/barChart';
import HorizontalBarChart from '@/components/chart/horizontalBarChart';
import FloatingButton from '@/components/floating/floatingButton';

const Page = () => {

    const [navbarVisible, setNavbarVisible] = useState(false);

    useEffect(() => {
        const updateNavbarVisibility = () => {
            const shouldShowNavbar = window.innerWidth >= 1100;
            setNavbarVisible(shouldShowNavbar);
        };

        updateNavbarVisibility();

        window.addEventListener('resize', updateNavbarVisibility);

        return () => {
            window.removeEventListener('resize', updateNavbarVisibility);
        };
    }, []);

    return (
        <div>
            {navbarVisible ? (
                <Navbar />
            ) : (
                <ResponsiveNavbar />
            )}
            <div className='flex my-5 justify-center px-5 w-full' >
                <div className='w-[95%] md:w-[70%]'>
                    <div className='bg-white w-full rounded-md px-5 py-3' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                        <h1 className='text-black font-bold mb-3'>Kết quả bán hàng hôm nay</h1>
                        <div className='flex flex-col md:flex-row'>
                            <div className='flex-1 md:border-r-2 border-gray-200'>
                                <div className='flex items-center justify-center md:justify-start'>
                                    <div className='pl-1 pr-3'>
                                        <Image className='min-w-[30px] min-h-[30px]' width={30} height={30} src={DollarIcon} alt='dollar icon' />
                                    </div>
                                    <div>
                                        <div><p className='text-[14px] font-bold'>29 hóa đơn</p></div>
                                        <div><p className='text-[20px] font-semibold text-[#0070f4]'>221,352,000</p></div>
                                        <div><p className='text-[14px] font-semibold text-[#9d9d9d]'>Doanh thu</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-1 md:border-r-2 border-gray-200'>
                                <div className='flex items-center justify-center md:justify-start'>
                                    <div className='md:pl-5 pr-3'>
                                        <Image className='min-w-[30px] min-h-[30px]' width={30} height={30} src={ArrowUp} alt='dollar icon' />
                                    </div>
                                    <div>
                                        <div><p className='mt-[21px] text-[20px] font-semibold text-[#00b63e]'>35.94%</p></div>
                                        <div><p className='text-[14px] font-semibold text-[#9d9d9d]'>So với hôm qua</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='flex items-center justify-center md:justify-start'>
                                    <div className='md:pl-5 pr-3'>
                                        <Image className='min-w-[30px] min-h-[30px]' width={30} height={30} src={ArrowDown} alt='dollar icon' />
                                    </div>
                                    <div>
                                        <div><p className='mt-[21px] text-[20px] font-semibold text-[#ed232f]'>-6.52%</p></div>
                                        <div><p className='text-[14px] font-semibold text-[#9d9d9d]'>So với cùng kỳ tháng trước</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white rounded-md px-5 py-5 mt-7' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                        <h1 className="text-black font-bold mb-7">Doanh thu tháng này</h1>
                        <BarChart />
                    </div>
                    <div className='bg-white rounded-md px-5 py-5 mt-7' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                        <h1 className="text-black font-bold mb-7">Top 10 sản phẩm bán chạy tháng này</h1>
                        <HorizontalBarChart />
                    </div>
                </div>
            </div>
            <FloatingButton />
        </div>
    );
};

export default Page;