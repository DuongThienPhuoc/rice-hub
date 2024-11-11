'use client';
import React from 'react';
import BarChart from '@/components/chart/barChart';
import MultipleBarChart from '@/components/chart/MultipleBarChart';
import StackBarChart from '@/components/chart/StackBarChart';
import FloatingButton from '@/components/floating/floatingButton';
import DonutChart from '@/components/chart/PieChart';
import HorizontalChart from '@/components/chart/HorizontalChart';

const Page = () => {
    return (
        <div>
            <div className='flex my-5 justify-center px-5 w-full' >
                <div className='w-[95%]'>
                    <div className='bg-white w-full rounded-md px-5 py-3' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                        <h1 className='text-black text-[20px] font-bold mt-3'>Báo cáo ngày</h1>
                        <div className='flex flex-col xl:flex-row mb-3'>
                            <div className='flex-1 mr-2'>
                                <MultipleBarChart chartName='Đơn hàng' color1='#2662d9' color2='#e23670' />
                            </div>
                            <div className='flex-1 mx-2'>
                                <StackBarChart chartName='Hóa đơn' color1='#2eb88a' color2='#e88c30' />
                            </div>
                            <div className='flex-1 ml-2'>
                                <DonutChart chartName='Nguồn thu' />
                            </div>
                        </div>

                        <h1 className='text-black text-[20px] font-bold mt-10'>Báo cáo định kỳ</h1>
                        <div className='flex flex-col xl:flex-row mb-3'>
                            <div className='flex-1 mx-2'>
                                <BarChart chartName='Doanh thu' color='#2662d9' />
                            </div>
                            <div className='flex-1 mx-2'>
                                <BarChart chartName='Doanh số' color='#2eb88a' />
                            </div>
                        </div>
                        <div className='flex flex-col xl:flex-row mb-3 mt-7'>
                            <div className='flex-1 mx-2'>
                                <BarChart chartName='Chi tiêu' color='#e23670' />
                            </div>
                            <div className='flex-1 mx-2'>
                                <HorizontalChart chartName='Sản phẩm' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FloatingButton />
        </div>
    );
};

export default Page;