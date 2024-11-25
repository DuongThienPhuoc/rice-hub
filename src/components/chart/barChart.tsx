/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import Image from 'next/image';
import upArrow from '@/components/icon/upArrow.svg';
import downArrow from '@/components/icon/downArrow.svg';
import { Skeleton } from '@mui/material';

interface BarChartProps {
    chartName: string;
    color: string;
    data: any;
    type: any;
    loading: boolean;
    setType: (type: any) => void;
}

const BarChartComponent: React.FC<BarChartProps> = ({ chartName, color, setType, data, loading }) => {
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
                const today = dayjs();
                const startOfWeek = today.startOf('week').add(1, 'day');
                periodData = weekLabels.map((label, index) => {
                    const targetDate = startOfWeek.add(index, 'day');
                    const matchingData = data.find((item: any) => {
                        return targetDate.date() === item.period;
                    });

                    return {
                        label,
                        revenue: matchingData ? matchingData.totalAmount : 0,
                    };
                });

                break;
            case 'tháng':
                const currentMonthDays = dayjs().daysInMonth();
                periodData = Array.from({ length: currentMonthDays }, (_, index) => {
                    const matchingData = data.find((item: any) => item.period === index + 1);
                    return {
                        label: (index + 1).toString(),
                        revenue: matchingData ? matchingData.totalAmount : 0,
                    };
                });
                break;
            case 'năm':
                const yearLabels = [
                    'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
                ];

                periodData = yearLabels.map((label, index) => {
                    const month = index + 1;
                    const matchingData = data.find((item: any) => item.period === month);

                    return {
                        label,
                        revenue: matchingData ? matchingData.totalAmount : 0,
                    };
                });
                break;
        }
        setChartData(periodData);
    }, [period, data]);

    return (
        <Card className="mt-10">
            <CardHeader className="flex flex-row justify-between items-center">
                {loading === true ? (
                    <div className='space-y-2'>
                        <Skeleton variant="rectangular" animation="wave" width="100px" height={20} />
                        <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                    </div>
                ) : (
                    <div>
                        <CardTitle>{chartName}</CardTitle>
                        <CardDescription>{`${chartName} cho ${period} hiện tại:`}</CardDescription>
                    </div>
                )}

                <div ref={navbarRef} className="relative" onClick={() => handleDropdown()}>
                    {loading === true ? (
                        <Skeleton variant="rectangular" animation="wave" width="100px" height={20} />
                    ) : (
                        <li className="flex items-center gap-x-2 font-semibold text-black">
                            {period === 'tháng' && <>Tháng này</>}
                            {period === 'tuần' && <>Tuần này</>}
                            {period === 'năm' && <>Năm nay</>}
                            {dropdown ? (
                                <Image src={downArrow} alt="up arrow" width={10} height={10} />
                            ) : (
                                <Image src={upArrow} alt="down arrow" width={10} height={10} />
                            )}
                        </li>
                    )}
                    <div
                        className={
                            dropdown ? 'absolute w-32 z-[1000] bg-[#FFFFFF] shadow-lg top-8 left-0' : 'hidden'
                        }
                    >
                        <ul className="flex flex-col">
                            <li
                                className="hover:bg-gray-200 p-2 font-semibold border-b-[1px]"
                                onClick={() => {
                                    setPeriod('tháng');
                                    setType('day');
                                }}
                            >
                                Tháng này
                            </li>
                            <li
                                className="hover:bg-gray-200 p-2 font-semibold border-b-[1px]"
                                onClick={() => {
                                    setPeriod('tuần');
                                    setType('week');
                                }}
                            >
                                Tuần này
                            </li>
                            <li
                                className="hover:bg-gray-200 p-2 font-semibold border-b-[1px]"
                                onClick={() => {
                                    setPeriod('năm');
                                    setType('month');
                                }}
                            >
                                Năm nay
                            </li>
                        </ul>
                    </div>
                </div>
            </CardHeader >
            <CardContent>
                {loading ? (
                    <Skeleton variant="rectangular" animation="wave" width="100%" height={300} />
                ) : (
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
                )}
            </CardContent>
        </Card >
    );
};

export default BarChartComponent;
