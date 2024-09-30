'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarElement } from 'chart.js';
import dayjs from 'dayjs';

Chart.register(LinearScale, CategoryScale, BarElement);

const generateRandomRevenue = () => {
    return Math.floor(Math.random() * (1000000000 - 100000000) + 100000000);
};

const BarChart: React.FC<{ period: string }> = ({ period }) => {
    const [labels, setLabels] = useState<string[]>([]);
    const [revenueData, setRevenueData] = useState<number[]>([]);

    useEffect(() => {
        let periodLabels: string[] = [];
        let periodData: number[] = [];

        switch (period) {
            case 'week':
                periodLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
                periodData = Array.from({ length: 7 }, () => generateRandomRevenue());
                break;

            case 'month':
                const currentMonthDays = dayjs().daysInMonth();
                periodLabels = Array.from({ length: currentMonthDays }, (_, index) => (index + 1).toString());
                periodData = periodLabels.map(() => generateRandomRevenue());
                break;

            case 'year':
                periodLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
                periodData = Array.from({ length: 12 }, () => generateRandomRevenue());
                break;
        }

        setLabels(periodLabels);
        setRevenueData(periodData);
    }, [period]);

    const data = {
        labels,
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
