/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Skeleton } from '@mui/material';

interface ChartData {
    label: string;
    order: number;
    revenue: number;
    scale: number;
}

const MultipleBarChartComponent: React.FC<{ chartName: string; color1: string; color2: string; data: any; loading: any }> = ({ chartName, color1, color2, data, loading }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (data?.previous?.totalPrice || data?.current?.totalPrice) {
            const previousScale = Math.pow(10, Math.floor(Math.log10(data?.previous?.totalPrice || 1)));
            const currentScale = Math.pow(10, Math.floor(Math.log10(data?.current?.totalPrice || 1)));

            const periodData: ChartData[] = [
                {
                    label: 'Hôm qua',
                    order: data?.previous?.number || 0,
                    scale: previousScale,
                    revenue: data?.previous?.totalPrice / previousScale || 0,
                },
                {
                    label: 'Hôm nay',
                    order: data?.current?.number || 0,
                    scale: currentScale,
                    revenue: data?.current?.totalPrice / currentScale || 0,
                },
            ];

            setChartData(periodData);
        }
    }, [data]);

    interface CustomTooltipProps {
        active?: boolean;
        payload?: { name: string; value: number; payload: ChartData }[];
    }

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const revenueScale = payload[1]?.payload?.scale || 1;
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    <p style={{ margin: 0 }}>
                        <span className="text-[#0090d9]">
                            Số lượng đơn: {payload[0]?.value} {chartName.toLowerCase()}
                        </span>
                        <br />
                        <span className="text-[#e23670]">
                            Giá trị: {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            }).format(payload[1]?.value * revenueScale)}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="mt-10">
            <CardHeader>
                {loading === true ? (
                    <div className='space-y-2'>
                        <Skeleton variant="rectangular" animation="wave" width="100px" height={20} />
                        <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                    </div>
                ) : (
                    <>
                        <CardTitle>{chartName}</CardTitle>
                        <CardDescription>{chartName} của hôm nay và hôm qua:</CardDescription>
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
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="order" fill={color1} name="Số lượng đơn" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="revenue" fill={color2} name="Giá trị" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {(() => {
                    const previousValue = data?.previous?.totalPrice || 0;
                    const currentValue = data?.current?.totalPrice || 0;

                    let percentageChange = 0;
                    if (previousValue > 0) {
                        percentageChange = ((currentValue - previousValue) / previousValue) * 100;
                    }

                    return (
                        loading ? (
                            <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                        ) : (
                            <div
                                className={`flex gap-2 font-medium leading-none ${percentageChange >= 0 ? 'text-[#2eb88a]' : 'text-[#e23670]'
                                    }`}
                            >
                                {percentageChange >= 0 ? (
                                    <>
                                        Tăng {percentageChange.toFixed(2)}% so với hôm qua <TrendingUp className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        Giảm {Math.abs(percentageChange).toFixed(2)}% so với hôm qua <TrendingDown className="h-4 w-4" />
                                    </>
                                )}
                            </div>
                        )
                    );
                })()}
            </CardFooter>
        </Card>
    );
};

export default MultipleBarChartComponent;
