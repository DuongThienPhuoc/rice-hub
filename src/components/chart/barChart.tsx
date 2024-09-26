'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement } from 'chart.js';
import dayjs from 'dayjs';

Chart.register(LinearScale, CategoryScale, BarElement);

const generateRandomRevenue = () => {
    return Math.floor(Math.random() * (1000000000 - 100000000) + 100000000);
};

const BarChart: React.FC = () => {
    const [days, setDays] = useState<string[]>([]);
    const [revenueData, setRevenueData] = useState<number[]>([]);

    useEffect(() => {
        const currentMonthDays = dayjs().daysInMonth();
        const currentMonthDates = Array.from({ length: currentMonthDays }, (_, index) => (index + 1).toString());
        setDays(currentMonthDates);

        const randomRevenue = currentMonthDates.map(() => generateRandomRevenue());
        setRevenueData(randomRevenue);
    }, []);

    const data = {
        labels: days,
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: revenueData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
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
        },
    };

    return (
        <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] xl:h-[400px] px-3">
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
