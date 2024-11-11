'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const generateRandomData = () => {
    return Math.floor(Math.random() * (10000000 - 1000000) + 1000000);
};

const getLastFiveMonths = () => {
    const months = [];
    dayjs.locale('vi');
    for (let i = 0; i < 5; i++) {
        const month = dayjs().subtract(i, 'month').format('MMMM');
        months.unshift(month.charAt(0).toUpperCase() + month.slice(1));
    }
    return months;
};

const StackBarChartComponent: React.FC<{ chartName: string, color1: string, color2: string }> = ({ chartName, color1, color2 }) => {
    const [chartData, setChartData] = useState<{ label: string; paidRevenue: number; unpaidRevenue: number }[]>([]);

    useEffect(() => {
        const months = getLastFiveMonths();

        const periodData = months.map(month => ({
            label: month,
            paidRevenue: generateRandomData(),
            unpaidRevenue: generateRandomData(),
        }));

        setChartData(periodData);
    }, []);

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>{chartName}</CardTitle>
                <CardDescription>{chartName} của 5 tháng gần nhất:</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" />
                        <Tooltip
                            formatter={(value: number) =>
                                `${new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                    maximumSignificantDigits: 2,
                                }).format(value)}`
                            }
                        />
                        <Legend />
                        <Bar dataKey="paidRevenue" stackId="a" fill={color1} name="Đã thu" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="unpaidRevenue" stackId="a" fill={color2} name="Chưa thu" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col w-full items-start gap-2 text-sm">
                <div className="flex w-full justify-between gap-2 font-medium leading-none">
                    <p className='text-[#2eb88a]'>
                        Tổng đã thu:
                    </p>
                    <p className='text-[#e88c30]'>
                        Tổng chưa thu:
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
};

export default StackBarChartComponent;
