import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lịch sử đơn hàng',
    description: 'Lịch sử đơn hàng',
};

export default function OrderPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
