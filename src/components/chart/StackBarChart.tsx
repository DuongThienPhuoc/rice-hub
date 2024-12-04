/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import 'dayjs/locale/vi';
import { Skeleton } from '@mui/material';

interface RowData {
    [key: string]: any;
}

const StackBarChartComponent: React.FC<{ chartName: string, color1: string, color2: string, data: RowData, loading: boolean }> = ({ chartName, data, color1, color2, loading }) => {
    const [chartData, setChartData] = useState<{ label: string; paidRevenue: number; unpaidRevenue: number }[]>([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [totalUnpaid, setTotalUnpaid] = useState(0);

    useEffect(() => {
        const periodData = data.map((order: RowData) => ({
            label: order.month,
            paidRevenue: order.totalPaid,
            unpaidRevenue: order.totalRemain,
        }));

        setTotalPaid(periodData.reduce((sum: number, item: RowData) => sum + item.paidRevenue, 0))

        setTotalUnpaid(periodData.reduce((sum: number, item: RowData) => sum + item.unpaidRevenue, 0))

        setChartData(periodData);
    }, [data]);

    return (
        <Card className='mt-10'>
            <CardHeader>
                {loading === true ? (
                    <div className='space-y-2'>
                        <Skeleton variant="rectangular" animation="wave" width="100px" height={20} />
                        <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                    </div>
                ) : (
                    <>
                        <CardTitle>{chartName}</CardTitle>
                        <CardDescription>{chartName} của 5 tháng gần nhất:</CardDescription>
                    </>
                )}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton variant="rectangular" animation="wave" width="100%" height={300} />
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" />
                            <Tooltip
                                formatter={(value: number) =>
                                    `${new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }).format(value)}`
                                }
                            />
                            <Legend />
                            <Bar dataKey="paidRevenue" stackId="a" fill={color1} name="Đã thu" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="unpaidRevenue" stackId="a" fill={color2} name="Chưa thu" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col w-full items-start gap-2 text-sm">
                {loading ? (
                    <div className="flex w-full justify-between gap-2 font-medium leading-none">
                        <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                        <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                    </div>
                ) : (
                    <div className="flex w-full justify-between gap-2 font-medium leading-none">
                        <p className='text-[#2eb88a]'>
                            Tổng đã thu: {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            }).format(totalPaid)}
                        </p>
                        <p className='text-[#e88c30]'>
                            Tổng chưa thu: {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            }).format(totalUnpaid)}
                        </p>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default StackBarChartComponent;
