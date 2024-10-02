'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement } from 'chart.js';

Chart.register(LinearScale, CategoryScale, BarElement);

const topProducts = [
    { name: 'Product A', revenue: 1000000000 },
    { name: 'Product B', revenue: 900000000 },
    { name: 'Product C', revenue: 800000000 },
    { name: 'Product D', revenue: 700000000 },
    { name: 'Product E', revenue: 600000000 },
    { name: 'Product F', revenue: 500000000 },
    { name: 'Product G', revenue: 400000000 },
    { name: 'Product H', revenue: 300000000 },
    { name: 'Product I', revenue: 200000000 },
    { name: 'Product J', revenue: 100000000 },
];

const HorizontalBarChart: React.FC = () => {
    const [productNames, setProductNames] = useState<string[]>([]);
    const [revenueData, setRevenueData] = useState<number[]>([]);

    useEffect(() => {
        setProductNames(topProducts.map((product) => product.name));
        setRevenueData(topProducts.map((product) => product.revenue));
    }, []);

    const data = {
        labels: productNames,
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: revenueData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: (tickValue: string | number) => {
                        const value = typeof tickValue === 'string' ? parseInt(tickValue) : tickValue;
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumSignificantDigits: 2,
                        }).format(value);
                    },
                },
                min: 0,
                max: 1000000000,
            },
            y: {
                ticks: {
                    autoSkip: false,
                },
            },
        },
    };

    return (
        <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] xl:h-[400px] px-3">
            <Bar className='w-full' data={data} options={options} />
        </div>
    );
};

export default HorizontalBarChart;
