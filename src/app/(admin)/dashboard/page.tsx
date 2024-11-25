/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import BarChart from '@/components/chart/BarChart';
import MultipleBarChart from '@/components/chart/MultipleBarChart';
import StackBarChart from '@/components/chart/StackBarChart';
import FloatingButton from '@/components/floating/floatingButton';
import DonutChart from '@/components/chart/PieChart';
import HorizontalChart from '@/components/chart/HorizontalChart';
import api from "@/config/axiosConfig";
import { useToast } from '@/hooks/use-toast';

const Page = () => {
    const { toast } = useToast();
    const [loadingData, setLoadingData] = useState(true);
    const [expenseType, setExpenseType] = useState('day');
    const [expenseReport, setExpenseReport] = useState<any>([]);

    const getExpenseType = async (type: string) => {
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            const url = `/ExpenseVoucher/report?type=${type}&date=${formattedDate}`;
            const response = await api.get(url);
            const data = response.data;
            setExpenseReport(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Lỗi khi lấy báo cáo phiếu thu!',
                description: 'Xin vui lòng thử lại',
                duration: 3000
            })
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getExpenseType(expenseType);
    }, [expenseType]);

    return (
        <div>
            <div className='flex justify-center px-5 w-full' >
                <div className='w-full'>
                    <div className='bg-white w-full rounded-md px-5 py-3' style={{ boxShadow: '5px 5px 5px lightgray' }}>
                        <h1 className='text-black text-[20px] font-bold mt-3'>Báo cáo ngày</h1>
                        <div className='flex flex-col xl:flex-row mb-3'>
                            <div className='flex-1 mr-2'>
                                <MultipleBarChart chartName='Đơn hàng' color1='#0090d9' color2='#e23670' />
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
                                <BarChart loading={loadingData} chartName='Doanh thu' color='#0090d9' data={expenseReport} type={expenseType} setType={setExpenseType} />
                            </div>
                            <div className='flex-1 mx-2'>
                                <BarChart loading={loadingData} chartName='Doanh số' color='#2eb88a' data={expenseReport} type={expenseType} setType={setExpenseType} />
                            </div>
                        </div>
                        <div className='flex flex-col xl:flex-row mb-3 mt-7'>
                            <div className='flex-1 mx-2'>
                                <BarChart loading={loadingData} chartName='Chi tiêu' color='#e23670' data={expenseReport} type={expenseType} setType={setExpenseType} />
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