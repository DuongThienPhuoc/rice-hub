'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import Image from 'next/image';
import upArrow from '@/components/icon/upArrow.svg';
import downArrow from '@/components/icon/downArrow.svg';

const generateRandomRevenue = () => {
    return Math.floor(Math.random() * (1000000000 - 100000000) + 100000000);
};

const BarChartComponent: React.FC<{ chartName: string, color: string }> = ({ chartName, color }) => {
    const [chartData, setChartData] = useState<{ label: string; revenue: number }[]>([]);
    const [period, setPeriod] = useState("tháng");
    const [dropdown, setDropdown] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);

    const handleDropdown = () => {
        setDropdown(!dropdown);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
            setDropdown(false);
        }
    };

    useEffect(() => {
        if (dropdown) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdown]);

    useEffect(() => {
        let periodData: { label: string; revenue: number }[] = [];

        switch (period) {
            case 'tuần':
                const weekLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
                periodData = weekLabels.map(label => ({ label, revenue: generateRandomRevenue() }));
                break;
            case 'tháng':
                const currentMonthDays = dayjs().daysInMonth();
                periodData = Array.from({ length: currentMonthDays }, (_, index) => ({
                    label: (index + 1).toString(),
                    revenue: generateRandomRevenue(),
                }));
                break;
            case 'năm':
                const yearLabels = [
                    'T1',
                    'T2',
                    'T3',
                    'T4',
                    'T5',
                    'T6',
                    'T7',
                    'T8',
                    'T9',
                    'T10',
                    'T11',
                    'T12',
                ];
                periodData = yearLabels.map(label => ({ label, revenue: generateRandomRevenue() }));
                break;
        }

        setChartData(periodData);
    }, [period]);

    return (
        <Card className='mt-10'>
            <CardHeader className='flex flex-row justify-between items-center'>
                <div>
                    <CardTitle>{chartName}</CardTitle>
                    <CardDescription>{`${chartName} cho ${period} hiện tại:`}</CardDescription>
                </div>
                <div ref={navbarRef} className='relative' onClick={() => handleDropdown()}>
                    <li className='flex items-center gap-x-2 font-semibold text-black'>
                        {period === 'tháng' && (
                            <>Tháng này</>
                        )}
                        {period === 'tuần' && (
                            <>Tuần này</>
                        )}
                        {period === 'năm' && (
                            <>Năm nay</>
                        )}
                        {
                            dropdown ? <Image src={downArrow} alt='up arrow' width={10} height={10} /> :
                                <Image src={upArrow} alt='down arrow' width={10} height={10} />
                        }
                    </li>
                    <div className={dropdown ? 'absolute w-32 z-[1000] bg-[#FFFFFF] shadow-lg top-8 left-0' : 'hidden'}>
                        <ul className='flex flex-col'>
                            <li className='hover:bg-gray-200 p-2 font-semibold border-b-[1px]' onClick={() => setPeriod('tháng')}>Tháng này</li>
                            <li className='hover:bg-gray-200 p-2 font-semibold border-b-[1px]' onClick={() => setPeriod('tuần')}>Tuần này</li>
                            <li className='hover:bg-gray-200 p-2 font-semibold border-b-[1px]' onClick={() => setPeriod('năm')}>Năm nay</li>
                        </ul>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" />
                        <Tooltip
                            formatter={(value: number) =>
                                chartName === 'Doanh thu' || chartName === 'Chi tiêu'
                                    ? `${new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        maximumSignificantDigits: 2,
                                    }).format(value)}`
                                    : `${value} kg`
                            }
                        />
                        <Bar dataKey="revenue" name={`${chartName}`} fill={`${color}`} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default BarChartComponent;
