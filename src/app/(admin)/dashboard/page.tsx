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
import upArrow from '@/components/icon/upArrow.svg';
import downArrow from '@/components/icon/downArrow.svg';

const Page = () => {
    const [dropdown, setDropdown] = useState(false);
    const [navbarVisible, setNavbarVisible] = useState(false);
    const [chart1Period, setChart1Period] = useState("month");
    const [chart2Period, setChart2Period] = useState("month");

    const handleDropdown = () => {
        setDropdown(!dropdown);
    };

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
                        <div className='flex justify-between items-center mb-7'>
                            {chart1Period === 'month' && (
                                <h1 className="text-black font-bold">Doanh thu tháng này</h1>
                            )}
                            {chart1Period === 'week' && (
                                <h1 className="text-black font-bold">Doanh thu tuần này</h1>
                            )}
                            {chart1Period === 'year' && (
                                <h1 className="text-black font-bold">Doanh thu năm nay</h1>
                            )}
                            <div className='relative' onClick={() => handleDropdown()}>
                                <li className='flex items-center gap-x-2 font-bold text-[#0070f4]'>
                                    {chart1Period === 'month' && (
                                        <>Tháng này</>
                                    )}
                                    {chart1Period === 'week' && (
                                        <>Tuần này</>
                                    )}
                                    {chart1Period === 'year' && (
                                        <>Năm nay</>
                                    )}
                                    {
                                        dropdown ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                            <Image src={upArrow} alt='down arrow' width={10} height={10} />
                                    }
                                </li>
                                <div className={dropdown ? 'absolute w-32 bg-[#FFFFFF] shadow-lg top-8 left-0' : 'hidden'}>
                                    <ul className='flex flex-col'>
                                        <li className='hover:bg-gray-200 p-2 font-semibold text-blue-500 border-b-[1px] border-blue-500' onClick={() => setChart1Period('month')}>Tháng này</li>
                                        <li className='hover:bg-gray-200 p-2 font-semibold text-blue-500 border-b-[1px] border-blue-500' onClick={() => setChart1Period('week')}>Tuần này</li>
                                        <li className='hover:bg-gray-200 p-2 font-semibold text-blue-500 border-b-[1px] border-blue-500' onClick={() => setChart1Period('year')}>Năm nay</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <BarChart period={chart1Period} />
                    </div>
                    <div className='bg-white rounded-md px-5 py-5 mt-7' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                        <div className='flex justify-between items-center mb-7'>
                            {chart2Period === 'month' && (
                                <h1 className="text-black font-bold">Top 10 sản phẩm bán chạy tháng này</h1>
                            )}
                            {chart2Period === 'year' && (
                                <h1 className="text-black font-bold">Top 10 sản phẩm bán chạy năm nay</h1>
                            )}
                            <div className='relative' onClick={() => handleDropdown()}>
                                <li className='flex items-center gap-x-2 font-bold text-[#0070f4]'>
                                    {chart2Period === 'month' && (
                                        <>Tháng này</>
                                    )}
                                    {chart2Period === 'year' && (
                                        <>Năm nay</>
                                    )}
                                    {
                                        dropdown ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                            <Image src={upArrow} alt='down arrow' width={10} height={10} />
                                    }
                                </li>
                                <div className={dropdown ? 'absolute w-32 bg-[#FFFFFF] shadow-lg top-8 left-0' : 'hidden'}>
                                    <ul className='flex flex-col'>
                                        <li className='hover:bg-gray-200 p-2 font-semibold text-blue-500 border-b-[1px] border-blue-500' onClick={() => setChart2Period('month')}>Tháng này</li>
                                        <li className='hover:bg-gray-200 p-2 font-semibold text-blue-500 border-b-[1px] border-blue-500' onClick={() => setChart2Period('year')}>Năm nay</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <HorizontalBarChart />
                    </div>
                </div>
            </div>
            <FloatingButton />
        </div>
    );
};

export default Page;