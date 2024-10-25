"use client"

import * as React from "react"
import { Pie, PieChart, Label, Tooltip, ResponsiveContainer } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const generateRandomData = () => {
    return Math.floor(Math.random() * (10000000 - 1000000) + 1000000);
};

const chartData = [
    { category: "Gạo", revenue: generateRandomData(), fill: "#e23670" },
    { category: "Thóc", revenue: generateRandomData(), fill: "#2662d9" },
    { category: "Ngô", revenue: generateRandomData(), fill: "#2eb88a" },
    { category: "Cám", revenue: generateRandomData(), fill: "#af57db" },
    { category: "Thức ăn chăn nuôi", revenue: generateRandomData(), fill: "#e88c30" },
]

function formatCurrency(value: number) {
    if (value < 1_000) return `${value} VNĐ`;
    if (value < 1_000_000) return `${(value / 1_000).toFixed(0)} nghìn VNĐ`;
    if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(0)} triệu VNĐ`;
    return `${(value / 1_000_000_000).toFixed(0)} tỷ VNĐ`;
}

const DonutChartComponent: React.FC<{ chartName: string }> = ({ chartName }) => {
    const totalRevenue = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.revenue, 0)
    }, [])

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>{chartName}</CardTitle>
                <CardDescription>{chartName} của 5 tháng gần nhất:</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart >
                        <Tooltip
                            formatter={(value: number) =>
                                `${new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                    maximumSignificantDigits: 2,
                                }).format(value)}`
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey="revenue"
                            nameKey="category"
                            className="focus:border-none focus:outline-none"
                            innerRadius={60}
                            outerRadius={110}
                            fill="#82ca9d"
                            strokeWidth={5}
                        >
                            <Label
                                position="center"
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-lg font-bold"
                                                >
                                                    {formatCurrency(totalRevenue)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-[14px]"
                                                >
                                                    Tổng doanh thu
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Nguồn thu chủ yếu đến từ
                </div>
                <div className="leading-none text-muted-foreground">
                    Hiển thị tỉ lệ nguồn thu của 5 tháng gần nhất
                </div>
            </CardFooter>
        </Card>
    )
}
export default DonutChartComponent;
