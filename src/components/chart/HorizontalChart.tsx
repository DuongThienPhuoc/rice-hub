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
    [key: number]: { label: string };
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
        { product: "1", sales: generateRandomRevenue(), fill: "#e23670" },
        { product: "2", sales: generateRandomRevenue(), fill: "#2662d9" },
        { product: "3", sales: generateRandomRevenue(), fill: "#2eb88a" },
        { product: "4", sales: generateRandomRevenue(), fill: "#af57db" },
        { product: "5", sales: generateRandomRevenue(), fill: "#e88c30" },
        { product: "6", sales: generateRandomRevenue(), fill: "#e23670" },
        { product: "7", sales: generateRandomRevenue(), fill: "#2662d9" },
        { product: "8", sales: generateRandomRevenue(), fill: "#2eb88a" },
        { product: "9", sales: generateRandomRevenue(), fill: "#af57db" },
        { product: "10", sales: generateRandomRevenue(), fill: "#e88c30" },
    ];

    const chartConfig: ChartConfig = {
        1: { label: "Gạo ST25" },
        2: { label: "Gạo ST21" },
        3: { label: "Gạo huyết rồng" },
        4: { label: "Gạo lứt" },
        5: { label: "Gạo nghệ" },
        6: { label: "Gạo ST25" },
        7: { label: "Gạo ST21" },
        8: { label: "Gạo huyết rồng" },
        9: { label: "Gạo lứt" },
        10: { label: "Gạo nghệ" },
    };

    return (
        <Card>
            <CardHeader className='flex flex-row justify-between items-center'>
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
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={chartData} layout='vertical' margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <YAxis
                            dataKey="product"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => chartConfig[value]?.label}
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
                        />
                        <Bar dataKey="sales" name={chartName} fill="#000000" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default HorizontalChart;
