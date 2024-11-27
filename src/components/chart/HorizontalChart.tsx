/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import upArrow from '@/components/icon/upArrow.svg';
import downArrow from '@/components/icon/downArrow.svg';
import { Skeleton } from '@mui/material';

type ChartConfig = {
    [key: string]: { label: any };
};

interface HorizontalChartProps {
    chartName: string;
    data: any;
    loading: boolean;
    setType: (type: any) => void;
}

const HorizontalChart: React.FC<HorizontalChartProps> = ({ chartName, data, setType, loading }) => {
    const [period, setPeriod] = useState("tuần");
    const [dropdown, setDropdown] = useState(false);
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
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
        const colors = ["#e23670", "#0090d9", "#2eb88a", "#af57db", "#e88c30"];
        const updatedChartData = data?.map((product: any, index: number) => ({
            product: product.productName,
            sales: product.quantitySold || 0,
            fill: colors[index % colors.length],
        })) || [];

        const updatedChartConfig = data?.reduce((config: ChartConfig, product: any, index: number) => {
            config[product.productName] = { label: index + 1 };
            return config;
        }, {}) || {};

        setChartData(updatedChartData);
        setChartConfig(updatedChartConfig);
    }, [data]);

    return (
        <Card className='mt-10'>
            <CardHeader className='flex flex-row justify-between items-center space-x-3 lg:space-x-0'>
                {loading === true ? (
                    <div className='space-y-2'>
                        <Skeleton variant="rectangular" animation="wave" width="100px" height={20} />
                        <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                    </div>
                ) : (
                    <div>
                        <CardTitle>Top 10 {chartName.toLocaleLowerCase()} bán chạy</CardTitle>
                        <CardDescription>{`Top 10 ${chartName.toLocaleLowerCase()} bán chạy nhất trong ${period} qua:`}</CardDescription>
                    </div>
                )}
                <div ref={navbarRef} className='relative' onClick={handleDropdown}>
                    {loading === true ? (
                        <Skeleton variant="rectangular" animation="wave" width="100px" height={20} />
                    ) : (
                        <li className='flex items-center gap-x-2 font-semibold text-black'>
                            {period === 'tháng' ? 'Tháng này' : 'Năm nay'}
                            {dropdown ? (
                                <Image src={downArrow} alt='down arrow' width={10} height={10} />
                            ) : (
                                <Image src={upArrow} alt='up arrow' width={10} height={10} />
                            )}
                        </li>
                    )}
                    <div className={dropdown ? 'absolute w-32 z-[1000] bg-[#FFFFFF] shadow-lg top-8 left-0' : 'hidden'}>
                        <ul className='flex flex-col'>
                            <li className='hover:bg-gray-200 p-2 font-semibold border-b-[1px]'
                                onClick={() => {
                                    setPeriod('tháng')
                                    setType('month')
                                }}>
                                Tháng này
                            </li>
                            <li className='hover:bg-gray-200 p-2 font-semibold border-b-[1px]'
                                onClick={() => {
                                    setPeriod('năm')
                                    setType('year')
                                }}>
                                Năm nay
                            </li>
                        </ul>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton variant="rectangular" animation="wave" width="100%" height={300} />
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} layout='vertical' margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <YAxis
                                dataKey="product"
                                type="category"
                                tickLine={false}
                                tickMargin={20}
                                axisLine={false}
                                tickFormatter={(value) => chartConfig[value]?.label}
                                tick={{ fill: `black`, fontSize: 16 }}
                            />
                            <XAxis type="number" hide />
                            <Tooltip
                                formatter={(value: number) => {
                                    return value + 'kg';
                                }}
                                itemStyle={{
                                    color: "#2eb88a"
                                }}
                            />
                            <Bar dataKey="sales" name={'Tổng bán'} fill="#000000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default HorizontalChart;
