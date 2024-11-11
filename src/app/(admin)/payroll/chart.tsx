'use client';

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const porterChartData = [
    { month: '7', Tấn: 186, mobile: 80 },
    { month: '8', Tấn: 305, mobile: 200 },
    { month: '9', Tấn: 237, mobile: 120 },
    { month: '10', Tấn: 73, mobile: 190 },
    { month: '11', Tấn: 120, mobile: 130 },
    { month: '12', Tấn: 214, mobile: 140 },
];
const driverChartData = [
    { month: '7', Tiền: 6000000, mobile: 80 },
    { month: '8', Tiền: 6000000, mobile: 200 },
    { month: '9', Tiền: 6000000, mobile: 120 },
    { month: '10', Tiền: 4000000, mobile: 190 },
    { month: '11', Tiền: 1600000, mobile: 130 },
    { month: '12', Tiền: 0, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-3))',
    },
    mobile: {
        label: 'Mobile',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

export function PorterChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Số tấn theo từng tháng</CardTitle>
                <CardDescription>
                    Số tấn đã bốc/dỡ từ Tháng 6 - Tháng 12 2024
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={porterChartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="Tấn"
                            type="natural"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={{
                                fill: 'var(--color-desktop)',
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function DriverChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Số tiền lương theo từng tháng</CardTitle>
                <CardDescription>
                    Số tiền lương từ Tháng 6 - Tháng 12 2024
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={driverChartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="Tiền"
                            type="natural"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={{
                                fill: 'var(--color-desktop)',
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
