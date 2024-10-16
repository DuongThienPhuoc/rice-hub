import React from 'react';
import Navbar from '@/components/navbar/navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đặt hàng',
    description: 'Hệ thống đặt hàng',
};

export default function OrderPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <Navbar />
            {children}
        </main>
    );
}
