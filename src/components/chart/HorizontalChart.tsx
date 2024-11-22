/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import upArrow from '@/components/icon/upArrow.svg';
import downArrow from '@/components/icon/downArrow.svg';

const generateRandomRevenue = () => {
    return Math.floor(Math.random() * (1000000000 - 100000000) + 100000000);
};

type ChartConfig = {
    [key: string]: { label: any };
};

const HorizontalChart: React.FC<{ chartName: string }> = ({ chartName }) => {
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

    const chartData = [
        { product: "Gạo ST25", sales: generateRandomRevenue(), fill: "#e23670" },
        { product: "Gạo ST21", sales: generateRandomRevenue(), fill: "#0090d9" },
        { product: "Gạo huyết rồng", sales: generateRandomRevenue(), fill: "#2eb88a" },
        { product: "Gạo lứt", sales: generateRandomRevenue(), fill: "#af57db" },
        { product: "Gạo nghệ", sales: generateRandomRevenue(), fill: "#e88c30" },
        { product: "Gạo ST22", sales: generateRandomRevenue(), fill: "#e23670" },
        { product: "Gạo ST23", sales: generateRandomRevenue(), fill: "#0090d9" },
        { product: "Gạo huyết long", sales: generateRandomRevenue(), fill: "#2eb88a" },
        { product: "Gạo mẻ", sales: generateRandomRevenue(), fill: "#af57db" },
        { product: "Gạo An Nam", sales: generateRandomRevenue(), fill: "#e88c30" },
    ];

    const chartConfig: ChartConfig = {
        'Gạo ST25': { label: 1 },
        "Gạo ST21": { label: 2 },
        "Gạo huyết rồng": { label: 3 },
        "Gạo lứt": { label: 4 },
        "Gạo nghệ": { label: 5 },
        "Gạo ST22": { label: 6 },
        "Gạo ST23": { label: 7 },
        "Gạo huyết long": { label: 8 },
        "Gạo mẻ": { label: 9 },
        "Gạo An Nam": { label: 10 },
    };

    return (
        <Card className='mt-10'>
            <CardHeader className='flex flex-row justify-between items-center space-x-3 lg:space-x-0'>
                <div>
                    <CardTitle>Top 10 {chartName.toLocaleLowerCase()} bán chạy</CardTitle>
                    <CardDescription>{`Top 10 ${chartName.toLocaleLowerCase()} bán chạy nhất trong ${period} qua:`}</CardDescription>
                </div>
                <div ref={navbarRef} className='relative' onClick={handleDropdown}>
                    <li className='flex items-center gap-x-2 font-semibold text-black'>
                        {period === 'tháng' ? 'Tháng này' : 'Năm nay'}
                        {dropdown ? (
                            <Image src={downArrow} alt='down arrow' width={10} height={10} />
                        ) : (
                            <Image src={upArrow} alt='up arrow' width={10} height={10} />
                        )}
                    </li>
                    <div className={dropdown ? 'absolute w-32 z-[1000] bg-[#FFFFFF] shadow-lg top-8 left-0' : 'hidden'}>
                        <ul className='flex flex-col'>
                            <li className='hover:bg-gray-200 p-2 font-semibold border-b-[1px]' onClick={() => setPeriod('tháng')}>Tháng này</li>
                            <li className='hover:bg-gray-200 p-2 font-semibold border-b-[1px]' onClick={() => setPeriod('năm')}>Năm nay</li>
                        </ul>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
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
                                return new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                    maximumSignificantDigits: 2,
                                }).format(value);
                            }}
                            itemStyle={{
                                color: "#2eb88a"
                            }}
                        />
                        <Bar dataKey="sales" name={chartName} fill="#000000" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default HorizontalChart;
