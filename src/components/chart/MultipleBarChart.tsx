'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const generateRandomData = () => {
    return Math.floor(Math.random() * (10000 - 1000) + 1000);
};

const MultipleBarChartComponent: React.FC<{ chartName: string, color1: string, color2: string }> = ({ chartName, color1, color2 }) => {
    const [chartData, setChartData] = useState<{ label: string; order: number; revenue: number }[]>([]);

    useEffect(() => {
        const periodData = [
            {
                label: 'Hôm qua',
                order: generateRandomData(),
                revenue: generateRandomData(),
            },
            {
                label: 'Hôm nay',
                order: generateRandomData(),
                revenue: generateRandomData(),
            },
        ];

        setChartData(periodData);
    }, []);

    interface CustomTooltipProps {
        active?: boolean;
        payload?: { name: string; value: number }[];
    }

    const tooltipStyle = {
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    };

    const tooltipTextStyle = {
        margin: 0,
    };

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={tooltipStyle}>
                    <p style={tooltipTextStyle}>
                        <span className={`text-[#0090d9]`}>
                            Số lượng đơn: {payload[0]?.value} {chartName.toLowerCase()}
                        </span>
                        <br />
                        <span className={`text-[#e23670]`}>
                            Giá trị: {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                maximumSignificantDigits: 2,
                            }).format(payload[1]?.value)}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>{chartName}</CardTitle>
                <CardDescription>{chartName} của hôm nay và hôm qua:</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="order" fill={color1} name="Số lượng đơn" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="revenue" fill={color2} name="Giá trị" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none text-[#2eb88a]">
                    Tăng 5.2% so với hôm qua <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    );
};

export default MultipleBarChartComponent;
