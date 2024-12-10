/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Skeleton } from "@mui/material";

interface RowData {
    [key: string]: any;
}

const colors = ["#e23670", "#0090d9", "#2eb88a", "#af57db", "#e88c30"];

function formatCurrency(value: number) {
    if (value < 1_000) return `${value} VNĐ`;
    if (value < 1_000_000) return `${(value / 1_000).toFixed(0)} nghìn VNĐ`;
    if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(0)} triệu VNĐ`;
    return `${(value / 1_000_000_000).toFixed(0)} tỷ VNĐ`;
}

const DonutChartComponent: React.FC<{ chartName: string, data: any, loading: boolean }> = ({ chartName, data, loading }) => {
    const chartData = data?.topCategories?.map((item: RowData, index: number) => {
        return {
            category: item.categoryName,
            revenue: item.totalQuantity,
            fill: colors[index % colors.length]
        }
    })

    const topCategory = data?.topCategories?.reduce((maxItem: RowData | null, currentItem: RowData) => {
        return maxItem === null || currentItem.quantity > maxItem.quantity ? currentItem : maxItem;
    }, null);

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
            <CardContent className="flex-1 pb-0">
                {loading ? (
                    <Skeleton variant="rectangular" animation="wave" width="100%" height={300} />
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart >
                            <Tooltip
                                formatter={(value: number) =>
                                    `${value} kg`
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
                                                        {formatCurrency(data?.totalAmount)}
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
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {loading ? (
                    <>
                        <Skeleton variant="rectangular" animation="wave" width="150px" height={16} />
                        <Skeleton variant="rectangular" animation="wave" width="300px" height={16} />
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {topCategory
                                ? `Nguồn thu chủ yếu đến từ "${topCategory.categoryName}"`
                                : "Không có dữ liệu về nguồn thu chủ yếu."}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Hiển thị tỉ lệ nguồn thu của 5 tháng gần nhất
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
export default DonutChartComponent;